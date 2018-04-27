/*************** ARIA Menu *********************/
function ariaMenu(toggleID) {
   var keys = {
      tab:     9,
      enter:   13,
      esc:     27,
      space:   32,
      up:      38,
      down:    40
   };

   var $toggle = jQuery('#' + toggleID);
   var $nav = jQuery('#' + $toggle.attr('aria-controls'));
   var $items = $nav.find('a');

   $toggle.on('click', function(e) {
      if ($toggle.attr('aria-expanded') === 'false') {
         $toggle.attr('aria-expanded', 'true');
         $nav.attr('aria-hidden', 'false');
         $items.attr('tabindex', '-1').first().attr('tabindex', '0').focus();
      } else {
         $toggle.attr('aria-expanded', 'false');
         $nav.attr('aria-hidden', 'true');
         $toggle.focus();
      }

      return false;
   });

   $items.on('keydown', function(e) {
      var index = $items.index(jQuery(this));

      switch(e.which) {
         case keys.enter: {
            return false;
         }
         case keys.esc: {
            $toggle.click();
            return false;
         }
         case keys.down: {
            if (index < $items.length-1) {
               $items.attr('tabindex', '-1').eq(index+1).attr('tabindex', '0').focus();
            }
            return false;
         }
         case keys.up: {
            if (index > 0) {
               $items.attr('tabindex', '-1').eq(index-1).attr('tabindex', '0').focus();
            }
            return false;
         }
         case keys.tab: {
            if (e.shiftKey) {
               $toggle.click();
               return false;
            }
            else {
               $toggle.attr('aria-expanded', 'false');
               $nav.attr('aria-hidden', 'true');
               $items.attr('tabindex', '-1').first().attr('tabindex', '0');
               return true;
            }
         }
      }
      return true;
   });

   jQuery(document).on('click', function(e) {
      if (jQuery(e.target) != $toggle) {
         $toggle.attr('aria-expanded', 'false');
         $nav.attr('aria-hidden', 'true');
         $items.attr('tabindex', '-1').first().attr('tabindex', '0');
      }
   }); 
}
/*************** End ARIA Menu ****************/
