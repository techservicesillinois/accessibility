$(document).ready(function() {
      var topmenu = new menu('topmenu', false);
      var mainMenu = new menu('main-menu', true);

      /////////////////// home page event handlers and functions /////////////////////////

      if ($('.quicktab').length > 0) {
         $('.quicktab').focus(function(e) {

            // set active-tab styling on the selected tab, removing it from the others
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
            var $panel = $('#' + $id.attr('aria-controls'));

            // display the selected tab, hide the others, and update the aria attributes of the tabs
            $panel.siblings('div').attr('aria-hidden', 'true').attr('aria-expanded', 'false');
            $panel.attr('aria-hidden', 'false').attr('aria-expanded', 'true');

            // set focus on the selected tab
            $panel.focus();
         }
      }

      ////////////////// joblink functions ////////////////////////
      //
      $('.categoryHeading').on('click', function(e) {
         var $this = $(this);
         toggleRegion($this);
         return false;
      })
      .on('keydown', function(e) {
         var $this = $(this);

         if (e.altKey || e.ctrlKey || e.shiftKey) {
            return true;
         }

         if (e.which == 13 || e.which == 32) {
            toggleRegion($this);
            return false;
         }
      });

      function toggleRegion($target) {
         var $rgn = $('#' + $target.attr('aria-controls'));

         if ($target.attr('aria-expanded') == 'false') {
            $target.attr('aria-expanded', 'true')
               .find('img').attr('src', '../images/morearrow_close.png');
            $rgn.attr('aria-hidden', 'false');
         }
         else {
            $target.attr('aria-expanded', 'false')
               .find('img').attr('src', '../images/morearrow.png');
            $rgn.attr('aria-hidden', 'true');
         }
      }

}); // end ready()
