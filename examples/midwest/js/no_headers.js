$(document).ready(function() {
	// Bind top menu mouse event handlers
	$('.menu-item').mouseenter(function(e) {
		$(this).addClass('menu-hover');
	});
	$('.menu-item').mouseout(function(e) {
		$(this).removeClass('menu-hover');
	});
	$('.menu-parent').mouseenter(function(e) {
		$(this).addClass('menu-hover');
		$(this).children('ul').show();
	});
	$('.menu-parent').mouseleave(function(e) {
		$(this).removeClass('menu-hover');
		$(this).children('ul').hide();
	});

   /////////// Home Page Event Handlers ///////////////
 
	// Bind quicktab mouse event handlers
	if ($('.quicktab').length > 0) {
      $('.quicktab').click(function(e) {
         var tabID = $(this).attr('id');
         var panelID = 'quicktab' + tabID.substr(tabID.length - 1, 1);

         $(this).addClass('active-tab');
         $(this).siblings().removeClass('active-tab');

         // hide all the tabs
         $('.quicktabs_tabpage').hide();

         // display the selected tab panel
         $('#' + panelID).show();

      });
   }

   /////////// Jobs Page Event Handlers ///////////////

	// Bind job category handler
	if ($('.categoryHeading').length > 0 ) {

      $('.categoryHeading').click(function(e) {
            var $id = $('#' + $(this).attr('data-id'));
            var $img = $(this).find('img');
            if ($id.is('.hidden')) {
            $img.attr('src', '../images/morearrow_close.png');
         }
         else {
            $img.attr('src', '../images/morearrow.png');
         }

            $id.toggleClass('hidden');
      });
	
   }

   /////////// Contact Page Event Handlers ///////////////

   // bind submit handler
   $('#contact-mail-page').submit(function(e) {

      var $name = $('#edit-name');
      var $email = $('#edit-mail');
      var $subject = $('#edit-subject');
      var $message = $('#edit-message');
      var value;
      var bError = false;
      var $focus = null;


      // clear previous error flag
      $name.removeClass('form_error');
      $email.removeClass('form_error');
      $subject.removeClass('form_error');
      $message.removeClass('form_error');

      // check the name field
      value = $name.attr('value');

      if (value.length == 0 || value.length > 255) {
         // name field is empty or text is too long
         $name.addClass('form_error');
         bError = true;
         $focus = $name;
      }

      // check the email field
      value = $email.attr('value');

      if (value.length == 0 || value.length > 320) {

         // email field is empty or text is too long
         $email.addClass('form_error');

         if (bError == false) {
            bError = true;
            $focus = $email;
         }
      }
      else if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value) == false) {

         // email is not in correct format
         $email.addClass('form_error');

         if (bError == false) {
            bError = true;
            $focus = $email;
         }
      }

      // check the subject field
      value = $subject.attr('value');

      if (value.length == 0 || value.length > 255) {
         // subject field is empty or text is too long
         $subject.addClass('form_error');

         if (bError == false) {
            bError = true;
            $focus = $subject;
         }
      }

      // check the subject field
      value = $message.attr('value');

      if (value.length == 0 || value.length > 2048) {
         // message field is empty or text is too long
         $message.addClass('form_error');

         if (bError == false) {
            bError = true;
            $focus = $message;
         }
      }

      if (bError == true) {
         $focus.focus();
         e.preventDefault();
         return false;
      }

      // form is valid - submit
      return true;

   });

}); // end ready()
