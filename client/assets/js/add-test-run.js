document.addEventListener("DOMContentLoaded", function () {
    const testrunPopup = document.getElementById("customTestrunPopup");
    const createBtn = document.getElementById("save-testrun-btn");
    const cancelBtn = document.getElementById("cancel-testrun-btn");
    const addTestrunBtn = document.getElementById("add-testrun-btn");
    const successMessage = document.getElementById("successMessage");

    cancelBtn.addEventListener("click", function () {
        closePopup();
    });

    addTestrunBtn.addEventListener("click", function () {
        showPopup();
    });

    function closePopup() {
        testrunPopup.style.display = "none";
    }

    function showPopup() {
        testrunPopup.style.display = "block";
    }

    function getProjectIdFromURL() {
        const pathArray = window.location.pathname.split('/');
        const projectId = pathArray[2];
        return projectId;
    }

    createBtn.addEventListener("click", async function () {
        const name = document.getElementById('test-run-name').value;
        const testPlanId = document.getElementById('testplan-select').value;
        const testCaseId = document.getElementById('testcase-select').value;
        const issueId = document.getElementById('issue-select').value;
        const assignedToUserId = document.getElementById('user-select').value;
        const releaseId = document.getElementById('release-select').value;

        const data = {
            name: name,
            test_plan_id: testPlanId,
            test_case_id: testCaseId,
            issue_id: issueId,
            assigned_to_user_id: assignedToUserId,
            release_id: releaseId
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
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create test run');
            }

            showToast('Test run added successfully!');

            window.location.reload();

            closePopup(); // Close the popup after successful creation
        } catch (error) {
            showToast('Error creating test run: ' + error.message);
        }
    });




});
