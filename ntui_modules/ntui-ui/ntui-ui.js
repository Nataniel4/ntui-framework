/*
 * ntui-ui.js
 * NtUI Framework UI Module
 *
 * Crated by Nataniel López @ 05/31/2018
 * Copyright (c) 2018 Nataniel López
 */

ntui.exports = function () {

    //components
    ntui.exports.Components = {};
    ntui.exports.Component = {};

    ntui.exports.Components.newComponent = function (componentName, componentSourceFile) {
        if (componentName && componentSourceFile) {

            if (ntui.FileSystem.getFileExt(componentSourceFile) && ntui.FileSystem.getFileExt(componentSourceFile) === "html") {
                var componentSource = ntui.createElement(
                    "iframe",
                    {
                        src: componentSourceFile,
                        style: "display: none;"
                    }
                );
                componentSource.onload = function () {
                    if (componentSource.contentDocument.body) {
                        if (componentSource.contentDocument.body.getElementsByTagName(componentName)[0]) {
                            var componentSourceTemp = componentSource.contentDocument.body.getElementsByTagName(componentName)[0];

                            if (!ntui.exports.Component[componentName]) {
                                ntui.exports.Component[componentName] = ntui.createElement(
                                    "div",
                                    {
                                        class: __internal.generateId(20)
                                    }
                                );

                                if (componentSourceTemp.getElementsByTagName("style")[0]) {
                                    var componentCssTemp = componentSourceTemp.getElementsByTagName("style")[0].innerHTML;

                                    if (componentCssTemp.indexOf(componentName) !== -1) {
                                        if (componentCssTemp.indexOf("{", componentCssTemp.indexOf(componentName)) !== -1) {
                                            var startIndex = componentCssTemp.indexOf("{", componentCssTemp.indexOf(componentName));

                                            if (componentCssTemp.indexOf("}", startIndex) !== -1) {
                                                var endIndex = componentCssTemp.indexOf("}", startIndex);
                                                componentCssTemp = componentCssTemp.substr(startIndex + 1, endIndex - startIndex - 1);

                                                //add css to ntui.ui workspace
                                                
                                            } else {
                                                console.warn("[ntui.exports] {Components.newComponent} An error ocurred while parsing the CSS of component.");
                                            }
                                        } else {
                                            console.warn("[ntui.exports] {Components.newComponent} An error ocurred while parsing the CSS of component.");
                                        }
                                    }
                                }
                            } else {
                                console.warn("[ntui.exports] {Components.newComponent} \"" + componentName + "\" already exists.");
                            }
                        } else {
                            console.warn("[ntui.exports] {Components.newComponent} Can't find component \"" + componentName + "\" in the specified source file.");
                        }
                    } else {
                        console.warn("[ntui.exports] {Components.newComponent} Invalid component source file.")
                    }
                    document.body.removeChild(componentSource);
                }
                document.body.appendChild(componentSource);
            } else {
                console.warn("[ntui.exports] {Components.newComponent} Component source file must be an html file.")
            }
        }
    }

    /*ntui.exports.Components.newComponent = function (componentName, componentTag, componentCSS) {
        if (componentName && componentTag) {
            if (!ntui.exports.Components[componentName]) {
                ntui.exports.Components[componentName] = ntui.createElement(componentTag, { class: __internal.generateId(20) });
                if (componentCSS && typeof componentCSS === "object") {
                    var cssProperties = Object.keys(componentCSS);
                    var cssContent = "";
                    for (var i = cssProperties.length - 1; i >= 0; i--) {
                        if (cssProperties[i]) {
                            cssContent += cssProperties[i] + ":" + componentCSS[cssProperties[i]] + ";";
                        }
                    }
                    //append css content to ntui.css workspace
                    ntui.exports.Css.workspace.innerHTML += "." + ntui.exports.Components[componentName].className + "{" + cssContent + "}";
                }
            }else{
                console.warn("[ntui.exports] {Components.newComponent} \"" + componentName + "\" already exists.");
            }
        }
    }*/

};