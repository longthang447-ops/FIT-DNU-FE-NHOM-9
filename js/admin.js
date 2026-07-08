// ─── ADMIN PANEL ──────────────────────────────────────────────────────────
const ADMIN_CREDENTIALS = { email: 'admin@stayeassy.vn', password: 'Admin@2024' };
let _adminCurrentTab = 'dashboard';

function openAdminPanel() {
  if (!currentUser) { showToast('🔐 Vui lòng đăng nhập trước'); return; }
  document.getElementById('adminLoginLabel').textContent = currentUser.name;
  const ov = document.getElementById('adminOverlay');
  const md = document.getElementById('adminModal');
  ov.style.display = 'flex';
  ov.style.pointerEvents = 'all';
  requestAnimationFrame(() => {
    ov.style.opacity = '1';
    md.style.transform = 'translateY(0)';
  });
  toggleUserMenu();
  adminTab('dashboard');
}

function closeAdminPanel() {
  const ov = document.getElementById('adminOverlay');
  const md = document.getElementById('adminModal');
  ov.style.opacity = '0';
  md.style.transform = 'translateY(20px)';
  setTimeout(() => { ov.style.display = 'none'; ov.style.pointerEvents = 'none'; }, 300);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('adminOverlay').style.display !== 'none') closeAdminPanel();
});

function adminTab(tab) {
  _adminCurrentTab = tab;
  // Update nav buttons
  document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active-admin-tab'));
  const navBtn = document.getElementById('aTab-' + tab);
  if (navBtn) navBtn.classList.add('active-admin-tab');
  // Update sidebar buttons
  document.querySelectorAll('.admin-sidebar-btn').forEach(b => b.classList.remove('active-sidebar'));
  const sideBtn = document.getElementById('aSide-' + tab);
  if (sideBtn) sideBtn.classList.add('active-sidebar');

  const content = document.getElementById('adminContent');
  content.innerHTML = '<div style="text-align:center;padding:3rem;color:rgba(255,255,255,0.3);">⏳ Đang tải...</div>';

  if (tab === 'dashboard') renderAdminDashboard();
  else if (tab === 'bookings') renderAdminBookings();
  else if (tab === 'rooms') renderAdminRooms();
  else if (tab === 'customers') renderAdminCustomers();
  else if (tab === 'settings') renderAdminSettings();
}

