function hideShow(id) {

   var thisObj = this;

   this.$id = $('#' + id);
   this.$region = $('#' + this.$id.attr('aria-controls'));


   this.$id.click(function(e) {
      thisObj.toggleRegion();

      e.stopPropagation();
      return false;
   });

   this.$id.keydown(function(e) {
      var enterKey = 13;
      var spaceKey = 32;

      if (e.altKey || e.ctrlKey || e.shiftKey) {
         return true;
      }

      if (e.keyCode == enterKey || e.keyCode == spaceKey) {
         thisObj.toggleRegion();

         e.stopPropagation();
         return false;
      }

      return true;
   });
}

hideShow.prototype.toggleRegion = function() {

   if (this.$region.attr('aria-hidden') == 'true') {
      this.$id.find('img').attr('src', '../images/morearrow_close.png').attr('alt', 'Less');
      this.$region.attr('aria-hidden', 'false');
   }
   else {
      this.$id.find('img').attr('src', '../images/morearrow.png').attr('alt', 'More');
      this.$region.attr('aria-hidden', 'true');
   }
}
