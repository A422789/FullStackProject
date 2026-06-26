'use strict';

(function () {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const dots = document.querySelectorAll(".dot");
  const stage = document.querySelector(".portfolio-stage");
  const postCards = document.querySelectorAll(".post-card");

  const slideData = [
    [
      ["THE <strong>NEXT GEN</strong> IS HERE", "student camera"],
      ["ENJOY THE <strong>EXPE- RIENCE</strong>", "woman phone"],
      ["WE'RE LIVING IN THE <strong>FUTURE</strong>", "man keyboard"],
      ["FUTURE &amp; <strong>INNO- VATION</strong>", "woman tablet"],
    ],
    [
      ["DESIGN THAT <strong>BUILDS TRUST</strong>", "woman tablet"],
      ["SOCIAL POSTS <strong>THAT SELL</strong>", "student camera"],
      ["CLEAR IDEAS, <strong>BOLD IMPACT</strong>", "woman phone"],
      ["BRANDS MADE <strong>TO STAND OUT</strong>", "man keyboard"],
    ],
    [
      ["PRINT READY <strong>VISUALS</strong>", "man keyboard"],
      ["SMART LOGOS <strong>FOR GROWTH</strong>", "woman tablet"],
      ["CAMPAIGNS WITH <strong>ENERGY</strong>", "student camera"],
      ["IDENTITY THAT <strong>FEELS ALIVE</strong>", "woman phone"],
    ],
  ];

  let activeSlide = 0;
  let autoSlide;

});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
  });
});

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const nextIndex = Number(dot.dataset.slide);
    setSlide(nextIndex);
    restartAutoSlide();
  });
});

function setSlide(index) {
  if (!slideData[index]) {
    return;
  }

  activeSlide = index;
  stage?.classList.add("is-changing");

  window.setTimeout(() => {
    postCards.forEach((card, cardIndex) => {
      const [title, visualClass] = slideData[index][cardIndex];
      const heading = card.querySelector("h2");
      const visual = card.querySelector(".visual");

      heading.innerHTML = title;
      visual.className = `visual ${visualClass}`;
    });

    stage?.setAttribute("data-slide", String(index + 1));
    dots.forEach((item, dotIndex) => item.classList.toggle("active", dotIndex === index));
    stage?.classList.remove("is-changing");
  }, 220);
}

function restartAutoSlide() {
  window.clearInterval(autoSlide);
  autoSlide = window.setInterval(() => {
    setSlide((activeSlide + 1) % slideData.length);
  }, 3500);
}

stage?.setAttribute("data-slide", "1");
restartAutoSlide();

