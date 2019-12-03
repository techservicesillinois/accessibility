/*
 * ARIA Popover Widget jQuery Plugin
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
/******* POPOVER v1.1 *****/
;(function($, window, document, undefined) {

   var pluginName = 'popover';
   var uuid = 0;

   var defaults = {
      'showOnFocus': false, // Display the popup on focus and hover
   };

   $.fn[pluginName] = function(options) {

      return this.each(function() {

         // check if element already has an instance
         if ($.data(this, 'aria_' + pluginName)) {
            return;
         }

         // create a new instance of the widget
         var inst = Object.create(popover);

          // store the object in the element's data
         $.data(this, 'aria_' + pluginName, inst);

         // Initialize the instance
         inst.init(this, options);
      });
   };

   var popover = {
      init: function(elem, options) {
         this.$trigger = $(elem);
         this.id = this.$trigger.prop('id');

         // merge and store options
         this.options = $.extend({}, defaults, options);

         this._buildWidget(); // build the widget
      },
      _buildWidget: function() {
         var thisObj = this;

         var expandedProp = this.$trigger.attr('aria-expanded');
         var controlsProp = this.$trigger.attr('aria-controls');
         var dataProp = this.$trigger.attr('data-popover');
         var dataPos = this.$trigger.attr('data-popoverpos');

         // Get the region dimensions
         var triggerDims = {
            width: this.$trigger.width(),
            height: this.$trigger.height()
         };
         // wrap the trigger in a span to facilitate absolute positioning
         this.$trigger.wrap('<span class="a11y-popover-wrap">');
         // check that the trigger has an id
         if (!this.id.length) {
            // Add a unique id to the trigger
            this.id = pluginName + (++uuid);
            this.$trigger.prop('id', this.id); 
         }

         // Add the button role to the trigger
         this.$trigger.attr('role', 'button');

         // check for either an aria-controls or a data-popover property
         if (typeof controlsProp === typeof undefined || controlsProp === false) {

               // aria-controls was not present - check for the data-popover property
               if (typeof dataProp === typeof undefined || dataProp === false) {
                  // No controllable region or content provided for popover - do nothing
                  return;
               }

               // Create the popover region
               this.$region = $('<span>')
                  .prop('id', this.id + '-region')
                  .addClass('a11y-popover-region')
                  .html(dataProp)
                  .insertAfter(this.$trigger);

               // associate the element with its region
               this.$trigger.attr('aria-controls', this.id + '-region');
         }
         else {
            // Store an object of the popup region
            this.$region = $('#' + controlsProp);
         }
         // hide the popover region
         this.$region.hide();

         // Get the region dimensions
         var regionDims = {
            width: this.$region.outerWidth(),
            height: this.$region.outerHeight()
         };

         // Ensure that aria-expanded is on the trigger
         if (typeof expandedProp === typeof undefined || expandedProp === false) {
               // aria-expanded was not present - add it and set to false
               this.$trigger.prop('aria-expanded', 'false');
         }
         this.bExpanded = this.$trigger.prop('aria-expanded') === 'true' ? true : false;

         // add tabindex to the trigger element and attach click and keydown handlers
         this.$trigger.prop('tabindex', '0')
            .on('click', function(e) {
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

         // If the user specified a popup position, set the position dynamically according to the position.
         // If none of the positioning classes are present, assume user supplied CSS
         if (this.$trigger.hasClass('a11y-popover-top')) {
            this.$region.addClass('a11y-popover-top').css({
               'top': '-' + (regionDims.height + 10) + 'px',
               'left': (triggerDims.width / 2 - 5) + 'px',
               'right': 'unset',
               'bottom': 'unset'
            });
         }
         else if (this.$trigger.hasClass('a11y-popover-left')) {
            this.$region.addClass('a11y-popover-left').css({
               'top': '-50%',
               'left': '-' + (regionDims.width) + 'px',
               'right': 'unset',
               'bottom': 'unset'
            });
         }
         else if (this.$trigger.hasClass('a11y-popover-right')) {
            this.$region.addClass('a11y-popover-right').css({
               'top': '-50%',
               'right': '-' + (regionDims.width) + 'px',
               'left': 'unset',
               'bottom': 'unset'
            });
         }
         else if (this.$trigger.hasClass('a11y-popover-bottom')) {
            this.$region.addClass('a11y-popover-bottom').css({
               'bottom': '-' + (regionDims.height + 10) + 'px',
               'left': (triggerDims.width / 2 - 5) + 'px',
               'top': 'unset',
               'right': 'unset'
            });
         }
      }, // end _BuildWidget()
      toggleRegion: function(bHide) {
         if (bHide || this.bExpanded) {
            this.$trigger.prop('aria-expanded', 'false');
            this.$region.hide();
            this.bExpanded = false;
         }
         else {
            this.$trigger.prop('aria-expanded', 'true');
            this.$region.show();
            this.bExpanded = true;
         }
      }
   };
})(jQuery, window, document); // END POPOVER
