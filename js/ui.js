// ─── MOBILE NAV ────────────────────────────────────────────────────────────
      function toggleMobileNav(force) {
        const btn = document.getElementById('navToggleBtn');
        const links = document.querySelector('.nav-links');
        const overlay = document.getElementById('mobileNavOverlay');
        if (!btn || !links || !overlay) return;
        const open = typeof force === 'boolean' ? force : !links.classList.contains('open');
        links.classList.toggle('open', open);
        btn.classList.toggle('open', open);
        overlay.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
      }
      // Đóng menu mobile khi bấm 1 mục
      document.addEventListener('click', function (e) {
        const links = document.querySelector('.nav-links');
        if (links && links.classList.contains('open') && e.target.closest('.nav-links a')) {
          toggleMobileNav(false);
        }
      });
      // Đóng menu mobile nếu resize lên desktop
      window.addEventListener('resize', function () {
        if (window.innerWidth > 900) toggleMobileNav(false);
      });

// ─── SEARCH ────────────────────────────────────────────────────────────────
      function doSearch() {
        const checkin  = document.getElementById('checkin').value;
        const checkout = document.getElementById('checkout').value;
        const starsVal = document.getElementById('searchStars')?.value || 'Tất cả hạng';

        if (checkin && checkout && checkin >= checkout) {
          showToast('⚠️ Ngày trả phòng phải sau ngày nhận phòng');
          return;
        }

        let results = [...hotels];

        // Lọc theo số sao
        if (starsVal.includes('3 sao')) results = results.filter(h => h.stars === 3);
        else if (starsVal.includes('4 sao')) results = results.filter(h => h.stars === 4);
        else if (starsVal.includes('5 sao')) results = results.filter(h => h.stars === 5);

        renderHotels(results);

        // Scroll xuống khu vực khách sạn
        document.getElementById('hotels').scrollIntoView({ behavior: 'smooth' });

        if (results.length === 0) {
          showToast('😔 Không tìm thấy khách sạn phù hợp');
        } else {
          showToast(`🔍 Tìm thấy ${results.length} khách sạn phù hợp`);
        }

        // Reset pill active về "Tất cả"
        document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        document.querySelector('.pill')?.classList.add('active');
      }


      function renderHotels(list) {
        const grid = document.getElementById("hotelGrid");
        grid.innerHTML = list
          .map(
            (h) => `
    <div class="hotel-card" onclick="openRoomDetail(${h.id})">
      <div class="hotel-img-wrap">
        <img src="${h.img}" alt="${h.name}" loading="lazy">
        <div class="hotel-badge">${h.badge}</div>
        <button class="hotel-fav" onclick="event.stopPropagation();this.textContent=this.textContent==='🤍'?'❤️':'🤍'">🤍</button>
      </div>
      <div class="hotel-body">
        <div class="hotel-stars">${"⭐".repeat(h.stars)}</div>
        <div class="hotel-name">${h.name}</div>
        <div class="hotel-location">📍 ${h.location}</div>
        <div class="hotel-amenities">${h.amenities.map((a) => `<span class="amenity-tag">${a}</span>`).join("")}</div>
        <div class="hotel-footer">
          <div>
            <div class="hotel-price-label">Từ</div>
            <div class="hotel-price">${h.price}₫ <span>/đêm</span></div>
          </div>
          <div style="display:flex;align-items:center;gap:0.6rem;">
            <div class="hotel-rating">★ ${h.rating}</div>
            <button class="book-btn" onclick="event.stopPropagation();openBookingForm('${h.name}', ${h.id})">Đặt ngay</button>
          </div>
        </div>
      </div>
    </div>
  `,
          )
          .join("");
      }

      // ─── CHI TIẾT PHÒNG (Room Detail Modal) ─────────────────────────────────
      function viewBadge(view) {
        const map = {
          ổn: { bg: "#EDE7DA", color: "var(--ink-soft)", icon: "🏙️" },
          đẹp: { bg: "rgba(200,169,110,0.2)", color: "var(--gold-dark)", icon: "🌇" },
          "rất đẹp": { bg: "rgba(45,122,95,0.16)", color: "var(--jade)", icon: "🌅" },
        };
        const s = map[view] || map["ổn"];
        return `<span style="display:inline-flex;align-items:center;gap:0.3rem;white-space:nowrap;background:${s.bg};color:${s.color};font-size:0.72rem;font-weight:700;padding:0.3rem 0.75rem;border-radius:2rem;">${s.icon} View ${view}</span>`;
      }

      function openRoomDetail(hotelId) {
        const h = hotels.find((x) => x.id === hotelId);
        if (!h) return;

        document.getElementById("rdHotelImg").src = h.img;
        document.getElementById("rdHotelImg").alt = h.name;
        document.getElementById("rdHotelName").textContent = h.name;
        document.getElementById("rdHotelStars").textContent = "⭐".repeat(h.stars);
        document.getElementById("rdHotelLocation").textContent = "📍 " + h.location;
        document.getElementById("rdHotelRating").textContent =
          "★ " + h.rating + " · " + h.reviews.toLocaleString("vi") + " đánh giá";
        document.getElementById("rdHotelAmenities").innerHTML = h.amenities
          .map((a) => `<span class="amenity-tag">${a}</span>`)
          .join("");

        document.getElementById("rdRoomsList").innerHTML = h.rooms
          .map(
            (r) => `
          <div style="border:1px solid var(--parchment);border-radius:16px;padding:1.1rem 1.2rem;margin-bottom:0.9rem;background:var(--white);">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:0.75rem;flex-wrap:wrap;">
              <div>
                <div style="font-family:'Cormorant Garamond',serif;font-weight:700;font-size:1.15rem;color:var(--ink);">${r.name}</div>
                <div style="font-size:0.78rem;color:var(--mist);margin-top:0.2rem;">${r.size} · ${r.bed} · Tối đa ${r.capacity} khách</div>
              </div>
              ${viewBadge(r.view)}
            </div>
            <div style="font-size:0.82rem;color:var(--ink-soft);margin:0.65rem 0 0.2rem;line-height:1.5;">${r.desc}</div>
            <div style="font-size:0.75rem;color:var(--mist);margin-bottom:0.85rem;">📍 ${h.location} · ${r.viewNote}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
              <div>
                <div style="font-size:0.7rem;color:var(--mist);">Giá mỗi đêm</div>
                <div style="font-family:'Cormorant Garamond',serif;font-weight:700;font-size:1.3rem;color:var(--gold-dark);">${r.price}₫</div>
              </div>
              <button onclick="bookRoomFromDetail('${h.name.replace(/'/g, "\\'")}', '${r.name.replace(/'/g, "\\'")}', '${r.id}')" style="padding:0.65rem 1.35rem;background:linear-gradient(135deg,var(--gold),var(--gold-dark));border:none;border-radius:12px;font-weight:600;font-size:0.85rem;color:var(--ink);cursor:pointer;">Đặt ngay</button>
            </div>
          </div>
        `,
          )
          .join("");

        const ov = document.getElementById("roomDetailOverlay");
        const md = document.getElementById("roomDetailModal");
        ov.style.display = "flex";
        ov.style.pointerEvents = "all";
        requestAnimationFrame(() => {
          ov.style.opacity = "1";
          md.style.transform = "scale(1) translateY(0)";
        });
      }

      function closeRoomDetail() {
        const ov = document.getElementById("roomDetailOverlay");
        const md = document.getElementById("roomDetailModal");
        ov.style.opacity = "0";
        md.style.transform = "scale(0.92) translateY(20px)";
        setTimeout(() => {
          ov.style.display = "none";
          ov.style.pointerEvents = "none";
        }, 300);
      }

      function bookRoomFromDetail(hotelName, roomName, roomId) {
        closeRoomDetail();
        setTimeout(() => openBookingForm(hotelName + " — " + roomName, roomId), 320);
      }

      function filterHotels(btn, type) {
        document
          .querySelectorAll(".pill")
          .forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        renderHotels(
          type === "all" ? hotels : hotels.filter((h) => h.type === type),
        );
      }

      renderHotels(hotels);

      // ─── COUNTER ANIMATION ─────────────────────────────────────────────────────
      function animateCount(id, target, suffix = "") {
        let start = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          start = Math.min(start + step, target);
          document.getElementById(id).textContent =
            start.toLocaleString("vi") + suffix;
          if (start >= target) clearInterval(timer);
        }, 24);
      }
      setTimeout(() => {
        animateCount("cntHotels", 847);
        animateCount("cntReviews", 124500);
        animateCount("cntGuests", 89600);
      }, 400);
// ─── TOAST ─────────────────────────────────────────────────────────────────
      let toastTimer;
      function showToast(msg) {
        const t = document.getElementById("toast");
        document.getElementById("toastMsg").textContent = msg;
        t.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => t.classList.remove("show"), 3000);
      }

      // ─── REVEAL ON SCROLL ──────────────────────────────────────────────────────
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add("visible");
          });
        },
        { threshold: 0.12 },
      );
      document
        .querySelectorAll(".reveal")
        .forEach((el) => observer.observe(el));

      // Set default dates
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date(today);
      dayAfter.setDate(dayAfter.getDate() + 3);
      document.getElementById("checkin").value = tomorrow
        .toISOString()
        .split("T")[0];
      document.getElementById("checkout").value = dayAfter
        .toISOString()
        .split("T")[0];
