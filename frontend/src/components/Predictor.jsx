import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertTriangle, CheckCircle, RefreshCw, Download, HelpCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config';

const Predictor = () => {
  const { token } = useAuth();
  
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeInfoTab, setActiveInfoTab] = useState('symptoms');
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setError('');
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate size and format
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload an image file (JPG, JPEG, or PNG).");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setError('');
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(droppedFile.type)) {
      setError("Please upload an image file (JPG, JPEG, or PNG).");
      return;
    }

    setFile(droppedFile);
    setPreview(URL.createObjectURL(droppedFile));
    setResult(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setAnalyzing(true);
    setError('');
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(getApiUrl('/api/predict'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || "Diagnosis failed. Please try again.");
      }
    } catch (err) {
      console.error("Diagnosis request error:", err);
      setError("Failed to connect to the prediction server. Make sure the backend is running.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          AI-Powered <span className="text-primary-700">Crop Health Diagnosis</span>
        </h1>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto text-sm sm:text-base">
          Upload an image of a plant leaf to detect pests or diseases instantly and receive treatment strategies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Upload & Preview Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm glass-panel">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Upload Foliage Specimen</h2>
          
          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center">
              <ShieldAlert className="h-4.5 w-4.5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          {!preview ? (
            /* Upload Dropzone */
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className="border-2 border-dashed border-primary-200 hover:border-primary-500 bg-primary-50/10 hover:bg-primary-50/30 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[300px]"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png"
                className="hidden"
              />
              <div className="bg-primary-100 text-primary-700 p-4 rounded-full mb-4 shadow-2xs">
                <UploadCloud className="h-8 w-8" />
              </div>
              <p className="font-bold text-gray-800 text-sm">Drag & drop your leaf photo here</p>
              <p className="text-xs text-gray-400 mt-1">or click to browse from files</p>
              <div className="mt-4 flex space-x-2 text-[10px] font-bold text-primary-700 bg-primary-100/50 px-3 py-1 rounded-full uppercase tracking-wider">
                <span>PNG</span>
                <span>•</span>
                <span>JPG</span>
                <span>•</span>
                <span>JPEG</span>
              </div>
            </div>
          ) : (
            /* Image Preview & Actions */
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-xs h-[300px] flex items-center justify-center bg-gray-50">
                <img
                  src={preview}
                  alt="Leaf specimen"
                  className="max-h-full max-w-full object-contain"
                />
                
                {/* Scanner Laser effect during analysis */}
                {analyzing && (
                  <div className="absolute left-0 right-0 h-1 bg-primary-500 shadow-[0_0_10px_#22c55e,0_0_20px_#22c55e] animate-scan-line"></div>
                )}
              </div>

              {!result && !analyzing && (
                <div className="flex space-x-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                  <button
                    onClick={handleAnalyze}
                    className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm shadow-md transition-all cursor-pointer"
                  >
                    Analyze Leaf
                  </button>
                </div>
              )}

              {analyzing && (
                <div className="py-3 bg-primary-50 text-primary-800 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2">
                  <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                  <span>Processing neural scan...</span>
                </div>
              )}

              {result && (
                <button
                  onClick={handleReset}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Diagnose New Leaf</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Diagnosis Info Panel */}
        <div className="lg:col-span-7">
          {!result ? (
            /* Tutorial/Helper Panel */
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm min-h-[380px] flex flex-col justify-center text-center">
              <div className="mx-auto bg-primary-50 text-primary-700 p-4 rounded-2xl mb-4">
                <HelpCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-800">Diagnostic Guidance</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
                For the most accurate AI diagnostic prediction, make sure the leaf is:
              </p>
              <ul className="text-xs text-gray-500 mt-4 space-y-2 max-w-xs mx-auto text-left list-disc list-inside">
                <li>Clearly visible and in center focus</li>
                <li>Placed against a neutral background</li>
                <li>Adequately lit with no heavy shadows</li>
                <li>Showing the affected diseased spot patterns</li>
              </ul>
            </div>
          ) : (
            /* Prediction Results */
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Header result summary banner */}
              <div className="p-6 bg-gradient-to-r from-primary-800 to-primary-900 text-white flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary-200 bg-primary-950/40 px-3 py-1 rounded-full">
                    AI Diagnosis Complete
                  </span>
                  <h3 className="text-2xl font-black mt-2">
                    {result.crop_name}: <span className="text-primary-200">{result.disease_name}</span>
                  </h3>
                </div>
                
                {/* Status Badge */}
                <div className={`flex items-center space-x-1.5 px-4 py-2 rounded-2xl text-xs font-black shadow-inner ${
                  result.status === 'Healthy' 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/40' 
                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}>
                  {result.status === 'Healthy' ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>HEALTHY</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4" />
                      <span>DISEASED</span>
                    </>
                  )}
                </div>
              </div>

              {/* Statistical Confidence bar */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-3 w-full">
                  <span className="text-xs font-bold text-gray-500">Confidence Score:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        result.confidence > 80 ? 'bg-primary-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-black text-gray-800">{result.confidence}%</span>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="flex border-b border-gray-100 bg-white">
                {['symptoms', 'causes', 'treatment', 'prevention'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveInfoTab(tab)}
                    className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 outline-none transition-colors capitalize ${
                      activeInfoTab === tab
                        ? 'border-primary-600 text-primary-700'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="p-6 min-h-[160px] text-gray-700 text-sm leading-relaxed bg-white">
                {activeInfoTab === 'symptoms' && (
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 flex items-center text-xs uppercase tracking-wider text-primary-800">
                      Primary Identification Signs
                    </h4>
                    <p>{result.symptoms}</p>
                  </div>
                )}
                {activeInfoTab === 'causes' && (
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 flex items-center text-xs uppercase tracking-wider text-primary-800">
                      Pathogen / Causal Agent
                    </h4>
                    <p>{result.causes}</p>
                  </div>
                )}
                {activeInfoTab === 'treatment' && (
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 flex items-center text-xs uppercase tracking-wider text-primary-800">
                      Immediate Therapeutic Actions
                    </h4>
                    <p>{result.treatment}</p>
                  </div>
                )}
                {activeInfoTab === 'prevention' && (
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 flex items-center text-xs uppercase tracking-wider text-primary-800">
                      Long-term Cultivation Rules
                    </h4>
                    <p>{result.prevention}</p>
                  </div>
                )}
              </div>

              {/* PDF Download Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <span className="text-[10px] text-gray-400 italic">
                  *AI assessments are guidelines. Seek local experts if needed.
                </span>
                
                <a
                  href={getApiUrl(`/api/report/${result.id}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer hover:shadow-sm"
                >

                  <Download className="h-3.5 w-3.5" />
                  <span>Download PDF Report</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predictor;
