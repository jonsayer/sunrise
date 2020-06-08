

/////************************************ SETUP FUNCTIONS ****************************

// preset variables
var APIkey = 'YOUR API KEY';
var localPW = 'abracadabra';
var webRoot = 'https://api.windy.com/api/webcams/v2/';

// searchType 0 = totally random, searchType 1 = terminator, searchtype 2 = sunrise
var searchType = 2

// items are added to these lists in a seperate files
var iconicViews 	= [];
var excludedCoords 	= [];
var rejectedIds 	= [];
var favoriteIds 	= [];

var daMap;
var camMarker;

var lastXWebcamIds = []

// default allowed categories (can reject traffic and airport cameras)
var categories = 'area,bay,beach,building,camping,city,coast,forest,harbor,resort,island,lake,marketplace,mountain,other,landscape,park,pool,indoor,sportarea,square,underwater,water'

class webcam {
	constructor(img, locName, lat, lng, linkypoo) {
		this.img = img;
		this.locName = locName;
		this.lat = lat;
		this.lng = lng;
		this.linkypoo = linkypoo;
	}
}

/////************************************ Sunrise Lat/Lang Generators ****************************

// returns a random point along Earth's sunrise-facing terminator
function getRandomSunrisePoint(){
	var northBearing = 360-(getSolarDeclination())
	var southBearing = (getSolarDeclination())+180
	var bearing = Math.floor(Math.random() * (northBearing - southBearing) + southBearing);
	if(bearing > 360){
		// it is on the wintery side of the year, and we are angling a little easterly
		bearing = bearing - 360
	}
	return getTerminatorPoint(bearing)
}

// verify that these are real coordinates and if they are not, correct them
function ensureRealPoint(coords){
	var lat;
	var lng
	if(coords[0] < -90){
		// We have wrapped around the south pole!
		lat = -90 + ( Math.abs( coords[0] ) - 90 )
	} else if(coords[0] > 90){
		// We have wrapped around the north pole!
		lat = 90 - (coords[0] - 90)
	} else {
		lat = coords[0]
	}
	if(coords[1] < -180){
		// We have wrapped around to east hemisphere!
		lng = 180 - ( Math.abs( coords[1] ) - 180 )
	} else if(coords[1] > 180){
		// We have wrapped around the west hemisphere!
		lng = -180 + (coords[1] - 180)
	} else {
		lng = coords[1]
	}
	return [lat,lng]
}

// These two functions get a point at the south and north end of the terminator
function getSouthSunrisePoint(){
	var bearing = (-1*getSolarDeclination())+180
	return getTerminatorPoint(bearing);
}

function getNorthSunrisePoint(){
	var bearing = 360-(-1*getSolarDeclination())
	// it is on the wintery side of the year
	if(bearing > 360){
		bearing = bearing - 360
	}
	return getTerminatorPoint(bearing);
}

function getRandomTerminatorPoint(){
	var bearing = Math.floor(Math.random() * 360);
	return getTerminatorPoint(bearing);
}

// Start code stolen from internet
/*!
 * JavaScript function to calculate the destination point given start point latitude / longitude (numeric degrees), bearing (numeric degrees) and distance (in m).
 *
 * Original scripts by Chris Veness
 * Taken from http://movable-type.co.uk/scripts/latlong-vincenty-direct.html and optimized / cleaned up by Mathias Bynens <http://mathiasbynens.be/>
 * Based on the Vincenty direct formula by T. Vincenty, “Direct and Inverse Solutions of Geodesics on the Ellipsoid with application of nested equations”, Survey Review, vol XXII no 176, 1975 <http://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf>
 */
