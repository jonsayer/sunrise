<?php


$rejects = fopen('rejects.js','a');

// pw = is a password to prevent outsiders from modifying the javascript
// id = id of webcam
// tp = type of operation, either rejected or favorite
$pw = htmlspecialchars($_GET["pw"]);
//$id = preg_replace("/[^0-9]/", htmlspecialchars($_GET["id"]) );
$id = htmlspecialchars($_GET["id"]);
$tp = htmlspecialchars($_GET["tp"]);

if($pw == 'abracadabra' && ( $tp=='rejected' || $tp=='favorite' ) ){
	
	$file = fopen($tp . '.js','a');
	
	fwrite($file , "\n" . $tp . 'Ids.push("' . $id . '");' . "\n");
	
	fclose($file);
	
	echo('Webcam id ' . $id . ' was added to ' . $tp . ' list.');
	
} else {
	echo('Error: no action taken.');
}

?>
