# Kế Hoạch Tái Thiết Hệ Thống Đồ Họa & Mỹ Thuật Thủy Mặc (Sumi-e Refinement)

Kế hoạch tái thiết toàn diện mỹ thuật thị giác cho tựa game: Chuyển hóa nhân vật từ mô hình đa giác gồ ghề sang bóng dáng cô độc thanh thoát giàu chất thơ; làm lại cây cối (Tùng bách cổ thụ tán mây mực đậm đà, Liễu rủ hữu tình); đưa đàn chim về đúng chuẩn mực vài nét phẩy bút lông tối giản; và cân chỉnh tỷ lệ không gian sơn thủy bao la.

---

## Phản Hồi Người Dùng & Các Quyết Định Đã Thống Nhất

> [!IMPORTANT]
> **Các quyết định mỹ thuật được xác nhận:**
> - **Kiến trúc đồ họa nền tảng**: Tinh chỉnh Canvas 2D theo phong cách thư pháp tối giản tinh tế (Minimalist Calligraphic Canvas 2D) – giữ vững hiệu năng 60 FPS mượt mà và tận dụng tối đa chất xúc cảm của nét cọ.
> - **Tạo hình nhân vật & Cây cối**: Nhân vật mang bóng dáng cô độc với nét vẽ thanh thoát (Poetic Silhouette), gạt bỏ các hình khối thô cứng; Cây cối (Tùng, Liễu, Trúc) được tái hiện đậm đà, rậm rạp theo chuẩn mực hội họa Tống triều.
> - **Đàn chim trời**: Thay thế tạo hình chi tiết rườm rà bằng **vài nét phẩy bút lông thoảng nhẹ bay xa** (Calligraphic bird flock) gợi cảm giác trời cao mây rộng.

---

## 1. Phân Tích Hiện Trạng & Lý Do Cần Cải Tổ

1. **Vấn đề của Đàn Chim hiện tại**: Cố vẽ chi tiết giải phẫu (đầu, mỏ, cổ chữ S, lông vũ, chân hạc) trên kích thước canvas nhỏ khiến đàn chim bị dày cộp, nặng nề và "quá thô". Trong tranh thủy mặc kinh điển, đàn nhạn/chim trời chỉ là 2-3 nét phẩy bút mực buông lơi, điểm xuyết giữa bầu trời mênh mông.
2. **Vấn đề của Nhân vật hiện tại**: Các khối áo tơi dùng thuật toán răng cưa (`jagged leaf tiers`) tạo cảm giác góc cạnh, cơ khí, chân que thẳng đơ thiếu đi thần thái mềm mại của tà áo thụng phong trần bước đi trong gió lạnh.
3. **Vấn đề của Cây cối hiện tại**:
   - Cây Tùng (`Pine.ts`) chỉ có 4 nét kim gãy khúc, trông trơ trụi như cành gai khô. Cần được làm lại thành **tán tùng mây tròn đan xen (松针云团 - Pine Foliage Clusters)** xếp lớp đậm nhạt.
   - Cây Liễu (`Willow.ts`) rơi thành các sợi chỉ đơn điệu. Cần chuỗi lá mực chấm điểm mềm mại lượn sóng.
   - Cây Trúc (`Bamboo.ts`) cần áp dụng lối vẽ lá chữ "Cá" (个) kinh điển của văn nhân họa sĩ.

---

## 2. Thiết Kế Trải Nghiệm Thị Giác & Ngôn Ngữ Nghệ Thuật Mới

### A. Nhân Vật "Bóng Dáng Cô Độc Thanh Thoát" (Poetic Calligraphic Beggar)
* **Dáng vóc**: Tỷ lệ thanh nhã, hơi nghiêng mình đón gió; nón lá mộc che nửa gương mặt tĩnh lặng; tà áo dài phong trần buông rủ và uốn lượn theo nhịp bước chân bằng đường cong Bezier mềm mại (như nét chữ thảo *Thảo thư*).
* **Đạo cụ**: Chiếc gậy trúc mảnh mai điểm các mắt tre tự nhiên, chiếc bát sành nhỏ cầm ngang ngực, bước đi khoan thai giữa cõi trần ai.

