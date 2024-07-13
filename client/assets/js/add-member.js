document.addEventListener("DOMContentLoaded", function () {
    const addMemberPopup = document.getElementById('addMemberPopup');
    const addMemberButton = document.getElementById('add-member-button');
    const cancelAddMemberBtn = document.getElementById('cancelAddMemberBtn');
    const addMemberBtn = document.getElementById('addMemberBtn');
    const memberNameSelect = document.getElementById('memberName');
    const memberRoleSelect = document.getElementById('memberRole');

    function closePopup() {
        addMemberPopup.style.display = "none";
        memberNameSelect.value = '';
        memberRoleSelect.value = '';
    }

    function getProjectIdFromURL() {
        const pathArray = window.location.pathname.split('/');
        const projectId = pathArray[2];
        return projectId;
    }
    function showPopup() {
        addMemberPopup.style.display = "block";
    }

    addMemberButton.addEventListener('click', showPopup);
    cancelAddMemberBtn.addEventListener('click', closePopup);

    addMemberBtn.addEventListener('click', async function () {
        const projectId = getProjectIdFromURL();

        const selectedMemberId = memberNameSelect.value;
        const selectedRole = memberRoleSelect.value;

        try {
            const response = await fetch(`/project/${projectId}/add-member`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: selectedMemberId,
                    projectId: projectId,
                    role: selectedRole
                })
            });

            if (response.ok) {
                // Member added successfully, you can update the UI or perform other actions
                showToast('Member added successfully');
                location.reload();
            } else {
                // Handle error
                showToast('Failed to add member:', response.status);
            }
        } catch (error) {
            showToast('Error adding member:', error);
        }

        closePopup();
    });
});