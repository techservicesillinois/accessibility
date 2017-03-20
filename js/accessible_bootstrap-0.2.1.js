/* ========================================================================
 * Technology Services at Illinois Bootstrap Accessibility Plugin
 *
 * Version 0.2.1
 *
 * This script is a modified and extended version of the PayPal Bootstrap Accessibility plugin.
 * The original copyright notice is included below to fulfill eBay's terms of use.
 *
 * This version of the script extends Bootstrap 3.3.4
 *
* ======================================================================== */
/* ========================================================================
* Extends Bootstrap v3.1.1

* Copyright (c) <2014> eBay Software Foundation

* All rights reserved.

* Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

* Neither the name of eBay or any of its subsidiaries or affiliates nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

* ======================================================================== */

(function($) { 
   "use strict"; 

   // GENERAL UTILITY FUNCTIONS
   // ===============================
  
   var uniqueId = function(prefix) {
      return (prefix || 'ui-id') + '-' + Math.floor((Math.random()*1000)+1)
   };
  
   var removeMultiValAttributes = function (el, attr, val) {
      var describedby = (el.attr( attr ) || "").split( /\s+/ ),
      index = $.inArray(val, describedby);
      if ( index !== -1 ) {
         describedby.splice( index, 1 )
      }
      describedby = $.trim( describedby.join( " " ) );
      if (describedby ) {
         el.attr( attr, describedby )
      } else {
         el.removeAttr( attr )
      }
   };
   // selectors  Courtesy: https://github.com/jquery/jquery-ui/blob/master/ui/core.js
   var focusable = function ( element, isTabIndexNotNaN ) {
      var map, mapName, img,
      nodeName = element.nodeName.toLowerCase();
      if ( "area" === nodeName ) {
         map = element.parentNode;
         mapName = map.name;
         if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
            return false;
         }
         img = $( "img[usemap='#" + mapName + "']" )[ 0 ];
         return !!img && visible( img );
      }
      return ( /input|select|textarea|button|object/.test( nodeName ) ?
         !element.disabled :
         "a" === nodeName ?
         element.href || isTabIndexNotNaN :isTabIndexNotNaN) && visible( element ); // the element and all of its ancestors must be visible  
   };
   var visible = function ( element ) {
      return $.expr.filters.visible( element ) &&
         !$( element ).parents().addBack().filter(function() {
            return $.css( this, "visibility" ) === "hidden";
         }).length;
   };

   $.extend( $.expr[ ":" ], {
      data: $.expr.createPseudo ?
      $.expr.createPseudo(function( dataName ) {
         return function( elem ) {
            return !!$.data( elem, dataName );
         };
      }) :
      // support: jQuery <1.8
      function( elem, i, match ) {
         return !!$.data( elem, match[ 3 ] );
      },

      focusable: function( element ) {
         return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
      },

      tabbable: function( element ) {
         var tabIndex = $.attr( element, "tabindex" ),
         isTabIndexNaN = isNaN( tabIndex );
         return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
      }
   });

   /////////////////////////////////////////////////////
   // Alert - modified from PayPal script
   //
   // This version ensures that only an element with the .close class in an alert region is modified.
   //
   $('.alert').attr('role', 'alert') // add alert role
      .find('.close').removeAttr('aria-hidden').attr('aria-label', 'close').wrapInner('<span aria-hidden="true"></span>'); // correct close button markup

   /////////////////////////////////////////////////////
   // Modal Dialog - from PayPal script
   //
   $('.modal-dialog').attr('role', 'document')
      .find('.close').removeAttr('aria-hidden').attr('aria-label', 'close').wrapInner('<span aria-hidden="true"></span>'); // correct close button markup

   var modalHide = $.fn.modal.Constructor.prototype.hide; // store the bootstrap modal hide function
   $.fn.modal.Constructor.prototype.hide = function() { // override the hide function
      var modalOpener = this.$element.parent().find('[data-target="#' + this.$element.attr('id') + '"]');

      modalHide.apply(this, arguments); // call the original bootstrap modal hide function
      modalOpener.focus(); // set focus on the element that triggered the dialog
      $(document).off('keydown.bs.modal');
      
   };

   var modalShow = $.fn.modal.Constructor.prototype.show; // store the bootstrap modal show function
   $.fn.modal.Constructor.prototype.show = function() { // override the show function

      $(document).on('keydown.bs.modal', $.proxy(function (e) {
         var $focusable = this.$element.find(':tabbable');

         if (e.keyCode === 9) { // user is tabbing
            if (e.shiftKey && $focusable.first()[0] == e.target) {
               // this is the first element - set focus on the last element
               $focusable.last().focus();
               return false;
            }
            else if (!e.shiftKey && $focusable.last()[0] == e.target) {
               // user is tabbing forward and this is the last element
               // set focus on the first element
               $focusable.first().focus();
               return false;
            }
         }
         else if (e.keyCode === 27) { // escape key - dismiss dialog
            this.hide();
            return false;
         }

         return true;
      }, this));

      modalShow.apply(this, arguments); // call the original bootstrap modal focus function

   };

   /////////////////////////////////////////////////////
   // Tabs
   //
   var $tablist = $('.nav-tabs, .nav-pills'),
        $lis = $tablist.children('li'),
        $tabs = $tablist.find('[data-toggle="tab"], [data-toggle="pill"]');

    if($tabs) {
      $tablist.attr('role', 'tablist')
      $lis.attr('role', 'presentation')
      $tabs.attr('role', 'tab')
    }

    $tabs.each(function( index ) {
      var tabpanel = $($(this).attr('href')),
        tab = $(this),
        tabid = tab.attr('id') || uniqueId('ui-tab');

        tab.attr('id', tabid);

      if(tab.parent().hasClass('active')){
        tab.attr({
           'tabIndex' : '0',
           'aria-selected' : 'true',
           'aria-controls': tab.attr('href').substr(1)
        });
        
        tabpanel.attr({
           'role' : 'tabpanel',
           'aria-hidden' : 'false',
           'aria-labelledby':tabid,
           'tabindex': 0
        });
      } else {
        tab.attr({
           'tabIndex' : '-1',
           'aria-selected' : 'false',
           'aria-controls': tab.attr('href').substr(1)
        });

        tabpanel.attr({
           'role' : 'tabpanel',
           'aria-hidden' : 'true',
           'aria-labelledby':tabid,
           'tabindex': '-1'
        });
      }
    });

    $.fn.tab.Constructor.prototype.keydown = function (e) {
       var $this = $(this),
         $items,
         $ul = $this.closest('ul[role=tablist] '),
         index,
         k = e.which || e.keyCode;

      if (!/(37|38|39|40)/.test(k)) return

      $items = $ul.find('[role=tab]:visible');
      index = $items.index($items.filter(':focus'));

      if (k == 38 || k == 37) index--; // up & left
      if (k == 39 || k == 40) index++; // down & right


      if(index < 0) {
        index = $items.length -1;
      }
      if(index == $items.length) {
         index = 0;
      }

      var nextTab = $items.eq(index);

      if(nextTab.attr('role') ==='tab') {

        nextTab.tab('show').focus(); //Comment out this line for dynamically loaded tabPabels, to save Ajax requests on arrow key navigation
      }
      // nextTab.focus(); // uncomment this line if previous line is commented out.

      e.preventDefault();
      e.stopPropagation();
    };

    $(document).on('keydown.tab.data-api','[data-toggle="tab"], [data-toggle="pill"]' , $.fn.tab.Constructor.prototype.keydown);

   var tabactivate = $.fn.tab.Constructor.prototype.activate;
   $.fn.tab.Constructor.prototype.activate = function (element, container, callback) {
      var $active = container.find('> .active');

      $active.find('[data-toggle=tab], [data-toggle=pill]').attr({
         'tabIndex' : '-1',
         'aria-selected' : false
      });

      $active.filter('.tab-pane').attr({
         'aria-hidden' : true,
         'tabIndex' : '-1'
      });

      tabactivate.apply(this, arguments);

      element.addClass('active');

      element.find('[data-toggle=tab], [data-toggle=pill]').attr({
         'tabIndex' : '0',
         'aria-selected' : true
      });

      element.filter('.tab-pane').attr({
         'aria-hidden' : false,
         'tabIndex' : '0'
      });
   };

   /////////////////////////////////////////////////////
   // Collapse
   //
   var $collapseToggles = $('[data-toggle="collapse"]');

   var $accordianToggles = $collapseToggles.filter('[data-parent]');

   if ($accordianToggles.length) {
      $($accordianToggles.first().attr('data-parent')).attr({
         'role': 'tablist',
         'aria-selected': 'false',
         'aria-multiselectable': 'true'
      });

      $accordianToggles.each(function(index) {
         var $tab = $(this);
         var $tabPanel = $($tab.attr('href'));

         $tab.attr({
            'role': 'tab',
            'aria-controls': $tabPanel.attr('id')
         });

         if ($tab.attr('id') == undefined || $tab.attr('id') == false) {
            $tab.attr('id', $tabPanel.attr('id') + '-tab');
         }

         if ($tabPanel.is(':visible')) {
            $tab.attr({
               'aria-expanded': 'true',
               'aria-selected': 'true',
               'tabindex': '0'
            });
            $tab.closest('.panel-heading').addClass('selected');
         }
         else {
            $tab.attr({
               'aria-expanded': 'false',
               'aria-selected': 'false',
               'tabindex': '-1'
            });
         }

         $tabPanel.attr({
            'role': 'tabpanel',
            'aria-labelledby': $tab.attr('id'),
            'tabindex': '0'
         });

         $accordianToggles.on('keydown', function(e) {
            var key = e.keyCode || e.which;
            var index = $accordianToggles.index($(this));

            if (!/(32|37|38|39|40)/.test(key)) {
               return true;
            }
            if (key == 32) { // spacebar
               $(this).click();
               return false;
            }

            if (key == 37 || key == 38) {
               index--;
            }
            else if (key == 39 || key == 40) {
               index++;
            }

            if (index < 0) {
               index = $accordianToggles.length - 1;
            }
            if (index == $accordianToggles.length) {
               index = 0;
            }

            $accordianToggles.eq(index).focus();

            return false;
         })
         .on('focus', function(e) {
            $accordianToggles.not($(this))
               .attr({
                  'aria-selected': 'false',
                  'tabindex': '-1'
               })
               .closest('.panel-heading').removeClass('selected');

            $(this).attr({
               'aria-selected': 'true',
               'tabindex': '0'
            })
            .closest('.panel-heading').addClass('selected');
            return true;
         });
      });
   }

   $collapseToggles.each(function(index) {
      var $elem = $('#' + $(this).attr('aria-controls'));

      if ($elem.hasClass('collapse in')) {
         $('#' + $(this).attr('aria-controls')).attr('aria-hidden', 'false');
      }
      else {
         $('#' + $(this).attr('aria-controls')).attr('aria-hidden', 'true');
      }
   });

   var collShow = $.fn.collapse.Constructor.prototype.show;
   $.fn.collapse.Constructor.prototype.show = function() {
      this.$element.attr('aria-hidden', 'false');

      collShow.apply(this, arguments);

      this.$element.removeAttr('aria-expanded');

      if (this.$trigger.attr('role') == 'tab') {
         this.$trigger.attr('tabindex', '0');
         this.$trigger.closest('[role="tablist"]').find('[role="tab"]').not(this.$trigger).attr('tabindex', '-1');
      }
   };

   var collHide = $.fn.collapse.Constructor.prototype.hide;
   $.fn.collapse.Constructor.prototype.hide = function() {
      this.$element.attr('aria-hidden', 'true');

      collHide.apply(this, arguments);

      this.$element.removeAttr('aria-expanded');

      if (this.$trigger.attr('role') == 'tab' && !this.$trigger.is(':focus')) {
         this.$trigger.attr('tabindex', '-1');
      }
   };
})(jQuery);
