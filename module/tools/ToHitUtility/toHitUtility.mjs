

/**
	 * Render Scene Controls Hook
	 */
Hooks.on("renderSceneControls", async (app, html, data) => {
	console.log("we rendering");

	const controlButtonIcon = `systems/western-iv/module/tools/ToHitUtility/motion_tracker_ico.webp`;
	const mtButtonHtml = await renderTemplate(`systems/western-iv/module/tools/ToHitUtility/menu_button.html`, { controlButtonIcon });

	const mainControls = html.find(".control-tools.main-controls");

	if (!mainControls?.length) return;

	mainControls.append(mtButtonHtml);
	const mtButton = html.find(".control-tools.main-controls li[data-control='shoot-tracker']");

	mtButton
		.on("click", event => {
			const mtButton = html.find(".control-tools.main-controls li[data-control='shoot-tracker']");

			// game.shooting_tracker.openCloseListeners.push(function (_isOpen) {
			// 	if (_isOpen) {
			// 		mtButton.addClass('active');
			// 	}
			// 	else {
			// 		mtButton.removeClass('active');
			// 	}
			// });
			// game.shooting_tracker.toggle({});
			game.shoot_tracker.toggle({});
		}
		)
		//.on("contextmenu", event => ui.resetPosition(event))
		;
	return;
});

Hooks.on('init', () => {
	// settings.registerSettings((data)=>
	// {
	// 	if(game.motion_tracker)
	// 	{
	// 		game.motion_tracker.resize(data);
	// 	}
	// });

	if (game.shoot_tracker === undefined || game.shoot_tracker === null) {
		console.log("make shoot tracker")
		game.shoot_tracker = new ShootTracker();
	}
});

class ShootTracker {
	constructor() {
		this.window = null;
		this.openCloseListeners = [];
		//this.useFakeSignals = MotionTracker.CONFIG.general.useFakeSignals;
		//this.enableFastTokenChange = MotionTracker.CONFIG.general.enableFastTokenChange;
		//this.enableInverseStatus = MotionTracker.CONFIG.general.enableInverseStatus;
		this._buildWindow();
		// this._initListeners();
		// this._welcomeMessage();
	}
	_buildWindow() {
		this.window = new ShootingTrackerWindow(this);
		console.log(this.window)
		this.currentCanvasPosition = 1;
		this.currentUseHighDPI = true;
	}

	async open(user = game.user, ownerId = game.user.id, tokenId = this.window.tokenId, viewedScene = game.user.viewedScene, _data = undefined) {
		console.log(this.window)
		this.window.setData(user, ownerId, tokenId, viewedScene);
		await this.window.render(_data, true);
		// this.openCloseListeners.forEach(function(_callback)
		// {
		// 	_callback(true);
		// });
		return new Promise((resolve, reject) => {
			resolve();
		});
	}
	close() {
		this.window.close();
	}

	toggle() {
		if (this.window.rendered) {
			this.close(game.user.id);
			return false;
		}
		else {
			this.open();
			return true;
		}
	}


}

class ShootingTrackerWindow extends Application {
	constructor(_shootingTracker, options = {}) {
		super(options);
		this.shootingTracker = _shootingTracker;
		this.windowElement = null;
		this.canvas = null;
		this.device = null;
		this.user = null;
		this.ownerId = null;
		this.tokenId = null;
		this.viewedSceneId = null;
		this.playerVisibility = [];
	}

	static get defaultOptions() {
		return mergeObject(super.defaultOptions,
			{
				title: "Shooting",
				id: "shooting-tracker-window",
				template: "systems/western-iv/module/tools/ToHitUtility/toHitUtility.html",
				width: "800",
				height: "900"
			})
	}

	setData(user, ownerId, tokenId, sceneId) {
		this.user = user;
		this.ownerId = ownerId;
		this.tokenId = tokenId;
		this.viewedSceneId = sceneId;
		if (this.device !== null) {
			this.device.setData(this.user, this.tokenId, this.viewedSceneId);
		}
	}

	/******************************
	 * @override
	 ******************************/
	async _render(_data = undefined, ...args) {
		if (this.rendered)
			return;
		// Render the application and restore focus
		await super._render(...args);

		//const settingsData = game.settings.get(settings.REGISTER_CODE, 'settings');

		this.windowElement = this.element[0];
		//this.windowElement.className += ' motion-tracker-dialog'; // necessary for Weyland mod
		//this.windowElement.className += ' ' + settingsData.general.theme;
		this.canvas = this.element.find('#shooting-tracker-canvas')[0];
		// for (let i = 0; i < this.windowElement.children.length; ++i) {
		// 	this.windowElement.children[i].className += ' ' + settingsData.general.theme;
		// }
		//this.element.find('#motion-tracker-options')[0].className += ' ' + settingsData.general.theme;
		//this.canvas.className += ' ' + settingsData.general.theme;

		// content building
		//this.renderPlayerList();

		// style force
		//this.windowResetStyle();

		//let config = MotionTracker.ALL_CONFIG();
		//this.device = new MotionTrackerDevice(this.canvas, this.deviceIsReady.bind(this), config);
		// this.device.setData(this.user, this.tokenId, this.viewedSceneId);
		// if (_data.useFakeSignals !== undefined) {
		// 	this.device.bMakeFakeSignals = _data.useFakeSignals;
		// }
		// if (_data.applyGlitchScreen !== undefined) {
		// 	this.device.bApplyGlitchScreen = _data.applyGlitchScreen;
		// }
		// if (_data.fakedSignals !== undefined) {
		// 	this.device.fakeSignals = _data.fakedSignals;
		// }

		// if (this.ownerId === game.user.id) {
		// 	this.sendCommand(null, 'init');
		// }
		//this.sendCommand(game.user.id, 'open', 'notify');
	}
}



// initToHitUtility = () => {
// 	initilizeHooks();
// }
