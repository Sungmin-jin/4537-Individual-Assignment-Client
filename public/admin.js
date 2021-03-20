const container = document.getElementsByClassName('container')[0];
const btnAdd = document.getElementById('btnAdd');
const btnSave = document.getElementById('btnSave');
let questionsContainer = [];
let questionCounter = 1;

const createQuestion = (q, isEdit = false) => {
  let inputs = [];
  const questionCard = document.createElement('div');
  const contentContainer = document.createElement('div');
  const questionNumber = document.createElement('label');
  const questionInput = document.createElement('input');
  const editButton = document.createElement('button');
  questionNumber.innerHTML = 'Q.' + questionCounter;

  inputs.push(questionInput);

  questionInput.setAttribute('type', 'text');
  questionInput.setAttribute('value', `${q.content}`);
  questionInput.setAttribute('placeholder', `write a question`);
  editButton.setAttribute('value', 'Edit');
  questionCard.id = q.questionId;
  questionCard.classList.add('card');
  questionCard.classList.add('p-5');
  questionCard.classList.add('row');
  questionCard.classList.add('form-group');
  questionNumber.classList.add('col-sm-2');
  questionNumber.classList.add('col-form-label');
  contentContainer.classList.add('col-sm-10');
  questionInput.classList.add('form-control');

  container.appendChild(questionCard);
  questionCard.appendChild(questionNumber);
  questionCard.appendChild(contentContainer);
  contentContainer.appendChild(questionInput);

  for (let i = 0; i < 4; i++) {
    const newFormChecker = document.createElement('div');
    const checker = document.createElement('input');
    const label = document.createElement('input');
    inputs.push(checker);
    inputs.push(label);

    newFormChecker.classList.add('form-check');
    if (isEdit) {
      checker.disabled = true;
      label.disabled = true;
    }

    checker.setAttribute('type', 'radio');
    checker.setAttribute('name', 'radio' + `${questionCounter}`);
    checker.classList.add('form-check-input');
    newFormChecker.classList.add('mt-3');
    label.setAttribute('type', 'text');
    label.classList.add('options');

    if (q.options[i]) {
      label.setAttribute('value', `${q.options[i].detail}`);
      if (q.options[i].isAnswer == 1) {
        checker.checked = true;
      }
    }

    questionCard.appendChild(newFormChecker);
    newFormChecker.appendChild(checker);
    newFormChecker.appendChild(label);
    if (isEdit) {
      if (q.options[i]) {
        label.id = q.options[i].optionId;
      }
    }
  }
  if (isEdit) {
    questionInput.disabled = true;
    editButton.classList.add('btn');
    editButton.classList.add('btn-warning');
    editButton.classList.add('mt-3');
    editButton.innerHTML = 'edit';
    questionCard.appendChild(editButton);
    questionCard.classList.add('not-edit');

    editButton.addEventListener('click', () => {
      for (let input of inputs) {
        input.disabled = false;
        questionCard.classList.add('edited');
        questionCard.classList.remove('not-edit');
      }
    });
  }
  questionCounter++;
};

const newQuestion = (content = '', questionId, option = null) => {
  return { content, questionId, options: [option] };
};

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
    `https://jasonjin-backend.herokuapp.com/admin/quizzes/questions/${urlParams.get(
      'id'
    )}`,
    true
  );
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const questions = JSON.parse(this.responseText);
      let prevQuestionId = 0;
      if (questions.length === 0) {
        document.getElementsByClassName('container')[0].innerHTML +=
          '<h3>No question</h3>';
      }
      for (let question of questions) {
        if (prevQuestionId != question.questionId) {
          questionsContainer.push(
            newQuestion(question.content, question.questionId, {
              detail: question.detail,
              isAnswer: question.isAnswer,
              optionId: question.optionId,
            })
          );
          prevQuestionId = question.questionId;
        } else {
          questionsContainer[questionsContainer.length - 1].options.push({
            detail: question.detail,
            isAnswer: question.isAnswer,
            optionId: question.optionId,
          });
        }
      }
      for (let q of questionsContainer) {
        createQuestion(q, true);
      }
    }
  };
};

btnAdd.addEventListener('click', (e) => {
  createQuestion(newQuestion(...Array(1), questionCounter, ...Array(1)));
});

btnSave.addEventListener('click', (e) => {
  e.preventDefault();

  const cards = document.getElementsByClassName('card');

  const xhttp = new XMLHttpRequest();
  let msg = '';
  let counter = 1;
  for (let card of cards) {
    const formData = {
      questionId: parseInt(card.id),
      options: [],
    };
    const content = card.getElementsByClassName('form-control')[0];
    const checkers = card.getElementsByClassName('form-check-input');
    const options = card.getElementsByClassName('options');

    for (let i = 0; i < 4; i++) {
      if (options[i].value == '' && !card.className.includes('edited')) {
        continue;
      }
      if (options[i].value == '') {
        continue;
      }

      if (checkers[i].checked) {
        formData.options.push({
          detail: options[i].value,
          isAnswer: true,
          id: parseInt(options[i].id),
        });
      } else {
        formData.options.push({
          detail: options[i].value,
          isAnswer: false,
          id: parseInt(options[i].id),
        });
      }
    }
    formData.content = content.value;

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    formData.quizId = urlParams.get('id');
    if (!isValidQuestion(formData) && !card.className.includes('not-edit')) {
      msg += `Question ${counter++} is not invalid\n`;
    } else if (card.className.includes('edited')) {
      xhttp.open(
        'PUT',
        'https://jasonjin-backend.herokuapp.com/admin/questions',
        true
      );
      xhttp.setRequestHeader('Content-Type', 'application/json');
      xhttp.send(JSON.stringify(formData));
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          const data = JSON.parse(this.responseText);
        }
      };
    } else if (card.className.includes('not-edit')) {
      continue;
    } else {
      xhttp.open(
        'POST',
        'https://jasonjin-backend.herokuapp.com/admin/questions',
        true
      );
      xhttp.setRequestHeader('Content-Type', 'application/json');
      xhttp.send(JSON.stringify(formData));
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          const data = JSON.parse(this.responseText);
        }
      };
    }
  }
  msg += 'Saved';
  alert(msg);
  location.reload();
});

function isValidQuestion(question) {
  if (question.content == '') {
    return false;
  }
  for (let option of question.options) {
    if (option.isAnswer && option.detail !== '') {
      return true;
    }
  }
  return false;
}

document.getElementById('back').addEventListener('click', () => {
  window.history.back();
});
