//
// Function menu() is the constructor of a menu widget
// The widget will bind to the ul passed to it.
//
// @param(id string) id is the HTML id of the ul to bind to
//
// @return N/A
//
function menu(id) {

   // define widget properties
   this.$id = $('#' + id);
   this.$items = this.$id.find('.menu-item'); // jQuery array of menu items
   this.$parents = this.$id.find('.menu-parent'); // jQuery array of menu items
   this.$anchors = this.$id.find('a'); // jQuery array of menu anchors (e.g. hrefs)

   this.keys = {
      tab:    9
   };

   // bind event handlers
   this.bindHandlers();
};

//
// Function bindHandlers() is a member function to bind event handlers for the widget.
//
// @return N/A
//
menu.prototype.bindHandlers = function() {

   var thisObj = this;

   ///////// bind mouse event handlers //////////

   // bind a mouseenter handler for the menu items
   this.$items.mouseenter(function(e) {
      $(this).addClass('menu-hover');
      return true;
   });

   // bind a mouseout handler for the menu items
   this.$items.mouseout(function(e) {
      $(this).removeClass('menu-hover');
      return true;
   });

   // bind a mouseenter handler for the menu parents
   this.$parents.mouseenter(function(e) {
      return thisObj.handleMouseEnter($(this), e);
   });

   // bind a mouseleave handler
   this.$parents.mouseleave(function(e) {
      return thisObj.handleMouseLeave($(this), e);
   });

   // bind a click handler
   this.$anchors.click(function(e) {
      return thisObj.handleClick($(this), e);
   });

   //////////// bind key event handlers //////////////////
  
   // bind a keydown handler
   this.$anchors.keydown(function(e) {
      return thisObj.handleKeyDown($(this), e);
   });

   // bind a focus handler
   this.$anchors.focus(function(e) {
      return thisObj.handleFocus($(this), e);
   });

   // bind a blur handler
   this.$anchors.blur(function(e) {
      return thisObj.handleBlur($(this), e);
   });

   // bind a document click handler
   $(document).click(function(e) {
         return thisObj.handleDocumentClick(e);
   });

} // end bindHandlers()

//
// Function handleMouseEnter() is a member function to process mouseover
// events for the top menus.
//
// @param($item object) $item is the jquery object of the item firing the event
//
// @param(e object) e is the associated event object
//
// @return(boolean) Returns false;
//
menu.prototype.handleMouseEnter = function($item, e) {

   // Remove hover style
   $item.addClass('menu-hover');

   // expand the first level submenu
   if ($item.is('.menu-parent')) {
      $item.children('ul').show();
   }
   //e.stopPropagation();
   return true;

} // end handleMouseEnter()

//
// Function handleMouseOut() is a member function to process mouseout
// events for the top menus.
//
// @param($item object) $item is the jquery object of the item firing the event
//
// @param(e object) e is the associated event object
//
// @return(boolean) Returns false;
//
menu.prototype.handleMouseOut = function($item, e) {

   // Remove hover style
   $item.removeClass('menu-hover');

   //e.stopPropagation();
   return true;

} // end handleMouseOut()

//
// Function handleMouseLeave() is a member function to process mouseout
// events for the top menus.
//
// @param($menu object) $menu is the jquery object of the item firing the event
//
// @param(e object) e is the associated event object
//
// @return(boolean) Returns false;
//
menu.prototype.handleMouseLeave = function($menu, e) {

   var $subMenu = $menu.children('ul');
   // Remove hover style
   $menu.removeClass('menu-hover');

   // hide the submenu
   $menu.children('ul').hide();

   //e.stopPropagation();
   return true;

} // end handleMouseLeave()

//
// Function handleClick() is a member function to process click events
// for the top menus.
//
// @param($item object) $item is the jquery object of the item firing the event
//
// @param(e object) e is the associated event object
//
// @return(boolean) Returns false;
//
menu.prototype.handleClick = function($item, e) {

   // If a menu is open, close it
   this.$parents.children('ul').hide();

   // remove hover styling
   this.$items.removeClass('menu-hover');
   this.$parents.removeClass('menu-hover');

   return true;

} // end handleClick()

