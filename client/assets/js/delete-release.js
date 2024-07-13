document.addEventListener("DOMContentLoaded", function () {
    const deleteButtons = document.querySelectorAll(".delete-release");

    function getProjectIdFromURL() {
        const pathArray = window.location.pathname.split('/');
        const projectId = pathArray[2];
        return projectId;
    }

    deleteButtons.forEach(button => {
        button.addEventListener("click", async function () {
            const releaseId = button.dataset.releaseId;
            const projectId = getProjectIdFromURL();


            try {
                const response = await fetch(`/project/${projectId}/release/${releaseId}/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete release');
                }

                window.location.reload();

            } catch (error) {
                console.error('Error deleting release:', error.message);
            }
        });
    });
});


