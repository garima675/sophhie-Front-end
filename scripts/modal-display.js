import { displayWorks, worksData } from "./gallery.js";

function clearModalContent() {
    const deleteWrapper = document.querySelector(".modal-wrapper-delete");
    const addWrapper = document.querySelector(".modal-wrapper-add");
    if (deleteWrapper) {
        while (deleteWrapper.firstChild) {
            deleteWrapper.removeChild(deleteWrapper.firstChild);
        }
    }
    if (addWrapper) {
        while (addWrapper.firstChild) {
            addWrapper.removeChild(addWrapper.firstChild);
        }
    }
}


// Function to display admin mode UI elements if user is logged in
export function adminPageAfterLogin() {
    if (sessionStorage.getItem("token")) {
        displayAdminUI();
        setupAdminActions();
    }
}

// Function to display admin UI elements
function displayAdminUI() {
    const loginElement = document.querySelector("#login");
    loginElement.textContent = "Log out";

    const adminHeaderHTML = `<div class="edit_mode"><i class="fas fa-regular fa-pen-to-square fa-lg"></i><p>Mode édition</p></div>`;
    const headerElement = document.querySelector("header");
    headerElement.style.marginTop = "6rem";
    headerElement.insertAdjacentHTML("beforebegin", adminHeaderHTML);

    const editButtonTemplateHTML = `<a href="#" class="edit-link"><i class="fa-regular fa-pen-to-square"></i> Modifier</a>`;
    const introSophieElement = document.querySelector("#introduction h2");
    const galleryTitleElement = document.querySelector("#portfolio h2");
    galleryTitleElement.insertAdjacentHTML("afterend", editButtonTemplateHTML);

    const editButtonGalleryElement = document.querySelector("#portfolio a");
    editButtonGalleryElement.classList.add("open-modal");
}


// Function to set up admin mode actions
function setupAdminActions() {
    const editButtonGallery = document.querySelector("#portfolio a");
    editButtonGallery.addEventListener("click", function (event) {
        clearModalContent();
        modalDeleteWorksView();
        displayWorksModal();
    });
}


// Function to display delete works modal
export function modalDeleteWorksView() {
    clearModalContent();
    const modalContainer = document.querySelector(".modal-wrapper-delete");
    const modalNavigation = createElement("div", { classList: ["modal-nav"] });
    const closeButton = createElement("i", { classList: ["fa-solid", "fa-xmark", "close-modal-button"] });
    const modalTitle = createElement("h3", { textContent: "Gallerie Photo" });
    const galleryContainer = createElement("div", { id: "modal-gallery" });
    const addButton = createElement("button", { classList: ["link-modal-add"], textContent: "Ajouter une photo" });
    
    modalNavigation.appendChild(closeButton);
    modalContainer.append(modalNavigation, modalTitle, galleryContainer, addButton);
}


function createElement(tag, options) {
    const { classList, textContent, id } = options;
    const element = document.createElement(tag);
    if (classList) classList.forEach(className => element.classList.add(className));
    if (textContent) element.textContent = textContent;
    if (id) element.id = id;
    return element;
}


// Function to display works in delete works modal
export async function displayWorksModal() {
    const modalGallery = document.getElementById("modal-gallery");
    while (modalGallery.firstChild) {
        modalGallery.removeChild(modalGallery.firstChild);
    }
    await displayWorks();
    for (let modalWork of worksData) {
        const modalFigure = document.createElement("figure");
        modalFigure.classList.add("modal-figure-works");
        const modalImage = document.createElement("img");
        modalImage.setAttribute("crossorigin", "anonymous");
        modalImage.setAttribute("src", modalWork.imageUrl);
        modalImage.alt = modalWork.title;
        const modalDeleteButton = document.createElement("i");
        modalDeleteButton.setAttribute("id", modalWork.id);
        modalDeleteButton.classList.add("fa-solid", "fa-trash-can", "delete-work");
        modalGallery.appendChild(modalFigure);
        modalFigure.append(modalDeleteButton, modalImage);
    }
}
