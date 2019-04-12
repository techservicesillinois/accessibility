$.noConflict();
jQuery("document").ready(function($) {

$("#globalNavPageNavArea").attr("role", "banner")
    .find("table").attr("role", "presentation").removeAttr("summary");
$(".global-nav-bar-wrap").attr({
    "role": "navigation",    
    "aria-label": "Global"
});

$("#global-nav").removeAttr("role");

$("#global-nav-link").attr({
    "role": "menu",
    "aria-label": "Global Menu",
    "aria-owns": "global-nav-flyout"
});

$("#breadcrumbs").find("[role=navigation]").attr("aria-label", "Breadcrumbs");

$("#content").attr("role", "main");

$("#navigationPane").attr({
    "role": "complementary",
    "aria-label": "Navigation Sidebar"
});

$("#courseMenuPalette_contents").attr({
    "role": "navigation",
    "aria-label": "Course Menu"
    });

   var $rgnBtn = $("#rgn-button");
   var $rgnDiv = $("<div>");
   var $regions = $("[role]");
   var bShowing = false;

   $rgnBtn.on("click", function() {
      if (bShowing === false) {
         addStyles();
         addRegions();
         $("body").prepend($rgnDiv);
         $rgnBtn.html("Hide regions");
         bShowing = true;
      }
      else {
         $rgnDiv.empty().remove();
         $rgnBtn.html("Show regions").focus();
         bShowing = false;
      }
      return false;
   });

   function addStyles() {
      $rgnDiv.append("<style>"
         + "#rgn-button {position: fixed; left: 50%; top: 50%; z-index: 1300; background-color: #fff;}"
         + ".ap-region {padding: 0.125em; position: absolute; z-index: 1200; min-height: 2em;}"
         + ".ap-region p {margin: 0; font-size: 1.75em; color: #fff; text-shadow: 1px 1px 3px #000; text-align: center; text-transform: uppercase;}"
         + ".ap-region-main {background: rgba(50, 50, 50, 0.3); border: 1px solid rgb(50, 50, 50);}"
         + ".ap-region-banner {background: rgba(0, 0, 200, 0.1); border: 1px solid rgb(0, 0, 200);}"
         + ".ap-region-banner p {position: absolute; top: 50%; left: 50%;}"
         + ".ap-region-contentinfo {background: rgba(0, 200, 0, 0.3); border: 1px solid rgb(0, 200, 0);}"
         + ".ap-region-search {background: rgba(140, 20, 200, 0.3); border: 1px solid rgb(140, 20, 200); z-index: 1220;}"
         + ".ap-region-navigation {background: rgba(200, 0, 0, 0.3); border: 1px solid rgb(200,0,0); z-index: 1225;}"
         + ".ap-region-region {background: rgba(0, 100, 200, 0.3); border: 1px solid rgb(0, 100, 200); z-index: 1210;}"
         + ".ap-region-complementary {background: rgba(200, 100, 0, 0.3); border: 1px solid rgb(200, 100, 0); z-index: 1205;}"
         + "</style>"
      );
   }

   function addRegions() {

      if ($regions.length) {
         $regions.each(function(index) {
            var $this = $(this);
            var role = $this.attr("role");

            switch(role.toLowerCase()) {
               case "banner":
               case "complementary":
               case "contentinfo":
               case "main":
               case "navigation":
               case "region":
               case "search": {
                  var offset = $this.offset();
                  var height = $this.css("height");
                  var width = $this.css("width");
                  var label = "";

                  var $rgn = $("<div>")
                     .addClass("ap-region ap-rgn-" + role )
                     .css({
                        "top": offset.top + "px",
                        "left": offset.left + "px",
                        "height": height,
                        "width": width
                     });

                  if ($this.attr("aria-label")) {
                     label = "&quot;" + $this.attr("aria-label") + "&quot; ";
                  }
                  else if ($this.attr("aria-labelledby")) {
                     var id = $this.attr("aria-labelledby");
                     label = "&quot;" + $("#" + id).text() + "&quot; ";
                  }

              $rgn.html("<p>" + label + role + "</p>")
                        .addClass("ap-region-" + role);

                  $rgnDiv.append($rgn);
               }
            }

         });
      }
   }
});
