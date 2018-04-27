/*******************************************
 * ARIA Datepicker widget
 *
 * Revision: 1.5
 *
 * Last Modified: 10Dec2013
 * Modified by: Keith Hays
 *
 * CHANGE LOG
 *
 * Revision 1.6
 *    - Fixed bug in ShowNextMonth() function that prevented the day offset from being applied.
 *
 * Revision 1.5
 *    - Widget now requires the id of the controlling button to be passed (if bModal is false). Button must exist in page.
 *
 *    - Fixed home and end key handlers so they set the activedescendant properly.
 *
 * Revision 1.4
 *    - Widget is now entirely dynamic and will be inserted into the dom after the specified edit control ID. 
 *      If modal, a button to display the widget is added as well.
 *
 *    - Usage is simplified: widget now takes only two parameters.
 *
 *    - Fixed issue with multiple instances in a page having duplicated Ids.
 *
 *    - Fixed non-modal functioning so the widget remains visible.
 *
 *    - Fixed bug where there were two row1 ids were created in the grid.
 *
 * Revison 1.3
 *    Initial revision released for production.
 */

/*
 * Function datepicker() instances a datepicker widget and inserts it in the DOM after
 * If modal, clicking on the button (buttonId) will display the dialog box and set
 * the focus upon the date in the editId control or the current date (if the control is
 * empty or has an invalid date). Focus will return to the edit control when a date is
 * selected or if the escape key is pressed.
 *
 * @param(editId string) editId is the id of the edit control that will receive the date
 *
 * @param(buttonId string) buttonId is the id of the button control that will display the widget (ignored if bModal is false)
 *
 * @param(bModal boolean) modal is true if the dialog shoud be hidden and display modally, false if always
 * visible.
 *
 */ 
function datepicker(editId, buttonId, bModal) {


   this.name = 'dp-' + editId; // desired id of the datepicker container
   this.$edit = jQuery('#' + editId); // div or text box that will receive the selected date string and focus
   this.$button = jQuery('#' + buttonId); // control that will display the widget
   this.bModal = bModal; // true if datepicker should appear in a modal dialog box.

   this.monthNames = ['January', 'February', 'March', 'April','May','June',
         'July', 'August', 'September', 'October', 'November', 'December'];

   this.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

   // Create the widget after the controlling button
   var widget = '<div id="' + this.name + '" class="datepicker" role="application"><div class="month-wrap">';
      widget += '<div id="' + this.name + '-bn_prev" class="bn_prev" role="button" aria-label="Go to previous month" tabindex="0">';
      widget += '<img class="bn_img" src="https://cites-illinois.github.io/accessibility/accessibility/images/datepicker/prev.png" alt="<<"/></div>';
      widget += '<div id="' + this.name + '-month" class="month" role="heading" aria-live="assertive" aria-atomic="true">February 2011</div>';
      widget += '<div id="' + this.name + '-bn_next" class="bn_next" role="button" aria-label="Go to next month" tabindex="0">';
      widget += '<img class="bn_img" src="https://cites-illinois.github.io/accessibility/accessibility/images/datepicker/next.png" alt=">>"/></div></div>';
      widget += '<table id="' + this.name + '-cal" class="cal" role="grid" aria-labelledby="month" tabindex="0">';
      widget += '<thead><tr><th><abbr title="Sunday">Su</abbr></th><th><abbr title="Monday">Mo</abbr></th>';
      widget += '<th><abbr title="Tuesday">Tu</abbr></th><th><abbr title="Wednesday">We</abbr></th><th><abbr title="Thursday">Th</abbr></th>';
      widget += '<th><abbr title="Friday">Fr</abbr></th><th><abbr title="Saturday">Sa</abbr></th></tr></thead>';
      widget += '<tbody></tbody></table></div>';

   if (bModal) {
      this.$button.after(widget);
   }
   else {
      this.$edit.after(widget);
   }

   this.$widgetId = jQuery('#' + this.name); // container element for the widget
   this.$monthObj = this.$widgetId.find('div.month');
   this.$prev = this.$widgetId.find('div.bn_prev');
   this.$next = this.$widgetId.find('div.bn_next');
   this.$grid = this.$widgetId.find('table.cal');

   if (this.isValidDate(this.$edit.val())) {
      this.dateObj = new Date(this.$edit.val());
   }
   else {
      this.dateObj = new Date();
   }

   this.curYear = this.dateObj.getFullYear(); 
   this.year = this.curYear;

   this.curMonth = this.dateObj.getMonth(); 
   this.month = this.curMonth;
   this.currentDate = true;

   this.date = this.dateObj.getDate(); 

   this.keys = {
                tab:       9,
                enter:    13,
                esc:      27,
                space:    32,
                pageup:   33,
                pagedown: 34,
                end:      35,
                home:     36,
                left:     37,
                up:       38,
                right:    39,
                down:     40
               };
   
   // display the current month
   this.$monthObj.html(this.monthNames[this.month] + ' ' + this.year);

   // populate the calendar grid
   this.popGrid();

   // update the table's activedescdendant to point to the current day
   this.$grid.attr('aria-activedescendant', this.$grid.find('.today').attr('id'));

   this.bindHandlers();

   // hide dialog if in modal mode
   if (this.bModal) {
      this.$widgetId.attr('aria-hidden', 'true');
   }
}

