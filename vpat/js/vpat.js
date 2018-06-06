function validateForm() {
   alert('The form has been submitted');
   return false;
}

$(document).ready(function() {
   var descmax = 2048;

   $('.bnDisclosure').on('click', function(e) {

      var $target = $(e.target);
      var $controls = $('#' + $target.attr('aria-controls'));

      if ($target.attr('aria-expanded') === "false") {
         $target.attr('aria-expanded', "true");
         $controls.show();
      }
      else {
         $target.attr('aria-expanded', "false");
         $controls.hide();
      }

      return false;
   });

   $('select').on('change', function(e) {
      var $desc = $('#' + $(this).attr('aria-controls'));

      switch ($(this).val()) {
         case '0': // conforms
         case '1': { // does not conform
            $desc.val($.data($desc[0], 'oldVal')).prop('readonly', false);
            $desc.parent().attr('data-count', $desc.val().length + ' of ' + descmax);
            break;
         }
         case '2': { // not applicable
            // store any current value
            $.data($desc[0], 'oldVal', $desc.val());
            // Replace textare contents with does not apply text and make readonly
            $desc.val('This item does not apply').prop('readonly', true);
            $desc.parent().attr('data-count', "");
            break;
         }
      }

      return false;
   });

   $('textarea').on('keydown', function(e) {
      var $this = $(this);

      if (!$this.prop('readonly')) {
         $this.val($this.val().substring(0, descmax-1));
         $this.parent().attr('data-count', $this.val().length + ' of ' + descmax);
      }

      return true;
   });

   $('textarea').on('keyup', function(e) {
      var $this = $(this);

      if (!$this.prop('readonly')) {
         $this.parent().attr('data-count', $this.val().length + ' of ' + descmax);
      }
      return true;
   });

   $('textarea').on('change', function(e) {
      var $this = $(this);

      if (!$this.prop('readonly')) {
         $.data($this[0], 'oldVal', $this.val().substring(0, descmax));
         $this.parent().attr('data-count', $this.val().length + ' of ' + descmax);
      }

      return true;
   });
});
