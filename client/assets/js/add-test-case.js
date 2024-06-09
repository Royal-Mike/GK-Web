document.addEventListener("DOMContentLoaded", function () {
    const testcasePopup = document.getElementById("customTestcasePopup");
    const createBtn = document.getElementById("save-testcase-btn");
    const cancelBtn = document.getElementById("cancel-testcase-btn");
    const addTestcaseBtn = document.getElementById("add-testcase-btn"); // Đã sửa tên biến ở đây
    const successMessage = document.getElementById("successMessage");

    cancelBtn.addEventListener("click", function () {
        closePopup();
    });

    addTestcaseBtn.addEventListener("click", function () { // Đã sửa sự kiện lắng nghe ở đây
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

    createBtn.addEventListener("click", async function () {
        const testcaseName = document.getElementById('testcase-name').value;
        const testcaseDescription = document.getElementById('testcase-description').value;

        try {
            const response = await fetch('/{{project.id}}/test-case/create', {
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
            console.log('New testcase created:', data.testcase);
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
