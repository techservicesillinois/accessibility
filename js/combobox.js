/*
 * ARIA Combobox Widget jQuery Plugin
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

