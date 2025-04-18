const quizBox = document.getElementById("quiz-box");
const resultBox = document.getElementById("result-box");
const startBtn = document.getElementById("start-btn");
const lengthSelect = document.getElementById("length");

let currentQuestion = 0;
let questions = [];
let score = 0;

startBtn.addEventListener("click", async () => {
  const length = lengthSelect.value;
  await fetchQuiz(length);
  displayQuestion();
});

async function fetchQuiz(length) {
  const res = await fetch(`https://opentdb.com/api.php?amount=${length}&type=multiple`);
  const data = await res.json();
  questions = data.results;
  currentQuestion = 0;
  score = 0;
  quizBox.innerHTML = "";
  resultBox.classList.add("hidden");
  quizBox.classList.remove("hidden");
}

function displayQuestion() {
  const q = questions[currentQuestion];
  const choices = [...q.incorrect_answers, q.correct_answer].sort(() => 0.5 - Math.random());

  quizBox.innerHTML = `
    <h2>Q${currentQuestion + 1}: ${decodeHTML(q.question)}</h2>
    ${choices
      .map(
        (choice) => `
      <button onclick="checkAnswer('${choice.replace(/'/g, "\\'")}')" class="answer-btn">
        ${decodeHTML(choice)}
      </button>
    `
      )
      .join("")}
  `;
}

function checkAnswer(selected) {
  const correct = questions[currentQuestion].correct_answer;

  if (selected === correct) score++;

  const buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach((btn) => {
    btn.disabled = true;
    if (btn.innerText === decodeHTML(correct)) {
      btn.classList.add("bounce");
    }
  });

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      displayQuestion();
    } else {
      showResult();
    }
  }, 500);
}

function showResult() {
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");

  const percent = (score / questions.length) * 100;
  let message = "";

  if (percent === 100) {
    message = "🎉 Perfect score! You're a genius!";
  } else if (percent >= 80) {
    message = "🔥 Great job! You really know your stuff.";
  } else if (percent >= 50) {
    message = "🙂 Not bad! A little more practice and you'll ace it.";
  } else {
    message = "😅 Keep trying! Practice makes perfect.";
  }

  resultBox.innerHTML = `
    <h2>Quiz Complete!</h2>
    <p>Your Score: <strong>${score}</strong> / ${questions.length}</p>
    <p>${message}</p>
    <button onclick="location.reload()">Try Another Quiz</button>
  `;
}

function decodeHTML(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}
