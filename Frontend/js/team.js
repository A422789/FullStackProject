'use strict';

(function() {
// Flip Cards

const cards = document.querySelectorAll(".team-card");

cards.forEach(card => {

    card.addEventListener("click", () => {

        card.classList.toggle("flipped");

    });

});
})();
