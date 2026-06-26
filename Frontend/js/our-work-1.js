'use strict';

(function() {

toggle?.addEventListener('click', () => {
  const isOpen = header.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(isOpen));
});

})();
