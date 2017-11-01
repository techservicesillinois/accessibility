//window.myBookmarklet = true;
var a11yBookmarklet = a11yBookmarklet || {};
a11yBookmarklet.bDone = false;
function Inspect() {
   if (!a11yBookmarklet.bDone
         && a11yBookmarklet.css
         && a11yBookmarklet.oaa_evaluation
         && a11yBookmarklet.oaa_rules
         && a11yBookmarklet.oaa_rulesets
         && a11yBookmarklet.inspect
   ) {

      // append css to head
      $('<style>').text(a11yBookmarklet.css).appendTo('head');

      a11yInspector.eventMode = "firefox";
      //a11yInspector.eventMode = "fae-util";
      a11yInspector.init();

      a11yBookmarklet.bDone = true;
   }
}

var evalScriptAttempt = 0;
function getOAAEvaluation() {
   $.getScript('http://localhost/a11yinspector/library/oaa_a11y_evaluation.js', function(oaa_evaluation) {
      a11yBookmarklet.oaa_evaluation = oaa_evaluation;
      Inspect();
   }).fail(function(jqxhr, settings, exception) {
      if(evalScriptAttempt < 10) {
         setTimeout(getOAAEvaluation, 40);
      }
      evalScriptAttempt++;
   });
}
var rulesScriptAttempt = 0;
function getOAARules() {
   $.getScript('http://localhost/a11yinspector/library/oaa_a11y_rules.js', function(oaa_rules) {
      a11yBookmarklet.oaa_rules = oaa_rules;
      Inspect();
   }).fail(function(jqxhr, settings, exception) {
      if(rulesScriptAttempt < 10) {
         setTimeout(getOAARules, 40);
      }
      rulesScriptAttempt++;
   });
}
var rulesetsScriptAttempt = 0;
function getOAARulesets() {
   $.getScript('http://localhost/a11yinspector/library/oaa_a11y_rulesets.js', function(oaa_rulesets) {
      a11yBookmarklet.oaa_rulesets = oaa_rulesets;
      Inspect();
   }).fail(function(jqxhr, settings, exception) {
      if(rulesetsScriptAttempt < 10) {
         setTimeout(getOAARulesets, 40);
      }
      rulesetsScriptAttempt++;
   });
}

function getInspectCSS() {
   $.get('http://localhost/a11yinspector/inspect.css', function(css) {
      a11yBookmarklet.css = css;
      Inspect();
   });
}
var inspectScriptAttempt = 0;
function getInspectScript() {
   $.getScript('http://localhost/a11yinspector/inspect.js', function(inspect) {
      a11yBookmarklet.inspect = inspect;
      Inspect();
   }).fail(function(jqxhr, settings, exception) {
      if(inspectScriptAttempt < 10) {
         setTimeout(getInspectScript, 40);
      } 
      inspectScriptAttempt++;
   });
}

(function(){

	// the minimum version of jQuery we want
	var v = "1.10.2";

	// check prior inclusion and version
	if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
		var script = document.createElement("script");
		script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
		script.onload = script.onreadystatechange = function() {
			if (!a11yBookmarklet.bDone && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
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

         getOAAEvaluation();
         getInspectCSS();
         getOAARules();
         getOAARulesets();
         getInspectScript();

      })();
	}

})();