// ─── DASHBOARD TAB ────────────────────────────────────────────────────────
function renderAdminDashboard() {
  Promise.all([
    fetch('https://69fc3868fce564e2591782fe.mockapi.io/api/v1/booking').then(r => r.json()),
    fetch('https://69fc3868fce564e2591782fe.mockapi.io/api/v1/room').then(r => r.json()).catch(() => [])
  ]).then(([bookings, rooms]) => {
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const pending = bookings.filter(b => b.status !== 'confirmed').length;
    const revenue = bookings.length * 2450000;
    const recentBookings = bookings.slice(-5).reverse();

    document.getElementById('adminContent').innerHTML = `
      <div style="margin-bottom:2rem;">
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:700;color:#fff;margin-bottom:0.25rem;">Tổng quan hệ thống</h2>
        <p style="font-size:0.8rem;color:rgba(255,255,255,0.35);">Cập nhật theo thời gian thực từ MockAPI</p>
      </div>

      <!-- KPI Cards -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1.25rem;margin-bottom:2rem;">
        <div class="admin-stat-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem;">
            <div style="font-size:0.7rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Tổng đặt phòng</div>
            <div style="background:rgba(200,169,110,0.15);width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;">📋</div>
          </div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:2.4rem;font-weight:700;color:#fff;">${bookings.length}</div>
          <div style="font-size:0.72rem;color:rgba(45,122,95,0.9);margin-top:0.3rem;">↑ ${Math.floor(bookings.length * 0.12)} so với tuần trước</div>
        </div>
        <div class="admin-stat-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem;">
            <div style="font-size:0.7rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Đã xác nhận</div>
            <div style="background:rgba(45,122,95,0.15);width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;">✅</div>
          </div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:2.4rem;font-weight:700;color:#4caf8a;">${confirmed}</div>
          <div style="font-size:0.72rem;color:rgba(255,255,255,0.35);margin-top:0.3rem;">${bookings.length > 0 ? Math.round(confirmed/bookings.length*100) : 0}% tỷ lệ xác nhận</div>
        </div>
        <div class="admin-stat-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem;">
            <div style="font-size:0.7rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Chờ xử lý</div>
            <div style="background:rgba(239,159,39,0.15);width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;">⏳</div>
          </div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:2.4rem;font-weight:700;color:#EF9F27;">${pending}</div>
          <div style="font-size:0.72rem;color:rgba(239,159,39,0.7);margin-top:0.3rem;">Cần xem xét ngay</div>
        </div>
        <div class="admin-stat-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem;">
            <div style="font-size:0.7rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Doanh thu ước tính</div>
            <div style="background:rgba(200,169,110,0.15);width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;">💰</div>
          </div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:700;color:var(--gold);">${(revenue/1000000).toFixed(1)}M₫</div>
          <div style="font-size:0.72rem;color:rgba(255,255,255,0.35);margin-top:0.3rem;">≈ ${(revenue/23000).toFixed(0)} USD</div>
        </div>
      </div>

      <!-- Recent Bookings + Quick Actions -->
      <div style="display:grid;grid-template-columns:1fr 300px;gap:1.5rem;">
        <!-- Recent Table -->
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;overflow:hidden;">
          <div style="padding:1.25rem 1.5rem;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;align-items:center;">
            <div style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:700;color:#fff;">Đặt phòng gần đây</div>
            <button onclick="adminTab('bookings')" style="font-size:0.75rem;color:var(--gold);background:transparent;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;">Xem tất cả →</button>
          </div>
          <table class="admin-table">
            <thead><tr><th>Mã</th><th>Khách hàng</th><th>Check-in</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              ${recentBookings.map(b => `
                <tr>
                  <td><strong style="color:var(--gold)">#${b.id}</strong></td>
                  <td>${b.customerName || '—'}</td>
                  <td>${b.checkIn || '—'}</td>
                  <td><span class="status-badge ${b.status==='confirmed'?'status-confirmed':'status-pending'}">${b.status==='confirmed'?'✅ Xác nhận':'⏳ Chờ'}</span></td>
                  <td><button class="admin-action-btn" onclick="adminViewBooking('${b.id}')">Chi tiết</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Quick Actions -->
        <div style="display:flex;flex-direction:column;gap:1rem;">
          <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.25rem;">
            <div style="font-family:'Cormorant Garamond',serif;font-size:1rem;font-weight:700;color:#fff;margin-bottom:1rem;">Thao tác nhanh</div>
            <div style="display:flex;flex-direction:column;gap:0.5rem;">
              <button onclick="adminTab('bookings')" style="padding:0.7rem 1rem;background:rgba(200,169,110,0.1);border:1px solid rgba(200,169,110,0.2);border-radius:10px;color:var(--gold);font-family:'DM Sans',sans-serif;font-size:0.8rem;cursor:pointer;text-align:left;transition:background 0.15s;" onmouseover="this.style.background='rgba(200,169,110,0.18)'" onmouseout="this.style.background='rgba(200,169,110,0.1)'">📋 Xem đặt phòng mới</button>
              <button onclick="adminTab('rooms')" style="padding:0.7rem 1rem;background:rgba(45,122,95,0.1);border:1px solid rgba(45,122,95,0.2);border-radius:10px;color:#4caf8a;font-family:'DM Sans',sans-serif;font-size:0.8rem;cursor:pointer;text-align:left;transition:background 0.15s;" onmouseover="this.style.background='rgba(45,122,95,0.18)'" onmouseout="this.style.background='rgba(45,122,95,0.1)'">🏨 Quản lý phòng</button>
              <button onclick="showToast('📊 Đang tạo báo cáo...')" style="padding:0.7rem 1rem;background:rgba(26,111,232,0.1);border:1px solid rgba(26,111,232,0.2);border-radius:10px;color:#6da8f8;font-family:'DM Sans',sans-serif;font-size:0.8rem;cursor:pointer;text-align:left;transition:background 0.15s;" onmouseover="this.style.background='rgba(26,111,232,0.18)'" onmouseout="this.style.background='rgba(26,111,232,0.1)'">📥 Xuất báo cáo PDF</button>
              <button onclick="showToast('📢 Gửi thông báo đến tất cả khách hàng...')" style="padding:0.7rem 1rem;background:rgba(239,159,39,0.1);border:1px solid rgba(239,159,39,0.2);border-radius:10px;color:#EF9F27;font-family:'DM Sans',sans-serif;font-size:0.8rem;cursor:pointer;text-align:left;" onmouseover="this.style.background='rgba(239,159,39,0.18)'" onmouseout="this.style.background='rgba(239,159,39,0.1)'">📢 Gửi thông báo</button>
            </div>
          </div>
          <div style="background:linear-gradient(135deg,rgba(200,169,110,0.12),rgba(200,169,110,0.04));border:1px solid rgba(200,169,110,0.2);border-radius:16px;padding:1.25rem;">
            <div style="font-size:0.7rem;font-weight:600;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.75rem;">Tỷ lệ lấp đầy</div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;color:var(--gold);">87.3%</div>
            <div style="margin-top:0.75rem;background:rgba(255,255,255,0.1);border-radius:4px;height:6px;overflow:hidden;">
              <div style="width:87.3%;height:100%;background:linear-gradient(90deg,var(--gold),var(--gold-dark));border-radius:4px;"></div>
            </div>
            <div style="font-size:0.72rem;color:rgba(255,255,255,0.35);margin-top:0.5rem;">Tuần này · Cao hơn 5.2% so với tuần trước</div>
          </div>
        </div>
      </div>
    `;
  }).catch(() => {
    document.getElementById('adminContent').innerHTML = '<div style="text-align:center;padding:3rem;color:rgba(255,255,255,0.3);">❌ Không thể tải dữ liệu. Kiểm tra kết nối API.</div>';
  });
}

// ─── BOOKINGS TAB ─────────────────────────────────────────────────────────
function renderAdminBookings() {
  fetch('https://69fc3868fce564e2591782fe.mockapi.io/api/v1/booking')
    .then(r => r.json())
    .then(bookings => {
      document.getElementById('adminContent').innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
          <div>
            <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:700;color:#fff;margin-bottom:0.2rem;">Quản lý đặt phòng</h2>
            <p style="font-size:0.8rem;color:rgba(255,255,255,0.35);">${bookings.length} đặt phòng tổng cộng</p>
          </div>
          <div style="display:flex;gap:0.75rem;align-items:center;">
            <input id="bookingSearch" placeholder="🔍 Tìm theo tên, mã..." oninput="filterAdminBookings(this.value)" style="padding:0.6rem 1rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:0.82rem;outline:none;width:220px;" onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
            <select id="bookingFilter" onchange="filterAdminBookings(document.getElementById('bookingSearch').value)" style="padding:0.6rem 1rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:0.82rem;outline:none;">
              <option value="all">Tất cả trạng thái</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="pending">Chờ xử lý</option>
            </select>
          </div>
        </div>

        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;overflow:hidden;">
          <table class="admin-table" id="bookingsTable">
            <thead>
              <tr>
                <th>Mã ĐP</th>
                <th>Khách hàng</th>
                <th>Phòng</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Khách</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody id="bookingsTbody">
              ${renderBookingRows(bookings)}
            </tbody>
          </table>
        </div>
      `;
      // Store data for filtering
      window._adminBookings = bookings;
    })
    .catch(() => {
      document.getElementById('adminContent').innerHTML = '<div style="text-align:center;padding:3rem;color:rgba(255,255,255,0.3);">❌ Không thể tải dữ liệu đặt phòng.</div>';
    });
}

