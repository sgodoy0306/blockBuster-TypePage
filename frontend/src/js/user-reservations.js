// Logout button logic and authentication checks for reservations page
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    window.location.href = 'start-no-log.html';
  });
}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function loadReservations() {
  const loadingEl = document.getElementById('loading');
  const errorMessage = document.getElementById('error-message');
  const reservationsList = document.getElementById('reservations-list');
  const noReservations = document.getElementById('no-reservations');

  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  const userId = getQueryParam('user');

  loadingEl.classList.remove('hidden');
  errorMessage.classList.add('hidden');
  reservationsList.innerHTML = '';
  noReservations.classList.add('hidden');

  if (!token || !userId) {
    window.location.href = 'start-no-log.html';
    return;
  }

  try {
    const res = await fetch(`http://localhost:3001/api/users/${userId}/reservations`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.status === 401 || res.status === 403) {
      window.location.href = 'start-no-log.html';
      return;
    }
    if (!res.ok) {
      throw new Error('Could not load reservations');
    }

    const reservations = await res.json();
    loadingEl.classList.add('hidden');

    if (!reservations.length) {
      noReservations.classList.remove('hidden');
      return;
    }

    reservations.forEach(r => {
      const div = document.createElement('div');
      div.className = 'reservation-card bg-white/95 rounded-lg shadow-lg overflow-hidden hover:shadow-xl flex flex-col h-full';
      div.innerHTML = `
        <div class="relative">
          <img src="${r.movie.image_path}" alt="${r.movie.name}" class="w-full h-64 object-cover rounded-t-lg" onerror="this.src='templates/default-movie-poster.jpg'">
          <div class="absolute top-3 right-3 bg-blockbuster-700 text-yellow-500 px-3 py-1 rounded-full text-sm font-bold shadow-lg">${r.movie.mpa_rating || ''}</div>
        </div>
        <div class="p-6 flex-1 flex flex-col">
          <h2 class="text-2xl font-bold text-blockbuster-700 mb-2 font-display">${r.movie.name}</h2>
          <div class="space-y-2 mb-2">
            <p class="text-gray-600 text-sm font-body"><strong class="text-blockbuster-600">Year:</strong> ${r.movie.year}</p>
            <p class="text-gray-600 text-sm font-body"><strong class="text-blockbuster-600">Director:</strong> ${r.movie.director}</p>
            <p class="text-gray-600 text-sm font-body"><strong class="text-blockbuster-600">Duration:</strong> ${r.movie.duration} min</p>
            <p class="text-gray-600 text-sm font-body"><strong class="text-blockbuster-600">Reservation date:</strong> ${new Date(r.reserved_at).toLocaleString()}</p>
          </div>
          <p class="text-gray-700 text-sm mb-3 line-clamp-3 font-body">${r.movie.description}</p>
          <div class="flex justify-between items-center pt-4 border-t border-gray-200 mt-auto">
            <span class="text-2xl font-bold text-green-600 font-display">$${r.movie.price}</span>
            <span class="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-full font-semibold">Stock: ${r.movie.stock}</span>
          </div>
          <button class="cancel-reservation-btn mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors" data-reservation-id="${r.id}">Cancel</button>
        </div>
      `;
      reservationsList.appendChild(div);
    });

    // Attach cancel handlers
    document.querySelectorAll('.cancel-reservation-btn').forEach(btn => {
      btn.addEventListener('click', async function () {
        const reservationId = this.getAttribute('data-reservation-id');
        const tokenLocal = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!reservationId || !tokenLocal) return;
        this.disabled = true;
        const prevText = this.textContent;
        this.textContent = 'Cancelling...';
        try {
          const delRes = await fetch(`http://localhost:3001/api/reservations/${reservationId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${tokenLocal}`,
              'Content-Type': 'application/json'
            }
          });
          if (delRes.ok) {
            // Remove the card from DOM
            this.closest('.reservation-card').remove();
            // If no cards left, show 'no reservations' message
            if (document.querySelectorAll('.reservation-card').length === 0) {
              document.getElementById('no-reservations').classList.remove('hidden');
            }
          } else if (delRes.status === 401 || delRes.status === 403) {
            window.location.href = 'start-no-log.html';
          } else {
            this.textContent = 'Error';
            this.disabled = false;
            setTimeout(() => { this.textContent = prevText; }, 1500);
          }
        } catch (err) {
          this.textContent = 'Error';
          this.disabled = false;
          setTimeout(() => { this.textContent = prevText; }, 1500);
        }
      });
    });
  } catch (err) {
    loadingEl.classList.add('hidden');
    errorMessage.textContent = 'Error loading reservations.';
    errorMessage.classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  if (!token) {
    window.location.href = 'start-no-log.html';
    return;
  }
  if (logoutBtn) logoutBtn.classList.remove('hidden');
  loadReservations();
});
