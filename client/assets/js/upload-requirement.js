document.addEventListener("DOMContentLoaded", function () {
    const openRequirementPopupButton = document.getElementById('open-requirement-popup');
    const requirementPopup = document.getElementById('requirementPopup');
    const requirementFileInput = document.getElementById('requirementFileInput');
    const saveRequirementButton = document.getElementById('customSaveRequirement');
    const cancelPopupButton = document.querySelector('.cancel-btn');

    function closePopup() {
        requirementPopup.style.display = "none";
    }

    // Function to show the project popup
    function showPopup() {
        requirementPopup.style.display = "block";
    }
    openRequirementPopupButton.addEventListener("click", showPopup);

    cancelPopupButton.addEventListener('click', closePopup);
    function getProjectIdFromURL() {
        const pathArray = window.location.pathname.split('/');
        const projectId = pathArray[2];
        return projectId;
    }
    saveRequirementButton.addEventListener('click', async function () { 
        const projectId = getProjectIdFromURL();
        const file = requirementFileInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('data_link', file);

            try {
                const response = await fetch(`/project/${projectId}/requirement/upload`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to upload requirement');
                }

                const data = await response.json();

                // Show toast with success message
                showToast('Requirement uploaded successfully!');

                // Close the popup after successful upload
                closePopup();

                // Reload the page or perform other actions as needed
                window.location.reload();
            } catch (error) {
                console.error('Error uploading requirement:', error.message);
                // Handle the error here
                showToast('Error uploading requirement ', error.message);
            }
        }
    });
});
