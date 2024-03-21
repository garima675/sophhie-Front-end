import { deleteWorksByIdAPICall, apiWorks} from "./api-utils.js";
import { displayModalAlert } from "./login.js";
import { generateFilterButtons, displayWorks, worksData } from "./gallery.js";
import { adminPageAfterLogin, displayWorksModal } from "./modal-display.js";
import { goBackModal, postNewWork, createModalAndDisplayForm } from "./modal-forms.js";

async function initializeApplication() {
    await displayWorks();
    if (!sessionStorage.getItem("token")) {
        await generateFilterButtons(worksData);
    }
    adminPageAfterLogin();
}

async function refreshGallery() {
    await displayWorks();
    displayWorksModal();
}

function attachEventListeners() {
    document.addEventListener("click", function (eventObject) {
        if (eventObject.target.matches("#login")) {
            sessionStorage.removeItem("token");
        } else if (eventObject.target.matches(".open-modal")) {
            eventObject.stopPropagation();
            modal.showModal();
        } else if (eventObject.target.matches(".close-modal-button") || eventObject.target.matches("#modal")) {
            modal.close();
        } else if (eventObject.target.matches(".delete-work")) {
            eventObject.preventDefault();
            deleteWorksByIdAPICall(eventObject.target.id);
            displayModalAlert("Suppression de la photo effectuée");
            refreshGallery();
        } else if (eventObject.target.matches(".link-modal-add")) {
            eventObject.preventDefault();
            const deleteModalContainer = document.querySelector(".modal-wrapper-delete");
            deleteModalContainer.style.display = "none";
            createModalAndDisplayForm();
        } else if (eventObject.target.matches(".go-back-button")) {
            goBackModal();
        } else if (eventObject.target.matches(".js-add-works")) {
            eventObject.preventDefault();
            processFormSubmit();
        }
    });

    document.addEventListener("change", handleFileSelectionChange);
}

function processFormSubmit() {
    const worksFormElement = document.querySelector(".form-add-works");
    if (worksFormElement.checkValidity()) {
        postNewWork();
        goBackModal();
        refreshGallery();
    }
}

function handleFileSelectionChange(changeEvent) {
    if (changeEvent.target.matches(".input-image")) {
        const selectedFile = changeEvent.target.files[0];
        const imageUploadContainer = document.querySelector(".container-add-img");
        const previewImageElement = imageUploadContainer.querySelector("img.img-preview");
        const iconImagePreview = imageUploadContainer.querySelector("i.fa-image");
        const vectorImagePreview = imageUploadContainer.querySelector("svg.svg-inline--fa.fa-image");
        const addImageButtonLabel = document.querySelector(".labelAddImg");
        const imageInfoParagraph = document.querySelector(".info-addImg");
        const validFormats = ["image/jpeg", "image/png"];

        if (selectedFile.size <= 4 * 1024 * 1024) {
            showImagePreview(selectedFile, previewImageElement, iconImagePreview, vectorImagePreview, addImageButtonLabel, imageInfoParagraph);
            readFile(selectedFile, previewImageElement);
            verifyImageFormat(selectedFile, validFormats);
        } else {
            displayModalAlert("La taille maximale autorisée est de 4 Mo pour chaque fichier.");
        }
    }
}

function showImagePreview(selectedFile, previewElement, iconPreview, vectorPreview, buttonLabel, infoText) {
    if (iconPreview) iconPreview.style.display = "none";
    if (vectorPreview) vectorPreview.style.display = "none";
    if (previewElement) {
        previewElement.style.display = "block";
        previewElement.src = URL.createObjectURL(selectedFile);
        buttonLabel.style.display = "none";
        infoText.style.display = "none";
    }
}

function readFile(fileData, previewElement) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(fileData);
    fileReader.onload = function () {
        previewElement.src = fileReader.result;
    };
}

function verifyImageFormat(fileData, permittedFormats) {
    if (!permittedFormats.includes(fileData.type)) {
        displayModalAlert("SEULES LES IMAGES AUX FORMATS .JPG OU .PNG SONT ADMISES");
    }
}

initializeApplication();
attachEventListeners();
