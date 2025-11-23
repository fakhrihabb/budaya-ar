'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Halo! Saya Lelana Bot, asisten virtual Pacu Jalur 🚣\n\nSaya bisa menceritakan tentang:\n• Sejarah Pacu Jalur\n• Sungai Batang Kuantan\n• Ornamen perahu\n• Zaman kerajaan\n• Festival modern\n\nSilakan pilih topik atau tanya langsung!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll ke pesan terbaru
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Quick suggestions
  const suggestions = [
    'Apa itu Pacu Jalur?',
    'Cerita tentang Sungai Batang Kuantan',
    'Ornamen perahu seperti apa?',
    'Hubungan dengan kerajaan?',
    'Festival modern Pacu Jalur'
  ];

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setInput('');

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = { role: 'bot', text: getAnswer(text) };
      setMessages(prev => [...prev, botResponse]);
      setLoading(false);
      inputRef.current?.focus();
    }, 800 + Math.random() * 400);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSend(suggestion);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  function getAnswer(q) {
    const lowerQ = q.toLowerCase();

    // 1. Apa itu Pacu Jalur & Festival
    if (/apa itu|pengertian|definisi|pacu jalur/i.test(q) && !/sungai|ornamen|kerajaan|modern/i.test(q)) {
      return '🚣 Pacu Jalur adalah tradisi balap perahu panjang khas Kuantan Singingi, Riau.\n\nAwalnya sebagai sarana transportasi dan pengangkutan hasil bumi di sungai Batang Kuantan. Kini berkembang menjadi festival budaya, hiburan rakyat, dan ajang adu cepat yang meriah!\n\n💡 Mau tahu lebih detail tentang sungainya? Tanya saja!';
    }

    // 2. Sungai Batang Kuantan sebagai jalur transportasi
    if (/sungai|batang kuantan|transportasi|jalur/i.test(q)) {
      return '🌊 Sungai Batang Kuantan adalah jantung transportasi masa lalu!\n\nPada zaman dahulu, sungai ini menjadi jalur transportasi utama masyarakat dari Hulu Kuantan hingga Cerenti. Perahu jalur digunakan untuk:\n• Mengangkut hasil bumi (buah-buahan, tebu)\n• Mobilitas sehari-hari\n• Perdagangan antar desa\n\nSungai ini seperti "jalan raya" bagi nenek moyang kita!';
    }

    // 3. Pengangkutan hasil bumi
    if (/hasil bumi|buah|tebu|pisang|banana|angkut/i.test(q)) {
      return '🍌🌾 Jalur digunakan untuk mengangkut hasil bumi!\n\nPara petani menggunakan perahu jalur untuk membawa:\n• Buah-buahan lokal (pisang, durian, rambutan)\n• Tebu untuk gula\n• Hasil panen lainnya\n\nSemuanya diangkut dari hulu ke hilir sungai untuk dijual atau ditukar. Perahu jalur adalah "truk pengangkut" zaman dulu!';
    }

    // 4. Perahu dihias kepala buaya/ular + ornamen
    if (/ornamen|hias|buaya|ular|kepala|bentuk perahu|desain/i.test(q)) {
      return '🐊🐍 Perahu Pacu Jalur memiliki ornamen khas!\n\nPerahu memanjang ini dihias dengan:\n• Kepala buaya atau ular di ujung depan\n• Melambangkan kekuatan dan keberanian\n• Ukiran budaya setempat\n• Warna-warni cerah\n\nOrnamen ini bukan hanya hiasan, tapi simbol spiritual dan kebanggaan tim!';
    }

    // 5. Tongkang kerajaan + Belanda + Ratu Wilhelmina
    if (/kerajaan|tongkang|bangsawan|raja|belanda|wilhelmina|penjajah/i.test(q)) {
      return '👑 Pacu Jalur punya hubungan dengan kerajaan!\n\nSeiring waktu, perahu jalur menjadi tongkang kerajaan yang megah untuk para bangsawan dan raja.\n\nPada masa penjajahan Belanda, Pacu Jalur bahkan diadakan untuk memperingati hari lahir Ratu Wilhelmina!\n\nDari transportasi rakyat → simbol kekuasaan → tradisi kolonial. Sungguh perjalanan sejarah yang panjang!';
    }

    // 6. Pacu Jalur mendunia & kemerdekaan & modern
    if (/modern|sekarang|festival|mendunia|kemerdekaan|merdeka|17 agustus/i.test(q)) {
      return '🌍🇮🇩 Pacu Jalur kini mendunia!\n\nSetelah kemerdekaan Indonesia, Pacu Jalur bertransformasi menjadi:\n• Festival rakyat untuk merayakan Hari Kemerdekaan RI (17 Agustus)\n• Ajang olahraga budaya nasional\n• Daya tarik wisata internasional\n• Kebanggaan budaya Indonesia di mata dunia\n\nDari tradisi lokal menjadi warisan budaya yang diakui dunia! 🎉';
    }

    // Terima kasih
    if (/terima kasih|thanks|makasih|thx/i.test(q)) {
      return 'Sama-sama! 😊 Senang bisa membantu Anda mengenal Pacu Jalur lebih dalam.\n\nAda pertanyaan lain? Saya siap membantu!';
    }

    // Salam
    if (/halo|hai|hi|hello|hey/i.test(q)) {
      return 'Halo juga! 👋 Senang bertemu dengan Anda!\n\nAda yang ingin ditanyakan tentang Pacu Jalur?';
    }

    // Default
    return '🤔 Hmm, saya belum paham pertanyaan Anda.\n\nSaya bisa menjawab tentang:\n• Sejarah Pacu Jalur\n• Sungai Batang Kuantan\n• Hasil bumi yang diangkut\n• Ornamen perahu (buaya/ular)\n• Zaman kerajaan & Belanda\n• Festival modern\n\nCoba tanya dengan kata kunci di atas ya!';
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#F8F5F2'}}>
      {/* Header Navigation */}
      <nav className="fixed top-0 w-full backdrop-blur-md z-50 border-b" style={{backgroundColor: 'rgba(248, 245, 242, 0.95)', borderColor: '#D4A373'}}>
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/1.svg" alt="Lelana Logo" className="h-10" />
              <h1 className="text-xl font-bold" style={{color: '#473C8B'}}>Chatbot Pacu Jalur</h1>
            </div>
            <div className="flex items-center gap-4">
              <a href="/" className="text-sm font-medium transition hover:opacity-70" style={{color: '#473C8B'}}>
                ← Home
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Chat Container */}
      <div className="pt-24 pb-24 px-4 flex justify-center">
        <div className="w-full max-w-3xl">
          {/* Chat Messages */}
          <div
            className="bg-white rounded-3xl shadow-lg p-6 mb-4"
            style={{
              minHeight: '500px',
              maxHeight: '70vh',
              overflowY: 'auto',
              border: '2px solid #D4A373'
            }}
          >
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3 animate-fadeIn`}
                >
                  {/* Bot Avatar */}
                  {msg.role === 'bot' && (
                    <div className="flex-shrink-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                        style={{backgroundColor: '#473C8B'}}
                      >
                        🤖
                      </div>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                      msg.role === 'bot'
                        ? 'rounded-tl-none'
                        : 'rounded-tr-none'
                    }`}
                    style={{
                      backgroundColor: msg.role === 'bot' ? '#F0EBE3' : '#473C8B',
                      color: msg.role === 'bot' ? '#1B1B1E' : 'white',
                      border: msg.role === 'bot' ? '1px solid #D4A373' : 'none'
                    }}
                  >
                    <p className="whitespace-pre-line text-sm leading-relaxed">{msg.text}</p>
                  </div>

                  {/* User Avatar */}
                  {msg.role === 'user' && (
                    <div className="flex-shrink-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                        style={{backgroundColor: '#FFC857'}}
                      >
                        👤
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Loading Indicator */}
              {loading && (
                <div className="flex justify-start items-start gap-3 animate-fadeIn">
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                      style={{backgroundColor: '#473C8B'}}
                    >
                      🤖
                    </div>
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl rounded-tl-none shadow-sm"
                    style={{backgroundColor: '#F0EBE3', border: '1px solid #D4A373'}}
                  >
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && !loading && (
            <div className="mb-4 animate-fadeIn">
              <p className="text-sm font-semibold mb-2 px-2" style={{color: '#473C8B'}}>
                💡 Pertanyaan cepat:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 shadow-sm"
                    style={{
                      backgroundColor: 'white',
                      color: '#473C8B',
                      border: '2px solid #D4A373'
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <div className="bg-white rounded-3xl shadow-lg p-4" style={{border: '2px solid #D4A373'}}>
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                className="flex-1 border-2 rounded-xl px-4 py-3 focus:outline-none focus:border-opacity-100 transition"
                style={{borderColor: '#D4A373', borderOpacity: 0.5}}
                placeholder="Ketik pertanyaan Anda..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
                autoFocus
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
                style={{backgroundColor: '#FFC857', color: '#1B1B1E'}}
                disabled={loading || !input.trim()}
              >
                <span className="hidden sm:inline">Kirim</span>
                <span className="inline sm:hidden">📤</span>
              </button>
            </form>
          </div>

          {/* Info Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs" style={{color: '#888'}}>
              💬 Chatbot ini memberikan informasi seputar sejarah Pacu Jalur
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="flex justify-around items-center max-w-md mx-auto px-4">
          <a className="bottom-nav-item" href="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house" aria-hidden="true">
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
            <span>Beranda</span>
          </a>
          <a className="bottom-nav-item" href="/galeri">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image" aria-hidden="true">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
              <circle cx="9" cy="9" r="2"></circle>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
            </svg>
            <span>Galeri</span>
          </a>
          <a className="bottom-nav-item" href="/ar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera" aria-hidden="true">
              <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"></path>
              <circle cx="12" cy="13" r="3"></circle>
            </svg>
            <span>AR</span>
          </a>
          <a className="bottom-nav-item" href="/storybook">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open" aria-hidden="true">
              <path d="M12 7v14"></path>
              <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
            </svg>
            <span>Buku Cerita</span>
          </a>
          <a className="bottom-nav-item" href="/pusakaku">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user" aria-hidden="true">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>PusakaKu</span>
          </a>
        </div>
      </nav>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        /* Smooth scroll */
        div[style*="overflowY: auto"] {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        div[style*="overflowY: auto"]::-webkit-scrollbar {
          width: 6px;
        }

        div[style*="overflowY: auto"]::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb {
          background: #D4A373;
          border-radius: 10px;
        }

        div[style*="overflowY: auto"]::-webkit-scrollbar-thumb:hover {
          background: #C49363;
        }
      `}</style>
    </div>
  );
}
