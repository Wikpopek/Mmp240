document.addEventListener("DOMContentLoaded", () => {
  // === TŁO ===
  const icons = [
    "img/icons/nyu.png",
    "img/icons/bmcc.png",
    "img/icons/poland.png",
    "img/icons/coffe.png",
    "img/icons/lipgloss.png",
    "img/icons/usa.png"
  ];

  const columns = 14;
  const rows = 12;
  const docWidth = window.innerWidth;
  const docHeight = Math.max(document.body.scrollHeight, window.innerHeight);
  const spacingX = docWidth / columns;
  const spacingY = docHeight / rows;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const img = document.createElement("img");
      img.src = icons[(x + y) % icons.length];
      img.classList.add("bg-icon");

      img.style.left = `${x * spacingX}px`;
      img.style.top = `${y * spacingY}px`;
      img.style.width = "70px";
      img.style.position = "absolute";
      img.style.zIndex = "-1";
      img.style.pointerEvents = "none";
      img.style.userSelect = "none";

      document.body.appendChild(img);
    }
  }

  // === BLOKADA PRZYCISKU DO CZASU ZAZNACZENIA WSZYSTKIEGO ===
  const form = document.getElementById("quizForm");
  const submitButton = document.getElementById("submitBtn");
  const questions = document.querySelectorAll(".question");

  submitButton.disabled = true;
  submitButton.style.opacity = "0.5";
  submitButton.style.cursor = "not-allowed";

  function checkAnswers() {
    const allAnswered = Array.from(questions).every(q =>
      Array.from(q.querySelectorAll('input[type="radio"]')).some(r => r.checked)
    );
    submitButton.disabled = !allAnswered;
    submitButton.style.opacity = allAnswered ? "1" : "0.5";
    submitButton.style.cursor = allAnswered ? "pointer" : "not-allowed";
  }

  document.querySelectorAll('input[type="radio"]').forEach(r =>
    r.addEventListener("change", checkAnswers)
  );

  form.addEventListener("submit", e => {
    e.preventDefault();
    submitQuiz();
  });
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

  localStorage.setItem("quizScore", score);
  localStorage.setItem("quizResults", JSON.stringify(results));
  window.location.href = "result.html";
}
