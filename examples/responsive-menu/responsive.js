var keys = {
         tab:      9,
         right:    37,
         up:       38,
         left:     39,
         down:     40
};

$(document).ready(function() {
   var $newMenu = new a11yMenu($('.menu'));
});


function a11yMenu($menu) {

   var thisObj = this;

   this.$navs = $menu.find('nav');
   this.$menuBtns = $menu.find('button');
   this.bMobileView = false;
   

   if ($(window).width() < 960) {
      this.bMobileView = true;
      this.$navs.attr('aria-hidden', 'true');
   }

   this.$menuBtns.on('click', function() {
      var $btn = $(this);

      thisObj.toggleMenu($btn);
      $btn.focus();

      return false;
   })
   .on('keydown', function(e) {
      var $btn = $(this);

      switch(e.which) {
         case keys.tab: {
            var btnNdx = thisObj.$menuBtns.index($btn);

            if (btnNdx === 0 && e.shiftKey) {
               thisObj.toggleMenu($btn);
            }
            return true;
         }
         case keys.down: {
            if ($btn.attr('aria-expanded') === 'true') {
               $('#' + $btn.attr("aria-controls")).find('li a').first().focus();
            }
            else {
               var btnNdx = thisObj.$menuBtns.index($btn)
         
               if (btnNdx < thisObj.$menuBtns.length-1) {
                  thisObj.$menuBtns.eq(btnNdx+1).focus();
               }
            }
            return false;
         }
         case keys.up: {
            var btnNdx = thisObj.$menuBtns.index($btn);
      
            if (btnNdx > 0) {
               $btn = thisObj.$menuBtns.eq(btnNdx-1);

               if ($btn.attr('aria-expanded') === 'false') {
                  thisObj.$menuBtns.eq(btnNdx-1).focus();
               }
               else {
                  $('#' + $btn.attr("aria-controls")).find('li a').last().focus();
               }
            }
            return false;
         }
      }

      return true;
   });

   this.$navs.each(function() {
      var $nav = $(this);

      var $items = $nav.find('li > a').on('keydown', function(e) {
         var $item = $(this);
         var ndx = $items.index($item);

         switch(e.which) {
            case keys.tab: {
               if (!e.shiftKey) {
                  var $btn = $('#' + $nav.attr('aria-labelledby'));
                  var btnNdx = thisObj.$menuBtns.index($btn);

                  if ((btnNdx === thisObj.$menuBtns.length-1) && (ndx === $items.length-1)) {
                     // last menu item - close the menu
                     if(thisObj.bMobileView) {
                        thisObj.toggleMenu($btn);
                     }
                     else {
                        $btn.attr('aria-expanded', 'false');
                     }
                  }
               }
               return true;
            }
            case keys.down: {
               if (ndx < $items.length-1) {
                  $items.eq(ndx+1).focus();
               }
               else {
                  var $btn = $('#' + $nav.attr('aria-labelledby'));
                  var btnNdx = thisObj.$menuBtns.index($btn);

                  if (btnNdx < thisObj.$menuBtns.length-1) {
                     thisObj.$menuBtns.eq(btnNdx+1).focus();
                  }
               }
               return false;
            }
            case keys.up: {
               if (ndx > 0) {
                  $items.eq(ndx-1).focus();
               }
               else {
                  $('#' + $nav.attr('aria-labelledby')).focus();
               }

               return false;
            }
            case keys.right: {
               var $btn = $('#' + $nav.attr('aria-labelledby'));
               var btnNdx = thisObj.$menuBtns.index($btn);

               if (btnNdx > 0) {
                  // move to first item in previous menu

                  var $prevBtn = thisObj.$menuBtns.eq(btnNdx-1);
                  var $prevItem = $('#' + $prevBtn.attr('aria-controls')).find('li a').first();

                  if (thisObj.bMobileView) { // toggle the menu
                     thisObj.toggleMenu($prevBtn);
                  }

                  $prevItem.focus();
               }

               return false;
            }
            case keys.left: {
               var $btn = $('#' + $nav.attr('aria-labelledby'));
               var btnNdx = thisObj.$menuBtns.index($btn);

               if (btnNdx < thisObj.$menuBtns.length-1) {
                  // move to first item in next menu

                  var $nextBtn = thisObj.$menuBtns.eq(btnNdx+1);
                  var $nextItem = $('#' + $nextBtn.attr('aria-controls')).find('li a').first();

                  if (thisObj.bMobileView) { // toggle the menu
                     thisObj.toggleMenu($nextBtn);
                  }

                  $nextItem.focus();
               }

               return false;
            }
         }
         return true;
      })
      .on('focus', function() {
         var $nav = $(this).closest('nav');
         var $btn = $('#' + $nav.attr('aria-labelledby'));

         $nav.attr('aria-hidden', 'false');
         $btn.attr('aria-expanded', 'true');

         if (thisObj.bMobileView) {
            thisObj.$navs.not($nav).attr('aria-hidden', 'true');
         }
         thisObj.$menuBtns.not($btn).attr('aria-expanded', 'false');
         return true;
      });
   });

   // Attach a handler to detect window size changes and adjust the aria-hidden value of the menus
   $(window).on('resize', function() {

      if ($(this).width() > 990) {
         thisObj.$navs.attr('aria-hidden', 'false');
         thisObj.bMobileView = false;
      }
      else {

         // hide all menus
         thisObj.$navs.attr('aria-hidden', 'true');

         // display any menu that is expanded
         var $btn = thisObj.$menuBtns.filter('[aria-expanded=true]');
         $('#' + $btn.attr('aria-controls')).attr('aria-hidden', 'false');

         thisObj.bMobileView = true;
      }
      return false;
   });
}

a11yMenu.prototype.toggleMenu = function($btn) {
   if ($btn.attr('aria-expanded') === 'false') {
      // hide all the menus
      this.$menuBtns.attr('aria-expanded', 'false');
      this.$navs.attr('aria-hidden', 'true');

      // display the one just clicked
      $btn.attr('aria-expanded', 'true');
      $('#' + $btn.attr('aria-controls')).attr('aria-hidden', 'false');
   }
   else {
      $btn.attr('aria-expanded', 'false');
      $('#' + $btn.attr('aria-controls')).attr('aria-hidden', 'true');
   }
};