function renderBookingRows(bookings) {
  if (bookings.length === 0) return `<tr><td colspan="8" style="text-align:center;padding:2rem;color:rgba(255,255,255,0.3);">Không có đặt phòng nào</td></tr>`;
  return bookings.map(b => `
    <tr id="brow-${b.id}">
      <td><strong style="color:var(--gold)">#${b.id}</strong></td>
      <td>
        <div style="font-weight:500;color:#fff;">${b.customerName || '—'}</div>
        <div style="font-size:0.7rem;color:rgba(255,255,255,0.35);">${b.phone || ''}</div>
      </td>
      <td>Phòng #${b.roomId || '—'}</td>
      <td>${b.checkIn || '—'}</td>
      <td>${b.checkOut || '—'}</td>
      <td style="text-align:center;">${b.guests || 2}</td>
      <td>
        <span class="status-badge ${b.status==='confirmed'?'status-confirmed':'status-pending'}">
          ${b.status==='confirmed'?'✅ Xác nhận':'⏳ Chờ'}
        </span>
      </td>
      <td>
        <div style="display:flex;gap:0.4rem;">
          <button class="admin-action-btn" onclick="adminConfirmBooking('${b.id}')">✓ Duyệt</button>
          <button class="admin-action-btn danger" onclick="adminDeleteBooking('${b.id}')">🗑</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterAdminBookings(query) {
  const filter = document.getElementById('bookingFilter').value;
  let list = window._adminBookings || [];
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(b => (b.customerName||'').toLowerCase().includes(q) || String(b.id).includes(q) || (b.phone||'').toLowerCase().includes(q));
  }
  if (filter !== 'all') list = list.filter(b => b.status === filter);
  document.getElementById('bookingsTbody').innerHTML = renderBookingRows(list);
}

function adminConfirmBooking(id) {
  fetch(`https://69fc3868fce564e2591782fe.mockapi.io/api/v1/booking/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'confirmed' })
  }).then(() => {
    showToast(`✅ Đã xác nhận đặt phòng #${id}`);
    // Update in local cache
    if (window._adminBookings) {
      const b = window._adminBookings.find(x => x.id === id);
      if (b) b.status = 'confirmed';
      filterAdminBookings(document.getElementById('bookingSearch')?.value || '');
    }
  }).catch(() => showToast('❌ Không thể cập nhật. Thử lại.'));
}

