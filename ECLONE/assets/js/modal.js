//About Modal open/close
const aboutLink = document.getElementById("about-link");
const modal = document.getElementById("about-modal");
const closeBtn = document.querySelector(".close-btn");
const footerAbout = document.getElementById("footer-about");

aboutLink.addEventListener("click", (e) => {
  e.preventDefault(); // Prevents the link from refreshing the page
  modal.style.display = "flex"; // Opens the modal
});

footerAbout.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close if user clicks outside the modal
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});


// Contact modal
const contactLink = document.getElementById("contact-link");
const contactModal = document.getElementById("contact-modal");
const closeBtnContact = document.querySelector(".close-btn-contact");

contactLink.addEventListener("click", (e) => {
  e.preventDefault();
  contactModal.style.display = "flex";
});

closeBtnContact.addEventListener("click", () => {
  contactModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === contactModal) {
    contactModal.style.display = "none";
  }
});
