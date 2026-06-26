// Immediate check: If already logged in, redirect to dashboard
if (localStorage.getItem('token')) {
    window.location.replace('dashboard-overview.html');
}

window.addEventListener('pageshow', (event) => {
    if (event.persisted && localStorage.getItem('token')) {
        window.location.replace('dashboard-overview.html');
    }
});

function togglePw() {
    const p = document.getElementById('pw');
    p.type = p.type === 'password' ? 'text' : 'password';
}

async function doLogin(event) {
    if (event) {
        event.preventDefault();
    }

    const email = document.getElementById('email').value;
    const password = document.getElementById('pw').value;
    const errorMsg = document.getElementById('error-message');
    const loginBtn = document.getElementById('loginBtn');

    // Reset error message
    errorMsg.style.display = 'none';
    errorMsg.innerText = '';

    // Basic validation
    if (!email || !password) {
        errorMsg.style.display = 'block';
        errorMsg.innerText = 'Please enter both email and password.';
        return;
    }

    try {
        loginBtn.innerText = 'Logging in...';
        loginBtn.disabled = true;

        const response = await fetch(`${ENV.API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Login successful, save token
            localStorage.setItem('token', data.data.token);

            // Redirect to overview page and replace history
            window.location.replace('dashboard-overview.html');
        } else {
            // Login failed
            errorMsg.style.display = 'block';
            errorMsg.innerText = data.message || 'Invalid credentials.';
            loginBtn.innerText = 'Log In';
            loginBtn.disabled = false;
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMsg.style.display = 'block';
        errorMsg.innerText = 'Server connection error. Ensure the backend is running.';
        loginBtn.innerText = 'Log In';
        loginBtn.disabled = false;
    }
}
