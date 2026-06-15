document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var close = document.querySelector(".nav-close");
  var nav = document.querySelector("header nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.add("open");
    });
  }
  if (close && nav) {
    close.addEventListener("click", function () {
      nav.classList.remove("open");
    });
  }
});
