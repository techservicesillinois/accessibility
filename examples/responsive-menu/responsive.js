$(document).ready(function() {
   var $navs = $('.menu nav');
   var $menuBtns = $('.menu button');
   
   var keys = {
            tab:      9,
            right:    37,
            up:       38,
            left:     39,
            down:     40
   };

   var bMobileView = false;

   if ($(window).width() < 960) {
      bMobileView = true;
      $navs.attr('aria-hidden', 'true');
   }


   $menuBtns.on('click', function(e) {
      var $btn = $(this);

      toggleMenu($btn);
      $btn.focus();

      return false;
   })
   .on('keydown', function(e) {
      var $btn = $(this);

      switch(e.which) {
         case keys.tab: {
            var btnNdx = $menuBtns.index($btn)
            if (btnNdx === 0 && e.shiftKey) {
               toggleMenu($btn);
            }
            return true;
         }
         case keys.down: {
            if ($btn.attr('aria-expanded') == 'true') {
               $('#' + $btn.attr("aria-controls")).find('li a').first().focus();
            }
            else {
               var btnNdx = $menuBtns.index($btn)
         
               if (btnNdx < $menuBtns.length-1) {
                  $menuBtns.eq(btnNdx+1).focus();
               }
            }
            return false;
         }
         case keys.up: {
            var btnNdx = $menuBtns.index($btn);
      
            if (btnNdx > 0) {
               $btn = $menuBtns.eq(btnNdx-1);

               if ($btn.attr('aria-expanded') == 'false') {
                  $menuBtns.eq(btnNdx-1).focus();
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

   $navs.each(function(e) {
      var $nav = $(this);

      var $items = $nav.find('li > a').on('keydown', function(e) {
         var $item = $(this);
         var ndx = $items.index($item);

         switch(e.which) {
            case keys.tab: {
               if (!e.shiftKey) {
                  var $btn = $('#' + $nav.attr('aria-labelledby'));
                  var btnNdx = $menuBtns.index($btn);

                  if ((btnNdx == $menuBtns.length-1) && (ndx == $items.length-1)) {
                     // last menu item - close the menu
                     if(bMobileView) {
                        toggleMenu($btn);
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
                  var btnNdx = $menuBtns.index($btn);

                  if (btnNdx < $menuBtns.length-1) {
                     $menuBtns.eq(btnNdx+1).focus();
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
               var btnNdx = $menuBtns.index($btn);

               if (btnNdx > 0) {
                  // move to first item in previous menu

                  var $prevBtn = $menuBtns.eq(btnNdx-1);
                  var $prevItem = $('#' + $prevBtn.attr('aria-controls')).find('li a').first();

                  if (bMobileView) { // toggle the menu
                     toggleMenu($prevBtn);
                  }

                  $prevItem.focus();
               }

               return false;
            }
            case keys.left: {
               var $btn = $('#' + $nav.attr('aria-labelledby'));
               var btnNdx = $menuBtns.index($btn);

               if (btnNdx < $menuBtns.length-1) {
                  // move to first item in next menu

                  $nextBtn = $menuBtns.eq(btnNdx+1);
                  $nextItem = $('#' + $nextBtn.attr('aria-controls')).find('li a').first();

                  if (bMobileView) { // toggle the menu
                     toggleMenu($nextBtn);
                  }

                  $nextItem.focus();
               }

               return false;
            }
         }
         return true;
      })
      .on('focus', function(e) {
         var $nav = $(this).closest('nav');
         var $btn = $('#' + $nav.attr('aria-labelledby'));

         $nav.attr('aria-hidden', 'false');
         $btn.attr('aria-expanded', 'true');

         if (bMobileView) {
            $navs.not($nav).attr('aria-hidden', 'true');
         }
         $menuBtns.not($btn).attr('aria-expanded', 'false');
         return true;
      });
   });

   // Attach a handler to detect window size changes and adjust the aria-hidden value of the menus
   $(window).on('resize', function(e) {

      if ($(this).width() > 990) {
         $navs.attr('aria-hidden', 'false');
         bMobileView = false;
      }
      else {

         // hide all menus
         $navs.attr('aria-hidden', 'true');

         // display any menu that is expanded
         var $btn = $menuBtns.filter('[aria-expanded=true]');
         $('#' + $btn.attr('aria-controls')).attr('aria-hidden', 'false');

         bMobileView = true;
      }
      return false;
   });

   function toggleMenu($btn) {
      if ($btn.attr('aria-expanded') == 'false') {
         // hide all the menus
         $menuBtns.attr('aria-expanded', 'false');
         $navs.attr('aria-hidden', 'true');

         // display the one just clicked
         $btn.attr('aria-expanded', 'true');
         $('#' + $btn.attr('aria-controls')).attr('aria-hidden', 'false');
      }
      else {
         $btn.attr('aria-expanded', 'false');
         $('#' + $btn.attr('aria-controls')).attr('aria-hidden', 'true');
      }
   }
})
