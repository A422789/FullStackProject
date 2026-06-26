// Immediate check to prevent page flash and handle back button from cache
if (!localStorage.getItem('token')) {
    window.location.replace('dashboard-login.html');
}
window.addEventListener('pageshow', (event) => {
    if (event.persisted && !localStorage.getItem('token')) {
        window.location.replace('dashboard-login.html');
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        // Not logged in, redirect to login
        window.location.replace('dashboard-login.html');
        return;
    }

    try {
        const response = await fetch(`${ENV.API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok && data.success) {
            const user = data.data;
            document.getElementById('user-name').innerText = user.name || 'User Name';
            document.getElementById('user-email').innerText = user.email || 'user@example.com';
            document.getElementById('user-role').innerText = user.role || 'Member';
            
            // In case we have a profile picture in the future:
            // if (user.profilePicture) {
            //     document.getElementById('user-img').src = user.profilePicture;
            //     document.getElementById('user-img').style.display = 'block';
            //     document.getElementById('user-img-placeholder').style.display = 'none';
            // }
        } else {
            console.error('Failed to fetch user data:', data.message);
            // Token might be invalid or expired
            localStorage.removeItem('token');
            window.location.replace('dashboard-login.html');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }

    // Toggle profile popup
    const topAvatar = document.getElementById('top-avatar');
    const profilePopup = document.getElementById('user-profile-popup');

    if (topAvatar && profilePopup) {
        topAvatar.addEventListener('click', (e) => {
            e.stopPropagation();
            if (profilePopup.style.display === 'none') {
                profilePopup.style.display = 'flex';
            } else {
                profilePopup.style.display = 'none';
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!profilePopup.contains(e.target) && !topAvatar.contains(e.target)) {
                profilePopup.style.display = 'none';
            }
        });
    }
});
