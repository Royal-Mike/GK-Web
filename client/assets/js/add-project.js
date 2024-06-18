document.addEventListener("DOMContentLoaded", function () {
    const projectPopup = document.getElementById("customProjectPopup");
    const createBtn = document.getElementById("customCreateProject");
    const cancelBtn = projectPopup.querySelector(".cancel-btn");
    const addProjectBtn = document.getElementById("add-project");
    const successMessage = document.getElementById("successMessage");
    const projectContainer = document.querySelector('.row.p-5'); // Container to append new projects

    function handlePageShow(event) {
        // Check if the page is being loaded from the bfcache
        if (event.persisted) {
            // Perform actions you want when the page is shown again
            console.log('Page is being shown from bfcache.');
            // Example: Reload the page or refresh data
            location.reload(); // This will reload the entire page
            // Add logic here to refresh specific parts of the page if needed
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

                    // Show success message
                    successMessage.style.display = "block";
                    setTimeout(function () {
                        successMessage.style.display = "none";
                    }, 3000);

                    // Append new project to the UI
                    const projectHtml = `
                      <div class="col-lg-3 col-md-4 col-sm-6 mb-3 project-item" data-created-at="${response.project.created_at}">
                        <a href="/project/${response.project.id}" class="nav-link text-dark" aria-current="page">
                          <div class="bg-white">
                            <div class="card">
                              <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center w-100">
                                  <div class="d-flex align-items-center justify-content-start w-100">
                                    <img src="https://cdn.qatouch.com/assets/images/qatouch-favicon-color-1.png" width="40px" height="40px"/>
                                    <div class="p-2 flex-grow-1" style="min-width: 0;">
                                    <h4 class="card-title text-truncate" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                        ${response.project.name_project}
                                    </h4>
                                    <p style="font-size: 0.75rem">Created on ${formatDate(response.project.created_at)}</p>
                                    <p style="font-size: 0.75rem">Created by <b>Hoàng</b></p>
                                    </div>
                                  </div>
                                </div>
                                  <style>
                                    .enc-id-con {
                                      padding-bottom: 15px;
                                      border-bottom: 1px solid #f2f8ff;
                                      display: inline-flex;
                                      align-items: center;
                                      justify-content: space-between;
                                      width: 100%;
                                    }
                                    .key {
                                      box-shadow: 0px 0px 5px 0px rgb(0 0 0 / 29%);
                                      text-align: left;
                                      border-radius: 30px;
                                      background: #f2f0ff;
                                      padding: 2px 25px;
                                      font-size: 0.75rem;
                                      font-weight: 500;
                                    }
                                  </style>
                                  <div class="enc-id-con">
                                    <p>Project Key</p>
                                    <p class="key" style="color: rgb(77, 0, 174)">Mglx</p>
                                  </div>
                                  <hr/>
                                  <div class="row">
                                    <div class="col" style="font-size: 0.8rem">
                                      Test Cases<br/>1
                                    </div>
                                    <div class="col" style="font-size: 0.8rem">
                                      Test Runs<br/>1
                                    </div>
                                    <div class="col" style="font-size: 0.8rem">
                                      Issues<br/>1
                                    </div>
                                  </div>
                                  <hr/>
                              <div class="d-flex justify-content-end">
                                <button type="button" class="btn btn-primary" style="background-color: #034f75">
                                  <i class="bi bi-person-plus"></i>
                                </button>
                                </div>
                            </div>
                            </div>
                        </div>
                        </a>
                    </div>
                    `;
                    projectContainer.insertAdjacentHTML('beforeend', projectHtml);

                    // Close the popup and clear the form fields
                    closePopup();
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