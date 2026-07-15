import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import Predictor from './components/Predictor';
import History from './components/History';
import Dashboard from './components/Dashboard';
import { Sprout, ShieldCheck, FileSpreadsheet, Activity, ChevronRight } from 'lucide-react';

const AppContent = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleTabChange = (tab) => {
    // If trying to access protected tabs while logged out, show login modal
    if (['predictor', 'history', 'dashboard'].includes(tab) && !user) {
      setAuthModalOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-col agri-grid-bg text-gray-800">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        onOpenAuthModal={() => setAuthModalOpen(true)} 
      />

      <main className="flex-1">
        {/* HOMEPAGE VIEW */}
        {activeTab === 'home' && (
          <div className="relative overflow-hidden">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6 text-left">
                  <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide uppercase">
                    <Sprout className="h-4 w-4 text-primary-600 animate-bounce" />
                    <span>Next-Gen Smart Farming</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                    Protect Your Crops With <span className="text-primary-700">AI Pathology</span>
                  </h1>
                  <p className="text-gray-500 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl">
                    AgriGuard AI leverages deep learning to analyze plant foliage, detect anomalies, identify pathogens, and prescribe treatment protocols instantly.
                  </p>
                  
                  <div className="pt-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                      onClick={() => handleTabChange('predictor')}
                      className="bg-primary-600 hover:bg-primary-700 text-white font-black px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 text-sm sm:text-base cursor-pointer"
                    >
                      <span>Diagnose Specimen</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    {!user && (
                      <button
                        onClick={() => setAuthModalOpen(true)}
                        className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-extrabold px-8 py-4 rounded-2xl text-sm sm:text-base transition-colors cursor-pointer"
                      >
                        Create Free Account
                      </button>
                    )}
                  </div>
                </div>

                {/* Hero Feature Illustration */}
                <div className="lg:col-span-5 relative flex justify-center">
                  <div className="absolute w-72 h-72 bg-primary-200/50 rounded-full blur-3xl -z-10 -top-8 -left-8"></div>
                  <div className="absolute w-72 h-72 bg-lime-200/40 rounded-full blur-3xl -z-10 -bottom-8 -right-8"></div>
                  <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-xl w-full max-w-sm glass-panel animate-float-slow">
                    <div className="flex items-center space-x-4 border-b border-gray-100 pb-4 mb-4">
                      <div className="bg-primary-600 text-white p-2.5 rounded-xl">
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-gray-800 text-sm">Diagnostic System</h4>
                        <p className="text-[11px] text-gray-400 font-medium">Model: MobileNet-V2 Pathology</p>
                      </div>
                    </div>
                    <div className="space-y-3.5">
                      <div className="h-32 rounded-2xl bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center relative">
                        <img 
                          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%2316a34a' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.58.9 9.8A7 7 0 0 1 11 20z'/%3E%3Cpath d='M19 2c-2.26 4.33-5.27 7.14-8 10'/%3E%3C/svg%3E" 
                          alt="Leaf outline placeholder"
                          className="opacity-75"
                        />
                        <div className="absolute top-2 left-2 bg-green-100 text-green-800 text-[9px] font-black px-2 py-0.5 rounded-full">
                          TEST IMAGE
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-500">Scan Match Index</span>
                        <span className="font-black text-primary-700">96.8%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="bg-primary-600 h-full w-[96.8%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Features Grid */}
            <div className="bg-white border-t border-gray-100 py-16 relative z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Pathology Workflow Features</h2>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">Four steps to absolute plant protection</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* Feature 1 */}
                  <div className="p-6 bg-gray-50/50 hover:bg-primary-50/20 border border-gray-100/50 rounded-2xl transition-all text-center">
                    <div className="bg-primary-100 text-primary-700 p-3 rounded-2xl w-12 h-12 flex items-center justify-center mx-auto mb-4">
                      <Sprout className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-base">Instant Diagnosis</h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      Upload photo of leaf blight or rust, and get immediate pathogen diagnostics.
                    </p>
                  </div>
                  
                  {/* Feature 2 */}
                  <div className="p-6 bg-gray-50/50 hover:bg-primary-50/20 border border-gray-100/50 rounded-2xl transition-all text-center">
                    <div className="bg-green-100 text-green-700 p-3 rounded-2xl w-12 h-12 flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-base">Etiology & Cure</h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      Read detailed reports listing causes, symptoms, and instant treatment formulas.
                    </p>
                  </div>

                  {/* Feature 3 */}
                  <div className="p-6 bg-gray-50/50 hover:bg-primary-50/20 border border-gray-100/50 rounded-2xl transition-all text-center">
                    <div className="bg-amber-100 text-amber-700 p-3 rounded-2xl w-12 h-12 flex items-center justify-center mx-auto mb-4">
                      <FileSpreadsheet className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-base">PDF Certification</h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      Download professional PDF assessment certificates containing image and recipe logs.
                    </p>
                  </div>

                  {/* Feature 4 */}
                  <div className="p-6 bg-gray-50/50 hover:bg-primary-50/20 border border-gray-100/50 rounded-2xl transition-all text-center">
                    <div className="bg-blue-100 text-blue-700 p-3 rounded-2xl w-12 h-12 flex items-center justify-center mx-auto mb-4">
                      <Activity className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-base">Interactive Dashboard</h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      Visualize diagnosis ratios and analyze crop species trends with premium Recharts tools.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROTECTED ROUTES / PAGES */}
        {activeTab === 'predictor' && user && <Predictor />}
        {activeTab === 'history' && user && <History setActiveTab={handleTabChange} />}
        {activeTab === 'dashboard' && user && <Dashboard setActiveTab={handleTabChange} />}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10 mt-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center space-x-2 text-white mb-4">
            <Sprout className="h-6 w-6 text-primary-500" />
            <span className="font-black tracking-wider">AGRIGUARD AI</span>
          </div>
          <p className="text-xs max-w-md mx-auto leading-relaxed">
            Leading-edge deep neural network diagnostics for modern agricultural extensions. Designed to prevent disease spread and improve harvest yield.
          </p>
          <div className="text-[10px] text-gray-600 mt-6">
            © 2026 AgriGuard AI. All rights reserved. Version 1.0.0.
          </div>
        </div>
      </footer>

      {/* LOGIN/SIGNUP MODAL OVERLAY */}
      <Auth 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
