// Shared behaviors loaded on every page

document.addEventListener("DOMContentLoaded", function () {

  // Enable all Bootstrap Tooltips on the page
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (el) {
    new bootstrap.Tooltip(el);
  });

  // Enable all Bootstrap Popovers on the page
  document.querySelectorAll('[data-bs-toggle="popover"]').forEach(function (el) {
    new bootstrap.Popover(el);
  });

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Highlight current page in the navbar
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar .nav-link, .navbar .dropdown-item").forEach(function (link) {
    const href = link.getAttribute("href");
    if (href === path) link.classList.add("active");
  });

  // Bootstrap client-side form validation (Forms requirement)
  document.querySelectorAll("form.needs-validation").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add("was-validated");
    }, false);
  });

});

// Builds an <img> fallback: uses the uploaded photo if present,
// otherwise falls back to a generated initials avatar so every
// member (1-24) always has a picture even without a real upload.
function avatarFallback(imgEl, name) {
  imgEl.addEventListener("error", function () {
    imgEl.onerror = null;
    imgEl.src = "https://ui-avatars.com/api/?background=0E7C74&color=fff&size=256&name=" + encodeURIComponent(name);
  });
}
