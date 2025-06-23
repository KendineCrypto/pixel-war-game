# 🎨 Piksel Boyama Oyunu

Bu proje, kullanıcıların 1000x1000 boyutunda bir piksel tuvalinde, seçtikleri takımın rengiyle her 5 dakikada bir piksel boyayabildikleri interaktif bir oyundur. En önemli özellik, **boyanmış pikseller tekrar boyanabilir** - böylece takımlar arasında sürekli bir üstünlük mücadelesi olur.

## 🎯 Oyun Özellikleri

### 🏆 Takımlar
- **Mavi** (#007BFF) - Güvenilir ve kararlı
- **Pembe** (#FF69B4) - Yaratıcı ve enerjik  
- **Turuncu** (#FFA500) - Cesur ve dinamik
- **Mor** (#800080) - Gizemli ve güçlü
- **Yeşil** (#28A745) - Doğal ve dengeli

### 🎮 Oyun Mekanikleri
- **Canvas Boyutu**: 1000x1000 piksel
- **Boyama Sıklığı**: Her 5 dakikada bir piksel
- **Takım Seçimi**: İlk girişte seçilir, değiştirilemez
- **Tekrar Boyama**: Boyanmış pikseller üzerine yazılabilir
- **Liderlik**: En çok anlık boyalı piksele sahip takım kazanır

### 🖼️ Canvas Özellikleri
- **Zoom**: Mouse scroll ile (0.5x - 10x arası)
- **Pan**: Mouse basılı tutarak sürükleme
- **Hover Efektleri**: Piksel üzerine gelince animasyonlu büyüme
- **Grid**: Her piksel gri çizgiyle ayrılmış
- **Tooltip**: Koordinat ve boyayan takım bilgisi

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn

### Kurulum
```bash
# Projeyi klonlayın
git clone <repository-url>
cd pixel-painting-game

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm start
```

### Build
```bash
# Production build
npm run build
```

## 🛠️ Teknik Detaylar

### Kullanılan Teknolojiler
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **UI Components**: Headless UI + Heroicons

### Proje Yapısı
```
src/
├── components/
│   ├── Canvas.tsx          # Ana canvas bileşeni
│   ├── TeamSelector.tsx    # Takım seçim modalı
│   ├── PaintModal.tsx      # Boyama onay modalı
│   ├── Leaderboard.tsx     # Liderlik tablosu
│   └── TimerOverlay.tsx    # Cooldown timer
├── hooks/
│   └── useCanvasControls.ts # Canvas zoom/pan kontrolleri
├── store/
│   └── teamStore.ts        # Zustand state yönetimi
├── utils/
│   ├── api.ts             # API çağrıları (mock)
│   └── colors.ts          # Takım renkleri ve yardımcılar
└── types/
    └── index.ts           # TypeScript tip tanımları
```

### State Yönetimi
Oyun state'i Zustand ile yönetilir:
- Kullanıcı bilgileri (takım, son boyama zamanı)
- Canvas verileri (pikseller)
- UI state (modaller, loading durumları)
- Liderlik tablosu

### API Endpoints (Mock)
- `GET /canvas` - Piksel verilerini getir
- `POST /paint` - Yeni piksel boyama
- `GET /leaderboard` - Liderlik tablosu
- `POST /team-select` - Takım seçimi
- `GET /me` - Kullanıcı bilgileri

## 🎨 Özellikler

### ✅ Tamamlanan Özellikler
- [x] Takım seçimi (ilk giriş)
- [x] 1000x1000 piksel canvas
- [x] Zoom ve pan kontrolleri
- [x] Piksel boyama (5 dakika cooldown)
- [x] Tekrar boyama desteği
- [x] Hover efektleri ve tooltip
- [x] Liderlik tablosu (gerçek zamanlı)
- [x] Cooldown timer overlay
- [x] Responsive tasarım
- [x] Animasyonlar ve geçişler

### 🔄 Gerçek Zamanlı Özellikler
- Liderlik tablosu 10 saniyede bir güncellenir
- Canvas verileri otomatik yenilenir
- Cooldown timer gerçek zamanlı çalışır

### 🎯 Kullanıcı Deneyimi
- **Sezgisel Kontroller**: Mouse ile zoom/pan
- **Görsel Geri Bildirim**: Hover efektleri, animasyonlar
- **Bilgilendirici UI**: Tooltip, timer, liderlik tablosu
- **Responsive**: Tüm ekran boyutlarında çalışır

## 🎮 Oyun Kuralları

1. **Takım Seçimi**: İlk girişte 5 takımdan birini seçin
2. **Boyama**: Her 5 dakikada bir piksel boyayabilirsiniz
3. **Renk Kısıtlaması**: Sadece kendi takımınızın rengiyle boyayabilirsiniz
4. **Tekrar Boyama**: Boyanmış pikseller üzerine yazabilirsiniz
5. **Liderlik**: En çok boyalı piksele sahip takım kazanır
6. **Süre**: Oyun 7 gün sürer

## 🔧 Geliştirme

### Yeni Özellik Ekleme
1. Tip tanımlarını `src/types/index.ts`'e ekleyin
2. API fonksiyonlarını `src/utils/api.ts`'e ekleyin
3. State'i `src/store/teamStore.ts`'e ekleyin
4. UI bileşenlerini `src/components/` altına ekleyin

### Styling
- Tailwind CSS kullanılır
- Özel renkler `tailwind.config.js`'de tanımlı
- Component-specific stiller inline veya CSS modülleri

### Testing
```bash
# Testleri çalıştır
npm test

# Coverage raporu
npm test -- --coverage
```

## 📱 Responsive Tasarım

Oyun tüm cihazlarda çalışır:
- **Desktop**: Tam özellikli deneyim
- **Tablet**: Touch-friendly kontroller
- **Mobile**: Optimized layout ve kontroller

## 🚀 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# dist/ klasörünü Netlify'a yükleyin
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🎯 Gelecek Özellikler

- [ ] WebSocket ile gerçek zamanlı güncellemeler
- [ ] Kullanıcı profilleri ve istatistikler
- [ ] Takım sohbet sistemi
- [ ] Özel temalar ve skinler
- [ ] Mobil uygulama
- [ ] Sosyal medya entegrasyonu

---

**🎨 Piksel Boyama Oyunu** - Takımlar arası rekabetin en renkli hali!