//
// Function handleFocus() is a member function to process focus events
// for the menu.
//
// @param($item object) $item is the jquery object of the item firing the event
//
// @param(e object) e is the associated event object
//
// @return(boolean) Returns true;
//
menu.prototype.handleFocus = function($item, e) {

   var $itemLI = $item.parent();

   // add the focus styling to the anchor containing LI
   $itemLI.addClass('menu-focus');

   // if itemLI is a parent item, show the child menu
   if ($itemLI.is('.menu-parent')) {
      $itemLI.children('ul').show();
   }

   return true;

} // end handleFocus()

//
// Function handleBlur() is a member function to process blur events
// for the menu.
//
// @param($item object) $item is the jquery object of the item firing the event
//
// @param(e object) e is the associated event object
//
// @return(boolean) Returns true;
//
menu.prototype.handleBlur = function($item, e) {

   $item.parent().removeClass('menu-focus');

   return true;

} // end handleBlur()

//
// Function handleKeyDown() is a member function to process keydown events
// for the menus.
//
// @param($item object) $item is the jquery object of the item firing the event
//
// @param(e object) e is the associated event object
//
// @return(boolean) Returns false if consuming; true if propagating
//
menu.prototype.handleKeyDown = function($item, e) {

   if (e.altKey || e.ctrlKey) {
          // Modifier key pressed: Do not process
          return true;
      }

   switch(e.keyCode) {
      case this.keys.tab: {
         var $newItem = null;

         // remove the focus styling
         $item.parent().removeClass('menu-focus');

         if (e.shiftKey) { // moving backward through menu

            $newItem = this.moveToPrevious($item);

            if ($newItem) {
               $newItem.focus();
            }
            else {
               return true;
            }
         }
         else { // tabbing forward through menu

            $newItem = this.moveToNext($item);

            if ($newItem) {
               $newItem.focus();
            }
            else {
               return true;
            }
         }

         e.stopPropagation();
         return false;
      }
      case this.keys.esc: {

         // if this is a parent item, close its menu
         if ($item.is('.menu-parent')) {
            $item.children('ul').hide();

            // clear the stored curMenu
            this.$curMenu = null;
         }
         e.stopPropagation();
         return false;
      }

   } // end switch

   return true;

} // end handleKeyDown()

//
// Function getLast() is a member function to find the last item in a menu tree.
//
// This function is recursive.
//
// @param($item object) $item is the active menu item
//
// @return(object) Returns the jQuery object of the last menu item
//
menu.prototype.getLast = function($item) {

   $newItem = null;

   // we've found the last item, end recursion
   if (!$item.is('.menu-parent')) {
         return $item;
   }

   var $childMenu = $item.children('ul');

   // show the child menu
   $childMenu.show();

   // recurse on the last item of the child menu
   return this.getLast($childMenu.find('li').last());
}

