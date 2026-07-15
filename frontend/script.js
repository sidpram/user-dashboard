const API_URL = 'http://localhost:3000/api/users';

// DOM Selectors
const registrationForm = document.getElementById('registrationForm');
const yearSelect = document.getElementById('year');
const userTableBody = document.getElementById('userTableBody');
const searchBox = document.getElementById('searchBox');
const refreshBtn = document.getElementById('refreshBtn');
const currentDateTimeSpan = document.getElementById('currentDateTime');

// Analytics Metric Display Selectors
const totalUsersEl = document.getElementById('totalUsers');
const currentBirthdaysEl = document.getElementById('currentBirthdays');
const oldestYearEl = document.getElementById('oldestYear');
const latestYearEl = document.getElementById('latestYear');

// Global Chart References
let monthChartInstance = null;
let yearChartInstance = null;

// Initialize Application UI Component states
document.addEventListener('DOMContentLoaded', () => {
  populateYearDropdown();
  updateTimeDisplay();
  setInterval(updateTimeDisplay, 1000);
  fetchAndRenderDashboard();

  // Search trigger event wireframe
  searchBox.addEventListener('input', () => fetchAndRenderDashboard(searchBox.value));
  refreshBtn.addEventListener('click', () => {
    searchBox.value = '';
    fetchAndRenderDashboard();
  });
});

function updateTimeDisplay() {
  const now = new Date();
  currentDateTimeSpan.innerText = now.toLocaleString();
}

function populateYearDropdown() {
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= currentYear - 100; y--) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }
}

// Global Core Fetch Handler
async function fetchAndRenderDashboard(searchString = '') {
  try {
    const url = searchString ? `${API_URL}?search=${encodeURIComponent(searchString)}` : API_URL;
    const response = await fetch(url);
    const users = await response.json();

    renderTable(users);
    calculateAndRenderMetrics(users);
    renderCharts(users);
  } catch (err) {
    console.error('Error contacting internal API network:', err);
  }
}

function renderTable(users) {
  userTableBody.innerHTML = '';
  if (users.length === 0) {
    userTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No match entries logged.</td></tr>`;
    return;
  }

  users.forEach((user, index) => {
    const tr = document.createElement('tr');
    tr.className = 'fade-in';
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.month}</td>
      <td>${user.year}</td>
      <td>${new Date(user.createdAt).toLocaleDateString()}</td>
      <td>
        <button class="action-btn delete-btn" onclick="deleteUserRecord('${user._id}')">
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      </td>
    `;
    userTableBody.appendChild(tr);
  });
}

async function deleteUserRecord(id) {
  if (confirm('Are you sure you want to delete this profile entry?')) {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchAndRenderDashboard(searchBox.value);
    } catch (err) {
      console.error('Failed to parse deletion execution sequence:', err);
    }
  }
}

// Registration Form Logic Implementation 
registrationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const month = document.getElementById('month').value;
  const year = yearSelect.value;

  // Clear tracking validation blocks
  document.getElementById('nameError').textContent = '';
  document.getElementById('emailError').textContent = '';
  document.getElementById('monthError').textContent = '';
  document.getElementById('yearError').textContent = '';

  let valid = true;
  if (!name) { document.getElementById('nameError').textContent = 'Name context required'; valid = false; }
  if (!email) { document.getElementById('emailError').textContent = 'Email address required'; valid = false; }
  if (!month) { document.getElementById('monthError').textContent = 'Please choose a month'; valid = false; }
  if (!year) { document.getElementById('yearError').textContent = 'Please select a year'; valid = false; }

  if (!valid) return;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, month, year })
    });

    if (!res.ok) {
      const data = await res.json();
      document.getElementById('emailError').textContent = data.error || 'Submission rejection error';
      return;
    }

    registrationForm.reset();
    fetchAndRenderDashboard();
  } catch (err) {
    console.error('Error submitting form profile payload:', err);
  }
});

function calculateAndRenderMetrics(users) {
  totalUsersEl.textContent = users.length;
  
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
  const currentMonthCount = users.filter(u => u.month.toLowerCase() === currentMonthName.toLowerCase()).length;
  currentBirthdaysEl.textContent = currentMonthCount;

  if (users.length > 0) {
    const years = users.map(u => u.year);
    oldestYearEl.textContent = Math.min(...years);
    latestYearEl.textContent = Math.max(...years);
  } else {
    oldestYearEl.textContent = '-';
    latestYearEl.textContent = '-';
  }
}

function renderCharts(users) {
  // 1. Process Data Distributions
  const monthCounts = {};
  const yearCounts = {};

  users.forEach(u => {
    monthCounts[u.month] = (monthCounts[u.month] || 0) + 1;
    yearCounts[u.year] = (yearCounts[u.year] || 0) + 1;
  });

  // Chart Global Destruct/Refresh sequences
  if (monthChartInstance) monthChartInstance.destroy();
  if (yearChartInstance) yearChartInstance.destroy();

  // 2. Build Month Chart (Pie/Doughnut style handles this layout option cleanly)
  const ctxMonth = document.getElementById('monthChart').getContext('2d');
  monthChartInstance = new Chart(ctxMonth, {
    type: 'pie',
    data: {
      labels: Object.keys(monthCounts),
      datasets: [{
        data: Object.values(monthCounts),
        backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#3b82f6', '#14b8a6', '#f97316', '#a855f7', '#64748b', '#6d28d9']
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // 3. Build Year Chart (Bar/Pie alternative)
  const ctxYear = document.getElementById('yearChart').getContext('2d');
  yearChartInstance = new Chart(ctxYear, {
    type: 'pie', // Kept uniform with user distribution context request
    data: {
      labels: Object.keys(yearCounts),
      datasets: [{
        data: Object.values(yearCounts),
        backgroundColor: ['#4f46e5', '#06b6d4', '#10b981', '#fbbf24', '#f43f5e', '#a855f7']
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}