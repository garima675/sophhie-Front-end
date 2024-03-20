// API URLs
export const apiCategories = "http://localhost:5678/api/categories";
export const apiWorks = "http://localhost:5678/api/works";
export const apiLogin = "http://localhost:5678/api/users/login";

// Function to fetch data from API
export async function fetchWorksDataAPICall() {
    const fetchResponse = await fetch(apiWorks);
    if (!fetchResponse.ok) {
        throw new Error('Network response was not ok');
    }
    return fetchResponse.json();
}

// function to delete works data using api
export function deleteWorksByIdAPICall(workId) {
    fetch(`${apiWorks}/${workId}`, {
        method: "DELETE",
        headers: {
            "content-type": "application/Json",
            authorization: "Bearer " + sessionStorage.getItem("token"),
        },
    }).then((fetchResponse) => {
        if (fetchResponse.status === 200) {
            const targetElement = document.getElementById(workId);
            if (targetElement) {
                targetElement.parentNode.removeChild(targetElement);
            }
        }
    });
}

//Login api call
export async function loginUserAPICall(credentials) {
    const response = await fetch(apiLogin, {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
    }
    return response.json();
}

//Add work api call
export async function addWorkAPICall(workData, userToken) {
    const response = await fetch(apiWorks, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userToken}`,
        },
        body: workData,
    });

    return response; // Return the fetch response for further processing.
}

// Fetch Categories
export async function fetchCategoriesAPICall() {
    const response = await fetch(apiCategories);
    if (!response.ok) {
        throw new Error('Failed to fetch categories: ' + response.statusText);
    }
    return response.json();
}
