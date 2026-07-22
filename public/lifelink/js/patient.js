// Patient Dashboard
(function() {
  const session = DB.get(LS_KEYS.SESSION, null);
  if (!session || session.role !== 'patient') {
    window.location.href = 'login.html';
    return;
  }

  const patient = DB.get(LS_KEYS.PATIENTS, []).find(p => p.id === session.refId);
  if (!patient) { window.location.href = 'login.html'; return; }

  document.getElementById('patientName').textContent = patient.name;

  const myReqs = DB.get(LS_KEYS.REQUESTS, [])
    .filter(r => r.patientId === patient.id || r.patientName === patient.name)
    .sort((a, b) => b.createdAt - a.createdAt);

  const list = document.getElementById('myRequests');
  if (myReqs.length === 0) {
    list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-clipboard"></i><p>No requests yet. <a href="request.html" style="color:var(--primary);font-weight:600;">Create one</a></p></div>`;
  } else {
    list.innerHTML = `<div class="req-list">${myReqs.map(r => `
      <div class="req-item ${r.emergency ? 'emergency' : ''}">
        <div class="req-info">
          <h3>${r.patientName} · <span class="badge badge-blood">${r.bloodGroup}</span></h3>
          <p><i class="fa-solid fa-hospital"></i> ${r.hospital} · ${r.city} · ${r.units} unit${r.units>1?'s':''}</p>
        </div>
        <div class="req-meta">
          ${r.emergency ? '<span class="badge badge-emergency"><i class="fa-solid fa-bolt"></i> Emergency</span>' : '<span class="badge badge-normal">Normal</span>'}
          <button class="icon-btn danger" data-del="${r.id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `).join('')}</div>`;

    list.querySelectorAll('[data-del]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Delete this request?')) {
          DB.remove(LS_KEYS.REQUESTS, btn.dataset.del);
          location.reload();
        }
      });
    });
  }

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem(LS_KEYS.SESSION);
    window.location.href = 'index.html';
  });
})();
