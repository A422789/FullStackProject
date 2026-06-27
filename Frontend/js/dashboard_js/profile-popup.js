// ============================================================
// Neoteric — Shared Profile Popup
// Works on every dashboard page that has id="top-avatar"
// Injects the popup HTML automatically, no per-page markup needed
// ============================================================

(function initProfilePopup() {

  // ── 1. Inject popup HTML into the topbar-right div ──────────────────────
  function injectPopupHTML() {
    // Find the avatar div on this page
    const avatar = document.getElementById('top-avatar');
    if (!avatar) return;

    // If a popup already exists in the DOM (e.g. overview page), reuse it
    if (document.getElementById('user-profile-popup')) return;

    // Make the container relative so popup positions correctly
    const topbarRight = avatar.closest('.topbar-right');
    if (topbarRight) topbarRight.style.position = 'relative';

    // Make avatar clickable
    avatar.style.cursor = 'pointer';

    // Build popup element
    const popup = document.createElement('div');
    popup.id = 'user-profile-popup';
    popup.style.cssText = [
      'display:none',
      'position:absolute',
      'top:50px',
      'right:0',
      'z-index:999',
      'width:280px',
      'flex-direction:column',
      'align-items:center',
      'gap:14px',
      'background:var(--white)',
      'padding:22px 20px',
      'border-radius:14px',
      'box-shadow:0 8px 28px rgba(0,0,0,.12)',
      'border:1px solid var(--gray-5)',
    ].join(';');

    popup.innerHTML = `
      <div style="width:70px;height:70px;border-radius:50%;background:var(--gray-5);overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
        <img id="pp-img" src="" alt="User" style="width:100%;height:100%;object-fit:cover;display:none;"/>
        <svg id="pp-placeholder" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="#999" stroke-width="1.5" style="padding:12px;">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
      <div style="text-align:center;width:100%;">
        <h2 id="pp-name" style="margin-bottom:4px;font-size:17px;font-weight:700;color:var(--dark-1);">Loading…</h2>
        <p id="pp-email" style="color:var(--mid-2);font-size:12px;margin-bottom:12px;">Loading email…</p>
        <span id="pp-role" style="display:inline-block;padding:4px 14px;background:var(--dark-1);color:var(--white);border-radius:20px;font-size:11px;font-weight:700;text-transform:capitalize;letter-spacing:.04em;">—</span>
      </div>
      <div style="width:100%;border-top:1px solid var(--gray-5);padding-top:12px;display:flex;flex-direction:column;gap:6px;">
        <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--mid-2);">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          <span id="pp-since">—</span>
        </div>
      </div>
    `;

    // Insert popup right after the avatar
    avatar.insertAdjacentElement('afterend', popup);
    return popup;
  }

  // ── 2. Fetch /auth/me and populate the popup ─────────────────────────────
  async function loadUserData() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${ENV.API_BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const user = data.data;

        const nameEl  = document.getElementById('pp-name');
        const emailEl = document.getElementById('pp-email');
        const roleEl  = document.getElementById('pp-role');
        const sinceEl = document.getElementById('pp-since');

        if (nameEl)  nameEl.textContent  = user.name  || 'User';
        if (emailEl) emailEl.textContent = user.email || '—';
        if (roleEl) {
          roleEl.textContent = user.role || 'member';
          // Colour: admin = dark navy, member = mid-grey tone
          roleEl.style.background = user.role === 'admin' ? 'var(--dark-1)' : '#5B6D84';
        }
        if (sinceEl && user.createdAt) {
          const d = new Date(user.createdAt);
          sinceEl.textContent = `Member since ${d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}`;
        }

        // Also update overview.js IDs if they exist on this page
        ['user-name','user-email','user-role'].forEach((id, i) => {
          const el = document.getElementById(id);
          if (el) el.textContent = [user.name, user.email, user.role][i] || '—';
        });
      }
    } catch (err) {
      console.error('Profile popup: could not load user', err);
    }
  }

  // ── 3. Wire up toggle click + outside-click-close ────────────────────────
  function wireToggle() {
    const avatar = document.getElementById('top-avatar');
    const popup  = document.getElementById('user-profile-popup');
    if (!avatar || !popup) return;

    avatar.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = popup.style.display === 'flex';
      popup.style.display = isVisible ? 'none' : 'flex';
    });

    document.addEventListener('click', (e) => {
      if (!popup.contains(e.target) && !avatar.contains(e.target)) {
        popup.style.display = 'none';
      }
    });
  }

  // ── 4. Boot on DOMContentLoaded ─────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    injectPopupHTML();
    loadUserData();
    wireToggle();
  });

})();
