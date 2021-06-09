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
            <button class="previous round" id="previous">&#8249;</button>
        <img class="avatar" src="${picture.large}" />
            <button class="next round" id="next">&#8250</button>
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


  overlay.classList.remove("hidden");
  modalContainer.innerHTML = modalHTML;

  /* make a variable for each of the previous and next buttons located in the const modalHTML variable template
  literal */

let nextButton = document.getElementById('next');
let prevButton = document.getElementById('previous');

/* use the variable names for each button for the click event handlers. Then if the next or previous button
is equal to nextButton, or prevButton call the displayModal function and increase the data found
in index by either 1 for the next button, or -1 for the previous button. This creates a new modal
window either way forward or backwards.  */

  nextButton.addEventListener("click", (event) => {
    if(event.target === nextButton) {
      displayModal(index +1)
    }
  });
  
  prevButton.addEventListener("click", (event) => {
    if(event.target === prevButton) {
      displayModal(index -1)
    }
  });

};

/* *****************************************  */
/* Event Listener click on the card elements  */
/* *****************************************  */

gridContainer.addEventListener("click", (e) => {
  /* make sure the click is not on the gridContainer itself */
  if (e.target !== gridContainer) {
    /* select the card element based on its proximity to actual element clicked */

    const card = e.target.closest(".card");
   
   /* removed const from index to make it a global variable which 
   can then be used for the previous and next buttons event listeners located inside the 
   displayModal function above. use parseInt to change index from a string to an integer since we are
   using some math on it, increase or decrease the modal by +1 or -1 for the next and previous buttons. Then
   displayModal(index) displays the modal when the card inside the grid-container is cliked on.
   */
    index = parseInt(card.getAttribute("data-index"));
    displayModal(index);
  }
});

/* *****************************************************  */
/* Event Listener click on the X closes the modal window  */
/* *****************************************************  */

modalClose.addEventListener("click", () => {
  overlay.classList.add("hidden");
});
window.onclick = function(event) {
  if (event.target == overlay) {
    overlay.style.display = "none";
    window.location.reload();
  }
}
