
import React, { useState, useCallback, useEffect } from 'react';
import { AppMode, PlantReport as PlantReportType, UserContext } from './types';
import CameraScanner from './components/CameraScanner';
import PlantReport from './components/PlantReport';
import { analyzePlantImage } from './services/geminiService';
import { 
  Leaf, 
  Camera, 
  History, 
  Menu, 
  Settings, 
  Github, 
  Heart, 
  Droplet, 
  Sun,
  MapPin,
  Clock,
  Home,
  Check,
  Microscope,
  ClipboardCheck
} from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('idle');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [report, setReport] = useState<PlantReportType | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [context, setContext] = useState<UserContext>({
    lastWatered: 'Unspecified',
    placement: 'Indoor',
    plantingType: 'Potted',
    isRescan: false
  });

  useEffect(() => {
    // Attempt to get location quietly
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setContext(prev => ({
          ...prev,
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude }
        }));
      }, (err) => console.log('Location denied'));
    }
  }, []);

  const handleStartProcess = () => setMode('context');
  const handleProceedToCamera = () => setMode('scanning');

  const handleCapture = useCallback(async (base64: string) => {
    setCapturedImage(base64);
    setMode('analyzing');
    setError(null);
    try {
      const result = await analyzePlantImage(base64, context);
      setReport(result);
      setMode('result');
    } catch (err) {
      console.error(err);
      setError('Analysis failed. Please ensure specimen is clearly visible and centered.');
      setMode('idle');
    }
  }, [context]);

  const handleReset = () => {
    setMode('idle');
    setCapturedImage(null);
    setReport(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 print:hidden">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={handleReset}>
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 transition-transform group-hover:scale-105">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-slate-900 leading-none">OpenNPlant</h1>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">Plant Scientist AI</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {context.location && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                <MapPin className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Climate Aware</span>
              </div>
            )}
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full">
              <History className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {mode === 'idle' && (
          <div className="max-w-4xl mx-auto px-4 py-12 md:py-24 flex flex-col items-center text-center">
            <div className="mb-12">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-inner">
                 <Leaf className="w-12 h-12" />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-[1.1]">
              Botanical Science <br /> <span className="text-emerald-600">at your fingertips.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl leading-relaxed">
              Identify health stress, analyze growth stages, and receive agronomical care plans verified by the OpenNPlant AI engine.
            </p>

            <button 
              onClick={handleStartProcess}
              className="group flex items-center justify-center gap-3 px-12 py-5 bg-slate-900 text-white rounded-3xl text-lg font-bold transition-all hover:bg-black hover:scale-105 active:scale-95 shadow-2xl shadow-slate-200"
            >
              <Camera className="w-6 h-6" />
              Start Specimen Scan
            </button>

            {error && (
              <div className="mt-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-3 max-w-md">
                <Settings className="w-5 h-5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
               <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                    {/* Fixed missing icon import for Microscope */}
                    <Microscope className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Scientifically Proven</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">Analysis calibrated against thousands of botanical reference cases.</p>
               </div>
               <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                    <Droplet className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Climate Context</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">Recommendations adjusted for local humidity, pollution, and urban heat levels.</p>
               </div>
               <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
                    <History className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">History Comparison</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">Track recovery paths over time with automated re-scan comparison.</p>
               </div>
            </div>
          </div>
        )}

        {mode === 'context' && (
          <div className="max-w-2xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
              {/* Fixed missing icon import for ClipboardCheck */}
              <ClipboardCheck className="w-8 h-8 text-emerald-600" />
              Scan Parameters
            </h2>
            
            <div className="space-y-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <section>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Last Watering</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Today', 'Yesterday', 'Few Days', 'Weeks Ago'].map(time => (
                    <button 
                      key={time}
                      onClick={() => setContext(c => ({...c, lastWatered: time}))}
                      className={`px-4 py-3 rounded-2xl text-sm font-bold border-2 transition-all ${context.lastWatered === time ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <section>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Environment</label>
                  <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl">
                    <button 
                      onClick={() => setContext(c => ({...c, placement: 'Indoor'}))}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${context.placement === 'Indoor' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                    >
                      <Home className="w-4 h-4" /> Indoor
                    </button>
                    <button 
                      onClick={() => setContext(c => ({...c, placement: 'Outdoor'}))}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${context.placement === 'Outdoor' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                    >
                      <Sun className="w-4 h-4" /> Outdoor
                    </button>
                  </div>
                </section>

                <section>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Planting Type</label>
                  <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl">
                    <button 
                      onClick={() => setContext(c => ({...c, plantingType: 'Potted'}))}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${context.plantingType === 'Potted' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                    >
                      Potted
                    </button>
                    <button 
                      onClick={() => setContext(c => ({...c, plantingType: 'Ground'}))}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${context.plantingType === 'Ground' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                    >
                      Ground
                    </button>
                  </div>
                </section>
              </div>

              <section className="pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setContext(c => ({...c, isRescan: !c.isRescan}))}
                  className="flex items-center gap-3 group"
                >
                  <div className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${context.isRescan ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-200'}`}>
                    {context.isRescan && <Check className="w-4 h-4" />}
                  </div>
                  <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">This is a follow-up scan (Progress Check)</span>
                </button>
              </section>

              <button 
                onClick={handleProceedToCamera}
                className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:scale-[1.02] transition-all"
              >
                Open Camera
              </button>
            </div>
          </div>
        )}

        {mode === 'scanning' && (
          <CameraScanner onCapture={handleCapture} onCancel={() => setMode('context')} />
        )}

        {mode === 'analyzing' && (
          <div className="fixed inset-0 bg-white/90 backdrop-blur-3xl z-50 flex flex-col items-center justify-center p-8">
            <div className="relative mb-12">
              <div className="w-32 h-32 border-4 border-slate-100 rounded-full flex items-center justify-center">
                 {/* Fixed missing icon import for Microscope */}
                 <Microscope className="w-16 h-16 text-emerald-600 animate-pulse" />
              </div>
              <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">OpenNPlant Core Analysis</h2>
            <p className="text-slate-500 text-center max-w-xs text-sm leading-relaxed">
              Performing multivariable botanical assessment including leaf pattern recognition and nutrient profiling.
            </p>
          </div>
        )}

        {mode === 'result' && report && capturedImage && (
          <PlantReport report={report} image={capturedImage} onReset={handleReset} />
        )}
      </main>

      <footer className="bg-slate-900 py-16 text-slate-400 mt-20 print:hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-slate-800 pb-12 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white">
                <Leaf className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tighter">OpenNPlant</h2>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors"><Github className="w-6 h-6" /></a>
              <button className="flex items-center gap-2 px-6 py-2 bg-slate-800 rounded-full font-bold text-white hover:bg-slate-700 transition-colors">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                Support Research
              </button>
            </div>
          </div>
          <p className="text-center text-xs mb-4">
            Analysis performed by Gemini 3.0 Pro. All botanical data processed in real-time.
          </p>
          <p className="text-center text-[10px] uppercase tracking-widest font-bold opacity-30">
            OpenNPlant AG-TECH DIVISION &copy; 2024
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
