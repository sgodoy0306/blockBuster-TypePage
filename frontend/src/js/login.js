document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorDiv = document.getElementById('loginError');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    errorDiv.classList.add('hidden');
    try {
      const res = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('userId', data.user.id);
        window.location.href = '/frontend/start-log.html';
      } else {
        const data = await res.json();
        errorDiv.textContent = data.message || 'Wrong Email or password';
        errorDiv.classList.remove('hidden');
      }
    } catch (err) {
      errorDiv.textContent = 'Server error';
      errorDiv.classList.remove('hidden');
    }
  });
});
