// Immediate check to prevent page flash and handle back button from cache
if (!localStorage.getItem('token')) {
    window.location.replace('dashboard-login.html');
}
window.addEventListener('pageshow', (event) => {
    if (event.persisted && !localStorage.getItem('token')) {
        window.location.replace('dashboard-login.html');
    }
});

let allServices = [];
let editingId = null; // Track if we are editing an existing service

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.replace('dashboard-login.html');
        return;
    }

    // Initial fetch of services
    fetchServices();
});

// Fetch all services from API
async function fetchServices() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${ENV.API_BASE_URL}/services`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await res.json();
        
        if (res.ok && data.success) {
            allServices = data.data;
            renderTable(allServices);
            updateStats(allServices);
        } else {
            console.error('Failed to fetch services:', data.message);
            showToast(data.message || 'Error fetching services');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Server error');
    }
}

// Render the table with data
function renderTable(data) {
    const tbody = document.getElementById('svcBody');
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No services found</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(s => `
        <tr>
            <td>
                <div style="display:flex;align-items:center;gap:10px">
                    <div class="td-img"><i class="${s.icon || 'fas fa-cogs'}"></i></div>
                    <div>
                        <div class="td-name">${s.title}</div>
                        <div class="td-sub">${s.description ? s.description.substring(0, 30) + '...' : ''}</div>
                    </div>
                </div>
            </td>
            <td><span class="badge badge-gray">${s.category}</span></td>
            <td>${s.priceRange}</td>
            <td><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#666" stroke-width="2" style="margin-right:4px;vertical-align:middle"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>-</td>
            <td><span class="badge ${s.status === 'active' ? 'badge-green' : 'badge-red'}">${s.status}</span></td>
            <td>
                <div class="action-btns">
                    <button class="icon-btn" title="Edit" onclick="editService('${s._id}')">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="icon-btn" title="View">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button class="icon-btn danger" title="Delete" onclick="deleteService('${s._id}')">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Update top statistics based on fetched data
function updateStats(data) {
    const totalServices = data.length;
    const activeCount = data.filter(s => s.status === 'active').length;
    const inactiveCount = totalServices - activeCount;

    // Calculate unique categories
    const categories = new Set(data.map(s => s.category));
    const totalCategories = categories.size;

    const elTotalSvc = document.getElementById('stat-total-services');
    const elActiveSvc = document.getElementById('stat-active-services');
    const elTotalCat = document.getElementById('stat-total-categories');
    const elCatList = document.getElementById('stat-categories-list');

    if (elTotalSvc) elTotalSvc.textContent = totalServices;
    if (elActiveSvc) elActiveSvc.textContent = `${activeCount} active, ${inactiveCount} inactive`;

    if (elTotalCat) elTotalCat.textContent = totalCategories;
    if (elCatList) {
        const catArr = Array.from(categories);
        elCatList.textContent = catArr.length > 0 ? catArr.slice(0, 2).join(' & ') + (catArr.length > 2 ? '...' : '') : 'No Categories';
    }
}

// Save (Add) new service
async function saveService() {
    const token = localStorage.getItem('token');
    const title = document.getElementById('svc-title').value;
    const category = document.getElementById('svc-category').value;
    const priceRange = document.getElementById('svc-price').value;
    const description = document.getElementById('svc-desc').value;
    const status = document.getElementById('svc-status').value;

    if (!title || !category || !priceRange || !description) {
        alert("Please fill in all required fields.");
        return;
    }

    const payload = {
        title,
        category,
        priceRange,
        description,
        status,
        icon: 'fas fa-laptop' // Default icon
    };

    try {
        const url = editingId ? `${ENV.API_BASE_URL}/services/${editingId}` : `${ENV.API_BASE_URL}/services`;
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
            showToast(editingId ? 'Service updated successfully!' : 'Service saved successfully!');
            // Clear inputs
            document.getElementById('svc-title').value = '';
            document.getElementById('svc-price').value = '';
            document.getElementById('svc-desc').value = '';
            editingId = null;
            // Refresh table
            fetchServices();
        } else {
            showToast(data.message || 'Error saving service');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Server error');
    }
}

// Edit Service
function editService(id) {
    const service = allServices.find(s => s._id === id);
    if (!service) return;

    editingId = id;
    
    // Populate form
    document.getElementById('svc-title').value = service.title;
    document.getElementById('svc-category').value = service.category;
    document.getElementById('svc-price').value = service.priceRange;
    document.getElementById('svc-desc').value = service.description;
    document.getElementById('svc-status').value = service.status;
    
    // Update modal title
    const modalTitle = document.querySelector('#addModal .modal-header h3');
    if (modalTitle) modalTitle.textContent = 'Edit Service';

    openModal('addModal');
}

// Delete service
async function deleteService(id) {
    if (!confirm('Are you sure you want to delete this service?')) return;

    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${ENV.API_BASE_URL}/services/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();
        if (res.ok && data.success) {
            showToast('Service deleted.');
            fetchServices();
        } else {
            showToast(data.message || 'Error deleting service');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Server error');
    }
}

// UI Utilities
function applyFilters() {
    const searchText = (document.getElementById('filter-search')?.value || '').toLowerCase();
    const category = document.getElementById('filter-category')?.value || '';
    const status = document.getElementById('filter-status')?.value || '';

    const filtered = allServices.filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(searchText) || s.description.toLowerCase().includes(searchText);
        const matchesCat = category === '' || s.category === category;
        const matchesStatus = status === '' || s.status === status;
        
        return matchesSearch && matchesCat && matchesStatus;
    });

    renderTable(filtered);
}

// Make globally available for inline onclick handlers in HTML
window.openModal = function(id) {
    if (id === 'addModal' && !editingId) {
        // Reset form for adding new
        document.getElementById('svc-title').value = '';
        document.getElementById('svc-category').selectedIndex = 0;
        document.getElementById('svc-price').value = '';
        document.getElementById('svc-desc').value = '';
        document.getElementById('svc-status').selectedIndex = 0;
        
        const modalTitle = document.querySelector('#addModal .modal-header h3');
        if (modalTitle) modalTitle.textContent = 'Add New Service';
    }
    document.getElementById(id).classList.add('open');
};

window.closeModal = function(id) {
    document.getElementById(id).classList.remove('open');
    if (id === 'addModal') {
        editingId = null; // Clear edit state on close
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

window.saveService = saveService;
window.deleteService = deleteService;
window.editService = editService;
window.applyFilters = applyFilters;
