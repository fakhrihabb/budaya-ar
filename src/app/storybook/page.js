'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Sparkles, Send, Map, Lightbulb, Wand2, Shield, Moon, PartyPopper, Loader2 } from 'lucide-react';

export default function StorybookPage() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dummy moods for selection with lucide-react icons
  const moods = [
    { id: 'adventure', name: 'Petualangan', icon: Map, color: '#FFC857', neon: '#FFD700' },
    { id: 'wisdom', name: 'Kebijaksanaan', icon: Lightbulb, color: '#D4A373', neon: '#F4A460' },
    { id: 'magical', name: 'Magis', icon: Wand2, color: '#473C8B', neon: '#8A7FD8' },
    { id: 'heroic', name: 'Heroik', icon: Shield, color: '#2563eb', neon: '#60A5FA' },
    { id: 'mysterious', name: 'Misterius', icon: Moon, color: '#6366f1', neon: '#A78BFA' },
    { id: 'joyful', name: 'Riang', icon: PartyPopper, color: '#ec4899', neon: '#F472B6' },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('Silakan masukkan topik terlebih dahulu!');
      return;
    }
    if (!selectedMood) {
      alert('Silakan pilih mood cerita!');
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    
    // Simulate loading for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Redirect to the story page with the fixed ID
    router.push('/storybook/my/0debe010-4dfc-452b-bdce-caaca077d3c0');
  };

  const handleQuickSuggestion = () => {
    setTopic('Pacu Jalur Riau');
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
        @keyframes borderGlow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
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
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full blur-3xl opacity-20 animate-pulse" style={{
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
            {/* Neon glow effect */}
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
                Membuat Storybook...
              </h3>
              <p className="text-sm" style={{
                color: '#D4A373',
                textShadow: '0 0 8px rgba(212, 163, 115, 0.3)'
              }}>
                AI sedang menyiapkan cerita edukatif untuk Anda
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
            {/* Rotating ring */}
            <div className="absolute inset-0 animate-spin" style={{animationDuration: '3s'}}>
              <div className="w-full h-full rounded-full" style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(138, 127, 216, 0.6), transparent)'
              }} />
            </div>
            <BookOpen className="w-10 h-10 relative z-10" style={{
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
          Buat Storybook
        </h1>
        <p className="text-base font-medium" style={{
          color: '#8B7355',
          textShadow: '0 0 8px rgba(212, 163, 115, 0.3)'
        }}>
          Cerita budaya Indonesia yang interaktif dan edukatif
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        {/* Topic Input Section */}
        <div className="relative rounded-3xl p-6 overflow-hidden group" style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(212, 163, 115, 0.3)',
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.08),
                     inset 0 0 20px rgba(212, 163, 115, 0.05)`
        }}>
          {/* Animated border glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
            background: 'linear-gradient(45deg, transparent, rgba(212, 163, 115, 0.15), transparent)',
            animation: 'borderGlow 3s linear infinite'
          }} />
          
          <label className="block mb-3 relative z-10">
            <span className="text-lg font-semibold" style={{
              color: '#1B1B1E',
              textShadow: '0 0 8px rgba(138, 127, 216, 0.2)'
            }}>
              Topik Budaya
            </span>
            <span className="text-sm ml-2" style={{
              color: '#8B7355',
              textShadow: '0 0 5px rgba(212, 163, 115, 0.2)'
            }}>
              Apa yang ingin Anda pelajari?
            </span>
          </label>
          
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Contoh: Cerita tentang tradisi Pacu Jalur Riau..."
            className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all resize-none relative z-10"
            style={{
              borderColor: 'rgba(138, 127, 216, 0.3)',
              color: '#1B1B1E',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              minHeight: '120px',
              boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.05)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(138, 127, 216, 0.6)';
              e.target.style.boxShadow = '0 0 20px rgba(138, 127, 216, 0.25), inset 0 2px 10px rgba(0, 0, 0, 0.05)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(138, 127, 216, 0.3)';
              e.target.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.05)';
            }}
          />

          {/* Quick Suggestion */}
          <div className="mt-3 relative z-10">
            <p className="text-sm mb-2 font-medium" style={{
              color: '#8B7355',
              textShadow: '0 0 5px rgba(212, 163, 115, 0.2)'
            }}>
              Saran cepat:
            </p>
            <button
              onClick={handleQuickSuggestion}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all text-sm font-medium group/btn overflow-hidden relative"
              style={{
                borderColor: 'rgba(255, 200, 87, 0.5)',
                color: '#C89000',
                background: 'rgba(255, 200, 87, 0.1)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 15px rgba(255, 200, 87, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 200, 87, 0.8)';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 200, 87, 0.35)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 200, 87, 0.5)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 200, 87, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Sparkles className="w-4 h-4" style={{
                filter: 'drop-shadow(0 0 4px rgba(255, 200, 87, 0.6))'
              }} />
              Pacu Jalur Riau
            </button>
          </div>
        </div>

        {/* Mood Selection Section */}
        <div className="relative rounded-3xl p-6 overflow-hidden group" style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(138, 127, 216, 0.3)',
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.08),
                     inset 0 0 20px rgba(138, 127, 216, 0.05)`
        }}>
          {/* Animated border glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
            background: 'linear-gradient(45deg, transparent, rgba(138, 127, 216, 0.15), transparent)',
            animation: 'borderGlow 3s linear infinite'
          }} />
          
          <label className="block mb-4 relative z-10">
            <span className="text-lg font-semibold" style={{
              color: '#1B1B1E',
              textShadow: '0 0 8px rgba(138, 127, 216, 0.2)'
            }}>
              Pilih Mood Cerita
            </span>
            <span className="text-sm ml-2" style={{
              color: '#8B7355',
              textShadow: '0 0 5px rgba(212, 163, 115, 0.2)'
            }}>
              Bagaimana gaya ceritanya?
            </span>
          </label>

          <div className="grid grid-cols-2 gap-3 relative z-10">
            {moods.map((mood) => {
              const IconComponent = mood.icon;
              const isSelected = selectedMood === mood.id;
              return (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className="relative p-4 rounded-2xl border-2 transition-all duration-300 overflow-hidden group/mood"
                  style={{
                    borderColor: isSelected ? mood.neon : `${mood.color}40`,
                    background: isSelected 
                      ? `rgba(${parseInt(mood.color.slice(1,3), 16)}, ${parseInt(mood.color.slice(3,5), 16)}, ${parseInt(mood.color.slice(5,7), 16)}, 0.15)`
                      : 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: isSelected 
                      ? `0 0 30px ${mood.neon}50, inset 0 0 20px ${mood.color}20`
                      : '0 4px 10px rgba(0, 0, 0, 0.05)',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = `${mood.neon}70`;
                      e.currentTarget.style.boxShadow = `0 0 20px ${mood.neon}35`;
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = `${mood.color}40`;
                      e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.05)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover/mood:opacity-100 transition-opacity duration-300" style={{
                    background: `radial-gradient(circle at center, ${mood.neon}15, transparent 70%)`
                  }} />
                  
                  {/* Pulse animation when selected */}
                  {isSelected && (
                    <div className="absolute inset-0 animate-ping opacity-15" style={{
                      background: `radial-gradient(circle, ${mood.neon}, transparent 70%)`
                    }} />
                  )}
                  
                  <div className="relative z-10">
                    <IconComponent 
                      className="w-8 h-8 mx-auto mb-2" 
                      style={{
                        color: isSelected ? mood.color : mood.color,
                        filter: isSelected ? `drop-shadow(0 0 8px ${mood.neon}80)` : 'none'
                      }}
                    />
                    <div className="text-sm font-semibold" style={{
                      color: '#1B1B1E',
                      textShadow: isSelected ? `0 0 8px ${mood.neon}40` : 'none'
                    }}>
                      {mood.name}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!topic.trim() || !selectedMood || isLoading}
          className={`relative w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 overflow-hidden group ${
            !topic.trim() || !selectedMood || isLoading
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
          style={{
            background: !topic.trim() || !selectedMood || isLoading
              ? 'rgba(71, 60, 139, 0.2)'
              : 'linear-gradient(135deg, #473C8B 0%, #6B5FBD 100%)',
            color: 'white',
            border: '2px solid rgba(138, 127, 216, 0.4)',
            boxShadow: !topic.trim() || !selectedMood || isLoading
              ? 'none'
              : '0 0 30px rgba(138, 127, 216, 0.35), inset 0 0 20px rgba(138, 127, 216, 0.1)',
            textShadow: '0 0 8px rgba(255, 255, 255, 0.4)'
          }}
          onMouseEnter={(e) => {
            if (topic.trim() && selectedMood && !isLoading) {
              e.currentTarget.style.boxShadow = '0 0 40px rgba(138, 127, 216, 0.5), inset 0 0 30px rgba(138, 127, 216, 0.15)';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            }
          }}
          onMouseLeave={(e) => {
            if (topic.trim() && selectedMood && !isLoading) {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(138, 127, 216, 0.35), inset 0 0 20px rgba(138, 127, 216, 0.1)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }
          }}
        >
          {/* Animated gradient overlay */}
          {topic.trim() && selectedMood && !isLoading && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
              background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
              animation: 'shimmer 2s infinite'
            }} />
          )}
          
          <div className="relative z-10 flex items-center gap-3">
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" style={{
                  filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))'
                }} />
                Membuat...
              </>
            ) : (
              <>
                <Send className="w-6 h-6" style={{
                  filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.5))'
                }} />
                Buat Storybook
              </>
            )}
          </div>
        </button>

        {/* Info Text */}
        <div className="text-center px-4">
          <p className="text-sm font-medium" style={{
            color: '#8B7355',
            textShadow: '0 0 5px rgba(212, 163, 115, 0.2)'
          }}>
            AI akan menghasilkan cerita edukatif berdasarkan topik dan mood yang Anda pilih
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 gap-4 pt-4">
          <div className="relative flex items-start gap-3 p-4 rounded-2xl overflow-hidden group" style={{
            background: 'rgba(212, 163, 115, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(212, 163, 115, 0.25)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
          }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
              background: 'radial-gradient(circle at top left, rgba(212, 163, 115, 0.15), transparent 70%)'
            }} />
            
            <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{
              background: 'rgba(212, 163, 115, 0.15)',
              border: '2px solid rgba(212, 163, 115, 0.3)',
              boxShadow: '0 0 20px rgba(212, 163, 115, 0.2), inset 0 0 10px rgba(212, 163, 115, 0.05)'
            }}>
              <BookOpen className="w-6 h-6" style={{
                color: '#D4A373',
                filter: 'drop-shadow(0 0 5px rgba(212, 163, 115, 0.4))'
              }} />
            </div>
            <div className="relative">
              <h3 className="font-semibold mb-1" style={{
                color: '#1B1B1E',
                textShadow: '0 0 5px rgba(138, 127, 216, 0.15)'
              }}>
                Cerita Interaktif
              </h3>
              <p className="text-sm" style={{
                color: '#8B7355',
                textShadow: '0 0 3px rgba(212, 163, 115, 0.15)'
              }}>
                Nikmati cerita dengan visual yang menarik dan narasi yang mendalam
              </p>
            </div>
          </div>

          <div className="relative flex items-start gap-3 p-4 rounded-2xl overflow-hidden group" style={{
            background: 'rgba(138, 127, 216, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(138, 127, 216, 0.25)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
          }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
              background: 'radial-gradient(circle at top left, rgba(138, 127, 216, 0.15), transparent 70%)'
            }} />
            
            <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{
              background: 'rgba(138, 127, 216, 0.15)',
              border: '2px solid rgba(138, 127, 216, 0.3)',
              boxShadow: '0 0 20px rgba(138, 127, 216, 0.2), inset 0 0 10px rgba(138, 127, 216, 0.05)'
            }}>
              <Sparkles className="w-6 h-6" style={{
                color: '#473C8B',
                filter: 'drop-shadow(0 0 5px rgba(138, 127, 216, 0.4))'
              }} />
            </div>
            <div className="relative">
              <h3 className="font-semibold mb-1" style={{
                color: '#1B1B1E',
                textShadow: '0 0 5px rgba(138, 127, 216, 0.15)'
              }}>
                Disesuaikan dengan Mood
              </h3>
              <p className="text-sm" style={{
                color: '#8B7355',
                textShadow: '0 0 3px rgba(212, 163, 115, 0.15)'
              }}>
                Setiap cerita disesuaikan dengan mood yang Anda pilih untuk pengalaman yang unik
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
