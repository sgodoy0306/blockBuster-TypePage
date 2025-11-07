document.addEventListener('DOMContentLoaded', () => {
  // Show/hide password
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  const eyeIcon = document.getElementById('eyeIcon');
  if (togglePassword && passwordInput && eyeIcon) {
    let visible = false;
    togglePassword.addEventListener('click', () => {
      visible = !visible;
      passwordInput.type = visible ? 'text' : 'password';
      if (visible) {
        eyeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19.5c-6 0-9.75-7.5-9.75-7.5a19.77 19.77 0 014.362-5.442m3.478-1.633A9.723 9.723 0 0112 4.5c6 0 9.75 7.5 9.75 7.5a19.77 19.77 0 01-2.036 2.545M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18" />`;
      } else {
        eyeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />\n<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />`;
      }
    });
  }

  // User registration
  const registerForm = document.getElementById('registerForm');
  const registerError = document.getElementById('registerError');
  const registerSuccess = document.getElementById('registerSuccess');
  if (!registerForm) return;

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    registerError.classList.add('hidden');
    registerSuccess.classList.add('hidden');

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username) {
      registerError.textContent = 'Please enter a username.';
      registerError.classList.remove('hidden');
      return;
    }
    if (!email) {
      registerError.textContent = 'Please enter an email.';
      registerError.classList.remove('hidden');
      return;
    }
    if (!password) {
      registerError.textContent = 'Please enter a password.';
      registerError.classList.remove('hidden');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await response.json();
      if (response.ok) {
        registerSuccess.textContent = 'User registered successfully.';
        registerSuccess.classList.remove('hidden');
        registerForm.reset();
        window.location.href = '/frontend/login.html';
      } else {
        if (data.error) {
          if (data.error.toLowerCase().includes('username')) {
            registerError.textContent = 'That username is already registered.';
          } else if (data.error.toLowerCase().includes('email')) {
            registerError.textContent = 'That email is already registered.';
          } else {
            registerError.textContent = data.message || 'Error registering user.';
          }
        } else {
          registerError.textContent = 'Error registering user.';
        }
        registerError.classList.remove('hidden');
      }
    } catch (err) {
      registerError.textContent = 'Server connection error.';
      registerError.classList.remove('hidden');
    }
  });
});
