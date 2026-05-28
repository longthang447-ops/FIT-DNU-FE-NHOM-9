// ─── MY BOOKINGS (MockAPI) ─────────────────────────────────────────────────
      const BOOKING_API_URL = 'https://69fc3868fce564e2591782fe.mockapi.io/api/v1/booking';
      const ROOM_API_URL    = 'https://69fc3868fce564e2591782fe.mockapi.io/api/v1/room';

      function openMyBookings() {
        if (!currentUser) { showToast('🔐 Vui lòng đăng nhập trước'); return; }
        const ov = document.getElementById('bookingsOverlay');
        const md = document.getElementById('bookingsModal');
        ov.style.display = 'flex'; ov.style.pointerEvents = 'all';
        requestAnimationFrame(() => { ov.style.opacity = '1'; md.style.transform = 'scale(1) translateY(0)'; });
        document.getElementById('bookingSubtitle').textContent = 'Đang tải dữ liệu...';
        document.getElementById('bookingsList').innerHTML = '<div style="text-align:center;padding:3rem 1rem;color:var(--mist);">⏳ Đang tải đặt phòng...</div>';

        fetch(BOOKING_API_URL)
          .then(r => r.json())
          .then(bookings => {
            const mine = bookings.filter(b =>
              b.customerName === currentUser.name ||
              b.phone === currentUser.email
            );
            document.getElementById('bookingSubtitle').textContent =
              mine.length > 0 ? `${mine.length} đặt phòng của bạn` : 'Chưa có đặt phòng nào';
            if (mine.length === 0) {
              document.getElementById('bookingsList').innerHTML = `
                <div style="text-align:center;padding:3rem 1rem;">
                  <div style="font-size:3rem;margin-bottom:1rem;">🏨</div>
                  <div style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;color:var(--ink);margin-bottom:0.5rem;">Chưa có đặt phòng nào</div>
                  <div style="font-size:0.85rem;color:var(--mist);">Hãy khám phá và đặt phòng ngay hôm nay!</div>
                  <a href="#hotels" onclick="closeBookings()" style="display:inline-block;margin-top:1.5rem;padding:0.65rem 1.5rem;background:linear-gradient(135deg,var(--gold),var(--gold-dark));border-radius:12px;font-weight:600;font-size:0.85rem;color:var(--ink);">Khám phá ngay →</a>
                </div>`;
              return;
            }
            document.getElementById('bookingsList').innerHTML = mine.map(b => `
              <div style="border:1px solid var(--parchment);border-radius:16px;padding:1.25rem;margin-bottom:1rem;background:var(--white);">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.75rem;">
                  <div>
                    <div style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:700;color:var(--ink);">Phòng #${b.roomId || b.id}</div>
                    <div style="font-size:0.75rem;color:var(--mist);margin-top:0.15rem;">Mã đặt: <strong>#${b.id}</strong></div>
                  </div>
                  <span style="background:${b.status==='confirmed'?'var(--jade)':'#EF9F27'};color:#fff;font-size:0.7rem;font-weight:600;padding:0.3rem 0.8rem;border-radius:2rem;">${b.status==='confirmed'?'✅ Đã xác nhận':'⏳ Chờ xử lý'}</span>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;font-size:0.82rem;color:var(--ink-soft);">
                  <div>📅 Nhận: <strong>${b.checkIn||'—'}</strong></div>
                  <div>📅 Trả: <strong>${b.checkOut||'—'}</strong></div>
                  <div>👥 Khách: <strong>${b.guests||2}</strong></div>
                  <div>👤 <strong>${b.customerName||currentUser.name}</strong></div>
                </div>
              </div>
            `).join('');
          })
          .catch(() => {
            document.getElementById('bookingsList').innerHTML = '<div style="text-align:center;padding:2rem;color:var(--mist);">❌ Không thể tải dữ liệu. Vui lòng thử lại.</div>';
          });
      }

      function closeBookings() {
        const ov = document.getElementById('bookingsOverlay');
        const md = document.getElementById('bookingsModal');
        ov.style.opacity = '0'; md.style.transform = 'scale(0.92) translateY(20px)';
        setTimeout(() => { ov.style.display = 'none'; ov.style.pointerEvents = 'none'; }, 300);
      }

      // ─── BOOKING FORM ──────────────────────────────────────────────────────────
      let _currentBookingHotelName = '';
      let _currentBookingRoomId = null;

      function openBookingForm(hotelName, roomId) {
        if (!currentUser) { showToast('🔐 Vui lòng đăng nhập để đặt phòng'); setTimeout(()=>openAuth('login'),600); return; }
        _currentBookingHotelName = hotelName;
        _currentBookingRoomId = roomId || '1';
        document.getElementById('bookFormHotelName').textContent = hotelName;
        // Pre-fill dates from search card
        const ci = document.getElementById('checkin')?.value;
        const co = document.getElementById('checkout')?.value;
        if (ci) document.getElementById('bfCheckin').value = ci;
        if (co) document.getElementById('bfCheckout').value = co;
        const ov = document.getElementById('bookFormOverlay');
        const md = document.getElementById('bookFormModal');
        ov.style.display = 'flex'; ov.style.pointerEvents = 'all';
        requestAnimationFrame(() => { ov.style.opacity = '1'; md.style.transform = 'scale(1) translateY(0)'; });
      }

      function closeBookForm() {
        const ov = document.getElementById('bookFormOverlay');
        const md = document.getElementById('bookFormModal');
        ov.style.opacity = '0'; md.style.transform = 'scale(0.92) translateY(20px)';
        setTimeout(() => { ov.style.display = 'none'; ov.style.pointerEvents = 'none'; }, 300);
      }

      function submitBookingForm() {
        const checkin  = document.getElementById('bfCheckin').value;
        const checkout = document.getElementById('bfCheckout').value;
        const guests   = document.getElementById('bfGuests').value;
        if (!checkin || !checkout) { showToast('⚠️ Vui lòng chọn ngày nhận và trả phòng'); return; }
        if (checkin >= checkout) { showToast('⚠️ Ngày trả phòng phải sau ngày nhận phòng'); return; }

        const btn = document.getElementById('bfSubmitBtn');
        btn.textContent = '⏳ Đang xử lý...'; btn.style.opacity = '0.7'; btn.disabled = true;

        const payload = {
          roomId:       String(_currentBookingRoomId || '1'),
          customerName: currentUser.name,
          phone:        currentUser.email,
          checkIn:      checkin,
          checkOut:     checkout,
          guests:       Number(guests),
          status:       'confirmed'
        };

        fetch(BOOKING_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        .then(r => r.json())
        .then(data => {
          closeBookForm();
          showToast('✅ Đặt phòng thành công! Mã: #' + data.id);
        })
        .catch(() => {
          showToast('❌ Đặt phòng thất bại, vui lòng thử lại');
        })
        .finally(() => {
          btn.textContent = 'Xác nhận đặt phòng →'; btn.style.opacity = '1'; btn.disabled = false;
        });
      }

      // Hook into existing book buttons on hotel cards
      function bookHotelCard(hotel) {
        openBookingForm(hotel.name, hotel.id);
      }
