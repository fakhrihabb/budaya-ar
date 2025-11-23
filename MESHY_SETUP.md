# 🎨 Setup Meshy AI untuk Generate Model 3D

## 📝 Pendahuluan

Meshy AI adalah platform untuk generate model 3D dari text atau image. Dalam project ini, kita menggunakan **Text-to-3D** API untuk membuat model AR dari deskripsi cerita budaya.

---

## 🚀 Langkah-langkah Setup

### 1. Dapatkan API Key Meshy AI

1. **Buka**: https://www.meshy.ai/
2. **Sign Up** menggunakan email atau Google account
3. Setelah login, buka **Dashboard**
4. Navigasi ke **API Settings** atau **Developer** section
5. Klik **Create API Key** atau **Get API Key**
6. **Copy** API key yang digenerate

### 2. Tambahkan API Key ke Environment

Edit file `.env` di root project:

```bash
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...
MESHY_API_KEY=msy_...  # <-- Paste API key Meshy AI di sini
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
   - Wait 2-5 menit per model
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
  "taskId": "task_12345...",
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
  "modelUrl": "https://assets.meshy.ai/.../model.glb",
  "thumbnailUrl": "https://assets.meshy.ai/.../thumbnail.png"
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

## 💰 Pricing Meshy AI

### Free Tier:
- **200 credits** per bulan
- 1 model preview = **~20 credits**
- 1 model refined = **~50 credits**

### Mode Generation:
1. **Preview Mode** (digunakan dalam project ini):
   - Lebih cepat (1-3 menit)
   - Kualitas medium
   - Cocok untuk prototyping

2. **Refine Mode**:
   - Lebih lama (5-10 menit)
   - Kualitas tinggi
   - Cocok untuk production

**Rekomendasi**: Gunakan **Preview mode** untuk development, **Refine mode** untuk final product.

---

## 🛠 Troubleshooting

### 1. Error: "API key belum dikonfigurasi"
**Solusi**: Pastikan `MESHY_API_KEY` sudah ditambahkan ke `.env` dan server sudah di-restart

### 2. Error: "Unauthorized" atau 401
**Solusi**: API key salah atau sudah expired. Generate API key baru

### 3. Model generation timeout
**Solusi**: Meshy sedang busy. Coba lagi atau tunggu beberapa menit

### 4. Model quality rendah
**Solusi**:
- Improve prompt dengan deskripsi yang lebih detail
- Gunakan `refine` mode instead of `preview`
- Tambahkan negative prompts yang spesifik

---

## 📚 Resources

- **Meshy AI Dashboard**: https://www.meshy.ai/dashboard
- **API Documentation**: https://docs.meshy.ai/
- **Supported Art Styles**: realistic, cartoon, low-poly, sculpture, voxel
- **Community**: https://discord.gg/meshy

---

## 🎨 Tips untuk Prompt yang Baik

### ✅ Good Prompt:
```
Indonesian traditional house (Rumah Gadang) with curved roof
resembling buffalo horns, ornate wood carvings with floral motifs,
raised on stilts, warm brown and gold colors, detailed cultural architecture
```

### ❌ Bad Prompt:
```
rumah
```

### Tips:
1. **Be specific**: Detail bentuk, warna, ukuran
2. **Add context**: "Indonesian traditional...", "cultural element..."
3. **Mention materials**: "wood carving", "bamboo structure", "brass ornaments"
4. **Include style**: "traditional", "ornate", "detailed"
5. **Use negative prompts**: "no modern elements, no plastic, high quality"

---

## 🚧 Next Steps

1. **Integrate AR Viewer** - Display model 3D di browser dengan AR.js atau Model Viewer
2. **Save to Database** - Simpan generated models ke database
3. **Gallery Page** - Buat gallery untuk showcase semua models
4. **Batch Generation** - Generate multiple models secara parallel

---

**Happy Coding! 🎉**
