var $j = jQuery.noConflict();

function doAccessibility(widget, response) {

   var zoomLevel = widget.map.getLevel();

   var $incBtn = $j('.esriSimpleSliderIncrementButton')
      .attr('tabindex', '0')
      .on('keypress', function(e) {
         if (e.keyCode === 13 || e.keyCode === 32) {
            if (zoomLevel < 19) {
               zoomLevel++;
               widget.map.setLevel(zoomLevel);
            }
            return false;
         }
         return true;
      });

   var $decBtn = $j('.esriSimpleSliderDecrementButton')
      .attr('tabindex', '0')
      .on('keypress', function(e) {
         if (e.keyCode === 13 || e.keyCode === 32) {
            if (zoomLevel > 0) {
               zoomLevel--;
               widget.map.setLevel(zoomLevel);
            }
            return false;
         }
         return true;
      });

};
