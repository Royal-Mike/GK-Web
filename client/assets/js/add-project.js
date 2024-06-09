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
        document.getElementById('project-name').value = "";
    }

    function showPopup() {
        projectPopup.style.display = "block";
    }

    createBtn.addEventListener("click", async function () {
        const projectName = document.getElementById('project-name').value;
        const projectDescription = document.getElementById('project-description').value;
    
        try {
            const response = await fetch('/project/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: projectName, description: projectDescription })
            });
    
            if (!response.ok) {
                throw new Error('Failed to create project');
            }
    
            const data = await response.json();
            console.log('New project created:', data.project);
            successMessage.style.display = "block";
            setTimeout(function () {
                successMessage.style.display = "none";
            }, 3000);
            closePopup(); // Đóng cửa sổ popup sau khi tạo thành công
        } catch (error) {
            console.error('Error creating project:', error.message);
            // Xử lý lỗi ở đây
        }
    });
});