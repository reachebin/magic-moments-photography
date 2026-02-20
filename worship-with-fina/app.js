document.getElementById("year").textContent = new Date().getFullYear();

// ====== SET THESE 3 VALUES ======
const YOUR_EMAIL = "your@email.com";
const YT_CHANNEL_URL = "https://www.youtube.com/@yourhandle"; // or channel URL
const DONATE_URL = "https://example.com/donate"; // optional for later
// ================================

document.querySelectorAll("#ytSubscribe").forEach(a => a.href = YT_CHANNEL_URL);

const emailLinks = document.querySelectorAll("#emailLink");
emailLinks.forEach(a => {
  a.textContent = YOUR_EMAIL;
  a.href = `mailto:${YOUR_EMAIL}`;
});

const donateLink = document.getElementById("donateLink");
if (donateLink) donateLink.href = DONATE_URL;

// Booking form -> opens email draft
const form = document.getElementById("bookingForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent("Booking Request — Worship the Lord with Fina");
    const body = encodeURIComponent(
`Name: ${data.get("name")}
Email: ${data.get("email")}
Phone: ${data.get("phone")}
City: ${data.get("city")}
Date: ${data.get("date")}
Event Type: ${data.get("eventType")}

Details:
${data.get("message")}
`);
    window.location.href = `mailto:${YOUR_EMAIL}?subject=${subject}&body=${body}`;
  });
}