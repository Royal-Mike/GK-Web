document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('project-search');
    const orderButton = document.getElementById('order-button');
    const projectListContainer = document.getElementById('project-list');
    const paginationContainer = document.getElementById('pagination-container').querySelector('.pagination');

    let currentPageNum = 1;
    let currentSortBy = 'created_at'; // Default sort by created_at
    let currentSortOrder = 'desc';
    let currentSearchTerm = '';

    // Function to fetch projects from server based on current filters
    async function fetchProjects(currentPageNum) {
        try {
            console.log(`Fetching projects for page ${currentPageNum}`);
            const response = await fetch(`/project/search?page=${currentPageNum}&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}&searchTerm=${currentSearchTerm}`);
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }

            const data = await response.json();
            console.log(`Projects fetched for page ${currentPageNum}:`, data.projects);
            displayProjects(data.projects);
            displayPagination(data.currentPageNum, data.totalPages);
        } catch (error) {
            console.error('Error fetching projects:', error.message);
        }
    }

    // Function to display projects in the UI
    function displayProjects(projects) {
        projectListContainer.innerHTML = '';
        projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', 'mb-3', 'project-item');
            projectItem.dataset.createdAt = project.created_at;
            projectItem.innerHTML = `
        <a href="/project/${project.id}" class="nav-link text-dark" aria-current="page">
          <div class="bg-white">
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center w-100">
                  <div class="d-flex align-items-center justify-content-start w-100">
                    <img src="https://cdn.qatouch.com/assets/images/qatouch-favicon-color-1.png" width="40px" height="40px"/>
                    <div class="p-2 flex-grow-1" style="min-width: 0;">
                      <h4 class="card-title text-truncate" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                          ${project.name_project}
                      </h4>
                      <p style="font-size: 0.75rem">Created on ${new Date(project.created_at).toLocaleString()}</p>
                      <p style="font-size: 0.75rem">Created by <b>Hoang</b></p>
                    </div>
                  </div>
                </div>
                <style>
                    .enc-id-con {
                        padding-bottom: 15px;
                        border-bottom: 1px solid #f2f8ff;
                        display: inline-flex;
                        align-items: center;
                        justify-content: space-between;
                        width: 100%;
                    }

                    .key {
                        box-shadow: 0px 0px 5px 0px rgb(0 0 0 / 29%);
                        text-align: left;
                        border-radius: 30px;
                        background: #f2f0ff;
                        padding: 2px 25px;
                        font-size: 0.75rem;
                        font-weight: 500;
                    }
                </style>
                <div class="enc-id-con">
                    <p>Project Key</p>
                    <p class="key" style="color: rgb(77, 0, 174)">${project.id}</p>
                </div>
                <hr />
                <div class="row">
                  <div class="col" style="font-size: 0.8rem">
                    Test Cases<br/>1
                  </div>
                  <div class="col" style="font-size: 0.8rem">
                    Test Runs<br/>1
                  </div>
                  <div class="col" style="font-size: 0.8rem">
                    Issues<br/>1
                  </div>
                </div>
                <hr/>
                <div class="d-flex justify-content-end">
                  <button type="button" class="btn btn-primary" style="background-color: #034f75">
                    <i class="bi bi-person-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </a>
      `;
            projectListContainer.appendChild(projectItem);
        });
    }

    // Function to display pagination controls
    function displayPagination(currentPageNum, totalPages) {
        paginationContainer.innerHTML = '';

        if (currentPageNum > 1) {
            const prevPageItem = document.createElement('li');
            prevPageItem.classList.add('page-item');
            prevPageItem.innerHTML = `<a class="page-link" href="javascript:void(0);" aria-label="Previous">&laquo;</a>`;
            prevPageItem.addEventListener('click', () => {
                currentPageNum--;
                fetchProjects(currentPageNum); // Pass currentPageNum as parameter
            });
            paginationContainer.appendChild(prevPageItem);
        }

        for (let i = 1; i <= totalPages; ++i) {
            const pageItem = document.createElement('li');
            pageItem.classList.add('page-item');
            if (i === currentPageNum) {
                pageItem.classList.add('active');
            }
            const pageLink = document.createElement('a');
            pageLink.classList.add('page-link');
            pageLink.href = 'javascript:void(0);';
            pageLink.textContent = i;
            pageLink.dataset.page = i; // Store page number in dataset attribute
            pageLink.addEventListener('click', function () {
                currentPageNum = parseInt(this.dataset.page);
                fetchProjects(currentPageNum); // Pass currentPageNum as parameter
            });
            pageItem.appendChild(pageLink);
            paginationContainer.appendChild(pageItem);
        }

        if (currentPageNum < totalPages) {
            const nextPageItem = document.createElement('li');
            nextPageItem.classList.add('page-item');
            nextPageItem.innerHTML = `<a class="page-link" href="javascript:void(0);" aria-label="Next">&raquo;</a>`;
            nextPageItem.addEventListener('click', () => {
                currentPageNum++;
                fetchProjects(currentPageNum); // Pass currentPageNum as parameter
            });
            paginationContainer.appendChild(nextPageItem);
        }
    }

    searchInput.addEventListener('keyup', function () {
        currentSearchTerm = searchInput.value.trim().toLowerCase();
        fetchProjects(currentPageNum); // Pass currentPageNum as parameter
    });

    orderButton.addEventListener('click', function () {
        if (currentSortOrder === 'asc') {
            currentSortOrder = 'desc';
            orderButton.innerHTML = 'Desc <i id="order-icon" class="fas fa-arrow-down" style="color: red;"></i>';
        } else {
            currentSortOrder = 'asc';
            orderButton.innerHTML = 'Asc <i id="order-icon" class="fas fa-arrow-up" style="color: green;"></i>';
        }
        fetchProjects(currentPageNum); // Initial fetch
    });

    // Event listener for sort dropdown items
    const sortDropdownItems = document.querySelectorAll('.dropdown-menu a.dropdown-item');
    sortDropdownItems.forEach(item => {
        item.addEventListener('click', function () {
            currentSortBy = this.dataset.sort;
            document.getElementById('sort-dropdown').innerText = this.innerText; // Update dropdown button text
            fetchProjects(currentPageNum); // Fetch projects with new sort criteria
        });
    });

    fetchProjects(currentPageNum); // Initial fetch
});
