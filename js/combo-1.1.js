function combobox($elem, legacy) {
   this.$edit = $elem;
   this.$comboWrap = this.$edit.parent();
   this.$btn = this.$comboWrap.find('[role=button]');
   this.$popup = $('#' + this.$edit.attr('aria-controls'));
   this.$options = this.$popup.find('[role=option]');
   this.$status = this.$comboWrap.find('.cb-status');
   this.$filteredOptions = this.$options;
   this.$selected = $([]);
   this.acType = this.$edit.attr('aria-autocomplete');
   this.closeTimer = null;
   this.bLegacy = legacy;

   this.attachHandlers();


   this.keys = {
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

   return this;
}

combobox.prototype.attachHandlers = function() {
   var thisObj = this;

   this.$btn.on('click', function() {

      if (thisObj.$edit.is(':disabled')) {
         return false;
      }

      if (thisObj.isExpanded()) {
         thisObj.collapsePopup();
      }
      else {
         thisObj.expandPopup();
      }

      thisObj.$edit.focus();
      return false;
   });

   this.$edit.on('keydown', function(e) {
      return thisObj.handleKeydown(e);
   })
   .on('keyup', function(e) {
      return thisObj.handleKeyup(e);
   })
   .on('blur', function () {
      return thisObj.handleBlur();
   })
   .on('focus', function () {
      return thisObj.handleFocus();
   });

   this.$options.on('click', function(e) {
      return thisObj.handleOptionClick(e);
   });
};

//
// Function calcOffset() is a function to calculate the pixel offset of an option from the top
// of the popup
//
// @param ($id obj) $id is the jQuery object of the option to scroll to
//
// @return (integer) returns the pixel offset of the option
//
combobox.prototype.calcOffset = function($id) {

   var offset = 0;
   var selectedNdx = this.$options.index($id);

   for (var ndx = 0; ndx < selectedNdx; ndx++) {
      if (this.$options.eq(ndx).is(':visible')) {
         offset += this.$options.eq(ndx).outerHeight();
      }
   }

   return offset;
};

combobox.prototype.filterOptions = function(val) {
   var re;

   if (this.acType === 'list') {
      re = new RegExp(val, 'i'); // search for option containing string
   }
   else {
      re = new RegExp('^' + val, 'i'); // search for string from beginning of line
   }

   // recreate the filteredOptions collection, adding only options that match the filter
   this.$filteredOptions = this.$options.filter(function() {
      if (re.test($(this).text()) == true) {
         return true;
      }
   });
};

combobox.prototype.handleBlur = function() {
   var thisObj = this;

   this.closeTimer = setTimeout(function() {
      thisObj.collapsePopup();
   }, 100);
   return true;
};

combobox.prototype.handleFocus = function() {
   clearTimeout(this.closeTimer);
   return true;
};

combobox.prototype.handleKeydown = function(e) {
   var $curOption = this.$filteredOptions.filter('[aria-selected=true]');
   var curNdx = -1;

   if (this.$edit.is(':disabled') && e.keyCode !== this.keys.tab) {
      return false;
   }

   if ($curOption.length) {
      curNdx = this.$filteredOptions.index($curOption);
   }

   switch(e.keyCode) {
      case this.keys.tab: {

         // Store the current option and and collapse the popup
         this.selectOption($curOption);
         this.collapsePopup();

         
         return true; // allow tab to propagate
      }
      case this.keys.esc: { // Do not change combobox value
         
         // restore the stored selection and collapse the popup
         this.selectOption(this.$selected, true);
         this.collapsePopup();

         return false;
      }
      case this.keys.enter: { // Do not change combobox value
         if (e.shiftKey || e.altKey || e.ctrlKey) {
            // do nothing
            return true;
         }

         // store the new selection
         this.selectOption($curOption, true);

         // Close the popup
         this.collapsePopup();

         return false;
      }
      case this.keys.down: {
         if (e.shiftKey || e.ctrlKey) {
            // do nothing
            return true;
         }

         if (e.altKey) {
            this.expandPopup();
            return false;
         }

         if (this.isExpanded()) {

            console.log(curNdx);
            console.log(this.$filteredOptions.length-1);

            // move to the next item in the options list
            if (curNdx !== this.$filteredOptions.length - 1) {
               var $next = this.$filteredOptions.eq(curNdx + 1);

               // scroll the popup window to the new option
               this.$popup.scrollTop(this.calcOffset($next));

               // Update option selection - do not store
               this.selectOption($next, false);

               // Select the text
               this.$edit.select();
            }
         }
         else {
            this.expandPopup();
            this.selectOption(this.$selected.length ? this.$selected : this.$filteredOptions.first(), false);
         }

         return false;
      }
      case this.keys.up: {
         if (e.shiftKey || e.ctrlKey) {
            // do nothing
            return true;
         }

         if (e.altKey) {
            this.collapsePopup();
            return false;
         }

         // move to the previous item in the option list
         if (curNdx > 0) {
            var $prev = this.$filteredOptions.eq(curNdx - 1);

            if (this.isExpanded()) {
               // scroll the popup window to the new option
               this.$popup.scrollTop(this.calcOffset($prev));
            }

            // Update option selection - do not store
            this.selectOption($prev, false);

            // Select the text
            this.$edit.select();
         }
         return true;
      }
      case this.keys.home: {
         // select the first option
         var $first = this.$filteredOptions.first();

         if (this.isExpanded()) {
            // Update option selection - do not store
            this.selectOption($first, false);

            // scroll the popup window to the top
            this.$popup.scrollTop(0);
         }
         else {
            // Update the selection
            this.selectOption($first, true);
         }

         // Select the text
         this.$edit.select();

         return false;
      }
      case this.keys.end: {
         // select the last option
         var $last = this.$filteredOptions.last();

         if (this.isExpanded()) {
            // Update option selection - do not store
            this.selectOption($last, false);

            // scroll the option window to the new option
            this.$popup.scrollTop(this.calcOffset($last));
         }
         else {
            // Update the selection
            this.selectOption($last, true);
         }

         // Select the text
         this.$edit.select();

         return false;
      }

   }
};

combobox.prototype.handleKeyup = function(e) {

   if (e.ctrlKey || e.altKey) { // allow shiftKey to handle uppercase letter entry
      // do nothing
      return true;
   }

   switch (e.keyCode) {
      case this.keys.shift:
      case this.keys.ctrl:
      case this.keys.alt:
      case this.keys.esc:
      case this.keys.tab:
      case this.keys.enter:
      case this.keys.left:
      case this.keys.right:
      case this.keys.up:
      case this.keys.down:
      case this.keys.home:
      case this.keys.end: {
         // do nothing
         return true;
      }
   }

   if (this.$edit.is(':disabled')) {
      return false;
   }

   var val = this.$edit.val();

   // make all items visible and remove the selection
   this.$filteredOptions = this.$options.attr('aria-selected', 'false').show();

   if (val.length > 0) {
      this.filterOptions(val);

      // Hide the options that do not match
      this.$options.not(this.$filteredOptions).hide();
   }

   if (this.$filteredOptions.length > 0) {
      var $newOption = this.$filteredOptions.first();
      var newVal = $newOption.text();
      var start = val.length;
      var end = newVal.length;

      if (this.acType === 'both') {
         /*
          * NOTE: Modify this code if you want to allow autocomplete for contained strings rather than matching
          * the start of a string.  The code would need to preserve the typed letters, updating the edit control
          * with the first matching option, highlight the search string in the edit box and set cursor at
          * end of the string.
          */
         if (e.keyCode !== this.keys.backspace) {
            // if the user isn't backspacing, fill in the suggested value.
            this.$edit.val(newVal);
         }

         // Select the auto-complete text
         this.selectText(start, end);
      }

      if (val.length > 0) {
         $newOption.attr('aria-selected', 'true');
         this.$edit.attr('aria-activedescendant', $newOption.attr('id'));
      }
   }
   else {
      this.$edit.attr('aria-activedescendant', '');
   }

   // Update the combobox status text
   this.updateStatus();

   if (this.$filteredOptions.length) {
      // Expand the popup
      this.expandPopup();
   }
   else {
      // No matches - Collapse the popup
      this.collapsePopup();
   }


   return false;
};

combobox.prototype.handleOptionClick = function(e) {
   // set the focus on the edit box
   this.$edit.focus();

   // select the clicked item
   this.selectOption($(e.target), true);

   // close the popup
   this.collapsePopup();
};

combobox.prototype.isExpanded = function() {
   if ((this.bLegacy ? this.$edit.attr('aria-expanded') : this.$comboWrap.attr('aria-expanded')) === 'true') {
      return true;
   }
   return false;
};

combobox.prototype.collapsePopup = function() {
   if (this.bLegacy) {
      this.$edit.attr('aria-expanded', 'false');
   }
   else {
      this.$comboWrap.attr('aria-expanded', 'false');
   }
   this.$btn.removeClass('expanded');
   this.$popup.hide();
};

combobox.prototype.expandPopup = function() {
   if (this.bLegacy) {
      this.$edit.attr('aria-expanded', 'true');
   }
   else {
      this.$comboWrap.attr('aria-expanded', 'true');
   }
   this.$btn.addClass('expanded');
   this.$popup.show();
};

//
// Function selectOption() is a function to select a new combobox option.
// The jQuery object for the new option is stored and the selected class is added
//
// @param ($id object) $id is the jQuery object of the new option to select
//
// @param (bStore boolean) If true, store the current selection; if false, only update popup
//
// @return N/A
//
combobox.prototype.selectOption = function($option, bStore) {
   
   if ($option.length) {
      // add the selected class to the new option
      $option.attr('aria-selected', 'true');

      // remove the option selection
      this.$options.not($option).attr('aria-selected', 'false');

      // update the edit box
      this.$edit.val($option.text());

      //move cursor to the end
      this.selectText(this.$edit.val().length, this.$edit.val().length);

      // Update the focus to the currently selected item
      this.$edit.attr('aria-activedescendant', $option.attr('id'));


      if (bStore) {
        // store the newly selected option
        this.$selected = $option;

        // Hide the non-selected items
        this.$options.not($option).hide();
      }
   }
};

//
// Function selectText() is a function to select some of the text in the edit box for autocompletion.
// If start and end are the same value, the function moves the cursor to that position.
//
// @param (start object) start is the character position for the start of the selection
//
// @param (end object) end is the character position for the end of the selection
//
// @return N/A
//
combobox.prototype.selectText = function(start, end) {

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
};

//
// Function updateStatus() is a function to update the status live region with the current number of
// available options.
//
// @param N/A
//
// @return N/A
//
combobox.prototype.updateStatus = function() {
   var listLen = this.$filteredOptions.length;

   if (listLen === 1) {
      this.$status.html('1 match available.');
   }
   else if (listLen > 1) {
      this.$status.html(listLen + ' matches available.');
   }
   else {
      this.$status.html('No matches.');
   }
};