//
// popGrid() is a member function to populate the datepicker grid with calendar days
// representing the current month
//
// @return N/A
//
datepicker.prototype.popGrid = function() {
   
   var numDays = this.calcNumDays(this.year, this.month);
   var startWeekday = this.calcStartWeekday(this.year, this.month);
   var weekday = 0;
   var curDay = 1;
   var rowCount = 1;
   var $tbody = this.$grid.find('tbody');

   var gridCells = '\t<tr id="' + this.name + '-row1">\n';

   // clear the grid
   $tbody.empty();

   // Insert the leading empty cells
   for (weekday = 0; weekday < startWeekday; weekday++) {

      gridCells += '\t\t<td class="empty">&nbsp;</td>\n';
   }

   // insert the days of the month.
   for (curDay = 1; curDay <= numDays; curDay++) {

      if (curDay === this.date && this.currentDate === true) {

         gridCells += '\t\t<td id="' + this.name + '-day' + curDay + '" class="today" headers="row' +
                      rowCount + ' ' + this.dayNames[weekday] + '" role="gridcell" aria-selected="false">' + curDay + '</td>';

      }
      else {
         gridCells += '\t\t<td id="' + this.name + '-day' + curDay + '" headers="row' +
                      rowCount + ' ' + this.dayNames[weekday] + '" role="gridcell" aria-selected="false">' + curDay + '</td>';
      }


      if (weekday === 6 && curDay < numDays) {
         // This was the last day of the week, close it out
         // and begin a new one
         rowCount++;
         gridCells += '\t</tr>\n\t<tr id="' + this.name + '-row' + rowCount + '">\n';
         weekday = 0;
      }
      else {
         weekday++;
      }
   }

   // Insert any trailing empty cells
   for (weekday; weekday < 7; weekday++) {

      gridCells += '\t\t<td class="empty">&nbsp;</td>\n';
   }

   gridCells += '\t</tr>';

   $tbody.append(gridCells);
};

//
// calcNumDays() is a member function to calculate the number of days in a given month
//
// @return (integer) number of days
//
datepicker.prototype.calcNumDays = function(year, month) {
   
   return 32 - new Date(year, month, 32).getDate();
};

//
// calcstartWeekday() is a member function to calculate the day of the week the first day of a
// month lands on
//
// @return (integer) number representing the day of the week (0=Sunday....6=Saturday)
//
datepicker.prototype.calcStartWeekday = function(year, month) {
   
   return  new Date(year, month, 1).getDay();

}; // end calcStartWeekday()

//
// showPrevMonth() is a member function to show the previous month
//
// @param (offset int) offset may be used to specify an offset for setting
//                      focus on a day the specified number of days from
//                      the end of the month.
// @return N/A
//
datepicker.prototype.showPrevMonth = function(offset) {
   // show the previous month
   if (this.month === 0) {
      this.month = 11;
      this.year--;
   }
   else {
      this.month--;
   }
   
   if (this.month !== this.curMonth || this.year !== this.curYear) {
      this.currentDate = false;
   }
   else {
      this.currentDate = true;
   }

   // populate the calendar grid
   this.popGrid();

   this.$monthObj.html(this.monthNames[this.month] + ' ' + this.year);

   // if offset was specified, set focus on the last day - specified offset
   if (offset !== null) {
      var numDays = this.calcNumDays(this.year, this.month);
      var day = this.name + '-day' + (numDays - offset);
      
      this.$grid.attr('aria-activedescendant', day);
      jQuery('#' + day).addClass('focus').attr('aria-selected', 'true');
   }

}; // end showPrevMonth()

