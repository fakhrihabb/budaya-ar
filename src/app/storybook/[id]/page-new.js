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
