/*
 * Inspired by https://github.com/francescolaffi/elastic-google-io-slides/blob/master/js/slide-elastic.js
 */
(function() {

	var container = document.getElementsByTagName('slides')[0];
	var slide = document.getElementsByTagName('slide')[0];

	var resize = function() {
		var transform;
		if (window.innerWidth < slide.offsetWidth
				|| window.innerHeight < slide.offsetHeight) {
			var sx = window.innerWidth / slide.offsetWidth;
			var sy = window.innerHeight / slide.offsetHeight;
			transform = 'scale(' + Math.min(sx, sy) + ')';
		} else {
			transform = 'none';
		}

		container.style.MozTransform = transform;
		container.style.WebkitTransform = transform;
		container.style.OTransform = transform;
		container.style.msTransform = transform;
		container.style.transform = transform;
	};

	window.addEventListener('resize', resize);
	resize();

})();
