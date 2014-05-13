define([ 'humane' ], function(humane) {

	var themePath = 'js/humane/libnotify.css';

	var style = document.createElement('link');
	style.rel = 'stylesheet';
	style.type = 'text/css';
	style.href = themePath;
	document.querySelector('head').appendChild(style);

	return humane;

});
