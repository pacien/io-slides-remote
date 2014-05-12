require.config({
	paths : {
		'slide_config' : '../slide_config',
		'slide-controller' : 'slide-controller',
		'slide-deck' : 'slide-deck',

		'modernizr' : 'modernizr.custom.56571',
		'prettify' : 'prettify/prettify',
		'hammer' : 'hammer',
	},

	shim : {
		'slide-deck' : {
			deps : ['slide_config', 'slide-controller', 'modernizr', 'hammer']
		}
	}
});

require(['slide-deck', 'prettify'], function(someModule) {

});
