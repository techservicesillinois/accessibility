$(window).load(function () { 

   var title = 'Cookie Notice';

   var message = 'We use Cookies on this site to enhance your experience and improve our marketing efforts. Click on “About Cookies” to learn more. By continuing to browse without changing your browser settings to block or delete Cookies, you agree to the storing of Cookies and related technologies on your device. <a href="https://www.vpaa.uillinois.edu/resources/web_privacy">University of Illinois Web Privacy Notice</a>';

   var $skipLink = $('.skip-link');
   var banner = new AlertBanner(title, message, false, $skipLink);

   var $modalButton = $('#modal-button')
      .on('click', function(e) {
         banner.dismiss();
         banner = null;
         banner = new AlertBanner(title, message, true, $skipLink);
         return false;
      });

   var $nonmodalButton = $('#nonmodal-button')
      .on('click', function(e) {
         banner.dismiss();
         banner = null;
         banner = new AlertBanner(title, message, false, $skipLink);
         return false;
      });
});

   
function AlertBanner(title, message, bModal, $returnTarget) {

   this.title = title;
   this.msg = message;
   this.bModal = bModal; // True if enforcing modal behavior
   this.$rtnTarget = $returnTarget; // Where to set focus when the dialog is dismissed
   this.keys = {
      tab:     9,
      enter:   13,
      space:   32,
      pgUp:    33,
      pgDn:    34,
      end:     35,
      home:    36
   };


   this.addOverlay();
   this.buildDialog();

   this.$bnAgree.focus();
}

AlertBanner.prototype.buildDialog = function() {
   var thisObj = this;

   var bannerMarkup = '<a class="alert-box-close" href="javascript:void();" aria-label="Close dialog" title="Dismiss" role="button"></a>\n' +
      '<div class="alert-box-body">' +
      '<h2 id="alert-box-title" class="alert-box-title">' + this.title + '</h2>' +
      '<p id="alert-box-message">' + this.msg + '</p>' +
      '</div>' +
      '<div class="alert-box-button-container">' +
      '<div class="alert-box-button button-more">' +
      '<a class="toggle-display" href="javascript:void();">About Cookies</a>' +
      '</div>' +
      '<div class="alert-box-button button-allow">' +
      '<a class="allow-all" href="javascript:void();" role="button">I Agree</a>' +
      '</div></div>';

   this.$banner = $('<div>')
      .addClass('alert-box')
      .attr({
         'role': 'dialog',
         'aria-modal': this.bModal ? 'true' : 'false',
         'aria-labelledby': 'alert-box-title',
         'aria-describedby': 'alert-box-message'
      })
      .html(bannerMarkup)
      .on('keydown', function(e) {
         return thisObj.handleKeydown(e);
      })
      .prependTo('body');


   this.$banner.css('bottom', '-' + this.$banner.height() + 'px')
      .animate({bottom: '0'}, 500);

   this.$bnClose = this.$banner.find('.alert-box-close');

   this.$bnClose.on('click', function(e) { // bind a click handler to the close button
      thisObj.dismiss();
      return false;
   });

   this.$bnAgree = this.$banner.find('.button-allow a');

   this.$bnAgree.on('click', function(e) { // bind a click handler to the agree button
      thisObj.dismiss();
      return false;
   });
};

AlertBanner.prototype.dismiss = function() {
   var thisObj = this;

   this.destroyOverlay();
   this.$rtnTarget.focus();
   this.$banner.slideToggle(200, function() {
      thisObj.$banner.remove();
   });
};

AlertBanner.prototype.addOverlay = function(e) {
   var thisObj = this;

   if (this.bModal) {
      // Add aria-hidden to all other page content
      this.$children = $('body > *').attr('aria-hidden', 'true');

      // build the modal overlay
      this.$overlay = $('<div>')
         .addClass('alert-box-overlay')
         .prependTo('body');

      $('windows').on('scroll', function(e) {
         return thisObj.handleScroll(e);
      });
   }

};

AlertBanner.prototype.destroyOverlay = function(e) {
   if (this.bModal) {
      this.$children.removeAttr('aria-hidden');
      this.$overlay.remove();
      $('document').off('scroll.alertdialog');
   }
};

AlertBanner.prototype.handleKeydown = function(e) {
   var $target = $(e.target);

   switch(e.keyCode || e.which) {
      case this.keys.tab: {
         if (!this.bModal) {
            break;
         }
         if (e.shiftKey && $target.is(this.$bnClose)) {
            this.$bnAgree.focus();
            return false;
         }
         else if (!e.shiftKey && $target.is(this.$bnAgree)) {
            this.$bnClose.focus();
            return false;
         }
         break;
      }
      case this.keys.enter:
      case this.keys.space: {
         if ($target.is(this.$bnClose) || $target.is(this.$bnAgree)) {
            this.dismiss();
            return false;
         }
         break;
      }
      case this.keys.pgUp:
      case this.keys.pgDn:
      case this.keys.end:
      case this.keys.home: {
         return false;
      }
   }

   return true;
};

AlertBanner.prototype.handleScroll = function(e) {
   return false;
};
