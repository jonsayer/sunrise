<?php


// pw = is a password to prevent outsiders from modifying the javascript
// id = id of webcam
// tp = type of operation, either rejected, favorite, or caching an id
$pw = htmlspecialchars($_GET["pw"]);
//$id = preg_replace("/[^0-9]/", htmlspecialchars($_GET["id"]) );
$id = htmlspecialchars($_GET["id"]);
$tp = htmlspecialchars($_GET["tp"]);

if($pw == 'abracadabra' && ( $tp=='rejected' || $tp=='favorite' || $tp=='cached') ){
	if(($tp=='rejected' || $tp=='favorite') && strlen($id) == 10 && !preg_match('/[^0-9]/', $id)){
		if(strpos( file_get_contents($tp.'.js') , $id ) == false){
			$file = fopen($tp . '.js','a');
			fwrite($file , "\n" . $tp . 'Ids.push("' . $id . '");' . "\n");
			fclose($file);
			echo('Webcam id ' . $id . ' was added to ' . $tp . ' list.');
		} else {
			echo('That Id has already been saved.');
		}
	} elseif ( $tp=='cached' && !preg_match('/[^0-9,.-]/', $id)) {
		if( strpos( file_get_contents('cached.js') , $id ) == false ){
			$file = fopen('cached.js','a');
			fwrite($file , "\n" . $tp . '.push([' . $id . ']);' . "\n");
			fclose($file);
			echo('Webcam id ' . $id . ' was added to ' . $tp . ' list.');
		} else {
			echo('That camera has already been cached.');
		}
	} else {
		echo('Error: invalid parameters supplied. Invalid id or coords: ' . $id);
	}
} else {
	echo('Error: invalid parameters supplied. Wrong PW or TP');
}

?>
