var bProgElStarted = false;
var hProgElInterval = null;
var progElBtn = document.getElementById('prog1-start');
var progElem = document.getElementById('prog1');

function doElProg() {
   
   if (!bProgElStarted) { // example not running
      if (parseInt(progElem.getAttribute('value')) !== parseInt(progElem.getAttribute('max'))) {
         hProgElInterval = setInterval(function() {

            var val = parseInt(progElem.getAttribute('value'));
            var max = parseInt(progElem.getAttribute('max'));
         
            if (val < max) {
               progElem.setAttribute('value', val+10);
            }
            else {
               clearInterval(hProgElInterval);
               progElBtn.innerHTML = 'Reset Progress Element';
               bProgElStarted = false;
            }
         }, 500);
         
         progElBtn.innerHTML = 'Stop Progress Element';
         bProgElStarted = true;
      }
      else {
         progElem.setAttribute('value', 0);
         progElBtn.innerHTML = 'Start Progress Element';
         bProgElStarted = false;
      }
   }
   else { // example is running
      clearInterval(hProgElInterval);
      progElBtn.innerHTML = 'Start Progress Element';
      bProgElStarted = false;
   }
}