function toRad(n) {
 return n * Math.PI / 180;
};
function toDeg(n) {
 return n * 180 / Math.PI;
};
function destVincenty(lat1, lon1, brng, dist) {
 var a = 6378137,
     b = 6356752.3142,
     f = 1 / 298.257223563, // WGS-84 ellipsiod
     s = dist,
     alpha1 = toRad(brng),
     sinAlpha1 = Math.sin(alpha1),
     cosAlpha1 = Math.cos(alpha1),
     tanU1 = (1 - f) * Math.tan(toRad(lat1)),
     cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)), sinU1 = tanU1 * cosU1,
     sigma1 = Math.atan2(tanU1, cosAlpha1),
     sinAlpha = cosU1 * sinAlpha1,
     cosSqAlpha = 1 - sinAlpha * sinAlpha,
     uSq = cosSqAlpha * (a * a - b * b) / (b * b),
     A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq))),
     B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq))),
     sigma = s / (b * A),
     sigmaP = 2 * Math.PI;
 while (Math.abs(sigma - sigmaP) > 1e-12) {
  var cos2SigmaM = Math.cos(2 * sigma1 + sigma),
      sinSigma = Math.sin(sigma),
      cosSigma = Math.cos(sigma),
      deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) - B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
  sigmaP = sigma;
  sigma = s / (b * A) + deltaSigma;
 };
 var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1,
     lat2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1, (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp)),
     lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1),
     C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha)),
     L = lambda - (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM))),
     revAz = Math.atan2(sinAlpha, -tmp); // final bearing
 return [ toDeg(lat2), lon1 + toDeg(L) ];
};

// End code stolen from internet

function getTerminatorPoint(angle){
	// as I am dumb I am using someone else's function for this
	const sp = pointWhereSunOverhead()
	return destVincenty(sp[0], sp[1], angle, $('#terminatorDistance').val())
}

function pointWhereSunOverhead(){
	// returns approx lat and long where the sun is currently overhead
	return [ getSolarDeclination() , getNoonLongitude() ]
}

function getSolarDeclination(){
	return 23.44 * Math.sin( (360 / 365.25) * getDayOfYear() * Math.PI/180 )
}

function getDayOfYear(){
	var now = new Date();
	var start = new Date(now.getFullYear(), 0, 0);
	var diff = now - start;
	var oneDay = 1000 * 60 * 60 * 24;
	var dayOfYear = Math.floor(diff / oneDay);
	/*if(dayOfYear >= 355){
		return dayOfYear - 355
	} else {
		return dayOfYear + 10
	}*/
	return dayOfYear + 284
}

function getNoonLongitude(){
	// calculate the longitude of noon right now
	var d = new Date()
	// There's a hole in the world like a great black pit
	// and the vermin of the world inhabit it
	// and its morals aren't worth what a pig could spit
	// and it goes by the name of
	var London = d.toISOString()
	var LondonMinutes = Number( London.split(":")[1] )
	var LondonHours = Number( London.split(":")[0].slice(-2) )
	var minutesFromNoon = 0;
	if(LondonHours >= 12){
		minutesFromNoon = -1 * (((LondonHours-12) * 60)+LondonMinutes)
	} else {
		minutesFromNoon = ((11 - LondonHours) * 60)+( 60 - LondonMinutes )
	}
	// the difference in minutes between noon london time and now is 1/4 the longitude of global noon, more or less
	return minutesFromNoon / 4
}

// Generates random coordinates along the sunrise terminator, 
// but filters out large areas where there are no webcams to save API time
function sunriseLatLangFiltered(){
	var coords = getRandomSunrisePoint()
	while (rejectCoords(coords)){
		coords = getRandomSunrisePoint()
	}
	return coords;
}

// Generates random coordinates along the terminator, 
// but filters out large areas where there are no webcams to save API time
function terminatorLatLangFiltered(){
	var coords = getRandomTerminatorPoint()
	while (rejectCoords(coords)){
		coords = getRandomTerminatorPoint()
	}
	return coords;
}



/////************************************ Random Lat/Lang Generators ****************************

// Generates random coordinates on earth
function randomLatLang(){
	let lat = Math.random()*180 - 90
	let lng = Math.random()*360 - 180
	lat = Math.floor(lat*100) / 100
	lng = Math.floor(lng*100) / 100
	return [ lat,lng ];
}

