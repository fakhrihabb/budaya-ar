'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function StorybookDetailPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#F8F5F2'}}>
      <div className="text-center px-4">
        <h1 className="text-3xl font-bold mb-4" style={{color: '#473C8B'}}>
          Storybook Detail Page
        </h1>
        <p className="mb-6" style={{color: '#1B1B1E'}}>
          This page is under construction
        </p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-lg hover:shadow-xl transition-all"
          style={{backgroundColor: '#473C8B'}}
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>
      </div>
    </div>
  );
}


// Data cerita (idealnya dari API/database)
const storybookData = {
  'malin-kundang': {
    id: 'malin-kundang',
    title: 'Malin Kundang',
    subtitle: 'Kisah Anak Durhaka',
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop',
    description: 'Cerita rakyat dari Sumatera Barat tentang seorang anak yang durhaka kepada ibunya.',
    author: 'Cerita Rakyat Nusantara',
    pages: [
      {
        id: 1,
        text: 'Dahulu kala, hiduplah seorang janda miskin bernama Mande Rubayah bersama anaknya yang bernama Malin Kundang di sebuah desa nelayan.',
        image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop'
      },
      {
        id: 2,
        text: 'Malin tumbuh menjadi pemuda yang tampan dan cerdas. Suatu hari, ia memutuskan untuk merantau mencari kekayaan di negeri seberang.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      },
      {
        id: 3,
        text: 'Dengan berat hati, ibunya melepas kepergian Malin. "Berhati-hatilah, anakku. Jangan lupakan ibumu," pesan sang ibu.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop'
      },
      {
        id: 4,
        text: 'Bertahun-tahun berlalu, Malin menjadi saudagar kaya dan menikah dengan putri saudagar. Mereka berlayar kembali ke kampung halaman.',
        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop'
      },
      {
        id: 5,
        text: 'Mande Rubayah mendengar kabar kedatangan kapal besar. Dengan penuh harap, ia berlari ke pelabuhan untuk bertemu anaknya.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'
      },
      {
        id: 6,
        text: 'Namun Malin malu mengakui ibunya yang miskin. "Pergi! Aku bukan anakmu!" teriaknya dengan kasar di depan istrinya.',
        image: 'https://images.unsplash.com/photo-1534294668821-28a3054f4256?w=800&h=600&fit=crop'
      },
      {
        id: 7,
        text: 'Sang ibu sangat sedih dan marah. Dengan penuh luka, ia mengangkat tangannya ke langit dan mengutuk Malin.',
        image: 'https://images.unsplash.com/photo-1510133768164-a8f7e4d4e3dc?w=800&h=600&fit=crop'
      },
      {
        id: 8,
        text: 'Tiba-tiba langit menjadi gelap, badai besar datang. Kapal Malin hancur dan tubuhnya berubah menjadi batu di tepi pantai.',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop'
      }
    ],
    moral: 'Hormati dan sayangi orang tua, karena kebahagiaan kita bergantung pada restu mereka.'
  },
  'timun-mas': {
    id: 'timun-mas',
    title: 'Timun Mas',
    subtitle: 'Gadis Pemberani Melawan Raksasa',
    coverImage: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?w=1200&h=800&fit=crop',
    description: 'Kisah seorang gadis kecil yang mengalahkan raksasa dengan kecerdikan dan keberanian.',
    author: 'Cerita Rakyat Jawa Tengah',
    pages: [
      {
        id: 1,
        text: 'Seorang janda tua sangat ingin memiliki anak. Ia memohon kepada raksasa hijau yang memberikannya biji timun ajaib.',
        image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=800&h=600&fit=crop'
      },
      {
        id: 2,
        text: 'Dari biji timun itu lahirlah seorang bayi perempuan cantik yang diberi nama Timun Mas. Namun ada syarat dari raksasa...',
        image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&h=600&fit=crop'
      }
    ],
    moral: 'Kecerdikan dan keberanian dapat mengalahkan kekuatan yang lebih besar.'
  },
  'bawang-merah-bawang-putih': {
    id: 'bawang-merah-bawang-putih',
    title: 'Bawang Merah & Bawang Putih',
    subtitle: 'Kebaikan Akan Dibalas Kebaikan',
    coverImage: 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=1200&h=800&fit=crop',
    description: 'Cerita tentang dua saudara tiri dengan sifat yang sangat berbeda.',
    author: 'Cerita Rakyat Nusantara',
    pages: [],
    moral: 'Kebaikan akan dibalas dengan kebaikan, dan kejahatan akan mendapat balasannya.'
  },
  'roro-jonggrang': {
    id: 'roro-jonggrang',
    title: 'Roro Jonggrang',
    subtitle: 'Legenda Candi Prambanan',
    coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=800&fit=crop',
    description: 'Kisah cinta dan seribu candi yang dibangun dalam satu malam.',
    author: 'Legenda Jawa Tengah',
    pages: [],
    moral: 'Kesombongan dan tipu daya akan membawa petaka.'
  },
  'lutung-kasarung': {
    id: 'lutung-kasarung',
    title: 'Lutung Kasarung',
    subtitle: 'Pangeran Terkutuk',
    coverImage: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?w=1200&h=800&fit=crop',
    description: 'Cerita tentang pangeran yang dikutuk menjadi lutung hitam.',
    author: 'Cerita Rakyat Sunda',
    pages: [],
    moral: 'Jangan menilai seseorang dari penampilan luarnya.'
  },
  'sangkuriang': {
    id: 'sangkuriang',
    title: 'Sangkuriang',
    subtitle: 'Asal Usul Gunung Tangkuban Perahu',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
    description: 'Legenda terjadinya Gunung Tangkuban Perahu di Jawa Barat.',
    author: 'Legenda Sunda',
    pages: [],
    moral: 'Amarah dan nafsu dapat membawa kehancuran.'
  },
  'jaka-tarub': {
    id: 'jaka-tarub',
    title: 'Jaka Tarub',
    subtitle: 'Pemuda dan Bidadari',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop',
    description: 'Kisah cinta antara pemuda desa dan bidadari dari kayangan.',
    author: 'Cerita Rakyat Jawa',
    pages: [],
    moral: 'Cinta sejati akan selalu menemukan jalannya.'
  },
  'keong-mas': {
    id: 'keong-mas',
    title: 'Keong Mas',
    subtitle: 'Putri yang Dikutuk',
    coverImage: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&h=800&fit=crop',
    description: 'Cerita tentang putri cantik yang dikutuk menjadi keong emas.',
    author: 'Cerita Rakyat Jawa Timur',
    pages: [],
    moral: 'Kesabaran dan kebaikan hati akan mengalahkan kejahatan.'
  }
};
