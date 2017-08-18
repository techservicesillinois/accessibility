/*
 * ARIA Slider Widget jQuery Plugin
 * Revision 1.2
 *
 * Created by Keith Hays
 *
 * Copyright 2017 Illinois Board of Trustees
 *
 */

// Utility
if (typeof Object.create !== 'function') {
   Object.create = function(obj) {
      function F() {};
      F.prototype = obj;
      return new F();
   };
}
/******* Simple Unique ID Generator ******/
;(function($, window, document, undefined) {
    var counter = 0;
    window.uniqueId = function(){
        return 'a11y' + counter++
    }
})(jQuery, window, document);


/******* SLIDER v1.2 *****/
;(function($, window, document, undefined) {

   var pluginName = 'showhide';

   var defaults = {
      'hide': false
   };

   $.fn[pluginName] = function(options) {

      return this.each(function() {

         // check if element already has an instance
         if ($.data(this, 'aria_' + pluginName)) {
            return;
         }

         // create a new instance of the widget
         var inst = Object.create(showhide);

          // store the object in the element's data
         $.data(this, 'aria_' + pluginName, inst);

         // Initialize the instance
         inst.init(this, options);
      });
   };

   var showhide = {
      init: function(elem, options) {
         this.$elem = $(elem);
         this.elem = elem;
         this.$region = $('#' + this.$elem.attr('aria-controls'));
         this.bExpanded = this.$elem.attr('aria-expanded') === 'true' ? true : false;

         this.keys = { // Define values for keycodes
            enter:       13,
            space:       32
         };

         // merge and store options
         this.options = $.extend({}, defaults, options);

         this._buildWidget(); // build the widget

         if (this.options.hide) {
            this.toggleRegion(true);
         }
      },
      _buildWidget: function() {
         var thisObj = this;

         thisObj.$elem.on('click', function(e) {
            thisObj.toggleRegion();
            return false;
         });

      }, // end _BuildWidget()
      toggleRegion: function(bHide) {
         bState = (typeof bState !== 'undefined') ? bState : false;

         if (bHide || this.bExpanded) {
            this.$elem.attr('aria-expanded', 'false');
            this.$region.attr('aria-hidden', 'true');
            this.bExpanded = false;
         }
         else {
            this.$elem.attr('aria-expanded', 'true');
            this.$region.attr('aria-hidden', 'false');
            this.bExpanded = true;
         }
      }
   };


})(jQuery, window, document); // END SLIDER
