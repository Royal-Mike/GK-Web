document.addEventListener("DOMContentLoaded", function () {
    const testcasePopup = document.getElementById("customTestrunPopup");
    const createBtn = document.getElementById("save-testrun-btn");
    const cancelBtn = document.getElementById("cancel-testrun-btn");
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
        const name = document.getElementById('test-run-name').value;
        const testCaseId = document.getElementById('testcase-select').value;
        const assignedToUserId = document.getElementById('user-select').value;
        const releaseDescription = document.getElementById('release-description').value;

        const data = {
            name: name,
            test_case_id: testCaseId,
            assigned_to_user_id: assignedToUserId,
            release_description: releaseDescription
        };

        const projectId = getProjectIdFromURL();

        try {
            const response = await fetch(`/project/${projectId}/test-run/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to create test run');
            }

            successMessage.style.display = "block";
            setTimeout(function () {
                successMessage.style.display = "none";
            }, 3000);

            window.location.reload();

            closePopup(); // Đóng cửa sổ popup sau khi tạo thành công
        } catch (error) {
            console.error('Error creating test run:', error.message);
            // Xử lý lỗi ở đây
        }
    });




});
