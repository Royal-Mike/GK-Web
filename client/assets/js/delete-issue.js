document.addEventListener('DOMContentLoaded', function () {
    function getProjectIdFromURL() {
        const pathArray = window.location.pathname.split('/');
        const projectId = pathArray[2];
        return projectId;
    }

    document.querySelectorAll('.bi-trash').forEach(trashIcon => {
        trashIcon.addEventListener('click', function () {
            const issueId = this.getAttribute('data-id');
            const projectId = getProjectIdFromURL();

            if (confirm('Are you sure you want to delete this issue?')) {
                const xhr = new XMLHttpRequest();
                xhr.open('DELETE', `/project/${projectId}/issues/delete`, true);
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

                xhr.onload = function () {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        if (response.message === 'Issue deleted successfully') {
                            // Remove the deleted test case from the table or refresh the page
                            showToast('Issue deleted successfully');
                            window.location.reload(); // This reloads the page to reflect the changes
                        } else {
                            showToast('Error deleting issue: ' + response.message);
                        }
                    } else {
                        console.error('Error deleting issue:', xhr.responseText);
                    }
                };

                xhr.onerror = function () {
                    console.error('Request failed');
                };

                xhr.send(JSON.stringify({ issueId }));
            }
        });
    });
});
