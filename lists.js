// The iconic views are used when the Mode is 1 or "Iconic Views"
// These are meant to be things that I Jon Sayer say "that is cool" to

iconicViews.push('1292507849');// Targu Jiu Romania
iconicViews.push('1541926630');// Krimml Austria
iconicViews.push('1420893641');// Trafalgar Square
iconicViews.push('1165421984');// English Bay, Vancouver BC
iconicViews.push('1578000682');// Vancouver BC Ski Area
iconicViews.push('1186511145');// UW Red Square
iconicViews.push('1567484660');// Shanghai
iconicViews.push('1585157679');// Beijing
iconicViews.push('1521788187');// Arkhangelsk Russia
iconicViews.push('1567324125');// Ploiesti Romania
iconicViews.push('1252054110');// Brasov Romania
iconicViews.push('1261418327');// Sighisoara Romania
iconicViews.push('1206379396');// Sibiu Romania
iconicViews.push('1580909181');// San Pedro Belize
iconicViews.push('1183551354');// Golden Gate Bridge
iconicViews.push('1511036837');// San Francisco



// coordinates within these boxes contain no webcams and should not be suggested by the random coordinate generator
// filtering the randomly generated coordinates so that they don't include these coords reduces time spent waiting for APIs
// the first couplet is the NE corner of a box, the second couplet the SW corner

excludedCoords.push([51,-130,24,-180,'Northeast Pacific Ocean']);		
excludedCoords.push([5,-87,-90,-160,'Southeast Pacific Ocean & part of Antarctica']);		
excludedCoords.push([-78,180,-89,-180,'Antarctica excluding coast and South Pole']);	
excludedCoords.push([-80,180,-90,-179,'South Pole Reducer ']);	// (South Pole webcam shows up too often! This reduces likelihood significantly!)
excludedCoords.push([90,180,80,-180,'Arctic Ocean']);		
excludedCoords.push([90,-91,60,-109,'Northern Canada']);		
excludedCoords.push([80,180,61,97,'Siberia']);		 
excludedCoords.push([3,92,-64,61,'Indian Ocean']);			 
excludedCoords.push([-37,137,-62,-32,'Central Southern Ocean']);		
excludedCoords.push([49,180,-10,142,'Northwestern Pacific Ocean']);		
excludedCoords.push([27,32,3,-7,'Northern Africa']);			
excludedCoords.push([3,32,-19,-31,'Central Africa and Central Atlantic Ocean']);
excludedCoords.push([61,-15,42,-49,'Northern Atlantic Ocean']);		
excludedCoords.push([36,-28,10,-57,'Central Atlantic Ocean']);		
excludedCoords.push([41,221,10,-57,'Central Atlantic Ocean']);		
excludedCoords.push([36,-28,10,-57,'Central Atlantic Ocean']);	