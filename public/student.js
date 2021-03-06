const container = document.getElementsByClassName('container')[0];
const answerKey = [];
const btnSubmit = document.getElementById('btnSubmit');
window.onload = function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const quizName = urlParams.get('quizName');
  const header = document.createElement('h1');
  header.innerHTML = quizName;
  document.getElementsByClassName('container')[0].appendChild(header);

  const xhttp = new XMLHttpRequest();
  xhttp.open(
    'GET',
    `https://jasonjin-backend.herokuapp.com/student/quizzes/questions/${urlParams.get(
      'id'
    )}`,
    true
  );
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const questions = JSON.parse(this.responseText);
      let prevQuestionId = 0;
      let counter = 1;
      if (questions.length === 0) {
        document.getElementsByClassName('container')[0].innerHTML +=
          '<h3>No question</h3>';
      }
      for (let question of questions) {
        if (prevQuestionId != question.questionId) {
          const newQuestion = document.createElement('div');
          const questionNumber = document.createElement('h3');
          questionNumber.innerHTML = 'Q.' + counter + ' ' + question.content;

          newQuestion.classList.add('card');
          newQuestion.classList.add('p-5');
          container.appendChild(newQuestion);
          newQuestion.appendChild(questionNumber);

          prevQuestionId = question.questionId;
          counter++;
        }
        const forms = document.getElementsByClassName('card');
        const form = forms[forms.length - 1];
        const newFormChecker = document.createElement('div');
        const checker = document.createElement('input');
        const label = document.createElement('label');

        newFormChecker.classList.add('form-check');
        checker.id = question.optionId;
        checker.setAttribute('type', 'radio');
        checker.setAttribute('name', `${question.questionId}`);
        checker.setAttribute('value', `${question.optionId}`);
        checker.classList.add('form-check-input');
        label.classList.add('form-check-label');

        label.innerHTML = question.detail;
        form.appendChild(newFormChecker);
        newFormChecker.appendChild(checker);
        newFormChecker.appendChild(label);
        if (question.isAnswer == 1) {
          answerKey.push(question.optionId);
        }
      }
    }
  };
};

btnSubmit.addEventListener('click', () => {
  const cards = document.getElementsByClassName('card');
  const total = cards.length;
  let right = 0;
  for (let card of cards) {
    const answers = card.getElementsByClassName('form-check-input');
    for (let answer of answers) {
      if (answer.checked) {
        if (answerKey.includes(parseInt(answer.id))) {
          right++;
        }
      }
    }
  }
  alert(`Your grade is ${Math.round((right / total) * 10000) / 100}%`);
});

document.getElementById('back').addEventListener('click', () => {
  window.history.back();
});