//
// Function moveToNext() is a member function to move to the next item in the menu.
// This will be either the next item in a child menu or the first item of the next
// root-level menu if at bottom of children. If the active item is the last in the
// menu, this function returns undefined.
//
// @param($item object) $item is the active menu item
//
// @return (object) Returns the next menu item or undefined if no more items
//
menu.prototype.moveToNext = function($item) {

   var itemIndex = this.$anchors.index($item);
   var $itemLI = $item.parent(); // $item's containing LI
   var $menuItems = $itemLI.parent().children('li'); // the items in the currently active menu
   var menuIndex = $menuItems.index($itemLI);
   var $newItem = null;
   var $newItemUL = null;
   var $parentMenus = null;

   // get list of all parent menus for item, up to the root level
   $parentMenus = $itemLI.parentsUntil('div').filter('ul').not('.root-level');

   if (itemIndex < this.$anchors.length-1) { // not the last anchor

      // get the next anchor in the list
      $newItem = this.$anchors.eq(itemIndex+1);

      // get the new anchor's containing menu
      $newItemUL = $newItem.parent().parent();

      if (!$itemLI.is('.menu-parent')) {
         // itemLI is not a menu parent. Moving to the next anchor item may require
         // closing child menus (if new item is on a different menu).

         if (menuIndex == $menuItems.length-1) {
            // $item is the last of a menu. this means the new item will be on a
            // different menu.

            if ($newItemUL.is('.root-level')) {
               // newItem is a root-level item. Walk backward up the menu list
               // from $item and hide all menus

               $parentMenus.each(function(index) {
                  $(this).hide();
               });
            }
            else {
               // newItem is not at the root level. Walk backward up the menu
               // list from $item until we reach the newItem's menu.

               var haveMatch = false;

               $parentMenus.each(function(index) {

               // step backward, hiding menus until the current
               // menu matches newItem's menu
               if ($(this)[0] == $newItemUL[0]) {
                  haveMatch = true;
                  }
                  else if (haveMatch == false) {
                     $(this).hide();
                  }
               });
            }
         }
      }
   }
   else { // this is the last item

      // user is tabbing off the end of the menu. Walk backward up menu list
      // from $item, hiding all child menus
      $parentMenus.each(function(index) {
         $(this).hide();
      });
 
      // return undefined to signal to widget not to consume the tab
      return undefined;
   }

   // return the newly selected anchor
   return $newItem;
}

//
// Function moveToPrevious() is a member function to move to the previous item in the menu.
// This will be either the previous item in a child menu or the first item of the previous
// root-level menu if at bottom of children. If the active item is the first in the
// menu, this function returns undefined.
//
// @param($item object) $item is the active menu item
//
// @return (object) Returns the next menu item or undefined if no more items
//
menu.prototype.moveToPrevious = function($item) {

   var itemIndex = this.$anchors.index($item);
   var $itemLI = $item.parent(); // $item's containing LI
   var $menuItems = $itemLI.parent().children('li'); // the items in the currently active menu
   var menuIndex = $menuItems.index($itemLI);
   var $newItem = null;
   var $newItemUL = null;
   var $parentMenus = null;

   // get list of all parent menus for item, up to the root level
   $parentMenus = $itemLI.parentsUntil('div').filter('ul').not('.root-level');

   if (itemIndex > 0) { // not the first anchor

      // get the previous anchor in the list
      $newItem = this.$anchors.eq(itemIndex-1);

      // get the new anchor's containing menu
      $newItemUL = $newItem.parent().parent();

      if ($itemLI.is('.menu-parent')) {
         // item is a menu parent, need to hide the child menu
         $itemLI.children('ul').hide();
      }

      // Moving backward may require unhiding child menus.
      // If newItem is not visible, walk backward up the menus from $newItem, unhidng
      // all menus until finding a visible one.
      if (!$newItem.is(':visible')) {

         // get list of all parent menus for newItem, up to the root level
         $parentMenus = $newItem.parentsUntil('div').filter('ul').not('.root-level');

         $parentMenus.each(function(index) {
            // step backward, unhiding any menus 
            if (!$(this).is(':visible')) {
               $(this).show();
            }
         });
      }
   }
   else { // this is the first item

      // hide any open child menus
      if ($itemLI.is('.menu-parent')) {
         $itemLI.children('ul').hide();
      }

      // return undefined to signal to widget not to consume the tab
      return undefined;
   }

   // return the newly selected anchor
   return $newItem;
}

//
// Function handleDocumentClick() is a member function to process click events on the document. Needed
// to close an open menu if a user clicks outside the menubar
//
// @param(e object) e is the associated event object
//
// @return(boolean) Returns true;
//
menu.prototype.handleDocumentClick = function(e) {

   // get a list of all child menus
   var $childMenus = this.$id.find('ul').not('.root-level');

   // hide the child menus
   $childMenus.hide();

   // allow the event to propagate
   return true;

} // end handleDocumentClick()

/////////////// end menubar widget definition /////////////////////
