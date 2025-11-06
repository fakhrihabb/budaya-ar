'use client';

import { Camera, Mic2, Film, Volume2, MapPin, CheckCircle2, Zap, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="font-bold text-xl text-slate-900 hidden sm:inline">Lelana</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-blue-600 text-sm font-medium transition">Fitur</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 text-sm font-medium transition">Cara Kerja</a>
              <a href="#about" className="text-slate-600 hover:text-blue-600 text-sm font-medium transition">Tentang</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* <div className="inline-block">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold">
                  ✨ Budaya Hidup Kembali
                </span>
              </div> */}

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Jelajahi Budaya dengan <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Lelana</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Perjalanan budaya interaktif yang menghidupkan cerita, artefak, dan tradisi melalui kekuatan AR, AI, dan teknologi 3D.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button className="px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
                  Mulai Perjalanan
                </button>
                <button className="px-8 py-3 sm:py-4 bg-white text-slate-900 font-semibold rounded-lg border-2 border-slate-300 hover:border-blue-600 hover:text-blue-600 transition-all duration-300 text-sm sm:text-base">
                  Pelajari Lebih Lanjut
                </button>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="hidden lg:flex justify-center">
              <div className="w-full max-w-md h-96 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl flex items-center justify-center border border-blue-200">
                <span className="text-6xl">🎭</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">Fitur Utama</h2>
            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
              Teknologi canggih yang dirancang untuk pengalaman budaya yang tak terlupakan
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-200">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mb-4">
                <Camera size={24} />
              </div>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">Scan & Identifikasi</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Ambil foto dari galeri atau kamera langsung. AI kami mengidentifikasi elemen budaya otomatis.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-cyan-200">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center text-white mb-4">
                <Mic2 size={24} />
              </div>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">Narasi Interaktif</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Lela bercerita dengan gaya empatik sambil membimbing Anda menjelajahi budaya.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-200">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-4">
                <Film size={24} />
              </div>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">Model 3D Dinamis</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Visualisasi budaya dalam 3D yang berubah sesuai alur cerita dengan animasi sinematik.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-cyan-200">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-xl flex items-center justify-center text-white mb-4">
                <Volume2 size={24} />
              </div>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">Voice Overlay</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Dengarkan cerita budaya yang hidup dengan narasi voice yang menyenangkan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">Cara Kerjanya</h2>
            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
              Proses sederhana dalam 4 langkah untuk pengalaman budaya yang mendalam
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                <MapPin size={28} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Ambil Foto</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Photograph objek budaya di museum, situs bersejarah, atau lokasi favorit Anda.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                <Zap size={28} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">AI Analisis</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                AI menganalisis foto dan mengidentifikasi unsur budaya seperti pakaian adat atau artefak.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                <Film size={28} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Cerita Dimulai</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Lela bercerita sambil 3D model muncul dan berevolusi sesuai narasi.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Immersive</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Nikmati perjalanan budaya yang menyenangkan, edukatif, dan tak terlupakan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Lela Section */}
      <section id="about" className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-12 space-y-6 border-2 border-blue-200 shadow-lg">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Bertemu dengan Lela</h2>
            <p className="text-slate-700 leading-relaxed text-base sm:text-lg">
              Lela adalah pemandu virtual Anda yang bercerita tentang budaya dengan cara yang interaktif dan empatik. Ia bukan hanya menjelaskan fakta, tetapi membawa Anda dalam petualangan budaya yang mendalam dan menginspirasi.
            </p>
            <div className="pt-4">
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
                Pelajari Lebih Lanjut tentang Lela
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Siap Memulai Petualangan?</h2>
            <p className="text-blue-100 text-base sm:text-lg">
              Bergabunglah dengan ribuan pengguna yang menjelajahi budaya dengan cara baru.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base shadow-lg">
              Download Lelana Sekarang
            </button>
            <button className="px-8 py-4 bg-blue-500 text-white font-bold rounded-lg border-2 border-white hover:bg-blue-400 transition-all duration-300 text-sm sm:text-base">
              Jadilah Beta Tester
            </button>
          </div>
          <p className="text-sm text-blue-100 text-center">
            Tersedia di iOS dan Android • Gratis untuk mencoba
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="font-bold text-slate-900 text-lg">Lelana</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Menghidupkan budaya melalui teknologi AR, Computer Vision, dan AI.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 text-sm">Tautan Cepat</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-600 hover:text-blue-600 text-sm transition">Tentang Kami</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 text-sm transition">Fitur</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 text-sm transition">FAQ</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 text-sm">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-600 hover:text-blue-600 text-sm transition">Privasi</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 text-sm transition">Ketentuan</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 text-sm transition">Kontak</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 text-sm">Hubungi Kami</h4>
              <ul className="space-y-2">
                <li><a href="mailto:hello@lelana.id" className="text-slate-600 hover:text-blue-600 text-sm transition">hello@lelana.id</a></li>
                <li><a href="tel:+62" className="text-slate-600 hover:text-blue-600 text-sm transition">+62 XXX XXX XXXX</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-xs sm:text-sm">
              © 2025 Lelana. Semua hak dilindungi.
            </p>
            <p className="text-slate-600 text-xs sm:text-sm">
              Made with ❤️ di Indonesia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
