/*
 * ARIA Widget Library
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

/******** COMBOBOX v2.2 **********/
;(function($, window, document, undefined) {

   var pluginName = 'combobox';
   var uuid = 0;

   var keys = {
      backspace:  8,
      tab:        9,
      enter:      13,
      shift:      16, // defined for keyUp event handler - firefox browser fix
      ctrl:       17, // defined for keyUp event handler - firefox browser fix
      alt:        18, // defined for keyUp event handler - firefox browser fix
      esc:        27,

      space:      32,
      end:        35,
      home:       36,

      left:       37,
      up:         38,
      right:      39,
      down:       40,

      del:        46
   };

   $.fn[pluginName] = function(settings) {
      var bMethodCall = typeof settings === 'string';
      var args = Array.prototype.slice.call(arguments, 1);
      var returnVal = this;
      var thisObj = this;

      if (bMethodCall) {
         // Call only public methods

         this.each(function() {
            var elem = $('#' + $(this).attr('id') + '-elem').get(0);

            var methodVal;
            var inst = $.data(elem, 'aria_' + pluginName);


            if (!inst) {
               return $.error('Cannot call methods on ' + pluginName + ' prior to initialization; '
                  + 'Attempted call to method "' + settings + '".');
            }

            if (settings === 'init') {
               return $.error('Cannot call init method on ' + pluginName + ' instance.');
            }

            if (!$.isFunction(inst[settings]) || settings.charAt(0) === '_') {
               return $.error('No such method ' + settings + ' for ' + pluginName + ' instance.');
            }

            methodVal = inst[settings].apply(inst, args);

            if (methodVal !== inst && methodVal !== undefined) {
               returnVal = methodVal;
            }
         });

         return returnVal;
      }
      else if (settings === undefined || typeof settings === 'object') {

         // Create a new plugin instance
         return this.each(function() {

            // check if element already has an instance
            if (!$.data(this, 'aria_' + pluginName)) {

               // store the object in the element's data
               $.data(this, 'aria_' + pluginName, new Plugin(this, settings));
            }
         });
      }

      return returnVal;
   };

   function Plugin(elem, settings) {
      this.elem = elem;
      this.$elem = $(elem);
      this.elemId = $(elem).attr('id');

      this.defaults = {
         collapse: true,
         button: false,
         disabled: false,
         actype: 'both',
         source: null,
         change: function() {},
         close: function() {},
         open: function() {},
         reset: function() {}
      };

      // merge and store settings
      this.settings = $.extend({}, this.defaults, settings);

      this.init();
   }

   Plugin.prototype = {
      init: function(elem, settings) {
         this.uuid = ++uuid;
         this.uniqueId = this.elemId + '-' + this.uuid;
         this.selIndex = -1; 
         this.$selected = $([]);
         this.$options = $([]);
         this.closeTimer = null;

         // disable the button if the widget is set not to collapse
         if (!this.settings.collapse) {
            this.settings.button = false;
         }

         // check that the autocomplete type is valid
         if (this.settings.actype !== 'both'
               && this.settings.actype !== 'list') {
            this.settings.actype = 'both';
         }

         // Initialize the source
         this._initSource();

         // Insert the widget into the page
         this._buildWidget();

         // Hide the option list
         this._closeList(true);

         // Set the initial value for the status
         this._updateStatus();

         // Check for disabled setting
         if (this.settings.disabled) {
            this._disable();
         }
      },
      _buildWidget: function() {
         var thisObj = this;

         thisObj.$elem.attr('id', thisObj.elemId + '-elem');

         // Create the widget wrapper
         thisObj.$widget= $('<div>')
            .attr({'id': thisObj.uniqueId + '-wrapper'})
            .addClass('cb-wrapper');

         thisObj.$editWrapper = $('<div>').addClass('cb-editwrapper');

         // Create the text edit control
         thisObj.$edit = $('<input>')
            .attr({
               'id': thisObj.elemId,
               //'id': thisObj.uniqueId + '-edit',
               'type': 'text',
               'role': 'combobox',
               'aria-owns': thisObj.uniqueId + '-list',
               'aria-autocomplete': thisObj.settings.autocompletelist ? 'list' : 'both',
               'aria-expanded': 'true'
            })
            .addClass('cb-edit')
            .on('keydown', function(e) { // keydown handler
               var $curOption = $([]);
               var curNdx = -1;

               if (thisObj.$options.length) {
                  $curOption = thisObj.$options.filter('.cb-selected');
                  curNdx = thisObj.$options.index($curOption);
               }

               if (thisObj.settings.disabled) {
                  return true;
               }

               switch(e.keyCode) {
                  case keys.tab: {
                     // store the current selection
                     thisObj._selectOption($curOption, true);

                     thisObj._closeList(true);

                     // allow tab to propagate
                     return true;
                  }
                  case keys.esc: { // Do not change combobox value

                     // Restore the edit box to the selected value
                     thisObj.$edit.val(thisObj.$selected.text());

                     // Select the text
                     thisObj.$edit.select();

                     // Close the option list
                     thisObj._closeList(true);

                     return false;
                  }
                  case keys.enter: {
                     if (e.shiftKey || e.altKey || e.ctrlKey) {
                        // do nothing
                        return true;
                     }

                     // store the new selection
                     thisObj._selectOption($curOption, true);

                     // Close the option list
                     thisObj._closeList(true);

                     return false;
                  }
                  case keys.up: {
                     var $curOption = thisObj.$options.filter('.cb-selected');

                     if (e.shiftKey || e.ctrlKey) {
                        // do nothing
                        return true;
                     }

                     if (e.altKey) {
                        thisObj._closeList(false);
                        return false;
                     }

                     // move to the previous item in the list

                     if (curNdx > 0) {
                        var $prev = thisObj.$options.eq(curNdx - 1);

                        if (thisObj.isOpen() == true) {
                           // scroll the list window to the new option
                           thisObj.$listbox.scrollTop(thisObj._calcOffset($prev));
                        }

                        // Update list selection - do not store
                        thisObj._selectOption($prev, false);

                        // Select the text
                        thisObj.$edit.select();
                     }

                     return false;
                  }
                  case keys.down: {
                     if (e.shiftKey || e.ctrlKey) {
                        // do nothing
                        return true;
                     }

                     if (e.altKey) {
                        thisObj._openList(false);
                        return false;
                     }

                     // move to the next item in the list

                     if (curNdx != thisObj.$options.length - 1) {
                        var $next = thisObj.$options.eq(curNdx + 1);

                        if (thisObj.isOpen() == true) {
                           // scroll the list window to the new option
                           thisObj.$listbox.scrollTop(thisObj._calcOffset($next));
                        }

                        // Update list selection - do not store
                        thisObj._selectOption($next, false);

                        // Select the text
                        thisObj.$edit.select();
                     }

                     return false;
                  }
                  case keys.home: {
                     // select the first list item
                     var $first = thisObj.$options.first();

                     if (thisObj.isOpen() == true) {
                        // Update list selection - do not store
                        thisObj._selectOption($first, false);

                        // scroll the list window to the top
                        thisObj.$listbox.scrollTop(0);
                     }
                     else {
                        // Update the selection
                        thisObj._selectOption($first, true);
                     }

                     // Select the text
                     thisObj.$edit.select();

                     return false;
                  }
                  case keys.end: {
                     // select the last list item
                     var $last = thisObj.$options.last();

                     if (thisObj.isOpen() == true) {
                        // Update list selection - do not store
                        thisObj._selectOption($last, false);

                        // scroll the list window to the new option
                        thisObj.$listbox.scrollTop(thisObj._calcOffset($last));
                     }
                     else {
                        // Update the selection
                        thisObj._selectOption($last, true);
                     }

                     // Select the text
                     thisObj.$edit.select();

                     return false;
                  }
               }

               return true;
            }) // end keydown handler
            .on('keyup', function(e) { // keyup handler

               if (thisObj.settings.disabled) {
                  return true;
               }

               if (e.ctrlKey || e.altKey) { // allow shiftKey to handle uppercase letter entry
                  // do nothing
                  return true;
               }

               switch (e.keyCode) {
                  case keys.shift:
                  case keys.ctrl:
                  case keys.alt:
                  case keys.esc:
                  case keys.tab:
                  case keys.enter:
                  case keys.left:
                  case keys.right:
                  case keys.up:
                  case keys.down:
                  case keys.home:
                  case keys.end: {
                     // do nothing
                     return true;
                  }
               }

              var val = thisObj.$edit.val();
              var re;

               /* NOTE: This block which changes the filter to match contained rather than from the beginning is only
                * necessary until smarter auto-complete code is put in place (See note below). Once better code is
                * ready, always use a filter for a contained search.
                */
               if (thisObj.settings.actype === 'list') {
                  re = new RegExp(val, 'i'); // search for option containing string
               }
               else {
                  re = new RegExp('^' + val, 'i'); // search for string from beginning of line
               }

               // repopulate the list, make all items visible and remove the selection highlighting
               thisObj.$options = thisObj.$listbox.find('li').removeClass('cb-hidden').removeClass('cb-selected');

               if (val.length == 0) {
                  // if the list box is visible, scroll to the top
                  if (thisObj.isOpen() == true) {
                     thisObj.$listbox.scrollTop(0);
                  }
                  thisObj.$edit.attr('aria-activedescendant', '');
               }
               else {
                  // recreate the list including only options that match what the user typed
                  thisObj.$options = thisObj.$options.filter(function(index) {

                     if (re.test($(this).text()) == true) {
                        return true;
                     }
                     else {
                        // hide those entries that do not match
                        $(this).addClass('cb-hidden');

                        return false;
                     }
                  });
               }
  
               if (thisObj.$options.length > 0) {
                  var $newOption = thisObj.$options.first();
                  var newVal = $newOption.text();
                  var start = val.length;
                  var end = newVal.length;
                  var editNode = thisObj.$edit.get(0);

                  if (thisObj.settings.actype === 'both') {
                     /*
                     * NOTE: Modify this code if you want to allow autocomplete  for contained searching rather than matching
                     * the start of a string.  The code would need to preserve the typed letters, updating the edit control
                     * with the first matching option, highlight the search string in the edit box and set cursor at
                     * end of the string.
                     */
                     if (e.keyCode != keys.backspace) {
                        // if the user isn't backspacing, fill in the
                        // suggested value. uncomment to update box text
                        thisObj.$edit.val(newVal);
                     }

                     // Select the auto-complete text
                     thisObj._selectText(start, end);
                  }

                   // Reset the highlighting for the list
                   thisObj.$options.removeClass('cb-selected');

                   if (val.length > 0) {
                      $newOption.addClass('cb-selected');
                      thisObj.$edit.attr('aria-activedescendant', $newOption.attr('id'));
                   }
               }
               else {
                  thisObj.$edit.attr('aria-activedescendant', '');
               }

               // Update the combobox status text
               thisObj._updateStatus();

               // Show the list if it is hidden
               thisObj._openList(false);

               return false;
            }) // end keyup handler
            .on('blur', function(e) {
               thisObj.closeTimer = setTimeout(function() {
                  thisObj._closeList(true);
               }, 50);
               return true;
            })
            .on('focus', function(e) {
               clearTimeout(thisObj.closeTimer);
               return true;
            });

         thisObj.$editWrapper.append(thisObj.$edit);

         // Create the expand/collapse button - if specified 
         if (thisObj.settings.button) {
            thisObj.$button = $('<img>')
               .attr({
                  'id': thisObj.uniqueId + '-button',
                  'src': 'data:image/svg+xml,%3Csvg%20version%3D%221.1%22%20id%3D%22Layer_1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%20x%3D%220px%22%20y%3D%220px%22%20viewBox%3D%220%200%2025.3%2016%22%20style%3D%22enable-background%3Anew%200%200%2025.3%2016%3B%22%20xml%3Aspace%3D%22preserve%22%3E%20%3Cpath%20d%3D%22M12.7%2C11.4L2.7%2C1.1c-1.3-1.3-3.3%2C0.7-2%2C2l11.9%2C12.3l12-12.3c1.3-1.4-0.8-3.4-2.1-2L12.7%2C11.4z%22/%3E%20%3C/svg%3E'
               })
               .addClass('cb-button')
               .on('click tap', function(e) {
                  if (thisObj.settings.disabled) {
                     return true;
                  }

                  // set focus on the edit control
                  thisObj.$edit.focus();

                  // Toggle the display of the list
                  thisObj._toggleList(false);

                  return false;
               });

            thisObj.$editWrapper.append(thisObj.$button);
         }
         thisObj.$widget.append(thisObj.$editWrapper);

         // Create the status live region
         thisObj.$status = $('<span>')
            .attr({
               'id': thisObj.uniqueId + '-status',
               'role': 'status',
               'aria-live': 'polite'
            })
            .addClass('cb-status');

         thisObj.$widget.append(thisObj.$status);

         // Create the options list
         thisObj.$listbox = $('<ul>')
            .attr({
               'id': thisObj.uniqueId + '-list',
               'role': 'listbox',
               'tabindex': '-1'
            })
            .addClass('cb-list');

         if (thisObj.settings.collapse) {
            thisObj.$listbox.addClass('cb-collapsible');
         }

         thisObj.$widget.append(thisObj.$listbox);

         if (thisObj.source) {
            // Populate the options list from the select control
            $.each(thisObj.source, function(index) {
               var $option = $('<li>')
                  .attr({
                     'id': thisObj.uniqueId + '-opt' + index,
                     'role': 'option'
                  })
                  .addClass('cb-option')
                  .text(this);

               if (index == thisObj.selIndex) {
                  $option.addClass('cb-selected');
                  thisObj.$selected = $option;

                  // set the initial value for the combobox
                  thisObj.$edit
                     .val(thisObj.$selected.text())
                     .attr('aria-activedescendant', thisObj.$selected.attr('id'));
               }

               thisObj.$listbox.append($option);
               thisObj.$options = thisObj.$options.add($option);
            });
         }

         // bind a click handler to the option list
         thisObj.$options.on('click', function(e) {

            if (thisObj.settings.disabled) {
               return true;
            }

            // set the focus on the edit box
            thisObj.$edit.focus();

            // select the clicked item
            thisObj._selectOption($(e.target), true);

            // close the list
            thisObj._closeList(true);

            return false;
         });

         // Hide the select control
         thisObj.$elem.hide().attr('aria-hidden', 'true');

         // Insert the widget into the page
         thisObj.$elem.after(thisObj.$widget);

      },
      _calcOffset: function($id) {
         //
         // Function _calcOffset() is a function to calculate the pixel offset of a list option from the top
         // of the list
         //
         // @param ($id obj) $id is the jQuery object of the option to scroll to
         //
         // @return (integer) returns the pixel offset of the option
         //

         var offset = 0;
         var selectedNdx = this.$options.index($id);

         for (var ndx = 0; ndx < selectedNdx; ndx++) {
            if (this.$options.eq(ndx).not('[class=cb-hidden]')) {
               offset += this.$options.eq(ndx).outerHeight();
            }
         }

         return offset;
      },
      _closeList: function(bRestore) {
         //
         // Function _closeList() is a function to close the list box if it is open
         //
         // @param (bRestore boolean) bRestore is true if function should restore the stored list selection
         //
         // @return N/A
         //


         var $curOption = this.$options.filter('.cb-selected');

         if (bRestore==true) { // set the list to the stored state

            // restore the editbox value
            this.$edit.val(this.$selected.text());

            // remove the selected class from the curOption
            $curOption.removeClass('cb-selected');

            // set curOption to the stored option
            $curOption = this.$selected;

            if ($curOption.length) {
               $curOption.addClass('cb-selected');
            }
         }

         if (this.settings.collapse) {
            if (this.$edit.attr('aria-expanded') == 'false') {
               return;
            }
            this.$listbox.hide().attr('aria-hidden', 'true');
            this.$edit.attr('aria-expanded', 'false');

            // triger the close event
            //this.$widget.trigger('close', [this.elemId]); 
         }
         else {
            var offset = $curOption.position().top;
            var height = this.$listbox.height();

            if (offset > height) {
               // scroll the list window to the new option
               this.$listbox.scrollTop(this._calcOffset($curOption));
            }
         }

      },
      destroy: function() {

         //
         // Function destroy() removes the widget from the page and makes the select control visible
         //
 
         // ensure the close timer is canceled
         clearTimeout(thisObj.closeTimer);
         
         // remove the widget elements from the page
         this.$widget.remove();
         this.$widget = null;

         // make the select control visible
         this.$elem.show().attr('id', this.$elemId);

         // remove the plugin instance from the element
         $.removeData(this.elem, 'aria_' + pluginName);
      },
      disable: function() {
         this._disable();
      },
      _disable: function() {

         // if the combobox is expanded, collapse it
         this._closeList(true);

         this.$widget.addClass('cb-disabled');

         // restore the edit box to the selected option and set disabled attribute
         this.$edit
            .val(this.$selected.text())
            .attr({
               'aria-activedescendant': this.$selected.attr('id'),
               'disabled': 'true'
            });

         // if the widget is not collapsible, add an overlay to the list
         if (!this.settings.collapse) {
            var listDims = {
               height: this.$widget.outerHeight(true),
               width: this.$widget.outerWidth(true)
            };

            this.$overlay = $('<div>')
               .addClass('cb-listoverlay')
               .css({
                  'width': listDims.width + 'px',
                  'height': listDims.height + 'px'
               });

            this.$widget.append(this.$overlay);
         }


         this.settings.disabled = true;
      },
      enable: function() {
         this._enable();
      },
      _enable: function() {
         this.$widget.removeClass('cb-disabled');
         this.$edit.removeAttr('disabled');
         this.settings.disabled = false;
         if (this.$overlay !== undefined) {
            this.$overlay.remove();
         }
      },
      _initSource: function() {

         var thisObj = this;

         if (thisObj.$elem.is('select')) {
            thisObj.$elemOptions = thisObj.$elem.find('option');
            thisObj.$selSelected = thisObj.$elemOptions.filter('[selected]');
            thisObj.source = [];
            thisObj.$elemOptions.each(function(index) {
               thisObj.source.push($(this).text());
            });

            // Get the initially selected item from the select control -- if any
            if (thisObj.$selSelected.length) {
               thisObj.selIndex = thisObj.$elemOptions.index(thisObj.$selSelected);
            }
         }
         else if (thisObj.$elem.is('input') && thisObj.$elem.attr('type') === 'text') {
            if ($.isArray(this.settings.source)) {
               // user specified an array of values
               thisObj.source = thisObj.settings.source;
            }
            else if (typeof thisObj.settings.source === 'string') {

               thisObj.source = [];

               $.ajax({
                  dataType: "json",
                  url: thisObj.settings.source,
                  async: false,
                  success: function(data) {
                     $.each(data, function(key, val) {
                        thisObj.source.push(val);
                     });
                  }
               });
            }
            else {
               thisObj.source = [];
            }
         } 
         else {
            return $.error('Node type must be "select" or "input"');
         }
      },
      isDisabled: function() {
         return this.settings.disabled;
      },
      isOpen: function() {
         return (this.$edit.attr('aria-expanded') == 'true');
      },
      _openList: function(bRestore) {
         //
         // Function _openList() is a function to open the list box if it is closed
         //
         // @param (bRestore booleam) bRestore is true if function should bRestore higlight to stored list selection
         //
         // @return N/A
         //
 
        var $curOption = this.$options.filter('.cb-selected');

        if (bRestore == true) {
          // set curOption to the stored option
          $curOption = this.$selected;

          // remove the selected class from the list items
          this.$options.removeClass('cb-selected');

          if ($curOption.length) {
            // add selected class to the selection
            $curOption.addClass('cb-selected');
          }
        }

        if (this.settings.collapse) {
           this.$listbox.show();
           this.$edit.attr('aria-expanded', 'true');

           // scroll to the currently selected option
           this.$listbox.scrollTop(this._calcOffset($curOption));
        }

        // Trigger the open event
        //this.$edit.trigger('open', [this.elemId]); 

        this.settings.open.call();
      },
      reset: function() {
         this._reset();
      },
      _reset: function() {
         //
         // Function _reset() is a function to reload the options from the select control
         //
         var thisObj = this;

         // remove all of the current options
         thisObj.$options.remove();
         thisObj.$options = $([]);

         this._initSource();
         /*
         // refresh the option object and selected to allow for modification of original select
         thisObj.$elemOptions = thisObj.$elem.find('option');
         thisObj.selIndex = -1;

         thisObj.$selSelected = thisObj.$elemOptions.filter('[selected]'); // filter returns first value on not found

         if (thisObj.$selSelected.length) {
            thisObj.selIndex = thisObj.$elemOptions.index(thisObj.$selSelected);
         }
         */

         if (thisObj.source) {
            // Repopulate the options list from the select control
            $.each(thisObj.source, function(index) {
               var $option = $('<li>')
                  .attr({
                     'id': thisObj.uniqueId + '-opt' + index,
                     'role': 'option'
                  })
                  .addClass('cb-option')
                  .text(this);

               if (index == thisObj.selIndex) {
                  $option.addClass('cb-selected');
                  thisObj.$selected = $option;

                  // set the initial value for the combobox
                  thisObj.$edit
                     .val(thisObj.$selected.text())
                     .attr('aria-activedescendant', thisObj.$selected.attr('id'));
               }

               thisObj.$listbox.append($option);
               thisObj.$options = thisObj.$options.add($option);
            });
         }

         // bind a click handler to the option list
         thisObj.$options.on('click', function(e) {

            if (thisObj.settings.disabled) {
               return true;
            }

            // set the focus on the edit box
            thisObj.$edit.focus();

            // select the clicked item
            thisObj._selectOption($(e.target), true);

            // close the list
            thisObj._closeList(true);

            return false;
         });

         // Hide the list of options
         thisObj._closeList(true);

         // Set the initial value for the status
         thisObj._updateStatus();

         // Trigger the change event
         //thisObj.$widget.trigger('change', [thisObj.elemId]); 
      },
      _selectOption: function($id, bStore) {
         //
         // Function _selectOption() is a function to select a new combobox option.
         // The jQuery object for the new option is stored and the selected class is added
         //
         // @param ($id object) $id is the jQuery object of the new option to select
         //
         // @param (bStore boolean) If true, store the current selection; if false, only update listbox
         //
         // @return N/A
         //

         // remove the selected class from the list
         this.$options.removeClass('cb-selected');

         // add the selected class to the new option
         $id.addClass('cb-selected');

         // update the edit box
         this.$edit.val($id.text());

         //move cursor to the end
         this._selectText(this.$edit.val().length, this.$edit.val().length);

         // Update the focus to the currently selected item
         this.$edit.attr('aria-activedescendant', $id.attr('id'));

         if (bStore) {
           if ($id.text() != this.$selected.text()) {
              // Trigger the change event
              //this.$widget.trigger('change', [this.elemId]); 
           }

           // store the newly selected option
           this.$selected = $id;
         }
      },
      _selectText: function(start, end) {
         //
         // Function _selectText() is a function to select some of the text in the edit box for autocompletion.
         // If start and end are the same value, the function moves the cursor to that position.
         //
         // @param (start object) start is the character position for the start of the selection
         //
         // @param (end object) end is the character position for the end of the selection
         //
         // @return N/A
         //

         var editNode = this.$edit.get(0);

         if (editNode.setSelectionRange) {
          // Firefox and other gecko based browsers
          editNode.setSelectionRange(start, end);
         }
         else if (editNode.createTextRange) {
          // Internet Explorer
          var range = editNode.createTextRange();
          range.collapse(true);
          range.moveEnd('character', start);
          range.moveStart('character', end);
          range.select();
         }
         else if (editNode.selectionStart) {
          // Other browsers
          editNode.selectionStart = start;
          editNode.selectionEnd = end;
         }
      },
      toggleList: function(bRestore) {
         this._toggleList(bRestore);
      },
      _toggleList: function(bRestore) {
         //
         // Function _toggleList() is a member function to toggle the display of the combobox options.
         //
         // @param (bRestore boolean) bRestore is true if toggle should bRestore higlight to stored list selection
         //
         // Return N/A
         //
         
         if (this.isOpen()) {
            this._closeList(bRestore);
         }
         else {
            this._openList(bRestore);
         }
      },
      _updateStatus: function() {
         //
         // Function updateStatus() is a function to update the status live region with the current number of
         // available options.
         //
         // @param N/A
         //
         // @return N/A
         //
         var listLen = this.$options.length;

         if (listLen == 1) {
            this.$status.html('1 result is available.');
         }
         else if (listLen > 1) {
            this.$status.html(listLen + ' results are available.');
         }
         else {
            this.$status.html('No results.');
         }
      },
   }
})(jQuery, window, document); // END COMBOBOX

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
               'aria-hidden': 'true'
            })
            .addClass('aria-dialog')
            .on('keydown', function(e) {
               var numTabbable = thisObj.$tabbable.length;

               switch (e.keyCode) {
                  case thisObj.keys.tab: {
                     if (numTabbable == 1) {
                        return false;
                     }

                     if ((thisObj.$tabbable.index(e.target) == (numTabbable - 1)) && !e.shiftKey) {
                       // last focusable item
                       thisObj.$tabbable.first().focus(); 
                     } 
                     else if (thisObj.$tabbable.index(e.target) == 0 && e.shiftKey) {
                       // first focusable item
                       thisObj.$tabbable.last().focus(); 
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
               'role': 'document'
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
         this.$tabbable = this.$dialog.find(':tabbable');

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

         this._positionDialog();

         this.$dialogOverlay.attr('aria-hidden', 'false');
         this.$dialog.attr('aria-hidden', 'false');
         this.$tabbable.first().focus();

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
   function focusable( element, isTabIndexNotNaN) {
      var map, mapName, img,
         nodeName = element.nodeName.toLowerCase();

      if ( "area" === nodeName ) {
         map = element.parentNode;
         mapName = map.name;
         if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
            return false;
         }
         img = $( "img[usemap=#" + mapName + "]" )[0];
         return !!img && visible( img );
      }
      return ( /input|select|textarea|button|object/.test( nodeName ) ?
         !element.disabled :
         "a" === nodeName ?
            element.href || isTabIndexNotNaN :
            isTabIndexNotNaN);/* &&
         // the element and all of its ancestors must be visible
         visible( element );
         */
   }

   function visible( element ) {
      return $.expr.filters.visible( element ) &&
         !$( element ).parents().addBack().filter(function() {
            return $.css( this, "visibility" ) === "hidden";
         }).length;
   }
   $.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

      focusable: function( element ) {
         return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
      },

      tabbable: function( element ) {
         var tabIndex = $.attr( element, "tabindex" ),
            isTabIndexNaN = isNaN( tabIndex );
         return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN);
      }
   });
   //// End jQuery UI core include ///
})(jQuery, window, document); // END MODAL DIALOG

