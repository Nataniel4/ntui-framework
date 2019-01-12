/*
 * ntui-ux.js
 * NtUI Framework UX Module
 *
 * Crated by Nataniel López @ 05/29/2018
 * Copyright (c) 2018 Nataniel López
 */

ntui.exports = function () {
  //components
  ntui.exports.Components = {};
  ntui.exports.Components.window = ntui.createElement(
    "div",
    {
      class: __internal.generateId(20)
    }
  )
  document.body.appendChild(ntui.exports.Components.window);

  //layout
  ntui.exports.Layout = {};
  ntui.exports.Layout.load = function (layout) {
    if (layout) {
      if(ntui.FileSystem.getFileExt(layout) === "html"){
        layout = ntui.createElement(
          "iframe",
          {
            src: layout,
            style: "display: none;"
          }
        )
        layout.onload = function(){
          if(layout.contentDocument.body.getElementsByTagName("Layout")[0]){
            var temp = layout.contentDocument.body.getElementsByTagName("Layout")[0];

            //TitleBar
            if(temp.getElementsByTagName("TitleBar")[0]){
              if(!ntui.exports.Components.titleBar){
                ntui.exports.Components.titleBar = ntui.createElement(
                  "div",
                  {
                    class: __internal.generateId(20)
                  }
                )
              }
              if(temp.getElementsByTagName("TitleBar")[0].getAttribute("style")){
                ntui.exports.Components.titleBar.setAttribute("style", temp.getElementsByTagName("TitleBar")[0].getAttribute("style"));
              }
              ntui.exports.Components.titleBar.innerHTML = temp.getElementsByTagName("TitleBar")[0].innerHTML;
              ntui.render(ntui.exports.Components.titleBar, ntui.exports.Components.window);

              

            }
          }else{
            console.warn("[ntui.exports] {Layout.load} An error occurred while parsing layout file.")
          }

          //CleanUp
          document.body.removeChild(layout);
        }
        document.body.appendChild(layout);
      }else{
        console.warn("[ntui.exports] {Layout.load} The layout file must be an html file.");
      }
    }
  }
}