function adminDeleteBooking(id) {
  if (!confirm(`Xóa đặt phòng #${id}? Hành động này không thể hoàn tác.`)) return;
  fetch(`https://69fc3868fce564e2591782fe.mockapi.io/api/v1/booking/${id}`, { method: 'DELETE' })
    .then(() => {
      showToast(`🗑️ Đã xóa đặt phòng #${id}`);
      if (window._adminBookings) {
        window._adminBookings = window._adminBookings.filter(x => x.id !== id);
        filterAdminBookings(document.getElementById('bookingSearch')?.value || '');
      }
    }).catch(() => showToast('❌ Không thể xóa. Thử lại.'));
}

function adminViewBooking(id) {
  adminTab('bookings');
  setTimeout(() => {
    const el = document.getElementById('brow-' + id);
    if (el) { el.style.background = 'rgba(200,169,110,0.1)'; el.scrollIntoView({behavior:'smooth', block:'center'}); }
  }, 600);
}

// ─── ROOMS TAB ────────────────────────────────────────────────────────────
function renderAdminRooms() {
  fetch('https://69fc3868fce564e2591782fe.mockapi.io/api/v1/room')
    .then(r => r.json())
    .then(rooms => {
      renderAdminRoomsContent(rooms);
      window._adminRooms = rooms;
    })
    .catch(() => {
      // Fallback: show hotel data as mock rooms
      const mockRooms = hotels.map(h => ({ id: h.id, name: h.name, type: h.type, price: h.price, status: 'available', capacity: 2 }));
      renderAdminRoomsContent(mockRooms);
      window._adminRooms = mockRooms;
    });
}

