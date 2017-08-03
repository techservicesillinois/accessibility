/*
 * ARIA Slider Widget jQuery Plugin
 * Revision 1.2
 *
 * Created by Keith Hays
 *
 * Copyright 2017 Illinois Board of Trustees
 *
 */

// Utility
if (typeof Object.create !== 'function') {
   Object.create = function(obj) {
      function F() {};
      F.prototype = obj;
      return new F();
   };
}
/******* Simple Unique ID Generator ******/
;(function($, window, document, undefined) {
    var counter = 0;
    window.uniqueId = function(){
        return 'a11y' + counter++
    }
})(jQuery, window, document);


/******* SLIDER v1.2 *****/
;(function($, window, document, undefined) {

   var pluginName = 'slider';

   var defaults = {
      min: 0,
      max: 100,
      val: [30],
      step: 5,
      jump: 25,
      bShowCue: false,
      bShowLabel: true,
      bShowRange: false,
      cue: "You can use the arrow, page up, page down, home and end keys to change the slider value."

   };

   $.fn[pluginName] = function(options) {

      return this.each(function() {

         // check if element already has an instance
         if ($.data(this, 'aria_' + pluginName)) {
            return;
         }

         // create a new instance of the widget
         var inst = Object.create(slider);

          // store the object in the element's data
         $.data(this, 'aria_' + pluginName, inst);

         // Initialize the instance
         inst.init(this, options);
      });
   };

   var slider = {
      init: function(elem, options) {
         this.$elem = $(elem);
         this.elem = elem;
         this.width = this.$elem.width();
         this.height = this.$elem.height();

         this.keys = { // Define values for keycodes
            pageup:     33,
            pagedown:   34,
            end:        35,
            home:       36,
            left:       37,
            up:         38,
            right:      39,
            down:       40,
         };

         this.pos = { // mouse position
            x: 0,
            y: 0
         };

         this.bStored = false;

         this.bClicked = false;
         this.bTouch = false;


         // merge and store options
         this.options = $.extend({}, defaults, options);

         this.min = this.options.min;
         this.max = this.options.max;
         this.val = this.options.val;

         if (this.$elem.parent().hasClass('slider-vertical')) {
            this.bVertical = true;
         }
         else {
            this.bVertical = false;
         }

         if (this.$elem.hasClass('slider-multi')) {
            this.bMulti = true;

            this.min2 = this.options.min2;
            this.max2 = this.options.max2;
            this.val2 = this.options.val2;
         }
         else {
            this.bMulti = false;
         }

         this._buildWidget(); // build the slider
      },
      _buildWidget: function() {
         var thisObj = this;
         var bDynamicHandles = false;

         this.$handles = this.$elem.find('.slider-handle');

         if (!this.$handles.length) {
            bDynamicHandles = true;
         }

         if (this.options.bShowCue) {
            // Create the instruction tooltip
            this.$cue = $('<div>')
               .attr('aria-hidden', 'true')
               .addClass('widget-cue')
               .html(this.options.cue)
               .insertBefore(this.$elem);

            // position the cue above the widget
            this.$cue.css('top', (parseInt(this.$cue.outerHeight()) / parseInt(this.$cue.css('font-size')) + 0.2)*(-1) + 'em');
         }


         if (this.options.bShowLabel) {
            this.$labels = $();
         }

         for (ndx = 0; ndx < this.options.val.length; ndx++) {
            var $handle = $();

            if (bDynamicHandles) {
               $handle = $('<div>').addClass('slider-handle');
            }
            else {
               $handle = this.$handles[ndx];
            }

            if (this.options.bShowLabel) {
               this.$labels[ndx] = $('<span>')
                  .attr('aria-hidden', 'true')
                  .addClass('slider-text')
                  .text(this.val[ndx]);

               if (!this.bMulti) {
                  this.$labels[ndx].insertAfter(this.$elem);
               }
               else {
                  this.$labels[ndx].appendTo($handle);
               }
            }

            if (bDynamicHandles) {
               this.$handles = this.$handles.add($handle);
            }
         }

         if (bDynamicHandles) {
            this.$elem.append(this.$handles);
         }


         this.$handles.each(function(index) {
            var $curHandle = $(this);
            
            $curHandle.attr({
               'role': 'slider',
               'aria-valuemin': thisObj.min,
               'aria-valuemax': thisObj.max,
               'aria-valuenow': thisObj.val[index],
               'tabindex': '0'
            })
            .on('keydown', function(e) {
               return thisObj._handleKeyDown($(this), e);
            })
            .on('mousedown', function(e) {
               var $handle = $(this);

               thisObj.bClicked = true;

               $handle.focus();

               // bind a mousemove handler to the document
               $(document).on('mousemove.slider', function(e) {
                  thisObj._storeMousePos(e.pageX || e.originalEvent.touches[0].pageX,  e.pageY || e.originalEvent.touches[0].pageY);
                  thisObj._handleMouse($handle, e);
               })

               // bind a mouseup handler to the document
               $(document).on('mouseup.slider', function(e) {
                  // stop tracking the mouse
                  thisObj.bTouch = false;
                  $(document).off('mousemove.slider mouseup.slider');


                  $(this).removeClass('focus');
                  thisObj.bPosStored = false;
               });
               return false
            })
            .on('touchstart', function(e) {
               thisObj.bTouch = true;
               if (thisObj.options.bShowCue) {
                  thisObj.$cue.removeClass('cue-visible');
               }
               $(this).trigger('mousedown');

               e.preventDefault();
               return false;
            })
            .on('touchmove', function(e) {

                  thisObj._storeMousePos(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
                  thisObj._handleMouse($(this), e);
                  return false;
            })
            .on('focusin', function(e) {
               if (thisObj.options.bShowCue && !(thisObj.bClicked || thisObj.bTouch)) {
                  thisObj.$cue.addClass('cue-visible');
               }
               return false;
            })
            .on('focusout', function(e) {
               if (thisObj.options.bShowCue) {
                  thisObj.$cue.removeClass('cue-visible');
               }
               thisObj.bClicked = false;
               return false;
            });

            thisObj._positionHandle($curHandle);
         });
         
         if (this.bMulti && this.options.bShowRange) {

            this.$range = $('<div>').addClass('slider-range');
            this._positionRangeIndicator(this.$handles[0]);
            this.$range.insertAfter(this.$handles[1]);

            $(window).resize(function() { // reposition slider range if window is too small
               if (thisObj.$elem.width() <= thisObj.width) {
                  thisObj._positionRangeIndicator(thisObj.$handles[0]);
               }
               return true;
            });
            
         }

      }, // end _BuildWidget()
      _storeMousePos: function(x, y) {
         if (!this.bPosStored) {
            this.pos.x = x;
            this.pos.y = y;
            this.bPosStored = true;
         }
      },
      _handleKeyDown: function($handle, e) {
         switch(e.keyCode) {
            case this.keys.left:
            case this.keys.down: {
               this._decSlider($handle, this.options.step);
               if (this.options.bShowCue) {
                  this.$cue.removeClass('cue-visible');
               }
               return false;
            }
            case this.keys.right:
            case this.keys.up: {
               this._incSlider($handle, this.options.step);
               if (this.options.bShowCue) {
                  this.$cue.removeClass('cue-visible');
               }
               return false;
            }
            case this.keys.pagedown: {
               this._decSlider($handle, this.options.jump);
               if (this.options.bShowCue) {
                  this.$cue.removeClass('cue-visible');
               }
               return false;
            }
            case this.keys.pageup: {
               this._incSlider($handle, this.options.jump);
               if (this.options.bShowCue) {
                  this.$cue.removeClass('cue-visible');
               }
               return false;
            }
            case this.keys.home: {
               this._decSlider($handle, this.options.max);
               if (this.options.bShowCue) {
                  this.$cue.removeClass('cue-visible');
               }
               return false;
            }
            case this.keys.end: {
               this._incSlider($handle, this.options.max);
               if (this.options.bShowCue) {
                  this.$cue.removeClass('cue-visible');
               }
               return false;
            }
         }
         return true;
      },
      _handleMouse: function($handle, e) {
         var container = this.$elem.offset();
         var valMin = this.options.min;
         var valMax = this.options.max;
         var handleNdx = this.$handles.index($handle);
         var val = parseInt($handle.attr('aria-valuenow'));
         var newVal;

         var delta = {
            x: Math.round(((e.pageX || e.originalEvent.touches[0].pageX) - container.left) / this.width * (valMax - valMin)) + valMin,
            y: Math.round(((e.pageY || e.originalEvent.touches[0].pageY) - container.top) / this.height * (valMax - valMin)) + valMin,
         }

         newVal = this.bVertical ? delta.y : delta.x;

         // Do not move the handle if newVal does not equal the step value
         if (newVal % this.options.step) {
            return false;
         }

         if (this.bMulti) {
            if (newVal < val) { // dragging left or up
               if (handleNdx) { // not first handle
                  valMin = this.$handles.eq(handleNdx-1).attr('aria-valuenow');
               }
            }
            else { // dragging right
               if (handleNdx < this.$handles.length-1) { // not first handle
                  valMax = this.$handles.eq(handleNdx+1).attr('aria-valuenow');
               }
            }
         }

         if (newVal < valMin) {
            newVal = valMin;
         }
         else if (newVal > valMax) {
            newVal = valMax;
         }
         this.val[handleNdx] = newVal;

         this._setSlider($handle);
      }, 
      _decSlider: function($handle, decVal) {
         var val = parseInt($handle.attr('aria-valuenow'));
         var minVal = this.options.min;
         var handleNdx = this.$handles.index($handle);

         // decrement the value
         val -= decVal;

         if (this.bMulti && (handleNdx)) {
            minVal = parseInt(this.$handles.eq(handleNdx-1).attr('aria-valuenow'));
         }

         if (val < minVal) {
            val = minVal;
         }
         this.val[handleNdx] = val;

         this._setSlider($handle);
      },
      _incSlider: function($handle, incVal) {
         var val = parseInt($handle.attr('aria-valuenow'));
         var maxVal = this.options.max;
         var handleNdx = this.$handles.index($handle);

         // increment the value
         val += incVal;

         if (this.bMulti && (handleNdx < this.$handles.length-1)) {
            maxVal = parseInt(this.$handles.eq(handleNdx+1).attr('aria-valuenow'));
         }

         if (val > maxVal) {
            val = maxVal;
         }
         this.val[handleNdx] = val;

         this._setSlider($handle);
      },
      _positionHandle: function($handle) {
         var index = this.$handles.index($handle);
         var valPercent = ((this.val[index] - this.options.min) / (this.options.max - this.options.min)) * 100; // interpolate the current handle value

         if (!this.bVertical) {
            $handle.css('left', 'calc(' + valPercent + '% - ' + ($handle.outerWidth()/2) + 'px)');
         }
         else {
            $handle.css('top', 'calc(' + valPercent + '% - ' + ($handle.outerHeight()/2) + 'px)');
         }
      },
      _positionRangeIndicator($handle) {
         var ndx = this.$handles.index($handle);
         
         if (!this.bVertical) {
            var minPos = $(this.$handles[0]).position().left;
            var maxPos = $(this.$handles[1]).position().left;

            if (ndx) { // this is the max handle
               this.$range.css('width', (maxPos - minPos) + 'px');
            }
            else {
               this.$range.css({
                  'left': minPos + 'px',
                  'width': (maxPos - minPos) + 'px'
               });
            }
         }
         else {
            var minPos = $(this.$handles[0]).position().top;
            var maxPos = $(this.$handles[1]).position().top;

            if (ndx) { // max handle
               this.$range.css('height', (maxPos - minPos) + 'px');
            }
            else {
               this.$range.css({
                  'top': minPos + 'px',
                  'height': (maxPos - minPos) + 'px'
               });
            }
         }
      },
      _setSlider: function($handle) {
         var ndx = this.$handles.index($handle);

         $handle.attr('aria-valuenow', this.val[ndx]);

         this._positionHandle($handle);

         if (this.options.bShowLabel) {
            this.$labels[ndx].text(this.val[ndx]);
         }

         if (this.bMulti && this.options.bShowRange) {
            this._positionRangeIndicator($handle);
         }
      }
   };


})(jQuery, window, document); // END SLIDER
