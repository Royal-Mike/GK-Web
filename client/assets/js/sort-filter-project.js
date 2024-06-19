const searchInput = document.getElementById('project-search');
  searchInput.addEventListener('keyup', function() {
    const searchTerm = searchInput.value.toLowerCase();
    const projectItems = document.querySelectorAll('.project-item');

    projectItems.forEach(item => {
      const projectName = item.querySelector('.card-title').textContent.toLowerCase();
      if (projectName.includes(searchTerm)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });

 document.addEventListener('DOMContentLoaded', function () {
  const orderDropdown = document.getElementById('order-dropdown');
  const orderButton = document.getElementById('order-dropdown'); // Thêm id cho nút order dropdown
  let sortOrder = 'desc';

  // Toggle order dropdown when the button is clicked
  orderButton.addEventListener('click', function () {
    if (orderDropdown.classList.contains('show')) {
      orderDropdown.classList.remove('show');
    } else {
      orderDropdown.classList.add('show');
    }
  });

  // Handle sort order selection
  const sortOrders = document.querySelectorAll('.sort-order');
  sortOrders.forEach(option => {
    option.addEventListener('click', function () {
      const sortBy = this.getAttribute('data-sort-by');
      const sortOrder = this.getAttribute('data-sort-order');

      // Perform sorting based on selected option
      sortProjects(sortBy, sortOrder);

      // Close the dropdown menu after selecting an option
      orderDropdown.classList.remove('show');
    });
  });

  // Sort projects based on selected option
  function sortProjects(sortBy, order) {
    const projectContainer = document.querySelector('.row.p-5');
    const projectItems = Array.from(document.querySelectorAll('.project-item'));

    projectItems.sort((a, b) => {
      const dateA = new Date(a.getAttribute('data-created-at'));
      const dateB = new Date(b.getAttribute('data-created-at'));

      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });

    projectContainer.innerHTML = ''; // Clear the container before re-adding sorted items

    projectItems.forEach(item => {
      projectContainer.appendChild(item);
    });
  }

  // Initial sort when the page is loaded
  sortProjects(sortOrder);

  // Toggle order when the order button is clicked
  orderButton.addEventListener('click', function () {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    orderButton.textContent = sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1);
    sortProjects('created-date', sortOrder); // Sort by created date after changing order
  });
});