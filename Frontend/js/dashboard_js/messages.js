// Immediate check to prevent page flash and handle back button from cache
if (!localStorage.getItem('token')) {
    window.location.replace('dashboard-login.html');
}
window.addEventListener('pageshow', (event) => {
    if (event.persisted && !localStorage.getItem('token')) {
        window.location.replace('dashboard-login.html');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        // Not logged in, redirect to login
        window.location.replace('dashboard-login.html');
        return;
    }
});
