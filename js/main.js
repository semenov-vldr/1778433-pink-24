let navMain = document.querySelector('.main-nav__list');
let navToggle = document.querySelector('.main-nav__toggle');
navMain.classList.remove("active");


navToggle.addEventListener('click', function() {
  navToggle.classList.toggle('active');
  navMain.classList.toggle('active');
});
