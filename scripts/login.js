import { loginUser } from './api-utils.js';

// Function to create a modal alert element
function createModalAlert(message) {
  const modalAlert = document.createElement("dialog");
  modalAlert.classList.add("modal__alert");
  modalAlert.textContent = message;
  return modalAlert;
}

// Function to add close functionality to the modal alert
function addModalCloseFunctionality(modalAlert) {
  const exitModalBtn = document.createElement("button");
  exitModalBtn.classList.add("modal__alert-btn");
  exitModalBtn.textContent = "Retour";
  modalAlert.appendChild(exitModalBtn);

  exitModalBtn.addEventListener("click", function (event) {
    event.preventDefault();
    modalAlert.close();
    modalAlert.style.display = "none";
  });

  window.onclick = function (event) {
    if (event.target === modalAlert) {
      event.preventDefault();
      modalAlert.close();
      modalAlert.style.display = "none";
    }
  };
}

// Function to display the modal alert
export async function displayModalAlert(message) {
  const modalAlert = createModalAlert(message);
  addModalCloseFunctionality(modalAlert);
  document.getElementById("login").appendChild(modalAlert);
  modalAlert.showModal();
}

// Retrieving the form element
const form = document.querySelector("form");

/**
 * Login
 * @param {Event} event The submit event from the login form.
 */
async function onSubmit(event) {
  event.preventDefault();
  
  let user = {
    email: form.email.value,
    password: form.password.value,
  };

  try {
    let result = await loginUser(user); // Using loginUser from api-utils.js

    // If the credentials are correct
    sessionStorage.setItem("token", result.token);
    window.location.replace("index.html");
  } catch (error) {
    // Assuming all errors are credential related for simplicity
    form.email.value = "";
    form.password.value = "";
    displayModalAlert("L'email ou le mot de passe n'est pas bon");
  }
}

// Add event listener to the form to trigger the login process
form.addEventListener("submit", onSubmit);

// Additional styles for the body
document.querySelector("body").style.height = "100%";