//
// showNextMonth() is a member function to show the next month
//
// @param (offset int) offset may be used to specify an offset for setting
//                      focus on a day the specified number of days from
//                      the beginning of the month.
// @return N/A
//
datepicker.prototype.showNextMonth = function(offset) {

   // show the next month
   if (this.month === 11) {
      this.month = 0;
      this.year++;
   }
   else {
      this.month++;
   }

   if (this.month !== this.curMonth || this.year !== this.curYear) {
      this.currentDate = false;
   }
   else {
      this.currentDate = true;
   }
   
   // populate the calendar grid
   this.popGrid();

   this.$monthObj.html(this.monthNames[this.month] + ' ' + this.year);

      // if offset was specified, set focus on the first day + specified offset
      if (offset !== null) {
         var day = this.name + '-day' + offset;
         
         this.$grid.attr('aria-activedescendant', day);
         jQuery('#' + day).addClass('focus').attr('aria-selected', 'true');
      }

}; // end showNextMonth()

//
// showPrevYear() is a member function to show the previous year
//
// @return N/A
//
datepicker.prototype.showPrevYear = function() {

      // decrement the year
      this.year--;
      
      if (this.month !== this.curMonth || this.year !== this.curYear) {
         this.currentDate = false;
      }
      else {
         this.currentDate = true;
      }

      // populate the calendar grid
      this.popGrid();

      this.$monthObj.html(this.monthNames[this.month] + ' ' + this.year);

}; // end showPrevYear()

//
// showNextYear() is a member function to show the next year
//
// @return N/A
//
datepicker.prototype.showNextYear = function() {

   // increment the year
   this.year++;

   if (this.month !== this.curMonth || this.year !== this.curYear) {
      this.currentDate = false;
   }
   else {
      this.currentDate = true;
   }
   
   // populate the calendar grid
   this.popGrid();

   this.$monthObj.html(this.monthNames[this.month] + ' ' + this.year);

}; // end showNextYear()

//
// bindHandlers() is a member function to bind event handlers for the widget
//
// @return N/A
//
datepicker.prototype.bindHandlers = function() {

   var thisObj = this;

   ////////////////// bind a click handler for the controlling button ////////////
   if (this.bModal) {
      jQuery(this.$button).click(function(e) {
         thisObj.showDlg();
         return false;
      });
   }

   ////////////////////// bind button handlers //////////////////////////////////
   this.$prev.click(function(e) {
      return thisObj.handlePrevClick(e);
   });

   this.$next.click(function(e) {
      return thisObj.handleNextClick(e);
   });

   this.$prev.keydown(function(e) {
      return thisObj.handlePrevKeyDown(e);
   });

   this.$next.keydown(function(e) {
      return thisObj.handleNextKeyDown(e);
   });

   ///////////// bind grid handlers //////////////
  
   this.$grid.keydown(function(e) {
      return thisObj.handleGridKeyDown(e);
   });

   this.$grid.keypress(function(e) {
      return thisObj.handleGridKeyPress(e);
   });

   this.$grid.focus(function(e) {
      return thisObj.handleGridFocus(e);
   });

   this.$grid.blur(function(e) {
      return thisObj.handleGridBlur(e);
   });

   this.$grid.delegate('td', 'click', function(e) {
      return thisObj.handleGridClick(this, e);
   });

   ///////////// bind a click handler for the calendar object //////////////
   this.$widgetId.click(function(e) {
      return false;
   });

}; // end bindHandlers();

//
// handlePrevClick() is a member function to process click events for the prev month button
//
// @param (e obj) e is the event object associated with the event
//
// @return (boolean) false if consuming event, true if propagating
//
datepicker.prototype.handlePrevClick = function(e) {

   var active = this.$grid.attr('aria-activedescendant');

   if (e.ctrlKey) {
      this.showPrevYear();
   }
   else {
      this.showPrevMonth();
   }

   if (this.currentDate == false) {
      this.$grid.attr('aria-activedescendant', this.name + '-day1');
   }
   else {
      this.$grid.attr('aria-activedescendant', active);
   }

   return false;

}; // end handlePrevClick()