/******** SLIDER v1.2 ********/
;(function($, window, document, undefined) {

   var pluginName = 'slider';

   var defaults = {
      min: 0,
      max: 100,
      val: 30,
      step: 5,
      jump: 25,
      vertical: false,
      cue: "You can use the arrow, page up, page down, home and end keys to change the slider value."

   };

   $.fn[pluginName] = function(options) {

      return this.each(function() {

         // check if element already has an instance
         if ($.data(this, 'aria_' + pluginName)) {
            return;
         }

         // create a new instance of the widget
         var inst = Object.create(slider);

          // store the object in the element's data
         $.data(this, 'aria_' + pluginName, inst);

         // Initialize the instance
         inst.init(this, options);
      });
   };

   var slider = {
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

         this.pos = { // mouse position
            x: 0,
            y: 0
         };

         this.bStored = false;

         this.bClicked = false;
         this.bTouch = false;

         // merge and store options
         this.options = $.extend({}, defaults, options);

         this.min = this.options.min;
         this.max = this.options.max;
         this.val = this.options.val;

         this._buildWidget(); // build the slider
      },
      _buildWidget: function() {
         var thisObj = this;

         // Create the instruction tooltip
         this.$cue = $('<div>')
            .attr('aria-hidden', 'true')
            .addClass('widget-cue')
            .html(this.options.cue)
            .insertBefore(this.$elem);

         // position the cue above the widget
         this.$cue.css('top', (parseInt(this.$cue.outerHeight()) / parseInt(this.$cue.css('font-size')) + 0.2)*(-1) + 'em');

         this.$text = $('<span>')
            .attr('aria-hidden', 'true')
            .addClass('slider-text')
            .text(this.val + '%')
            .insertAfter(this.$elem);

         this.$handle = this.$elem.find('.slider-handle');

         if (!this.$handle.length) {
            this.$handle = $('<div>').addClass('slider-handle');
            this.$elem.append(this.$handle);
         }

         this.$handle.attr({
            'role': 'slider',
            'aria-valuemin': this.min,
            'aria-valuemax': this.max,
            'aria-valuenow': this.val,
            'tabindex': '0'
         })
         .css('left', 'calc(' + this.val + '% - ' + (this.$handle.outerWidth()/2) + 'px)')
         .on('keydown', function(e) {

            switch(e.keyCode) {
               case thisObj.keys.left:
               case thisObj.keys.down: {
                  thisObj._decSlider(thisObj.options.step);
                  thisObj.$cue.removeClass('cue-visible');
                  return false;
               }
               case thisObj.keys.right:
               case thisObj.keys.up: {
                  thisObj._incSlider(thisObj.options.step);
                  thisObj.$cue.removeClass('cue-visible');
                  return false;
               }
               case thisObj.keys.pagedown: {
                  thisObj._decSlider(thisObj.options.jump);
                  thisObj.$cue.removeClass('cue-visible');
                  return false;
               }
               case thisObj.keys.pageup: {
                  thisObj._incSlider(thisObj.options.jump);
                  thisObj.$cue.removeClass('cue-visible');
                  return false;
               }
               case thisObj.keys.home: {
                  thisObj._decSlider(thisObj.options.max);
                  thisObj.$cue.removeClass('cue-visible');
                  return false;
               }
               case thisObj.keys.end: {
                  thisObj._incSlider(thisObj.options.max);
                  thisObj.$cue.removeClass('cue-visible');
                  return false;
               }
            }
            return true;
         })
         .on('mousedown', function(e) {

            thisObj.bClicked = true;

            thisObj.$handle.focus();

            // bind a mousemove handler to the document
            $(document).on('mousemove.slider', function(e) {
               thisObj._storeMousePos(e.pageX || e.originalEvent.touches[0].pageX,  e.pageY || e.originalEvent.touches[0].pageY);
               thisObj._handleMouse(e);
            })

            // bind a mouseup handler to the document
            $(document).on('mouseup.slider', function(e) {
               // stop tracking the mouse
               thisObj.bTouch = false;
               $(document).off('mousemove.slider mouseup.slider');


               thisObj.$handle.removeClass('focus');
               thisObj.bPosStored = false;
            });
            return false
         })
         .on('touchstart', function(e) {
            thisObj.bTouch = true;
            thisObj.$cue.removeClass('cue-visible');
            thisObj.$handle.trigger('mousedown');

            e.preventDefault();
            return false;
         })
         .on('touchmove', function(e) {
               thisObj._storeMousePos(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
               thisObj._handleMouse(e);
               return false;
         })
         .on('focusin', function(e) {
            if (!(thisObj.bClicked || thisObj.bTouch)) {
               thisObj.$cue.addClass('cue-visible');
            }
            return false;
         })
         .on('focusout', function(e) {
            thisObj.$cue.removeClass('cue-visible');
            thisObj.bClicked = false;
            return false;
         });
         

      }, // end _BuildWidget()
      _storeMousePos: function(x, y) {
         if (!this.bPosStored) {
            this.pos.x = x;
            this.pos.y = y;
            this.bPosStored = true;
         }
      },
      _handleMouse: function(e) {
         var container = this.$elem.offset();
         var delta = {
            x: Math.round(((e.pageX || e.originalEvent.touches[0].pageX) - container.left)*100 / this.$elem.width()),
            y: Math.round(((e.pageY || e.originalEvent.touches[0].pageY) - this.pos.y)) + this.val // TODO: Fix this calculation!
         }

         this.val = delta.x;

         if (this.val < this.min) {
            this.val = this.min;
         }
         else if (this.val > this.max) {
            this.val = this.max;
         }

         this._setSlider();
      }, 
      _decSlider: function(val) {
         this.val -= val;

         if (this.val < 0) {
            this.val = 0;
         }

         this._setSlider();
      },
      _incSlider: function(val) {
         this.val += val;

         if (this.val > 100) {
            this.val = 100;
         }

         this._setSlider();
      },
      _setSlider: function() {
         this.$handle
            .attr('aria-valuenow', this.val)
            .css('left', 'calc(' + this.val + '% - ' + (this.$handle.outerWidth()/2) + 'px)')

         this.$text.text(this.val + '%');
      }
   };


})(jQuery, window, document); // END SLIDER

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

         this.bCueDismissed = false;

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
               if (!thisObj.bCueDismissed) {
                  thisObj.$cue.addClass('cue-visible');
               }
               return false;
            })
            .on('focusout', function(e) {
               if (!thisObj.bCueDismissed) {
                  thisObj.$cue.removeClass('cue-visible');
               }
               thisObj.bCueDismissed = false;
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
                  thisObj.bCueDismissed = true;
                  return false;
               }
               case thisObj.keys.right: {
                  thisObj._selectNext($item);
                  thisObj.$cue.removeClass('cue-visible');
                  thisObj.bCueDismissed = true;
                  return false;
               }
               case thisObj.keys.home: {
                  thisObj._selectTab(thisObj.$tabs.first());
                  thisObj.$cue.removeClass('cue-visible');
                  thisObj.bCueDismissed = true;
                  return false;
               }
               case thisObj.keys.end: {
                  thisObj._selectTab(thisObj.$tabs.last());
                  thisObj.$cue.removeClass('cue-visible');
                  thisObj.bCueDismissed = true;
                  return false;
               }
            }

            return true;
         })
         .on('click', function(e) {
            thisObj._selectTab($(e.target));
            thisObj.$cue.removeClass('cue-visible');
            thisObj.bCueDismissed = true;
            return false;
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
         .on('touchstart, mousedown', function(e) {
            thisObj.$cue.removeClass('cue-visible');
            thisObj.bCueDismissed = true;
            return true;
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

/********* TREEVIEW v1.1 *********/
;(function($, window, document, undefined) {

   var pluginName = 'treeview';

   var defaults = {
      collapsed: true,
      multiselectable: false,
      cues: "You can use the arrow keys to navigate between items in the tree.<br>Use enter or space to expand or collapse items."
   };

   $.fn[pluginName] = function(options) {

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

         this.imgCollapsed =  "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0ZGRkZGRjtzdHJva2U6IzAwMDAwMDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cgkuc3Qxe2ZpbGw6bm9uZTtzdHJva2U6IzAwMDAwMDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cjwvc3R5bGU+CjxyZWN0IHg9IjAuNSIgeT0iMC41IiBjbGFzcz0ic3QwIiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiLz4KPGxpbmUgY2xhc3M9InN0MSIgeDE9IjIuNCIgeTE9IjgiIHgyPSIxMy42IiB5Mj0iOCIvPgo8bGluZSBjbGFzcz0ic3QxIiB4MT0iOCIgeTE9IjIuNCIgeDI9IjgiIHkyPSIxMy42Ii8+Cjwvc3ZnPg==";

         this.imgExpanded = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0ZGRkZGRjtzdHJva2U6IzAwMDAwMDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cgkuc3Qxe2ZpbGw6bm9uZTtzdHJva2U6IzAwMDAwMDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cjwvc3R5bGU+CjxyZWN0IHg9IjAuNSIgeT0iMC41IiBjbGFzcz0ic3QwIiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiLz4KPGxpbmUgY2xhc3M9InN0MSIgeDE9IjIuNCIgeTE9IjgiIHgyPSIxMy42IiB5Mj0iOCIvPgo8L3N2Zz4=";

         this.bClicked = false;

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
            });

         });

         // Add node markup
         this.$nodes.each(function(index) {
            var $node = $(this);
            var $child = $node.find('ul').first();

            if ($child.length) {
               // parent node
               $node
                  .addClass('parent')
                  .attr({
                     'aria-expanded': !thisObj.options.collapsed,
                  })
                  .prepend('<img class="treeview-img" src="' + thisObj.imgCollapsed + '" alt="">');
            }
         })
         .on('mousedown', function(e) {
            thisObj.bClicked = true;
         })
         .on('click', function(e) {
            var $node = $(e.target);

            if ($node.is ('span') || $node.is('img')) {
               $node = $node.parent();
            }

            $node.attr('tabindex', '0');
            thisObj.$nodes.not($node).attr('tabindex', '-1');

            if ($node.hasClass('parent')) {
               thisObj._toggleGroup($node);
            }

            return false;
         })
         .on('keydown', function(e) {
            var $node = $(e.target);

            if ($node.is ('span')) {
               $node = $node.parent();
            }


            switch(e.keyCode) {
               case thisObj.keys.enter:
               case thisObj.keys.space: {
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
            return false;
         });
      }, // end _BuildTree()
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
      }

   };
})(jQuery, window, document); // END TREEVIEW
