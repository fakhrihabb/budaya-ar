'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, BookOpen, Heart, Share2, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function MyStorybookPage() {
  const router = useRouter();
  const params = useParams();
  const [isFavorited, setIsFavorited] = useState(false);

  // Dummy storybook data - will be replaced with actual data from API
  const storybook = {
    id: params.id,
    title: 'Pacu Jalur Riau',
    subtitle: 'Tradisi Balap Perahu Legendaris',
    mood: 'adventure',
    description: 'Cerita ini akan menampilkan tradisi Pacu Jalur yang merupakan warisan budaya Riau.',
    createdAt: new Date().toLocaleDateString('id-ID'),
    totalPages: 10
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: storybook.title,
        text: storybook.subtitle,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      alert('Link telah disalin ke clipboard!');
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f5ff 50%, #fff9f5 100%)'
    }}>
      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes borderGlow {
          0% { transform: translateX(-100%) rotate(0deg); }
          100% { transform: translateX(100%) rotate(360deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(#473C8B 1px, transparent 1px), linear-gradient(90deg, #473C8B 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'gridMove 20s linear infinite'
      }} />
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full blur-3xl opacity-20" style={{
        background: 'radial-gradient(circle, #473C8B 0%, transparent 70%)',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div className="absolute top-1/3 right-10 w-60 h-60 rounded-full blur-3xl opacity-20" style={{
        background: 'radial-gradient(circle, #FFC857 0%, transparent 70%)',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />
      
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-4 flex items-center justify-between backdrop-blur-xl" style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderBottom: '2px solid rgba(138, 127, 216, 0.25)',
        boxShadow: '0 0 30px rgba(138, 127, 216, 0.15)'
      }}>
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl transition-all relative overflow-hidden group"
          style={{
            background: 'rgba(138, 127, 216, 0.1)',
            border: '2px solid rgba(138, 127, 216, 0.25)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(138, 127, 216, 0.15)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(138, 127, 216, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(138, 127, 216, 0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <ArrowLeft className="w-6 h-6 relative z-10" style={{
            color: '#473C8B',
            filter: 'drop-shadow(0 0 4px rgba(138, 127, 216, 0.4))'
          }} />
        </button>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" style={{
            color: '#473C8B',
            filter: 'drop-shadow(0 0 5px rgba(138, 127, 216, 0.4))'
          }} />
          <span className="font-semibold" style={{
            color: '#1B1B1E',
            textShadow: '0 0 8px rgba(138, 127, 216, 0.2)'
          }}>
            Lihat Storybook
          </span>
        </div>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-8 px-4 pt-8">
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center overflow-hidden" style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(138, 127, 216, 0.4)',
              boxShadow: `0 0 40px rgba(138, 127, 216, 0.3),
                         inset 0 0 30px rgba(138, 127, 216, 0.1)`
            }}>
              {/* Rotating ring */}
              <div className="absolute inset-0 animate-spin" style={{animationDuration: '4s'}}>
                <div className="w-full h-full rounded-full" style={{
                  background: 'conic-gradient(from 0deg, transparent, rgba(138, 127, 216, 0.6), transparent)'
                }} />
              </div>
              <BookOpen className="w-12 h-12 relative z-10" style={{
                color: '#473C8B',
                filter: 'drop-shadow(0 0 10px rgba(138, 127, 216, 0.5))'
              }} />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{
            textShadow: '0 0 20px rgba(138, 127, 216, 0.3), 0 0 40px rgba(138, 127, 216, 0.2)',
            background: 'linear-gradient(135deg, #473C8B 0%, #8A7FD8 50%, #D4A373 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {storybook.title}
          </h1>
          <p className="text-lg mb-2 font-medium" style={{
            color: '#6B5FBD',
            textShadow: '0 0 8px rgba(138, 127, 216, 0.25)'
          }}>
            {storybook.subtitle}
          </p>
          <p className="text-sm font-medium" style={{
            color: '#8B7355',
            textShadow: '0 0 5px rgba(212, 163, 115, 0.2)'
          }}>
            Dibuat pada {storybook.createdAt}
          </p>
        </div>

        <div className="relative rounded-3xl p-8 mb-6 mx-4 overflow-hidden group" style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(212, 163, 115, 0.3)',
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.08),
                     0 0 40px rgba(212, 163, 115, 0.2),
                     inset 0 0 30px rgba(212, 163, 115, 0.05)`
        }}>
          {/* Animated border glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
            background: 'linear-gradient(45deg, transparent, rgba(212, 163, 115, 0.2), transparent)',
            animation: 'borderGlow 3s linear infinite'
          }} />
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h2 className="text-xl font-bold" style={{
              color: '#1B1B1E',
              textShadow: '0 0 10px rgba(138, 127, 216, 0.2)'
            }}>
              Tentang Storybook Ini
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={handleFavorite}
                className="relative p-2 rounded-xl transition-all overflow-hidden group/btn"
                style={{
                  background: isFavorited ? 'rgba(239, 68, 68, 0.15)' : 'rgba(138, 127, 216, 0.1)',
                  border: `2px solid ${isFavorited ? 'rgba(239, 68, 68, 0.4)' : 'rgba(138, 127, 216, 0.25)'}`,
                  boxShadow: isFavorited ? '0 0 20px rgba(239, 68, 68, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = isFavorited 
                    ? '0 0 30px rgba(239, 68, 68, 0.5)' 
                    : '0 0 20px rgba(138, 127, 216, 0.3)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = isFavorited 
                    ? '0 0 20px rgba(239, 68, 68, 0.3)' 
                    : 'none';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} style={{
                  color: isFavorited ? '#ef4444' : '#473C8B',
                  filter: isFavorited ? 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.6))' : 'drop-shadow(0 0 4px rgba(138, 127, 216, 0.4))'
                }} />
                {isFavorited && (
                  <div className="absolute inset-0 animate-ping opacity-20">
                    <Heart className="w-5 h-5 fill-current m-2" style={{color: '#ef4444'}} />
                  </div>
                )}
              </button>
              <button 
                onClick={handleShare}
                className="p-2 rounded-xl transition-all relative overflow-hidden"
                style={{
                  background: 'rgba(138, 127, 216, 0.1)',
                  border: '2px solid rgba(138, 127, 216, 0.25)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(138, 127, 216, 0.15)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(138, 127, 216, 0.3)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(138, 127, 216, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Share2 className="w-5 h-5" style={{
                  color: '#473C8B',
                  filter: 'drop-shadow(0 0 4px rgba(138, 127, 216, 0.4))'
                }} />
              </button>
            </div>
          </div>
          <p className="leading-relaxed mb-6 relative z-10" style={{
            color: '#1B1B1E',
            textShadow: '0 0 3px rgba(138, 127, 216, 0.1)'
          }}>
            {storybook.description}
          </p>
          
          <div className="border-t pt-6 relative z-10" style={{
            borderColor: 'rgba(212, 163, 115, 0.25)'
          }}>
            <p className="text-sm font-semibold mb-2" style={{
              color: '#1B1B1E',
              textShadow: '0 0 5px rgba(138, 127, 216, 0.15)'
            }}>
              ID Storybook:
            </p>
            <code className="text-xs px-3 py-2 rounded-lg block break-all" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              color: '#8B7355',
              border: '1px solid rgba(212, 163, 115, 0.25)',
              boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.05)',
              textShadow: '0 0 3px rgba(212, 163, 115, 0.2)'
            }}>
              {storybook.id}
            </code>
          </div>
        </div>

        {/* Comic Viewer */}
        <div>
          {Array.from({ length: storybook.totalPages }, (_, index) => (
            <div key={index + 1}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/komik-pacujalur/${index + 1}.png`}
                alt={`Halaman ${index + 1}`}
                className="w-full h-auto"
                style={{display: 'block'}}
              />
            </div>
          ))}
        </div>

        {/* End of Story Section */}
        <div className="px-4 py-12 text-center relative z-10">
          <div className="max-w-md mx-auto">
            {/* End of Story Badge */}
            <div className="inline-block px-8 py-3 rounded-full mb-6 relative overflow-hidden" style={{
              background: 'rgba(71, 60, 139, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(138, 127, 216, 0.4)',
              boxShadow: '0 0 30px rgba(138, 127, 216, 0.3), inset 0 0 20px rgba(138, 127, 216, 0.1)'
            }}>
              <div className="absolute inset-0 animate-pulse opacity-30" style={{
                background: 'radial-gradient(circle, rgba(138, 127, 216, 0.3), transparent 70%)'
              }} />
              <p className="font-bold text-lg relative z-10" style={{
                color: '#473C8B',
                textShadow: '0 0 10px rgba(138, 127, 216, 0.4)'
              }}>
                Akhir Cerita
              </p>
            </div>

            {/* Question */}
            <h3 className="text-2xl font-semibold mb-6" style={{
              color: '#1B1B1E',
              textShadow: '0 0 15px rgba(138, 127, 216, 0.2)'
            }}>
              Anda suka dengan cerita ini?
            </h3>

            {/* Like and Share Buttons */}
            <div className="flex gap-3 justify-center mb-8">
              <button 
                onClick={handleFavorite}
                className="relative flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all overflow-hidden group"
                style={{
                  background: isFavorited 
                    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                    : 'rgba(255, 255, 255, 0.6)',
                  color: isFavorited ? 'white' : '#1B1B1E',
                  border: `2px solid ${isFavorited ? 'rgba(239, 68, 68, 0.6)' : 'rgba(212, 163, 115, 0.4)'}`,
                  boxShadow: isFavorited 
                    ? '0 0 30px rgba(239, 68, 68, 0.4), inset 0 0 20px rgba(239, 68, 68, 0.15)'
                    : '0 0 20px rgba(212, 163, 115, 0.2)',
                  backdropFilter: 'blur(10px)',
                  transform: isFavorited ? 'scale(1.05)' : 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = isFavorited
                    ? '0 0 40px rgba(239, 68, 68, 0.6), inset 0 0 30px rgba(239, 68, 68, 0.2)'
                    : '0 0 30px rgba(212, 163, 115, 0.35)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = isFavorited
                    ? '0 0 30px rgba(239, 68, 68, 0.4), inset 0 0 20px rgba(239, 68, 68, 0.15)'
                    : '0 0 20px rgba(212, 163, 115, 0.2)';
                  e.currentTarget.style.transform = isFavorited ? 'scale(1.05)' : 'scale(1)';
                }}
              >
                {isFavorited && (
                  <div className="absolute inset-0 opacity-40" style={{
                    background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.25), transparent)',
                    animation: 'shimmer 2s infinite'
                  }} />
                )}
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} style={{
                  filter: `drop-shadow(0 0 ${isFavorited ? '8' : '4'}px ${isFavorited ? 'rgba(239, 68, 68, 0.6)' : 'rgba(212, 163, 115, 0.5)'})`
                }} />
                <span style={{
                  textShadow: isFavorited ? '0 0 8px rgba(255, 255, 255, 0.6)' : '0 0 5px rgba(212, 163, 115, 0.3)'
                }}>
                  {isFavorited ? 'Disukai' : 'Suka'}
                </span>
              </button>
              <button 
                onClick={handleShare}
                className="relative flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  color: '#1B1B1E',
                  border: '2px solid rgba(138, 127, 216, 0.4)',
                  boxShadow: '0 0 20px rgba(138, 127, 216, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(138, 127, 216, 0.35)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(138, 127, 216, 0.2)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Share2 className="w-5 h-5" style={{
                  filter: 'drop-shadow(0 0 4px rgba(138, 127, 216, 0.5))'
                }} />
                <span style={{
                  textShadow: '0 0 5px rgba(138, 127, 216, 0.3)'
                }}>
                  Bagikan
                </span>
              </button>
            </div>

            {/* UMKM Support Section */}
            <div className="relative rounded-3xl p-6 overflow-hidden group" style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 200, 87, 0.4)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
            }}>
              {/* Animated glow */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500" style={{
                background: 'radial-gradient(circle at center, rgba(255, 200, 87, 0.2), transparent 70%)',
                animation: 'pulse 3s ease-in-out infinite'
              }} />
              
              <div className="flex justify-center mb-4 relative z-10">
                <div className="relative w-20 h-20 rounded-full flex items-center justify-center overflow-hidden" style={{
                  background: 'rgba(255, 200, 87, 0.2)',
                  border: '2px solid rgba(255, 200, 87, 0.4)',
                  boxShadow: '0 0 20px rgba(255, 200, 87, 0.25), inset 0 0 15px rgba(255, 200, 87, 0.15)'
                }}>
                  <div className="absolute inset-0 animate-spin" style={{animationDuration: '3s'}}>
                    <div className="w-full h-full rounded-full" style={{
                      background: 'conic-gradient(from 0deg, transparent, rgba(255, 200, 87, 0.4), transparent)'
                    }} />
                  </div>
                  <ShoppingCart className="w-10 h-10 relative z-10" style={{
                    color: '#D4A373',
                    filter: 'drop-shadow(0 0 8px rgba(212, 163, 115, 0.5))'
                  }} />
                </div>
              </div>
              <p className="text-base leading-relaxed mb-4 relative z-10" style={{
                color: '#8B7355',
                textShadow: '0 0 10px rgba(255, 200, 87, 0.15)'
              }}>
                Dukung UMKM lokal dan lihat produk yang berkaitan dengan budaya ini!
              </p>
              <button
                onClick={() => router.push(`/marketplace?story=${storybook.id}`)}
                className="relative w-full py-3 rounded-2xl font-bold text-white transition-all overflow-hidden group/btn"
                style={{
                  background: 'linear-gradient(135deg, #473C8B 0%, #6B5FBD 100%)',
                  border: '2px solid rgba(138, 127, 216, 0.4)',
                  boxShadow: '0 0 30px rgba(138, 127, 216, 0.3), inset 0 0 15px rgba(138, 127, 216, 0.1)',
                  textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(138, 127, 216, 0.5), inset 0 0 25px rgba(138, 127, 216, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(138, 127, 216, 0.3), inset 0 0 15px rgba(138, 127, 216, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                }}
              >
                {/* Animated shimmer */}
                <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" style={{
                  background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
                  animation: 'shimmer 2s infinite'
                }} />
                <span className="relative z-10">Lihat Produk Berkaitan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
