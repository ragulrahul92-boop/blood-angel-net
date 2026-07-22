// Donor Dashboard
(function() {
  const session = DB.get(LS_KEYS.SESSION, null);
  if (!session || session.role !== 'donor') {
    window.location.href = 'login.html';
    return;
  }

  const donor = DB.get(LS_KEYS.DONORS, []).find(d => d.id === session.refId);
  if (!donor) { window.location.href = 'login.html'; return; }

  document.getElementById('donorName').textContent = donor.name;
  document.getElementById('donorBlood').textContent = donor.bloodGroup;
  document.getElementById('donorCity').textContent = donor.city;

  const toggle = document.getElementById('availToggle');
  const label = document.getElementById('availLabel');
  toggle.checked = donor.available;
  label.textContent = donor.available ? 'Available' : 'Unavailable';
  toggle.addEventListener('change', () => {
    DB.update(LS_KEYS.DONORS, donor.id, { available: toggle.checked });
    donor.available = toggle.checked;
    label.textContent = toggle.checked ? 'Available' : 'Unavailable';
  });

  // Matching requests (same blood group, same city, or emergency)
  const requests = DB.get(LS_KEYS.REQUESTS, [])
    .filter(r => r.bloodGroup === donor.bloodGroup)
    .sort((a, b) => b.createdAt - a.createdAt);

  const list = document.getElementById('requestList');
  if (requests.length === 0) {
    list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-inbox"></i><p>No matching requests right now.</p></div>`;
  } else {
    list.innerHTML = `<div class="req-list">${requests.map(r => `
      <div class="req-item ${r.emergency ? 'emergency' : ''}">
        <div class="req-info">
          <h3>${r.patientName} · <span class="badge badge-blood">${r.bloodGroup}</span></h3>
          <p><i class="fa-solid fa-hospital"></i> ${r.hospital} · ${r.city} · ${r.units} unit${r.units>1?'s':''}</p>
        </div>
        <div class="req-meta">
          ${r.emergency ? '<span class="badge badge-emergency"><i class="fa-solid fa-bolt"></i> Emergency</span>' : '<span class="badge badge-normal">Normal</span>'}
          <a href="tel:" class="btn btn-primary btn-sm"><i class="fa-solid fa-phone"></i> Respond</a>
        </div>
      </div>
    `).join('')}</div>`;
  }

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem(LS_KEYS.SESSION);
    window.location.href = 'index.html';
  });
})();
