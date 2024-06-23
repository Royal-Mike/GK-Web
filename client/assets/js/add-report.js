document.addEventListener("DOMContentLoaded", function () {
    const reportPopup = document.getElementById("customReportPopup");
    const saveReportBtn = document.getElementById("save-report-btn");
    const cancelReportBtn = document.getElementById("cancel-report-btn");
    const closeReportBtn = document.getElementById("close-report-btn");
    const addReportBtn = document.getElementById("add-report-btn");

    function closePopup() {
        reportPopup.style.display = "none";
    }

    function showPopup() {
        reportPopup.style.display = "block";
    }

    addReportBtn.addEventListener("click", showPopup);

    function getProjectIdFromURL() {
        const pathArray = window.location.pathname.split('/');
        const projectId = pathArray[2]; 
        return projectId;
    }
    
    saveReportBtn.addEventListener("click", async function () {
        const title = document.querySelector('input[aria-label="title"]').value;
        const type = document.querySelector('input[aria-label="status"]').value;
        const duration = document.querySelector('input[aria-label="duration"]').value;
        const description = document.querySelector('textarea').value;
        const relatedProjectId = getProjectIdFromURL(); // Assuming the project ID is in the URL

        const reportData = {
            name: title,
            description: description,
            created_by_user_id: 1, // Replace with actual user ID
            related_test_case_id: 1, // Replace with actual test case ID
            related_test_run_id: 1, // Replace with actual test run ID
            related_project_id: relatedProjectId,
            created_at: duration
        };

        try {
            const response = await fetch('/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reportData)
            });

            if (!response.ok) {
                throw new Error('Failed to create report');
            }

            closePopup();
            showToast("Save successfully!!!");
            window.location.reload(); // Reload the page to reflect the new report
        } catch (error) {
            console.error('Error creating report:', error.message);
            showToast('Error saving report');
        }
    });

    cancelReportBtn.addEventListener("click", closePopup);

    closeReportBtn.addEventListener("click", closePopup);

    function showToast(message) {
        const toast = document.createElement('div');
        toast.classList.add('toast', 'align-items-center', 'text-white', 'bg-primary', 'fade');
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');

        toast.innerHTML = `
            <div class="toast-body">
                ${message}
            </div>
        `;

        document.body.appendChild(toast);

        $(toast).toast('show');

        setTimeout(function () {
            $(toast).toast('hide');
            setTimeout(function () {
                toast.remove();
            }, 500);
        }, 3000);
    }
});
