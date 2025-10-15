document.addEventListener("DOMContentLoaded", () => {
  // === GENEROWANIE IKON TŁA (równo obok siebie, bez nakładania) ===
  const icons = [
    "img/icons/nyu.png",
    "img/icons/bmcc.png",
    "img/icons/poland.png",
    "img/icons/coffe.png",
    "img/icons/lipgloss.png",
    "img/icons/usa.png"
  ];

  try {
    const columns = 14; // poziomo
    const rows = 10;    // pionowo
    const spacingX = 100 / columns;
    const spacingY = 100 / rows;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const img = document.createElement("img");
        img.src = icons[(x + y) % icons.length]; // powtarzaj kolejno ikony
        img.classList.add("bg-icon");

        // dokładne pozycje w siatce – bez nakładania
        img.style.left = `${x * spacingX}vw`;
        img.style.top = `${y * spacingY}vh`;

        // każda ikona w jednym rozmiarze – nie kolidują
        img.style.width = "70px";
        img.style.opacity = 0.35;
        img.style.position = "fixed";
        img.style.zIndex = "0";
        img.style.pointerEvents = "none";
        img.style.userSelect = "none";

        // lekkie przesunięcie (opcjonalnie – naturalniejszy układ)
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
