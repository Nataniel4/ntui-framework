/*
 * ntui-css.js
 * NtUI Framework CSS Module
 *
 * Created by Nataniel López @ 05/31/2018
 * Copyright (c) 2018 Nataniel López
 */

ntui.exports = function () {
	//convert
	ntui.exports.Convert = {};
	ntui.exports.Convert.fromJsonToCss = function (jsonifiedCss) {
		if (jsonifiedCss && typeof jsonifiedCss === "object" && jsonifiedCss.constructor === {}.constructor) {
			var convertedCss = "";

			var parseCssProperty = function (cssProperty, cssPropertyValue) {
				var parsedCssProperty = "";
				if (typeof cssPropertyValue === "object" && cssPropertyValue.constructor === [].constructor) {
					for (var i = cssPropertyValue.length - 1; i >= 0; i--) {
						if (cssPropertyValue[i]) {
							parsedCssProperty += cssProperty + ":" + cssPropertyValue[i] + ";";
						}
					}
				} else if (typeof cssPropertyValue === "object" && cssPropertyValue.constructor === {}.constructor) {
					parsedCssProperty += cssProperty + "{" + ntui.exports.Convert.fromJsonToCss(cssPropertyValue) + "}";
				} else {
					parsedCssProperty += cssProperty + ":" + cssPropertyValue + ";";
				}
				return parsedCssProperty;
			}
			for (var i = Object.keys(jsonifiedCss).length - 1; i >= 0; i--) {
				if (Object.keys(jsonifiedCss)[i]) {
					var cssElement = Object.keys(jsonifiedCss)[i];
					var cssProperties = jsonifiedCss[cssElement];
					if (typeof cssProperties === "object" && cssProperties.constructor === {}.constructor) {
						convertedCss += cssElement + "{";
						for (var n = Object.keys(cssProperties).length - 1; n >= 0; n--) {
							if (Object.keys(cssProperties)[n]) {
								convertedCss += parseCssProperty(Object.keys(cssProperties)[n], cssProperties[Object.keys(cssProperties)[n]]);
							}
						}
						convertedCss += "}";
					} else {
						convertedCss += parseCssProperty(cssElement, cssProperties);
					}
				}
			}
			if (convertedCss) {
				return convertedCss;
			} else {
				return "";
			}
		} else {
			if (jsonifiedCss) {
				ntui.Console.error("The CSS code must be in JSON format.", "ntui.exports {Convert.fromJsonToCss}");
			}
		}
	};
	ntui.exports.formatCss = function (cssCode) {
		if (cssCode) {
			cssCode = cssCode.replace(/{/g, " {\n\t").replace(/:/g, ": ").replace(/;/g, ";\n\t").replace(/\t}/g, "}\n");
			if (cssCode.substr(-1) === "\n") {
				cssCode = cssCode.substr(0, cssCode.length - 1);
			}
			return cssCode;
		}
	};
	//class
	ntui.exports.Class = function (className, jsonifiedCss, selectorType) {
		if (!className) {
			className = __internal.generateId(20);
		}
		if (!selectorType) {
			selectorType = ".";
		}
		//CSS storage
		this.Properties = {};
		this.Property = this.Properties;
		//DOM connection
		var domElement = ntui.createElement(
			"style", {
				type: "text/css",
				media: "screen",
				class: __internal.generateId(20)
			}
		);
		this.update = function () {
			domElement.innerHTML = selectorType + className + "{" + ntui.exports.Convert.fromJsonToCss(this.Properties) + "}";
		};
		this.selectorType = function (newSelectorType) {
			if (newSelectorType) {
				if (newSelectorType.toLowerCase() === "element") {
					selectorType = "";
				} else {
					selectorType = newSelectorType;
				}
				this.update();
			}
			return selectorType;
		};
		this.className = function (newClassName) {
			if (newClassName) {
				className = newClassName;
				this.update();
			}
			return className;
		};
		this.isEnabled = function () {
			if (document.getElementsByClassName(domElement.className)[0]) {
				return true;
			} else {
				return false;
			}
		};
		this.enable = function () {
			if (!this.isEnabled()) {
				document.body.appendChild(domElement);
				ntui.Console.log("Class \"" + className + "\" enabled.", "ntui.exports {Class.enable}");
			} else {
				ntui.Console.warn("Class \"" + className + "\" already enabled.", "ntui.exports {Class.enable}");
			}
		};
		this.disable = function () {
			if (this.isEnabled()) {
				document.body.removeChild(domElement);
				ntui.Console.log("Class \"" + className + "\" disabled.", "ntui.exports {Class.disable}");
			} else {
				ntui.Console.warn("Class \"" + className + "\" already disabled.", "ntui.exports {Class.disable}");
			}
		};
		this.setProperty = function (propertyName, propertyValue) {
			if (propertyName && propertyValue) {
				this.Properties[propertyName] = propertyValue;
				this.update();
			}
		};
		this.setPropertyCrossBrowser = function (propertyName, propertyValue, browserList) {
			if (propertyName && propertyValue && browserList) {
				if (typeof browserList === "object") {
					for (var i = browserList.length - 1; i >= 0; i--) {
						if (browserList[i]) {
							this.Properties["-" + browserList[i] + "-" + propertyName] = propertyValue;
						}
					}
					this.Properties[propertyName] = propertyValue;
					this.update();
				} else {
					ntui.Console.error("The browser list must be in array format.", "ntui.exports {Class.setPropertyCrossBrowser}");
				}
			}
		};
		this.setPropertyValueCrossBrowser = function (propertyName, propertyValue, browserList) {
			if (propertyName && propertyValue && browserList) {
				if (typeof browserList === "object" && browserList.constructor === [].constructor) {
					this.Properties[propertyName] = []; //Convert propertyValue to array
					for (var i = browserList.length - 1; i >= 0; i--) {
						if (browserList[i]) {
							this.Properties[propertyName][i] = "-" + browserList[i] + "-" + propertyValue;
						}
					}
					this.Properties[propertyName][browserList.length] = propertyValue;
					this.update();
				} else {
					ntui.Console.error("The browser list must be in array format.", "ntui.exports {Class.setPropertyValueCrossBrowser}");
				}
			}
		};
		this.getProperty = function (propertyName) {
			if (propertyName) {
				if (this.Properties[propertyName]) {
					return this.Properties[propertyName];
				} else {
					ntui.Console.error("Can't find CSS property \"" + propertyName + "\".", "ntui.exports {Class.getProperty}");
				}
			}
		};
		this.deleteProperty = function (propertyName) {
			if (propertyName) {
				if (this.Properties[propertyName]) {
					delete this.Properties[propertyName];
				} else {
					ntui.Console.warn("Can't find CSS property \"" + propertyName + "\".", "ntui.exports {Class.deleteProperty}");
				}
				this.update();
			}
		};
		this.setProperties = function (jsonifiedCss) {
			if (jsonifiedCss) {
				if (typeof jsonifiedCss === "object" && jsonifiedCss.constructor === {}.constructor) {
					for (var i = Object.keys(jsonifiedCss).length - 1; i >= 0; i--) {
						if (Object.keys(jsonifiedCss)[i]) {
							this.Properties[Object.keys(jsonifiedCss)[i]] = jsonifiedCss[Object.keys(jsonifiedCss)[i]];
						}
					}
					this.update();
				} else {
					ntui.Console.error("The CSS code must be in JSON format.", "ntui.exports {Class.setProperties}");
				}
			}
		};
		this.getProperties = function () {
			return JSON.parse(JSON.stringify(this.Properties));
		};
		this.exportToCss = function () {
			var exportedCss = selectorType + className + "{" + ntui.exports.Convert.fromJsonToCss(this.Properties) + "}";
			if (Object.keys(this.SubClasses).length !== 0) {
				for (var i = Object.keys(this.SubClasses).length - 1; i >= 0; i--) {
					if (Object.keys(this.SubClasses)[i]) {
						exportedCss += this.SubClasses[Object.keys(this.SubClasses)[i]].exportToCss();
					}
				}
			}
			return exportedCss;
		};
		this.exportToJson = function () {
			var exportedCss = {};
			var importedCss = {};
			exportedCss[selectorType + className] = JSON.parse(JSON.stringify(this.Properties));
			if (Object.keys(this.SubClasses).length !== 0) {
				for (var i = Object.keys(this.SubClasses).length - 1; i >= 0; i--) {
					if (Object.keys(this.SubClasses)[i]) {
						importedCss = this.SubClasses[Object.keys(this.SubClasses)[i]].exportToJson();
						for (var n = Object.keys(importedCss).length - 1; n >= 0; n--) {
							exportedCss[Object.keys(importedCss)[n]] = importedCss[Object.keys(importedCss)[n]];
						}
					}
				}
			}
			return exportedCss;
		};
		//SubClasses
		this.SubClasses = {};
		this.SubClass = this.SubClasses;
		this.newSubClass = function (subClassName, jsonifiedCss) {
			if (subClassName) {
				this.SubClasses[subClassName] = new ntui.exports.Class(className + " ." + subClassName, jsonifiedCss);
				ntui.Console.log("Subclass \"" + subClassName + "\" for \"" + className + "\" created.", "ntui.exports {Class.newSubClass}")
			}
		};
		this.deleteSubClass = function (subClassName) {
			if (subClassName) {
				if (this.SubClasses[subClassName]) {
					this.SubClasses[subClassName].disable();
					delete this.SubClasses[subClassName];
					ntui.Console.log("Subclass \"" + subClassName + "\" deleted from \"" + className + "\".", "ntui.exports {Class.deleteSubClass}")
				} else {
					ntui.Console.warn("Unable to find subclass \"" + subClassName + "\" in \"" + className + "\".", "ntui.exports {Class.deleteSubClass}")
				}
			}
		};
		//initialization
		document.body.appendChild(domElement);
		if (jsonifiedCss && typeof jsonifiedCss === "object" && jsonifiedCss.constructor === {}.constructor) {
			this.Properties = jsonifiedCss;
			this.update();
		} else {
			if (jsonifiedCss) {
				ntui.Console.error("The CSS code must be in JSON format.", "ntui.exports {Class}");
			}
		}
		ntui.Console.log("Class \"" + className + "\" created.", "ntui.exports {Class}");
	};
};