### B. Cây Cối Thủy Mặc Đậm Đà (Lush Classical Flora)
* **Tùng Cổ Thụ (Ancient Cloud Pine)**:
  * Thân tùng vặn xoắn gân guốc (Gnarled Trunk) với các vết vỏ cây xù xì nét cọ khô.
  * Tán lá xếp thành từng cụm mây mực (Foliage Clusters) đan cài từ đen thẫm đến xám khói, tạo cảm giác xanh tốt hàng trăm năm.
* **Liễu Rủ Ven Sông (Weeping Willow)**:
  * Thân uốn mềm về phía dòng nước, các dải cành rủ buông lơi với những chấm lá mực li ti bay nhẹ theo làn gió.
* **Trúc Quân Tử (Graceful Bamboo)**:
  * Đốt trúc thanh mảnh, các chùm lá tạo hình chữ "个" thanh thoát lướt gió.

### C. Đàn Chim Bay Xa Thoảng Nhẹ (Calligraphic Avian Flocks)
* Mỗi chú chim chỉ là 2 nét phẩy bút lông thoảng nhẹ (`feather-light calligraphic brush swoops`), bay theo đội hình chữ V hoặc dải lượn nhấp nhô xa xăm, tạo chiều sâu bất tận cho bầu trời.

---

## 3. Kiến Trúc Kỹ Thuật (Architecture & Component Flow)

```
┌─────────────────────────────────────────────────────────────────┐
│                    components/GameCanvas.tsx                    │
│      - Viewport Resize & Dynamic Weather Background             │
│      - Multi-layer Parallax Compositor (60 FPS)                 │
└──────────────┬──────────────────────────────────┬───────────────┘
               │                                  │
               ▼                                  ▼
┌───────────────────────────────┐  ┌───────────────────────────────┐
│       game/graphics/          │  │       game/environment/       │
│  - Fauna.ts (Minimalist Birds)│  │  - MountainLayer.ts          │
│  - vegetation/Pine.ts (Cloud) │  │  - Sky.ts (Sumi-e Mists)     │
│  - vegetation/Willow.ts       │  │  - River.ts (Water & Boats)  │
│  - vegetation/Bamboo.ts       │  │  - StructureManager.ts       │
└──────────────┬────────────────┘  └──────────────┬────────────────┘
               │                                  │
               └────────────────┬─────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   game/entities/Character.ts                    │
│   - Redesigned Poetic Calligraphic Silhouette Avatar            │
│   - Flowing hem curve kinematics & slender bamboo staff         │
│   - Organic footstep ink bleed dissipation                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Kế Hoạch Triển Khai Chi Tiết

1. **Bước 1 - Tinh giản Đàn Chim (`Fauna.ts`)**: Viết lại `drawBird` bằng 2-3 nét phẩy bút mực thanh nhã, tối giản, chuyển động đập cánh nhẹ nhàng từ xa.
2. **Bước 2 - Tái thiết Nhân vật (`Character.ts`)**: Thiết kế lại toàn bộ hàm vẽ `drawAvatar` thành dáng người thư thái, áo dài tơ tưa mềm mại, nón lá cong thanh nhã và gậy trúc mảnh dẻ.
3. **Bước 3 - Nâng cấp Cây cối (`Pine.ts`, `Willow.ts`, `Bamboo.ts`, `TreeCache.ts`)**:
   - Viết lại `drawPine` với các tán lá cụm mây rậm rạp nhiều sắc độ.
   - Viết lại `drawWillow` với chuỗi lá buông rủ mềm mại ven sông.
   - Làm mới `drawBamboo` với thân trúc thanh thoát và chùm lá chữ "Cá".
4. **Bước 4 - Cân chỉnh tỷ lệ & Tích hợp (`GameCanvas.tsx`)**: Đảm bảo toàn bộ hệ sinh thái cảnh quan và nhân vật hài hòa về tỷ lệ, chiều sâu và màu sắc.
5. **Bước 5 - Kiểm thử biên dịch & Tối ưu mượt mà**: Chạy `compile_applet` xác minh không có lỗi cú pháp hoặc suy giảm FPS.
