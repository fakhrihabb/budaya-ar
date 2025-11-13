'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Heart, Edit2 } from 'lucide-react';

export default function MyPusakaPage() {
  const [activeTab, setActiveTab] = useState('ar');
  const [searchQuery, setSearchQuery] = useState('');

  // User profile data
  const userProfile = {
    name: 'Raden Wijaya',
    username: '@radenwijaya',
    bio: 'Pecinta budaya Indonesia 🇮🇩 | Mengoleksi artefak digital & cerita tradisional',
    profileImage: 'https://i.pravatar.cc/150?img=12',
  };

  // User's AR Experiences
  const myARExperiences = [
    {
      id: 1,
      title: 'Wayang Kulit Arjuna',
      description: 'Wayang kulit karakter Arjuna dari cerita Mahabharata',
      thumbnail: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=400&fit=crop',
      creator: 'Raden Wijaya',
      creatorAvatar: 'https://i.pravatar.cc/150?img=12',
      likes: 234,
      isLiked: true,
    },
    {
      id: 2,
      title: 'Candi Borobudur',
      description: 'Model 3D Candi Borobudur yang megah',
      thumbnail: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=400&fit=crop',
      creator: 'Raden Wijaya',
      creatorAvatar: 'https://i.pravatar.cc/150?img=12',
      likes: 456,
      isLiked: false,
    },
    {
      id: 3,
      title: 'Keris Pusaka',
      description: 'Keris pusaka dengan ukiran detail',
      thumbnail: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=400&fit=crop',
      creator: 'Raden Wijaya',
      creatorAvatar: 'https://i.pravatar.cc/150?img=12',
      likes: 189,
      isLiked: true,
    },
    {
      id: 4,
      title: 'Batik Kawung',
      description: 'Motif batik Kawung klasik dari Yogyakarta',
      thumbnail: 'https://images.unsplash.com/photo-1617533555203-eccd85c81e43?w=400&h=400&fit=crop',
      creator: 'Raden Wijaya',
      creatorAvatar: 'https://i.pravatar.cc/150?img=12',
      likes: 312,
      isLiked: false,
    },
  ];

  // User's Storybooks
  const myStorybooks = [
    {
      id: 1,
      title: 'Sangkuriang',
      description: 'Legenda pembentukan Gunung Tangkuban Perahu',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      creator: 'Raden Wijaya',
      creatorAvatar: 'https://i.pravatar.cc/150?img=12',
      likes: 567,
      isLiked: true,
    },
    {
      id: 2,
      title: 'Roro Jonggrang',
      description: 'Kisah cinta dan kutukan Candi Prambanan',
      thumbnail: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=400&fit=crop',
      creator: 'Raden Wijaya',
      creatorAvatar: 'https://i.pravatar.cc/150?img=12',
      likes: 423,
      isLiked: false,
    },
    {
      id: 3,
      title: 'Bawang Merah Bawang Putih',
      description: 'Cerita rakyat tentang dua saudara tiri',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400&fit=crop',
      creator: 'Raden Wijaya',
      creatorAvatar: 'https://i.pravatar.cc/150?img=12',
      likes: 389,
      isLiked: true,
    },
    {
      id: 4,
      title: 'Timun Mas',
      description: 'Petualangan Timun Mas melawan raksasa',
      thumbnail: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=400&h=400&fit=crop',
      creator: 'Raden Wijaya',
      creatorAvatar: 'https://i.pravatar.cc/150?img=12',
      likes: 445,
      isLiked: false,
    },
  ];

  // Filter based on search and active tab
  const filteredARExperiences = myARExperiences.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStorybooks = myStorybooks.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ARExperienceCard = ({ item }) => (
    <Link href={`/ar/${item.id}`}>
      <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        border: '2px solid rgba(138, 127, 216, 0.25)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(138, 127, 216, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.06)';
      }}
      >
        {/* Hover glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{
          background: 'radial-gradient(circle at center, rgba(138, 127, 216, 0.15), transparent 70%)'
        }} />

        <div className="relative aspect-square">
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            className="object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent)'
          }} />
        </div>
        <div className="p-3 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Image
              src={item.creatorAvatar}
              alt={item.creator}
              width={24}
              height={24}
              className="rounded-full"
              style={{
                border: '2px solid rgba(138, 127, 216, 0.3)',
                boxShadow: '0 0 8px rgba(138, 127, 216, 0.2)'
              }}
            />
            <span className="text-xs" style={{ color: '#6B5FBD' }}>{item.creator}</span>
          </div>
          <h3 className="font-bold mb-1 line-clamp-1" style={{
            color: '#1B1B1E',
            textShadow: '0 0 10px rgba(138, 127, 216, 0.15)'
          }}>{item.title}</h3>
          <p className="text-sm mb-2 line-clamp-2" style={{ color: '#8B7355' }}>{item.description}</p>
          <div className="flex items-center justify-between">
            <button
              onClick={(e) => {
                e.preventDefault();
                // Toggle like logic here
              }}
              className="flex items-center gap-1 text-sm transition-all"
              style={{
                color: item.isLiked ? '#ef4444' : '#6B7280',
                filter: item.isLiked ? 'drop-shadow(0 0 5px rgba(239, 68, 68, 0.4))' : 'none'
              }}
            >
              <Heart size={16} fill={item.isLiked ? '#ef4444' : 'none'} />
              <span>{item.likes}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );

  const StorybookCard = ({ item }) => (
    <Link href="/storybook/my/0debe010-4dfc-452b-bdce-caaca077d3c0">
      <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        border: '2px solid rgba(212, 163, 115, 0.25)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(212, 163, 115, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.06)';
      }}
      >
        {/* Hover glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{
          background: 'radial-gradient(circle at center, rgba(212, 163, 115, 0.15), transparent 70%)'
        }} />

        <div className="relative aspect-square">
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            className="object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent)'
          }} />
        </div>
        <div className="p-3 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Image
              src={item.creatorAvatar}
              alt={item.creator}
              width={24}
              height={24}
              className="rounded-full"
              style={{
                border: '2px solid rgba(212, 163, 115, 0.3)',
                boxShadow: '0 0 8px rgba(212, 163, 115, 0.2)'
              }}
            />
            <span className="text-xs" style={{ color: '#D4A373' }}>{item.creator}</span>
          </div>
          <h3 className="font-bold mb-1 line-clamp-1" style={{
            color: '#1B1B1E',
            textShadow: '0 0 10px rgba(212, 163, 115, 0.15)'
          }}>{item.title}</h3>
          <p className="text-sm mb-2 line-clamp-2" style={{ color: '#8B7355' }}>{item.description}</p>
          <div className="flex items-center justify-between">
            <button
              onClick={(e) => {
                e.preventDefault();
                // Toggle like logic here
              }}
              className="flex items-center gap-1 text-sm transition-all"
              style={{
                color: item.isLiked ? '#ef4444' : '#6B7280',
                filter: item.isLiked ? 'drop-shadow(0 0 5px rgba(239, 68, 68, 0.4))' : 'none'
              }}
            >
              <Heart size={16} fill={item.isLiked ? '#ef4444' : 'none'} />
              <span>{item.likes}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f5ff 50%, #fff9f5 100%)'
    }}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-30" style={{
          background: 'radial-gradient(circle, rgba(138, 127, 216, 0.3), transparent 70%)',
          animation: 'float 8s ease-in-out infinite',
          filter: 'blur(40px)'
        }} />
        <div className="absolute bottom-40 right-10 w-80 h-80 rounded-full opacity-30" style={{
          background: 'radial-gradient(circle, rgba(212, 163, 115, 0.3), transparent 70%)',
          animation: 'float 10s ease-in-out infinite reverse',
          filter: 'blur(40px)'
        }} />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full opacity-20" style={{
          background: 'radial-gradient(circle, rgba(255, 200, 87, 0.25), transparent 70%)',
          animation: 'float 12s ease-in-out infinite',
          filter: 'blur(50px)'
        }} />

        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(#473C8B 1px, transparent 1px), linear-gradient(90deg, #473C8B 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }} />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        {/* Profile Section */}
        <div className="relative rounded-3xl p-6 mb-6 overflow-hidden" style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(138, 127, 216, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
        }}>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
            background: 'radial-gradient(circle at top right, rgba(138, 127, 216, 0.2), transparent 70%)'
          }} />

          <div className="flex items-start gap-4 mb-4 relative z-10">
            <div className="relative">
              <Image
                src={userProfile.profileImage}
                alt={userProfile.name}
                width={80}
                height={80}
                className="rounded-full"
                style={{
                  border: '3px solid rgba(138, 127, 216, 0.4)',
                  boxShadow: '0 0 20px rgba(138, 127, 216, 0.3)'
                }}
              />
              {/* Rotating ring around avatar */}
              <div className="absolute inset-0 rounded-full animate-spin" style={{
                animationDuration: '8s',
                background: 'conic-gradient(from 0deg, transparent, rgba(138, 127, 216, 0.3), transparent)',
                padding: '2px',
                zIndex: -1
              }} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1" style={{
                color: '#1B1B1E',
                textShadow: '0 0 15px rgba(138, 127, 216, 0.2)'
              }}>
                {userProfile.name}
              </h2>
              <p className="text-sm mb-2" style={{
                color: '#6B5FBD',
                textShadow: '0 0 10px rgba(138, 127, 216, 0.15)'
              }}>
                {userProfile.username}
              </p>
              <p className="text-sm" style={{
                color: '#8B7355'
              }}>
                {userProfile.bio}
              </p>
            </div>
          </div>
          
          {/* Edit Profile Button */}
          <button
            className="relative w-full py-3 px-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #473C8B 0%, #6B5FBD 100%)',
              color: 'white',
              border: '2px solid rgba(138, 127, 216, 0.4)',
              boxShadow: '0 0 30px rgba(138, 127, 216, 0.3)',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 40px rgba(138, 127, 216, 0.5)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(138, 127, 216, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
              background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
              animation: 'shimmer 2s infinite'
            }} />
            <Edit2 size={18} className="relative z-10" style={{
              filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))'
            }} />
            <span className="relative z-10">Edit Profile</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative rounded-2xl overflow-hidden" style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(138, 127, 216, 0.3)',
            boxShadow: '0 0 20px rgba(138, 127, 216, 0.15)'
          }}>
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
              size={20}
              style={{
                color: '#473C8B',
                filter: 'drop-shadow(0 0 5px rgba(138, 127, 216, 0.4))'
              }}
            />
            <input
              type="text"
              placeholder="Cari koleksi saya..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-transparent focus:outline-none"
              style={{
                color: '#1B1B1E'
              }}
            />
          </div>
        </div>

        {/* Tab Switch */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab('ar')}
            className="flex-1 py-3 px-4 rounded-2xl font-semibold transition-all relative overflow-hidden group"
            style={{
              background: activeTab === 'ar'
                ? 'linear-gradient(135deg, #473C8B 0%, #6B5FBD 100%)'
                : 'rgba(255, 255, 255, 0.6)',
              color: activeTab === 'ar' ? 'white' : '#1B1B1E',
              border: `2px solid ${activeTab === 'ar' ? 'rgba(138, 127, 216, 0.4)' : 'rgba(138, 127, 216, 0.25)'}`,
              boxShadow: activeTab === 'ar'
                ? '0 0 30px rgba(138, 127, 216, 0.3)'
                : '0 0 15px rgba(138, 127, 216, 0.15)',
              backdropFilter: 'blur(10px)',
              textShadow: activeTab === 'ar' ? '0 0 10px rgba(255, 255, 255, 0.5)' : 'none'
            }}
          >
            {activeTab === 'ar' && (
              <div className="absolute inset-0 opacity-30" style={{
                background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                animation: 'shimmer 2s infinite'
              }} />
            )}
            <span className="relative z-10">AR Experience</span>
          </button>
          <button
            onClick={() => setActiveTab('storybook')}
            className="flex-1 py-3 px-4 rounded-2xl font-semibold transition-all relative overflow-hidden group"
            style={{
              background: activeTab === 'storybook'
                ? 'linear-gradient(135deg, #473C8B 0%, #6B5FBD 100%)'
                : 'rgba(255, 255, 255, 0.6)',
              color: activeTab === 'storybook' ? 'white' : '#1B1B1E',
              border: `2px solid ${activeTab === 'storybook' ? 'rgba(138, 127, 216, 0.4)' : 'rgba(138, 127, 216, 0.25)'}`,
              boxShadow: activeTab === 'storybook'
                ? '0 0 30px rgba(138, 127, 216, 0.3)'
                : '0 0 15px rgba(138, 127, 216, 0.15)',
              backdropFilter: 'blur(10px)',
              textShadow: activeTab === 'storybook' ? '0 0 10px rgba(255, 255, 255, 0.5)' : 'none'
            }}
          >
            {activeTab === 'storybook' && (
              <div className="absolute inset-0 opacity-30" style={{
                background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                animation: 'shimmer 2s infinite'
              }} />
            )}
            <span className="relative z-10">Buku Cerita</span>
          </button>
        </div>

        {/* Grid Content */}
        {activeTab === 'ar' && (
          <div className="grid grid-cols-2 gap-4">
            {filteredARExperiences.length > 0 ? (
              filteredARExperiences.map((item) => (
                <ARExperienceCard key={item.id} item={item} />
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <p style={{ color: '#6B7280' }}>Tidak ada AR Experience yang ditemukan</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'storybook' && (
          <div className="grid grid-cols-2 gap-4">
            {filteredStorybooks.length > 0 ? (
              filteredStorybooks.map((item) => (
                <StorybookCard key={item.id} item={item} />
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <p style={{ color: '#6B7280' }}>Tidak ada Buku Cerita yang ditemukan</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(-10px) translateX(-10px);
          }
        }

        @keyframes gridMove {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(50px);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
