'use strict';

(function() {
const ntHeader = document.querySelector(".nt-header");
const ntToggle = document.querySelector(".nt-menu-toggle");

ntToggle?.addEventListener("click", () => {
  const isOpen = ntHeader.classList.toggle("nt-open");
  ntToggle.setAttribute("aria-expanded", String(isOpen));
});

})();
