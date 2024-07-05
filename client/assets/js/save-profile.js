document.addEventListener('DOMContentLoaded', function () {
    // Lắng nghe sự kiện click vào nút "Save"
    document.getElementById('btn-save-profile').addEventListener('click', function (event) {
        event.preventDefault();

        // Lấy giá trị từ các ô input
        var firstName = document.getElementById('first-name').value;
        var lastName = document.getElementById('last-name').value;
        var headline = document.getElementById('headline').value;
        var language = document.getElementById('language').value;
        var link = document.getElementById('link').value;
        var avatar = document.getElementById('user-avatar').src;

        // Tạo object chứa dữ liệu cập nhật
        var data = {
            firstName: firstName,
            lastName: lastName,
            headline: headline,
            language: language,
            link: link,
            avatar: avatar
        };

        // Gửi AJAX request để cập nhật thông tin lên server
        fetch('/profile/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Cập nhật thành công, hiển thị thông báo
                    showToast("Profile has been updated successfully.");
                } else {
                    // Xử lý lỗi nếu có
                    showToast("Failed to update profile. Please try again.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast("An error occurred while updating profile.");
            });
    });
});
