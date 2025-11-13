'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Search } from 'lucide-react';

// Data dummy untuk AR experiences
const arExperiences = [
  {
    id: 'wayang-kulit',
    user: {
      username: 'budaya_jawa',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    thumbnail: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=800&fit=crop',
    title: 'Wayang Kulit Interaktif',
    shortDescription: 'Jelajahi wayang kulit 3D dengan animasi tradisional',
    likes: 234,
    modelUrl: '/models/wayang.glb'
  },
  {
    id: 'candi-borobudur',
    user: {
      username: 'heritage_id',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    thumbnail: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=800&h=800&fit=crop',
    title: 'Candi Borobudur Mini',
    shortDescription: 'Eksplorasi Candi Borobudur dalam skala mini',
    likes: 892,
    modelUrl: '/models/borobudur.glb'
  },
  {
    id: 'tari-saman',
    user: {
      username: 'nusantara_art',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    thumbnail: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&h=800&fit=crop',
    title: 'Tari Saman Virtual',
    shortDescription: 'Saksikan tari Saman dari Aceh dalam AR',
    likes: 567,
    modelUrl: '/models/tari-saman.glb'
  },
  {
    id: 'batik-explorer',
    user: {
      username: 'museum_virtual',
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    thumbnail: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&h=800&fit=crop',
    title: 'Batik Pattern Explorer',
    shortDescription: 'Pelajari motif batik nusantara dalam 3D',
    likes: 445,
    modelUrl: '/models/batik.glb'
  },
  {
    id: 'rumah-gadang',
    user: {
      username: 'tradisi_lokal',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    thumbnail: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&h=800&fit=crop',
    title: 'Rumah Gadang AR',
    shortDescription: 'Rumah adat Minangkabau dengan arsitektur unik',
    likes: 678,
    modelUrl: '/models/rumah-gadang.glb'
  },
  {
    id: 'gamelan-set',
    user: {
      username: 'gamelan_digital',
      avatar: 'https://i.pravatar.cc/150?img=6'
    },
    thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=800&fit=crop',
    title: 'Set Gamelan Interaktif',
    shortDescription: 'Mainkan gamelan virtual dengan suara autentik',
    likes: 1203,
    modelUrl: '/models/gamelan.glb'
  },
  {
    id: 'angklung',
    user: {
      username: 'budaya_jawa',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop',
    title: 'Angklung Tradisional',
    shortDescription: 'Alat musik bambu khas Sunda dalam AR',
    likes: 321,
    modelUrl: '/models/angklung.glb'
  },
  {
    id: 'keris',
    user: {
      username: 'heritage_id',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop',
    title: 'Keris Pusaka',
    shortDescription: 'Senjata tradisional dengan detail ukiran',
    likes: 543,
    modelUrl: '/models/keris.glb'
  }
];

// Data dummy untuk Buku Cerita
const bukuCeritaData = [
  {
    id: 'malin-kundang',
    user: {
      username: 'cerita_rakyat',
      avatar: 'https://i.pravatar.cc/150?img=11'
    },
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=800&fit=crop',
    title: 'Malin Kundang',
    shortDescription: 'Kisah anak durhaka yang dikutuk menjadi batu',
    likes: 1245,
    storybookUrl: '/storybook/malin-kundang'
  },
  {
    id: 'timun-mas',
    user: {
      username: 'dongeng_nusantara',
      avatar: 'https://i.pravatar.cc/150?img=12'
    },
    thumbnail: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?w=800&h=800&fit=crop',
    title: 'Timun Mas',
    shortDescription: 'Gadis kecil melawan raksasa dengan biji ajaib',
    likes: 987,
    storybookUrl: '/storybook/timun-mas'
  },
  {
    id: 'bawang-merah-bawang-putih',
    user: {
      username: 'cerita_rakyat',
      avatar: 'https://i.pravatar.cc/150?img=11'
    },
    thumbnail: 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=800&h=800&fit=crop',
    title: 'Bawang Merah & Bawang Putih',
    shortDescription: 'Kisah dua saudara dengan sifat berbeda',
    likes: 1432,
    storybookUrl: '/storybook/bawang-merah-bawang-putih'
  },
  {
    id: 'roro-jonggrang',
    user: {
      username: 'legenda_jawa',
      avatar: 'https://i.pravatar.cc/150?img=13'
    },
    thumbnail: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=800&fit=crop',
    title: 'Roro Jonggrang',
    shortDescription: 'Legenda cinta dan seribu candi dalam semalam',
    likes: 876,
    storybookUrl: '/storybook/roro-jonggrang'
  },
  {
    id: 'lutung-kasarung',
    user: {
      username: 'dongeng_nusantara',
      avatar: 'https://i.pravatar.cc/150?img=12'
    },
    thumbnail: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?w=800&h=800&fit=crop',
    title: 'Lutung Kasarung',
    shortDescription: 'Pangeran terkutuk dan putri yang bijaksana',
    likes: 654,
    storybookUrl: '/storybook/lutung-kasarung'
  },
  {
    id: 'sangkuriang',
    user: {
      username: 'legenda_jawa',
      avatar: 'https://i.pravatar.cc/150?img=13'
    },
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
    title: 'Sangkuriang',
    shortDescription: 'Asal usul Gunung Tangkuban Perahu',
    likes: 1123,
    storybookUrl: '/storybook/sangkuriang'
  },
  {
    id: 'jaka-tarub',
    user: {
      username: 'cerita_rakyat',
      avatar: 'https://i.pravatar.cc/150?img=11'
    },
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=800&fit=crop',
    title: 'Jaka Tarub',
    shortDescription: 'Pemuda yang jatuh cinta pada bidadari',
    likes: 789,
    storybookUrl: '/storybook/jaka-tarub'
  },
  {
    id: 'keong-mas',
    user: {
      username: 'dongeng_nusantara',
      avatar: 'https://i.pravatar.cc/150?img=12'
    },
    thumbnail: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&h=800&fit=crop',
    title: 'Keong Mas',
    shortDescription: 'Putri cantik yang dikutuk menjadi keong',
    likes: 945,
    storybookUrl: '/storybook/keong-mas'
  }
];

function ARExperienceCard({ experience }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(experience.likes);

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <Link href={`/ar/${experience.id}`} className="block group">
      <div className="relative rounded-2xl overflow-hidden transition-all cursor-pointer" style={{
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

        {/* Thumbnail */}
        <div className="relative w-full aspect-square">
          <Image
            src={experience.thumbnail}
            alt={experience.title}
            fill
            className="object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent)'
          }} />
        </div>

        {/* Content */}
        <div className="p-3 relative z-10">
          {/* User Info */}
          <div className="flex items-center gap-2 mb-2">
            <Image
              src={experience.user.avatar}
              alt={experience.user.username}
              width={24}
              height={24}
              className="rounded-full"
              style={{
                border: '2px solid rgba(138, 127, 216, 0.3)',
                boxShadow: '0 0 8px rgba(138, 127, 216, 0.2)'
              }}
            />
            <p className="text-xs font-medium" style={{ color: '#6B5FBD' }}>@{experience.user.username}</p>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm mb-1 line-clamp-1" style={{
            color: '#1B1B1E',
            textShadow: '0 0 10px rgba(138, 127, 216, 0.15)'
          }}>
            {experience.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs mb-3 line-clamp-2" style={{ color: '#8B7355' }}>
            {experience.shortDescription}
          </p>

          {/* Favorite Button */}
          <button 
            onClick={toggleLike}
            className="flex items-center gap-1 transition-all"
            style={{
              color: isLiked ? '#ef4444' : '#6B7280',
              filter: isLiked ? 'drop-shadow(0 0 5px rgba(239, 68, 68, 0.4))' : 'none'
            }}
          >
            <Heart 
              className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
            />
            <span className="text-sm font-semibold">{likes}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

function StorybookCard({ story }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(story.likes);

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <Link href="/storybook/my/0debe010-4dfc-452b-bdce-caaca077d3c0" className="block group">
      <div className="relative rounded-2xl overflow-hidden transition-all cursor-pointer" style={{
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

        {/* Thumbnail */}
        <div className="relative w-full aspect-square">
          <Image
            src={story.thumbnail}
            alt={story.title}
            fill
            className="object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent)'
          }} />
        </div>

        {/* Content */}
        <div className="p-3 relative z-10">
          {/* User Info */}
          <div className="flex items-center gap-2 mb-2">
            <Image
              src={story.user.avatar}
              alt={story.user.username}
              width={24}
              height={24}
              className="rounded-full"
              style={{
                border: '2px solid rgba(212, 163, 115, 0.3)',
                boxShadow: '0 0 8px rgba(212, 163, 115, 0.2)'
              }}
            />
            <p className="text-xs font-medium" style={{ color: '#D4A373' }}>@{story.user.username}</p>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm mb-1 line-clamp-1" style={{
            color: '#1B1B1E',
            textShadow: '0 0 10px rgba(212, 163, 115, 0.15)'
          }}>
            {story.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs mb-3 line-clamp-2" style={{ color: '#8B7355' }}>
            {story.shortDescription}
          </p>

          {/* Favorite Button */}
          <button 
            onClick={toggleLike}
            className="flex items-center gap-1 transition-all"
            style={{
              color: isLiked ? '#ef4444' : '#6B7280',
              filter: isLiked ? 'drop-shadow(0 0 5px rgba(239, 68, 68, 0.4))' : 'none'
            }}
          >
            <Heart 
              className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
            />
            <span className="text-sm font-semibold">{likes}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function GaleriPage() {
  const [activeTab, setActiveTab] = useState('ar'); // 'ar' or 'storybook'
  const [searchQuery, setSearchQuery] = useState('');

  // Filter data based on search query
  const filteredARExperiences = arExperiences.filter(exp => 
    exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStorybooks = bukuCeritaData.filter(story => 
    story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentData = activeTab === 'ar' ? filteredARExperiences : filteredStorybooks;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
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

      {/* Header with Search and Tabs */}
      <header className="sticky top-0 z-10" style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '2px solid rgba(138, 127, 216, 0.2)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)'
      }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="relative mb-4 rounded-2xl overflow-hidden" style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(138, 127, 216, 0.3)',
            boxShadow: '0 0 20px rgba(138, 127, 216, 0.15)'
          }}>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{
              color: '#473C8B',
              filter: 'drop-shadow(0 0 5px rgba(138, 127, 216, 0.4))'
            }} />
            <input
              type="text"
              placeholder="Cari pengalaman AR atau cerita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-transparent focus:outline-none"
              style={{
                color: '#1B1B1E'
              }}
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('ar')}
              className="relative flex-1 py-3 px-4 rounded-2xl font-semibold transition-all overflow-hidden group"
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
              className="relative flex-1 py-3 px-4 rounded-2xl font-semibold transition-all overflow-hidden group"
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
        </div>
      </header>

      {/* Grid Feed */}
      <main className="max-w-4xl mx-auto px-4 py-6 relative z-10">
        {currentData.length === 0 ? (
          <div className="text-center py-12 relative rounded-3xl overflow-hidden" style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(138, 127, 216, 0.25)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
          }}>
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
              background: 'radial-gradient(circle at center, rgba(138, 127, 216, 0.2), transparent 70%)'
            }} />
            <p className="text-lg font-bold relative z-10" style={{
              color: '#1B1B1E',
              textShadow: '0 0 15px rgba(138, 127, 216, 0.2)'
            }}>Tidak ada hasil ditemukan</p>
            <p className="text-sm mt-2 relative z-10" style={{
              color: '#6B5FBD'
            }}>Coba kata kunci lain</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {activeTab === 'ar' 
              ? currentData.map((experience) => (
                  <ARExperienceCard key={experience.id} experience={experience} />
                ))
              : currentData.map((story) => (
                  <StorybookCard key={story.id} story={story} />
                ))
            }
          </div>
        )}
      </main>

      {/* Bottom Navigation Spacer */}
      <div className="h-20"></div>

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
