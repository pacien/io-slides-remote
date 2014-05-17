require.config({
	paths : {
		'slide_config' : '../slide_config',
		'slide-controller' : 'slide-controller',
		'slide-deck' : 'slide-deck',
		'slide-elastic' : 'slide-elastic',

		'modernizr' : 'modernizr.custom.56571',
		'prettify' : 'prettify/prettify',
		'hammer' : 'hammer.min',

		'humane' : 'humane/humane.min',
		'humane-themed' : 'humane/humane-themed',

		'analytics' : 'https://www.google-analytics.com/ga',
	},

	shim : {
		'slide-deck' : {
			deps : ['slide_config', 'slide-controller', 'modernizr'],
		},
		'slide-elastic' : {
			deps : ['slide-deck'],
		},
	},
});

require(['slide-elastic']);