function renderAdminRoomsContent(rooms) {
  document.getElementById('adminContent').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
      <div>
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:700;color:#fff;margin-bottom:0.2rem;">Quản lý phòng</h2>
        <p style="font-size:0.8rem;color:rgba(255,255,255,0.35);">${rooms.length} phòng trong hệ thống</p>
      </div>
      <button onclick="adminAddRoom()" style="padding:0.65rem 1.25rem;background:linear-gradient(135deg,var(--gold),var(--gold-dark));border:none;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:0.85rem;font-weight:600;color:var(--ink);cursor:pointer;">+ Thêm phòng mới</button>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.25rem;" id="roomsGrid">
      ${renderRoomCards(rooms)}
    </div>
  `;
}

// Lưu ảnh upload theo roomId
if (!window._roomImages) window._roomImages = {};

function adminUploadRoomImage(roomId) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = function() {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      window._roomImages[roomId] = e.target.result;
      const img = document.getElementById('room-img-' + roomId);
      if (img) img.src = e.target.result;
      showToast('✅ Đã cập nhật ảnh phòng!');
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function renderRoomCards(rooms) {
  if (rooms.length === 0) return '<div style="color:rgba(255,255,255,0.3);text-align:center;padding:2rem;grid-column:1/-1;">Chưa có phòng nào trong hệ thống</div>';
  const imgs = [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&q=80',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500&q=80',
    'https://images.unsplash.com/photo-1551882547-ff40c4c97f7b?w=500&q=80',
  ];
  return rooms.map((r, i) => `
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:16px;overflow:hidden;transition:border-color 0.2s;" onmouseover="this.style.borderColor='rgba(200,169,110,0.3)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.07)'">
      <div style="height:140px;overflow:hidden;position:relative;cursor:pointer;" onclick="adminUploadRoomImage('${r.id}')">
        <img id="room-img-${r.id}" src="${window._roomImages && window._roomImages['${r.id}'] ? window._roomImages['${r.id}'] : imgs[i % imgs.length]}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.4s;" onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform='scale(1)'">
        <div style="position:absolute;inset:0;background:rgba(0,0,0,0);display:flex;align-items:center;justify-content:center;transition:background 0.2s;" onmouseover="this.style.background='rgba(0,0,0,0.45)';this.querySelector('span').style.opacity='1'" onmouseout="this.style.background='rgba(0,0,0,0)';this.querySelector('span').style.opacity='0'">
          <span style="opacity:0;color:#fff;font-size:0.8rem;font-weight:600;transition:opacity 0.2s;background:rgba(0,0,0,0.5);padding:0.4rem 0.9rem;border-radius:8px;">📷 Đổi ảnh</span>
        </div>
        <div style="position:absolute;top:0.75rem;right:0.75rem;">
          <span class="status-badge ${(r.status||'available')==='available'?'status-confirmed':'status-pending'}">${(r.status||'available')==='available'?'🟢 Trống':'🔴 Đã đặt'}</span>
        </div>
      </div>
      <div style="padding:1.1rem;">
        <div style="font-weight:600;color:#fff;font-size:0.9rem;margin-bottom:0.2rem;">${r.name || 'Phòng #' + r.id}</div>
        <div style="font-size:0.72rem;color:rgba(255,255,255,0.35);margin-bottom:0.75rem;">Sức chứa: ${r.capacity || 2} người · Loại: ${r.type || 'Standard'}</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:700;color:var(--gold);margin-bottom:0.75rem;">${typeof r.price === 'number' ? r.price.toLocaleString('vi') + '₫' : (r.price || '—') + (typeof r.price==='string'?'₫':'')}/đêm</div>
        <div style="display:flex;gap:0.5rem;">
          <button class="admin-action-btn" style="flex:1;" onclick="adminEditRoom('${r.id}')">✏️ Sửa</button>
          <button class="admin-action-btn danger" onclick="adminDeleteRoom('${r.id}')">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');
}

function adminAddRoom() {
  showAdminFormModal('Thêm phòng mới', [
    { id: 'rName', label: 'Tên phòng / khách sạn', placeholder: 'VD: Deluxe Room 201' },
    { id: 'rType', label: 'Loại phòng', placeholder: 'Standard / Deluxe / Suite' },
    { id: 'rPrice', label: 'Giá / đêm (VNĐ)', placeholder: '1500000', type: 'number' },
    { id: 'rCapacity', label: 'Sức chứa (người)', placeholder: '2', type: 'number' },
  ], (data) => {
    fetch('https://69fc3868fce564e2591782fe.mockapi.io/api/v1/room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: data.rName, type: data.rType, price: Number(data.rPrice), capacity: Number(data.rCapacity), status: 'available' })
    }).then(r => r.json()).then(() => {
      showToast('✅ Đã thêm phòng mới!');
      closeAdminFormModal();
      renderAdminRooms();
    }).catch(() => showToast('❌ Không thể thêm phòng.'));
  });
}

