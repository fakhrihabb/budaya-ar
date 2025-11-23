'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, ArrowLeft, Download, Share2, Box } from 'lucide-react';

export default function StoryResultPage() {
  const router = useRouter();
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get story from localStorage
    const savedStory = localStorage.getItem('latestStory');
    if (savedStory) {
      try {
        const parsed = JSON.parse(savedStory);
        setStoryData(parsed);
      } catch (error) {
        console.error('Error parsing story data:', error);
        router.push('/arcv');
      }
    } else {
      // No story found, redirect back
      router.push('/arcv');
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f5ff 50%, #fff9f5 100%)'
      }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat cerita...</p>
        </div>
      </div>
    );
  }

  if (!storyData) {
    return null;
  }

  const { story, image } = storyData;

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

      {/* Content */}
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Button */}
        <div className="pt-8 pb-4">
          <button
            onClick={() => router.push('/arcv')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(138, 127, 216, 0.3)',
              color: '#473C8B',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(-4px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(138, 127, 216, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.05)';
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
        </div>

        {/* Header */}
        <div className="relative rounded-3xl p-8 mb-6 text-center overflow-hidden" style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(138, 127, 216, 0.3)',
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.08),
                     inset 0 0 20px rgba(138, 127, 216, 0.05)`
        }}>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{
              background: 'rgba(138, 127, 216, 0.15)',
              border: '2px solid rgba(138, 127, 216, 0.3)',
              boxShadow: '0 0 20px rgba(138, 127, 216, 0.2)'
            }}>
              <BookOpen className="w-8 h-8" style={{
                color: '#473C8B',
                filter: 'drop-shadow(0 0 8px rgba(138, 127, 216, 0.5))'
              }} />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{
            textShadow: '0 0 20px rgba(138, 127, 216, 0.3)',
            background: 'linear-gradient(135deg, #473C8B 0%, #8A7FD8 50%, #D4A373 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {story.title}
          </h1>
          <p className="text-base font-medium" style={{
            color: '#8B7355',
            textShadow: '0 0 8px rgba(212, 163, 115, 0.3)'
          }}>
            Cerita budaya Indonesia dalam 5 babak interaktif
          </p>
        </div>

        {/* Image */}
        <div className="relative rounded-3xl p-6 mb-6 overflow-hidden" style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(212, 163, 115, 0.3)',
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.08),
                     inset 0 0 20px rgba(212, 163, 115, 0.05)`
        }}>
          <img
            src={image}
            alt="Story reference"
            className="w-full rounded-2xl"
            style={{
              maxHeight: '500px',
              objectFit: 'contain',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
            }}
          />
        </div>

        {/* Story Chapters */}
        <div className="space-y-6">
          {story.chapters.map((chapter, index) => (
            <div
              key={index}
              className="relative rounded-3xl p-6 overflow-hidden group"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(212, 163, 115, 0.3)',
                boxShadow: `0 8px 32px rgba(0, 0, 0, 0.08),
                           inset 0 0 20px rgba(212, 163, 115, 0.05)`
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                background: 'radial-gradient(circle at top left, rgba(212, 163, 115, 0.15), transparent 70%)'
              }} />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{
                    background: 'rgba(138, 127, 216, 0.15)',
                    border: '2px solid rgba(138, 127, 216, 0.3)',
                    boxShadow: '0 0 15px rgba(138, 127, 216, 0.2)'
                  }}>
                    <span className="text-xl font-bold" style={{
                      color: '#473C8B',
                      textShadow: '0 0 5px rgba(138, 127, 216, 0.4)'
                    }}>
                      {index + 1}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold" style={{
                    color: '#1B1B1E',
                    textShadow: '0 0 8px rgba(138, 127, 216, 0.2)'
                  }}>
                    {chapter.title}
                  </h2>
                </div>
                <p className="text-lg leading-relaxed" style={{
                  color: '#4A4A4A',
                  textShadow: '0 0 3px rgba(212, 163, 115, 0.15)',
                  textAlign: 'justify'
                }}>
                  {chapter.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          {/* Primary Action - Generate 3D */}
          <button
            onClick={() => router.push('/arcv/generate-3d')}
            className="relative w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #473C8B 0%, #6B5FBD 100%)',
              color: 'white',
              border: '2px solid rgba(138, 127, 216, 0.4)',
              boxShadow: '0 0 30px rgba(138, 127, 216, 0.35), inset 0 0 20px rgba(138, 127, 216, 0.1)',
              textShadow: '0 0 8px rgba(255, 255, 255, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 40px rgba(138, 127, 216, 0.5), inset 0 0 30px rgba(138, 127, 216, 0.15)';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(138, 127, 216, 0.35), inset 0 0 20px rgba(138, 127, 216, 0.1)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}
          >
            <Box className="w-6 h-6" />
            Generate Model 3D AR
          </button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/arcv')}
              className="relative w-full py-3 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 overflow-hidden group"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                color: '#473C8B',
                border: '2px solid rgba(138, 127, 216, 0.4)',
                boxShadow: '0 0 20px rgba(138, 127, 216, 0.2)',
                textShadow: '0 0 5px rgba(138, 127, 216, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(138, 127, 216, 0.35)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(138, 127, 216, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <ArrowLeft className="w-5 h-5" />
              Buat Cerita Baru
            </button>

            <button
              onClick={() => {
                const text = `${story.title}\n\n${story.chapters.map((ch, i) => `${i + 1}. ${ch.title}\n${ch.content}`).join('\n\n')}`;
                navigator.clipboard.writeText(text);
                alert('Cerita berhasil disalin!');
              }}
              className="relative w-full py-3 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 overflow-hidden group"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                color: '#473C8B',
                border: '2px solid rgba(138, 127, 216, 0.4)',
                boxShadow: '0 0 20px rgba(138, 127, 216, 0.2)',
                textShadow: '0 0 5px rgba(138, 127, 216, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(138, 127, 216, 0.35)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(138, 127, 216, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Share2 className="w-5 h-5" />
              Salin Cerita
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
