
function getProjectIdFromURL() {
    const pathArray = window.location.pathname.split('/');
    const projectId = pathArray[2];
    return projectId;
}
function deleteRequirement(id) {
    if (confirm('Are you sure you want to delete this Requirement?')) {
        const projectId = getProjectIdFromURL();
        fetch(`/project/${projectId}/requirement/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    // Remove the requirement item from the DOM
                    document.querySelector(`.requirement-item[data-id="${id}"]`).remove();
                    showToast('Requirement deleted successfully.');
                } else {
                    showToast('Failed to delete requirement.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('Failed to delete requirement.');
            });
    }
}
