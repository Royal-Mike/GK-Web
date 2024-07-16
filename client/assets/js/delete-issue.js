document.addEventListener('DOMContentLoaded', function () {
    function getProjectIdFromURL() {
        const pathArray = window.location.pathname.split('/');
        const projectId = pathArray[2];
        return projectId;
    }

    document.querySelectorAll('.bi-trash').forEach(trashIcon => {
        trashIcon.addEventListener('click', function () {
            const testCaseId = this.getAttribute('data-id');
            const projectId = getProjectIdFromURL();

            if (confirm('Are you sure you want to delete this test case?')) {
                const xhr = new XMLHttpRequest();
                xhr.open('DELETE', `/project/${projectId}/issues/delete`, true);
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

                xhr.onload = function () {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        if (response.message === 'Test case deleted successfully') {
                            // Remove the deleted test case from the table or refresh the page
                            showToast('Test case deleted successfully');
                            window.location.reload(); // This reloads the page to reflect the changes
                        } else {
                            showToast('Error deleting test case: ' + response.message);
                        }
                    } else {
                        console.error('Error deleting test case:', xhr.responseText);
                    }
                };

                xhr.onerror = function () {
                    console.error('Request failed');
                };

                xhr.send(JSON.stringify({ testCaseId }));
            }
        });
    });
});
