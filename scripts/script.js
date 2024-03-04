// Create a modal alert when the response is not correct
export async function modalAlert(message) {
  const modalAlert = document.createElement("dialog");
  modalAlert.classList.add("modal__alert");
  modalAlert.textContent = message;
  const exitModalBtn = document.createElement("button");
  exitModalBtn.classList.add("modal__alert-btn");
  exitModalBtn.textContent = "Retour";
  modalAlert.appendChild(exitModalBtn);
  const loginSection = document.getElementById("login");
  loginSection.appendChild(modalAlert);
  modalAlert.showModal();

  exitModalBtn.addEventListener("click", function(event) {
    event.preventDefault();
    modalAlert.close();
    modalAlert.style.display = "none";
  });

  window.onclick = function(event) {
    if (event.target === modalAlert) {
      event.preventDefault();
      modalAlert.close();
      modalAlert.style.display = "none";
    }
  };
}

const apiUrl = "http://localhost:5678/api/works";
let worksData = []; // Array to store the fetched works data

// script.js

document.addEventListener("DOMContentLoaded", function() {
  fetchDataAndDisplay();
});


function fetchDataAndDisplay() {
  fetch(apiUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      worksData = data;
      displayFilters();
      displayWorks();
      displayAdminMode();
      displayModalDeleteWorks();
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

function displayWorks() {
  const gallery = document.querySelector('.gallery');

  worksData.forEach(work => {
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

function displayFilters() {
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
  portfolio.insertBefore(containerFilters, portfolio.firstChild);
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
    // Display the logout button
    const login = document.querySelector("#login");
    login.textContent = "Log out";
    // Display the black banner
    const adminHeader = `<div class="edit_mode"><i class="fas fa-regular fa-pen-to-square fa-lg"></i><p>Mode édition</p></div>`;
    const header = document.querySelector("header");
    header.style.marginTop = "6rem";
    header.insertAdjacentHTML("beforebegin", adminHeader);
    // Create the edit button
    const editButtonTemplate = `<a href="#" class="edit-link"><i class="fa-regular fa-pen-to-square"></i> Modifier</a>`;
    // Positioning of the edit buttons
    const introSophie = document.querySelector("#introduction h2");
    const galleryTitle = document.querySelector("#portfolio h2");
    galleryTitle.insertAdjacentHTML("afterend", editButtonTemplate);
    // Add "href="#modal"" to the edit button of the gallery
    const editButtonGallery = document.querySelector("#portfolio a");
    editButtonGallery.classList.add("open-modal");
    // Disable the filtering function
    const divFilters = document.getElementById("container-filters");
    divFilters.style.display = "none";
    editButtonGallery.addEventListener("click", function(event) {
      clearModal();
      displayModalDeleteWorks();
      displayWorksModal();
    });
  }
}
/**to prevent duplicated content upon the reopening of the modal */
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

/** * Display works in the modal based on API data**/

async function displayWorksModal() {
  const data = worksData;

  for (let work of data) {
    const gallery = document.getElementById("modal-gallery");
    let figure = document.createElement("figure");
    figure.classList.add("modal-figure-works");
    let image = document.createElement("img");
    image.setAttribute("crossorigin", "anonymous");
    image.setAttribute("src", work.imageUrl);
    image.alt = work.title;
    let deleteButton = document.createElement("i");
    deleteButton.setAttribute("id", work.id);
    deleteButton.classList.add("fa-solid", "fa-trash-can", "delete-work");
    gallery.append(figure);
    figure.append(deleteButton, image);
  }
}
/**Display the modal in works deleltion mode */
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



/* Create options for the category select in the work addition form*/

function setOptionsSelectForm() {
  fetch('http://localhost:5678/api/categories')
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function(data) {
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




/**
 * Delete works from the API
 */
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
      displayModalDeleteWorks();
      displayWorksModal();
      displayWorks();
    }
  });
}




/**dislay the modal in addition modal */
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




/**return to the previous modal */
function goBackModal() {
  const modalWrapperAdd = document.querySelector(".modal-wrapper-add");
  modalWrapperAdd.style.display = "none";
  while (modalWrapperAdd.firstChild) {
    modalWrapperAdd.removeChild(modalWrapperAdd.firstChild);
  }
  const modalWrapperDelete = document.querySelector(".modal-wrapper-delete");
  modalWrapperDelete.style.display = null;
}


/** * Display the work addition form**/

function displayFormAddWork() {
  // Get the works deletion modal
  const modalWrapper = document.querySelector(".modal-wrapper-add");
  // Create the form
  const formAddWork = document.createElement("form");
  formAddWork.classList.add("form-add-works");
  // Create the form image container
  const containerFormImg = document.createElement("div");
  containerFormImg.classList.add("container-add-img");
  // Create the Font Awesome icon for image preview
  const faImagePreview = document.createElement("i");
  faImagePreview.classList.add("fa", "fa-regular", "fa-image");
  // Create the file preview as an image
  const imgPreview = document.createElement("img");
  imgPreview.classList.add("img-preview");
  imgPreview.style.display = "none"; // Initially hide the image preview
  // Create the file label
  const labelAddImgButton = document.createElement("label");
  labelAddImgButton.setAttribute("for", "file");
  labelAddImgButton.classList.add("labelAddImg");
  labelAddImgButton.textContent = "+ Ajouter photo";
  // Create the file input
  const addImgButton = document.createElement("input");
  addImgButton.type = "file";
  addImgButton.setAttribute("id", "file");
  addImgButton.setAttribute("accept", "image/png, image/jpeg");
  addImgButton.classList.add("input-image", "verif-form");
  addImgButton.required = true;
  // Create the file information line
  const infoAddImg = document.createElement("p");
  infoAddImg.classList.add("info-addImg");
  infoAddImg.textContent = "jpg, png: max 4MB";
  // Create the form information container
  const containerFormInfo = document.createElement("div");
  containerFormInfo.classList.add("container-form-info");
  // Create the title label
  const labelTitle = document.createElement("label");
  labelTitle.setAttribute("for", "title");
  labelTitle.textContent = "Titre";
  // Create the title input
  let inputTitle = document.createElement("input");
  inputTitle.setAttribute("type", "text");
  inputTitle.setAttribute("name", "title");
  inputTitle.setAttribute("id", "title");
  inputTitle.classList.add("verif-form");
  inputTitle.required = true;
  // Create the category label
  const labelCategory = document.createElement("label");
  labelCategory.setAttribute("for", "category");
  labelCategory.textContent = "Catégorie";
  // Create the category select
  const selectCategory = document.createElement("select");
  selectCategory.setAttribute("id", "selectCategory");
  selectCategory.classList.add("verif-form");
  selectCategory.required = true;
  // Get category options
  setOptionsSelectForm();
  // Create the submit button
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

  // Attach the above elements to the DOM
  modalWrapper.appendChild(formAddWork);
  formAddWork.append(containerFormImg, containerFormInfo, validFormLabel);
  containerFormImg.append(
    faImagePreview, // Initially display the Font Awesome icon
    imgPreview, // Initially hide the image preview
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
  // Add the verification function to change the button color
  verifForm();
}

/**check the work addition form for button color change */
function verifForm() {
  const formAddWork = document.querySelector(".form-add-works");
  const validForm = document.querySelector(".js-add-works");
  const requiredElements = document.querySelectorAll(".verif-form[required]");
  requiredElements.forEach((element) => {
    element.addEventListener("input", function() {
      if (formAddWork.checkValidity()) {
        validForm.style.backgroundColor = "#1D6154";
      } else {
        validForm.style.backgroundColor = "#A7A7A7";
      }
    });
  });
}




/* Send works to the API**/

function sendData() {
  // Get form values
  const title = document.getElementById("title").value;
  const selectCategory = document.getElementById("selectCategory");
  const choice = selectCategory.selectedIndex;
  const category = selectCategory.options[choice].id;
  const file = document.getElementById("file").files[0];

  // Create formData object
  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", title);
  formData.append("category", category);

  // Get the token
  const token = sessionStorage.getItem("token");
  // Send data to the server with an HTTP POST request
  fetch('http://localhost:5678/api/works', {
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

/**update the gallery on the moal and page without reloading* */

async function updateGallery() {
  /*updte the modal gallery**/
  displayWorks();

  const modalGallery = document.getElementById("modal-gallery");
  while (modalGallery.firstChild) {
    modalGallery.removeChild(modalGallery.firstChild);
  }
  displayWorksModal();
}

/**event:logout when clicking on logout */
document.addEventListener("click", function(event) {
  if (event.target.matches("#login")) {
    sessionStorage.removeItem("token");
  }
});



/**event:open the modal when clocking on mordifier button */
document.addEventListener("click", function(event) {
  if (event.target.matches(".open-modal")) {
    event.stopPropagation();
    modal.showModal();
  }
});

/**close the modal when clicking on the close button or outside of modal */

document.addEventListener("click", function(event) {
  if (event.target.matches(".close-modal-button")) {
    modal.close();
  } else if (event.target.matches("#modal")) {
    modal.close();
  }
});



/**event-delete works on modl when clicking on trash can */

document.addEventListener("click", (event) => {
  if (event.target.matches(".delete-work")) {
    event.preventDefault();
    deleteWorksData(event.target.id);
    modalAlert("Suppression de la photo effectuée");
    event.preventDefault();
    updateGallery();
  }
});


/*transfer to addintion model when click on add photo button**/
document.addEventListener("click", function(event) {
  if (event.target.matches(".link-modal-add")) {
    event.preventDefault();
    const modalWrapper = document.querySelector(".modal-wrapper-delete");
    modalWrapper.style.display = "none";
    displayModalAddWork();
  }
});


/**event-return to deletion mode on clicking arrow */
document.addEventListener("click", function(event) {
  if (event.target.matches(".go-back-button")) {
    goBackModal();
  }
});
/**
 * EVENT: Get the file and update the preview when clicking on the validate button**/

document.addEventListener("change", function(event) {
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
        // Hide the Font Awesome icon if it exists
        if (faImagePreview) {
          faImagePreview.style.display = "none";
        }
        // Hide the SVG if it exists
        if (svgImagePreview) {
          svgImagePreview.style.display = "none";
        }
        // Display the image preview
        if (imgPreview) {
          imgPreview.style.display = "block";
          // Set the src of the image to the uploaded image
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

/**send form data when  on submit button*/
document.addEventListener("click", function(event) {
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