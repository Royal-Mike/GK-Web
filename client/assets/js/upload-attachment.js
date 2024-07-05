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

    saveAttachmentButton.addEventListener('click', function () {
        const projectId = getProjectIdFromURL();
        const file = attachmentFileInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('attachment', file);

            try {
                const response = await fetch(`/project/${projectId}/attachment/upload`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to upload attachment');
                }

                const data = await response.json();

                successMessage.style.display = "block";
                setTimeout(function () {
                    successMessage.style.display = "none";
                }, 3000);
                closePopup(); // Đóng cửa sổ popup sau khi tạo thành công
                window.location.reload();
            } catch (error) {
                console.error('Error uploading attachment:', error.message);
                // Xử lý lỗi ở đây
            }
        }
    });
});
