document.addEventListener("DOMContentLoaded", function () {
    const projectPopup = document.getElementById("customProjectPopup");
    const createBtn = document.getElementById("customCreateProject");
    const cancelBtn = projectPopup.querySelector(".cancel-btn");
    const addProjectBtn = document.getElementById("add-project");
    const successMessage = document.getElementById("successMessage");
    const projectContainer = document.querySelector('.row.p-5'); // Container to append new projects

    function handlePageShow(event) {
        if (event.persisted) {
            console.log('Page is being shown from bfcache.');
            location.reload(); // This will reload the entire page
        }
    }

    // Add pageshow event listener to the window object
    window.addEventListener('pageshow', handlePageShow);

    // Function to close the project popup
    function closePopup() {
        projectPopup.style.display = "none";
        document.getElementById('project-name').value = "";
        document.getElementById('project-description').value = "";
    }

    // Function to show the project popup
    function showPopup() {
        projectPopup.style.display = "block";
    }

    // Function to format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Event listener for clicking "Add Project" button
    addProjectBtn.addEventListener("click", showPopup);

    // Event listener for clicking "Create" button inside the popup
    createBtn.addEventListener("click", function () {
        const projectName = document.getElementById('project-name').value.trim();
        const projectDescription = document.getElementById('project-description').value.trim();

        if (projectName === '') {
            alert('Project name is required.');
            return;
        }

        // AJAX request to create a new project
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/project/create');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 201) {
                    const response = JSON.parse(xhr.responseText);
                    console.log('New project created:', response.project);

                    // Reload the page
                    location.reload();

                } else {
                    console.error('Failed to create project');
                    alert('An error occurred while creating the project. Please try again.');
                }
            }
        };

        // Send JSON data as the request body
        xhr.send(JSON.stringify({ name: projectName, description: projectDescription }));
    });

    // Event listener for clicking "Cancel" button inside the popup
    cancelBtn.addEventListener("click", closePopup);
});