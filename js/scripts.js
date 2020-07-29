/******************************************
Treehouse Techdegree:
FSJS project 4 - 
******************************************/

/******************************************
 * Global Variables
 ******************************************/
const randomUserURL = 'https://randomuser.me/api/?results=12&inc=picture,name,email,location,phone,dob&nat=us';
const gallery = document.querySelector('#gallery');
let employeeArray = [];
let searchEmployeeArray = [];
let currentEmployeeIndex;

/******************************************
 * Function Declarations   
 ******************************************/
const fetchEmployees = (employeeData) => {
  employeeData.forEach(employee => {
    employeeArray.push(employee);
  })
  displayEmployees(employeeArray);
}

// Function that makes a card div for each employee that was retrieved with the fetch request, fills it with all relevant information in HTML, and is appended to the HTML document's body
const displayEmployees = (employeeData) => {
  gallery.innerHTML = '';
  let i = 0;
  employeeData.forEach(employee => {
    let employeeDIV = document.createElement('div');
    employeeDIV.classList.add('card');
    employeeDIV.setAttribute('data-index', i);
    i += 1;
    employeeDIV.innerHTML = `
    <div class="card-img-container">
      <img class="card-img" src="${employee.picture.medium}" alt="profile picture">
    </div>
    <div class="card-info-container">
      <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
      <p class="card-text">${employee.email}</p>
      <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
    </div>
    `;
    gallery.appendChild(employeeDIV);
  });
}

// Function that is called when a card div is clicked and that creates the modal div with the data from the clicked employee
const clickEmployee = (e) => {
  if (e.target.closest('.card')) {
    currentEmployeeIndex = e.target.closest('.card').getAttribute('data-index');
    makeModalDiv(currentEmployeeIndex);
  }
}

// Function that runs when the modal window is clicked. If the click is on the button or outside of the modal div, the modal div is removed from the DOM.
const modalCloseFunction = (e) => {
  if (document.querySelector('#modal-close-btn').contains(e.target) || e.target === document.querySelector('.modal-container')) {
    document.querySelector('.modal-container').remove();
  }
}

// Function that makes the modal div.
const makeModalDiv = (i) => {
  if (document.querySelector('.modal-container')) {
    document.querySelector('.modal-container').remove();
  }
  let array;
  if (searchEmployeeArray.length !== 0) {
    array = searchEmployeeArray;
  } else {
    array = employeeArray;
  }
  let modalDIV = document.createElement('div');
  modalDIV.classList.add('modal-container');
  let dob = array[i].dob.date.substring(0, 10);
  dob = dob.split('-')[1] + '/' + dob.split('-')[2] + '/' + dob.split('-')[0].slice(-2);
  modalDIV.innerHTML = `
  <div class="modal">
    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
    <div class="modal-info-container">
        <img class="modal-img" src="${array[i].picture.medium}" alt="profile picture">
        <h3 id="name" class="modal-name cap">${array[i].name.first} ${array[i].name.last}</h3>
        <p class="modal-text">${array[i].email}</p>
        <p class="modal-text cap">${array[i].location.city}</p>
        <hr>
        <p class="modal-text">${array[i].phone}</p>
        <p class="modal-text">${array[i].location.street.number} ${array[i].location.street.name}, ${array[i].location.city}, ${array[i].location.state} ${array[i].location.postcode}</p>
        <p class="modal-text">Birthday: ${dob}</p>
    </div>
    <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
  </div>
`
  document.querySelector('body').appendChild(modalDIV);
  document.querySelector('.modal').setAttribute('data-index', i)
  if (currentEmployeeIndex > 0) {
    document.querySelector('#modal-prev').addEventListener("click", modalPrev)
  }
  if (currentEmployeeIndex < array.length - 1) {
    document.querySelector('#modal-next').addEventListener("click", modalNext)
  }
  // Event listener is attached to the modal div to listen for clicks on the close button
  document.querySelector('.modal-container').addEventListener('click', modalCloseFunction);
}


// Function that runs when the previous button is clicked on the modal div
const modalPrev = () => {
  currentEmployeeIndex -= 1;
  makeModalDiv(currentEmployeeIndex);
}

// Function that runs when the next button is clicked on the modal div
const modalNext = () => {
  currentEmployeeIndex++;
  makeModalDiv(currentEmployeeIndex);
}

// Function that performs the search. 
const searchFunction = (e) => {
  let searchValue;
  if (e.target === document.querySelector('#search-submit')) {
    searchValue = document.querySelector('.search-input').value.toLowerCase();
  } else searchValue = e.target.value.toLowerCase();
  if (searchValue === '') {
    searchEmployeeArray = [];
    displayEmployees(employeeArray);
  } else {
    for (let i = 0; i < employeeArray.length; i++) {
      let cardName = (employeeArray[i].name.first + ' ' + employeeArray[i].name.last).toLowerCase();
      if (cardName.includes(searchValue) && !searchEmployeeArray.includes(employeeArray[i])) {
        searchEmployeeArray.push(employeeArray[i]);
      } else if (!cardName.includes(searchValue) && searchEmployeeArray.includes(employeeArray[i])) {
        const index = searchEmployeeArray.indexOf(employeeArray[i]);
        searchEmployeeArray.splice(index, 1);
      }
    }
    displayEmployees(searchEmployeeArray);
  }
}

// Function that creates the searchbox and appends it to the search-container div
const searchBox = () => {
  const searchBox = document.createElement('form');
  searchBox.setAttribute('action', '#');
  searchBox.setAttribute('method', 'get');
  searchBox.innerHTML = `
  <input type="search" id="search-input" class="search-input" placeholder="Search...">
  <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  `
  document.querySelector('.search-container').appendChild(searchBox);
  searchBox.addEventListener('keyup', searchFunction);
  document.querySelector('#search-submit').addEventListener('click', searchFunction);
}

/******************************************
 * Function Calls on page load
 ******************************************/
searchBox();

/******************************************
 * Fetch
 ******************************************/
fetch(randomUserURL)
  .then(response => response.json())
  .then(res => res.results)
  .then(fetchEmployees)
  .catch(error => console.log(error));

/******************************************
 * Event Listeners
 ******************************************/
gallery.addEventListener('click', clickEmployee);
