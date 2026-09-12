//? Get All Page Elements
const quizApp = document.querySelector(".quiz-app");
const questionCount = document.querySelector(".question-count span");
const questionTitle = document.querySelector(".question-title");
const answerLabels = document.querySelectorAll(".answer label");
const answerInputs = document.querySelectorAll(".answer input");
const bulletsParent = document.querySelector(".bullets .bullets-track");
const countdown = document.querySelector(".countdown-timer");
const questionArea = document.querySelector(".question-area");
const submitBtn = document.querySelector(".submit-btn");
const categorySpan = document.querySelector(".category span");
const resultQuiz = document.querySelector(".result-quiz");

//? Quiz State
let currentQuestion = 0;
let currentAnswer = 1;
let correctAnswers = 0;
let countInterval;

//? Hide The Quiz App Before Selecting A Category
quizApp.style.display = "none";
//? Choose Question Category
const questionCategories = document.querySelector("#question-Categories");
const welcome = document.querySelector(".welcome");
let category = "";
questionCategories.addEventListener("change", (e) => {
  category = e.target.value;
  console.log(category);
  getQuestions(category);
  welcome.style.display = "none";
  quizApp.style.display = "block";
  questionCategories.style.display = "none";
});

//? Fetch Questions From JSON File
function getQuestions(category) {
  let request = new XMLHttpRequest();

  request.open("GET", `./src/${category}.json`, true);
  request.send();
  request.onreadystatechange = function () {
    if (this.status === 200 && this.readyState === 4) {
      let questions = JSON.parse(request.responseText);
      //? Shuffle Questions Randomly
      questions = questions.sort(() => Math.random() - 0.5);
      const count = 10;

      //? Start The Quiz
      createBullets(count);
      displayQuestion(questions[currentQuestion]);
      startCountdown(95, count);

      submitBtn.addEventListener("click", () => {
        const correctAnswer = questions[currentQuestion].correctAnswer;
        checkAnswer(correctAnswer);
        //? On Last Question Show Result And Remove Quiz Elements
        if (currentQuestion === count - 1) {
          showResult(correctAnswers, count);
          questionArea.remove();
          submitBtn.remove();
          bulletsParent.remove();
          countdown.remove();
          return;
        }
        //? Move To Next Question
        currentQuestion++;
        //? Clear Old Question Answers
        questionTitle.textContent = "";
        answerLabels.forEach((label) => {
          label.textContent = "";
        });
        currentAnswer = 1;
        displayQuestion(questions[currentQuestion]);
        //? Reset Countdown Timer
        clearInterval(countInterval);
        startCountdown(95, count);
        //? Mark The Current Bullet As Done
        handleBullets();
      });
    }
  };
}

//? Create Bullets Depend On Question Count
function createBullets(count) {
  questionCount.textContent = count;
  categorySpan.textContent = category;
  for (let i = 0; i < count; i++) {
    const spanBullet = document.createElement("span");
    bulletsParent.appendChild(spanBullet);

    if (i === 0) {
      spanBullet.classList.add("on");
    }
  }
}

//? Display Question With Random Answers Order
function displayQuestion(question) {
  questionTitle.textContent = question.question;
  const randomAnswers = [1, 2, 3, 4].sort(() => Math.random() - 0.5);
  console.log(randomAnswers);
  answerLabels.forEach((label, index) => {
    label.textContent = question.options[`answers-${randomAnswers[index]}`];
    currentAnswer++;
  });
}

//? Check If User Answer Is Correct
function checkAnswer(correctAnswer) {
  let userAnswer;
  //? Get The Selected Answer
  answerInputs.forEach((input, index) => {
    if (input.checked) {
      userAnswer = answerLabels[index].textContent;
    }
  });

  if (userAnswer === correctAnswer) {
    correctAnswers++;
  }
}

//? Mark The Current Bullet As Done
function handleBullets() {
  const bulletsSpan = Array.from(
    document.querySelectorAll(".bullets .bullets-track span"),
  );
  bulletsSpan.forEach((element, index) => {
    if (currentQuestion === index) element.classList.add("on");
  });
}

//? Show The Final Result
function showResult(correctAnswers, count) {
  const levelSpan = document.createElement("span");
  const score = document.createElement("span");
  const percentage = (correctAnswers / count) * 100;
  //? Set The Result Level Based On Percentage
  if (percentage === 100) {
    levelSpan.textContent = "Perfect";
    levelSpan.classList.add("perfect");
  } else if (percentage >= 80) {
    levelSpan.textContent = "Very Good";
    levelSpan.classList.add("very-good");
  } else if (percentage >= 50) {
    levelSpan.textContent = "Good";
    levelSpan.classList.add("good");
  } else {
    levelSpan.textContent = "Fail";
    levelSpan.classList.add("fail");
  }

  score.textContent = ` You Answered ${correctAnswers} From ${count}`;
  resultQuiz.append(levelSpan, score);
}

//? Countdown Timer For Each Question
function startCountdown(duration, count) {
  let minutes, seconds;
  countInterval = setInterval(() => {
    if (currentQuestion < count) {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countdown.textContent = `${minutes} : ${seconds}`;
    }
    if (--duration < 0) {
      clearInterval(countInterval);
      submitBtn.click();
    }
  }, 1000);
}
