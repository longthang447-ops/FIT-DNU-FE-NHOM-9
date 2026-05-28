// ─── RENDER HOTELS ─────────────────────────────────────────────────────────
      function renderHotels(list) {
        const grid = document.getElementById("hotelGrid");
        grid.innerHTML = list
          .map(
            (h) => `
    <div class="hotel-card" onclick="showToast('🏨 Đang mở ${h.name}...')">
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
