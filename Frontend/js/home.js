'use strict';

(function() {
const filterButtons = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');
const faqItems = document.querySelectorAll('.faq-item');
const contactForm = document.querySelector('.contact-form');
const formMessage = document.querySelector('.form-message');


filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    const selected = button.dataset.filter;
    workCards.forEach((card) => {
      const visible = selected === 'all' || card.dataset.category === selected;
      card.hidden = !visible;
    });
  });
});

faqItems.forEach((item) => {
  const button = item.querySelector('button');
  const icon = button.querySelector('i');

  button.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');

    faqItems.forEach((faq) => {
      faq.classList.remove('open');
      const faqIcon = faq.querySelector('button i');
      faqIcon.classList.remove('fa-chevron-up');
      faqIcon.classList.add('fa-chevron-down');
    });

    if (!wasOpen) {
      item.classList.add('open');
      icon.classList.remove('fa-chevron-down');
      icon.classList.add('fa-chevron-up');
    }
  });
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = contactForm.querySelector('input').value.trim();

  if (!email) {
    formMessage.textContent = 'Please enter your email.';
    return;
  }

  contactForm.reset();
  formMessage.textContent = 'Thanks! We will contact you soon.';
});
})();
