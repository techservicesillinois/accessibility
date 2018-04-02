
$(document).ready(function() {
      var topmenu = new menu('topmenu');
      var mainMenu = new menu('main-menu');
      var secondaryMenu = new menu('secondary-menu');


      ////////////////////// Home page event handlers and functions ////////////////////
 
      if ($('.quicktab').length > 0) {

         $('.quicktab').focus(function(e) {
            var tabNum = $(this).attr('id').split('-')[1];

            $(this).siblings().removeClass('active-tab');
            $(this).addClass('active-tab');
         });

         $('.quicktab').click(function(e) {

            doPanelSwap($(this));

            e.stopPropagation();
            return false;
         });

         $('.quicktab').keydown(function(e) {

            var enterKey = 13;

            if (e.altKey||e.ctrlKey||e.shiftKey) {
               // do nothing
               return true;
            }

            if (e.keyCode == enterKey) {
               doPanelSwap($(this));

               e.stopPropagation();
               return false;
            }

            return true;
         });

         function doPanelSwap($id) {
            var $panel = $('#quicktab' + $id.attr('id').split('-')[1]);

            // display the selected tab, hide the others
            $panel.siblings('div').hide();
            $panel.show();

            // set focus on the first anchor in the panel
            $panel.find('a').first().focus();
         }
      }

   /////////// Jobs Page Event Handlers and Functions ///////////////

	// Bind job category handler
	if ($('.categoryHeading').length > 0 ) {

      $('.categoryHeading').click(function(e) {
         var $id = $('#' + $(this).attr('data-id'));

         if (e.altKey || e.ctrlKey || e.shiftKey) {
            return true;
         }
         toggleRegion(this, $id);

         e.stopPropagation();
         return false;
      });

      $('.categoryHeading').keydown(function(e) {

         var enterKey = 13;
         var spaceKey = 32;

         if (e.altKey || e.ctrlKey || e.shiftKey) {
            return true;
         }

         if (e.keyCode == enterKey || e.keyCode == spaceKey) {
            var $id = $('#' + $(this).attr('data-id'));
            toggleRegion(this, $id);

            e.stopPropagation();
            return false;
         }
      });

      function toggleRegion(heading, $region) {

         var $img = $(heading).find('img');

         if ($region.is('.hidden')) {
            $img.attr('src', '../images/morearrow_close.png');
            $region.removeClass('hidden');
         }
         else {
            $img.attr('src', '../images/morearrow.png');
            $region.addClass('hidden');
         }
      }
   }

   /////////// Contact Page Event Handlers ///////////////
 
   // Add label to Captcha form control
   $('input[name="recaptcha_challenge_field"]').attr("title","Enter Captcha Code ");

}); // end ready()
