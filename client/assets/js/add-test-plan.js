document.addEventListener("DOMContentLoaded", function () {
    const testplanPopup = document.getElementById("customTestplanPopup");
    const createBtn = document.getElementById("save-testplan-btn");
    const cancelBtn = document.getElementById("cancel-testplan-btn");
    const addTestplanBtn = document.getElementById("add-testplan-btn"); 
    const successMessage = document.getElementById("successMessage");

    cancelBtn.addEventListener("click", function () {
        closePopup();
    });

    addTestplanBtn.addEventListener("click", function () { 
        showPopup();
    });

    function closePopup() {
        testplanPopup.style.display = "none";
        document.getElementById('testplan-name').value = "";
        document.getElementById('testplan-description').value = "";
        // Reset các giá trị khác nếu cần
    }

    function showPopup() {
        testplanPopup.style.display = "block";
    }

    function getProjectIdFromURL() {
        const pathArray = window.location.pathname.split('/');
        const projectId = pathArray[2]; 
        return projectId;
    }

    createBtn.addEventListener("click", async function () {
        const testplanName = document.getElementById('testplan-name').value;
        const testplanDescription = document.getElementById('testplan-description').value;
        const projectId = getProjectIdFromURL();

        if (testplanName === '') {
            alert('Test plan name is required.');
            return;
        }

        try {
            const response = await fetch(`/project/${projectId}/test-plan/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: testplanName, description: testplanDescription })
            });

            if (!response.ok) {
                throw new Error('Failed to create testplan');
            }

            const data = await response.json();
            
            successMessage.style.display = "block";
            setTimeout(function () {
                successMessage.style.display = "none";
            }, 3000);
            closePopup(); // Đóng cửa sổ popup sau khi tạo thành công
            window.location.reload();
        } catch (error) {
            showToast('Error creating testplan:', error.message);
            // Xử lý lỗi ở đây
        }
    });
});
