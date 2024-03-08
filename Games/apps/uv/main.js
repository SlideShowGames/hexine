"use strict";

(async () => {

// default error handler
window.onerror = (message, src, lineno, colno, error) => {
	alert(`Error at "${src}", line ${lineno}:${colno}: \n${error}`, "Error");
};

Array.prototype.remove = function(element) {
	for (let i = 0; i < this.length; i++) {
		if (this[i] == element)
			this.splice(i, 1);
	}
};

// polyfill
const _timers = [];
window.setImmediate = (cb) => {
	let killed = false;
	function loop() {
		if (killed) return;
		cb.apply(void 0, []);
		requestAnimationFrame(loop);
	}
	loop();
	const id = _timers.length;
	_timers[id] = { kill: () => killed = true };
	return id;
};
window.clearImmediate = (id) => {
	const timer = _timers[id];
	if (timer != null) {
		timer.kill();
		delete _timers[id];
		return true;
	}
	return false;
};

const backgroundScreen = document.getElementById("background-screen");
const homeScreen = document.getElementById("home-screen");
const tomcatScreen = document.getElementById("tomcat-screen");
const backButton = document.getElementById("back");
const forwardButton = document.getElementById("forward");
const refreshButton = document.getElementById("refresh");
const addressBar = document.getElementById("address-bar");
const frameContainer = document.getElementById("frame-container");
const frame = document.getElementById("frame");
const overlay = document.getElementById("frame-overlay");

const location = new URL(window.location.href);
const nsw = window.navigator.serviceWorker;
const bingSearch = "https://www.bing.com/search?q=";
const googleSearch = "https://www.google.com/search?q=";
const googleSearchR = "https://www.google.com/search?btnI=Im+Feeling+Lucky&q=";

if (nsw != null && location.hostname != "localhost") {
	try {
		await nsw.register("/sw.js", {
			scope: "/",
			type: "classic",
			updateViaCache: "none"
		});
		await nsw.ready;
	} catch(err) {
		console.warn(err);
		// ignore as service worker is now optional
	}
}

const storage = (() => {
	const base = {
		/**
		 * @type {<E>(key: string, def: E) => E}
		 */
		getItem: function (key, def) {
			let item = this[key];
			if (item == null)
				return this[key] = def;
			return item;
		},
		save: () => { }
	};

	try {
		const data = localStorage.getItem("data") || "{}";
		Object.assign(base, JSON.parse(data));
		base.save = function () {
			localStorage.setItem("data", JSON.stringify(this));
		};

		// autosave
		setInterval(() => {
			base.save();
		}, 10000);
	} catch(err) {
		alert("Local storage is disabled by your browser, your browsing data will not be saved.", "Warning");
	}

	return base;
})();

window.onbeforeunload = window.onunload = () => {
	storage.save();
};

let _$stop = null;

/**
 * @param {string} str 
 */
function isUrl(str) {
	try {
		return new URL(str).href;
	} catch(err) {
		return null;
	}
}

/**
 * @param {string} str 
 */
function isHostname(str) {
	const slash = str.indexOf("/");
	if (slash > 0) {
		str = str.substring(0, slash);
	}
	str = str.toLowerCase();

	for (let i = 0; i < str.length; i++) {
		const ch = str.charCodeAt(i);
		if (ch != 0x2d/*hyphen*/ && ch != 0x2e/*dot*/ && (ch < 0x30 || ch > 0x39)/*0-9*/ && (ch < 0x61 || ch > 0x7a)/*a-z*/) {
			return false;
		}
	}

	return slash > 0 || str.includes(".");
}

/**
 * @param {string} url 
 * @param {string} searchUrl 
 * @param {boolean} searchOnly 
 */
function fixUrl(url, searchUrl, searchOnly) {
	url = url.replace(/^\s+|\s+$/gm, "");

	if (searchOnly)
		return searchUrl + encodeURIComponent(url);
	if (isUrl(url))
		return url;
	if (isHostname(url))
		return "http://" + url;

	return searchUrl + encodeURIComponent(url);
}

/**
 * @param {string | null | undefined} text 
 */
function gui(text) {
	if (text != null) {
		overlay.style.display = "block";
		overlay.innerHTML = text;
	} else overlay.style.display = "none";
}

/**
 * @param {string} url 
 */
async function openUrl(url) {
	document.title = "\u2060";
	document.querySelector("link[rel=\"icon\"]").setAttribute("href", "favicon.ico");

	switch (mode) {
		case "raw-embed":
			window.open(new URL("?open=" + encodeURIComponent(url), "https://ruochenjia.repl.co/"), "_blank").focus();
			break;
		case "tomcat":
			await tomcatUrl(url);
			break;
		case "ultraviolet":
			window.open(new URL("uv.xht?o=" + Base64.btoa(url), location.origin), "_blank").focus();
			break;
		default:
			throw new TypeError("Invalid mode: " + mode);
	}
}

/**
 * @param {string} url 
 */
async function tomcatUrl(url) {
	backgroundScreen.style.display = "none";
	homeScreen.style.display = "none";
	tomcatScreen.style.display = "block";

	////////////////////////////
	// INIT
	////////////////////////////

	// parse dimension string
	const dimens = dimension.split("x");
	const width = parseInt(dimens[0]);
	const height = parseInt(dimens[1]);

	// resize frame container
	frameContainer.style.width = width + "px";
	frameContainer.style.height = height + "px";

	// connect to server
	const socket = io(server);
	gui("Connecting to server...");
	await new Promise(resolve => socket.on("connected", resolve));
	socket.emit("new_session", { width, height, useTor });
	await new Promise(resolve => socket.on("session_id", resolve));
	socket.emit("navigate", url);

	// clean the input element to avoid errors
	const old = document.getElementById("frame-input");
	/**
	 * @type {HTMLElement}
	 */
	const input = old.cloneNode(false);
	old.parentNode.replaceChild(input, old);

	// setup input proxy element
	input.autofocus = true;
	input.focus({ preventScroll: true });

	// setup navigation elements
	backButton.onclick = () => socket.emit("goback");
	forwardButton.onclick = () => socket.emit("goforward");
	refreshButton.onclick = () => socket.emit("refresh");
	addressBar.onkeydown = (e) => {
		if (e.keyCode == 13) {
			e.preventDefault();
			socket.emit("navigate", fixUrl(addressBar.value, googleSearch, false));
			input.focus({ preventScroll: true });
		}
	};

	////////////////////////////
	// Event Listeners
	////////////////////////////

	// mouse button names, used in server side
	const buttons = [
		"left",
		"middle",
		"right",
		"back",
		"forward"
	];

	/**
	 * @param {MouseEvent} e 
	 */
	function mouseEventHandler(e) {
		// prevent default and override
		e.preventDefault();
		e.stopPropagation();
		e.returnValue = false;

		socket.emit("mouseevent", {
			type: e.type,
			x: e.offsetX,
			y: e.offsetY,
			button: buttons[e.button]
		});

		return false;
	}

	/**
	 * @param {WheelEvent} e 
	 */
	function wheelEventHandler(e) {
		e.preventDefault();
		e.stopPropagation();
		e.returnValue = false;

		socket.emit("wheelevent", {
			type: e.type,
			deltaX: e.deltaX,
			deltaY: e.deltaY
		});

		return false;
	}

	/**
	 * @param {KeyboardEvent} e 
	 */
	function keyboardEventHandler(e) {
		e.preventDefault();
		e.stopPropagation();
		e.returnValue = false;

		socket.emit("keyboardevent", {
			type: e.type,
			key: e.key
		});

		return false;
	}

	/**
	 * @param {Event} e 
	 */
	function preventDefault(e) {
		e.preventDefault();
		e.stopPropagation();
		e.returnValue = false;
		input.focus({ preventScroll: true });
		return false;
	}

	const options = { capture: false, passive: false, once: false };
	input.addEventListener("mousedown", mouseEventHandler, options);
	input.addEventListener("mouseup", mouseEventHandler, options);
	input.addEventListener("mousemove", mouseEventHandler, options);
	input.addEventListener("wheel", wheelEventHandler, options);
	input.addEventListener("keydown", keyboardEventHandler, options);
	input.addEventListener("keyup", keyboardEventHandler, options);
	input.addEventListener("click", preventDefault, options);
	input.addEventListener("contextmenu", preventDefault, options);

	////////////////////////////
	// Main loop / update
	////////////////////////////

	let addr = "";
	socket.on("data", (data) => {
		URL.revokeObjectURL(frame.src);
		frame.src = URL.createObjectURL(new Blob([data.buf], { type: "image/jpeg", endings: "native" }));
		if (document.activeElement != addressBar) {
			addressBar.value = addr = data.url;
		}
	});

	async function reconnect() {
		gui("Attempting to reconnect...");
		socket.connect();
		await new Promise(resolve => socket.on("connected", resolve));
		socket.emit("new_session", { width, height, useTor });
		await new Promise(resolve => socket.on("session_id", resolve));
		socket.emit("navigate", addr);
		gui(); // clear
	}

	socket.on("disconnect", () => gui("Disconnected from server, please check your internet connection."));
	socket.on("connect", reconnect);
	socket.on("force_reconnect", reconnect);

	const timer = setImmediate(() => socket.emit("sync"), 100);
	_$stop = () => {
		clearImmediate(timer);
		socket.disconnect(true);
		_$stop = null;
	};

	gui(); // clear overlay
}

document.getElementById("home").onclick = () => {
	if (_$stop != null) _$stop();
	frame.removeAttribute("src");
	tomcatScreen.style.display = "none";
	homeScreen.style.display = "block";
};

backgroundScreen.style.display = "none";
homeScreen.style.display = "block";

let mode = storage.getItem("mode", "tomcat");
let server = storage.getItem("server", location.origin);
let dimension = storage.getItem("dimension", "1280x720");
let useTor = storage.getItem("useTor", false);
let bareServer = storage.getItem("bareServer", "https://bare.wsug.gq/bare/");

const urlInput = document.getElementById("input");
const shortcutBar = document.getElementById("shortcut-bar");
const addShortcutButton = document.getElementById("add-shortcut");
const editShortcutButton = document.getElementById("edit-shortcut");
const deleteShortcutButton = document.getElementById("delete-shortcut");
const contextMenu = document.getElementById("context-menu");
const shortcutContextMenu = document.getElementById("shortcut-context-menu");

const menuPlaceholder = document.getElementById("menu-placeholder");
const serverMenu = document.getElementById("server");
const bareMenu = document.getElementById("bare");
const serverAddress = document.getElementById("server-address");
const dimensionSelect = document.getElementById("dimension");
const useTorCheckbox = document.getElementById("use-tor");
const bareServerAddress = document.getElementById("bare-server");

const shortcuts = storage.getItem("shortcuts", [
	{
		name: "Google",
		icon: "res/google.svg",
		link: "https://www.google.com/"
	},
	{
		name: "YouTube",
		icon: "res/youtube.svg",
		link: "https://www.youtube.com/"
	},
	{
		name: "Facebook",
		icon: "res/facebook.svg",
		link: "https://www.facebook.com"
	},
	{
		name: "Instagram",
		icon: "res/instagram.svg",
		link: "https://www.instagram.com"
	},
	{
		name: "TikTok",
		icon: "res/tiktok.svg",
		link: "https://www.tiktok.com/"
	},
	{
		name: "Y8",
		icon: "res/y8.svg",
		link: "https://www.y8.com"
	}
]);

// menu init
serverAddress.value = server;
dimensionSelect.value = dimension;
useTorCheckbox.checked = useTor;
bareServerAddress.value = bareServer;
switch (mode) {
	case "raw-embed":
		document.getElementById("raw-embed").checked = true;
		serverMenu.style.display = "none";
		bareMenu.style.display = "none";
		menuPlaceholder.style.display = "block";
		break;
	case "tomcat":
		document.getElementById("tomcat").checked = true;
		serverMenu.style.display = "block";
		bareMenu.style.display = "none";
		menuPlaceholder.style.display = "none";
		break;
	case "ultraviolet":
		document.getElementById("ultraviolet").checked = true;
		serverMenu.style.display = "none";
		bareMenu.style.display = "block";
		menuPlaceholder.style.display = "none";
		break;
	default:
		throw new Error("Invalid mode: " + mode);
}

function updateShortcuts() {
	shortcutBar.innerHTML = "";
	for (let s of shortcuts) {
		const item = document.createElement("div");
		item.className = "shortcut-item";

		const icon = document.createElement("img");
		icon.className = "shortcut-item-icon";
		icon.width = 60;
		icon.height = 60;
		icon.src = s.icon;
		item.appendChild(icon);

		const text = document.createElement("div");
		text.className = "shortcut-item-text";
		text.innerHTML = s.name;
		item.appendChild(text);

		item.onclick = () => openUrl(s.link);
		item.oncontextmenu = (e) => {
			e.preventDefault();
			e.stopPropagation();

			shortcutContextMenu.style.top = e.clientY + "px";
			shortcutContextMenu.style.left = e.clientX + "px";
			shortcutContextMenu.style.display = "block";

			deleteShortcutButton.onclick = () => {
				shortcuts.remove(s);
				updateShortcuts();
			};
			editShortcutButton.onclick = async () => {
				const result = await form("", "Edit shortcut", [
					{
						label: "Name",
						input: {
							type: "text",
							placeholder: "Name",
							value: s.name
						}
					},
					{
						label: "URL",
						input: {
							type: "text",
							placeholder: "https://example.com/example",
							value: s.link
						}
					}
				]);

				if (result == null)
					return; // canceled

				let name = result[0].value;
				let url = result[1].value;

				if (name.length == 0) {
					alert("Name cannot be empty.");
					return;
				}

				if (url.length == 0) {
					alert("URL cannot be empty.");
					return;
				}

				try {
					url = new URL(url).href;
				} catch(e) {
					alert("Invalid URL. A valid URL must start with http:// or https://");
					return;
				}

				s.name = name;
				s.link = url;
				updateShortcuts();
			};
		};

		shortcutBar.appendChild(item);
	}
	shortcutBar.appendChild(addShortcutButton);
}
updateShortcuts();

urlInput.onkeydown = (e) => {
	if (e.keyCode == 13) {
		e.preventDefault();
		run(mode == "raw-embed" ? bingSearch : googleSearch, false);
	}
};
document.getElementById("search-button").onclick = () => {
	run(mode == "raw-embed" ? bingSearch : googleSearch, true);
};
document.getElementById("random-button").onclick = () => {
	run(mode == "raw-embed" ? bingSearch : googleSearchR, true);
};
addShortcutButton.onclick = async () => {
	const result = await form("", "Add shortcut", [
		{
			label: "Name",
			input: {
				type: "text",
				placeholder: "Name"
			}
		},
		{
			label: "URL",
			input: {
				type: "text",
				placeholder: "https://example.com/example"
			}
		}
	]);

	if (result == null)
		return; // canceled

	let name = result[0].value;
	let url = result[1].value;

	if (name.length == 0) {
		alert("Name cannot be empty.");
		return;
	}

	if (url.length == 0) {
		alert("URL cannot be empty.");
		return;
	}

	try {
		url = new URL(url);
	} catch(e) {
		alert("Invalid URL. A valid URL must start with http:// or https://");
		return;
	}

	shortcuts.push({
		name: name,
		icon: new URL("/favicon.ico", url.origin).href,
		link: url.href
	});

	updateShortcuts();
};
for (let radio of document.getElementsByName("working-mode")) {
	radio.onclick = () => {
		const id = radio.id;
		switch (id) {
			case "raw-embed":
				document.getElementById("raw-embed").checked = true;
				serverMenu.style.display = "none";
				bareMenu.style.display = "none";
				menuPlaceholder.style.display = "block";
				break;
			case "tomcat":
				document.getElementById("tomcat").checked = true;
				serverMenu.style.display = "block";
				bareMenu.style.display = "none";
				menuPlaceholder.style.display = "none";
				break;
			case "ultraviolet":
				document.getElementById("ultraviolet").checked = true;
				serverMenu.style.display = "none";
				bareMenu.style.display = "block";
				menuPlaceholder.style.display = "none";
				break;
			default:
				throw new Error("Invalid mode: " + mode);
		}

		storage.mode = mode = id;
	};
}
serverAddress.onblur = () => storage.server = server = serverAddress.value;
dimensionSelect.onchange = () => storage.dimension = dimension = dimensionSelect.value;
useTorCheckbox.onchange = () => storage.useTor = useTor = useTorCheckbox.checked;
bareServerAddress.onblur = () => storage.bareServer = bareServer = bareServerAddress.value;

/**
 * @param {string} searchUrl 
 * @param {boolean} searchOnly 
 */
async function run(searchUrl, searchOnly) {
	await openUrl(fixUrl(urlInput.value, searchUrl, searchOnly));
}

//////////////////////////
// Context menu
//////////////////////////

document.getElementById("clear-site-data").onclick = async () => {
	window.sessionStorage.clear();
	window.localStorage.clear();
	const databases = await indexedDB.databases();
	for (let i = 0; i < databases.length; i++)
		indexedDB.deleteDatabase(databases[i].name);
	beep();
};
document.getElementById("clear-cache").onclick = async () => {
	const keys = await caches.keys();
	for (let i = 0; i < keys.length; i++)
		await caches.delete(keys[i]);
};
document.getElementById("leave-without-history").onclick = () => {
	window.location.replace("https://www.google.com/");
};
document.getElementById("debug-shell").onclick = inspect;
document.body.onclick = () => {
	contextMenu.style.display = "none";
	shortcutContextMenu.style.display = "none";
};
document.oncontextmenu = (e) => {
	e.preventDefault();
	contextMenu.style.top = e.clientY + "px";
	contextMenu.style.left = e.clientX + "px";
	contextMenu.style.display = "block";
};
document.getElementById("version").innerHTML = app.cacheVersion;

eval(`console.log("%cWhiteSpider.gq", "background-color:#001a1a;border:3px solid #008080;border-radius:10px;color:#ffffff;display:block;font-family:Ubuntu;font-size:24px;font-stretch:normal;font-style:normal;font-weight:600;height:fit-content;margin:10px;padding:10px;position:relative;text-align:start;text-decoration:none;width:fit-content");console.log("%cPage Verified", "position: relative;display: block;width: fit-content;height: fit-content;color: #ffffff;background-color: #008000;font-size: 14px;font-weight: 600;font-family: \\"Ubuntu Mono\\";font-stretch: normal;text-align: start;text-decoration: none;");`);

//////////////////////////
// Easter egg
//////////////////////////

const audioContext = new AudioContext({  
	latencyHint: "balanced",
	sampleRate: 48000
});
const beepWav = await (await fetch("res/winxperror.wav", { method: "GET", mode: "same-origin" })).arrayBuffer();
const audioBuffer = await audioContext.decodeAudioData(beepWav);

function beep(tune = 0) {
	const src = audioContext.createBufferSource();
	src.buffer = audioBuffer;
	src.loop = false;
	src.detune.value = tune * 100;
	src.connect(audioContext.destination);
	src.start(0, 0);
}
window.whitespider = beep;

})();