//
// handleNextClick() is a member function to process click events for the next month button
//
// @param (e obj) e is the event object associated with the event
//
// @return (boolean) false if consuming event, true if propagating
//
datepicker.prototype.handleNextClick = function(e) {

   var active = this.$grid.attr('aria-activedescendant');

   if (e.ctrlKey) {
      this.showNextYear();
   }
   else {
      this.showNextMonth();
   }

   if (this.currentDate == false) {
      this.$grid.attr('aria-activedescendant', this.name + '-day1');
   }
   else {
      this.$grid.attr('aria-activedescendant', active);
   }

   return false;

}; // end handleNextClick()

//
// handlePrevKeyDown() is a member function to process keydown events for the prev month button
//
// @param (e obj) e is the event object associated with the event
//
// @return (boolean) false if consuming event, true if propagating
//
datepicker.prototype.handlePrevKeyDown = function(e) {

   if (e.altKey) {
      return true;
   }

   switch (e.keyCode) {
      case this.keys.tab: {
         if (!this.bModal || !e.shiftKey || e.ctrlKey) {
            return true;
         }

         this.$grid.focus();
         return false;
      }
      case this.keys.enter:
      case this.keys.space: {
         if (e.shiftKey) {
            return true;
         }

         if (e.ctrlKey) {
            this.showPrevYear();
         }
         else {
            this.showPrevMonth();
         }

         return false;
      }
   }

   return true;

}; // end handlePrevKeyDown()

//
// handleNextKeyDown() is a member function to process keydown events for the next month button
//
// @param (e obj) e is the event object associated with the event
//
// @return (boolean) false if consuming event, true if propagating
//
datepicker.prototype.handleNextKeyDown = function(e) {

   if (e.altKey) {
      return true;
   }

   switch (e.keyCode) {
      case this.keys.enter:
      case this.keys.space: {

         if (e.ctrlKey) {
            this.showNextYear();
         }
         else {
            this.showNextMonth();
         }

         return false;
      }
   }

   return true;

}; // end handleNextKeyDown()

