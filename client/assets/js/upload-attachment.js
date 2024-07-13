document.addEventListener("DOMContentLoaded", function () {
    const openAttachmentPopupButton = document.getElementById('open-attachment-popup');
    const attachmentPopup = document.getElementById('attachmentPopup');
    const attachmentFileInput = document.getElementById('attachmentFileInput');
    const saveAttachmentButton = document.getElementById('customSaveAttachment');
    const cancelPopupButton = document.querySelector('.cancel-btn');

    function closePopup() {
        attachmentPopup.style.display = "none";
    }

    // Function to show the project popup
    function showPopup() {
        attachmentPopup.style.display = "block";
    }
    openAttachmentPopupButton.addEventListener("click", showPopup);

    cancelPopupButton.addEventListener('click', closePopup);
    function getProjectIdFromURL() {
        const pathArray = window.location.pathname.split('/');
        const projectId = pathArray[2];
        return projectId;
    }
    saveAttachmentButton.addEventListener('click', async function () { 
        const projectId = getProjectIdFromURL();
        const file = attachmentFileInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('data_link', file);

            try {
                const response = await fetch(`/project/${projectId}/attachment/upload`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to upload attachment');
                }

                const data = await response.json();

                // Show toast with success message
                showToast('Attachment uploaded successfully!');

                // Close the popup after successful upload
                closePopup();

                // Reload the page or perform other actions as needed
                window.location.reload();
            } catch (error) {
                console.error('Error uploading attachment:', error.message);
                // Handle the error here
                showToast('Error uploading attachment. Please try again.');
            }
        }
    });
});
