/* ========================================================================
 * Technology Services at Illinois Bootstrap Accessibility Plugin
 *
 * Version 0.3.0
 *
 * This script is a modified and extended version of the PayPal Bootstrap Accessibility plugin.
 * The original copyright notice is included below to fulfill eBay's terms of use.
 *
 * This version of the script extends Bootstrap 3.3.4 and up.
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
      .find('.close').removeAttr('aria-hidden').wrapInner('<span aria-hidden="true"></span>').append('<span class="sr-only">Close</span>'); // correct close button markup

   /////////////////////////////////////////////////////
   // Modal Dialog - from PayPal script
   //
   $('.modal-body').attr({'role': 'document', 'tabindex': '0'});
   var modalHide = $.fn.modal.Constructor.prototype.hide; // store the bootstrap modal hide function
   $.fn.modal.Constructor.prototype.hide = function() { // override the hide function
      var modalOpener = this.$element.parent().find('[data-target="#' + this.$element.attr('id') + '"]');
      modalHide.apply(this, arguments); // call the original bootstrap modal hide function
      modalOpener.focus(); // set focus on the element that triggered the dialog
      $(document).off('keydown.bs.modal');
   };

   var modalFocus = $.fn.modal.Constructor.prototype.enforceFocus; // store the bootstrap modal focus function
   $.fn.modal.Constructor.prototype.enforceFocus = function() { // override the focus function
      var $focEls = this.$element.find(':tabbable');
      var lastEl = $focEls[$focEls.length-1];

      $(document).on('keydown.bs.modal', $.proxy(function (ev) {
        if(!this.$element.has(ev.target).length && ev.shiftKey && ev.which === 9) {  
          lastEl.focus()
          ev.preventDefault();
        }
      }, this));

      modalFocus.apply(this, arguments); // call the original bootstrap modal focus function
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
         k = e.which; // jQuery standardizes this

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

      tabactivate.apply(this, arguments);

      $active.find('[data-toggle=tab], [data-toggle=pill]').attr({
         'tabIndex' : '-1',
         'aria-selected' : false
      }).removeAttr('aria-expanded');

      $active.filter('.tab-pane').attr({
         'aria-hidden' : true,
         'tabIndex' : '-1'
      });


      element.addClass('active');

      element.find('[data-toggle=tab], [data-toggle=pill]').attr({
         'tabIndex' : '0',
         'aria-selected' : true
      }).removeAttr('aria-expanded');

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
            var key = e.which; // jQuery standardizes this
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

   /////////////////////////////////////////////////////
   // Dropdown
   //
   var $toggle   = $('[data-toggle=dropdown]');
   var $menus = $toggle.parent().find('[role=menu]');

   $toggle.attr({
      'aria-haspopup': 'true',
      'aria-expanded': 'false'
   });

   $menus.on('focusout', function(e) {
      $(e.target).attr('tabindex', '-1');
   })
   .on('focusin', function(e) {
      $(e.target).attr('tabindex', '0');
   })
   .find('[role=menuitem]').attr('tabindex', '-1');

   $(document).off('keydown.bs.dropdown.data-api', '[role="menu"]');
   var dropdownKeydown = $.fn.dropdown.Constructor.prototype.keydown;
   $.fn.dropdown.Constructor.prototype.keydown = function(e) {

      if (/(27)/.test(e.which)) {

         var $parent = $(this).parent();

         $parent.find('.dropdown-toggle').trigger('focus');
         return $(this).trigger('click');
      }

      dropdownKeydown.apply(this, arguments);
   };

   $(document).on('keydown.bs.dropdown.data-api', '[role="menu"]', $.fn.dropdown.Constructor.prototype.keydown);


   /////////////////////////////////////////////////////
   // Carousel
   $('.carousel').each(function (index) {
      var $this = $(this)
        , $prev = $this.find('[data-slide="prev"]')
        , $next = $this.find('[data-slide="next"]')
        , $slides = $this.find('.item')
        , $tablist = $this.find('.carousel-indicators')
        , $tabs = $tablist.find('li');

      var $spanPrev = $('<span>')
         .addClass('sr-only')
         .html('Previous');

      var $spanNext = $('<span>')
         .addClass('sr-only')
         .html('Next');

      $prev.attr({
         'role': 'button',
         'aria-label': 'Show slide ' + $slides.length + ' of ' + $slides.length 
      })
      .append($spanPrev);

      $next.attr({
         'role': 'button',
         'aria-label': 'Show slide 2 of ' + $slides.length
      })
      .append($spanNext);

      $slides.each(function(index) {
         $(this).attr({
            'role': 'tabpanel',
            'aria-label': 'Slide ' + (index + 1)
         });

         var $caption = $(this).find('.carousel-caption');
         if ($caption.length) {
            $caption.attr('id', 'slide' + (index+1) + '-caption');
         }
      });

      $tablist.attr('role', 'tablist');
      $tabs.each(function(index) {
         var $this = $(this);
         var captionID = 'slide' + (index + 1) + '-caption';

         $this.attr({
            'role': 'tab',
            'tabindex': (index == 0 ? '0' : '-1'),
            'aria-selected': (index == 0 ? 'true' : 'false'),
            'aria-label': 'Slide ' + (index + 1) + ' of ' + $tabs.length
         });

         if ($('#' + captionID).length) {
            $this.attr('aria-describedby', captionID);
         }
      });

      $this.on('focusin.bs.carousel', function(e) {
         $this.carousel('pause');
         return false;
      });
      $this.on('focusout.bs.carousel', function(e) {
         $this.carousel('cycle');
         return false;
      });
   });

   var slideCarousel = $.fn.carousel.Constructor.prototype.slide;
   $.fn.carousel.Constructor.prototype.slide = function (type, next) {

      slideCarousel.apply(this, arguments);

      var $tabs = this.$element.find('[role="tab"]');
      var $active = $tabs.filter('.active');
      var index = $tabs.index($active);
      var numSlides = $tabs.length;

      // update the button labels.
      this.$element.find('[data-slide="prev"]').attr('aria-label', 'Show slide ' + (index == 0 ? numSlides : index) + ' of ' + numSlides);
      this.$element.find('[data-slide="next"]').attr('aria-label', 'Show slide ' + (index == numSlides-1 ? 1 : index+2) + ' of ' + numSlides);

      // update the tab markup
      $active.attr({
        'aria-selected': 'true',
        'tabindex': '0'
      });

      $tabs.not($active).attr({
        'aria-selected': 'false',
        'tabindex': '-1'
      });
   };

   var keydownCarousel = $.fn.carousel.Constructor.prototype.keydown
   $.fn.carousel.Constructor.prototype.keydown = function(e) {
      var $target = $(e.target);
      var $tabs = this.$indicators.find('[role="tab"]');

         switch (e.which) {
            case 37: // left arrow
            case 38: { // up arrow
               if (this.sliding) {
                  return false;
               }
               if ($target.is('[role="tab"]')) { // move focus to previous tab
                  this.prev();

                  if ($tabs.index($target) == 0) {
                     $tabs.last().focus();
                  }
                  else {
                     $target.prev().focus();
                  }
               }
               else if (e.which != 38) {
                  this.prev();
               }

               e.preventDefault();
               return true;
            }
            case 39: // right arrow
            case 40: { //down arrow
               if (this.sliding) {
                  return false;
               }
               if ($target.is('[role="tab"]')) { // move focus to next tab

                  this.next();

                  if ($tabs.index($target) == $tabs.length - 1) {
                     $tabs.first().focus();
                  }
                  else {
                     $target.next().focus();
                  }
               }
               else if (e.which != 40) {
                  this.next();
               }

               e.preventDefault();
               return true;
            }
         }
         return true;
   };

})(jQuery);
