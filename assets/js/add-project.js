document.addEventListener("DOMContentLoaded", function () {
    const projectPopup = document.getElementById("customProjectPopup");
    const createBtn = document.getElementById("customCreateProject");
    const cancelBtn = projectPopup.querySelector(".cancel-btn");
    const addProjectBtn = document.getElementById("add-project");
    const successMessage = document.getElementById("successMessage");



    cancelBtn.addEventListener("click", function () {
        closePopup();
    });

    addProjectBtn.addEventListener("click", function () {
        showPopup();
    });

    function closePopup() {
        projectPopup.style.display = "none";
        projectPopup.querySelector('input[name="project-name"]').value = "";
    }

    function showPopup() {
        projectPopup.style.display = "block";
    }

    const saveBtn = document.querySelector('.save-btn');
    saveBtn.addEventListener("click", function () {
        projectPopup.style.display = "none";
        successMessage.style.display = "block";
        setTimeout(function () {
            successMessage.style.display = "none";
        }, 3000);
    });
});
