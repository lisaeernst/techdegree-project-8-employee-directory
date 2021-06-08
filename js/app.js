/* Awesome Startup Employee Directory */

/* *****************************************  */
/*         Global Variables                   */
/* *****************************************  */

let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture, email, location,
phone, dob &noinfo &nat=US`;

const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");

/* *****************************************  */
/*          fetch data from API               */
/* *****************************************  */

fetch(urlAPI)
  .then((res) => res.json())
  .then((res) => res.results)
  .then(displayEmployees)
  .catch((err) => console.log(err));

/* displayEmployees function that has a single parameter named employeeData */

function displayEmployees(employeeData) {
  employees = employeeData;

  //store the employee HTML as we create it
  let employeeHTML = "";

  //loop through each employee and create HTML markup
  employees.forEach((employee, index) => {
    let name = employee.name;
    let email = employee.email;
    let city = employee.location.city;
    let picture = employee.picture;

    //template literals make this so much cleaner

    employeeHTML += `
      <div class="card" data-index="${index}">
      <img class="avatar" src="${picture.large}" />
        <div class="text-container">
            <h2 class="name">${name.first} ${name.last}</h2>
            <p class="email">${email}</p>
            <p class="address">${city}</p>
        </div>
      </div>
      `;
  });

  gridContainer.innerHTML = employeeHTML;
}

/* ***************************************  */
/*            SEARCH  BAR                   */
/* ***************************************  */

/* 

1. Create variables to target the search bar with an ID of searchBar and store 
that in the search variable. Then target the card h2's with a class of name
and store those values in the variable imgBoxes.

2. Create a function and store the information in the variable handleSearch.
3. Event parameter takes the 

*/

const search = document.querySelector("#search");

const handleSearch = (event) => {
  const cardBoxes = document.querySelectorAll(".card .name");
  const searchTerm = event.target.value.toLowerCase();

  cardBoxes.forEach((cardBox) => {
    const text = cardBox.textContent.toLowerCase();
    const box = cardBox.parentElement.parentElement;

    if (text.includes(searchTerm)) {
      box.style.display = "block";
    } else {
      box.style.display = "none";
    }
  });
};

search.addEventListener("keyup", handleSearch);
search.addEventListener("search", handleSearch); // clearing the search field using the X resets the gallery

/* ***************************************  */
/*            Modal Window Overlay          */
/* ***************************************  */

function displayModal(index) {
  /* use object destructuring make our template literal cleaner */
  let {
    name,
    dob,
    phone,
    email,
    location: { street, city, state, postcode },
    picture,
  } = employees[index];

  let date = new Date(dob.date);

  const modalHTML = `
  <button id="previous">Previous</button>
        <img class="avatar" src="${picture.large}" />
        <button id="next">Next</button>
        <div class="text-container">
          <h2 class="name">${name.first} ${name.last}</h2>
          <p class="email">${email}</p>
          <p class="address">${city}</p>
          <hr>
          <p>${phone}</p>
          <p class="address">${street.number} ${street.name} ${city} ${state} ${postcode}</p>
      
          <p>Birthday:
          ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
        </div>
      `;

      let nextButton = document.getElementById('next');
let prevButton = document.getElementById('previous');
  overlay.classList.remove("hidden");
  modalContainer.innerHTML = modalHTML;

  nextButton.addEventListener("click", (event) => {
    if(event.target === nextButton) {
      displayModal(index +1)
    }
  });
  
  prevButton.addEventListener("click", (event) => {
    if(event.target === prevButton) {
      displayModal(index -1)
    }
  })
}

/* *****************************************  */
/* Event Listener click on the card elements  */
/* *****************************************  */

gridContainer.addEventListener("click", (e) => {
  /* make sure the click is not on the gridContainer itself */
  if (e.target !== gridContainer) {
    /* select the card element based on its proximity to actual element clicked */

    const card = e.target.closest(".card");
    index = card.getAttribute("data-index"); // removed const to make this a global variable for prev /next buttons
    displayModal(index);
  }
});

/* *****************************************************  */
/* Previous and Next Buttons                              */
/* *****************************************************  */






/* *****************************************************  */
/* Event Listener click on the X closes the modal window  */
/* *****************************************************  */

modalClose.addEventListener("click", () => {
  overlay.classList.add("hidden");
});