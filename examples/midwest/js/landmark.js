$(document).ready(function() {
   var topmenu = new menu('topmenu');
   var mainMenu = new menu('main-menu', true);
   var secondaryMenu = new menu('secondary-menu', true);

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
         var $panel = $('#quicktab' + ($id.index()+1));

         // display the selected tab, hide the others, and update the aria attributes of the tabs
         $panel.siblings('div').addClass('hidden');
         $panel.removeClass('hidden');

         // set focus on the selected tab
         $panel.focus();
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

}); // end ready()
   /////////// Contact Page Event Handlers ///////////////
 
   // bind submit handler
   //$('#contact-email-page').submit( function(e) {
   function contactSubmit(e) {

      var $name = $('#edit-name');
      var $email = $('#edit-mail');
      var $subject = $('#edit-subject');
      var $message = $('#edit-message');
      var value;
      var bError = false;
      var $focus = null;
      var $errContainer = $('#form_errMsg');
      var errMsg = '';
      var errCnt = 0;

      // clear any previous flagged errors and remove the error message div (if present)
      $name.removeClass('form_error');
      $email.removeClass('form_error');
      $subject.removeClass('form_error');
      $message.removeClass('form_error');
      $errContainer.empty();

      // check the name field
      value = $name.val();

      if (value.length == 0) {
         // name field is empty or text is too long
         $name.addClass('form_error');
         errCnt++;
         bError = true;
         //$focus = $name;
         errMsg += '\t<li><a href="#edit-name">You must enter your name.</a></li>\n';
      }
      else if (value.length > 255) {
         // truncate the string to 255 characters
         $name.attr(value, value.substr(0, 254));
      }

      // check the email field
      value = $email.val();

      if (value.length == 0) {

         // email field is empty or text is too long
         $email.addClass('form_error');

         errCnt++;

         if (bError == false) {
            bError = true;
            //$focus = $email;
         }

         errMsg += '\t<li><a href="#edit-mail">You must enter your email address.</a></li>\n';
      }
      else if ((value.length > 320) || (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value) == false)) {

         // email is not in correct format
         $email.addClass('form_error');

         errCnt++;

         if (bError == false) {
            bError = true;
            //$focus = $email;
         }
         errMsg += '\t<li><a href="#edit-mail">Invalid email address.</a></li>\n';
      }

      // check the subject field
      value = $subject.val();

      if (value.length == 0) {
         // subject field is empty or text is too long
         $subject.addClass('form_error');

         errCnt++;

         if (bError == false) {
            bError = true;
            //$focus = $subject;alert('Your message has been sent.');
         }
         errMsg += '\t<li><a href="#edit-subject">You must enter a subject.</a></li>\n';
      }
      else if (value.length > 255) {
         // truncate the string to 255 characters
         $subject.attr(value, value.substr(0, 254));
      }

      // check the subject field
      value = $message.val();

      if (value.length == 0) {
         // message field is empty or text is too long
         $message.addClass('form_error');

         errCnt++;

         if (bError == false) {
            bError = true;
            //$focus = $message;
         }
         errMsg += '\t<li><a href="#edit-message">You must enter a message.</a></li>\n';
      }
      else if (value.length > 2048) {
         // truncate the string to 2048 characters
         $message.attr('value', value.substr(0, 2047));
      }

      if (bError == true) {
         errMsg = '<h2">Message not sent (' + errCnt + ' error' + (errCnt > 1 ? 's':'') + '):</h2><ul>' + errMsg + '</ul>';
         
         $errContainer.html(errMsg).focus();

         e.preventDefault();
         return false;
      }

      // form is valid - alert user that form was submitted.
      alert('Your message has been sent.');
      e.preventDefault();
      return false;

   };
