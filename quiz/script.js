document.addEventListener("DOMContentLoaded", () => {
  // === GENEROWANIE IKON TŁA ===
  const icons = [
    "img/icons/nyu.png",
    "img/icons/bmcc.png",
    "img/icons/poland.png",
    "img/icons/coffe.png",
    "img/icons/lipgloss.png",
    "img/icons/usa.png"
  ];
  const columns = 14;
  const rows = 10; // więcej wierszy, żeby tło sięgało w dół
  const spacingX = 100 / columns;
  const spacingY = 100 / rows;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const img = document.createElement("img");
      img.src = icons[Math.floor(Math.random() * icons.length)];
      img.classList.add("bg-icon");

      const offsetX = (Math.random() - 0.5) * spacingX * 0.3;
      const offsetY = (Math.random() - 0.5) * spacingY * 0.3;
      img.style.left = `${x * spacingX + offsetX}vw`;
      img.style.top = `${y * spacingY + offsetY}vh`;

      const size = Math.random() * 30 + 50; // 50–80px
      img.style.width = `${size}px`;
      img.style.opacity = 0.3 + Math.random() * 0.4;

      document.body.appendChild(img);
    }
  }

  // === BLOKADA SUBMIT, DOPÓKI NIE ZAZNACZONE WSZYSTKIE ODPOWIEDZI ===
  const form = document.getElementById("quizForm");
  const submitButton = document.getElementById("submitBtn");

  if (form && submitButton) {
    submitButton.disabled = true;
    submitButton.style.opacity = "0.5";
    submitButton.style.cursor = "not-allowed";

    function checkAnswers() {
      const questions = document.querySelectorAll(".question");
      let allAnswered = true;

      questions.forEach(question => {
        const radios = question.querySelectorAll('input[type="radio"]');
        const answered = Array.from(radios).some(radio => radio.checked);
        if (!answered) {
          allAnswered = false;
        }
      });

      if (allAnswered) {
        submitButton.disabled = false;
        submitButton.style.opacity = "1";
        submitButton.style.cursor = "pointer";
      } else {
        submitButton.disabled = true;
        submitButton.style.opacity = "0.5";
        submitButton.style.cursor = "not-allowed";
      }
    }

    document.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener("change", checkAnswers);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      submitQuiz();
    });
  }
});

// === FUNKCJA QUIZU ===
function submitQuiz() {
  let score = 0;
  let results = {};

  const q1 = document.querySelector('input[name="q1"]:checked');
  results.q1 = q1 ? (q1.value === "usa") : false;
  if (results.q1) score++;

  const q2 = document.querySelector('input[name="q2"]:checked');
  results.q2 = q2 ? (q2.value === "all") : false;
  if (results.q2) score++;

  const q3 = document.querySelector('input[name="q3"]:checked');
  results.q3 = q3 ? (q3.value === "all") : false;
  if (results.q3) score++;

  const q4 = document.querySelector('input[name="q4"]:checked');
  results.q4 = q4 ? (q4.value === "italian") : false;
  if (results.q4) score++;

  const q5 = document.querySelector('input[name="q5"]:checked');
  results.q5 = q5 ? (q5.value === "media") : false;
  if (results.q5) score++;

  localStorage.setItem("quizScore", score);
  localStorage.setItem("quizResults", JSON.stringify(results));
  window.location.href = "result.html";
}
// === BLOKADA SUBMIT, DOPÓKI NIE ZAZNACZONE WSZYSTKIE ===
document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.querySelector("button[type='submit'], #submitBtn");
  const questions = document.querySelectorAll(".question");

  if (!submitButton || questions.length === 0) return;

  // Zablokuj przycisk na start
  submitButton.disabled = true;
  submitButton.style.opacity = "0.5";
  submitButton.style.cursor = "not-allowed";

  function checkAnswers() {
    let allAnswered = true;

    questions.forEach(question => {
      const radios = question.querySelectorAll('input[type="radio"]');
      const answered = Array.from(radios).some(r => r.checked);
      if (!answered) allAnswered = false;
    });

    if (allAnswered) {
      submitButton.disabled = false;
      submitButton.style.opacity = "1";
      submitButton.style.cursor = "pointer";
    } else {
      submitButton.disabled = true;
      submitButton.style.opacity = "0.5";
      submitButton.style.cursor = "not-allowed";
    }
  }

  // Sprawdza za każdym razem, gdy coś się zaznaczy
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener("change", checkAnswers);
  });
});

