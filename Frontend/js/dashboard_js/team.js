// Immediate check to prevent page flash and handle back button from cache
if (!localStorage.getItem('token')) {
    window.location.replace('dashboard-login.html');
}
window.addEventListener('pageshow', (event) => {
    if (event.persisted && !localStorage.getItem('token')) {
        window.location.replace('dashboard-login.html');
    }
});

let allMembers = [];
let editingId = null;

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.replace('dashboard-login.html');
        return;
    }

    fetchMembers();

    // Search & filter live
    const searchInput = document.getElementById('filter-search');
    const deptFilter = document.getElementById('filter-dept');
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (deptFilter) deptFilter.addEventListener('change', applyFilters);
});

// ─── FETCH ──────────────────────────────────────────────────────────────────
async function fetchMembers() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${ENV.API_BASE_URL}/team`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok && data.success) {
            allMembers = data.data;
            renderMembers(allMembers);
            updateStats(allMembers);
        } else {
            showToast(data.message || 'Error fetching team members');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Server error – could not load team');
    }
}

// ─── RENDER ─────────────────────────────────────────────────────────────────
function renderMembers(data) {
    const grid = document.getElementById('teamGrid');
    if (!grid) return;

    if (data.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--mid-2);">No team members found</div>`;
        return;
    }

    grid.innerHTML = data.map(m => `
        <div class="member-card">
          <div class="m-avatar">
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#B2B2B2" stroke-width="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="m-name">${m.fullName}</div>
          <div class="m-role">${m.role}</div>
          <div class="m-dept-badge">${m.department}</div>
          <div class="m-contact">
            <div class="m-contact-row">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>${m.email}
            </div>
            <div class="m-contact-row">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>${m.phone}
            </div>
          </div>
          <div class="m-skills">
            <label>Skills:</label>
            <div class="skills-wrap">
              ${(m.skills || []).map(s => `<span class="skill-tag">${s}</span>`).join('')}
            </div>
          </div>
          <div class="m-actions">
            <button class="m-btn" onclick="editMember('${m._id}')">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>Edit
            </button>
            <button class="m-btn del" onclick="deleteMember('${m._id}')">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              </svg>Delete
            </button>
          </div>
        </div>
    `).join('');
}

// ─── STATS ───────────────────────────────────────────────────────────────────
function updateStats(data) {
    const total      = data.length;
    const designers  = data.filter(m => m.department === 'Design').length;
    const developers = data.filter(m => m.department === 'Development').length;

    // "New this month" = created in current calendar month
    const now = new Date();
    const newThisMonth = data.filter(m => {
        const d = new Date(m.createdAt);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;

    const elTotal    = document.getElementById('stat-total-members');
    const elDesign   = document.getElementById('stat-designers');
    const elDev      = document.getElementById('stat-developers');
    const elNew      = document.getElementById('stat-new-month');

    if (elTotal)  elTotal.textContent  = total;
    if (elDesign) elDesign.textContent = designers;
    if (elDev)    elDev.textContent    = developers;
    if (elNew)    elNew.textContent    = newThisMonth;
}

// ─── SAVE (Add / Edit) ───────────────────────────────────────────────────────
async function saveMember() {
    const token      = localStorage.getItem('token');
    const fullName   = document.getElementById('m-fullname').value.trim();
    const role       = document.getElementById('m-role').value.trim();
    const email      = document.getElementById('m-email').value.trim();
    const phone      = document.getElementById('m-phone').value.trim();
    const department = document.getElementById('m-dept').value;
    const skills     = document.getElementById('m-skills').value.trim();
    const password   = document.getElementById('m-password') ? document.getElementById('m-password').value.trim() : '';

    if (!fullName || !role || !email || !phone || !department) {
        showToast('Please fill in all required fields.');
        return;
    }

    if (!editingId && !password) {
        showToast('Please provide a password for the member login account.');
        return;
    }

    const payload = { fullName, role, email, phone, department, skills };
    if (!editingId) {
        payload.password = password;
    }

    try {
        const url    = editingId ? `${ENV.API_BASE_URL}/team/${editingId}` : `${ENV.API_BASE_URL}/team`;
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
            showToast(editingId ? 'Member updated successfully!' : 'Member added successfully!');
            editingId = null;
            fetchMembers();
        } else {
            showToast(data.message || data.error || 'Error saving member');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Server error');
    }
}

// ─── EDIT ────────────────────────────────────────────────────────────────────
function editMember(id) {
    const m = allMembers.find(m => m._id === id);
    if (!m) return;

    editingId = id;

    document.getElementById('m-fullname').value = m.fullName;
    document.getElementById('m-role').value     = m.role;
    document.getElementById('m-email').value    = m.email;
    document.getElementById('m-phone').value    = m.phone;
    document.getElementById('m-dept').value     = m.department;
    document.getElementById('m-skills').value   = (m.skills || []).join(', ');

    const modalTitle = document.querySelector('#addModal .modal-header h3');
    if (modalTitle) modalTitle.textContent = 'Edit Team Member';

    openModal('addModal');
}

// ─── DELETE ──────────────────────────────────────────────────────────────────
async function deleteMember(id) {
    if (!confirm('Are you sure you want to remove this team member?')) return;

    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${ENV.API_BASE_URL}/team/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();
        if (res.ok && data.success) {
            showToast('Member removed.');
            fetchMembers();
        } else {
            showToast(data.message || 'Error deleting member');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Server error');
    }
}

// ─── FILTER ──────────────────────────────────────────────────────────────────
function applyFilters() {
    const searchText = (document.getElementById('filter-search')?.value || '').toLowerCase();
    const dept       = document.getElementById('filter-dept')?.value || '';

    const filtered = allMembers.filter(m => {
        const matchesSearch = m.fullName.toLowerCase().includes(searchText)
            || m.role.toLowerCase().includes(searchText)
            || m.email.toLowerCase().includes(searchText);
        const matchesDept = dept === '' || m.department === dept;
        return matchesSearch && matchesDept;
    });

    renderMembers(filtered);
}

// ─── MODAL HELPERS ───────────────────────────────────────────────────────────
window.openModal = function(id) {
    if (id === 'addModal') {
        const passwordContainer = document.getElementById('password-field-container');
        if (editingId) {
            if (passwordContainer) passwordContainer.style.display = 'none';
        } else {
            document.getElementById('m-fullname').value = '';
            document.getElementById('m-role').value     = '';
            document.getElementById('m-email').value    = '';
            document.getElementById('m-phone').value    = '';
            document.getElementById('m-dept').selectedIndex = 0;
            document.getElementById('m-skills').value   = '';
            const passInput = document.getElementById('m-password');
            if (passInput) passInput.value = '';

            if (passwordContainer) passwordContainer.style.display = 'block';

            const modalTitle = document.querySelector('#addModal .modal-header h3');
            if (modalTitle) modalTitle.textContent = 'Add Team Member';
        }
    }
    document.getElementById(id).classList.add('open');
};

window.closeModal = function(id) {
    document.getElementById(id).classList.remove('open');
    if (id === 'addModal') editingId = null;
};

window.showToast = function(msg) {
    const t     = document.getElementById('toast');
    const msgEl = document.getElementById('toastMsg');
    if (t && msgEl) {
        msgEl.textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3000);
    }
};

window.saveMember   = saveMember;
window.editMember   = editMember;
window.deleteMember = deleteMember;
window.applyFilters = applyFilters;
