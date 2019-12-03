/*
 * ARIA Accordion Widget jQuery Plugin
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

/******* ACCORDION v1.1 *****/
;(function($, window, document, undefined) {

   var pluginName = 'accordion';

   var defaults = {
      'collapse': true, // ignore default aria-expanded state in page and collapse all panels
      'noArrows': false, // turn off arrow key support for moving between header buttons
   };

   $.fn[pluginName] = function(options) {

      return this.each(function() {

         // check if element already has an instance
         if ($.data(this, 'aria_' + pluginName)) {
            return;
         }

         // create a new instance of the widget
         var inst = Object.create(accordion);

          // store the object in the element's data
         $.data(this, 'aria_' + pluginName, inst);

         // Initialize the instance
         inst.init(this, options);
      });
   };

   var accordion = {
      init: function(elem, options) {
         this.$group = $(elem);
         this.$headers = $('.accordion-trigger').not('.accordion-panel .accordion-trigger'); // get all first level triggers and skip any nested ones

         // merge and store options
         this.options = $.extend({}, defaults, options);

         if (this.$group.hasClass('accordion-nocollapse')) {
            this.options.collapse = false;
         }

         if (this.$group.hasClass('accordion-arrows')) {
            this.options.noArrows = false;
         }

         this._buildWidget(); // build the widget

         // Set the initial collapse state
         var thisObj = this;
         this.$headers.each(function() {
            var $item = $(this);

            if ($item.attr('aria-expanded') === 'false') {
               $('#' + $item.attr('aria-controls')).hide();
            }
            else if (thisObj.options.collapse) {
               thisObj.togglePanel($item);
            }
         });
      },
      _buildWidget: function() {
         var thisObj = this;

         thisObj.$headers.each(function() {
            var $item = $(this);
            var expandedAttr = $item.attr('aria-expanded');

            // ensure that aria-expanded is present on the header trigger
            if (typeof expandedAttr === typeof undefined || expandedAttr === false) {
               // aria-expanded was not present - add it and set to false (unless collapse is false)
               $item.attr('aria-expanded', !thisObj.options.collapse);

            }
         });

         thisObj.$headers.append('<div class="accordion-plus"></div>') // add the visual indicators of the collapse state to the header buttons
            .on('click', function(e) { // toggle a panel if it's trigger is clicked
               thisObj.togglePanel(jQuery(this));
               return false;
            })
            .on('keydown', function(e) { // add arrow key support to the triggers -- default is to use arrow keys
               if (thisObj.options.noArrows) { // arrow key support not specified
                  return true;
               }
               return thisObj._handleKeydown(e);
            });
         thisObj.$group.on('focusin', function(e) { // add highlight styling to the widget if any element in it gains focus
            $(this).addClass('focused');
            return true;
         })
         .on('focusout', function(e) { // remove widget highlight when elements lose focus
            $(this).removeClass('focused');
            return true;
         });
      }, // end _BuildWidget()
      _isExpanded: function($elem) {
         return ($elem.attr('aria-expanded') === 'true');
      },
      _widgetCollapsed: function() {
         var bCollapsed = true;

         this.$headers.each(function() {
            if ($(this).attr('aria-expanded') === 'true') {
               bCollapsed = false;
            }
         });

         return bCollapsed;
      },
      _handleKeydown: function(e) {
         var hdrIndex = this.$headers.index($(e.target));

         switch (e.key) { // implement arrow key support
            case 'ArrowUp': {
               if (hdrIndex > 0) { // move to previous header button if there is one
                  this.$headers.get(hdrIndex-1).focus();
               }
               return false;
            }
            case 'ArrowDown': {
               if (hdrIndex < this.$headers.length-1) { // move to next header button if there is one
                  this.$headers.get(hdrIndex+1).focus();
               }
               return false;
            }
            case 'End': {
               this.$headers.last().focus();
               return false;
            }
            case 'Home': {
               this.$headers.first().focus();
               return false;
            }
         }

         return true;
      },
      collapseAll: function() {
         this.$headers.each(function() {
            var $item = $(this);

            $item.attr('aria-expanded','false');
            $('#' + $item.attr('aria-controls')).hide();
         });
      },
      expandAll: function() {
         this.$headers.each(function() {
            var $item = $(this);

            $item.attr('aria-expanded','true');
            $('#' + $item.attr('aria-controls')).show();
         });
      },
      togglePanel: function($curHeader) {
         var $panel = $('#' + $curHeader.attr('aria-controls'));

         if (this._isExpanded($curHeader)) { // collapse this panel
            $curHeader.attr('aria-expanded', 'false');
            $panel.hide();

            // if all panels collapsed, trigger collapsed event
            if (this._widgetCollapsed()) {
               this.$group.trigger('accordion-collapsed');
            }
         }
         else { // expand this panel and collapse all others
            $curHeader.attr('aria-expanded', 'true');
            $panel.show();

            this.$headers.not($curHeader).each(function() {
               var $thisTrigger = $(this);
               var $thisPanel = $('#' + $thisTrigger.attr('aria-controls'));

               $(this).attr('aria-expanded', 'false');
               $thisPanel.hide();
            });
         }
      }
   };


})(jQuery, window, document); // END ACCORDIAN
