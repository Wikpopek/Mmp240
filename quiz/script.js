document.addEventListener("DOMContentLoaded", () => {
  // === GENEROWANIE IKON TŁA — DZIAŁA NA TELEFONIE I KOMPUTERZE ===
  const icons = [
    "img/icons/nyu.png",
    "img/icons/bmcc.png",
    "img/icons/poland.png",
    "img/icons/coffe.png",
    "img/icons/lipgloss.png",
    "img/icons/usa.png"
  ];

  try {
    // Używamy rozmiarów w pikselach, bo vh/vw psują się na mobile
    const columns = 14;   // ile ikon w poziomie
    const rows = 12;      // ile ikon w pionie (więcej, żeby całe tło sięgało do dołu)
    const docWidth = window.innerWidth;
    const docHeight = Math.max(document.body.scrollHeight, window.innerHeight);
    const spacingX = docWidth / columns;
    const spacingY = docHeight / rows;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const img = document.createElement("img");
        img.src = icons[(x + y) % icons.length];
        img.classList.add("bg-icon");

        // Równe pozycjonowanie bez nakładania
        const left = x * spacingX;
        const top = y * spacingY;
        img.style.left = `${left}px`;
        img.style.top = `${top}px`;

        // Rozmiar dopasowany do odstępów
        const size = Math.min(spacingX, spacingY) * 0.8;
        img.style.width = `${size}px`;
        img.style.opacity = 0.35;

        // Kluczowe — nie blokują klikania i są pod spodem
        img.style.position = "absolute";
        img.style.zIndex = "-1";
        img.style.pointerEvents = "none";
        img.style.userSelect = "none";

        document.body.appendChild(img);
      }
    }
  } catch (err) {
    console.warn("⚠️ Background icon error:", err);
  }

  // === BLOKADA SUBMIT, DOPÓKI NIE ZAZNACZONE WSZYSTKIE ===
  const form = document.getElementById("quizForm");
  const submitButton = document.querySelector("button[type='submit']");
  const questions = document.querySelectorAll(".question");

  if (form && submitButton && questions.length > 0) {
    lockButton(true);

    function lockButton(lock) {
      submitButton.disabled = lock;
      submitButton.style.opacity = lock ? "0.5" : "1";
      submitButton.style.cursor = lock ? "not-allowed" : "pointer";
    }

    function checkAnswers() {
      const allAnswered = Array.from(questions).every(q =>
        Array.from(q.querySelectorAll('input[type="radio"]')).some(r => r.checked)
      );
      lockButton(!allAnswered);
    }

    document.querySelectorAll('input[type="radio"]').forEach(r =>
      r.addEventListener("change", checkAnswers)
    );

    form.addEventListener("submit", e => {
      e.preventDefault();
      submitQuiz();
    });
  }
});

// === FUNKCJA QUIZU ===
function submitQuiz() {
  let score = 0;
  const results = {};
  const answers = { q1: "usa", q2: "all", q3: "all", q4: "italian", q5: "media" };

  for (let key in answers) {
    const selected = document.querySelector(`input[name="${key}"]:checked`);
    const correct = selected && selected.value === answers[key];
    results[key] = correct;
    if (correct) score++;
  }

  try {
    localStorage.setItem("quizScore", score);
    localStorage.setItem("quizResults", JSON.stringify(results));
  } catch (e) {
    console.warn("⚠️ localStorage unavailable:", e);
  }

  // działa w Safari, Chrome, Android i iPhone
  window.location.href = "result.html";
}
