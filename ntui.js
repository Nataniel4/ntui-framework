/*
 * ntui.js
 * NtUI Framework Core
 *
 * Created by Nataniel López @ 12/3/2018
 * Copyright (c) 2018 Nataniel López and Nt-Systems
 */

function ntui() {

	//info
	ntui.version = function () {
		return "1.0";
	};
	ntui.build = function () {
		return "0001";
	};
	ntui.info = function () {
		return "NtUI Framework " + ntui.version() + " build " + ntui.build() + " | Copyright (c) " + (new Date().getFullYear()) + " Nataniel López. All rights reserved.";
	};

	//fileSystem
	ntui.FileSystem = {};

	//getFile
	ntui.FileSystem.getFile = function (file) {
		if (file) {
			for (var i = file.length - 1; i >= 0; i--) {
				if (file[i] == "/" || i == "\\") {
					return file.substr(i + 1, file.length - i);
				}
			}
			if (file !== "") {
				return file;
			} else {
				return false;
			}
		}
	};

	//getFilePath
	ntui.FileSystem.getFilePath = function (file) {
		if (file) {
			for (var i = file.length - 1; i >= 0; i--) {
				if (file[i] == "/" || i == "\\") {
					return file.substr(0, i + 1);
				}
			}
			return false;
		}
	};

	//getFileName
	ntui.FileSystem.getFileName = function (file) {
		if (file) {
			file = ntui.FileSystem.getFile(file);
			for (var i = file.length; i >= 0; i--) {
				if (file[i] == ".") {
					return file.substr(0, i);
				}
			}
			return false;
		}
	};

	//getFileExt
	ntui.FileSystem.getFileExt = function (file) {
		if (file) {
			file = ntui.FileSystem.getFile(file);
			for (var i = file.length; i >= 0; i--) {
				if (file[i] == ".") {
					return file.substr(i + 1, file.length - i);
				}
			}
			return false;
		}
	};

	//createElement
	ntui.createElement = function (tag, attrs, html) {
		if (tag) {
			var element = document.createElement(tag);
			if (attrs && typeof attrs === "object") {
				var props = Object.keys(attrs);
				for (i = props.length - 1; i >= 0; i--) {
					if (props[i]) {
						element.setAttribute(props[i], attrs[props[i]]);
					}
				}
			} else {
				ntui.Console.warn("The attributes for the new element must be in JSON format.", "ntui {createElement}");
			}
			if (html) {
				if (typeof html === "object") {
					if (html.outerHTML !== undefined) {
						element.innerHTML = html.outerHTML;
					} else {
						element.innerHTML = html;
					}
				} else {
					element.innerHTML = html;
				}
			}
			return element;
		}
	};

	//require (import js classes, functions, variables or JSON files)
	ntui.require = function (file, target, callback) {
		if (file) {
			if (ntui.FileSystem.getFileExt(file) === false) {
				file += "/" + ntui.FileSystem.getFile(file) + ".js";
			}
			if (__internal.requireBusy === false) {
				__internal.requireBusy = true;
				if (!target) {
					target = ntui.FileSystem.getFileName(file);
				}
				target = target.replace(/[\. ,:-]+/g, "_");
				element = ntui.createElement(
					"script", {
						src: file,
						type: "text/javascript"
					}
				);
				ntui.Console.log("Importing \"" + file + "\" into \"" + target + "\"...", "ntui {require}");
				element.onload = function () {
					if (ntui.exports) {
						if (typeof ntui.exports === "function") {
							eval(target + " = " + String(ntui.exports).replace(/ntui.exports/g, target));
							window[target]();
						} else if (typeof ntui.exports === "object") {
							window[target] = JSON.stringify(ntui.exports).replace(/ntui.exports/g, target);
							window[target] = JSON.parse(window[target]);
						} else {
							window[target] = String(ntui.exports).replace(/ntui.exports/g, target);
						}
						if (callback && typeof callback === "function") {
							callback();
						}
						ntui.exports = undefined;
						ntui.Console.log("\"" + ntui.FileSystem.getFileName(file) + "." + ntui.FileSystem.getFileExt(file) + "\" successfully loaded into \"" + target + "\".", "ntui {require}");
					} else {
						ntui.Console.error("Error loading \"" + ntui.FileSystem.getFileName(file) + "." + ntui.FileSystem.getFileExt(file) + "\", maybe the file is bad initialized or have errors in the code.\nPlease check the code and/or NtUI documentation.", "ntui {require}");
					}
					document.body.removeChild(element);
					element = undefined;
					__internal.requireBusy = false;
				};
				if (document.body) {
					document.body.appendChild(element);
				} else {
					var async_interval = setInterval(function () {
						if (document.body) {
							document.body.appendChild(element);
							clearInterval(async_interval);
						}
					}, 1);
				}
			} else {
				var async_interval = setInterval(function () {
					if (__internal.requireBusy === false) {
						ntui.require(file, target, callback);
						clearInterval(async_interval);
					}
				}, 1);
			}
		}
	};

	//render
	ntui.render = function (object, target) {
		var i;
		if (object && object.innerHTML) {
			var n;
			var parse;
			var objects = [];
			while (object.innerHTML.indexOf("${", i) !== -1 && object.innerHTML.indexOf("}", i) !== -1) {
				parse = object.innerHTML.substr(object.innerHTML.indexOf("${", i) + 2, (object.innerHTML.indexOf("}", i) - object.innerHTML.indexOf("${", i)) - 2);
				if (parse) {
					objects[objects.length] = parse;
				}
				i = object.innerHTML.indexOf("}", i) + 1;
			}
			if (objects[0]) {
				if (ntui[__internal.render.index]) {
					ntui[__internal.render.index] = JSON.parse(ntui[__internal.render.index]);
				} else {
					__internal.render.index = __internal.generateId(50);
					ntui[__internal.render.index] = [];
				}
				n = objects.length;
				for (i = 0; i < n; i++) {
					if (eval(objects[i]) !== undefined) {
						object.innerHTML = object.innerHTML.split("${" + objects[i] + "}").join("<ntui-render index=\"" + i + "\"" + ">" + objects[i] + "</ntui-render>");
						if (ntui[__internal.render.index].length === 0) {
							ntui[__internal.render.index][0] = objects[i];
						} else {
							ntui[__internal.render.index][ntui[__internal.render.index].length] = objects[i];
						}
					}
				}
				ntui[__internal.render.index] = JSON.stringify(ntui[__internal.render.index]);
				if (target) {
					target.appendChild(object);
				}
				ntui.render("", object);
			} else {
				target.appendChild(object);
			}
		} else {
			if (ntui[__internal.render.index]) {
				ntui[__internal.render.index] = JSON.parse(ntui[__internal.render.index]);
				if (!target) {
					target = document;
				}
				if (target !== null && target.getElementsByTagName("ntui-render").length) {
					var index;
					var temp_target;
					for (i = target.getElementsByTagName("ntui-render").length - 1; i >= 0; i--) {
						temp_target = target.getElementsByTagName("ntui-render")[i];
						index = temp_target.getAttribute("index");
						if (ntui[__internal.render.index][index] !== undefined && ntui[__internal.render.index][index] !== "") {
							temp_target.innerHTML = eval(ntui[__internal.render.index][index]);
						} else {
							temp_target.innerHTML = "";
						}
					}
				}
				ntui[__internal.render.index] = JSON.stringify(ntui[__internal.render.index]);
			}
		}
	};

	//platform
	ntui.platform = function () {
		if (window.innerWidth > screen.width || screen.width < 768) {
			if (window.devicePixelRatio && window.devicePixelRatio < 1.0) {
				return 'desktop';
			} else {
				return 'mobile';
			}
		} else {
			return 'desktop';
		}
	};

	//internal
	var __internal = {};

	//id generator
	__internal.generateId = function (length) {
		if (!length) {
			length = 30;
		}
		var output = "";
		var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

		for (var i = length - 1; i >= 0; i--) {
			output += charset.charAt(Math.floor(Math.random() * charset.length));
		}

		return output;
	};

	//require
	__internal.requireBusy = false;

	//render
	__internal.render = {};
	//__internal.render.index

	//devmode
	ntui.devMode = false;
	__internal.devMode = ntui.devMode;

	//console
	ntui.Console = {};

	__internal.Console = ntui.createElement(
		"div",
		{
			class: __internal.generateId(20),
			lbg: "1"
		},
		"<div style=\"font-size:18px;font-weight:300;padding:16px;\"><div style=\"display:inline-block;background:#fc4646;border:1px solid #d83134;width:12px;height:12px;border-radius:12px;margin-right:10px;\" onclick=\"ntui.Console.toggleConsole();\"></div>NtUI Console (developer mode is enabled)<br><div style=\"padding-top:8px;font-size:12px;font-weight:400;\">You can't exec code from this console, it's only for framework logs.</div></div><div style=\"overflow-y:auto;max-height:322px;\"><span>" + ntui.info().split(" | ").join("<br>") + "</span></div>"
	)
	__internal.Console.appendChild(ntui.createElement(
		"style",
		{
			type: "text/css",
			media: "screen",
		},
		"." + __internal.Console.className + "{position:fixed;width:600px;height:400px;max-height:400px;top:50%;left:50%;margin-top:-200px;margin-left:-300px;background:rgba(244,241,242,0.87);-webkit-backdrop-filter: blur(20px);-moz-backdrop-filter: blur(10px);backdrop-filter: blur(10px);font-family:'Helvetica Neue','Roboto','Segoe UI', sans-serif;font-size:12px;font-style:normal;border:1px solid #D9D9D9;border-radius:10px;box-sizing:border-box;box-shadow:0px 15px 30px 8px rgba(0,0,0,0.50);overflow:hidden;z-index:999;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none;cursor:default;}" +
		"." + __internal.Console.className + " span {-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;-o-user-select:text;user-select:text;cursor:text;display:block;background:rgba(0,0,0,0.10);padding:5px 16px 5px 16px;color:#000000;}" +
		"@keyframes " + __internal.Console.className + "-shake{0%{margin-left:-300;}25%{margin-left:-316px;}50%{margin-left:-300;}75%{margin-left:-284px;}100%{margin-left:-300px;}}"
	));

	ntui.Console.isVisible = function () {
		if (document.getElementsByClassName(__internal.Console.className)[0]) {
			return true;
		} else {
			return false;
		}
	};

	ntui.Console.toggleConsole = function () {
		if (__internal.devMode === true) {
			if (ntui.Console.isVisible()) {
				document.body.removeChild(__internal.Console);
			} else {
				document.body.appendChild(__internal.Console);
			}
		} else {
			console.log("[NtUI] Sorry, developer tools are not available.");
		}
	};

	ntui.Console.log = function (text, identifier) {
		if (typeof text === "string") {
			text = text.replace(/\n/g, "<br>");
		} else if (typeof text === "object") {
			if (text.outerHTML) {
				text = text.outerHTML.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
			} else {
				text = JSON.stringify(text);
			}
		}
		if (!identifier) {
			identifier = "(log)";
		}
		identifier = "<span style=\"display:inline-block;font-weight:500;background:none;color:#0096FF;padding:0px;\">" + identifier + "</span>";
		var span = "<span>";
		if (__internal.Console.getAttribute("lbg") === "1") {
			span = "<span style=\"background:none;\">";
			__internal.Console.setAttribute("lbg", "0");
		} else {
			__internal.Console.setAttribute("lbg", "1");
		}
		__internal.Console.getElementsByTagName("div")[3].innerHTML += span + identifier + " " + text + "</span>";
		__internal.Console.getElementsByTagName("div")[3].scrollTop = __internal.Console.getElementsByTagName("div")[3].scrollHeight;
	};

	//ignoreWarnings setting
	ntui.Console.ignoreWarnings = false;

	ntui.Console.warn = function (text, identifier) {
		if (typeof text === "string") {
			text = text.replace(/\n/g, "<br>");
		} else if (typeof text === "object") {
			if (text.outerHTML) {
				text = text.outerHTML.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
			} else {
				text = JSON.stringify(text);
			}
		}
		if (!identifier) {
			identifier = "(warning)";
		}
		identifier = "<span style=\"display:inline-block;font-weight:500;background:none;color:#9437FF;padding:0px;\">" + identifier + "</span>";
		var span = "<span>";
		if (__internal.Console.getAttribute("lbg") === "1") {
			span = "<span style=\"background:none;\">";
			__internal.Console.setAttribute("lbg", "0");
		} else {
			__internal.Console.setAttribute("lbg", "1");
		}
		__internal.Console.getElementsByTagName("div")[3].innerHTML += span + identifier + " " + text + "</span>";
		if (ntui.Console.isVisible() === false && __internal.devMode === true && ntui.Console.ignoreWarnings === false) {
			ntui.Console.toggleConsole();
		}
		__internal.Console.getElementsByTagName("div")[3].scrollTop = __internal.Console.getElementsByTagName("div")[3].scrollHeight;
	};

	ntui.Console.error = function (text, identifier) {
		if (typeof text === "string") {
			text = text.replace(/\n/g, "<br>");
		} else if (typeof text === "object") {
			if (text.outerHTML) {
				text = text.outerHTML.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
			} else {
				text = JSON.stringify(text);
			}
		}
		if (!identifier) {
			identifier = "(error)";
		}
		identifier = "<span style=\"display:inline-block;font-weight:500;background:none;color:#FF2F92;padding:0px;\">" + identifier + "</span>";
		var span = "<span>";
		if (__internal.Console.getAttribute("lbg") === "1") {
			span = "<span style=\"background:none;\">";
			__internal.Console.setAttribute("lbg", "0");
		} else {
			__internal.Console.setAttribute("lbg", "1");
		}
		__internal.Console.getElementsByTagName("div")[3].innerHTML += span + identifier + " " + text + "</span>";
		if (ntui.Console.isVisible() === false && __internal.devMode === true) {
			ntui.Console.toggleConsole();
		}
		__internal.Console.style.animation = __internal.Console.className + "-shake 0.25s";
		setTimeout(function () {
			__internal.Console.style.animation = "none";
		}, 250);
		__internal.Console.getElementsByTagName("div")[3].scrollTop = __internal.Console.getElementsByTagName("div")[3].scrollHeight;
	};

	//load
	ntui.init = function () {
		console.log(ntui.info());
		if (ntui.ready && typeof ntui.ready === 'function') {
			ntui.ready();
		}
		if (ntui.devMode === true) {
			__internal.devMode = true;
			ntui.devMode = undefined;
			ntui.Console.toggleConsole();
		}
		ntui.init = undefined;
	};
	if (document.readyState !== 'complete') {
		window.addEventListener('load', ntui.init);
	} else {
		ntui.init();
	}
}

//initialization
ntui();
