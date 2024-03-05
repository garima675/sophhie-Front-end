import { modalAlert } from "./login.js";

const urlCategories = "http://localhost:5678/api/categories";
const urlWorks = "http://localhost:5678/api/works";
const urlLogin = "http://localhost:5678/api/users/login";

// Global variable to store API data
let worksData = [];

function deleteWorks() {
    // Get the gallery element from index.html
    const gallery = document.getElementsByClassName("gallery").item(0);
    // Remove children of the gallery element
    while (gallery.firstChild) {
        gallery.removeChild(gallery.firstChild);
    }
}

async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

async function displayWorks() {
    worksData = await fetchData(urlWorks);
    deleteWorks();
    populateGallery(worksData);
}

function populateGallery(data) {
    for (let work of data) {
            const gallery = document.getElementsByClassName("gallery").item(0);
            const figure = document.createElement("figure");
            const image = document.createElement("img");
            image.setAttribute("crossorigin", "anonymous");
            image.setAttribute("src", work.imageUrl);
            image.alt = work.title;
            const figCaption = document.createElement("figcaption");
            figCaption.textContent = work.title;
            gallery.appendChild(figure);
            figure.append(image, figCaption);
    }
}

async function displayFilters() {
    const categories = ['Tous', ...new Set(worksData.map(work => work.category.name))];
    const containerFilters = document.createElement('div');
    containerFilters.id = 'container-filters';

    categories.forEach(category => {
        const button = document.createElement('button');
        button.classList.add('button-filter');
        button.textContent = category;
        button.addEventListener('click', filterWorks);
        containerFilters.appendChild(button);
    });

    const portfolio = document.getElementById('portfolio');
    const gallery = document.getElementsByClassName('gallery').item(0);
    portfolio.insertBefore(containerFilters, gallery);
}

function filterWorks(event) {
    const categoryName = event.target.textContent;
    const filteredWorks = categoryName === 'Tous' ? worksData : worksData.filter(work => work.category.name === categoryName);
    displayFilteredWorks(filteredWorks);
}

function displayFilteredWorks(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; // Clear existing content

    works.forEach(work => {
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        image.setAttribute('src', work.imageUrl);
        image.setAttribute('alt', work.title);
        const figCaption = document.createElement('figcaption');
        figCaption.textContent = work.title;

        figure.appendChild(image);
        figure.appendChild(figCaption);
        gallery.appendChild(figure);
    });
}

function displayAdminMode() {
    if (sessionStorage.getItem("token")) {
        const login = document.querySelector("#login");
        login.textContent = "Log out";
        const adminHeader = `<div class="edit_mode"><i class="fas fa-regular fa-pen-to-square fa-lg"></i><p>Mode édition</p></div>`;
        const header = document.querySelector("header");
        header.style.marginTop = "6rem";
        header.insertAdjacentHTML("beforebegin", adminHeader);
        const editButtonTemplate = `<a href="#" class="edit-link"><i class="fa-regular fa-pen-to-square"></i> Modifier</a>`;
        const introSophie = document.querySelector("#introduction h2");
        const galleryTitle = document.querySelector("#portfolio h2");
        galleryTitle.insertAdjacentHTML("afterend", editButtonTemplate);
        const editButtonGallery = document.querySelector("#portfolio a");
        editButtonGallery.classList.add("open-modal");
        const divFilters = document.getElementById("container-filters");
        editButtonGallery.addEventListener("click", function (event) {
            clearModal();
            displayModalDeleteWorks();
            displayWorksModal();
        });
    }
}

function clearModal() {
    const modalWrapperDelete = document.querySelector(".modal-wrapper-delete");
    const modalWrapperAdd = document.querySelector(".modal-wrapper-add");
    if (modalWrapperDelete) {
        while (modalWrapperDelete.firstChild) {
            modalWrapperDelete.removeChild(modalWrapperDelete.firstChild);
        }
    }
    if (modalWrapperAdd) {
        while (modalWrapperAdd.firstChild) {
            modalWrapperAdd.removeChild(modalWrapperAdd.firstChild);
        }
    }
}

function displayModalDeleteWorks() {
    const modalWrapper = document.querySelector(".modal-wrapper-delete");
    const modalNav = document.createElement("div");
    modalNav.classList.add("modal-nav");
    const closeModalButton = document.createElement("i");
    closeModalButton.classList.add("fa-solid", "fa-xmark", "close-modal-button");
    const titleModal = document.createElement("h3");
    titleModal.textContent = "Gallerie Photo";
    const containerGallery = document.createElement("div");
    containerGallery.setAttribute("id", "modal-gallery");
    const addWorkButton = document.createElement("button");
    addWorkButton.classList.add("link-modal-add");
    addWorkButton.textContent = "Ajouter une photo";
    modalNav.append(closeModalButton);
    modalWrapper.append(modalNav, titleModal, containerGallery, addWorkButton);
}

