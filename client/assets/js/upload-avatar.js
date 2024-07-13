document.addEventListener("DOMContentLoaded", function () {
    const openAvatarPopupButton = document.getElementById('open-avatar-popup');
    const avatarPopup = document.getElementById('avatarPopup');
    const avatarFileInput = document.getElementById('avatarFileInput');
    const saveAvatarButton = document.getElementById('customSaveAvatar');
    const cancelPopupButton = document.querySelector('.cancel-btn');

    function closePopup() {
        avatarPopup.style.display = "none";
    }

    // Function to show the project popup
    function showPopup() {
        avatarPopup.style.display = "block";
    }
    openAvatarPopupButton.addEventListener("click", showPopup);

    cancelPopupButton.addEventListener('click', closePopup);

    saveAvatarButton.addEventListener('click', function () {
        const file = avatarFileInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);

            fetch('/profile/upload-avatar', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        document.getElementById('user-avatar').src = data.avatarUrl;
                        closePopup();
                        //showToast('Avatar updated successfully.');
                    } else {
                        showToast('Failed to update avatar.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showToast('An error occurred while uploading the avatar.');
                });
        }
    });
});
