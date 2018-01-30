var a11yBookmarklet = a11yBookmarklet || {};
a11yBookmarklet.bDone = false;
a11yBookmarklet.url = 'https://cites-illinois.github.io/accessibility/a11yinspector/';

function Inspect() {
      //a11yInspector.eventMode = "firefox";
      a11yInspector.eventMode = "fae-util";
      a11yInspector.init();

      a11yBookmarklet.bDone = true;
}

function getInspectCSS() {
   jQuery.get(a11yBookmarklet.url + 'inspect.css', function(css) {
      a11yBookmarklet.css = css;
      jQuery('<style>').html(css).appendTo('head');
   });
}
function getInspectScript() {
   jQuery.getScript(a11yBookmarklet.url + 'inspect.js', function(inspect) {
      a11yBookmarklet.inspect = inspect;
      Inspect();
   });
}

(function(){

	// the minimum version of jQuery we want
	var v = "1.10.2";

	// check prior inclusion and version
	if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
		var script = document.createElement("script");
		script.src = "https://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
		script.onload = script.onreadystatechange = function() {
			if (!a11yBookmarklet.bDone && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
            initMyBookmarklet();
			}
		};

		document.getElementsByTagName("head")[0].appendChild(script);

	} else {
      initMyBookmarklet();
	}
	
	function initMyBookmarklet() {

      (window.myBookmarklet = function() {

         //jQuery.noConflict(true);

         if (!a11yBookmarklet.bDone) {
            jQuery.getScript(a11yBookmarklet.url + 'library/oaa_a11y_evaluation.js', function(oaa_evaluation) {
               a11yBookmarklet.oaa_evaluation = oaa_evaluation;

               jQuery.getScript(a11yBookmarklet.url + 'library/oaa_a11y_rules.js', function(oaa_rules) {
                  a11yBookmarklet.oaa_rules = oaa_rules;

                  jQuery.getScript(a11yBookmarklet.url + 'library/oaa_a11y_rulesets.js', function(oaa_rulesets) {
                     a11yBookmarklet.oaa_rulesets = oaa_rulesets;

                     getInspectCSS();
                     getInspectScript();
                  });
               });
            });
         }
         else if (a11yInspector.bInitialized) {
            if (!a11yInspector.$panel.length) {
               a11yInspector.buildPanel();
            }
         }

      })();
	}

})();