async function displayWorksModal() {
    const gallery = document.getElementById("modal-gallery");
    while (gallery.firstChild) {
        gallery.removeChild(gallery.firstChild);
    }
    await displayWorks();
    for (let work of worksData) {
        const figure = document.createElement("figure");
        figure.classList.add("modal-figure-works");
        const image = document.createElement("img");
        image.setAttribute("crossorigin", "anonymous");
        image.setAttribute("src", work.imageUrl);
        image.alt = work.title;
        const deleteButton = document.createElement("i");
        deleteButton.setAttribute("id", work.id);
        deleteButton.classList.add("fa-solid", "fa-trash-can", "delete-work");
        gallery.appendChild(figure);
        figure.append(deleteButton, image);
    }
}


function deleteWorksData(id) {
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            "content-type": "application/Json",
            authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    }).then((response) => {
        if (response.status === 200) {
            const deletedElement = document.getElementById(id);
            if (deletedElement) {
                deletedElement.parentNode.removeChild(deletedElement);
            }
            displayWorks();
            displayModalDeleteWorks();
            displayWorksModal();
        }
    });
}

function displayModalAddWork() {
    const modalWrapper = document.querySelector(".modal-wrapper-add");
    modalWrapper.style.display = null;
    const modalNav = document.createElement("div");
    modalNav.classList.add("modal-nav");
    const goBackButton = document.createElement("i");
    goBackButton.classList.add("fa-solid", "fa-arrow-left", "go-back-button");
    const closeModalButton = document.createElement("i");
    closeModalButton.classList.add("fa-solid", "fa-xmark", "close-modal-button");
    const titleModal = document.createElement("h3");
    titleModal.textContent = "Ajout photo";
    modalNav.append(goBackButton, closeModalButton);
    modalWrapper.append(modalNav, titleModal);
    displayFormAddWork();
}

function goBackModal() {
    const modalWrapperAdd = document.querySelector(".modal-wrapper-add");
    modalWrapperAdd.style.display = "none";
    while (modalWrapperAdd.firstChild) {
        modalWrapperAdd.removeChild(modalWrapperAdd.firstChild);
    }
    const modalWrapperDelete = document.querySelector(".modal-wrapper-delete");
    modalWrapperDelete.style.display = null;
}

function displayFormAddWork() {
    const modalWrapper = document.querySelector(".modal-wrapper-add");
    const formAddWork = document.createElement("form");
    formAddWork.classList.add("form-add-works");
    const containerFormImg = document.createElement("div");
    containerFormImg.classList.add("container-add-img");
    const faImagePreview = document.createElement("i");
    faImagePreview.classList.add("fa", "fa-regular", "fa-image");
    const imgPreview = document.createElement("img");
    imgPreview.classList.add("img-preview");
    imgPreview.style.display = "none";
    const labelAddImgButton = document.createElement("label");
    labelAddImgButton.setAttribute("for", "file");
    labelAddImgButton.classList.add("labelAddImg");
    labelAddImgButton.textContent = "+ Ajouter photo";
    const addImgButton = document.createElement("input");
    addImgButton.type = "file";
    addImgButton.setAttribute("id", "file");
    addImgButton.setAttribute("accept", "image/png, image/jpeg");
    addImgButton.classList.add("input-image", "verif-form");
    addImgButton.required = true;
    const infoAddImg = document.createElement("p");
    infoAddImg.classList.add("info-addImg");
    infoAddImg.textContent = "jpg, png: max 4MB";
    const containerFormInfo = document.createElement("div");
    containerFormInfo.classList.add("container-form-info");
    const labelTitle = document.createElement("label");
    labelTitle.setAttribute("for", "title");
    labelTitle.textContent = "Titre";
    const inputTitle = document.createElement("input");
    inputTitle.setAttribute("type", "text");
    inputTitle.setAttribute("name", "title");
    inputTitle.setAttribute("id", "title");
    inputTitle.classList.add("verif-form");
    inputTitle.required = true;
    const labelCategory = document.createElement("label");
    labelCategory.setAttribute("for", "category");
    labelCategory.textContent = "Catégorie";
    const selectCategory = document.createElement("select");
    selectCategory.setAttribute("id", "selectCategory");
    selectCategory.classList.add("verif-form");
    selectCategory.required = true;
    setOptionsSelectForm();
    const validFormLabel = document.createElement("label");
    validFormLabel.getAttribute("for", "js-validForm-btn");
    validFormLabel.classList.add("js-add-works");
    validFormLabel.textContent = "Valider";
    validFormLabel.style.backgroundColor = "#A7A7A7";
    const validForm = document.createElement("input");
    validForm.getAttribute("type", "submit");
    validForm.getAttribute("id", "js-validForm-btn");
    validForm.style.display = "none";
    validFormLabel.appendChild(validForm);
    modalWrapper.appendChild(formAddWork);
    formAddWork.append(containerFormImg, containerFormInfo, validFormLabel);
    containerFormImg.append(
        faImagePreview,
        imgPreview,
        labelAddImgButton,
        addImgButton,
        infoAddImg
    );
    containerFormInfo.append(
        labelTitle,
        inputTitle,
        labelCategory,
        selectCategory
    );
    verifForm();
}

