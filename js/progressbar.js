var intervalID = null;
var progBar = null;
var $progBtn;
var bProgStarted = false;

function doProgress() {
   if (!progBar.isMax()) {
      progBar.increment();
   }
   else {
      clearInterval(intervalID);
      $progBtn.html("Reset Example");
      bProgStarted = false;
   }
}
 /////////// End Progressbar Globals ///////////////

jQuery(document).ready(function () {

 /////////// Progressbar ///////////////
 
   progBar = new progressbar(jQuery("[role=progressbar]"), 10);

   $progBtn = jQuery("#progress-start").on("click", function(e) {

      if (bProgStarted) { // the example is running
         $progBtn.html("Start Example");

         clearInterval(intervalID);
         bProgStarted = false;
      }
      else { // the example is not running
         if (progBar.isMax()) {
            progBar.reset();
            $progBtn.html("Start Progressbar");
         }
         else {
            intervalID = setInterval("doProgress()", 500);
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
