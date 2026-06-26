'use strict';

(function() {
const buttons =
document.querySelectorAll(
'.portfolio-filter button'
);

buttons.forEach(button => {

button.addEventListener('click',()=>{

buttons.forEach(btn=>{
btn.classList.remove('active');
});

button.classList.add('active');

});

});
})();
