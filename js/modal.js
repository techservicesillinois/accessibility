/*
 * ARIA Modal Dialog Widget jQuery Plugin
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

/********* MODAL DIALOG v1.1 ********/
;(function($, window, document, undefined) {

   var pluginName = 'dialog';
   var uuid = 0;

   var defaults = {
      msg: 'This dialog is modal.',
      title: 'Important Information',
      closeTxt: 'Close',
      bDescriptive: 'true',
      bModal: 'true',
      bShowOnCreate: false,
      triggerID: '',
      onOpen: null,
      onClose: null,
   };


   $.fn[pluginName] = function(options) {

      return this.each(function() {

         // check if element already has an instance
         if ($.data(this, 'aria_' + pluginName)) {
            return;
         }

         // create a new instance of the widget
         var inst = Object.create(dialog);

          // store the object in the element's data
         $.data(this, 'aria_' + pluginName, inst);

         // Initialize the instance
         inst.init(this, options);
      });
   };

   var dialog = {
      init: function(elem, options) {
         this.$elem = $(elem);
         this.elem = elem;
         this.uuid = uniqueId();

         this.keys = {
            tab:   9,
            enter: 13,
            esc:   27,
            left:  37,
            up:    38,
            right: 39,
            down:  40
         };

         // merge and store options
         this.options = $.extend({}, defaults, options);

         this._buildDialog();

         if (this.options.bShowOnCreate) {
            this.showDialog();
         }
      },
      _buildDialog: function() {
         var thisObj = this;

         thisObj.$trigger = $('#' + thisObj.options.triggerID);

         thisObj.$dialogOverlay = $('<div>')
            .attr({
               'id': pluginName + thisObj.uuid + '-overlay',
               'aria-hidden': 'true'
            })
            .addClass('aria-dialog-overlay');

         thisObj.$dialog = $('<div>').attr({
               'id': pluginName + thisObj.uuid + '-dialog',
               'role': 'dialog',
               'aria-labelledby': pluginName + thisObj.uuid + '-title',
               'aria-describedby': pluginName + thisObj.uuid + '-msg',
               'aria-hidden': 'true'
            })
            .addClass('aria-dialog')
            .on('keydown', function(e) {
               var $tabbable = thisObj.$dialog.find(':tabbable');
               var numTabbable = $tabbable.length;

               switch (e.keyCode) {
                  case thisObj.keys.tab: {
                     if (numTabbable == 1) {
                        return false;
                     }

                     if (($tabbable.index(e.target) == (numTabbable - 1)) && !e.shiftKey) {
                       // last focusable item
                       $tabbable.first().focus(); 
                     } 
                     else if ($tabbable.index(e.target) == 0 && e.shiftKey) {
                       // first focusable item
                       $tabbable.last().focus(); 
                     }
                     else {
                        return true;
                     }

                     return false;
                  }
                  case thisObj.keys.esc: {
                     thisObj._hideDialog();
                     return false;
                  }
               }
            });

         thisObj.$dialogTitle = $('<h2>').attr({
               'id': pluginName + thisObj.uuid + '-title'
            })
            .addClass('dialog-title')
            .html(thisObj.options.title);

         thisObj.$dialogMsg = $('<p>').attr({
               'role': 'document',
               'id': pluginName + thisObj.uuid + '-msg',
            })
            .addClass('dialog-msg')
            .html(thisObj.options.msg);

            

         thisObj.$bnDialogClose = $('<button>').attr({ 
               'id': pluginName + thisObj.uuid + '-close'
            })
            .addClass('aria-dialog-close')
            .html('Close')
            .on('click', function(e) {
               thisObj._hideDialog();
               return false;
            });

         this.$dialog.append(this.$dialogTitle, this.$dialogMsg, this.$bnDialogClose);

         $('body').prepend(thisObj.$dialogOverlay);
         thisObj.$dialogOverlay.after(thisObj.$dialog);
         thisObj._positionDialog();


         $(window).resize(function() {
            thisObj._positionDialog();
         });

         if (thisObj.options.triggerID.length) {
            this.$triggerElem = $('#' + thisObj.options.triggerID)
               .on('click', function(e) {
                  thisObj.showDialog();
                  return false;
               });
         }
      },
      showDialog: function() {

         var thisObj = this;
         this._positionDialog();

         this.$dialogOverlay.attr('aria-hidden', 'false');
         this.$dialog.attr('aria-hidden', 'false');
         thisObj.$dialog.find(':focusable').first().focus();

         $('body').trigger('open.' + pluginName);
      },
      _hideDialog: function() {
         this.$dialogOverlay.attr('aria-hidden', 'true');
         this.$dialog.attr('aria-hidden', 'true');

         if (this.$triggerElem != undefined) {
            // Return focus to the opening element
            this.$triggerElem.focus();
         }

         $('body').trigger('close.' + pluginName);
      },
      _destroyDialog: function() {
         this.$dialog.remove();
         this.$dialogOverlay.remove();
      },
      _positionDialog: function() {
         var width = $(window).width();
         var height = $(window).height();
         var dlgWidth = this.$dialog.outerWidth();
         var dlgHeight = this.$dialog.outerHeight();

         this.$dialog.css({
            'left': width/2 - (dlgWidth/2) + 'px', 
            'top': (height - dlgHeight)/2 + $(document).scrollTop() + 'px'
         });
      }
   };

   //// From jQuery UI core ///
   $.extend($.expr[':'], {
     data: function(elem, i, match) {
       return !!$.data(elem, match[3]);
     },
     focusable: function(element) {
       var nodeName = element.nodeName.toLowerCase(),
         tabIndex = $.attr(element, 'tabindex');
       return (/input|select|textarea|button|object/.test(nodeName)
         ? !element.disabled
         : 'a' == nodeName || 'area' == nodeName
           ? element.href || !isNaN(tabIndex)
           : !isNaN(tabIndex))
         // the element and all of its ancestors must be visible
         // the browser may report that the area is hidden
         && !$(element)['area' == nodeName ? 'parents' : 'closest'](':hidden').length;
     },

     tabbable: function(element) {
       var tabIndex = $.attr(element, 'tabindex');
       return (isNaN(tabIndex) || tabIndex >= 0) && $(element).is(':focusable');
     }
   });
   //// End jQuery UI core include ///
})(jQuery, window, document); // END MODAL DIALOG

