// ─── AUTH ──────────────────────────────────────────────────────────────────
      function openAuth(tab = "login") {
        const ov = document.getElementById("authOverlay");
        const md = document.getElementById("authModal");
        ov.style.opacity = "0";
        ov.style.pointerEvents = "all";
        ov.style.display = "flex";
        requestAnimationFrame(() => {
          ov.style.opacity = "1";
          md.style.transform = "scale(1) translateY(0)";
        });
        switchAuthTab(tab);
        document.addEventListener("keydown", escAuth);
      }

      function closeAuth() {
        const ov = document.getElementById("authOverlay");
        const md = document.getElementById("authModal");
        ov.style.opacity = "0";
        md.style.transform = "scale(0.92) translateY(20px)";
        setTimeout(() => {
          ov.style.display = "none";
          ov.style.pointerEvents = "none";
        }, 300);
        document.removeEventListener("keydown", escAuth);
      }
      function escAuth(e) {
        if (e.key === "Escape") closeAuth();
      }

      function switchAuthTab(tab) {
        const isLogin = tab === "login";
        document.getElementById("loginForm").style.display = isLogin
          ? "block"
          : "none";
        document.getElementById("registerForm").style.display = isLogin
          ? "none"
          : "block";
        document.getElementById("tabLogin").className =
          "auth-tab" + (isLogin ? " active" : "");
        document.getElementById("tabRegister").className =
          "auth-tab" + (!isLogin ? " active" : "");
      }

      function doLogin() {
        const email = document.getElementById("loginEmail").value.trim();
        const pass = document.getElementById("loginPass").value;
        if (!email || !pass) {
          showToast("⚠️ Vui lòng nhập email và mật khẩu");
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          showToast("⚠️ Email không hợp lệ");
          return;
        }
        const btn = document.getElementById("loginBtn");
        btn.textContent = "Đang đăng nhập...";
        btn.style.opacity = "0.7";
        setTimeout(() => {
          btn.textContent = "Đăng nhập";
          btn.style.opacity = "1";
          loginSuccess({ name: email.split("@")[0], email });
        }, 1200);
      }

      function doRegister() {
        const first = document.getElementById("regFirst").value.trim();
        const last = document.getElementById("regLast").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const pass = document.getElementById("regPass").value;
        const agreed = document.getElementById("agreeTerms").checked;
        if (!first || !last || !email || !pass) {
          showToast("⚠️ Vui lòng điền đầy đủ thông tin");
          return;
        }
        if (!agreed) {
          showToast("⚠️ Vui lòng đồng ý với điều khoản");
          return;
        }
        if (pass.length < 8) {
          showToast("⚠️ Mật khẩu tối thiểu 8 ký tự");
          return;
        }
        setTimeout(() => {
          loginSuccess({ name: last + " " + first, email });
          showToast("🎉 Đăng ký thành công! Chào mừng bạn!");
        }, 1000);
      }

      function socialLogin(provider) {
        showToast(`⏳ Đang kết nối ${provider}...`);
        setTimeout(() => {
          loginSuccess({
            name: "Người dùng " + provider,
            email: "user@" + provider.toLowerCase() + ".com",
          });
        }, 1500);
      }

      function loginSuccess(user) {
        currentUser = user;
        closeAuth();
        document.getElementById("navAuthArea").style.display = "none";
        const ua = document.getElementById("navUserArea");
        ua.style.display = "block";
        const initials = user.name
          .split(" ")
          .map((w) => w[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();
        document.getElementById("navAvatar").textContent = initials;
        document.getElementById("navUserName").textContent = user.name
          .split(" ")
          .pop();
        document.getElementById("menuUserName").textContent = user.name;
        document.getElementById("menuUserEmail").textContent = user.email;
        showToast(`✅ Chào mừng, ${user.name.split(" ").pop()}!`);
      }

      function logout() {
        currentUser = null;
        document.getElementById("navUserArea").style.display = "none";
        document.getElementById("navAuthArea").style.display = "flex";
        document.getElementById("userMenu").style.display = "none";
        showToast("👋 Đã đăng xuất. Hẹn gặp lại!");
      }

      function toggleUserMenu() {
        const m = document.getElementById("userMenu");
        const open = m.style.display !== "block";
        m.style.display = open ? "block" : "none";
        if (open) {
          m.style.opacity = "0";
          m.style.transform = "translateY(-8px) scale(0.96)";
          m.style.transition = "opacity 0.2s,transform 0.2s";
          requestAnimationFrame(() => {
            m.style.opacity = "1";
            m.style.transform = "translateY(0) scale(1)";
          });
        }
      }
      document.addEventListener("click", function (e) {
        const ua = document.getElementById("navUserArea");
        if (ua && !ua.contains(e.target))
          document.getElementById("userMenu").style.display = "none";
      });

      function togglePass(id, btn) {
        const inp = document.getElementById(id);
        const show = inp.type === "password";
        inp.type = show ? "text" : "password";
        btn.textContent = show ? "🙈" : "👁";
      }

      function checkStrength(val) {
        const bars = document.querySelectorAll(".sb");
        const label = document.getElementById("strengthLabel");
        let score = 0;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;
        const colors = ["#E24B4A", "#EF9F27", "#639922", "#2D7A5F"];
        const labels = ["Quá yếu", "Yếu", "Tốt", "Rất mạnh 🔒"];
        bars.forEach((b, i) => {
          b.style.background =
            i < score ? colors[score - 1] : "var(--parchment)";
        });
        label.textContent = val ? labels[score - 1] || "" : "";
        label.style.color = score > 0 ? colors[score - 1] : "var(--mist)";
      }
