// Admin Dashboard
(function() {
  const session = DB.get(LS_KEYS.SESSION, null);
  if (!session || session.role !== 'admin') {
    window.location.href = 'login.html';
    return;
  }

  function render() {
    const donors = DB.get(LS_KEYS.DONORS, []);
    const patients = DB.get(LS_KEYS.PATIENTS, []);
    const requests = DB.get(LS_KEYS.REQUESTS, []);

    document.getElementById('statDonors').textContent = donors.length;
    document.getElementById('statPatients').textContent = patients.length;
    document.getElementById('statRequests').textContent = requests.length;

    const donorTable = document.getElementById('donorTable');
    donorTable.innerHTML = donors.length ? donors.map(d => `
      <tr>
        <td>${d.name}</td>
        <td><span class="badge badge-blood">${d.bloodGroup}</span></td>
        <td>${d.city}</td>
        <td>${d.phone}</td>
        <td><span class="availability ${d.available?'yes':'no'}" style="margin:0;">${d.available?'Available':'Unavailable'}</span></td>
        <td><button class="icon-btn danger" data-del-donor="${d.id}"><i class="fa-solid fa-trash"></i></button></td>
      </tr>
    `).join('') : `<tr><td colspan="6"><div class="empty-state"><i class="fa-solid fa-users-slash"></i><p>No donors registered.</p></div></td></tr>`;

    const patientTable = document.getElementById('patientTable');
    patientTable.innerHTML = patients.length ? patients.map(p => `
      <tr>
        <td>${p.name}</td>
        <td><span class="badge badge-blood">${p.bloodGroup}</span></td>
        <td>${p.city}</td>
        <td>${p.phone}</td>
        <td>${p.email}</td>
        <td><button class="icon-btn danger" data-del-patient="${p.id}"><i class="fa-solid fa-trash"></i></button></td>
      </tr>
    `).join('') : `<tr><td colspan="6"><div class="empty-state"><i class="fa-solid fa-user-slash"></i><p>No patients registered.</p></div></td></tr>`;

    const requestTable = document.getElementById('requestTable');
    requestTable.innerHTML = requests.length ? requests.map(r => `
      <tr>
        <td>${r.patientName}</td>
        <td><span class="badge badge-blood">${r.bloodGroup}</span></td>
        <td>${r.hospital}</td>
        <td>${r.units}</td>
        <td>${r.emergency ? '<span class="badge badge-emergency">Emergency</span>' : '<span class="badge badge-normal">Normal</span>'}</td>
        <td><button class="icon-btn danger" data-del-request="${r.id}"><i class="fa-solid fa-trash"></i></button></td>
      </tr>
    `).join('') : `<tr><td colspan="6"><div class="empty-state"><i class="fa-solid fa-clipboard"></i><p>No requests yet.</p></div></td></tr>`;

    document.querySelectorAll('[data-del-donor]').forEach(b => b.onclick = () => del(LS_KEYS.DONORS, b.dataset.delDonor));
    document.querySelectorAll('[data-del-patient]').forEach(b => b.onclick = () => del(LS_KEYS.PATIENTS, b.dataset.delPatient));
    document.querySelectorAll('[data-del-request]').forEach(b => b.onclick = () => del(LS_KEYS.REQUESTS, b.dataset.delRequest));
  }

  function del(key, id) {
    if (!confirm('Delete this entry?')) return;
    DB.remove(key, id);
    render();
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem(LS_KEYS.SESSION);
    window.location.href = 'index.html';
  });

  render();
})();
