document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll(".postLink").forEach(a => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    alert(e.target.dataset.msg + "\n\nNext step: create a real page for this guide.");
  });
});

const form = document.getElementById("leadForm");
const statusEl = document.getElementById("status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = new FormData(form).get("email");
  statusEl.textContent = `Thanks! (Demo) You entered: ${email}. Next we connect this to an email tool.`;
  form.reset();
});