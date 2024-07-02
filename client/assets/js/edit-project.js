document.addEventListener("DOMContentLoaded", function () {
    const projectPopup = document.getElementById("customProjectPopup");
    const updateBtn = document.getElementById("customEditProject");
    const cancelBtn = projectPopup.querySelector(".cancel-btn");
    const editProjectBtn = document.getElementById("edit-project");
    const projectNameInput = document.getElementById('project-name');
    const projectDescriptionInput = document.getElementById('project-description');

    let initialProjectName = projectNameInput.value;
    let initialProjectDescription = projectDescriptionInput.value;

    function closePopup() {
        projectPopup.style.display = "none";
        projectNameInput.value = initialProjectName;
        projectDescriptionInput.value = initialProjectDescription;
    }

    function showPopup() {
        projectPopup.style.display = "block";
    }

    editProjectBtn.addEventListener("click", showPopup);

    updateBtn.addEventListener("click", function () {
        const projectName = document.getElementById('project-name').value.trim();
        const projectDescription = document.getElementById('project-description').value.trim();

        if (projectName === '') {
            alert('Project name is required.');
            return;
        }

        // Get the project ID from the URL
        const url = new URL(window.location.href);
        const projectId = url.pathname.split('/')[2];

        // AJAX request to update the project
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `/project/${projectId}/update`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 201) {
                    const response = JSON.parse(xhr.responseText);
                    console.log('Project updated:', response.project);

                    // Reload the page
                    location.reload();
                } else {
                    console.error('Failed to update project');
                    alert('An error occurred while updating the project. Please try again.');
                }
            }
        };

        // Send JSON data as the request body
        xhr.send(JSON.stringify({ name: projectName, description: projectDescription }));
    });

    cancelBtn.addEventListener("click", closePopup);
});