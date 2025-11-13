'use client';

import { Camera, Mic2, Film, Volume2, MapPin, CheckCircle2, Zap, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#F8F5F2'}}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full backdrop-blur-md z-50 border-b" style={{backgroundColor: 'rgba(248, 245, 242, 0.95)', borderColor: '#D4A373'}}>
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/1.svg" alt="Lelana Logo" className="h-10" />
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium transition" style={{color: '#473C8B', hover: '#D4A373'}}>Fitur</a>
              <a href="#how-it-works" className="text-sm font-medium transition" style={{color: '#473C8B', hover: '#D4A373'}}>Cara Kerja</a>
              <a href="#about" className="text-sm font-medium transition" style={{color: '#473C8B', hover: '#D4A373'}}>Tentang</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full h-screen px-4 sm:px-6 lg:px-0 flex items-center justify-center">
        <div className="w-full max-w-none px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="text-5xl sm:text-6xl lg:text-xl xl:text-2xl font-bold leading-tight" style={{color: '#1B1B1E'}}>
                Jelajahi Budaya dengan <img src="/1.svg" alt="Lelana Logo" className="inline h-24 sm:h-32 lg:h-40 xl:h-48" />
              </h1>

              <p className="text-lg sm:text-xl leading-relaxed max-w-xl" style={{color: '#1B1B1E'}}>
                Perjalanan budaya interaktif yang menghidupkan cerita, artefak, dan tradisi melalui kekuatan AR, AI, dan teknologi 3D.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <button className="px-8 py-4 sm:py-5 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-base sm:text-lg" style={{backgroundColor: '#473C8B'}}>
                  Mulai Perjalanan
                </button>
                <button className="px-8 py-4 sm:py-5 font-semibold rounded-lg border-2 transition-all duration-300 text-base sm:text-lg" style={{color: '#473C8B', borderColor: '#D4A373', backgroundColor: 'transparent'}}>
                  Pelajari Lebih Lanjut
                </button>
              </div>
            </div>

            {/* Right Illustration - Logo Icon */}
            <div className="hidden lg:flex justify-center">
              <img src="/2.svg" alt="Lelana Icon" className="w-full max-w-md h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Batik Background */}
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: 'url(/batik.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}></div>
        
        {/* Content */}
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-6 mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold" style={{color: '#1B1B1E'}}>Fitur Utama</h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{color: '#473C8B'}}>
              Teknologi canggih yang dirancang untuk pengalaman budaya yang tak terlupakan
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Feature Card 1 */}
            <div className="p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/60 backdrop-blur-sm" style={{backgroundColor: 'rgba(212, 163, 115, 0.15)', borderColor: '#D4A373'}}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4" style={{backgroundColor: '#D4A373'}}>
                <Camera size={24} />
              </div>
              <h3 className="font-bold mb-3 text-lg" style={{color: '#1B1B1E'}}>Scan & Identifikasi</h3>
              <p className="text-sm leading-relaxed" style={{color: '#473C8B'}}>
                Ambil foto dari galeri atau kamera langsung. AI kami mengidentifikasi elemen budaya otomatis.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/60 backdrop-blur-sm" style={{backgroundColor: 'rgba(71, 60, 139, 0.15)', borderColor: '#473C8B'}}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4" style={{backgroundColor: '#473C8B'}}>
                <Mic2 size={24} />
              </div>
              <h3 className="font-bold mb-3 text-lg" style={{color: '#1B1B1E'}}>Narasi Interaktif</h3>
              <p className="text-sm leading-relaxed" style={{color: '#473C8B'}}>
                Lela bercerita dengan gaya empatik sambil membimbing Anda menjelajahi budaya.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/60 backdrop-blur-sm" style={{backgroundColor: 'rgba(255, 200, 87, 0.15)', borderColor: '#FFC857'}}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4" style={{backgroundColor: '#FFC857'}}>
                <Film size={24} />
              </div>
              <h3 className="font-bold mb-3 text-lg" style={{color: '#1B1B1E'}}>Model 3D Dinamis</h3>
              <p className="text-sm leading-relaxed" style={{color: '#473C8B'}}>
                Visualisasi budaya dalam 3D yang berubah sesuai alur cerita dengan animasi sinematik.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/60 backdrop-blur-sm" style={{backgroundColor: 'rgba(212, 163, 115, 0.15)', borderColor: '#D4A373'}}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4" style={{backgroundColor: '#D4A373'}}>
                <Volume2 size={24} />
              </div>
              <h3 className="font-bold mb-3 text-lg" style={{color: '#1B1B1E'}}>Voice Overlay</h3>
              <p className="text-sm leading-relaxed" style={{color: '#473C8B'}}>
                Dengarkan cerita budaya yang hidup dengan narasi voice yang menyenangkan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8" style={{backgroundColor: '#F8F5F2'}}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold" style={{color: '#1B1B1E'}}>Cara Kerjanya</h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{color: '#473C8B'}}>
              Proses sederhana dalam 4 langkah untuk pengalaman budaya yang mendalam
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg" style={{backgroundColor: '#D4A373'}}>
                <MapPin size={28} />
              </div>
              <h3 className="font-bold text-lg" style={{color: '#1B1B1E'}}>Ambil Foto</h3>
              <p className="text-sm leading-relaxed" style={{color: '#473C8B'}}>
                Photograph objek budaya di museum, situs bersejarah, atau lokasi favorit Anda.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg" style={{backgroundColor: '#473C8B'}}>
                <Zap size={28} />
              </div>
              <h3 className="font-bold text-lg" style={{color: '#1B1B1E'}}>AI Analisis</h3>
              <p className="text-sm leading-relaxed" style={{color: '#473C8B'}}>
                AI menganalisis foto dan mengidentifikasi unsur budaya seperti pakaian adat atau artefak.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg" style={{backgroundColor: '#FFC857'}}>
                <Film size={28} />
              </div>
              <h3 className="font-bold text-lg" style={{color: '#1B1B1E'}}>Cerita Dimulai</h3>
              <p className="text-sm leading-relaxed" style={{color: '#473C8B'}}>
                Lela bercerita sambil 3D model muncul dan berevolusi sesuai narasi.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg" style={{backgroundColor: '#D4A373'}}>
                <CheckCircle2 size={28} />
              </div>
              <h3 className="font-bold text-lg" style={{color: '#1B1B1E'}}>Immersive</h3>
              <p className="text-sm leading-relaxed" style={{color: '#473C8B'}}>
                Nikmati perjalanan budaya yang menyenangkan, edukatif, dan tak terlupakan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Lela Section */}
      <section id="about" className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8" style={{backgroundColor: '#F8F5F2'}}>
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl p-8 sm:p-12 space-y-6 border-2 shadow-lg" style={{backgroundColor: 'white', borderColor: '#D4A373'}}>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{color: '#1B1B1E'}}>Bertemu dengan Lela</h2>
            <p className="leading-relaxed text-base sm:text-lg" style={{color: '#473C8B'}}>
              Lela adalah pemandu virtual Anda yang bercerita tentang budaya dengan cara yang interaktif dan empatik. Ia bukan hanya menjelaskan fakta, tetapi membawa Anda dalam petualangan budaya yang mendalam dan menginspirasi.
            </p>
            <div className="pt-4">
              <button className="px-6 sm:px-8 py-3 sm:py-4 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base" style={{backgroundColor: '#473C8B'}}>
                Pelajari Lebih Lanjut tentang Lela
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8" style={{backgroundColor: '#473C8B'}}>
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Siap Memulai Petualangan?</h2>
            <p className="text-base sm:text-lg" style={{color: '#F8F5F2'}}>
              Bergabunglah dengan ribuan pengguna yang menjelajahi budaya dengan cara baru.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base shadow-lg" style={{backgroundColor: '#FFC857'}}>
              Download Lelana Sekarang
            </button>
            <button className="px-8 py-4 text-white font-bold rounded-lg border-2 border-white transition-all duration-300 text-sm sm:text-base" style={{backgroundColor: 'transparent'}}>
              Jadilah Beta Tester
            </button>
          </div>
          <p className="text-sm text-center" style={{color: '#F8F5F2'}}>
            Tersedia di iOS dan Android • Gratis untuk mencoba
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t" style={{borderColor: '#D4A373', backgroundColor: 'white'}}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="/2.svg" alt="Lelana Icon" className="w-10 h-10" />
                <img src="/1.svg" alt="Lelana Logo" className="h-6" />
              </div>
              <p className="text-sm leading-relaxed" style={{color: '#473C8B'}}>
                Menghidupkan budaya melalui teknologi AR, Computer Vision, dan AI.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm" style={{color: '#1B1B1E'}}>Tautan Cepat</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm transition" style={{color: '#473C8B'}}>Tentang Kami</a></li>
                <li><a href="#" className="text-sm transition" style={{color: '#473C8B'}}>Fitur</a></li>
                <li><a href="#" className="text-sm transition" style={{color: '#473C8B'}}>FAQ</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm" style={{color: '#1B1B1E'}}>Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm transition" style={{color: '#473C8B'}}>Privasi</a></li>
                <li><a href="#" className="text-sm transition" style={{color: '#473C8B'}}>Ketentuan</a></li>
                <li><a href="#" className="text-sm transition" style={{color: '#473C8B'}}>Kontak</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm" style={{color: '#1B1B1E'}}>Hubungi Kami</h4>
              <ul className="space-y-2">
                <li><a href="mailto:hello@lelana.id" className="text-sm transition" style={{color: '#473C8B'}}>hello@lelana.id</a></li>
                <li><a href="tel:+62" className="text-sm transition" style={{color: '#473C8B'}}>+62 XXX XXX XXXX</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4" style={{borderColor: '#D4A373'}}>
            <p className="text-xs sm:text-sm" style={{color: '#473C8B'}}>
              © 2025 Lelana. Semua hak dilindungi.
            </p>
            <p className="text-xs sm:text-sm" style={{color: '#473C8B'}}>
              Made with ❤️ di Indonesia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