function adminEditRoom(id) {
  const room = (window._adminRooms || []).find(r => String(r.id) === String(id));
  if (!room) return showToast('⚠️ Không tìm thấy phòng');
  showAdminFormModal('Sửa thông tin phòng', [
    { id: 'rName', label: 'Tên phòng', placeholder: 'Tên phòng', value: room.name || '' },
    { id: 'rType', label: 'Loại phòng', placeholder: 'Standard / Deluxe / Suite', value: room.type || '' },
    { id: 'rPrice', label: 'Giá / đêm (VNĐ)', placeholder: '1500000', type: 'number', value: room.price || '' },
    { id: 'rCapacity', label: 'Sức chứa', placeholder: '2', type: 'number', value: room.capacity || 2 },
  ], (data) => {
    fetch(`https://69fc3868fce564e2591782fe.mockapi.io/api/v1/room/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: data.rName, type: data.rType, price: Number(data.rPrice), capacity: Number(data.rCapacity) })
    }).then(() => {
      showToast('✅ Đã cập nhật phòng #' + id);
      closeAdminFormModal();
      renderAdminRooms();
    }).catch(() => showToast('❌ Không thể cập nhật phòng.'));
  });
}

function adminDeleteRoom(id) {
  if (!confirm('Xóa phòng này? Hành động không thể hoàn tác.')) return;
  fetch(`https://69fc3868fce564e2591782fe.mockapi.io/api/v1/room/${id}`, { method: 'DELETE' })
    .then(() => {
      showToast('🗑️ Đã xóa phòng #' + id);
      renderAdminRooms();
    }).catch(() => showToast('❌ Không thể xóa phòng.'));
}

// ─── CUSTOMERS TAB ────────────────────────────────────────────────────────
function renderAdminCustomers() {
  fetch('https://69fc3868fce564e2591782fe.mockapi.io/api/v1/booking')
    .then(r => r.json())
    .then(bookings => {
      // Build customer list from bookings
      const customerMap = {};
      bookings.forEach(b => {
        const key = b.customerName || b.phone || 'Unknown';
        if (!customerMap[key]) customerMap[key] = { name: b.customerName, email: b.phone, bookings: 0, lastBooking: '' };
        customerMap[key].bookings++;
        if (!customerMap[key].lastBooking || b.checkIn > customerMap[key].lastBooking) customerMap[key].lastBooking = b.checkIn;
      });
      const customers = Object.values(customerMap);

      document.getElementById('adminContent').innerHTML = `
        <div style="margin-bottom:1.5rem;">
          <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:700;color:#fff;margin-bottom:0.2rem;">Khách hàng</h2>
          <p style="font-size:0.8rem;color:rgba(255,255,255,0.35);">${customers.length} khách hàng từ lịch sử đặt phòng</p>
        </div>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;overflow:hidden;">
          <table class="admin-table">
            <thead><tr><th>Khách hàng</th><th>Liên hệ</th><th>Số lần đặt</th><th>Lần cuối</th><th>Phân loại</th><th></th></tr></thead>
            <tbody>
              ${customers.map(c => `
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:0.75rem;">
                      <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold-dark));display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;color:var(--ink);flex-shrink:0;">
                        ${(c.name||'?').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}
                      </div>
                      <strong style="color:#fff;">${c.name || '—'}</strong>
                    </div>
                  </td>
                  <td style="color:rgba(255,255,255,0.5);font-size:0.78rem;">${c.email || '—'}</td>
                  <td style="text-align:center;"><strong style="color:var(--gold)">${c.bookings}</strong></td>
                  <td>${c.lastBooking || '—'}</td>
                  <td>
                    <span class="status-badge ${c.bookings >= 3 ? 'status-confirmed' : c.bookings >= 2 ? 'status-pending' : ''}">
                      ${c.bookings >= 3 ? '⭐ VIP' : c.bookings >= 2 ? '🔁 Thường xuyên' : '🆕 Mới'}
                    </span>
                  </td>
                  <td><button class="admin-action-btn" onclick="showToast('📧 Gửi email tới ${c.name||'khách hàng'}...')">✉️ Email</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }).catch(() => {
      // Fallback: tạo dữ liệu mẫu từ hotels
      const mockCustomers = [
        { name: 'Nguyễn Văn An', email: 'an.nguyen@gmail.com', bookings: 4, lastBooking: '2025-05-20' },
        { name: 'Trần Thị Bích', email: 'bich.tran@gmail.com', bookings: 2, lastBooking: '2025-05-18' },
        { name: 'Lê Minh Tuấn', email: 'tuan.le@gmail.com', bookings: 1, lastBooking: '2025-05-15' },
        { name: 'Phạm Hồng Nhung', email: 'nhung.pham@gmail.com', bookings: 3, lastBooking: '2025-05-12' },
        { name: 'Hoàng Đức Thắng', email: 'thang.hoang@gmail.com', bookings: 1, lastBooking: '2025-05-10' },
      ];
      document.getElementById('adminContent').innerHTML = `
        <div style="margin-bottom:1.5rem;">
          <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:700;color:#fff;margin-bottom:0.2rem;">Khách hàng</h2>
          <p style="font-size:0.8rem;color:rgba(255,255,255,0.35);">${mockCustomers.length} khách hàng (dữ liệu mẫu)</p>
        </div>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;overflow:hidden;">
          <table class="admin-table">
            <thead><tr><th>Khách hàng</th><th>Liên hệ</th><th>Số lần đặt</th><th>Lần cuối</th><th>Phân loại</th><th></th></tr></thead>
            <tbody>
              ${mockCustomers.map(c => `
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:0.75rem;">
                      <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold-dark));display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;color:var(--ink);flex-shrink:0;">
                        ${c.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}
                      </div>
                      <strong style="color:#fff;">${c.name}</strong>
                    </div>
                  </td>
                  <td style="color:rgba(255,255,255,0.5);font-size:0.78rem;">${c.email}</td>
                  <td style="text-align:center;"><strong style="color:var(--gold)">${c.bookings}</strong></td>
                  <td>${c.lastBooking}</td>
                  <td>
                    <span class="status-badge ${c.bookings >= 3 ? 'status-confirmed' : c.bookings >= 2 ? 'status-pending' : ''}">
                      ${c.bookings >= 3 ? '⭐ VIP' : c.bookings >= 2 ? '🔁 Thường xuyên' : '🆕 Mới'}
                    </span>
                  </td>
                  <td><button class="admin-action-btn" onclick="showToast('📧 Gửi email tới ${c.name}...')">✉️ Email</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    });
}

