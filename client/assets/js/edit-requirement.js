document.addEventListener('DOMContentLoaded', function () {

    function getProjectIdFromURL() {
        const pathArray = window.location.pathname.split('/');
        const projectId = pathArray[2];
        return projectId;
    }
    function showRequirementContent(id, dataLink, filename) {
        fetch(dataLink)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch file content');
                }
                return response.text();
            })
            .then(fileContent => {
                const content = `
                <h5>${filename}</h5>
                <div id="requirementButtons">
                    <button class="btn btn-primary mb-2 me-2" id="editRequirementButton">Edit</button>
                    <button class="btn btn-success mb-2 me-2" id="saveRequirementButton" style="display: none;">Save</button>
                    <button class="btn btn-secondary mb-2" id="cancelEditRequirementButton" style="display: none;">Cancel</button>
                </div>
                <textarea id="requirementTextarea" class="form-control" style="margin-top: 10px; width:100%; height:500px" readonly>${fileContent}</textarea>`;

                document.getElementById('requirementContent').innerHTML = content;

                // Get references to edit, save, and cancel buttons
                const editButton = document.getElementById('editRequirementButton');
                const saveButton = document.getElementById('saveRequirementButton');
                const cancelButton = document.getElementById('cancelEditRequirementButton');
                const textarea = document.getElementById('requirementTextarea');

                // Event listener for edit button
                editButton.addEventListener('click', function () {
                    // Enable edit mode
                    textarea.removeAttribute('readonly');
                    editButton.style.display = 'none';
                    saveButton.style.display = 'inline-block';
                    cancelButton.style.display = 'inline-block';
                });

                // Event listener for save button
                saveButton.addEventListener('click', function () {
                    // Save changes to server
                    const updatedContent = textarea.value; // Get updated content
                    const projectId = getProjectIdFromURL();

                    fetch(`/project/${projectId}/requirement/${id}/content`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ content: updatedContent }),
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to save requirement');
                            }
                            return response.json();
                        })
                        .then(data => {
                            // Placeholder alert for success message
                            alert('Changes saved successfully!');

                            // Toggle back to edit mode
                            textarea.setAttribute('readonly', '');
                            editButton.style.display = 'inline-block';
                            saveButton.style.display = 'none';
                            cancelButton.style.display = 'none';
                        })
                        .catch(error => {
                            console.error('Error saving requirement:', error);
                            // Handle error as needed
                            alert('Failed to save requirement: ' + error.message);
                        });
                });

                // Event listener for cancel button
                cancelButton.addEventListener('click', function () {
                    // Cancel editing
                    textarea.setAttribute('readonly', '');
                    editButton.style.display = 'inline-block';
                    saveButton.style.display = 'none';
                    cancelButton.style.display = 'none';

                    // Optionally, you can reload the original content if needed
                    textarea.value = fileContent;
                });
            })
            .catch(error => {
                console.error('Error fetching file content:', error);
                // Handle error as needed
                alert('Failed to fetch file content: ' + error.message);
            });
    }

    window.showRequirementContent = showRequirementContent;
});
