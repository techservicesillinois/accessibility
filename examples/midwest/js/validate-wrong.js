$(document).ready(function() {
   var $required = $('form').find('input, textarea').not('[type=submit]');
   var $form = $required.closest('form');
   var $fields = $form.find('input, textarea, select').not('[type=submit]');

   $form.on('submit', function(e) { // needed if HTML5 validation is not supported
      var bErr = false;

      // check all required fields
      $required.each(function(index) {
         bErr = !isValid($(this));
      });

      if (bErr) {
         $required.filter('.invalid').first().focus(); // set focus on first invalid field
         e.preventDefault(); // prevent the form from submiting
         return false;
      }
   });

   $required.on('invalid', function(e) { // Hook the HTML5 validation
       return !isValid($(this)); // validate the field
   });

});

function validateField(e) {
    e = e || window.event;
    var target = e.target|| e.srcElement;
    var $field = $(target);
    var keys = {
       tab:     9,
       esc:    27,
       left:   37,
       up:     38,
       right:  39,
       down:   40
    };

    switch(e.which) { // ignore some keys
       case keys.tab:
       case keys.esc:
       case keys.left:
       case keys.right:
       case keys.up:
       case keys.down: {
          return true;
       }
    }

    if (typeof $field[0].checkValidity == 'function') {
       $field[0].checkValidity();
    }

    isValid($field);
    return true;
}
function isValid($field) {
   var value = $field.val();
   var errID = $field.attr('id') + '-err';
   var $errContainer = $('#' + errID);
   var func = null;
   var msg = $field.attr('data-errmsg');

   switch($field.attr('type')) {
      case 'text': {
         var func = isValidLength;
         break;
      }
      case 'email': {
         var func = isValidEmail;
         break;
      }
      case 'tel': {
         var func = isValidTelephone;
         break;
      }
      default: {
         if (!$field.prop('tagName').toLowerCase() == 'textarea') {
            return true;
         }
         var func = isValidLength;
      }
   }

   if (!func($field)) {
      if ($field.attr('aria-invalid') == 'true') {
         // do nothing if the field was already invalid 
         return false;
      }

      // field is invalid
      $errContainer.html('<p id="' + errID + '-msg">' + msg + '</p>');
      $field.addClass('invalid');

      return false;

   }
   else {
      $field.removeAttr('aria-describedby')
         .removeClass('invalid');
      $errContainer.empty();
      return true;
   }
}

function isValidLength($field) { // check that there is data in the field
   var value = $field.val();
   if (value.length == 0) {
      return false;

   }
   return true;
}

function isValidEmail($field) { // check that email is valid

   var value = $field.val();

   if ((value.length == 0) || (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value) == false)) {
      return false;
   }
   return true;
}
function isValidTelephone($field) { // check that telephone is valid

   var value = $field.val();

   if ((value.length == 0) || (/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value) == false)) {
      return false;
   }
   return true;
}
