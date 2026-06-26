// Immediate check to prevent page flash and handle back button from cache
if (!localStorage.getItem('token')) {
    window.location.replace('dashboard-login.html');
}
window.addEventListener('pageshow', (event) => {
    if (event.persisted && !localStorage.getItem('token')) {
        window.location.replace('dashboard-login.html');
    }
});

let allProjects = [];
let editingId = null;

const statusClass = {
    'Active': 'badge-green',
    'Completed': 'badge-blue',
    'On Hold': 'badge-yellow'
};

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.replace('dashboard-login.html');
        return;
    }

    fetchProjects();
});

async function fetchProjects() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${ENV.API_BASE_URL}/projects`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await res.json();
        
        if (res.ok && data.success) {
            allProjects = data.data;
            renderProjects(allProjects);
            updateStats(allProjects);
        } else {
            console.error('Failed to fetch projects:', data.message);
            showToast(data.message || 'Error fetching projects');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Server error');
    }
}

function renderProjects(data) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    if (data.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--mid-2);">No projects found</div>`;
        return;
    }

    grid.innerHTML = data.map(p => `
        <div class="project-card">
            <div class="project-thumb" style="background:#39475A">
                <div class="project-thumb-overlay"><button class="view-btn">View Details</button></div>
            </div>
            <div class="project-body">
                <div class="project-name">${p.title}</div>
                <div class="project-client">${p.clientName}</div>
                <div class="project-meta">
                    <span class="badge ${statusClass[p.status] || 'badge-gray'}">${p.status || 'Active'}</span>
                    <span style="font-size:12px;color:var(--mid-2)">${new Date(p.deadline).toLocaleDateString()}</span>
                </div>
                <div class="project-actions">
                    <button class="act-btn" onclick="editProject('${p._id}')">
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit
                    </button>
                    <button class="act-btn del" onclick="deleteProject('${p._id}')">
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateStats(data) {
    const totalProjects = data.length;
    // الباك اند يحفظ 'Active' = قيد الإنجاز / 'Completed' = مكتمل / 'On Hold' = معلق
    const inProgressCount = data.filter(p => p.status === 'Active').length;
    const completedCount = data.filter(p => p.status === 'Completed').length;
    const onHoldCount = data.filter(p => p.status === 'On Hold').length;

    const elTotal = document.getElementById('stat-total-projects');
    const elInProgress = document.getElementById('stat-in-progress');
    const elCompleted = document.getElementById('stat-completed');
    const elOnHold = document.getElementById('stat-on-hold');

    if (elTotal) elTotal.textContent = totalProjects;
    if (elInProgress) elInProgress.textContent = inProgressCount;
    if (elCompleted) elCompleted.textContent = completedCount;
    if (elOnHold) elOnHold.textContent = onHoldCount;
}

async function saveProject() {
    const token = localStorage.getItem('token');
    const title = document.getElementById('proj-title').value;
    const clientName = document.getElementById('proj-client').value;
    const category = document.getElementById('proj-category').value;
    const description = document.getElementById('proj-desc').value;
    const status = document.getElementById('proj-status').value;
    const deadline = document.getElementById('proj-deadline').value;

    if (!title || !clientName || !category || !description || !deadline) {
        alert("Please fill in all required fields.");
        return;
    }

    const payload = {
        title,
        clientName,
        category,
        description,
        status,
        deadline
    };

    try {
        const url = editingId ? `${ENV.API_BASE_URL}/projects/${editingId}` : `${ENV.API_BASE_URL}/projects`;
        const method = editingId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        
        if (res.ok && data.success) {
            closeModal('addModal');
            showToast(editingId ? 'Project updated successfully!' : 'Project saved successfully!');
            editingId = null;
            fetchProjects();
        } else {
            showToast(data.message || 'Error saving project');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Server error');
    }
}

function editProject(id) {
    const project = allProjects.find(p => p._id === id);
    if (!project) return;

    editingId = id;
    
    document.getElementById('proj-title').value = project.title;
    document.getElementById('proj-client').value = project.clientName;
    document.getElementById('proj-category').value = project.category;
    document.getElementById('proj-desc').value = project.description;
    
    // Status logic: Backend schema doesn't strictly have 'status', but assuming we added it or treat it loosely.
    // Assuming backend returns it if saved.
    document.getElementById('proj-status').value = project.status || 'Active';
    
    // Handle date formatting
    if (project.deadline) {
        // Just extract the YYYY-MM-DD part if it's an ISO string or a standard date string
        const d = new Date(project.deadline);
        if (!isNaN(d.getTime())) {
            document.getElementById('proj-deadline').value = d.toISOString().split('T')[0];
        } else {
            document.getElementById('proj-deadline').value = project.deadline;
        }
    }

    const modalTitle = document.querySelector('#addModal .modal-header h3');
    if (modalTitle) modalTitle.textContent = 'Edit Project';

    openModal('addModal');
}

async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${ENV.API_BASE_URL}/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();
        if (res.ok && data.success) {
            showToast('Project deleted.');
            fetchProjects();
        } else {
            showToast(data.message || 'Error deleting project');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Server error');
    }
}

function applyFilters() {
    const searchText = (document.getElementById('filter-search')?.value || '').toLowerCase();
    const category = document.getElementById('filter-category')?.value || '';
    const status = document.getElementById('filter-status')?.value || '';

    const filtered = allProjects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchText) || p.clientName.toLowerCase().includes(searchText);
        const matchesCat = category === '' || p.category === category;
        const pStatus = p.status || 'Active';
        const matchesStatus = status === '' || pStatus === status;
        
        return matchesSearch && matchesCat && matchesStatus;
    });

    renderProjects(filtered);
}

window.openModal = function(id) {
    if (id === 'addModal' && !editingId) {
        document.getElementById('proj-title').value = '';
        document.getElementById('proj-client').value = '';
        document.getElementById('proj-category').selectedIndex = 0;
        document.getElementById('proj-desc').value = '';
        document.getElementById('proj-status').selectedIndex = 0;
        document.getElementById('proj-deadline').value = '';
        
        const modalTitle = document.querySelector('#addModal .modal-header h3');
        if (modalTitle) modalTitle.textContent = 'Add New Project';
    }
    document.getElementById(id).classList.add('open');
};

window.closeModal = function(id) {
    document.getElementById(id).classList.remove('open');
    if (id === 'addModal') {
        editingId = null;
    }
};

window.showToast = function(msg) {
    const t = document.getElementById('toast');
    const msgEl = document.getElementById('toastMsg');
    if (t && msgEl) {
        msgEl.textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3000);
    }
};

window.saveProject = saveProject;
window.deleteProject = deleteProject;
window.editProject = editProject;
window.applyFilters = applyFilters;
