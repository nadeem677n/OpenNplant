
import React from 'react';
import { PlantReport as PlantReportType } from '../types';
import { 
  Printer, 
  ChevronRight, 
  Droplet, 
  Sun, 
  AlertCircle, 
  ClipboardCheck, 
  Info,
  Calendar,
  Microscope,
  MapPin
} from 'lucide-react';

interface PlantReportProps {
  report: PlantReportType;
  image: string;
  onReset: () => void;
}

const PlantReport: React.FC<PlantReportProps> = ({ report, image, onReset }) => {
  const handlePrint = () => {
    window.print();
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Mild Stress': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Moderate Stress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'High Stress': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div id="printable-report" className="max-w-4xl mx-auto px-6 py-8 bg-white print:p-0">
      {/* Action Bar - Hidden in Print */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <button onClick={onReset} className="text-sm font-bold text-emerald-600 flex items-center gap-1">
          <ChevronRight className="w-4 h-4 rotate-180" /> Back to Scanner
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold text-slate-700 transition-colors"
        >
          <Printer className="w-4 h-4" /> Export Report (PDF)
        </button>
      </div>

      {/* 1. Header & ID */}
      <div className="flex flex-col md:flex-row gap-8 mb-10 pb-10 border-b border-slate-100">
        <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden shadow-inner bg-slate-50 flex-shrink-0">
          <img src={`data:image/jpeg;base64,${image}`} alt="Specimen" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Microscope className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Botanical Specimen Report</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-1">{report.identification.commonName}</h1>
          <p className="text-xl italic text-slate-500 font-medium mb-4">{report.identification.scientificName}</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">{report.identification.category}</span>
            <span className={`px-3 py-1 border text-xs font-bold rounded-full ${getHealthColor(report.health.status)}`}>
              {report.health.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left Column: Diagnostics */}
        <div className="md:col-span-2 space-y-10">
          
          {/* 2 & 3. Growth & Health Details */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> Visual Assessment
            </h3>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <p className="text-sm text-slate-700 leading-relaxed mb-4">
                <strong>Growth Stage:</strong> {report.age.growthStage}. {report.age.description}
              </p>
              <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 italic">
                <p className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {report.health.confidenceNote}
                </p>
              </div>
            </div>
          </section>

          {/* 4. Visible Symptoms */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Visible Symptoms</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.symptoms.map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className="text-sm text-slate-700">{s}</span>
                </div>
              ))}
              {report.symptoms.length === 0 && <p className="text-sm text-emerald-600 font-medium italic">No abnormal symptoms detected.</p>}
            </div>
          </section>

          {/* 5 & 6. Care Assessment */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-blue-500" /> Hydration & Light
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1">Water Status</p>
                  <p className="text-sm text-slate-700">{report.assessment.water}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1">Light Exposure</p>
                  <p className="text-sm text-slate-700">{report.assessment.sunlight}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" /> Nutrient Concerns
              </h3>
              <ul className="space-y-2">
                {report.nutrientConcerns.map((n, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 9. Timeline */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Growth & Recovery Timeline
            </h3>
            <div className="space-y-4">
              {report.timeline.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </div>
                    {i < report.timeline.length - 1 && <div className="w-0.5 flex-1 bg-slate-100 my-1" />}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-slate-900">{item.stage}</h4>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-500">{item.timeEstimation}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Action Plan */}
        <div className="space-y-8">
          {/* 7. Immediate Action Plan */}
          <section className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5" /> Immediate Action
            </h3>
            <ul className="space-y-4">
              {report.actionPlan.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-emerald-500 flex-shrink-0 flex items-center justify-center text-[10px] font-black">
                    {i + 1}
                  </div>
                  <p className="text-sm font-medium leading-snug">{step}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* 8. Long-term Tips */}
          <section className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
            <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-4">Long-Term Care</h3>
            <ul className="space-y-3">
              {report.longTermTips.map((tip, i) => (
                <li key={i} className="text-sm text-emerald-900 flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </section>

          {/* 10. Disclaimer */}
          <section className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-bold text-center">
              Scientist's Note
            </p>
            <p className="text-[10px] text-slate-400 leading-relaxed italic text-center mt-2">
              {report.disclaimer} Analysis performed by OpenNPlant AI v3.0. This is an AI-assisted visual analysis and not a substitute for professional or laboratory testing.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PlantReport;
