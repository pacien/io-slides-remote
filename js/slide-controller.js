/**
 * Remote control by:
 *
 * @authors Pacien TRAN-GIRARD
 */
(function(window) {

	var ORIGIN_ = location.protocol + '//' + location.host;

	function SlideController(deck) {
		this.deck = deck;

		this.mode = null;
		this.remoteSocket = null;
		this.isPresenter = window.opener;

		this.keyLock = null;

		this.setup();
	}


	SlideController.MODES = ['local', 'remote', 'controller'];

	SlideController.prototype.setup = function() {

		var self = this;

		// find the current mode
		var params = location.search.substring(1).split('&').map(function(el) {
			return el.split('=');
		});

		var paramKeys = params[0];

		SlideController.MODES.forEach(function(element, index, array) {
			if (paramKeys.indexOf(element) > -1) {
				self.mode = element;
				return;
			}
		});

		console.log("Control mode: " + this.mode);

		// clean the location bar
		// if (this.mode !== null) {
		// // localStorage.ENABLE_PRESENTOR_MODE = presentMe;
		// if (window.history.pushState) {
		// window.history.pushState({}, '', location.pathname);
		// } else if (window.history.replaceState) {
		// window.history.replaceState({}, '', location.pathname);
		// }
		// // else {
		// // location.replace(location.pathname);
		// // return false;
		// // }
		// }

		// activate the mode specific behaviour
		switch (this.mode) {

			case 'local':
				// Only open popup from main deck. Avoid recursive popupception.
				if (!this.isPresenter) {
					var opts = 'menubar=no,location=yes,resizable=yes,scrollbars=no,status=no';
					var localPresenter = window.open(location.href, 'mywindow', opts);

					// Loading in the popup? Turn the presenter mode on.
					localPresenter.addEventListener('load', function(e) {
						localPresenter.document.body.classList.add('with-notes');
					}.bind(this), false);

					window.addEventListener('message', this.onMessage_.bind(this), false);

					// Close popups if we reload the main window.
					window.addEventListener('beforeunload', function(e) {
						localPresenter.close();
					}.bind(this), false);
				}

				break;

			case 'controller':
				this.isPresenter = true;
				document.body.classList.add('popup');
				document.body.classList.add('with-notes');
				var password = prompt("Broadcaster password");

			case 'remote':
				var addr = this.deck.config_.settings.remoteSocket;
				var channel = this.deck.config_.settings.remoteChannel;
				var password = (password != null) ? password : '';

				require([addr + 'socket.io/socket.io.js'], function(io) {
					self.remoteSocket = io.connect(addr, {
						'query' : 'channel=' + channel + '&password=' + password,
						'force new connection' : true,
					});

					self.remoteSocket.on('connect', function() {
						var message = 'Connected to ' + channel + '@' + addr;
						console.log(message);
						alert(message);
					});

					self.remoteSocket.on('disconnect', function() {
						var message = 'Diconnected from' + channel + '@' + addr;
						console.log(message);
						alert(message);
					});

					self.remoteSocket.on('message', function(message) {
						console.log('Received from remote: ' + message);
						self.onMessage_({
							data : {
								keyCode : parseInt(message[0])
							}
						});
					});
				});

				break;

		}

		return true;
	};

	SlideController.prototype.onMessage_ = function(e) {

		var data = e.data;

		console.log("Received event: " + JSON.stringify(data));

		// Restrict messages to being from this origin. Allow local developmet
		// from file:// though.
		// TODO: It would be dope if FF implemented location.origin!
		if (this.mode === 'local' && e.origin != ORIGIN_ && ORIGIN_.indexOf('file://') != 0) {
			alert('Someone tried to postMessage from an unknown origin');
			return;
		}

		// if (e.source.location.hostname != 'localhost') {
		// alert('Someone tried to postMessage from an unknown origin');
		// return;
		// }

		if ('keyCode' in data) {
			if (isNaN(data.keyCode)) {
				return;
			}

			this.keyLock = data.keyCode;

			var evt = document.createEvent('Event');
			evt.initEvent('keydown', true, true);
			evt.keyCode = data.keyCode;
			document.dispatchEvent(evt);
		}
	};

	SlideController.prototype.sendMsg = function(msg) {

		if (msg.keyCode === this.keyLock) {
			this.keyLock = null;
			return;
		}

		console.log("Sending: " + JSON.stringify(msg));

		// // Send message to popup window.
		// if (this.localPresenter) {
		// this.localPresenter.postMessage(msg, ORIGIN_);
		// }

		// Send message to main window.
		if (this.isPresenter) {
			if (this.mode === 'local') {
				// TODO: It would be dope if FF implemented location.origin.
				window.opener.postMessage(msg, '*');
			}
			if (this.mode === 'controller') {
				this.remoteSocket.emit('message', msg.keyCode);
			}
		}
	};

	window.SlideController = SlideController;

})(window);