//
// handleGridKeyDown() is a member function to process keydown events for the datepicker grid
//
// @param (e obj) e is the event object associated with the event
//
// @return (boolean) false if consuming event, true if propagating
//
datepicker.prototype.handleGridKeyDown = function(e) {

      var $rows = this.$grid.find('tbody tr');
      var $curDay = jQuery('#' + this.$grid.attr('aria-activedescendant'));
      var $days = this.$grid.find('td').not('.empty');
      var $curRow = $curDay.parent();

      if (e.altKey) {
         return true;
      }

      switch(e.keyCode) {
         case this.keys.tab: {

            if (this.bModal == true && !e.shiftKey) {
               this.$prev.focus();
               return false;
            }
            break;
         } 
         case this.keys.enter:
         case this.keys.space: {

            if (e.ctrlKey) {
               return true;
            }

            // update the edit box
            this.$edit.val((this.month < 9 ? '0' : '') + (this.month+1) + '/' + $curDay.html() + '/' + this.year);

            // fall through
         }
         case this.keys.esc: {
            // dismiss the dialog box
            this.hideDlg();
           
            return false;
         }
         case this.keys.left: {

            if (e.ctrlKey || e.shiftKey) {
               return true;
            }

            var dayIndex = $days.index($curDay) - 1;
            var $prevDay = null;

            if (dayIndex >= 0) {
               $prevDay = $days.eq(dayIndex);

               $curDay.removeClass('focus').attr('aria-selected', 'false');
               $prevDay.addClass('focus').attr('aria-selected', 'true');

               this.$grid.attr('aria-activedescendant', $prevDay.attr('id'));
            }
            else {
               this.showPrevMonth(0);
            }

            return false;
         }
         case this.keys.right: {

            if (e.ctrlKey || e.shiftKey) {
               return true;
            }

            var dayIndex = $days.index($curDay) + 1;
            var $nextDay = null;

            if (dayIndex < $days.length) {
               $nextDay = $days.eq(dayIndex);
               $curDay.removeClass('focus').attr('aria-selected', 'false');
               $nextDay.addClass('focus').attr('aria-selected', 'true');

               this.$grid.attr('aria-activedescendant', $nextDay.attr('id'));
            }
            else {
               // move to the next month
               this.showNextMonth(1);
            }

            return false;
         }
         case this.keys.up: {

            if (e.ctrlKey || e.shiftKey) {
               return true;
            }

            var dayIndex = $days.index($curDay) - 7;
            var $prevDay = null;

            if (dayIndex >= 0) {
               $prevDay = $days.eq(dayIndex);

               $curDay.removeClass('focus').attr('aria-selected', 'false');
               $prevDay.addClass('focus').attr('aria-selected', 'true');

               this.$grid.attr('aria-activedescendant', $prevDay.attr('id'));
            }
            else {
               // move to appropriate day in previous month
               dayIndex = 6 - $days.index($curDay);

               this.showPrevMonth(dayIndex);
            }

            return false;
         }
         case this.keys.down: {

            if (e.ctrlKey || e.shiftKey) {
               return true;
            }

            var dayIndex = $days.index($curDay) + 7;
            var $prevDay = null;

            if (dayIndex < $days.length) {
               $prevDay = $days.eq(dayIndex);

               $curDay.removeClass('focus').attr('aria-selected', 'false');
               $prevDay.addClass('focus').attr('aria-selected', 'true');

               this.$grid.attr('aria-activedescendant', $prevDay.attr('id'));
            }
            else {
               // move to appropriate day in next month
               dayIndex = 8 - ($days.length - $days.index($curDay));

               this.showNextMonth(dayIndex);
            }

            return false;
         }
         case this.keys.pageup: {
            var active = this.$grid.attr('aria-activedescendant');


            if (e.shiftKey) {
               return true;
            }


            if (e.ctrlKey) {
               this.showPrevYear();
            }
            else {
               this.showPrevMonth();
            }

            if (jQuery('#' + active).attr('id') == undefined) {
               var lastDay = this.name + '-day' + this.calcNumDays(this.year, this.month);
               jQuery('#' + lastDay).addClass('focus').attr('aria-selected', 'true');
            }
            else {
               jQuery('#' + active).addClass('focus').attr('aria-selected', 'true');
            }

            return false;
         }
         case this.keys.pagedown: {
            var active = this.$grid.attr('aria-activedescendant');


            if (e.shiftKey) {
               return true;
            }

            if (e.ctrlKey) {
               this.showNextYear();
            }
            else {
               this.showNextMonth();
            }

            if (jQuery('#' + active).attr('id') == undefined) {
               var lastDay = this.name + '-day' + this.calcNumDays(this.year, this.month);
               jQuery('#' + lastDay).addClass('focus').attr('aria-selected', 'true');
            }
            else {
               jQuery('#' + active).addClass('focus').attr('aria-selected', 'true');
            }

            return false;
         }
         case this.keys.home: {

            if (e.ctrlKey || e.shiftKey) {
               return true;
            }

            $curDay.removeClass('focus').attr('aria-selected', 'false');

            jQuery('#' + this.name + '-day1').addClass('focus').attr('aria-selected', 'true');

            this.$grid.attr('aria-activedescendant', this.name + '-day1');

            return false;
         }
         case this.keys.end: {

            if (e.ctrlKey || e.shiftKey) {
               return true;
            }

            var lastDay = this.name + '-day' + this.calcNumDays(this.year, this.month);

            $curDay.removeClass('focus').attr('aria-selected', 'false');

            jQuery('#' + lastDay).addClass('focus').attr('aria-selected', 'true');

            this.$grid.attr('aria-activedescendant', lastDay);

            return false;
         }
      }

      return true;

}; // end handleGridKeyDown()

//
// handleGridKeyPress() is a member function to consume keypress events for browsers that
// use keypress to scroll the screen and manipulate tabs
//
// @param (e obj) e is the event object associated with the event
//
// @return (boolean) false if consuming event, true if propagating
//
datepicker.prototype.handleGridKeyPress = function(e) {

      if (e.altKey) {
         return true;
      }

      switch(e.keyCode) {
         case this.keys.tab:
         case this.keys.enter:
         case this.keys.space:
         case this.keys.esc:
         case this.keys.left:
         case this.keys.right:
         case this.keys.up:
         case this.keys.down:
         case this.keys.pageup:
         case this.keys.pagedown:
         case this.keys.home:
         case this.keys.end: {
            return false;
         }
      }

      return true;

}; // end handleGridKeyPress()

