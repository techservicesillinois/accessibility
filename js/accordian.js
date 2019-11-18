/*
 * ARIA Accordian Widget jQuery Plugin
 * Revision 1.1
 *
 * Created by Keith Hays
 *
 * Copyright 2019 Illinois Board of Trustees
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

   var pluginName = 'accordian';

   var defaults = {
      'collapse': false
   };

   $.fn[pluginName] = function(options) {

      return this.each(function() {

         // check if element already has an instance
         if ($.data(this, 'aria_' + pluginName)) {
            return;
         }

         // create a new instance of the widget
         var inst = Object.create(accordian);

          // store the object in the element's data
         $.data(this, 'aria_' + pluginName, inst);

         // Initialize the instance
         inst.init(this, options);
      });
   };

   var accordian = {
      init: function(elem, options) {
         this.$group = $(elem);
         this.group = elem;
         this.$triggers = $('.accordian-trigger');

         this.keys = { // Define values for keycodes
            tab:      9,
            enter:    13,
            space:    32,
            up:       38,
            down:     40
         };

         // merge and store options
         this.options = $.extend({}, defaults, options);

         this._buildWidget(); // build the widget

         var thisObj = this;
         if (!this.options.collapse) {
            this.$triggers.not(this.$triggers.first()).each(function() {
               thisObj.togglePanel($(this));
            });
         }
         else {
            this.$triggers.each(function() {
               thisObj.togglePanel($(this));
            });
         }
      },
      _buildWidget: function() {
         var thisObj = this;

         thisObj.$triggers.append('<div class="accordian-plus"></div>')
            .on('click', function(e) {
               thisObj.togglePanel(jQuery(this));
               return false;
            });
         thisObj.$group.on('focusin', function(e) {
            $(this).addClass('focused');
            return true;
         })
         .on('focusout', function(e) {
            $(this).removeClass('focused');
            return true;
         });
      }, // end _BuildWidget()
      _isExpanded: function($elem) {
         return ($elem.attr('aria-expanded') === 'true');
      },
      togglePanel: function($trigger) {
         var $panel = $('#' + $trigger.attr('aria-controls'));

         if (this._isExpanded($trigger)) { // collapse this panel
            $trigger.attr('aria-expanded', 'false');
            $panel.hide();
         }
         else { // expand this panel and collapse all others
            $trigger.attr('aria-expanded', 'true');
            $panel.show();

            this.$triggers.not($trigger).each(function() {
               var $thisTrigger = $(this);
               var $thisPanel = $('#' + $thisTrigger.attr('aria-controls'));

               $(this).attr('aria-expanded', 'false');
               $thisPanel.hide();
            });
         }
      }
   };


})(jQuery, window, document); // END ACCORDIAN
