const contactForm = document.getElementById("contactForm");
const successAlert = document.getElementById("successAlert");

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();
  e.stopPropagation();

  if (!contactForm.checkValidity()) {
    contactForm.classList.add("was-validated");
    successAlert.classList.add("d-none");
    return;
  }

  successAlert.classList.remove("d-none");
  contactForm.reset();
  contactForm.classList.remove("was-validated");
  successAlert.scrollIntoView({ behavior: "smooth", block: "center" });
});
