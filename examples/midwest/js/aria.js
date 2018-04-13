$(document).ready(function() {
      var topmenu = new menu('topmenu', false);
      var mainMenu = new menu('main-menu', true);


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
