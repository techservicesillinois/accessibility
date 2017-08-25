/*
 * ARIA Treeview Widget jQuery Plugin
 * Revision 1.2
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

/********* TREEVIEW v1.2 *********/
;(function($, window, document, undefined) {

   var pluginName = 'treeview';

   var defaults = {
      collapsed: true,
      followFocus: true,
      multiselectable: false,
      selectParents: false,
      showCheckboxes: true,
      touchInterval: 400,
      cues: "You can use the arrow keys to navigate between items in the tree.<br>Use enter or space to expand or collapse items."
   };

   $.fn[pluginName] = function(options) {
      var bMethodCall = typeof options === 'string';
      var args = Array.prototype.slice.call(arguments, 1);
      var returnVal = this;
      var thisObj = this;

      if (bMethodCall) {
         // Call only public methods
         
         this.each(function() {
            var methodVal;
            var inst = $.data(this, 'aria_' + pluginName);

            if (!inst) {
               return $.error('Canot call methods on ' + pluginName + ' prior to initialization; '
                  + 'Attempted call to method "' + options + '".');
            }

            if (options === 'init') {
               return $.error('Canot call init method on ' + pluginName + 'instance.');
            }

            if (!$.isFunction(inst[options]) || options.charAt(0) === '_') {
               return $.error('No such method ' + options + ' for ' + pluginName + ' instance.');
            }

            methodVal = inst[options].apply(inst, args);

            if (methodVal !== inst && methodVal !== undefined) {
               returnVal = methodVal;
            }
         });

         return returnVal;
      }
      else if (options === undefined || typeof options === 'object') {
         return this.each(function() {

            // check if element already has an instance
            if ($.data(this, 'aria_' + pluginName)) {
               return;
            }

            // create a new instance of the widget
            var inst = Object.create(treeview);

             // store the object in the element's data
            $.data(this, 'aria_' + pluginName, inst);

            // Initialize the instance
            inst.init(this, options);
         });
      }
   };

   var treeview = {
      init: function(elem, options) {
         this.$elem = $(elem);
         this.elem = elem;
         this.uuid = uniqueId();
         this.keys = { // Define values for keycodes
            tab:        9,
            enter:      13,
            space:      32,
            pageup:     33,
            pagedown:   34,
            end:        35,
            home:       36,
            left:       37,
            up:         38,
            right:      39,
            down:       40,
            asterisk:   106
         };

         this.imgCollapsed ="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjAuMiwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxNiAxNiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTYgMTY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRkZGRkZGO3N0cm9rZTojMDAwMDAwO3N0cm9rZS1taXRlcmxpbWl0OjEwO30KCS5zdDF7ZmlsbDpub25lO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1taXRlcmxpbWl0OjEwO30KPC9zdHlsZT4KPHJlY3QgeD0iMC41IiB5PSIwLjUiIGNsYXNzPSJzdDAiIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIvPgo8bGluZSBjbGFzcz0ic3QxIiB4MT0iMi40IiB5MT0iOCIgeDI9IjEzLjYiIHkyPSI4Ii8+CjxsaW5lIGNsYXNzPSJzdDEiIHgxPSI4IiB5MT0iMi40IiB4Mj0iOCIgeTI9IjEzLjYiLz4KPC9zdmc+Cg==";

         this.imgExpanded = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjAuMiwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxNiAxNiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTYgMTY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRkZGRkZGO3N0cm9rZTojMDAwMDAwO3N0cm9rZS1taXRlcmxpbWl0OjEwO30KCS5zdDF7ZmlsbDpub25lO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1taXRlcmxpbWl0OjEwO30KPC9zdHlsZT4KPHJlY3QgeD0iMC41IiB5PSIwLjUiIGNsYXNzPSJzdDAiIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIvPgo8bGluZSBjbGFzcz0ic3QxIiB4MT0iMi40IiB5MT0iOCIgeDI9IjEzLjYiIHkyPSI4Ii8+Cjwvc3ZnPgo=";

         this.imgNotChecked = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjAuMiwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiBoZWlnaHQ9IjE2cHgiIHdpZHRoPSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU+CjxnPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTUsMTUuNWMtMi41LDAtNC41LTItNC41LTQuNVY1YzAtMi41LDItNC41LDQuNS00LjVoNmMyLjUsMCw0LjUsMiw0LjUsNC41djZjMCwyLjUtMiw0LjUtNC41LDQuNUg1eiIvPgoJPHBhdGggZD0iTTExLDFjMi4yLDAsNCwxLjgsNCw0djZjMCwyLjItMS44LDQtNCw0SDVjLTIuMiwwLTQtMS44LTQtNFY1YzAtMi4yLDEuOC00LDQtNEgxMSBNMTEsMEg1QzIuMiwwLDAsMi4yLDAsNXY2CgkJYzAsMi44LDIuMiw1LDUsNWg2YzIuOCwwLDUtMi4yLDUtNVY1QzE2LDIuMiwxMy44LDAsMTEsMEwxMSwweiIvPgo8L2c+Cjwvc3ZnPgo=";

         this.imgChecked = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjAuMiwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiBoZWlnaHQ9IjE2cHgiIHdpZHRoPSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9CgkuY2hlY2ttYXJre2ZpbGw6bm9uZTtzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MjtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cjwvc3R5bGU+CjxnPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTUsMTUuNWMtMi41LDAtNC41LTItNC41LTQuNVY1YzAtMi41LDItNC41LDQuNS00LjVoNmMyLjUsMCw0LjUsMiw0LjUsNC41djZjMCwyLjUtMiw0LjUtNC41LDQuNUg1eiIvPgoJPHBhdGggZD0iTTExLDFjMi4yLDAsNCwxLjgsNCw0djZjMCwyLjItMS44LDQtNCw0SDVjLTIuMiwwLTQtMS44LTQtNFY1YzAtMi4yLDEuOC00LDQtNEgxMSBNMTEsMEg1QzIuMiwwLDAsMi4yLDAsNXY2CgkJYzAsMi44LDIuMiw1LDUsNWg2YzIuOCwwLDUtMi4yLDUtNVY1QzE2LDIuMiwxMy44LDAsMTEsMEwxMSwweiIvPgo8L2c+CjxnIGlkPSJjaGVjayI+Cgk8Zz4KCQk8bGluZSBjbGFzcz0iY2hlY2ttYXJrIiB4MT0iMy4yIiB5MT0iMy4zIiB4Mj0iMTIuNyIgeTI9IjEyLjgiLz4KCTwvZz4KCTxnPgoJCTxsaW5lIGNsYXNzPSJjaGVja21hcmsiIHgxPSIxMi43IiB5MT0iMy4zIiB4Mj0iMy4yIiB5Mj0iMTIuOCIvPgoJPC9nPgo8L2c+Cjwvc3ZnPgo=";

         this.imgMixed = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4uc3Qwe2ZpbGw6I0ZGRkZGRjt9LnN0MXtmaWxsOiM3MDczNzI7fTwvc3R5bGU+PGc+PHBhdGggY2xhc3M9InN0MCIgZD0iTTUsMTUuNWMtMi41LDAtNC41LTItNC41LTQuNVY1YzAtMi41LDItNC41LDQuNS00LjVoNmMyLjUsMCw0LjUsMiw0LjUsNC41djZjMCwyLjUtMiw0LjUtNC41LDQuNUg1eiIvPjxwYXRoIGQ9Ik0xMSwxYzIuMiwwLDQsMS44LDQsNHY2YzAsMi4yLTEuOCw0LTQsNEg1Yy0yLjIsMC00LTEuOC00LTRWNWMwLTIuMiwxLjgtNCw0LTRIMTEgTTExLDBINUMyLjIsMCwwLDIuMiwwLDV2NmMwLDIuOCwyLjIsNSw1LDVoNmMyLjgsMCw1LTIuMiw1LTVWNUMxNiwyLjIsMTMuOCwwLDExLDBMMTEsMHoiLz48L2c+PGc+PHBhdGggY2xhc3M9InN0MSIgZD0iTTUuNiwxMy44Yy0xLjksMC0zLjUtMS41LTMuNS0zLjVWNS43YzAtMS45LDEuNS0zLjUsMy41LTMuNWg0LjZjMS45LDAsMy41LDEuNSwzLjUsMy41djQuNmMwLDEuOS0xLjUsMy41LTMuNSwzLjVINS42eiIvPjwvZz48L3N2Zz4="

         this.bClicked = false;
         this.bLongTouch = false;

         this.selected = $();
         this.$parentNodes = $();
         this.$prevToggled = $();

         // merge and store options
         this.options = $.extend({}, defaults, options);

         this._buildTree(); // build the treeview
      },
      _buildTree: function() {
         var thisObj = this;
         this.$groups = this.$elem.find('ul');
         this.$nodes = this.$elem.find('li');
         
          // Create the instruction tooltip
         this.$cue = $('<div>')
            .attr('aria-hidden', 'true')
            .addClass('widget-cue')
            .html(this.options.cues)
            .insertBefore(this.$elem);

        // position the cue above the widget
        this.$cue.css('top', (parseInt(this.$cue.outerHeight()) / parseInt(this.$cue.css('font-size')) + 0.2)*(-1) + 'em');

         // Add treeview role
         this.$elem.attr('role', 'tree')
            .on('focusin', function(e) {
               if (!thisObj.bClicked) {
                  thisObj.$cue.addClass('cue-visible');
               }
               return false;
            })
            .on('focusout', function(e) {
               thisObj.$cue.removeClass('cue-visible');
               thisObj.bclicked = false;
               return false;
            });

         // Add group markup
         this.$groups.attr({
            'role': 'group',
            'aria-hidden': this.options.collapsed
         });

         var $children = this.$elem.children('li');
         $children.each(function(index) {
            $(this).attr({
               'role': 'treeitem',
               'aria-level': 1,
               'aria-setsize': $children.length,
               'aria-posinset': index+1,
               'tabindex': (index == 0 ? '0' : '-1')
            });

            if (thisObj.options.multiselectable) {
               $(this).attr('aria-checked', 'false');
            }
         });

         this.$groups.each(function(grpNdx) {
            $children = $(this).children('li');
            var level = $(this).parentsUntil('ul.tree', 'ul').length + 1;

            $children.each(function(nodeNdx) {
               $(this).attr({
                  'role': 'treeitem',
                  'aria-level': level,
                  'aria-setsize': $children.length,
                  'aria-posinset': nodeNdx+1,
                  'tabindex': -1
               });

               if (thisObj.options.multiselectable) {
                  $(this).attr('aria-checked', 'false');
               }
            });

         });

         // Add node markup
         this.$nodes.each(function(index) {
            var $node = $(this);
            var $child = $node.find('ul').first();

            if (thisObj.options.multiselectable && thisObj.options.showCheckboxes) {
               $node.prepend('<img class="treeview-chkbox" src="' + thisObj.imgNotChecked + '" alt="">');
            }

            if ($child.length) {
               // parent node
               $node
                  .addClass('parent')
                  .attr({
                     'aria-expanded': !thisObj.options.collapsed,
                  })
                  .prepend('<img class="treeview-img" src="' + thisObj.imgCollapsed + '" alt="">');

                  thisObj.$parentNodes = thisObj.$parentNodes.add($node);
            }

            if (thisObj.multiselectable) {
               thisObj.nodeStates[index] = $node.attr('aria-checked');
            }
         })
         .on('mousedown', function(e) {
            thisObj.bClicked = true;
            thisObj._handleClick($(e.target));

            return false;
         })
         .on('touchstart', function(e) {
            thisObj.bClicked = true;

            thisObj.touchTimer = setTimeout(function() {
               thisObj.bLongTouch = true;
            }, thisObj.options.touchInterval);
            return false;
         })
         .on('touchend', function(e) {
            clearTimeout(thisObj.touchTimer);
            thisObj.touchTimer = null;

            thisObj._handleClick($(e.target));
            return false;
         })
         .on('keydown', function(e) {
            var $node = $(e.target);

            if ($node.is ('span')) {
               $node = $node.parent();
            }

            switch(e.keyCode) {
               case thisObj.keys.space: {
                  if (thisObj.options.multiselectable) { // toggle selection
                     thisObj._toggleSelection($node);
                     this.$prevToggled = $node;
                     return false;
                  }
               }
               case thisObj.keys.enter: {

                  thisObj.$cue.removeClass('cue-visible');

                  if ($node.hasClass('parent')) {
                     thisObj._toggleGroup($node);
                  }

                  return false;
               }
               case thisObj.keys.down: {
                  thisObj._moveToNext($node);
                  thisObj.$cue.removeClass('cue-visible');
                  return false;
               }
               case thisObj.keys.up: {
                  thisObj._moveToPrev($node);
                  thisObj.$cue.removeClass('cue-visible');
                  return false;
               }
               case thisObj.keys.left: {
                  thisObj._moveUp($node);
                  thisObj.$cue.removeClass('cue-visible');
                  return false;
               }
               case thisObj.keys.right: {
                  thisObj._moveDown($node);
                  thisObj.$cue.removeClass('cue-visible');
                  return false;
               }
               case thisObj.keys.home: {
                  thisObj._moveToFirst();
                  thisObj.$cue.removeClass('cue-visible');
                  return false;
               }
               case thisObj.keys.end: {
                  thisObj._moveToLast();
                  thisObj.$cue.removeClass('cue-visible');
                  return false;
               }
            }
            return true;
         })
         .on('focus', function(e) {
            var $node = $(e.target);

            if ($node.is ('span')) {
               $node = $node.parent();
            }

            if (!thisObj.options.multiselectable && thisObj.options.followFocus) {
               thisObj._selectNode($node);
            }

            return false;
         });

         if (this.options.multiselectable) {

            this.nodeStates = new Array(this.$nodes.length);
            this._storeNodeStates();

            if (this.options.showCheckboxes) {
               this.$chkBoxes = this.$elem.find('.treeview-chkbox');
            }
         }

      }, // end _BuildTree()
      getValue: function() {
         var value = [];

         this.$selected.each(function(index) {
            value.push($(this).attr('data-value'));
         });

         return value;
      },
      _handleClick: function($target) {
         var $node = $();

         if ($target.is ('span') || $target.is('img')) {
            $node = $target.parent();
         }


         this.$nodes.not($node).attr('tabindex', '-1');
         $node.attr('tabindex', '0');

         if (this.options.multiselectable) {
            if (($target.is('span') || $target.is('.treeview-chkbox')) && !this.bLongTouch) {
               this._toggleSelection($node);
               this.$prevToggled = $node;
               return false;
            }

            this.bLongTouch = false;
         }
         else if (this.options.followFocus) {
            this._selectNode($node);
         }

         if ($node.hasClass('parent')) {
            this._toggleGroup($node);
         }

         $node.focus();
      },
      _moveDown: function($node) {
         if ($node.hasClass('parent')) {
            if ($node.attr('aria-expanded') == 'false') {
               this._toggleGroup($node);
               return;
            }

            var $child = $node.find('[role=treeitem]').first();

            if ($child.length) {
               this.$nodes.attr('tabindex', '-1');
               $child.attr('tabindex', '0').focus();
            }
         }
      },
      _moveToFirst: function() {
         this.$nodes
            .attr('tabindex', '-1')
            .first().attr('tabindex', '0').focus();
      },
      _moveToLast: function() {
         this.$nodes.filter(':visible')
            .attr('tabindex', '-1')
            .last().attr('tabindex', '0').focus();
      },
      _moveToNext: function($node) {
         var $siblings = $node.siblings().addBack();

         if ($siblings.index($node) < ($siblings.length-1)) {
            var $newNode = $node.next('[role=treeitem]');

            this.$nodes.attr('tabindex', '-1');
            $newNode.attr('tabindex', '0').focus();
         }
      },
      _moveToPrev: function($node) {
         var $siblings = $node.siblings().addBack();

         if ($siblings.index($node) > 0) {
            var $newNode = $node.prev('[role=treeitem]');

            this.$nodes.attr('tabindex', '-1');
            $newNode.attr('tabindex', '0').focus();
         }
      },
      _moveUp: function($node) {
         if ($node.hasClass('parent')) {
            if ($node.attr('aria-expanded') == 'true') {
               this._toggleGroup($node);
               return;
            }
         }
         var $parents = $node.parentsUntil('.treeview', '[role=treeitem]');

         if ($parents.length) { // can move up
            this.$nodes.attr('tabindex', '-1');
            $parents.first().attr('tabindex', '0').focus();
         }
      },
      _deselectNode: function($node) {
         if (this.options.multiselectable) {
            $node.attr('aria-checked', 'false');

            if (this.options.showCheckboxes) {
               $node.find('.treeview-chkbox').first().attr('src', this.imgNotChecked);
            }
         }
         else {
            $node.attr('aria-selected', 'false');
         }

         this._updateValue();
         this.$elem.trigger('change');
      },
      _isMixed: function($node) {
            return ($node.attr('aria-checked') == 'mixed');
      },
      _isSelected: function($node) {
            return ($node.attr('aria-' + (this.options.multiselectable ? 'checked' : 'selected')) == 'true');
      },
      _restoreNodeStates: function() {
         var thisObj = this;

         this.$nodes.each(function(index) {
            var nodeState = thisObj.nodeStates[index];
            var $node = $(this);

            $node.attr('aria-checked', nodeState);

            if (thisObj.options.showCheckboxes) {
               if (nodeState == 'true') {
                  $node.find('.treeview-chkbox').first().attr('src', thisObj.imgChecked);
               }
               else if (nodeState == 'mixed') {
                  $node.find('.treeview-chkbox').first().attr('src', thisObj.imgMixed);
               }
               else {
                  $node.find('.treeview-chkbox').first().attr('src', thisObj.imgNotChecked);
               }
            }
         });
      },
      _selectNode: function($node) {
         if (this.options.multiselectable) {

            $node.attr('aria-checked', 'true');
            if (this.options.showCheckboxes) {
               $node.find('.treeview-chkbox').first().attr('src', this.imgChecked);
            }
         }
         else {
            this.$nodes.attr('aria-selected', 'false');
            $node.attr('aria-selected', 'true');
         }

         this._updateValue();
         this.$elem.trigger('change');
      },
      _storeNodeStates: function() {
         var thisObj = this;

         this.$nodes.each(function(index) {
            thisObj.nodeStates[index] = $(this).attr('aria-checked');
         });

      },
      _toggleSelection: function($node) {
         var thisObj = this;
         var $childNodes = $();
         var bParent = $node.hasClass('parent');

         if (bParent) {
            // parent node - get collection of children
            $childNodes = $node.find('[role=treeitem]').not('parent'); 
         }

         if (this._isSelected($node)) { // node is selected
            if (bParent) {
               $childNodes.add($node).each(function(index) {
                  thisObj._deselectNode($(this));
               });
               if (!$node.is(thisObj.$prevToggled)) {
                  this._storeNodeStates();
               }
               this._updateParentNodes();
            }
            else {
               this._deselectNode($node);
               this._updateParentNodes();
               this._storeNodeStates();
            }
         }
         else { // node is not selected or is mixed (if parent)
            if (bParent) {
               if (this._isMixed($node)) {
                  // check all children
                  $childNodes.add($node).each(function(index) {
                     thisObj._selectNode($(this));
                  });
                  this._updateParentNodes();
               }
               else {
                  // if the node was previously mixed - restore states
                  if(this.nodeStates[this.$nodes.index($node)] == 'mixed') {
                     this._restoreNodeStates();
                  }
                  else {
                     // check all children
                     $childNodes.add($node).each(function(index) {
                        thisObj._selectNode($(this));
                     });

                     this._updateParentNodes();

                     // store node states
                     this._storeNodeStates();
                  }
               }
            }
            else {
               this._selectNode($node);
               this._updateParentNodes();
               this._storeNodeStates();
            }
         }

         this._updateValue();
         this.$elem.trigger('change');
      },
      _toggleGroup: function($node) {
         var $child = $node.find('ul').first();

         if ($child.is(':hidden')) {
            $node.attr('aria-expanded', 'true');
            $child.attr('aria-hidden', 'false');

            $node.find('.treeview-img').first().attr('src', this.imgExpanded);
         }
         else {
            $node.attr('aria-expanded', 'false');
            $child.attr('aria-hidden', 'true');
            $node.find('.treeview-img').first().attr('src', this.imgCollapsed);
         }
      },
      _updateParentNodes: function() { // Update the selected state of parent nodes, based on their children
         var thisObj = this;

         this.$parentNodes.each(function(index) {
            var $parent = $(this);
            var $children = $parent.find('[role=treeitem]').not('parent');
            var $unselected = $children.filter('[aria-checked=false]'); 

            if ($unselected.length) {
               if ($children.length === $unselected.length) {
                  $parent.attr('aria-checked', 'false').find('.treeview-chkbox').first().attr('src', thisObj.imgNotChecked);
               }
               else {
                  $parent.attr('aria-checked', 'mixed').find('.treeview-chkbox').first().attr('src', thisObj.imgMixed);
               }
            }
            else {
               $parent.attr('aria-checked', 'true').find('.treeview-chkbox').first().attr('src', thisObj.imgChecked);
            }
         });
      },
      _updateValue: function() {
         if (this.options.multiselectable && !this.options.selectParents) {
            this.$selected = this.$nodes.not('.parent').filter('[aria-' + (this.options.multiselectable ? 'checked' : 'selected') + '=true]');
         }
         else {
            this.$selected = this.$nodes.filter('[aria-' + (this.options.multiselectable ? 'checked' : 'selected') + '=true]');
         }
      }
   };
})(jQuery, window, document); // END TREEVIEW
