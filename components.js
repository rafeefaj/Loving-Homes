document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const footer = document.getElementById("footer");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const contactForm = document.querySelector(".contact-form");

  const navLinks = [
    { href: "index.html", label: "الرئيسية" },
    { href: "services.html", label: "الخدمات" },
    { href: "packages.html", label: "الباقات" },
    { href: "contact.html", label: "تواصل معنا" },
    { href: "about.html", label: "من نحن" }
  ];

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("تم إرسال طلبك بنجاح، سنقوم بالتواصل معك قريبًا.");
      contactForm.reset();
    });
  }

  if (navbar) {
    navbar.innerHTML = `
      <header class="site-header">
        <div class="container nav-wrapper">
        <div class="nav-right">
          <a href="index.html" class="logo">
            <img src="assets/images/logo.png" alt="Loving Homes Logo">
            Loving Homes
          </a>
        </div>

          <button class="menu-toggle" id="menu-toggle" aria-label="فتح القائمة">☰</button>

          <nav class="main-nav" id="main-nav">
            <ul>
              ${navLinks.map(
                ({ href, label }) => `
                <li>
                  <a href="${href}" class="${currentPage === href ? "active" : ""}">${label}</a>
                </li>`
              ).join("")}
            </ul>
          </nav>

          <div class="nav-left">
            <a href="contact.html" class="btn-main nav-book-btn">احجز الآن</a>
          </div>
        </div>
      </header>
    `;
  }

  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="footer-inner">
          <div class="footer-column">
            <h3>Loving Homes</h3>
            <p>نوفر إقامة آمنة ومريحة وخدمات مميزة للكلاب في بيئة مليئة بالعناية.</p>
          </div>

          <div class="footer-column">
            <h3>تواصل</h3>
            <p>+852 2345 6789</p>
            <p>info@lovinghomes.com</p>
          </div>

          <div class="footer-column">
            <h3>روابط</h3>
            <ul>
              <li><a href="about.html">من نحن</a></li>
              <li><a href="services.html">الخدمات</a></li>
              <li><a href="packages.html">الباقات</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>Loving Homes Dog Hotel © 2026</p>
        </div>
      </footer>
    `;
  }

  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => mainNav.classList.toggle("show"));
  }

  if (!document.getElementById("accessibility-widget")) {
    const widget = document.createElement("div");
    widget.id = "accessibility-widget";

    widget.innerHTML = `
      <button id="accessibility-toggle" aria-label="إمكانية الوصول">
        <img src="assets/images/accessibility-icon.png" alt="إمكانية الوصول" style="border-radius:50%;">
      </button>

      <div id="accessibility-panel" class="hidden">
        <button id="increase-font">A +</button>
        <button id="decrease-font">A −</button>
        <button id="reset-font">A ↺</button>

        <button id="start-reading">تشغيل القارئ ▶</button>
        <button id="stop-reading">إيقاف القارئ ⏸</button>
        <button id="restart-reading">إعادة القراءة ↺</button>
      </div>
    `;

    document.body.appendChild(widget);

    const toggleBtn = document.getElementById("accessibility-toggle");
    const panel = document.getElementById("accessibility-panel");
    const increaseBtn = document.getElementById("increase-font");
    const decreaseBtn = document.getElementById("decrease-font");
    const resetBtn = document.getElementById("reset-font");

    const startBtn = document.getElementById("start-reading");
    const stopBtn = document.getElementById("stop-reading");
    const restartBtn = document.getElementById("restart-reading");

    let currentScale = 1;

    toggleBtn.addEventListener("click", () => panel.classList.toggle("hidden"));

    document.addEventListener("click", e => {
      if (!panel.contains(e.target) && !toggleBtn.contains(e.target)) {
        panel.classList.add("hidden");
      }
    });

    increaseBtn.addEventListener("click", () => {
      currentScale = Math.min(1.4, currentScale + 0.1);
      document.documentElement.style.fontSize = `${currentScale}em`;
    });

    decreaseBtn.addEventListener("click", () => {
      currentScale = Math.max(0.4, currentScale - 0.1);
      document.documentElement.style.fontSize = `${currentScale}em`;
    });

    resetBtn.addEventListener("click", () => {
      currentScale = 1;
      document.documentElement.style.fontSize = "1em";
    });

    const getArabicVoice = () =>
      speechSynthesis.getVoices().find(voice => voice.lang?.toLowerCase().startsWith("ar")) || null;

    const getReadableText = () => {
      const mainContent = document.querySelector("main");
      if (!mainContent) return "";

      const clonedMain = mainContent.cloneNode(true);

      clonedMain.querySelectorAll(
        "script, style, button, .menu-toggle, #accessibility-widget"
      ).forEach(el => el.remove());

      return (clonedMain.innerText || "")
        .replace(/[🔊⏹↺♿]/g, "")
        .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
        .replace(/\s+/g, " ")
        .trim();
    };

    const readCurrentPage = () => {
      speechSynthesis.cancel();

      const text = getReadableText();
      if (!text) return;

      const utterance = new SpeechSynthesisUtterance(text);
      const arabicVoice = getArabicVoice();

      if (!arabicVoice) {
        alert("لا يوجد صوت عربي مثبت في المتصفح أو النظام.");
        return;
      }

      utterance.voice = arabicVoice;
      utterance.lang = arabicVoice.lang;
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      speechSynthesis.speak(utterance);
    };

    let isReading = false;

startBtn.addEventListener("click", () => {

  if (speechSynthesis.paused) {
    speechSynthesis.resume();
    return;
  }

  if (!isReading) {
    readCurrentPage();
    isReading = true;
  }

});

stopBtn.addEventListener("click", () => {
  speechSynthesis.pause();
});

restartBtn.addEventListener("click", () => {
  speechSynthesis.cancel();
  readCurrentPage();
});

    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }
});
