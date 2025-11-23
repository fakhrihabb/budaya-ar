'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Box, CheckCircle, AlertCircle, Download } from 'lucide-react';

export default function Generate3DPage() {
  const router = useRouter();
  const [storyData, setStoryData] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [models, setModels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cacheStats, setCacheStats] = useState({ totalModels: 0, totalCreditsSaved: 0 });

  useEffect(() => {
    // Load story from localStorage
    const savedStory = localStorage.getItem('latestStory');
    if (savedStory) {
      try {
        const parsed = JSON.parse(savedStory);
        setStoryData(parsed);

        // Initialize models array
        const initialModels = parsed.story.chapters.map((chapter, index) => ({
          id: index,
          title: chapter.title,
          content: chapter.content, // Keep narrative for display
          prompt: chapter.modelPrompt || chapter.content, // Use modelPrompt for 3D generation, fallback to content
          status: 'pending', // 'pending', 'generating', 'completed', 'failed'
          taskId: null,
          modelUrl: null,
          thumbnailUrl: null,
          progress: 0,
          error: null,
          cached: false,
          similarity: null
        }));
        setModels(initialModels);
      } catch (error) {
        console.error('Error parsing story:', error);
        router.push('/arcv');
      }
    } else {
      router.push('/arcv');
    }

    // Load cache stats
    loadCacheStats();
  }, [router]);

  const loadCacheStats = async () => {
    try {
      const response = await fetch('/api/cache-stats');
      if (response.ok) {
        const data = await response.json();
        setCacheStats(data);
      }
    } catch (error) {
      console.error('Error loading cache stats:', error);
    }
  };

  const generateModel = async (index) => {
    const model = models[index];

    return new Promise(async (resolve, reject) => {
      try {
        // Update status to generating
        setModels(prev => prev.map((m, i) =>
          i === index ? { ...m, status: 'generating', progress: 0 } : m
        ));

        console.log(`🚀 Generating model ${index + 1}:`, model.title);

        // Call API to create 3D model task (with cache support)
        const response = await fetch('/api/generate-3d-model', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: model.prompt, // Use AI-generated modelPrompt directly
            title: model.title,
            content: model.content || model.prompt, // Use narrative content for cache matching
            artStyle: 'low-poly', // Low-poly untuk hemat credit
            negativePrompt: 'low quality, blurry, distorted, deformed, ugly',
            useCache: true // Enable cache
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create 3D model task');
        }

        // Check if model was found in cache
        if (data.cached) {
          console.log('✅ Model from cache:', data.message);

          // Model found in cache - immediately set as completed
          setModels(prev => prev.map((m, i) =>
            i === index ? {
              ...m,
              status: 'completed',
              taskId: data.taskId,
              modelUrl: data.modelUrl,
              thumbnailUrl: data.thumbnailUrl,
              progress: 100,
              cached: true,
              similarity: data.similarity
            } : m
          ));

          resolve(); // Cached model ready
          return;
        }

        // New model being generated - save task ID
        setModels(prev => prev.map((m, i) =>
          i === index ? { ...m, taskId: data.taskId, progress: 10, cached: false } : m
        ));

        console.log(`⏳ Polling for model ${index + 1}, taskId:`, data.taskId);

        // Start polling for status and resolve when done
        pollTaskStatus(index, data.taskId, model.title, model.prompt, resolve, reject);

      } catch (error) {
        console.error('Error generating model:', error);
        setModels(prev => prev.map((m, i) =>
          i === index ? { ...m, status: 'failed', error: error.message } : m
        ));
        reject(error);
      }
    });
  };

  const pollTaskStatus = async (index, taskId, title, content, resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 120; // 10 minutes (5 second intervals) - increased timeout

    const checkStatus = async () => {
      try {
        console.log(`🔍 Checking status for model ${index + 1}, attempt ${attempts + 1}/${maxAttempts}`);

        const response = await fetch(`/api/generate-3d-model?taskId=${taskId}&title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to check status');
        }

        console.log(`📊 Model ${index + 1} status:`, data.status, `Progress: ${data.progress}%`);

        // Update progress
        setModels(prev => prev.map((m, i) =>
          i === index ? { ...m, progress: data.progress || m.progress } : m
        ));

        if (data.status === 'SUCCEEDED') {
          // Model completed
          console.log(`✅ Model ${index + 1} completed!`);
          setModels(prev => prev.map((m, i) =>
            i === index ? {
              ...m,
              status: 'completed',
              modelUrl: data.modelUrl,
              thumbnailUrl: data.thumbnailUrl,
              progress: 100
            } : m
          ));
          resolve(); // Resolve the promise
          return;
        } else if (data.status === 'FAILED') {
          throw new Error('Model generation failed');
        } else {
          // Still in progress
          attempts++;
          if (attempts >= maxAttempts) {
            throw new Error('Timeout: Model generation took too long (10 minutes)');
          }
          // Continue polling after 5 seconds
          setTimeout(checkStatus, 5000);
        }
      } catch (error) {
        console.error('❌ Error checking status:', error);
        setModels(prev => prev.map((m, i) =>
          i === index ? { ...m, status: 'failed', error: error.message } : m
        ));
        reject(error);
      }
    };

    // Start checking
    setTimeout(checkStatus, 5000); // Wait 5 seconds before first check
  };

  const generateAllModels = async () => {
    console.log('🎯 Starting generation for all models...', models.length, 'models');

    if (!models || models.length === 0) {
      console.error('❌ No models found to generate!');
      alert('Tidak ada models untuk di-generate. Silakan reload page.');
      return;
    }

    setGenerating(true);

    for (let i = 0; i < models.length; i++) {
      setCurrentIndex(i);
      console.log(`\n📦 Starting model ${i + 1}/${models.length}: ${models[i].title}`);

      // Wait for model generation to complete before moving to next
      await new Promise((resolve) => {
        generateModel(i).then(() => {
          console.log(`✅ Model ${i + 1} done, waiting 2 seconds...`);
          // Wait 2 seconds after completion before next model
          setTimeout(resolve, 2000);
        }).catch((error) => {
          console.error(`❌ Error generating model ${i + 1}:`, error);
          resolve(); // Continue to next model even if this one fails
        });
      });
    }

    console.log('🎉 All models generation completed!');
    setGenerating(false);
    loadCacheStats(); // Refresh cache stats after all done
  };

  if (!storyData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f5ff 50%, #fff9f5 100%)'
      }}>
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4" style={{ color: '#473C8B' }} />
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-4 sm:px-6 relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f5ff 50%, #fff9f5 100%)'
    }}>
      {/* Background */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(#473C8B 1px, transparent 1px), linear-gradient(90deg, #473C8B 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="pt-8 pb-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/arcv/result')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(138, 127, 216, 0.3)',
              color: '#473C8B'
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>

          <button
            onClick={() => {
              console.log('🖱️ Button clicked!');
              generateAllModels();
            }}
            disabled={generating}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              generating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{
              background: 'linear-gradient(135deg, #473C8B 0%, #6B5FBD 100%)',
              color: 'white',
              border: '2px solid rgba(138, 127, 216, 0.4)',
              boxShadow: '0 0 30px rgba(138, 127, 216, 0.35)'
            }}
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Box className="w-5 h-5" />
                Generate Semua Model
              </>
            )}
          </button>
        </div>

        {/* Title */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2" style={{
            background: 'linear-gradient(135deg, #473C8B 0%, #8A7FD8 50%, #D4A373 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Generate Model 3D AR
          </h1>
          <p style={{ color: '#8B7355' }}>
            {storyData.story.title}
          </p>
        </div>

        {/* Cache Stats */}
        {cacheStats.totalModels > 0 && (
          <div className="mb-6 p-4 rounded-xl flex items-center justify-center gap-6" style={{
            background: 'rgba(255, 200, 87, 0.1)',
            border: '1px solid rgba(255, 200, 87, 0.3)'
          }}>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#D97706' }}>
                {cacheStats.totalModels}
              </div>
              <div className="text-xs" style={{ color: '#92400E' }}>
                Models Cached
              </div>
            </div>
            <div className="w-px h-10" style={{ background: 'rgba(255, 200, 87, 0.3)' }} />
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#D97706' }}>
                {cacheStats.totalCreditsSaved || 0}
              </div>
              <div className="text-xs" style={{ color: '#92400E' }}>
                Credits Saved ⚡
              </div>
            </div>
          </div>
        )}

        {/* Models List */}
        <div className="space-y-4">
          {models.map((model, index) => (
            <div
              key={index}
              className="relative rounded-2xl p-6 overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(212, 163, 115, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div className="flex items-start gap-4">
                {/* Icon/Status */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{
                  background: model.status === 'completed' ? 'rgba(34, 197, 94, 0.15)' :
                             model.status === 'failed' ? 'rgba(239, 68, 68, 0.15)' :
                             model.status === 'generating' ? 'rgba(138, 127, 216, 0.15)' :
                             'rgba(156, 163, 175, 0.15)',
                  border: `2px solid ${
                    model.status === 'completed' ? 'rgba(34, 197, 94, 0.3)' :
                    model.status === 'failed' ? 'rgba(239, 68, 68, 0.3)' :
                    model.status === 'generating' ? 'rgba(138, 127, 216, 0.3)' :
                    'rgba(156, 163, 175, 0.3)'
                  }`
                }}>
                  {model.status === 'completed' && <CheckCircle className="w-6 h-6 text-green-600" />}
                  {model.status === 'failed' && <AlertCircle className="w-6 h-6 text-red-600" />}
                  {model.status === 'generating' && <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#473C8B' }} />}
                  {model.status === 'pending' && <Box className="w-6 h-6 text-gray-400" />}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#1B1B1E' }}>
                    {index + 1}. {model.title}
                  </h3>
                  <p className="text-sm mb-3" style={{ color: '#6B7280' }}>
                    {model.prompt.substring(0, 100)}...
                  </p>

                  {/* Progress Bar */}
                  {model.status === 'generating' && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1" style={{ color: '#6B7280' }}>
                        <span>Progress</span>
                        <span>{model.progress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(156, 163, 175, 0.2)' }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${model.progress}%`,
                            background: 'linear-gradient(90deg, #473C8B 0%, #8A7FD8 100%)'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Status Message */}
                  {model.status === 'completed' && (
                    <div className="space-y-2">
                      {/* Cache indicator */}
                      {model.cached && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium" style={{
                          background: 'rgba(255, 200, 87, 0.1)',
                          color: '#D97706',
                          border: '1px solid rgba(255, 200, 87, 0.3)'
                        }}>
                          ⚡ From Cache {model.similarity ? `(${model.similarity}% match)` : '(Exact match)'} - Credit Saved!
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <a
                          href={model.modelUrl}
                          download
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                          style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            color: '#059669',
                            border: '1px solid rgba(34, 197, 94, 0.3)'
                          }}
                        >
                          <Download className="w-4 h-4" />
                          Download GLB
                        </a>
                      </div>
                    </div>
                  )}

                  {model.status === 'failed' && (
                    <p className="text-sm text-red-600">
                      Error: {model.error || 'Generation failed'}
                    </p>
                  )}

                  {/* Test button for pending models */}
                  {model.status === 'pending' && (
                    <button
                      onClick={() => {
                        console.log('🧪 Test generating single model:', index);
                        generateModel(index);
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: 'rgba(138, 127, 216, 0.1)',
                        color: '#473C8B',
                        border: '1px solid rgba(138, 127, 216, 0.3)'
                      }}
                    >
                      Test Generate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-6 p-4 rounded-xl space-y-2" style={{
          background: 'rgba(138, 127, 216, 0.1)',
          border: '1px solid rgba(138, 127, 216, 0.2)'
        }}>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            💡 <strong>Info:</strong> Generate model 3D membutuhkan waktu 5-10 menit per model (low-poly, optimal untuk mobile AR).
          </p>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            ⚡ <strong>Cache System:</strong> Model dengan cerita serupa (70%+ similarity) akan otomatis menggunakan model dari cache. Hemat credit & waktu!
          </p>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            📥 <strong>Penyimpanan:</strong> Model 3D di-host di server Meshy AI (tidak disimpan lokal). Cache hanya menyimpan URL model untuk reuse.
          </p>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            🔍 <strong>Debugging:</strong> Buka browser console (F12) untuk melihat progress detail tiap model.
          </p>
        </div>
      </div>
    </div>
  );
}
