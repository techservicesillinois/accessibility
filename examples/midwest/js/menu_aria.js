function menu(id, vmenu) {
   var thisObj = this;

   this.$id = $('#' + id);

   this.vmenu = vmenu;
   this.bChildOpen = false; // true if a root menu's submenu is open

   this.keys = {
      tab:    9,
      enter:  13,
      esc:    27,
      space:  32,
      left:   37,
      up:     38,
      right:  39,
      down:   40 
   };

   this.$menus = this.$id.find('ul');
   this.$parents = this.$id.find('[aria-haspopup]');
   this.$items = this.$id.find('[role="menuitem"]')
      .on('keydown', function(e) {
         var $curItem = $(this); // the current item
         var $menuItems = thisObj.getMenuItems($curItem); // items in current menu
         var menuLength = $menuItems.length;
         var $menu = thisObj.getCurMenu($curItem); // the current menu
         var bIsRoot = $menu.is('.root-level');
         var index = $menuItems.index($curItem);

         if (e.altKey || e.ctrlKey || e.shiftKey) {
          // Modifier key pressed: Do not process
          return true;
         }

         switch(e.which) {
            case thisObj.keys.tab: {
               // hide all menu items and update their attributes
               thisObj.hideAll();

               return true; // allow propagation
            }
            case thisObj.keys.esc: {
               // hide the child menu
               if (bIsRoot) { // hide the child menu
                  // hide child menu - if necessary
                  thisObj.hideMenu($curItem);
               }
               else { // hide current menu and set focus on parent item
                  var $parentItem = thisObj.getParentItem($curItem);
                  $parentItem.focus();
                  thisObj.hideMenu($parentItem);
               }
               return false;
            }
            case thisObj.keys.right: {
               if (!thisObj.vmenu) { // horizontal menu
                  if (bIsRoot) { // root menu item
                     if (index < menuLength-1) { // not the last - move to next item
                        // hide child menu - if necessary
                        $menuItems.eq(index+1).focus();
                        thisObj.hideMenu($curItem);
                     }
                  }
                  else if (thisObj.isParent($curItem)) { // move to child item
                     thisObj.getChildItem($curItem).focus();
                  }
                  else { // move to next item in root menu
                     $rootItem = $curItem.parentsUntil('.root-level').find('[role=menuitem]:first').first();
                     $menuItems = thisObj.getMenuItems($rootItem); // items in root menu
                     index = $menuItems.index($rootItem);

                     if (index < $menuItems.length-1) {
                        thisObj.hideAll();
                        $menuItems.eq(index+1).focus();
                     }
                  }
               }
               else { // move to first item in child menu
                  thisObj.showMenu($curItem);
                  thisObj.getChildItem($curItem).focus();
               }
               return false;
            }
            case thisObj.keys.left: {
               if (!thisObj.vmenu) { // horizontal menu
                  if (bIsRoot) { // root level menu item
                     if (index > 0) { // not first item - move to previous item
                        $menuItems.eq(index-1).focus();
                        thisObj.hideMenu($curItem);
                     }
                  }
                  else if (!thisObj.getParentItem($curItem).parent().parent().is('.root-level')) {
                     // move to parent item
                     thisObj.getParentItem($curItem).focus();
                  }
                  else { // move to previous root menu item
                     $rootItem = $curItem.parentsUntil('.root-level').find('[role=menuitem]:first').first();
                     $menuItems = thisObj.getMenuItems($rootItem); // items in root menu
                     index = $menuItems.index($rootItem);

                     if (index > 0) {
                        thisObj.hideAll();
                        $menuItems.eq(index-1).focus();
                     }
                  }
               }
               else { // vertical menu
                  if (bIsRoot) {
                     // hide child menu - if necessary
                     thisObj.hideMenu($curItem);
                  }
                  else { // move to parent menu item
                     thisObj.getParentItem($curItem).focus();
                  }
               }
               return false;
            }
            case thisObj.keys.down: {
               if (!thisObj.vmenu) { // horizontal menu
                  if (bIsRoot) { // move to first item of child menu
                     thisObj.showMenu($curItem);
                     thisObj.getChildItem($curItem).focus();
                  }
                  else if (index < menuLength - 1) {
                     $menuItems.eq(index+1).focus();
                     // hide previous child menu - if necessary
                     thisObj.hideMenu($curItem);
                  }
               }
               else { // vertical menu
                  if (index < menuLength-1) {
                     $menuItems.eq(index+1).focus();
                     thisObj.hideMenu($curItem);
                  }
               }
               return false;
            }
            case thisObj.keys.up: {
               if (!thisObj.vmenu) { // horizontal menu
                  if (!bIsRoot) {
                     if (index > 0) {
                        $menuItems.eq(index-1).focus();
                        // hide previous child menu - if necessary
                        thisObj.hideMenu($curItem);
                     }
                     else if (index == 0 && thisObj.getParentItem($curItem).parent().parent().is('.root-level')) {
                        // move to parent menu
                        thisObj.getParentItem($curItem).focus();
                        thisObj.hideMenu($curItem);
                     }
                  }
                  else { // root item -- hide child menu if necessary
                     thisObj.hideMenu($curItem);
                  }
               }
               else { // vertical menu
                  if (index > 0) { // move to previous item
                     $menuItems.eq(index-1).focus();
                     thisObj.hideMenu($curItem);
                  }
               }
               return false;
            }
         }
      })
      .on('focus', function(e) {
         var $curItem = $(this);

         thisObj.getChildMenu($curItem).attr('aria-hidden', 'false');
         $curItem.attr('aria-expanded', 'true');
         return false;
      });

   this.$itemLIs = this.$id.find('li').each(function(index) {
      // show and hide menus on mouse hover
      if (thisObj.isParent($(this).find('a:first'))) {
         $(this).on('mouseenter', function(e) {
            var $item = $(this).find('[role=menuitem]:first');
            thisObj.showMenu($item);
            return true;
         })
         .on('mouseleave', function(e) {
            var $item = $(this).find('[role=menuitem]:first');
            thisObj.hideMenu($item);
            return true;
         });
      }
   });

   $(document).on('click', function(e) {
      if ($(e.target).attr('role') !== 'menuitem') {
         thisObj.hideAll();
         return false;
      }
      
      return true;
   });
};

menu.prototype.getCurMenu = function($item) {
   return $item.parent().parent();
};
menu.prototype.getMenuItems = function($item) {
   return this.getCurMenu($item).children('li').find('[role=menuitem]:first');
};
menu.prototype.getChildMenu = function($item) {
   return $item.parent().find('[role=menu]:first');
};
menu.prototype.getParentItem = function($item) {
   var $parentMenu = $item.parent().parent();
   return $parentMenu.parent().find('[role=menuitem]:first');
};
menu.prototype.getChildItem = function($item) {
   return this.getChildMenu($item).find('[role=menuitem]:first');
};
menu.prototype.hideAll = function() {
   this.$menus.attr('aria-hidden', 'true');
   this.$parents.attr('aria-expanded', 'false');
};
menu.prototype.hideMenu = function($item) {
   if (!this.isParent($item)) { // sanity check
      return;
   }
   $item.attr('aria-expanded', 'false');
   this.getChildMenu($item).attr('aria-hidden', 'true');
};
menu.prototype.isParent = function($item) {
   return $item[0].hasAttribute('aria-haspopup');
};
menu.prototype.showMenu = function($item) {
   if (!this.isParent($item)) { // sanity check
      return;
   }
   $item.attr('aria-expanded', 'true');
   this.getChildMenu($item).attr('aria-hidden', 'false');
};
