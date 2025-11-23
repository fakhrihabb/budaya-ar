'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, BookOpen, Heart, Share2, ShoppingCart, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import StorybookCarousel from '@/components/StorybookCarousel';

export default function MyStorybookPage() {
  const router = useRouter();
  const params = useParams();
  const [isFavorited, setIsFavorited] = useState(false);
  const [storybook, setStorybook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStorybook = async () => {
      try {
        const response = await fetch(`/api/storybook/${params.id}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch storybook');
        }

        setStorybook(data.data);
      } catch (err) {
        console.error('Error fetching storybook:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchStorybook();
    }
  }, [params.id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: storybook?.title || 'Storybook',
        text: storybook?.subtitle || '',
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f5ff 50%, #fff9f5 100%)'
      }}>
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4" style={{
            color: '#473C8B',
            filter: 'drop-shadow(0 0 8px rgba(138, 127, 216, 0.5))'
          }} />
          <p style={{ color: '#8B7355' }}>Memuat storybook...</p>
        </div>
      </div>
    );
  }

  if (error || !storybook) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f5ff 50%, #fff9f5 100%)'
      }}>
        <div className="text-center px-4">
          <BookOpen className="w-16 h-16 mx-auto mb-4" style={{
            color: '#8B7355',
            opacity: 0.5
          }} />
          <p style={{ color: '#8B7355', fontSize: '18px' }} className="mb-4">
            {error || 'Storybook tidak ditemukan'}
          </p>
          <button
            onClick={() => router.push('/storybook')}
            className="px-6 py-3 rounded-2xl font-semibold transition-all"
            style={{
              background: 'linear-gradient(135deg, #473C8B 0%, #6B5FBD 100%)',
              color: 'white',
              border: '2px solid rgba(138, 127, 216, 0.4)',
              boxShadow: '0 0 25px rgba(138, 127, 216, 0.3)'
            }}
          >
            Kembali ke Halaman Utama
          </button>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center gap-2 flex-1 justify-center max-w-md">
          <BookOpen className="w-5 h-5" style={{
            color: '#473C8B',
            filter: 'drop-shadow(0 0 5px rgba(138, 127, 216, 0.4))'
          }} />
          <span className="font-semibold truncate" style={{
            color: '#1B1B1E',
            textShadow: '0 0 8px rgba(138, 127, 216, 0.2)'
          }}>
            {storybook.title}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleFavorite}
            className="p-2 rounded-xl transition-all"
            style={{
              background: isFavorited ? 'rgba(239, 68, 68, 0.15)' : 'rgba(138, 127, 216, 0.1)',
              border: `2px solid ${isFavorited ? 'rgba(239, 68, 68, 0.4)' : 'rgba(138, 127, 216, 0.25)'}`,
              boxShadow: isFavorited ? '0 0 15px rgba(239, 68, 68, 0.3)' : 'none'
            }}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} style={{
              color: isFavorited ? '#ef4444' : '#473C8B'
            }} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-xl transition-all"
            style={{
              background: 'rgba(138, 127, 216, 0.1)',
              border: '2px solid rgba(138, 127, 216, 0.25)'
            }}
          >
            <Share2 className="w-5 h-5" style={{
              color: '#473C8B'
            }} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-6">
        {/* Storybook Carousel */}
        <StorybookCarousel pages={storybook.pages || []} />

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
                className="relative flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all overflow-hidden"
                style={{
                  background: isFavorited
                    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                    : 'rgba(255, 255, 255, 0.6)',
                  color: isFavorited ? 'white' : '#1B1B1E',
                  border: `2px solid ${isFavorited ? 'rgba(239, 68, 68, 0.6)' : 'rgba(212, 163, 115, 0.4)'}`,
                  boxShadow: isFavorited
                    ? '0 0 30px rgba(239, 68, 68, 0.4)'
                    : '0 0 20px rgba(212, 163, 115, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                <span>{isFavorited ? 'Disukai' : 'Suka'}</span>
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
              >
                <Share2 className="w-5 h-5" />
                <span>Bagikan</span>
              </button>
            </div>

            {/* UMKM Support Section */}
            <div className="relative rounded-3xl p-6 overflow-hidden group" style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 200, 87, 0.4)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
            }}>
              <div className="flex justify-center mb-4 relative z-10">
                <div className="relative w-20 h-20 rounded-full flex items-center justify-center overflow-hidden" style={{
                  background: 'rgba(255, 200, 87, 0.2)',
                  border: '2px solid rgba(255, 200, 87, 0.4)',
                  boxShadow: '0 0 20px rgba(255, 200, 87, 0.25)'
                }}>
                  <ShoppingCart className="w-10 h-10 relative z-10" style={{
                    color: '#D4A373',
                    filter: 'drop-shadow(0 0 8px rgba(212, 163, 115, 0.5))'
                  }} />
                </div>
              </div>
              <p className="text-base leading-relaxed mb-4 relative z-10" style={{
                color: '#8B7355'
              }}>
                Dukung UMKM lokal dan lihat produk yang berkaitan dengan budaya ini!
              </p>
              <button
                onClick={() => router.push(`/marketplace?story=${storybook.id}`)}
                className="relative w-full py-3 rounded-2xl font-bold text-white transition-all overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #473C8B 0%, #6B5FBD 100%)',
                  border: '2px solid rgba(138, 127, 216, 0.4)',
                  boxShadow: '0 0 30px rgba(138, 127, 216, 0.3)'
                }}
              >
                Lihat Produk Berkaitan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