//
// handleGridClick() is a member function to process mouse click events for the datepicker grid
//
// @param (id obj) e is the id of the object triggering the event
//
// @param (e obj) e is the event object associated with the event
//
// @return (boolean) false if consuming event, true if propagating
//
datepicker.prototype.handleGridClick = function(id, e) {
   var $cell = jQuery(id);

   if ($cell.is('.empty')) {
      return true;
   }

   this.$grid.find('.focus').removeClass('focus').attr('aria-selected', 'false');
   $cell.addClass('focus').attr('aria-selected', 'true');
   this.$grid.attr('aria-activedescendant', $cell.attr('id'));

   var $curDay = jQuery('#' + this.$grid.attr('aria-activedescendant'));

   // update the edit box
   this.$edit.val((this.month < 9 ? '0' : '') + (this.month+1) + '/' + ($curDay.html() < 9 ? '0' : '') + $curDay.html() + '/' + this.year);

   // dismiss the dialog box
   this.hideDlg();

   return false;

}; // end handleGridClick()

//
// handleGridFocus() is a member function to process focus events for the datepicker grid
//
// @param (e obj) e is the event object associated with the event
//
// @return (boolean) true
//
datepicker.prototype.handleGridFocus = function(e) {
   var active = this.$grid.attr('aria-activedescendant');

   if (jQuery('#' + active).attr('id') == undefined) {
      var lastDay = this.name + '-day' + this.calcNumDays(this.year, this.month);
      jQuery('#' + lastDay).addClass('focus').attr('aria-selected', 'true');
   }
   else {
      jQuery('#' + active).addClass('focus').attr('aria-selected', 'true');
   }

   return true;

}; // end handleGridFocus()

//
// handleGridBlur() is a member function to process blur events for the datepicker grid
//
// @param (e obj) e is the event object associated with the event
//
// @return (boolean) true
//
datepicker.prototype.handleGridBlur = function(e) {
   jQuery('#' + this.$grid.attr('aria-activedescendant')).removeClass('focus').attr('aria-selected', 'false');

   return true;

}; // end handleGridBlur()

// isValidDate() is a member function to check that the date entered in the input field is valid. Will not check for valid february date, but
// the date function will correctly select the date in the picker.
//
// @param (date string) date is the date string to validate
//
// @return (object) returns the date object if the string is in valid format
//
datepicker.prototype.isValidDate = function(date) {
    return date.match(/^(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/) // mm/dd/yyyy
}; // end isValidDate()

//
// showDlg() is a member function to show the datepicker and give it focus. This function is only called if
// the datepicker is used in modal dialog mode.
//
// @return N/A
//
datepicker.prototype.showDlg = function() {

   var thisObj = this;


	// Bind a click listener to dismiss the dialog
	jQuery(document).bind('click.dpEvent', function(e) {
      // hide the dialog
      thisObj.hideDlg();

		// Consume all mouse events and do nothing
		return false;
   });

   // Check if date input field is empty
   //
   if (this.isValidDate(this.$edit.val())) {
      this.dateObj = null;
      this.dateObj = new Date(this.$edit.val());

      this.curYear = this.dateObj.getFullYear(); 
      this.year = this.curYear;

      this.curMonth = this.dateObj.getMonth(); 
      this.month = this.curMonth;
      this.currentDate = true;

      this.date = this.dateObj.getDate(); 

   // display the current month
   this.$monthObj.html(this.monthNames[this.month] + ' ' + this.year);

   // populate the calendar grid
   this.popGrid();

   // update the table's activedescdendant to point to the current day
   this.$grid.attr('aria-activedescendant', this.$grid.find('.today').attr('id'));

   }

   // Bind an event listener to the document to capture all mouse events to make dialog modal
   jQuery(document).bind('mousedown.dpEvent mouseup.dpEvent mousemove.dpEvent mouseover.dpEvent', function(e) {
      //ensure focus remains on the dialog
      thisObj.$grid.focus();

      // Consume all mouse events and do nothing
      return false;
   });

   // show the dialog
   this.$widgetId.attr('aria-hidden', 'false');

   this.$grid.focus();

}; // end showDlg()

//
// hideDlg() is a member function to hide the datepicker and remove focus. This function only sets focus
// on the edit box and returns if not modal
//
// @return N/A
//
datepicker.prototype.hideDlg = function() {

   var thisObj = this;

   if (this.bModal) {
      // unbind the modal event sinks
      jQuery(document).unbind('click.dpEvent mousedown.dpEvent mouseup.dpEvent mousemove.dpEvent mouseover.dpEvent');

      // hide the dialog
      this.$widgetId.attr('aria-hidden', 'true');
   }

   // set focus on the focus edit box
   this.$edit.focus();

}; // end hideDlg()