// ─── SETTINGS TAB ─────────────────────────────────────────────────────────
function renderAdminSettings() {
  document.getElementById('adminContent').innerHTML = `
    <div style="margin-bottom:2rem;">
      <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:700;color:#fff;margin-bottom:0.2rem;">Cài đặt hệ thống</h2>
      <p style="font-size:0.8rem;color:rgba(255,255,255,0.35);">Cấu hình nền tảng StayEassy</p>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">
      <!-- General Settings -->
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.5rem;">
        <div style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:700;color:var(--gold);margin-bottom:1.25rem;">⚙️ Cài đặt chung</div>
        ${adminSettingField('Tên nền tảng', 'StayEassy')}
        ${adminSettingField('Email hỗ trợ', 'support@stayeassy.vn')}
        ${adminSettingField('Số hotline', '1900 1234')}
        ${adminSettingField('Múi giờ', 'GMT+7 (Hà Nội)')}
        <button onclick="showToast('✅ Đã lưu cài đặt chung!')" style="margin-top:1rem;padding:0.65rem 1.5rem;background:linear-gradient(135deg,var(--gold),var(--gold-dark));border:none;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:0.85rem;font-weight:600;color:var(--ink);cursor:pointer;">Lưu thay đổi</button>
      </div>

      <!-- API Settings -->
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.5rem;">
        <div style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:700;color:var(--gold);margin-bottom:1.25rem;">🔌 Cấu hình API</div>
        ${adminSettingField('Booking API URL', 'mockapi.io/api/v1/booking', true)}
        ${adminSettingField('Room API URL', 'mockapi.io/api/v1/room', true)}
        ${adminSettingField('Timeout (ms)', '5000')}
        <div style="margin-top:1rem;padding:0.75rem;background:rgba(45,122,95,0.1);border-radius:10px;border:1px solid rgba(45,122,95,0.2);">
          <div style="font-size:0.75rem;color:#4caf8a;font-weight:600;">🟢 API kết nối bình thường</div>
          <div style="font-size:0.7rem;color:rgba(255,255,255,0.35);margin-top:0.2rem;">Phản hồi trung bình: 210ms</div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.5rem;">
        <div style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:700;color:var(--gold);margin-bottom:1.25rem;">🔔 Thông báo</div>
        ${adminToggle('Gửi email xác nhận đặt phòng', true)}
        ${adminToggle('Thông báo đặt phòng mới cho admin', true)}
        ${adminToggle('Nhắc nhở check-in trước 24h', true)}
        ${adminToggle('Báo cáo hàng tuần qua email', false)}
        ${adminToggle('Thông báo đánh giá mới', true)}
      </div>

      <!-- Security -->
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.5rem;">
        <div style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:700;color:var(--gold);margin-bottom:1.25rem;">🔒 Bảo mật</div>
        ${adminSettingField('Tài khoản admin', 'admin@stayeassy.vn')}
        <div style="margin-bottom:1rem;">
          <label style="font-size:0.72rem;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:0.06em;text-transform:uppercase;display:block;margin-bottom:0.4rem;">Mật khẩu mới</label>
          <input type="password" placeholder="••••••••" style="width:100%;padding:0.65rem 1rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:0.85rem;outline:none;box-sizing:border-box;" onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='rgba(255,255,255,0.08)'">
        </div>
        <button onclick="showToast('🔒 Đã cập nhật mật khẩu admin!')" style="padding:0.65rem 1.5rem;background:rgba(192,57,43,0.15);border:1px solid rgba(192,57,43,0.3);border-radius:10px;font-family:'DM Sans',sans-serif;font-size:0.85rem;font-weight:600;color:#e57373;cursor:pointer;">Đổi mật khẩu</button>
      </div>
    </div>
  `;
}

