document.addEventListener('DOMContentLoaded', function () {
    const editButtons = document.querySelectorAll('.edit-release');
    const editReleaseForm = document.getElementById('editReleaseForm');
    const saveChangesBtn = document.getElementById('customEditRelease');
    const cancelBtn = document.querySelector('.cancel-edit-btn')
    // Function to close the edit form
    function closePopup() {
        editReleaseForm.style.display = 'none';
    }

    // Hàm chuyển đổi định dạng ngày tháng
    function formatDate(dateString) {
        if (!dateString) return ''; // Xử lý trường hợp dateString là null hoặc undefined
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate().toString();
        
        // Đảm bảo rằng month và day luôn có định dạng 2 chữ số
        if (month.length === 1) month = '0' + month;
        if (day.length === 1) day = '0' + day;

        return `${year}-${month}-${day}`;
    }

    // Event listeners for edit buttons
    editButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            // Retrieve release information from data attributes
            
            const releaseId = button.getAttribute('data-release-id');
            saveChangesBtn.setAttribute('data-release-id', releaseId);

            const releaseName = button.getAttribute('data-release-name');
            const releaseStart = button.getAttribute('data-release-start');
            const releaseEnd = button.getAttribute('data-release-end');
            const releaseDescription = button.getAttribute('data-release-description');

            // Populate edit form with release information
            document.getElementById('edit-release-name').value = releaseName;
            document.getElementById('edit-start-date').value = formatDate(releaseStart); // Sử dụng hàm formatDate để chuyển đổi định dạng
            document.getElementById('edit-end-date').value = formatDate(releaseEnd); // Sử dụng hàm formatDate để chuyển đổi định dạng
            document.getElementById('edit-description').value = releaseDescription;

            // Display edit form
            editReleaseForm.style.display = 'block';
        });
    });

    function getProjectIdFromURL() {
        const pathArray = window.location.pathname.split('/');
        const projectId = pathArray[2];
        return projectId;
    }

    // Event listener for Save Changes button
    saveChangesBtn.addEventListener('click', async function () {
        const releaseId = saveChangesBtn.getAttribute('data-release-id');
        const projectId = getProjectIdFromURL();

        const updatedRelease = {
            name: document.getElementById('edit-release-name').value,
            start_at: document.getElementById('edit-start-date').value,
            released_at: document.getElementById('edit-end-date').value,
            description: document.getElementById('edit-description').value
        };
    
        try {
            // Gửi yêu cầu cập nhật release đến server
            const response = await fetch(`/project/${projectId}/release/${releaseId}/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedRelease)
            });
    
            if (!response.ok) {
                throw new Error('Failed to update release');
            }
    
            // Hiển thị thông báo thành công
            document.getElementById('successMessage').style.display = 'block';
    
            // Tắt form chỉnh sửa và reload trang (hoặc cập nhật lại dữ liệu)
            editReleaseForm.style.display = 'none';
            window.location.reload();
    
        } catch (error) {
            console.error('Error updating release:', error.message);
            // Hiển thị thông báo lỗi cho người dùng nếu cập nhật không thành công
        }
    });

    // Event listener for Cancel button
    cancelBtn.addEventListener('click', closePopup);
});
