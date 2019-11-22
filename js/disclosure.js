/*
 * ARIA Disclosure Widget jQuery Plugin
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
        return 'a11y' + counter++;
    };
})(jQuery, window, document);


/******* DISCLOSURE v1.2 *****/
;(function($, window, document, undefined) {

   var pluginName = 'disclosure';

   var defaults = {
      'hide': false, // Hide the region by default whent true
      'fail': false // demonstrate a failed implementation pattern
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

         // merge and store options
         this.options = $.extend({}, defaults, options);

         if (this.options.fail) {
            this.bExpanded = this.$region.attr('aria-expanded') === 'true' ? true : false;
         }
         else {
            this.bExpanded = this.$elem.attr('aria-expanded') === 'true' ? true : false;
         }

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
         })
         .on('keydown', function(e) {
            // Add keydown handler toggle with enter and space. Note that HTML buttons have this
            // built-in by default. This allows links and custom buttons to function
            if (e.key === " " || e.key === 'Enter') {
               thisObj.toggleRegion();
               return false;
            }
            return true;
         });


      }, // end _BuildWidget()
      toggleRegion: function(bHide) {
         bState = (typeof bState !== 'undefined') ? bState : false;

         if (bHide || this.bExpanded) {
            if (this.options.fail) {
               this.$region.attr('aria-expanded', 'false');
            }
            else {
               this.$elem.attr('aria-expanded', 'false');
            }

            this.$region.hide();
            this.bExpanded = false;
         }
         else {
            if (this.options.fail) {
               this.$region.attr('aria-expanded', 'true');
            }
            else {
               this.$elem.attr('aria-expanded', 'true');
            }

            this.$region.show();
            this.bExpanded = true;
         }
      }
   };


})(jQuery, window, document); // END DISCLOSURE
