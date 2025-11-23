'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

export default function StorybookCarousel({ pages }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const audioRef = useRef(null);

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
      setShouldAutoPlay(false); // Don't autoplay when manually navigating
      setIsPlaying(false);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setShouldAutoPlay(false); // Don't autoplay when manually navigating
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setShouldAutoPlay(false); // User manually paused, disable autoplay
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setShouldAutoPlay(true); // User started playing, enable autoplay for next pages
      setIsPlaying(true);
    }
  };

  // Handle audio ended event
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-advance to next page
      if (currentPage < pages.length - 1) {
        setTimeout(() => {
          setCurrentPage(currentPage + 1);
          // shouldAutoPlay flag will remain true, triggering autoplay on next page
        }, 500);
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [currentPage, pages.length]);

  // Reset audio when page changes and autoplay if needed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      // Auto-play the new page if shouldAutoPlay is true
      if (shouldAutoPlay) {
        // Small delay to ensure audio element is ready
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play()
              .then(() => setIsPlaying(true))
              .catch((error) => {
                console.error('Auto-play failed:', error);
                setIsPlaying(false);
              });
          }
        }, 100);
      } else {
        setIsPlaying(false);
      }
    }
  }, [currentPage, shouldAutoPlay]);

  if (!pages || pages.length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ color: '#8B7355' }}>Tidak ada halaman untuk ditampilkan</p>
      </div>
    );
  }

  const currentPageData = pages[currentPage];

  return (
    <div className="max-w-2xl mx-auto px-4 mb-8">
      {/* Page Counter */}
      <div className="text-center mb-4">
        <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold" style={{
          background: 'rgba(138, 127, 216, 0.15)',
          color: '#473C8B',
          border: '2px solid rgba(138, 127, 216, 0.3)',
          boxShadow: '0 0 15px rgba(138, 127, 216, 0.2)'
        }}>
          Halaman {currentPage + 1} dari {pages.length}
        </span>
      </div>

      {/* Image Container with 3:4 Aspect Ratio */}
      <div className="relative rounded-3xl overflow-hidden mb-6" style={{
        aspectRatio: '3/4',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        border: '3px solid rgba(138, 127, 216, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 40px rgba(138, 127, 216, 0.2)'
      }}>
        {/* Image */}
        {currentPageData.image_url ? (
          <img
            src={currentPageData.image_url}
            alt={`Halaman ${currentPage + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, #f8f5ff 0%, #fff9f5 100%)'
          }}>
            <p style={{ color: '#8B7355' }}>Memuat gambar...</p>
          </div>
        )}

        {/* Text Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6" style={{
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 50%, transparent 100%)'
        }}>
          <p className="text-white text-lg font-medium text-center leading-relaxed" style={{
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
          }}>
            {currentPageData.text}
          </p>
        </div>

        {/* Navigation Arrows */}
        {currentPage > 0 && (
          <button
            onClick={goToPrevPage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(138, 127, 216, 0.3)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(138, 127, 216, 0.4)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronLeft className="w-6 h-6" style={{ color: '#473C8B' }} />
          </button>
        )}

        {currentPage < pages.length - 1 && (
          <button
            onClick={goToNextPage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(138, 127, 216, 0.3)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(138, 127, 216, 0.4)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronRight className="w-6 h-6" style={{ color: '#473C8B' }} />
          </button>
        )}
      </div>

      {/* Audio Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={togglePlayPause}
          disabled={!currentPageData.audio_url}
          className="relative flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all overflow-hidden"
          style={{
            background: currentPageData.audio_url
              ? 'linear-gradient(135deg, #473C8B 0%, #6B5FBD 100%)'
              : 'rgba(71, 60, 139, 0.2)',
            color: 'white',
            border: '2px solid rgba(138, 127, 216, 0.4)',
            boxShadow: currentPageData.audio_url
              ? '0 0 25px rgba(138, 127, 216, 0.3)'
              : 'none',
            cursor: currentPageData.audio_url ? 'pointer' : 'not-allowed',
            opacity: currentPageData.audio_url ? 1 : 0.5
          }}
          onMouseEnter={(e) => {
            if (currentPageData.audio_url) {
              e.currentTarget.style.boxShadow = '0 0 35px rgba(138, 127, 216, 0.5)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPageData.audio_url) {
              e.currentTarget.style.boxShadow = '0 0 25px rgba(138, 127, 216, 0.3)';
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5" style={{
                filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.5))'
              }} />
              <span>Jeda</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" style={{
                filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.5))'
              }} />
              <span>Putar Narasi</span>
            </>
          )}
        </button>

        {/* Hidden audio element */}
        {currentPageData.audio_url && (
          <audio
            ref={audioRef}
            src={currentPageData.audio_url}
            preload="auto"
          />
        )}
      </div>

      {/* Page Dots Indicator */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {pages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentPage(index);
              setShouldAutoPlay(false); // Don't autoplay when manually selecting page
              setIsPlaying(false);
            }}
            className="transition-all rounded-full"
            style={{
              width: index === currentPage ? '32px' : '8px',
              height: '8px',
              background: index === currentPage
                ? 'linear-gradient(90deg, #473C8B 0%, #8A7FD8 100%)'
                : 'rgba(138, 127, 216, 0.3)',
              boxShadow: index === currentPage
                ? '0 0 10px rgba(138, 127, 216, 0.5)'
                : 'none'
            }}
          />
        ))}
      </div>
    </div>
  );
}
