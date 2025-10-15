document.addEventListener("DOMContentLoaded", () => {
  // === GENEROWANIE IKON TŁA NA CAŁĄ WYSOKOŚĆ STRONY ===
  const icons = [
    "img/icons/nyu.png",
    "img/icons/bmcc.png",
    "img/icons/poland.png",
    "img/icons/coffe.png",
    "img/icons/lipgloss.png",
    "img/icons/usa.png"
  ];

  try {
    const columns = 14; // ilość kolumn (poziomo)
    const rows = 10;    // ilość wierszy (pionowo)
    const spacingX = 100 / columns; // rozstaw w szerokości
    const docHeight = document.body.scrollHeight; // pełna wysokość strony
    const spacingY = docHeight / rows; // rozstaw w pikselach (nie vh)

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const img = document.createElement("img");
        img.src = icons[(x + y) % icons.length];
        img.classList.add("bg-icon");

        // Oblicz pozycję — cała wysokość strony
        const leftPercent = x * spacingX;
        const topPx = y * spacingY;

        img.style.left = `${leftPercent}vw`;
        img.style.top = `${topPx}px`;

        img.style.width = "70px";
        img.style.opacity = 0.35;
        img.style.position = "absolute";
        img.style.zIndex = "-1";
        img.style.pointerEvents = "none";
        img.style.userSelect = "none";

        // Delikatne naturalne przesunięcie
        img.style.transform = `translate(${(Math.random() - 0.5) * 10}px, ${(Math.random() - 0.5) * 10}px)`;

        document.body.appendChild(img);
      }
    }
  } catch (e) {
    console.warn("⚠️ Background icons load error:", e);
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

    document.querySelectorAll('input[type="radio"]').forEach(radio =>
      radio.addEventListener("change", checkAnswers)
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

  const answers = {
    q1: "usa",
    q2: "all",
    q3: "all",
    q4: "italian",
    q5: "media"
  };

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

  window.location.assign("result.html");
}