// returns true if coords are in one of our rejected zones
function rejectCoords(coords){
	var returnValue = false;
	for(var i = 0; i < excludedCoords.length; i++){
		if( excludedCoords[i][0] > coords[0] && coords[0] > excludedCoords[i][2] && excludedCoords[i][1] > coords[1] && coords[1] > excludedCoords[i][3] ){
			returnValue = true
			console.debug('had to rejct the coords '+coords+' bc they fall in the rejected zone ' +excludedCoords[i][4])
			break
		}
	}
	return returnValue;
}

// Generates random coordinates, but filters out large areas where there are no webcams to save API time
function randomLatLangFiltered(){
	var coords = randomLatLang()
	while (rejectCoords(coords)){
		coords = randomLatLang()
	}
	return coords;
}

// determine the method to use to get our coordinates
function decideCoordMode(count){
	var method = Number($('#mode').val())
	if(count >= $('#autoDegradeRate').val()*2){
		method = method - 2
	} else if (count >= $('#autoDegradeRate').val() ){
		method--
	}
	return method
}

// determine the string used to describe the current search mode
function decideModeString(count){
	var method = Number($('#mode').val())
	if(method == 0){ 
		return 'Iconic Cams'
	} else if(method == 1){ 
		return 'Favorites'
	} else {
		method = decideCoordMode(count)
		switch(method) {
			case 4:
				return 'Sunrise';
			case 3:
				return 'Terminator';
			case 2:
				return 'Random';
			default:
				return 'Random'
		}
	}
}

// This is controlled by all functions that actually call for a random coordinate, changes coordinate generator based on current settings
function getFilteredCoordsByCurrentSearchType(count){
	var method = decideCoordMode(count)
	if(method == 4){
		return sunriseLatLangFiltered()
	}else if(method == 3){
		return terminatorLatLangFiltered()
	} else if(method == 2){
		return randomLatLangFiltered();
	} else {
		// returning 0,0 is a known signal that means "this is not a real coordinate!"
		return [0,0];
	}
}

/////************************************ WEBCAM API FUNCTIONS ****************************

function checkLastXandRejects(id){
	var returnValue = false
	// check the last X webcams and make sure the one we have isn't one we've had lately
	for(var i = 0 ; i < lastXWebcamIds.length ; i++){
		if(lastXWebcamIds[i] == id){
			returnValue = true
			break
		}
	}
	while(lastXWebcamIds.length >= $('#pointsToRemember').val()){
		lastXWebcamIds.shift()
	}
	// check reject list and make sure this isn't one we've decided we don't like
	if(returnValue == false && rejectedIds.length > 0){
		for(var i = 0 ; i < rejectedIds.length ; i++){
			if(rejectedIds[i] == id){
				returnValue = true
				break
			}
		}
	}
	return returnValue
}

// returns a webcam from the iconic list
function getIconicOrFaveWebcam(){
	var selectedList;
	if( Number($('#mode').val()) == 0){
		selectedList = iconicViews
	} else {
		selectedList = favoriteIds
	}
	
	let found = false
	let id = selectedList[ Math.floor(Math.random() * selectedList.length) ]
	while(checkLastXandRejects(id)==true){
		id = selectedList[ Math.floor(Math.random() * selectedList.length) ]
	}
	
	let queryString = webRoot+'list/webcam='+id+'?key='+APIkey+'&show=webcams:image,location;categories'
	console.log( 'calling: ' + queryString);
	return doWebcamQuery(queryString)
}

// retrieves data from API and builds webcam object
function webcamQuery(lat, lng, radius){
	let queryString = webRoot+'list/nearby='+lat+','+lng+','+radius+'?key='+APIkey+'&show=webcams:image,location;categories&orderby=distance&categories='+categories;
	console.log( 'calling: ' + queryString);
	return doWebcamQuery(queryString)
}

