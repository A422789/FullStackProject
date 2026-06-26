'use strict';

(function() {
const translations = {
    en: {
        services: "Services",
        home: "Home",
        about: "About Us",
        getInTouch: "Get In Touch"
    },

    ar: {
        services: "الخدمات",
        home: "الرئيسية",
        about: "من نحن",
        getInTouch: "تواصل معنا"
    }
};

let currentLang = "en";

const toggleBtn = document.getElementById("langToggle");

toggleBtn.addEventListener("click", () => {

    currentLang = currentLang === "en" ? "ar" : "en";

    document.documentElement.lang = currentLang;

    document.documentElement.dir =
        currentLang === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-lang]").forEach(el => {

        const key = el.dataset.lang;

        el.textContent = translations[currentLang][key];
    });

});
})();
