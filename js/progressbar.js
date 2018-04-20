var intervalID = null;
var progBar = null;
var $progBtn;
var bProgStarted = false;
var bProgElStarted = false;
var hProgElInterval = null;
var progElBtn = document.getElementById("prog1-start");
var progElem = document.getElementById("prog1");

function doElProg() {
   
   if (!bProgElStarted) { // example not running
      if (parseInt(progElem.getAttribute("value")) !== parseInt(progElem.getAttribute("max"))) {
         hProgElInterval = setInterval(function() {

            var val = parseInt(progElem.getAttribute('value'));
            var max = parseInt(progElem.getAttribute('max'));
         
            if (val < max) {
               progElem.setAttribute("value", val+10);
            }
            else {
               clearInterval(hProgElInterval);
               progElBtn.innerHTML = "Reset Progress Element"
               bProgElStarted = false;
            }
         }, 500);
         
         progElBtn.innerHTML = "Stop Progress Element";
         bProgElStarted = true;
      }
      else {
         progElem.setAttribute("value", 0);
         progElBtn.innerHTML = "Start Progress Element";
         bProgElStarted = false;
      }
   }
   else { // example is running
      clearInterval(hProgElInterval);
      progElBtn.innerHTML = "Start Progress Element";
      bProgElStarted = false;
   }
}

function doProgress() {
   if (!progBar.isMax()) {
      progBar.increment();
   }
   else {
      clearInterval(intervalID);
      $progBtn.html("Reset Progressbar");
      bProgStarted = false;
   }
}
 /////////// End Progressbar Globals ///////////////

jQuery(document).ready(function () {

 /////////// Progressbar ///////////////
 
   progBar = new progressbar(jQuery("[role=progressbar]"), 1);

   $progBtn = jQuery("#progress-start").on("click", function(e) {

      if (bProgStarted) { // the example is running
         $progBtn.html("Start Progressbar");

         clearInterval(intervalID);
         bProgStarted = false;
      }
      else { // the example is not running
         if (progBar.isMax()) {
            progBar.reset();
            $progBtn.html("Start Progressbar");
         }
         else {
            intervalID = setInterval("doProgress()", 80);
            $progBtn.html("Stop Progressbar");

            bProgStarted = true;
         }
      }

      return false;
   });


   function progressbar($elem, inc) {

      this.$elem = $elem;
      this.valuemin = parseInt($elem.attr('aria-valuemin'));
      this.valuemax = parseInt($elem.attr('aria-valuemax'));
      this.valuenow = parseInt($elem.attr('aria-valuenow'));
      this.incAmt = inc;

      this.$fill = jQuery("<span>")
         .addClass('pbar-fill')
         .css('width', this.valuenow + "%");

      this.$elem.append(this.$fill);
   }

   progressbar.prototype.reset = function() {
      this.$fill.css('width', this.valuemin);
      this.$elem.attr("aria-valuenow", this.valuemin);
      this.valuenow = this.valuemin;
   };

   progressbar.prototype.increment = function() {

      if (!this.isMax()) {

         this.valuenow += this.incAmt;
         this.$elem.attr("aria-valuenow", this.valuenow);

         this.$fill.css('width', this.valuenow + "%");
      }
   };

   progressbar.prototype.isMax = function() {
      if (this.valuenow >= this.valuemax) {
         return true;
      }
      return false;
   }
});
