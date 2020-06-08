# sunrise

This is a webpage for showing a random webcam from somewhere on Earth that is currently experiencing a sunrise. It is meant to just run on an extra screen or a raspberry pi as a force for connecting one to the world, a reminder that there is always a place where a new day is being born.

The page is configured to run on a raspberry pi 7-inch touchscreen (because that is how I am running it!) hence it looks best on a 800x480 screen or window. 

*This is not meant to run on a public-facing website and is not secure enough to do so.* 

## Instructions

1. Go here and get yourself a free API key: https://api.windy.com/webcams
2. Plug the API key into line 8 of scrypt.js

At this point, you should be ready to just run the page in your browser. However, in order to save your favorites and such it should be running on a web server with PHP, ideally not accessible beyond localhost. 

## Stuff I from around the net that makes this work that I've included in this repository

- Twitter emoji font: https://twemoji.twitter.com/
- Sninnaker Google Font: https://fonts.google.com/specimen/Spinnaker
- Settings icon is from https://www.iconfinder.com/
- Tardis icon from here: https://ya-webdesign.com/imgdownload.html
- Openlayers extensions: https://viglino.github.io/ol-ext/
