// wspólna funkcja do generowania tła
function generateBackground() {
  const icons = [
    "img/icons/nyu.png",
    "img/icons/bmcc.png",
    "img/icons/poland.png",
    "img/icons/coffe.png",
    "img/icons/lipgloss.png",
    "img/icons/usa.png"
  ];
  const columns = 14;
  const rows = 10;
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
      img.style.pointerEvents = "none";
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

      try {
        localStorage.setItem("quizScore", score);
        localStorage.setItem("quizResults", JSON.stringify(results));
      } catch (err) {
        console.warn("LocalStorage blocked:", err);
      }

      window.location.href = "result.html";
    });
  }

  // --- RESULT.HTML ---
  if (resultDiv) {
    const score = localStorage.getItem("quizScore");
    let results = {};
    try {
      results = JSON.parse(localStorage.getItem("quizResults")) || {};
    } catch (e) {
      console.warn("parse error", e);
    }

    if (score !== null && Object.keys(results).length > 0) {
      let html = `<p>You got <strong>${score}/5</strong> correct!</p><ul>`;
      let i = 1;
      for (const key in results) {
        html += `<li>Question ${i}: ${results[key] ? "✅ Correct" : "❌ Wrong"}</li>`;
        i++;
      }
      html += `</ul>`;
      resultDiv.innerHTML = html;
    } else {
      resultDiv.innerHTML = `<p>No results found. Please take the quiz first.</p>`;
    }

    const back = document.getElementById("backBtn");
    back.addEventListener("click", () => {
      window.location.href = "quiz.html";
    });
  }
});
