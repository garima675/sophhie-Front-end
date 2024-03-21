import { fetchWorksDataAPICall } from "./api-utils.js";

export let worksData = [];

export function deleteWorks() {
    const galleryRef = document.getElementsByClassName("gallery").item(0);
    while (galleryRef.firstChild) {
        galleryRef.removeChild(galleryRef.firstChild);
    }
}

export async function displayWorks() {
    worksData = await fetchWorksDataAPICall();
    deleteWorks();
    populateGallery(worksData);
}

function populateGallery(worksArray) {
    for (let work of worksArray) {
        const galleryRef = document.getElementsByClassName("gallery").item(0);
        const figureNode = document.createElement("figure");
        const imgNode = document.createElement("img");
        imgNode.setAttribute("crossorigin", "anonymous");
        imgNode.setAttribute("src", work.imageUrl);
        imgNode.alt = work.title;
        const captionNode = document.createElement("figcaption");
        captionNode.textContent = work.title;
        galleryRef.appendChild(figureNode);
        figureNode.append(imgNode, captionNode);
    }
}

export function showFilteredWorks(filteredWorks) {
    const galleryRef = document.querySelector('.gallery');
    galleryRef.innerHTML = ''; // Clear existing content

    filteredWorks.forEach(work => {
        const figureNode = document.createElement('figure');
        const imgNode = document.createElement('img');
        imgNode.setAttribute('src', work.imageUrl);
        imgNode.setAttribute('alt', work.title);
        const captionNode = document.createElement('figcaption');
        captionNode.textContent = work.title;

        figureNode.appendChild(imgNode);
        figureNode.appendChild(captionNode);
        galleryRef.appendChild(figureNode);
    });
}

export function applyWorkFilter(evt, worksDataset) {
    const selectedCategory = evt.target.textContent;
    const worksFiltered = selectedCategory === 'Tous' ? worksDataset : worksDataset.filter(work => work.category.name === selectedCategory);
    showFilteredWorks(worksFiltered);
}

export async function generateFilterButtons(worksDataset) {
    const categoriesList = ['Tous', ...new Set(worksDataset.map(work => work.category.name))];
    const filterWrapper = document.createElement('div');
    filterWrapper.id = 'container-filters';

    categoriesList.forEach(category => {
        const buttonNode = document.createElement('button');
        buttonNode.classList.add('button-filter');
        buttonNode.textContent = category;
        buttonNode.addEventListener('click', (evt) => applyWorkFilter(evt, worksDataset));
        filterWrapper.appendChild(buttonNode);
    });

    const portfolioRef = document.getElementById('portfolio');
    const galleryRef = document.getElementsByClassName('gallery').item(0);
    portfolioRef.insertBefore(filterWrapper, galleryRef);
}