function doWebcamQuery(queryString){
	return new Promise(function(resolve,reject) {
		$.getJSON({
			url:queryString,
			success (data) {
				console.log( data );
				if(data.status == 'OK'){
					console.log( 'Server responded with '+data.result.total+' webcams')
					if(data.result.total >= 1){
						console.log( 'Begin looping through webcams')
						let resolved = false;
						for(let i = 0; i < data.result.total; i++ ){
							console.log( 'i = '+i)
							let webcamData =  data.result.webcams[i]
							if(webcamData.status == 'active'){
								// temporarily excluding favorites and iconics from last 10 filters b/c we don't have a way of getting a new one
								if(checkLastXandRejects(webcamData.id) == false || Number($('#mode').val()) == 0 || Number($('#mode').val()) == 1 ){
									console.log( 'Webcam is being set to '+webcamData.id)
									lastXWebcamIds.push(webcamData.id)
									var name = formatWebcamName(webcamData);
									var linkypoo = ''
									if(webcamData.location.wikipedia != null){
										linkypoo = webcamData.location.wikipedia
									}
									webcamR = new webcam(webcamData.image.current.preview.replace('preview','full')  ,name,webcamData.location.latitude,webcamData.location.longitude,linkypoo);
									resolved = true;
									resolve(webcamR);
									break;
								} else {
									console.log( 'We have seen webcam '+webcamData.id+' lately. Skipping...')//
									continue
								}
							} else {
								console.log( 'Webcam is inactive. Skipping...')
								continue;
							}
						}
						// if we reach this line, there are no active webcams
						if(resolved == false){
							console.log( 'All webcams in query are inactive or recently seen')
							resolve(null);
							//reject();
							//return null;
						}
						
					} else {
						console.log( 'No webcams in query area')
						resolve(null);
						//return null;
						//reject();
					}
				} else {
					resolve(null);
					console.log( 'Server did not respond')
					//reject();
					//return null;
				}
			}
		});
	});
}

// Takes the name provided by the API and tries to make it not suck
function formatWebcamName(input){
	let name = '';
	let country = input.location.country;
	
	if(country == null || country.includes('null') || country.includes('unknown')  || input.location.city.includes('unknown') ){
		// build this 'Antarctica style'
		name = input.title
	} if(country == 'Canada' || country == 'United States'){
		// build with a city or province in the name
		name = input.location.city+', '+input.location.region+', '+country
	} else {
		//city and country
		name = input.location.city+', '+country
	}
	if(name.includes('unknown')){
		return input.title
	} else {
		return name;
	}
	
}

// Render a wiki link in the title of the webcam location if one is provided
function renderLink(linkURL,linkText){
	// this funtion is mostly disabled for the moment. It doesn't make sense given the Pi art piece I am imagining. 
	// needs an SMS function to it, but I need to figure out the pricing on that for myself
	/*if(linkURL == null || linkURL == ''){
		return linkText
	} else {
		return '<a href="'+linkURL+'" target="_new">'+linkText+'</a>'
	}*/
	return linkText
}

// when supplied with the URL of the image from the API, this returns the ID of the webcam
function getWebcamIdFromIMG(img){
	return img.substring(img.length-14, img.length).replace('.jpg','')
}

//main function that is called by our loops and clicks
async function getWebcam() {
	$('#tardis').show()
	var webcamR ;
	let found = false;
	if(mode == '0'){
		webcamR = await getIconicOrFaveWebcam()
		console.log('show iconic webcam !');
		showNewWebCam(webcamR,count);
		found = true
	}
	// to do: if Mode = 1 return favorites
	let count = 1;
	while (found == false){
		let coords = ensureRealPoint( getFilteredCoordsByCurrentSearchType(count) )
		if(coords[0] == 0 && coords[1] == 0){
			webcamR = await getIconicOrFaveWebcam()
			console.log('coords are null, went and got an iconic webcam instead');
			showNewWebCam(webcamR,count);
			found = true
			continue
		}
		console.log( coords );
		console.log( 'Try #'+count)
		webcamR = await webcamQuery(coords[0], coords[1], $('#searchRadius').val())
		if(webcamR == null){
			console.log( 'No webcams found... try again')
			coords = ensureRealPoint( getFilteredCoordsByCurrentSearchType(count) )
			if(coords = null){
				webcamR = await getIconicOrFaveWebcam()
				found = true
				showNewWebCam(webcamR,count);
			}
			console.log('trying new coordinates: ' + coords)
			count++;
		} else {
			found = true;
			console.log('we have a webcam!');
			showNewWebCam(webcamR,count);
		}
	}
	
}

