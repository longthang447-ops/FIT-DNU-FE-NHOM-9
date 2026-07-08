// ─── DATA ──────────────────────────────────────────────────────────────────
// Chỉ 10 khách sạn NỔI BẬT hiển thị trên trang chủ (top rating)
// Toàn bộ 58+ khách sạn xem tại hotels-all.html
      const hotels = [
        {
          id: 1,
          name: "Sofitel Legend Metropole",
          stars: 5,
          type: "luxury",
          location: "15 Ngô Quyền, Hoàn Kiếm, Hà Nội",
          price: "3.850.000",
          rating: "9.6",
          reviews: 2847,
          img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&q=85",
          amenities: ["Hồ bơi", "Spa", "Nhà hàng", "Bar", "WiFi"],
          badge: "Biểu tượng",
        },
        {
          id: 27,
          name: "Capella Hanoi",
          stars: 5,
          type: "luxury",
          location: "11 Lê Phụng Hiểu, Hoàn Kiếm, Hà Nội",
          price: "4.200.000",
          rating: "9.7",
          reviews: 1456,
          img: "https://images.unsplash.com/photo-1606402179428-a57976d71fa4?w=700&q=85",
          amenities: ["Spa hạng nhất", "Hồ bơi", "Fine Dining", "Bar", "Concierge"],
          badge: "Ultra Luxury",
        },
        {
          id: 4,
          name: "InterContinental Westlake",
          stars: 5,
          type: "lake",
          location: "5 Từ Hoa, Tây Hồ, Hà Nội",
          price: "3.200.000",
          rating: "9.5",
          reviews: 2134,
          img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=700&q=85",
          amenities: ["View Hồ Tây", "Hồ bơi vô cực", "Spa", "Fine Dining"],
          badge: "View đẹp",
        },
        {
          id: 22,
          name: "Apricot Hotel",
          stars: 5,
          type: "luxury",
          location: "136 Hàng Trống, Hoàn Kiếm, Hà Nội",
          price: "3.500.000",
          rating: "9.5",
          reviews: 2103,
          img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=700&q=85",
          amenities: ["Bể bơi", "Spa", "Fine Dining", "Bar", "WiFi"],
          badge: "Luxury",
        },
        {
          id: 46,
          name: "Sofitel Plaza Hanoi",
          stars: 5,
          type: "lake",
          location: "1 Thanh Niên, Ba Đình, Hà Nội",
          price: "3.300.000",
          rating: "9.4",
          reviews: 2034,
          img: "https://images.unsplash.com/photo-1549294413-26f195200c16?w=700&q=85",
          amenities: ["View Hồ Tây", "Hồ bơi", "Spa", "Fine Dining", "Bar"],
          badge: "Sofitel",
        },
        {
          id: 2,
          name: "JW Marriott Hanoi",
          stars: 5,
          type: "luxury",
          location: "8 Đỗ Đức Dục, Mỹ Đình, Nam Từ Liêm, Hà Nội",
          price: "2.950.000",
          rating: "9.4",
          reviews: 1923,
          img: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=700&q=85",
          amenities: ["Hồ bơi", "Gym", "Spa", "Lounge"],
          badge: "5 sao",
        },
        {
          id: 7,
          name: "Lotte Hotel Hanoi",
          stars: 5,
          type: "luxury",
          location: "54 Liễu Giai, Ba Đình, Hà Nội",
          price: "2.750.000",
          rating: "9.3",
          reviews: 1789,
          img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/81/92/80/caption.jpg?w=1400&h=-1&s=1",
          amenities: ["Sky Bar", "Hồ bơi", "Spa", "Gym", "Nhà hàng"],
          badge: "Sky lounge",
        },
        {
          id: 10,
          name: "Hilton Hanoi Opera",
          stars: 5,
          type: "luxury",
          location: "1 Lê Thánh Tông, Hoàn Kiếm, Hà Nội",
          price: "3.100.000",
          rating: "9.3",
          reviews: 2211,
          img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=700&q=85",
          amenities: ["Hồ bơi", "Gym", "Spa", "Bar", "Nhà hàng"],
          badge: "Opera",
        },
        {
          id: 3,
          name: "La Siesta Premium Hang Be",
          stars: 4,
          type: "boutique",
          location: "94 Hàng Bè, Hoàn Kiếm, Hà Nội",
          price: "1.250.000",
          rating: "9.2",
          reviews: 1456,
          img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=700&q=85",
          amenities: ["Rooftop Bar", "WiFi", "Bữa sáng"],
          badge: "Boutique",
        },
        {
          id: 18,
          name: "Sheraton Hanoi Hotel",
          stars: 5,
          type: "lake",
          location: "11K Xuân Diệu, Tây Hồ, Hà Nội",
          price: "2.900.000",
          rating: "9.2",
          reviews: 1867,
          img: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=700&q=85",
          amenities: ["View Hồ Tây", "Hồ bơi", "Spa", "Gym", "Bar"],
          badge: "Hồ Tây",
        },
      ];

      // ─── CHI TIẾT PHÒNG (mỗi khách sạn có 3 hạng phòng) ─────────────────────
      // Mỗi phòng gồm: tên, diện tích, loại giường, sức chứa,
      // mức độ view ("ổn" / "đẹp" / "rất đẹp") + ghi chú view, giá, mô tả.
      function _toNumber(priceStr) {
        return Number(String(priceStr).replace(/\./g, ""));
      }
      function _formatVND(n) {
        return Math.round(n).toLocaleString("vi-VN");
      }
      function generateRooms(hotel) {
        const base = _toNumber(hotel.price);
        const premiumView =
          hotel.type === "lake"
            ? "Toàn cảnh Hồ Tây thơ mộng"
            : hotel.type === "boutique"
              ? "View phố cổ đặc trưng"
              : "Toàn cảnh trung tâm thành phố";
        return [
          {
            id: hotel.id + "-r1",
            name: "Phòng Superior",
            size: "26 - 30m²",
            bed: "1 giường đôi hoặc 2 giường đơn",
            capacity: 2,
            view: "ổn",
            viewNote: "Hướng nội khu / thành phố, đủ sáng và yên tĩnh",
            price: _formatVND(base),
            desc: "Không gian ấm cúng, đầy đủ tiện nghi cơ bản — phù hợp cho khách công tác hoặc nghỉ ngắn ngày.",
          },
          {
            id: hotel.id + "-r2",
            name: "Phòng Deluxe",
            size: "32 - 38m²",
            bed: "1 giường King hoặc 2 giường Twin",
            capacity: 2,
            view: "đẹp",
            viewNote: "Hướng thoáng, ban công riêng, view đẹp hơn Superior",
            price: _formatVND(base * 1.28),
            desc: "Rộng rãi hơn với view đẹp, ban công riêng và khu vực tiếp khách nhỏ.",
          },
          {
            id: hotel.id + "-r3",
            name: "Suite / Premium",
            size: "45 - 60m²",
            bed: "1 giường King cỡ lớn",
            capacity: 3,
            view: "rất đẹp",
            viewNote: premiumView,
            price: _formatVND(base * 1.65),
            desc: "Hạng phòng cao cấp nhất — không gian sống sang trọng, view đẹp nhất khách sạn kèm nhiều đặc quyền.",
          },
        ];
      }
      hotels.forEach((h) => {
        h.rooms = generateRooms(h);
      });

      let currentUser = null;