function setOptionsSelectForm() {
    fetch(urlCategories)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function (data) {
            data.unshift({
                id: 0,
                name: "",
            });
            for (let category of data) {
                const option = document.createElement("option");
                option.classList.add("cat-option");
                option.setAttribute("id", category.id);
                option.setAttribute("name", category.name);
                option.textContent = category.name;
                const selectCategory = document.getElementById("selectCategory");
                selectCategory.append(option);
            }
        });
}

function verifForm() {
    const formAddWork = document.querySelector(".form-add-works");
    const validForm = document.querySelector(".js-add-works");
    const requiredElements = document.querySelectorAll(".verif-form[required]");
    requiredElements.forEach((element) => {
        element.addEventListener("input", function () {
            if (formAddWork.checkValidity()) {
                validForm.style.backgroundColor = "#1D6154";
            } else {
                validForm.style.backgroundColor = "#A7A7A7";
            }
        });
    });
}

function sendData() {
    const title = document.getElementById("title").value;
    const selectCategory = document.getElementById("selectCategory");
    const choice = selectCategory.selectedIndex;
    const category = selectCategory.options[choice].id;
    const file = document.getElementById("file").files[0];
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", category);
    const token = sessionStorage.getItem("token");
    fetch(urlWorks, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    })
        .then((response) => {
            if (response.ok) {
                modalAlert("Photo ajoutée avec succés");
            } else {
                console.error("Error sending data: ", a.status);
            }
        })
        .catch((error) => console.error("Error sending data: ", error));
}


/**
 * Update the gallery on the modal and the page without reloading
 */
async function updateGallery() {
    // Update the main gallery on the page
    displayWorks();
  
    // Update the modal gallery
    const modalGallery = document.getElementById("modal-gallery");
    while (modalGallery.firstChild) {
      modalGallery.removeChild(modalGallery.firstChild);
    }
    displayWorksModal();
  }

document.addEventListener("click", function (event) {
    if (event.target.matches(".button-filter")) {
        filterWorks(event);
    }
});

document.addEventListener("click", function (event) {
    if (event.target.matches("#login")) {
        sessionStorage.removeItem("token");
    }
});

document.addEventListener("click", function (event) {
    if (event.target.matches(".open-modal")) {
        event.stopPropagation();
        modal.showModal();
    }
});

document.addEventListener("click", function (event) {
    if (event.target.matches(".close-modal-button")) {
        modal.close();
    } else if (event.target.matches("#modal")) {
        modal.close();
    }
});

document.addEventListener("click", (event) => {
    if (event.target.matches(".delete-work")) {
        event.preventDefault();
        deleteWorksData(event.target.id);
        modalAlert("Suppression de la photo effectuée");
        updateGallery();
    }
});

document.addEventListener("click", function (event) {
    if (event.target.matches(".link-modal-add")) {
        event.preventDefault();
        const modalWrapper = document.querySelector(".modal-wrapper-delete");
        modalWrapper.style.display = "none";
        displayModalAddWork();
    }
});

document.addEventListener("click", function (event) {
    if (event.target.matches(".go-back-button")) {
        goBackModal();
    }
});

document.addEventListener("change", function (event) {
    if (event.target.matches(".input-image")) {
        const containerFormImg = document.querySelector(".container-add-img");
        const imgPreview = containerFormImg.querySelector("img.img-preview");
        const faImagePreview = containerFormImg.querySelector("i.fa-image");
        const svgImagePreview = containerFormImg.querySelector("svg.svg-inline--fa.fa-image");
        const labelAddImg = document.querySelector(".labelAddImg");
        const infoAddImg = document.querySelector(".info-addImg");
        const file = event.target.files[0];
        const reader = new FileReader();
        const allowedFormats = ["image/jpeg", "image/png"];
        if (file.size <= 4 * 1024 * 1024) {
            reader.addEventListener("load", () => {
                if (faImagePreview) {
                    faImagePreview.style.display = "none";
                }
                if (svgImagePreview) {
                    svgImagePreview.style.display = "none";
                }
                if (imgPreview) {
                    imgPreview.style.display = "block";
                    imgPreview.src = reader.result;
                    labelAddImg.style.display = "none";
                    infoAddImg.style.display = "none";
                }
            });
            if (file) {
                reader.readAsDataURL(file);
            }
            if (!allowedFormats.includes(file.type)) {
                modalAlert("SEULEMENT LES FICHIERS EN .JPG OU .PNG SONT ACCEPTÉS");
            }
        }
        if (file.size > 4 * 1024 * 1024) {
            modalAlert("La taille maximale autorisée est de 4mo");
        }
    }
});

document.addEventListener("click", function (event) {
    if (event.target.matches(".js-add-works")) {
        event.preventDefault();
        const formAddWorks = document.querySelector(".form-add-works");
        if (formAddWorks.checkValidity()) {
            sendData();
            goBackModal();
            updateGallery();
        }
    }
});


async function init() {
    await displayWorks();
    if (!sessionStorage.getItem("token")) {
        await displayFilters();
    }
    displayAdminMode();
}

init();

