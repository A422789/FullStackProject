document.addEventListener('DOMContentLoaded', () => {
    // Attach logout functionality to the specific logout button
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Call the backend logout API to invalidate the token
                    await fetch(`${ENV.API_BASE_URL}/auth/logout`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                } catch (error) {
                    console.error('Error during logout:', error);
                }
            }
            
            // Clear the token from local storage regardless of backend response
            localStorage.removeItem('token');
            
            // Redirect to the login page
            window.location.replace('dashboard-login.html');
        });
    }
});
