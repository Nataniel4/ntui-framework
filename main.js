//NtUI Testings
ntui.devMode = true;

var vendorPrefixes;
var myClass;
var myWorkspace;

//ntui-css
ntui.require("ntui_modules/ntui-css", "", function () {
	vendorPrefixes = ["webkit", "moz", "ms", "o"];
	myClass = new ntui_css.Class("myClass", {
		"position": "fixed",
		"width": "512px",
		"height": "256px",
		"top": "50%",
		"left": "50%",
		"margin-top": "-128px",
		"margin-left": "-256px",
		"padding": "16px",
		"border-radius": "10px",
		"box-shadow": "0px 12px 24px 6px rgba(0,0,0,0.75)",
		"text-shadow": "0px 1px 2px rgba(0,0,0,0.50)",
		"font-family": "'Helvetica Neue', sans-serif",
		"font-size": "18px",
		"font-weight": 200,
		"color": "#FFFFFF",
		"z-index": 2,
		"background": [
			"-webkit-linear-gradient(top left, rgba(148, 55, 255, 0.90),rgba(0, 150, 255, 0.90))",
			"-moz-linear-gradient(bottom right, rgba(148, 55, 255, 0.90),rgba(0, 150, 255, 0.90))",
			"-ms-linear-gradient(bottom right, rgba(148, 55, 255, 0.90),rgba(0, 150, 255, 0.90))",
			"-o-linear-gradient(bottom right, rgba(148, 55, 255, 0.90),rgba(0, 150, 255, 0.90))",
			"linear-gradient(to bottom right, rgba(148, 55, 255, 0.90),rgba(0, 150, 255, 0.90))"
		],
		"cursor": "default"
	});
	myClass.setPropertyCrossBrowser("user-select", "none", vendorPrefixes);
	myClass.setPropertyCrossBrowser("backdrop-filter", "blur(10px)", vendorPrefixes);
	myClass.newSubClass("mySubClass", {
		"border-radius": "10px",
		"box-shadow": "0px 12px 24px 6px rgba(0,0,0,0.75)",
		"text-shadow": "0px 1px 2px rgba(0,0,0,0.50)",
		"font-family": "'Helvetica Neue', sans-serif",
		"font-size": "18px",
		"font-weight": 200,
		"color": "#FFFFFF",
	});
	myClass.SubClass.mySubClass.newSubClass("holyFuckingClass", {
		"color": "#FFFFFF",
		"z-index": 2,
		"background": [
			"-webkit-linear-gradient(top left, rgba(148, 55, 255, 0.90),rgba(0, 150, 255, 0.90))",
			"-moz-linear-gradient(bottom right, rgba(148, 55, 255, 0.90),rgba(0, 150, 255, 0.90))",
			"-ms-linear-gradient(bottom right, rgba(148, 55, 255, 0.90),rgba(0, 150, 255, 0.90))",
			"-o-linear-gradient(bottom right, rgba(148, 55, 255, 0.90),rgba(0, 150, 255, 0.90))",
			"linear-gradient(to bottom right, rgba(148, 55, 255, 0.90),rgba(0, 150, 255, 0.90))"
		],
		"cursor": "default"
	})
	//myClass.disable();
	//myWorkspace.addToWorkspace(myClass.exportToJson());
});

ntui.require("ntui_modules/ntui-ui", "", function () {
	/*ntuiCSS.Workspaces.newWorkspace("xd");
	ntuiCSS.Workspaces.addToWorkspace("xd",
	    {
	        "body": {
	            "background-color": "#FF0033",
	            "color": "#000000"
	        },
	        ".myClass": {
	            "background": "#000000",
	            "color": "#ffffff",
	            "font-family": "'Arial',sans-serif",
	            "font-weight": 300,
	            "z-index": 9,
	            "webkit-user-select": "none",
	            "moz-user-select": "none",
	            "ms-user-select": "none",
	            "o-user-select": "none",
	            "user-select": "none",
	        },
	        "#myElement": "font-family:sans-serif;"
	    });*/
});
