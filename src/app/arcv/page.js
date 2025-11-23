'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Image as ImageIcon, Sparkles, Loader2, BookOpen, X } from 'lucide-react';

export default function StoryPage() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setError(null);
  };

  const handleGenerateStory = async () => {
    if (!selectedImage) {
      setError('Silakan pilih gambar terlebih dahulu!');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1];

        // Call API to generate story (using v2 with direct API)
        const response = await fetch('/api/generate-story-v2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64Image,
            mimeType: selectedImage.type,
          }),
        });

        if (!response.ok) {
          throw new Error('Gagal menghasilkan cerita');
        }

        const data = await response.json();

        // Save story and image to localStorage
        const storyData = {
          story: data.story,
          image: reader.result,
          timestamp: Date.now()
        };
        localStorage.setItem('latestStory', JSON.stringify(storyData));

        // Redirect to result page
        router.push('/arcv/result');
      };

      reader.onerror = () => {
        throw new Error('Gagal membaca gambar');
      };

      reader.readAsDataURL(selectedImage);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menghasilkan cerita');
      console.error('Error generating story:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 px-4 sm:px-6 relative overflow-hidden" style={{
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
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
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
      <div className="absolute bottom-40 right-10 w-60 h-60 rounded-full blur-3xl opacity-20" style={{
        background: 'radial-gradient(circle, #FFC857 0%, transparent 70%)',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />
      <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full blur-3xl opacity-15" style={{
        background: 'radial-gradient(circle, #D4A373 0%, transparent 70%)',
        animation: 'float 7s ease-in-out infinite'
      }} />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl" style={{
          background: 'rgba(255, 255, 255, 0.95)'
        }}>
          <div className="relative rounded-3xl p-8 max-w-sm mx-4 text-center overflow-hidden" style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(71, 60, 139, 0.3)',
            boxShadow: `0 0 40px rgba(71, 60, 139, 0.3),
                       inset 0 0 40px rgba(71, 60, 139, 0.05)`
          }}>
            <div className="absolute inset-0 opacity-30" style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(138, 127, 216, 0.2), transparent 70%)'
            }} />

            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Loader2 className="w-16 h-16 animate-spin" style={{
                    color: '#473C8B',
                    filter: 'drop-shadow(0 0 8px rgba(138, 127, 216, 0.5))'
                  }} />
                  <div className="absolute inset-0 animate-ping opacity-20">
                    <Loader2 className="w-16 h-16" style={{color: '#8A7FD8'}} />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{
                color: '#1B1B1E',
                textShadow: '0 0 15px rgba(138, 127, 216, 0.3)'
              }}>
                Menganalisis Gambar...
              </h3>
              <p className="text-sm" style={{
                color: '#D4A373',
                textShadow: '0 0 8px rgba(212, 163, 115, 0.3)'
              }}>
                AI sedang membuat cerita budaya untuk Anda
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="relative pt-8 pb-6 text-center z-10">
        <div className="flex justify-center mb-4">
          <div className="relative w-20 h-20 rounded-full flex items-center justify-center overflow-hidden" style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(138, 127, 216, 0.4)',
            boxShadow: `0 0 30px rgba(138, 127, 216, 0.3),
                       inset 0 0 20px rgba(138, 127, 216, 0.1)`
          }}>
            <div className="absolute inset-0 animate-spin" style={{animationDuration: '3s'}}>
              <div className="w-full h-full rounded-full" style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(138, 127, 216, 0.6), transparent)'
              }} />
            </div>
            <ImageIcon className="w-10 h-10 relative z-10" style={{
              color: '#473C8B',
              filter: 'drop-shadow(0 0 8px rgba(138, 127, 216, 0.5))'
            }} />
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-3" style={{
          textShadow: '0 0 20px rgba(138, 127, 216, 0.3), 0 0 40px rgba(138, 127, 216, 0.2)',
          background: 'linear-gradient(135deg, #473C8B 0%, #8A7FD8 50%, #D4A373 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Cerita dari Gambar
        </h1>
        <p className="text-base font-medium" style={{
          color: '#8B7355',
          textShadow: '0 0 8px rgba(212, 163, 115, 0.3)'
        }}>
          Upload gambar budaya dan AI akan membuat cerita interaktif
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        {/* Upload Section */}
        {!imagePreview ? (
          <div className="relative rounded-3xl p-6 overflow-hidden group" style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(212, 163, 115, 0.3)',
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.08),
                       inset 0 0 20px rgba(212, 163, 115, 0.05)`
          }}>
            <label className="cursor-pointer block">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative w-24 h-24 rounded-full flex items-center justify-center mb-4" style={{
                  background: 'rgba(138, 127, 216, 0.1)',
                  border: '2px solid rgba(138, 127, 216, 0.3)',
                  boxShadow: '0 0 20px rgba(138, 127, 216, 0.2)'
                }}>
                  <Upload className="w-12 h-12" style={{
                    color: '#473C8B',
                    filter: 'drop-shadow(0 0 8px rgba(138, 127, 216, 0.5))'
                  }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{
                  color: '#1B1B1E',
                  textShadow: '0 0 8px rgba(138, 127, 216, 0.2)'
                }}>
                  Upload Gambar Budaya
                </h3>
                <p className="text-sm text-center" style={{
                  color: '#8B7355',
                  textShadow: '0 0 5px rgba(212, 163, 115, 0.2)'
                }}>
                  Klik untuk memilih gambar terkait budaya Indonesia<br />
                  (JPG, PNG, atau format gambar lainnya)
                </p>
              </div>
            </label>
          </div>
        ) : (
          <div className="relative rounded-3xl p-6 overflow-hidden" style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(212, 163, 115, 0.3)',
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.08),
                       inset 0 0 20px rgba(212, 163, 115, 0.05)`
          }}>
            <div className="relative">
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                  border: '2px solid rgba(244, 114, 182, 0.4)',
                  boxShadow: '0 0 20px rgba(236, 72, 153, 0.3)',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(236, 72, 153, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(236, 72, 153, 0.3)';
                }}
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full rounded-2xl"
                style={{
                  maxHeight: '400px',
                  objectFit: 'contain',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                }}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="relative rounded-2xl p-4 overflow-hidden" style={{
            background: 'rgba(239, 68, 68, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(239, 68, 68, 0.3)',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)'
          }}>
            <p className="text-center font-medium" style={{
              color: '#dc2626',
              textShadow: '0 0 5px rgba(239, 68, 68, 0.3)'
            }}>
              {error}
            </p>
          </div>
        )}

        {/* Generate Button */}
        {imagePreview && (
          <button
            onClick={handleGenerateStory}
            disabled={isLoading}
            className={`relative w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 overflow-hidden group ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{
              background: isLoading
                ? 'rgba(71, 60, 139, 0.2)'
                : 'linear-gradient(135deg, #473C8B 0%, #6B5FBD 100%)',
              color: 'white',
              border: '2px solid rgba(138, 127, 216, 0.4)',
              boxShadow: isLoading
                ? 'none'
                : '0 0 30px rgba(138, 127, 216, 0.35), inset 0 0 20px rgba(138, 127, 216, 0.1)',
              textShadow: '0 0 8px rgba(255, 255, 255, 0.4)'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.boxShadow = '0 0 40px rgba(138, 127, 216, 0.5), inset 0 0 30px rgba(138, 127, 216, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(138, 127, 216, 0.35), inset 0 0 20px rgba(138, 127, 216, 0.1)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
              }
            }}
          >
            {!isLoading && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
                animation: 'shimmer 2s infinite'
              }} />
            )}

            <div className="relative z-10 flex items-center gap-3">
              <Sparkles className="w-6 h-6" style={{
                filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.5))'
              }} />
              Buat Cerita
            </div>
          </button>
        )}

        {/* Info Section */}
        {imagePreview ? null : (
          <div className="relative rounded-3xl p-6 overflow-hidden" style={{
            background: 'rgba(138, 127, 216, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(138, 127, 216, 0.25)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
          }}>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg" style={{
                color: '#1B1B1E',
                textShadow: '0 0 5px rgba(138, 127, 216, 0.15)'
              }}>
                Cara Kerja:
              </h3>
              <ul className="space-y-2 text-sm" style={{
                color: '#4A4A4A'
              }}>
                <li className="flex items-start gap-2">
                  <span className="text-lg font-bold" style={{color: '#473C8B'}}>1.</span>
                  <span>Upload gambar terkait budaya Indonesia (tarian, kerajinan, bangunan, dll)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg font-bold" style={{color: '#473C8B'}}>2.</span>
                  <span>AI akan menganalisis gambar dan membuat cerita edukatif</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg font-bold" style={{color: '#473C8B'}}>3.</span>
                  <span>Cerita dibagi menjadi 5 babak yang dapat divisualisasikan dengan model 3D</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg font-bold" style={{color: '#473C8B'}}>4.</span>
                  <span>Setiap babak dirancang untuk memberikan pengalaman AR yang menarik</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
