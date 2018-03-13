$(document).ready(function() {
   var keys = {
                tab:       9,
                enter:    13,
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

   var $elevators = $('#elevators');
   var $restrooms = $('#restrooms');
   var $wheelchair = $('#wheelchair-access');
   var $infoBox = $('.info-box');

   $elevators.attr('aria-hidden', 'false');
   $restrooms.attr('aria-hidden', 'false');
   $wheelchair.attr('aria-hidden', 'false');

   $('#elevators-toggle').attr('aria-pressed', 'true').on('click', function(e) {
      $(this).focus();
      if ($(this).attr('aria-pressed') === 'true') {
         $(this).attr('aria-pressed', 'false');
         $elevators.attr('aria-hidden', 'true');
      }
      else {

         $(this).attr('aria-pressed', 'true');
         $elevators.attr('aria-hidden', 'false');
      }
      return false;
   });

   $('#restrooms-toggle').attr('aria-pressed', 'true').on('click', function(e) {
      $(this).focus();
      if ($(this).attr('aria-pressed') === 'true') {
         $(this).attr('aria-pressed', 'false');
         $restrooms.attr('aria-hidden', 'true');
      }
      else {

         $(this).attr('aria-pressed', 'true');
         $restrooms.attr('aria-hidden', 'false');
      }
      return false;
   });

   $('#wheelchair-toggle').attr('aria-pressed', 'true').on('click', function(e) {
      $(this).focus();
      if ($(this).attr('aria-pressed') === 'true') {
         $(this).attr('aria-pressed', 'false');
         $wheelchair.attr('aria-hidden', 'true');
      }
      else {

         $(this).attr('aria-pressed', 'true');
         $wheelchair.attr('aria-hidden', 'false');
      }
      return false;
   });

   ////// Info Box update //////
   $('.focus-link').on('focus mouseover', function(e) {
      var $target = $(e.target);
      if (!$target.hasClass('focus-link')) {
         $target = $target.closest('.focus-link');
      }
      $infoBox.empty().text($target.text());
      return true;
   })
   .on('mouseout', function(e) {
       setTimeout(function() {$infoBox.empty();}, 1000);
      return true;
   });

   $('svg').on('focusout', function() {
      $infoBox.empty();
      return true;
   });

   ////// View Controls //////
   var $svg = $('svg');
   var viewBox = $svg.prop('viewBox').baseVal;
   var viewBoxOrig = {
         x: viewBox.x,
         y: viewBox.y,
         width: viewBox.width,
         height: viewBox.height
      };
   var curPos = {x: 0, y: 0};
   var panrate = 10;
   var zoomfactor = 1.1;
   var viewInterval = null;

   $('#zoom-in').on('click', function(e) {
      $(this).focus();
      zoom('in');

      return false;
   });

   $('#zoom-out').on('click', function(e) {
      $(this).focus();
      zoom('out');

      return false;
   });

   $('#pan-left').on('mousedown keydown', function(e) {
      if (e.type == 'keydown' && (e.shiftKey || e.ctrlKey || e.altKey || !(e.keyCode == keys.enter || e.keyCode == keys.space))) {
         return true;
      }
      $(this).focus();

      pan('left');

      if (e.type == 'mousedown') {
         viewInterval = setInterval(function() {
            pan('left');
         }, 100);
      }

      return false;
   })
   .on('mouseup', function(e) {
      clearInterval(viewInterval);
      return false;
   });

   $('#pan-right').on('mousedown keydown', function(e) {
      if (e.type == 'keydown' && (e.shiftKey || e.ctrlKey || e.altKey || !(e.keyCode == keys.enter || e.keyCode == keys.space))) {
         return true;
      }

      $(this).focus();

      pan('right');

      if (e.type == 'mousedown') {
         viewInterval = setInterval(function() {
            pan('right');
         }, 100);
      }

      return false;
   })
   .on('mouseup', function(e) {
      clearInterval(viewInterval);
      return false;
   });

   $('#pan-up').on('mousedown keydown', function(e) {
      if (e.type == 'keydown' && (e.shiftKey || e.ctrlKey || e.altKey || !(e.keyCode == keys.enter || e.keyCode == keys.space))) {
         return true;
      }
      $(this).focus();

      pan('up');

      if (e.type == 'mousedown') {
         viewInterval = setInterval(function() {
            pan('up');
         }, 100);
      }
      else if (viewBox.y >= panrate) {
         viewBox.y -= panrate;
      }
      return false;
   })
   .on('mouseup', function(e) {
      clearInterval(viewInterval);
      return false;
   });

   $('#pan-down').on('mousedown keydown', function(e) {
      if (e.type == 'keydown' && (e.shiftKey || e.ctrlKey || e.altKey || !(e.keyCode == keys.enter || e.keyCode == keys.space))) {
         return true;
      }
      $(this).focus();

      pan('down');

      if (e.type == 'mousedown') {
         viewInterval = setInterval(function() {
            pan('down');
         }, 100);
      }
      else if (viewBox.y <= viewBox.height-panrate) {
         viewBox.y += panrate;
      }
      return false;
   })
   .on('mouseup', function(e) {
      clearInterval(viewInterval);
      return false;
   });

   $('#view-reset').on('click', function(e) {
      $(this).focus();

      viewBox.x = viewBoxOrig.x;
      viewBox.y = viewBoxOrig.y;
      viewBox.width = viewBoxOrig.width;
      viewBox.height = viewBoxOrig.height;

      return false;
   });

   function pan(direction) {

      if (viewBox.width == viewBoxOrig.width && viewBox.height == viewBoxOrig.height) {
         // do nothing if full image is visible
         return;
      }

      switch (direction) {
         case 'left': {
            if (curPos.x >= panrate) {
               viewBox.x -= panrate;
               curPos.x -= panrate;
            }
            break;
         }
         case 'right': {

            if (curPos.x <= viewBoxOrig.width - viewBox.width + panrate) {
               viewBox.x += panrate;
               curPos.x += panrate;
            }
            break;
         }
         case 'up': {
            if (curPos.y >= panrate) {
               viewBox.y -= panrate;
               curPos.y -= panrate;
            }
            break;
         }
         case 'down': {
            if (curPos.y <= viewBoxOrig.height - viewBox.height + panrate) {
               viewBox.y += panrate;
               curPos.y += panrate;
            }
            break;
         }
      }
   }

   function zoom(direction) {
      if (direction === 'in') {
         viewBox.width /= zoomfactor;
         viewBox.height /= zoomfactor;

      }
      else {
         if (viewBox.width != viewBoxOrig.width) {
            viewBox.width *= zoomfactor;
            viewBox.height *= zoomfactor;
         }
      }
   }
});
