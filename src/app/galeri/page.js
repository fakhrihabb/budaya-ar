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
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
        {/* Thumbnail */}
        <div className="relative w-full aspect-square">
          <Image
            src={experience.thumbnail}
            alt={experience.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-3">
          {/* User Info */}
          <div className="flex items-center gap-2 mb-2">
            <Image
              src={experience.user.avatar}
              alt={experience.user.username}
              width={24}
              height={24}
              className="rounded-full"
            />
            <p className="text-xs font-medium text-gray-700">@{experience.user.username}</p>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm text-gray-900 mb-1 line-clamp-1">
            {experience.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {experience.shortDescription}
          </p>

          {/* Favorite Button */}
          <button 
            onClick={toggleLike}
            className="flex items-center gap-1 transition-colors"
          >
            <Heart 
              className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
            <span className="text-sm font-semibold text-gray-700">{likes}</span>
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
    <Link href={`/storybook/${story.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
        {/* Thumbnail */}
        <div className="relative w-full aspect-square">
          <Image
            src={story.thumbnail}
            alt={story.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-3">
          {/* User Info */}
          <div className="flex items-center gap-2 mb-2">
            <Image
              src={story.user.avatar}
              alt={story.user.username}
              width={24}
              height={24}
              className="rounded-full"
            />
            <p className="text-xs font-medium text-gray-700">@{story.user.username}</p>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm text-gray-900 mb-1 line-clamp-1">
            {story.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {story.shortDescription}
          </p>

          {/* Favorite Button */}
          <button 
            onClick={toggleLike}
            className="flex items-center gap-1 transition-colors"
          >
            <Heart 
              className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
            <span className="text-sm font-semibold text-gray-700">{likes}</span>
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
    <div className="min-h-screen" style={{backgroundColor: '#F8F5F2'}}>
      {/* Header with Search and Tabs */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{color: '#473C8B'}} />
            <input
              type="text"
              placeholder="Cari pengalaman AR atau cerita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-full focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: '#D4A373',
                color: '#1B1B1E',
                backgroundColor: '#FFFFFF'
              }}
              onFocus={(e) => e.target.style.borderColor = '#473C8B'}
              onBlur={(e) => e.target.style.borderColor = '#D4A373'}
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('ar')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all ${
                activeTab === 'ar'
                  ? 'text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              style={activeTab === 'ar' ? {backgroundColor: '#473C8B'} : {backgroundColor: '#F0F0F0'}}
            >
              AR Experience
            </button>
            <button
              onClick={() => setActiveTab('storybook')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all ${
                activeTab === 'storybook'
                  ? 'text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              style={activeTab === 'storybook' ? {backgroundColor: '#473C8B'} : {backgroundColor: '#F0F0F0'}}
            >
              Buku Cerita
            </button>
          </div>
        </div>
      </header>

      {/* Grid Feed */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {currentData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg" style={{color: '#1B1B1E'}}>Tidak ada hasil ditemukan</p>
            <p className="text-sm mt-2" style={{color: '#473C8B'}}>Coba kata kunci lain</p>
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
    </div>
  );
}
