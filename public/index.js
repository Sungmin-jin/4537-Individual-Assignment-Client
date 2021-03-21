const adminSection = document.getElementById('adminSection');
const studentSection = document.getElementById('studentSection');
const btnCreate = document.getElementById('btnCreate');
window.onload = function () {
  const xhttp = new XMLHttpRequest();
  xhttp.open(
    'GET',
    'https://jasonjin-backend.herokuapp.com/admin/quizzes',
    true
  );
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const quizzes = JSON.parse(this.responseText);
      if (quizzes.length === 0) {
        adminSection.innerHTML += '<h3>No quizzes<h3>';
      }
      for (let quiz of quizzes) {
        const adminCard = document.createElement('div');
        const studentCard = document.createElement('div');
        const adminCardBody = document.createElement('div');
        const studentCardBody = document.createElement('div');
        adminCardBody.innerHTML = `<a href="./admin.html?id=${quiz.quizId}&quizName=${quiz.quizName}"><h5 class="card-title">${quiz.quizName}</h5></a>`;
        studentCardBody.innerHTML = `<a href="./student.html?id=${quiz.quizId}&quizName=${quiz.quizName}"><h5 class="card-title">${quiz.quizName}</h5></a>`;
        adminSection.appendChild(adminCard);
        studentSection.appendChild(studentCard);
        adminCard.appendChild(adminCardBody);
        studentCard.appendChild(studentCardBody);
        adminCard.classList.add('card');
        studentCard.classList.add('card');
        adminCard.classList.add('col-6');
        studentCard.classList.add('col-6');
        adminCardBody.classList.add('card-body');
        studentCardBody.classList.add('card-body');
      }
    }
  };
};

btnCreate.addEventListener('click', () => {
  const input = document.getElementById('quizName');
  if (input.value === '') {
    alert('Invalid Quiz Name');
  } else {
    const xhttp = new XMLHttpRequest();
    xhttp.open(
      'POST',
      'https://jasonjin-backend.herokuapp.com/admin/quizzes',
      true
    );
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify({ quizName: `${input.value}` }));
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const data = JSON.parse(this.responseText);
        location.href = `./admin.html?id=${data.insertId}&quizName=${input.value}`;
      }
    };
  }
});

const escape = function (str) {
  let newStr = str.replace(/'/g, "\\'");
  newStr = newStr.replace(/"/g, '\\"');
  return newStr;
};
