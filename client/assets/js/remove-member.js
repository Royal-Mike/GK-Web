document.addEventListener("DOMContentLoaded", function() {
    const removeMemberElements = document.querySelectorAll('.remove-member');

    removeMemberElements.forEach(element => {
        element.addEventListener('click', async function() {
            const userId = this.getAttribute('data-user-id');
            const projectId = this.getAttribute('data-project-id');

            try {
                const response = await fetch(`/project/${projectId}/remove-member`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId, projectId })
                });

                if (response.ok) {
                    // Optionally, refresh the page or remove the element from the DOM
                    location.reload(); // Reload the page to reflect changes
                } else {
                    console.error('Failed to remove member');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });

});