/////************************************MAP FUNCTIONS ****************************

function makePin(lat,lng){
	return new ol.layer.Vector({
		source: new ol.source.Vector({
			features: [
				new ol.Feature({
					geometry: new ol.geom.Point(ol.proj.fromLonLat([lng, lat]))
				})
			]
		})
	});
}

// both moves the pin and sets the date/time for the day/night line
function moveMap(lat,lng){
	map.getView().setCenter(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'));
	map.getView().setZoom(2);
    if (pin) {
		map.removeLayer(pin);
	} 
	pin = makePin(lat,lng)
	map.addLayer(pin);
	if (dayNightLayer) {
		map.removeLayer(dayNightLayer);
	} 
	dayNightVector = new ol.source.DayNight({ });
	dayNightLayer = new ol.layer.Vector({
		source: dayNightVector,
		opacity: .5,
		style: new ol.style.Style({
			fill: new ol.style.Fill({
				color: [0,0,0]
			})
		})
	})
	map.addLayer(dayNightLayer);
}

function showNewWebCam(webcamInput,tries){
	moveMap(webcamInput.lat,webcamInput.lng)
	$('#webcamContainer').attr("src",webcamInput.img);
	$('#webcamLocation').html(renderLink(webcamInput.linkypoo,webcamInput.locName));
	$('#webcamcoord').html(webcamInput.lat + ', ' +webcamInput.lng);
	$('#methodResult').html(' - '+decideModeString(tries));
	$('#tardis').hide()
}

function getNewWebcamTimeout() {
    setTimeout(function () {
        getWebcam()
        getNewWebcamTimeout()
    }, ($('#refreshFrequency').val()*60000) );
}

/////************************************ UI controls ****************************

function updateTextInput(val,targetId) {
	$(targetId).html(val)
}

// sends request to local php file to add id to rejected webcams
function rejectWebcam(){
	if( confirm("Are you sure you want to reject this webcam and never see it again?") ){
		var rId = getWebcamIdFromIMG(  $('#webcamContainer').attr('src') )
		rejectedIds.push(rId)
		console.log('sending request to localhost...')
		$.ajax({
			url: 'http://localhost/randomWebcam/modify_favs_and_rejects.php',
			data: {"tp" : 'rejected',"pw" : localPW, "id" : rId},
			success: function(response){
				alert(response)
			},
			cache: false,
			type: 'GET'
		});
		getWebcam()
	}
}

// sends request to local php file to add id to favorite webcams
function favoriteWebcam(){
	if( confirm("Are you sure you want to add this webcam to your favorites?") ){
		var fId = getWebcamIdFromIMG(  $('#webcamContainer').attr('src') )
		favoriteIds.push( fId )
		console.log('sending request to localhost...')
		$.ajax({
			url: 'http://localhost/randomWebcam/modify_favs_and_rejects.php',
			data: {"tp" : 'favorite',"pw" : localPW, "id" : fId},
			success: function(response){
				alert(response)
			},
			cache: false,
			type: 'GET'
		});
	}
}

/////************************************ Code that runs when page loads ****************************

$(document).on("click", '#webcamContainer', function() {
	getWebcam()
});

$(document).on("click", '#reject', function() {
	rejectWebcam()
});
$(document).on("click", '#fav', function() {
	favoriteWebcam()
});

$(document).on("click", '#settingsTrigger', function() {
	$('#settings').toggle()
});
