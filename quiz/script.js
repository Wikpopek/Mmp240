// === GENEROWANIE IKON TŁA ===
function generateBackground() {
  const icons = [
    "img/icons/nyu.png",
    "img/icons/bmcc.png",
    "img/icons/poland.png",
    "img/icons/coffe.png",
    "img/icons/lipgloss.png",
    "img/icons/usa.png"
  ];

  const columns = 14; // liczba kolumn (szerokość)
  const rows = 10;    // liczba wierszy (wysokość)
  const spacingX = 100 / columns;
  const spacingY = 100 / rows;

  // usuń stare ikony (gdy np. powrót z result.html)
  document.querySelectorAll(".bg-icon").forEach(el => el.remove());

  let seed = 12345; // stały seed -> identyczne rozmieszczenie
  function random() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const img = document.createElement("img");
      img.src = icons[Math.floor(random() * icons.length)];
      img.classList.add("bg-icon");

      const offsetX = (random() - 0.5) * spacingX * 0.2;
      const offsetY = (random() - 0.5) * spacingY * 0.2;

      img.style.left = `${x * spacingX + offsetX}vw`;
      img.style.top = `${y * spacingY + offsetY}vh`;

      const size = 40 + random() * 40; // 40–80px
      img.style.width = `${size}px`;
      img.style.opacity = 0.3 + random() * 0.4;

      document.body.appendChild(img);
    }
  }
}

window.addEventListener("load", () => {
  generateBackground();

  const form = document.getElementById("quizForm");
  const resultDiv = document.getElementById("result");

  // --- QUIZ.HTML ---
  if (form) {
    const submitButton = document.getElementById("submitBtn");
    const questions = document.querySelectorAll(".question");

    submitButton.disabled = true;
    submitButton.style.opacity = "0.5";

    function checkAnswers() {
      const allAnswered = Array.from(questions).every(q =>
        Array.from(q.querySelectorAll('input[type="radio"]')).some(r => r.checked)
      );
      submitButton.disabled = !allAnswered;
      submitButton.style.opacity = allAnswered ? "1" : "0.5";
    }

    document.querySelectorAll('input[type="radio"]').forEach(radio =>
      radio.addEventListener("change", checkAnswers)
    );

    form.addEventListener("submit", e => {
      e.preventDefault();
      let score = 0;
      const results = {};
      const answers = { q1: "usa", q2: "all", q3: "all", q4: "italian", q5: "media" };

      for (const key in answers) {
        const selected = document.querySelector(`input[name="${key}"]:checked`);
        const correct = selected && selected.value === answers[key];
        results[key] = correct;
        if (correct) score++;
      }

      localStorage.setItem("quizScore", score);
      localStorage.setItem("quizResults", JSON.stringify(results));

      window.location.href = "result.html";
    });
  }

  // --- RESULT.HTML ---
  if (resultDiv) {
    const score = localStorage.getItem("quizScore");
    const results = JSON.parse(localStorage.getItem("quizResults") || "{}");

    if (score !== null && Object.keys(results).length > 0) {
      let html = `<p>You got <strong>${score}/5</strong> correct!</p><ul>`;
      let i = 1;
      for (const key in results) {
        html += `<li>Question ${i}: ${results[key] ? "✅ Correct" : "❌ Wrong"}</li>`;
        i++;
      }
      html += "</ul>";
      resultDiv.innerHTML = html;
    } else {
      resultDiv.innerHTML = `<p>No results found. Please take the quiz first.</p>`;
    }

    document.getElementById("backBtn").addEventListener("click", () => {
      window.location.href = "quiz.html";
    });
  }
});
