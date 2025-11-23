# 🎨 Setup Tripo AI untuk Generate Model 3D

## 📝 Pendahuluan

Tripo AI adalah platform untuk generate model 3D dari text atau image. Dalam project ini, kita menggunakan **Text-to-3D** API untuk membuat model AR dari deskripsi cerita budaya.

**Kenapa Tripo AI?**
- ⚡ Lebih cepat - Industry-leading generation speed
- 💰 Lebih murah - Free tier 300-600 credits/bulan
- 🎯 Lebih fokus - Dedicated untuk 3D model generation
- ✨ Kualitas tinggi - High-quality 3D models

---

## 🚀 Langkah-langkah Setup

### 1. Dapatkan API Key Tripo AI

1. **Buka**: https://platform.tripo3d.ai/
2. **Sign Up** menggunakan email atau Google account
3. Setelah login, navigasi ke **API Keys** atau klik: https://platform.tripo3d.ai/api-keys
4. Klik **Create API Key** atau **New API Key**
5. **Copy** API key yang digenerate (format: `tsk_...`)

### 2. Tambahkan API Key ke Environment

Edit file `.env` di root project:

```bash
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...
TRIPO_API_KEY=tsk_...  # <-- Paste API key Tripo AI di sini
```

**PENTING**:
- JANGAN commit file `.env` ke git
- JANGAN share API key di public
- Pastikan `.env` ada di `.gitignore`

### 3. Restart Development Server

```bash
npm run dev
```

---

## 🎯 Cara Menggunakan

### Flow Aplikasi:

1. **Upload Gambar** → `/arcv`
   - Upload gambar budaya Indonesia
   - AI Gemini akan analyze dan buat cerita 5 babak

2. **Lihat Cerita** → `/arcv/result`
   - Preview cerita yang sudah digenerate
   - Setiap babak mendeskripsikan objek/elemen yang bisa divisualisasikan

3. **Generate Model 3D** → `/arcv/generate-3d`
   - Klik tombol **"Generate Model 3D AR"**
   - Klik **"Generate Semua Model"** untuk memulai
   - Wait 10-30 detik per model (lebih cepat dari Meshy!)
   - Download file GLB setelah selesai

---

## 🔧 API Endpoints yang Dibuat

### 1. POST `/api/generate-3d-model`

**Request:**
```json
{
  "prompt": "Indonesian traditional house with curved roof like buffalo horns",
  "artStyle": "realistic",
  "negativePrompt": "low quality, blurry"
}
```

**Response:**
```json
{
  "success": true,
  "taskId": "abc123...",
  "message": "Model 3D sedang dibuat"
}
```

### 2. GET `/api/generate-3d-model?taskId=xxx`

**Response:**
```json
{
  "success": true,
  "status": "SUCCEEDED",
  "progress": 100,
  "modelUrl": "https://...model.glb",
  "thumbnailUrl": "https://...thumbnail.png"
}
```

**Status:**
- `PENDING` - Task dalam antrian
- `IN_PROGRESS` - Sedang generate
- `SUCCEEDED` - Berhasil, model siap download
- `FAILED` - Gagal

---

## 📦 Output Model 3D

### Format File: **GLB (GL Transmission Format Binary)**

- **Ukuran**: ~2-10 MB per model
- **Compatible dengan**:
  - Three.js
  - Model Viewer
  - AR.js
  - 8th Wall
  - Unity
  - Unreal Engine

### Cara Menggunakan GLB di AR:

```javascript
// Example dengan Model Viewer
<model-viewer
  src="model.glb"
  ar
  ar-modes="webxr scene-viewer quick-look"
  camera-controls
/>
```

---

## 💰 Pricing Tripo AI

### Free Tier:
- **300-600 credits** per bulan
- 1 text-to-3D model = **~20-30 credits**
- Lebih generous dari Meshy!

### Paid Plans:
1. **Professional**: $15.90/bulan
   - 3,000 credits monthly
   - 10 concurrent tasks
   - Faster generation

2. **Advanced**: $39.90/bulan
   - 8,000 credits monthly
   - 15 concurrent tasks
   - Priority support

**Rekomendasi**: Free tier sudah cukup untuk development dan testing!

---

## 🛠 Troubleshooting

### 1. Error: "API key belum dikonfigurasi"
**Solusi**: Pastikan `TRIPO_API_KEY` sudah ditambahkan ke `.env` dan server sudah di-restart

### 2. Error: "Unauthorized" atau 401
**Solusi**: API key salah atau sudah expired. Generate API key baru di https://platform.tripo3d.ai/api-keys

### 3. Model generation timeout
**Solusi**: Tunggu beberapa detik. Tripo lebih cepat dari Meshy, biasanya 10-30 detik

### 4. Model quality rendah
**Solusi**:
- Improve prompt dengan deskripsi yang lebih detail
- Tambahkan negative prompts yang spesifik
- Contoh: "high quality, detailed, 3D model" di prompt

---

## 📚 Resources

- **Tripo AI Dashboard**: https://platform.tripo3d.ai/
- **API Keys**: https://platform.tripo3d.ai/api-keys
- **API Documentation**: https://platform.tripo3d.ai/docs
- **Python SDK**: https://github.com/VAST-AI-Research/tripo-python-sdk
- **Pricing**: https://www.tripo3d.ai/pricing

---

## 🎨 Tips untuk Prompt yang Baik

### ✅ Good Prompt:
```
Indonesian traditional house (Rumah Gadang) with curved roof
resembling buffalo horns, ornate wood carvings with floral motifs,
raised on stilts, warm brown and gold colors, detailed cultural architecture,
high quality 3D model
```

### ❌ Bad Prompt:
```
rumah
```

### Tips:
1. **Be specific**: Detail bentuk, warna, ukuran
2. **Add context**: "Indonesian traditional...", "cultural element..."
3. **Mention materials**: "wood carving", "bamboo structure", "brass ornaments"
4. **Include style**: "traditional", "ornate", "detailed", "high quality"
5. **Use negative prompts**: "no modern elements, no plastic, low quality, blurry"

---

## ⚡ Perbandingan: Meshy vs Tripo

| Feature | Meshy AI | Tripo AI |
|---------|----------|----------|
| Free Credits | 200/bulan | 300-600/bulan |
| Speed | 2-5 menit | 10-30 detik |
| Quality | Bagus | Sangat Bagus |
| API Stability | Baik | Sangat Baik |
| Pricing | $20 untuk 1,000 credits | $15.90 untuk 3,000 credits |
| Free Plan Support | ❌ Tidak lagi | ✅ Ya |

**Winner**: Tripo AI! 🏆

---

## 🚧 Next Steps

1. **Integrate AR Viewer** - Display model 3D di browser dengan AR.js atau Model Viewer
2. **Save to Database** - Simpan generated models ke database
3. **Gallery Page** - Buat gallery untuk showcase semua models
4. **Batch Generation** - Generate multiple models secara parallel

---

**Happy Coding! 🎉**
