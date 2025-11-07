// Function to get current user from API and show admin or guest menu accordingly
async function loadCurrentUser() {
        const usernameBtn = document.getElementById('usernameButton');
        const adminMenuBtn = document.getElementById('adminMenuBtn');
        const guestDropdown = document.getElementById('guestDropdown');
        let userId = null;
        const logoutBtn = document.getElementById('logoutBtn');
        try {
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            if (!token) {
                window.location.href = 'start-no-log.html';
                return;
            }
            const res = await fetch('http://localhost:3001/api/users/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (res.ok) {
                const user = await res.json();
                document.getElementById('usernameText').textContent = user.username || 'Guest';
                userId = user.id;
                const guestChevron = document.getElementById('guestChevron');
                guestChevron.style.display = 'none';
                if (user.is_admin) {
                    adminMenuBtn.classList.remove('hidden');
                    guestDropdown.classList.add('hidden');
                    usernameBtn.onclick = null;
                    logoutBtn.classList.remove('hidden');
                } else {
                    adminMenuBtn.classList.add('hidden');
                    guestDropdown.classList.add('hidden');
                    usernameBtn.onclick = function() {
                        window.location.href = `user-reservations.html?user=${userId}`;
                    };
                    logoutBtn.classList.remove('hidden');
                }
            } else {
                window.location.href = 'start-no-log.html';
            }
        } catch (error) {
            console.error('Error loading user:', error);
            window.location.href = 'start-no-log.html';
        }
    }
// Dropdown toggle and arrow animation
document.addEventListener('DOMContentLoaded', function() {
    // Logout button functionality
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.onclick = function() {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        window.location.href = 'start-no-log.html';
    };
    loadCurrentUser();
    const adminMenuBtn = document.getElementById('adminMenuBtn');
    const adminDropdown = document.getElementById('adminDropdown');
    const guestDropdown = document.getElementById('guestDropdown');
    adminMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        adminDropdown.classList.toggle('hidden');
    });
    // Close the admin dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!adminDropdown.classList.contains('hidden')) {
            adminDropdown.classList.add('hidden');
        }
        if (!guestDropdown.classList.contains('hidden')) {
            guestDropdown.classList.add('hidden');
            const guestChevron = document.getElementById('guestChevron');
            if (guestChevron) guestChevron.classList.remove('rotate-180');
        }
    });
    // Prevent clicks inside the dropdown from closing it
    adminDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    guestDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Submenus: only one open at a time, arrow animation
    const dropdownItems = document.querySelectorAll('.dropdown-item[data-menu]');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const menu = item.getAttribute('data-menu');
            const submenu = document.querySelector(`.submenu[data-menu="${menu}"]`);
            const chevron = item.querySelector('.chevron');
            // Close other submenus and reset arrows
            document.querySelectorAll('.submenu').forEach(ul => {
                if (ul !== submenu) ul.classList.add('hidden');
            });
            document.querySelectorAll('.dropdown-item .chevron').forEach(svg => {
                if (svg !== chevron) svg.classList.remove('rotate-90');
            });
            // Toggle the current submenu and arrow
            if (submenu.classList.contains('hidden')) {
                submenu.classList.remove('hidden');
                chevron.classList.add('rotate-90');
            } else {
                submenu.classList.add('hidden');
                chevron.classList.remove('rotate-90');
            }
        });
    });

    // Search bar functionality
    const searchForm = document.querySelector('form');
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchValue = searchForm.querySelector('input[name="search"]').value.trim();
        if (searchValue) {
            window.location.href = `movies-page.html?search=${encodeURIComponent(searchValue)}`;
        } else {
            window.location.href = 'movies-page.html';
        }
    });
});
