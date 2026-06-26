'use strict';

(function() {
// FAQ Accordion

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {

        item.classList.toggle("active");

        const icon = item.querySelector(".faq-btn i");

        if(item.classList.contains("active")){
            icon.classList.remove("fa-chevron-down");
            icon.classList.add("fa-chevron-up");
        }else{
            icon.classList.remove("fa-chevron-up");
            icon.classList.add("fa-chevron-down");
        }

    });

});

// Search FAQ

const searchInput = document.getElementById("faqSearch");

if(searchInput){

    searchInput.addEventListener("keyup", () => {

        const value = searchInput.value.toLowerCase();

        faqItems.forEach(item => {

            const text = item.innerText.toLowerCase();

            if(text.includes(value)){
                item.style.display = "block";
            }else{
                item.style.display = "none";
            }

        });

    });

}
})();
