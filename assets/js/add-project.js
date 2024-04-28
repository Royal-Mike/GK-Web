document.addEventListener("DOMContentLoaded", function () {

    const projectPopup = document.getElementById("customProjectPopup");
    const createBtn = document.getElementById("customCreateProject");
    const cancelBtn = projectPopup.querySelector(".cancel-btn");
    const addProjectBtn = document.getElementById("add-project");


    createBtn.addEventListener("click", function () {

        const projectName = projectPopup.querySelector('input[name="project-name"]').value;




        alert("Dự án đã được tạo thành công: " + projectName);


        closePopup();
    });

    cancelBtn.addEventListener("click", function () {
        // Đóng popup
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
});