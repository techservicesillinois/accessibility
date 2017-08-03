/*
 * ARIA Tab Panel Widget jQuery Plugin
 * Revision 1.1
 *
 * Created by Keith hays
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

/********* TABPANEL v1.1 *********/
;(function($, window, document, undefined) {

   var pluginName = 'tabpanel';

   var defaults = {
      multiselect: false,
      cues: "You can use the arrow, home and end keys to change tabs."
   };

   $.fn[pluginName] = function(options) {

      return this.each(function() {

         // check if element already has an instance
         if ($.data(this, 'aria_' + pluginName)) {
            return;
         }

         // create a new instance of the widget
         var inst = Object.create(tabpanel);

          // store the object in the element's data
         $.data(this, 'aria_' + pluginName, inst);

         // Initialize the instance
         inst.init(this, options);
      });
   };

   var tabpanel = {
      init: function(elem, options) {
         this.$elem = $(elem);
         this.elem = elem;
         this.keys = { // Define values for keycodes
            pageup:     33,
            pagedown:   34,
            end:        35,
            home:       36,
            left:       37,
            up:         38,
            right:      39,
            down:       40,
         };

         this.bHideCue = false;

         // merge and store options
         this.options = $.extend({}, defaults, options);

         this._buildWidget(); // build the tabpanel
      },
      _buildWidget: function() {
         var thisObj = this;
         this.$tablist = this.$elem;
         this.$tabs = this.$elem.find('.tab');

         // make sure user did not attach widget to container
         if (!this.$tablist.hasClass('tablist')) {
            this.$tablist = this.$elem.find('.tablist');
         }

         // Create the instruction tooltip
         this.$cue = $('<div>')
            .attr('aria-hidden', 'true')
            .addClass('widget-cue')
            .html(this.options.cues)
            .insertBefore(this.$tablist);

         // position the cue above the widget
         this.$cue.css('top', (parseInt(this.$cue.outerHeight()) / parseInt(this.$cue.css('font-size')) + 0.2)*(-1) + 'em');

         // add tablist markup
         this.$tablist.attr('role', 'tablist')
            .on('focusin', function(e) {
               if (!thisObj.bHideCue) {
                  thisObj.$cue.addClass('cue-visible');
               }
               return false;
            })
            .on('focusout', function(e) {
               if (!thisObj.bHideCue) {
                  thisObj.$cue.removeClass('cue-visible');
               }
               //thisObj.bHideCue = false; 
               return false;
            });

         this.$panels = this.$tablist.parent().find('.tabpanel');

         // add tab markup
         this.$tabs.each(function(index) {
            var $tab = $(this);

            $tab.attr({
               'role': 'tab',
               'aria-selected': (index == 0),
               'aria-controls': $tab.attr('id') + '-panel',
               'tabindex': (index == 0) ? '0' : '-1'
            });
         })
         .on('keydown', function(e) {
            var $item = $(e.target);

            switch(e.keyCode) {
               case thisObj.keys.left: {
                  thisObj._selectPrev($item);
                  thisObj.$cue.removeClass('cue-visible');
                  thisObj.bHideCue = true;
                  return false;
               }
               case thisObj.keys.right: {
                  thisObj._selectNext($item);
                  thisObj.$cue.removeClass('cue-visible');
                  thisObj.bHideCue = true;
                  return false;
               }
               case thisObj.keys.home: {
                  thisObj._selectTab(thisObj.$tabs.first());
                  thisObj.$cue.removeClass('cue-visible');
                  thisObj.bHideCue = true;
                  return false;
               }
               case thisObj.keys.end: {
                  thisObj._selectTab(thisObj.$tabs.last());
                  thisObj.$cue.removeClass('cue-visible');
                  thisObj.bHideCue = true;
                  return false;
               }
            }

            return true;
         })
         .on('click', function(e) {
            thisObj._selectTab($(e.target));
            return false;
         })
         .on('touchstart, mousedown', function(e) {
            thisObj.bHideCue = true;
            thisObj.$cue.removeClass('cue-visible');
            return true;
         });

         // add panel markup
         var panelHeight = -1;

         this.$panels.each(function(index) {
            var $panel = $(this);

            $panel.attr({
               'role': 'tabpanel',
               'aria-hidden': !(index == 0),
               'aria-labelledy': $panel.attr('id').split('-')[0]
            });

            if ($panel.outerHeight() > panelHeight)  {
               panelHeight = $panel.outerHeight();
            }
         })
         .css('height', (panelHeight / parseInt(this.$panels.first().css('font-size'))) + 'em'); 


      }, // end _BuildWidget()
      _selectTab: function($item) {
            var $panel = $('#' + $item.attr('aria-controls'));

            this.$tabs.attr({ // update tab attributes
               'aria-selected': 'false',
               'tabindex': '-1'
            });

            this.$panels.attr({ // hide all the panels
               'aria-hidden': 'true',
            });

            $panel.attr({ // update new panel attributes
               'aria-hidden': 'false'
            });

            $item.attr({ // update new tab attributes
               'aria-selected': 'true',
               'tabindex': '0'
            })
            .focus(); // set focus on new tab
      },
      _selectNext: function($item) {
         var $next = $item.next();

         if (this.$tabs.index($item) == this.$tabs.length-1) {
            $next = this.$tabs.first();
         }

         var $panel = $('#' + $next.attr('aria-controls'));
         this._selectTab($next);
      },
      _selectPrev: function($item) {
         var $prev = $item.prev();

         if (this.$tabs.index($item) == 0) {
            var $prev = this.$tabs.last();
         }

         var $panel = $('#' + $prev.attr('aria-controls'));
         this._selectTab($prev);
      },
   };
})(jQuery, window, document); // END TABPANEL
