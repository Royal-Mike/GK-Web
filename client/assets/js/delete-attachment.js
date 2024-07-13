
function getProjectIdFromURL() {
    const pathArray = window.location.pathname.split('/');
    const projectId = pathArray[2];
    return projectId;
}
function deleteAttachment(id) {
    if (confirm('Are you sure you want to delete this attachment?')) {
        const projectId = getProjectIdFromURL();
        fetch(`/project/${projectId}/attachment/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    // Remove the attachment item from the DOM
                    document.querySelector(`.attachment-item[data-id="${id}"]`).remove();
                    showToast('Attachment deleted successfully.');
                } else {
                    showToast('Failed to delete attachment.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('Failed to delete attachment.');
            });
    }
}
