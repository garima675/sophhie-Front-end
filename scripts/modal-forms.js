import { fetchCategoriesAPICall } from "./api-utils.js";
import { displayModalAlert } from "./login.js";
import { addWorkAPICall } from './api-utils.js';

// Function to display add work modal
export function createModalAndDisplayForm() {
    const modalContainer = document.querySelector(".modal-wrapper-add");
    modalContainer.style.display = null;
    createModalHeader();
    addWorkFormCreationAndVerify();
}

// Function to create modal header
function createModalHeader() {
    const modalContainer = document.querySelector(".modal-wrapper-add");
    const headerContainer = document.createElement("div");
    headerContainer.classList.add("modal-nav");
    const backButton = document.createElement("i");
    backButton.classList.add("fa-solid", "fa-arrow-left", "go-back-button");
    const closeBtn = document.createElement("i");
    closeBtn.classList.add("fa-solid", "fa-xmark", "close-modal-button");
    const headerTitle = document.createElement("h3");
    headerTitle.textContent = "Ajout photo";
    headerContainer.append(backButton, closeBtn);
    modalContainer.append(headerContainer, headerTitle);
}

// Function to display form for adding a work
function addWorkFormCreationAndVerify() {
    const modalContainer = document.querySelector(".modal-wrapper-add");
    const formElement = document.createElement("form");
    formElement.classList.add("form-add-works");
    createFormElements(formElement);
    modalContainer.appendChild(formElement);
    verifyFormInputs(formElement);
}

// Function to create form elements
function createFormElements(workForm) {
    const imgInputContainer = document.createElement("div");
    imgInputContainer.classList.add("container-add-img");
    const infoInputContainer = document.createElement("div");
    infoInputContainer.classList.add("container-form-info");
    createImageInput(imgInputContainer);
    createTextInput(infoInputContainer);
    workForm.append(imgInputContainer, infoInputContainer, createSubmitButton());
}

// Function to create image input
function createImageInput(imageContainer) {
    const iconPreview = document.createElement("i");
    iconPreview.classList.add("fa", "fa-regular", "fa-image");
    const previewImage = document.createElement("img");
    previewImage.classList.add("img-preview");
    previewImage.style.display = "none";
    const imageLabel = document.createElement("label");
    imageLabel.setAttribute("for", "file");
    imageLabel.classList.add("labelAddImg");
    imageLabel.textContent = "+ Ajouter photo";
    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.setAttribute("id", "file");
    inputFile.setAttribute("accept", "image/png, image/jpeg");
    inputFile.classList.add("input-image", "verif-form");
    inputFile.required = true;
    const infoText = document.createElement("p");
    infoText.classList.add("info-addImg");
    infoText.textContent = "jpg, png: max 4MB";
    imageContainer.append(
        iconPreview,
        previewImage,
        imageLabel,
        inputFile,
        infoText
    );
}

// Function to create text input for title and category
function createTextInput(infoContainer) {
    const titleLabel = document.createElement("label");
    titleLabel.setAttribute("for", "title");
    titleLabel.textContent = "Titre";
    const titleInput = document.createElement("input");
    titleInput.setAttribute("type", "text");
    titleInput.setAttribute("name", "title");
    titleInput.setAttribute("id", "title");
    titleInput.classList.add("verif-form");
    titleInput.required = true;
    const categoryLabel = document.createElement("label");
    categoryLabel.setAttribute("for", "category");
    categoryLabel.textContent = "Catégorie";
    const categorySelect = document.createElement("select");
    categorySelect.setAttribute("id", "selectCategory");
    categorySelect.classList.add("verif-form");
    categorySelect.required = true;
    setupCategoryOptions(categorySelect);
    infoContainer.append(
        titleLabel,
        titleInput,
        categoryLabel,
        categorySelect
    );
}

// Function to set options for category select in addition form
function setupCategoryOptions(categoryDropdown) {
    fetchCategoriesAPICall()
        .then(data => {
            // Optionally add a default or placeholder category
            data.unshift({
                id: 0,
                name: "",
            });
            // Populate the dropdown with categories
            for (let optionItem of data) {
                const option = document.createElement("option");
                option.classList.add("cat-option");
                option.setAttribute("id", optionItem.id.toString()); // Ensure ID is a string
                option.setAttribute("name", optionItem.name);
                option.textContent = optionItem.name;
                categoryDropdown.append(option);
            }
        })
        .catch(error => {
            console.error("Error fetching categories:", error);
            // Handle error (e.g., display an error message)
        });
}

// Function to verify form input
function verifyFormInputs(workForm) {
    const submitControl = workForm.querySelector(".js-add-works");
    const requiredInputs = workForm.querySelectorAll(".verif-form[required]");
    requiredInputs.forEach(input => {
        input.addEventListener("input", function () {
            if (workForm.checkValidity()) {
                submitControl.style.backgroundColor = "#1D6154";
            } else {
                submitControl.style.backgroundColor = "#A7A7A7";
            }
        });
    });
}

// Function to create submit button
function createSubmitButton() {
    const submitButtonLabel = document.createElement("label");
    submitButtonLabel.getAttribute("for", "js-validForm-btn");
    submitButtonLabel.classList.add("js-add-works");
    submitButtonLabel.textContent = "Valider";
    submitButtonLabel.style.backgroundColor = "#A7A7A7";
    const submitButton = document.createElement("input");
    submitButton.setAttribute("type", "submit");
    submitButton.setAttribute("id", "js-validForm-btn");
    submitButton.style.display = "none";
    submitButtonLabel.appendChild(submitButton);
    return submitButtonLabel;
}

// Function to send data to add a work
export function postNewWork() {
    const workTitle = document.getElementById("title").value;
    const categoryDropdown = document.getElementById("selectCategory");
    const selectedOption = categoryDropdown.selectedIndex;
    const chosenCategory = categoryDropdown.options[selectedOption].id;
    const imageFile = document.getElementById("file").files[0];
    const workData = new FormData();
    workData.append("image", imageFile);
    workData.append("title", workTitle);
    workData.append("category", chosenCategory);
    const userToken = sessionStorage.getItem("token");

    addWorkAPICall(workData, userToken)
        .then(response => {
            if (response.ok) {
                displayModalAlert("Photo ajoutée avec succés");
            } else {
                console.error("Error sending data: ", response.status);
            }
        })
        .catch(error => console.error("Error sending data: ", error));
}

// Function to go back from add work modal to delete works modal
export function goBackModal() {
    const addModalContainer = document.querySelector(".modal-wrapper-add");
    addModalContainer.style.display = "none";
    while (addModalContainer.firstChild) {
        addModalContainer.removeChild(addModalContainer.firstChild);
    }
    const deleteModalContainer = document.querySelector(".modal-wrapper-delete");
    deleteModalContainer.style.display = null;
}
