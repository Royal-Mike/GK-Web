document.addEventListener("DOMContentLoaded", function () {
    const testcasePopup = document.getElementById("customTestrunPopup");
    const createBtn = document.getElementById("save-testcase-btn");
    const cancelBtn = document.getElementById("cancel-testcase-btn");
    const addTestcaseBtn = document.getElementById("add-testrun-btn"); 
    const successMessage = document.getElementById("successMessage");

    cancelBtn.addEventListener("click", function () {
        closePopup();
    });

    addTestcaseBtn.addEventListener("click", function () { 
        showPopup();
    });

    function closePopup() {
        testcasePopup.style.display = "none";
        document.getElementById('testcase-name').value = "";
        document.getElementById('testcase-description').value = "";
        // Reset các giá trị khác nếu cần
    }

    function showPopup() {
        testcasePopup.style.display = "block";
    }

    function getProjectIdFromURL() {
        const pathArray = window.location.pathname.split('/');
        const projectId = pathArray[2]; 
        return projectId;
    }

    createBtn.addEventListener("click", async function () {
        const testcaseName = document.getElementById('testcase-name').value;
        const testcaseDescription = document.getElementById('testcase-description').value;
        const projectId = getProjectIdFromURL();
        try {
            const response = await fetch(`/project/${projectId}/test-case/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: testcaseName, description: testcaseDescription })
            });

            if (!response.ok) {
                throw new Error('Failed to create testcase');
            }

            const data = await response.json();
            
            successMessage.style.display = "block";
            setTimeout(function () {
                successMessage.style.display = "none";
            }, 3000);
            closePopup(); // Đóng cửa sổ popup sau khi tạo thành công
        } catch (error) {
            console.error('Error creating testcase:', error.message);
            // Xử lý lỗi ở đây
        }
    });
});
