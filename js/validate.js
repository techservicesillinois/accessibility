function validateFormErrList(formNum) {
   var $name = jQuery('#name-field' + formNum);
   var $email = jQuery('#email-field' + formNum);
   var $subject = jQuery('#subject-field' + formNum);
   var $message = jQuery('#message-field' + formNum);
   var $form = $name.parent();
   var $errContainer = jQuery('#err-msgs' + formNum)

   $form.on('submit', function(e) {
      var bHaveErr = false;
      var $list = jQuery('<ul>');

 // reset the error state of the form
      if ($errContainer.length) {
         $errContainer.empty();
      }
      else {
         $errContainer = jQuery('<div>')
         .attr({
            'id': '#err-msgs' + formNum,
            'role': 'alert',
            'tabindex': '-1'
         })
         .insertBefore('#name-label' + formNum);
      }
      
      $name.removeAttr('aria-describedby aria-invalid');
      $email.removeAttr('aria-describedby aria-invalid');
      $subject.removeAttr('aria-describedby aria-invalid');
      $message.removeAttr('aria-describedby aria-invalid');

      if (!isValidLength($name)) {
         doErrorMarkup($name, 'You must enter your name.', 1, $list); 
         bHaveErr = true;
      }

      if (!isValidEmail($email)) {
         doErrorMarkup($email, 'You must enter a valid email.', 1, $list); 
         bHaveErr = true;
      }
      if (!isValidLength($subject)) {
         doErrorMarkup($subject, 'You must enter a subject.', 1, $list); 
         bHaveErr = true;
      }
      if (!isValidLength($message)) { 
         doErrorMarkup($message, 'You must enter a message.', 1, $list); 
         bHaveErr = true;
      }

      if (!bHaveErr) {
         alert('Your form was submitted');
    e.preventDefault();
         return false;
      }


      $errContainer.html('<h5>The following errors occured:</h5>');
      $errContainer.append($list);
      $errContainer.focus();

 e.preventDefault();
      return false;
   });
}
function doErrorMarkup($field, msg, formNum, $errList) {
   var $li = jQuery('<li>');
   var $a = jQuery('<a>');
   var errId = $field.attr('id') + '-err';

   $a.attr({
      'id': errId,
      'href': '#' + $field.attr('id').split('-')[0] + '-label' + formNum
   })
   .text(msg);

   $li.append($a);
   $errList.append($li);

   $field.attr({
      'aria-describedby': errId,
      'aria-invalid': 'true',
   });
}

 function doValidateForm(formNum) {
 
   var $name = jQuery('#name-field' + formNum);
   var $email = jQuery('#email-field' + formNum);
   var $subject = jQuery('#subject-field' + formNum);
   var $message = jQuery('#message-field' + formNum);
   var $form = $name.parent();

   // attach handlers to the form
   
   $name.on('keyup blur', function(e) {
 if (e.type == 'keyup' && e.keyCode == '9') {
         return true;
 }
      fieldInvalid($name, 'You must enter your name.', formNum, isValidLength)
      return true;
   });

   $email.on('keyup blur', function(e) {
 if (e.type == 'keyup' && e.keyCode == '9') {
         return true;
 }
      fieldInvalid($email, 'You must enter a valid email address.', formNum, isValidEmail)
      return true;
   });

   $subject.on('keyup blur', function(e) {
 if (e.type == 'keyup' && e.keyCode == '9') {
         return true;
 }
      fieldInvalid($subject, 'You must enter a subject.', formNum, isValidLength)
      return true;
   });

   $message.on('keyup blur', function(e) {
 if (e.type == 'keyup' && e.keyCode == '9') {
         return true;
 }
      fieldInvalid($message, 'You must enter a message.', formNum, isValidLength)
      return true;
   });

   $form.on('submit', function(e) {
      var bHaveErr = false;
      var $focusField = jQuery([]);

      if (fieldInvalid($name, 'You must enter your name.', formNum, isValidLength)) {
         bHaveErr = true;
         $focusField = $name;
      }

      if (fieldInvalid($email, 'You must enter a valid email address.', formNum, isValidEmail)) {
         bHaveErr = true;
         if (!$focusField.length) {
            $focusField = $email;
         }
      }
      if (fieldInvalid($subject, 'You must enter a subject.', formNum, isValidLength)) {
         bHaveErr = true;
         if (!$focusField.length) {
            $focusField = $subject;
         }
      }
      if (fieldInvalid($message, 'You must enter a message.', formNum, isValidLength)) { 
         bHaveErr = true;
         if (!$focusField.length) {
            $focusField = $message;
         }
      }

      if (!bHaveErr) {
         alert('Your form was submitted');
    e.preventDefault();
         return false;
      }

      $focusField.focus();
 e.preventDefault();
      return false;
   });
}

function fieldInvalid($field, msg, formNum, valFunc) {
   var value = $field.val();
   var errID = $field.attr('id').split('-')[0] + '-err' + formNum;
   var $errContainer = jQuery('#' + errID);

   if (!valFunc($field)) {

      if ($field.attr('aria-invalid') == 'true') {
         // do nothing if the field was already invalid 
         return true;
      }

      // field is invalid
      $errContainer.html('<p id="' + errID + '-msg">' + msg + '</p>');
      $field.attr({
         'aria-invalid': 'true',
         'aria-describedby': errID + '-msg'
      });

      return true;

   }
   else {
      $field.removeAttr('aria-describedby')
         .attr('aria-invalid', 'false');
      $errContainer.empty();
      return false;
   }
}

function isValidLength($field) {

   var value = $field.val();

   if (value.length == 0) {
      return false;

   }
   return true;
}

function isValidEmail($field) {

   var value = $field.val();

   if ((value.length == 0) || (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value) == false)) {
      return false;
   }
   return true;
}

