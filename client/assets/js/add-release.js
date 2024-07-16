document.addEventListener("DOMContentLoaded", function () {
    const releasePopup = document.getElementById("customReleasePopup");
    const createBtn = document.getElementById("customCreateRelease");
    const cancelBtn = releasePopup.querySelector(".cancel-btn");
    const addReleaseBtn = document.getElementById("add-release");
    const successMessage = document.getElementById("successMessage");

    cancelBtn.addEventListener("click", function () {
        closePopup();
    });

    // Function to close the project popup
    function closePopup() {
        releasePopup.style.display = "none";
        document.getElementById('name').value = "";
    }

    // Function to show the project popup
    function showPopup() {
        releasePopup.style.display = "block";
    }

    // Event listener for clicking "Add Project" button
    addReleaseBtn.addEventListener("click", showPopup);

    function getProjectIdFromURL() {
        const pathArray = window.location.pathname.split('/');
        const projectId = pathArray[2];
        return projectId;
    }

    createBtn.addEventListener("click", async function () {
        const releaseName = document.getElementById('release-name').value;
        const releaseStart = document.getElementById('start-date').value;
        const releaseEnd = document.getElementById('end-date').value;
        const description = document.getElementById('description').value;

        const projectId = getProjectIdFromURL();
    
        if (releaseName === '') {
            alert('Release name is required.');
            return;
        }
    
        try {
            const response = await fetch(`/project/${projectId}/release/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: releaseName, start: releaseStart, end: releaseEnd, description: description })
            });
    
            if (!response.ok) {
                throw new Error('Failed to create release');
            }
                
            successMessage.style.display = "block";
            setTimeout(function () {
                successMessage.style.display = "none";
                window.location.reload();
                closePopup(); // Đóng cửa sổ popup sau khi tạo thành công
            }, 3000);
        } catch (error) {
            console.error('Error creating release:', error.message);
            // Xử lý lỗi ở đây
        }
    });
    

    // Event listener for clicking "Cancel" button inside the popup
    cancelBtn.addEventListener("click", closePopup);
});