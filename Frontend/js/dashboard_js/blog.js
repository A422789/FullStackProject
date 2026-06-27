// Immediate check to prevent page flash and handle back button from cache
if (!localStorage.getItem('token')) {
    window.location.replace('dashboard-login.html');
}
window.addEventListener('pageshow', (event) => {
    if (event.persisted && !localStorage.getItem('token')) {
        window.location.replace('dashboard-login.html');
    }
});

let allPosts = [];
let editingId = null;

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.replace('dashboard-login.html');
        return;
    }

    fetchPosts();

    // Setup live filters
    const searchInput = document.getElementById('filter-search');
    const catFilter = document.getElementById('filter-category');
    const statusFilter = document.getElementById('filter-status');

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (catFilter) catFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
});

// ─── FETCH ──────────────────────────────────────────────────────────────────
async function fetchPosts() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${ENV.API_BASE_URL}/blogs`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok && data.success) {
            allPosts = data.data;
            renderTable(allPosts);
            updateStats(allPosts);
        } else {
            showToast(data.message || 'Error fetching blog posts');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Server error – could not load blogs');
    }
}

// ─── RENDER ─────────────────────────────────────────────────────────────────
function renderTable(data) {
    const tbody = document.getElementById('blogBody');
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--mid-2);">No blog posts found</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(p => {
        // format date cleanly
        let formattedDate = '-';
        if (p.date) {
            const d = new Date(p.date);
            formattedDate = d.toISOString().split('T')[0];
        }

        // capitalize status for UI
        const statusText = p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1) : 'Draft';
        const badgeClass = p.status === 'published' ? 'badge-green' : 'badge-yellow';

        return `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:10px">
              <div class="td-img">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z"/>
                  <path d="M14 2v6h6"/>
                </svg>
              </div>
              <div>
                <div class="td-name">${p.title}</div>
                <div class="td-sub">${p.description ? p.description.substring(0, 45) + (p.description.length > 45 ? '...' : '') : ''}</div>
              </div>
            </div>
          </td>
          <td><span class="badge badge-gray">${p.category}</span></td>
          <td style="font-size:13px">${p.author || 'Admin'}</td>
          <td>
            <span style="display:flex;align-items:center;gap:5px;font-size:13px">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>${(p.views || 0).toLocaleString()}
            </span>
          </td>
          <td><span class="badge ${badgeClass}">${statusText}</span></td>
          <td style="font-size:12px;color:var(--mid-2)">${formattedDate}</td>
          <td>
            <div class="action-btns">
              <button class="icon-btn" title="Edit" onclick="editPost('${p._id}')">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="icon-btn" title="Delete" onclick="deletePost('${p._id}')">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                </svg>
              </button>
            </div>
          </td>
        </tr>`;
    }).join('');
}

// ─── STATS ───────────────────────────────────────────────────────────────────
function updateStats(data) {
    const totalPosts = data.length;
    const drafts = data.filter(p => p.status === 'draft').length;
    
    // Sum total views
    const totalViews = data.reduce((sum, p) => sum + (p.views || 0), 0);
    
    // Count unique categories
    const categories = new Set(data.map(p => p.category));
    const totalCategories = categories.size;

    const elTotal = document.getElementById('stat-total-posts');
    const elDrafts = document.getElementById('stat-drafts');
    const elViews = document.getElementById('stat-total-views');
    const elCat = document.getElementById('stat-categories');

    if (elTotal) elTotal.textContent = totalPosts;
    if (elDrafts) elDrafts.textContent = drafts;
    if (elViews) elViews.textContent = totalViews.toLocaleString();
    if (elCat) elCat.textContent = totalCategories;
}

// ─── SAVE (Add / Edit) ───────────────────────────────────────────────────────
async function savePost() {
    const token = localStorage.getItem('token');
    const title = document.getElementById('b-title').value.trim();
    const category = document.getElementById('b-category').value;
    const status = document.getElementById('b-status').value.toLowerCase(); // Backend schema is lowercase enum
    const description = document.getElementById('b-description').value.trim();

    if (!title || !category || !status || !description) {
        showToast('Please fill in all required fields.');
        return;
    }

    const payload = { title, category, status, description };

    try {
        const url = editingId ? `${ENV.API_BASE_URL}/blogs/${editingId}` : `${ENV.API_BASE_URL}/blogs`;
        const method = editingId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok && data.success) {
            closeModal('addModal');
            showToast(editingId ? 'Post updated successfully!' : 'Post created successfully!');
            editingId = null;
            fetchPosts();
        } else {
            showToast(data.message || data.error || 'Error saving post');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Server error – could not save post');
    }
}

// ─── EDIT ────────────────────────────────────────────────────────────────────
function editPost(id) {
    const p = allPosts.find(post => post._id === id);
    if (!p) return;

    editingId = id;

    document.getElementById('b-title').value = p.title;
    document.getElementById('b-category').value = p.category;
    
    // Capitalize status for matching dropdown value
    const statusVal = p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1) : 'Draft';
    document.getElementById('b-status').value = statusVal;
    
    document.getElementById('b-description').value = p.description || '';

    const modalTitle = document.querySelector('#addModal .modal-header h3');
    if (modalTitle) modalTitle.textContent = 'Edit Blog Post';

    openModal('addModal');
}

// ─── DELETE ──────────────────────────────────────────────────────────────────
async function deletePost(id) {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${ENV.API_BASE_URL}/blogs/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();
        if (res.ok && data.success) {
            showToast('Post deleted successfully.');
            fetchPosts();
        } else {
            showToast(data.message || 'Error deleting post');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Server error – could not delete post');
    }
}

// ─── FILTER ──────────────────────────────────────────────────────────────────
function applyFilters() {
    const searchText = (document.getElementById('filter-search')?.value || '').toLowerCase();
    const category = document.getElementById('filter-category')?.value || '';
    const status = (document.getElementById('filter-status')?.value || '').toLowerCase();

    const filtered = allPosts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchText)
            || (p.description && p.description.toLowerCase().includes(searchText));
        const matchesCat = category === '' || p.category === category;
        const matchesStatus = status === '' || p.status === status;
        
        return matchesSearch && matchesCat && matchesStatus;
    });

    renderTable(filtered);
}

// ─── MODAL HELPERS ───────────────────────────────────────────────────────────
window.openModal = function(id) {
    if (id === 'addModal' && !editingId) {
        document.getElementById('b-title').value = '';
        document.getElementById('b-category').selectedIndex = 0;
        document.getElementById('b-status').selectedIndex = 0;
        document.getElementById('b-description').value = '';

        const modalTitle = document.querySelector('#addModal .modal-header h3');
        if (modalTitle) modalTitle.textContent = 'New Blog Post';
    }
    document.getElementById(id).classList.add('open');
};

window.closeModal = function(id) {
    document.getElementById(id).classList.remove('open');
    if (id === 'addModal') editingId = null;
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

// Expose functions globally for HTML event handlers
window.savePost = savePost;
window.editPost = editPost;
window.deletePost = deletePost;
window.applyFilters = applyFilters;