function adminSettingField(label, value, readonly = false) {
  return `
    <div style="margin-bottom:1rem;">
      <label style="font-size:0.72rem;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:0.06em;text-transform:uppercase;display:block;margin-bottom:0.4rem;">${label}</label>
      <input type="text" value="${value}" ${readonly ? 'readonly' : ''} style="width:100%;padding:0.65rem 1rem;background:${readonly ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)'};border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:${readonly ? 'rgba(255,255,255,0.4)' : '#fff'};font-family:'DM Sans',sans-serif;font-size:0.85rem;outline:none;box-sizing:border-box;" onfocus="if(!this.readOnly)this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='rgba(255,255,255,0.08)'">
    </div>
  `;
}

function adminToggle(label, checked) {
  const id = 'tog' + Math.random().toString(36).slice(2, 8);
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.9rem;">
      <span style="font-size:0.82rem;color:rgba(255,255,255,0.65);">${label}</span>
      <label style="position:relative;display:inline-block;width:38px;height:20px;cursor:pointer;">
        <input type="checkbox" id="${id}" ${checked ? 'checked' : ''} style="opacity:0;width:0;height:0;" onchange="showToast('⚙️ Cài đặt đã cập nhật')">
        <span style="position:absolute;inset:0;background:${checked ? 'var(--jade)' : 'rgba(255,255,255,0.15)'};border-radius:20px;transition:background 0.2s;" id="track-${id}"></span>
        <span style="position:absolute;left:${checked ? '20px' : '3px'};top:3px;width:14px;height:14px;background:#fff;border-radius:50%;transition:left 0.2s;" id="thumb-${id}"></span>
      </label>
    </div>
  `;
}

// ─── GENERIC FORM MODAL ───────────────────────────────────────────────────
function showAdminFormModal(title, fields, onSubmit) {
  const existing = document.getElementById('adminFormModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'adminFormModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:900;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;padding:1rem;';
  modal.onclick = e => { if (e.target === modal) closeAdminFormModal(); };

  modal.innerHTML = `
    <div style="background:#1e1a18;border:1px solid rgba(200,169,110,0.2);border-radius:20px;width:min(440px,96vw);overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,0.5);">
      <div style="background:rgba(200,169,110,0.08);padding:1.5rem 1.75rem;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(200,169,110,0.15);">
        <div style="font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:700;color:var(--gold);">${title}</div>
        <button onclick="closeAdminFormModal()" style="width:30px;height:30px;border-radius:50%;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.6);cursor:pointer;">✕</button>
      </div>
      <div style="padding:1.75rem;">
        ${fields.map(f => `
          <div style="margin-bottom:1rem;">
            <label style="font-size:0.72rem;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:0.06em;text-transform:uppercase;display:block;margin-bottom:0.4rem;">${f.label}</label>
            <input id="${f.id}" type="${f.type||'text'}" placeholder="${f.placeholder}" value="${f.value||''}" style="width:100%;padding:0.7rem 1rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:0.875rem;outline:none;box-sizing:border-box;" onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
          </div>
        `).join('')}
        <div style="display:flex;gap:0.75rem;margin-top:1.5rem;">
          <button onclick="closeAdminFormModal()" style="flex:1;padding:0.75rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:12px;color:rgba(255,255,255,0.6);font-family:'DM Sans',sans-serif;cursor:pointer;">Hủy</button>
          <button id="adminFormSubmit" style="flex:2;padding:0.75rem;background:linear-gradient(135deg,var(--gold),var(--gold-dark));border:none;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:600;color:var(--ink);cursor:pointer;">Lưu</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('adminFormSubmit').onclick = () => {
    const data = {};
    fields.forEach(f => { data[f.id] = document.getElementById(f.id).value.trim(); });
    onSubmit(data);
  };
}

function closeAdminFormModal() {
  const m = document.getElementById('adminFormModal');
  if (m) m.remove();
}
