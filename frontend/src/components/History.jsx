import React, { useState, useEffect } from 'react';
import { Download, Calendar, ArrowRight, Eye, RefreshCw, Archive, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config';

const History = ({ setActiveTab }) => {
  const { authenticatedFetch } = useAuth();
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await authenticatedFetch('/api/history');
      if (res.ok) {
        const data = await res.ok ? await res.json() : [];
        setHistoryList(data);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Diagnosis <span className="text-primary-700 font-semibold">History Log</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Browse and download PDF reports for all your past plant diagnoses.
          </p>
        </div>
        <button
          onClick={fetchHistory}
          className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors shadow-2xs cursor-pointer"
          title="Refresh History"
        >
          <RefreshCw className="h-4.5 w-4.5" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-20">
          <RefreshCw className="h-8 w-8 text-primary-600 animate-spin" />
          <span className="text-sm font-semibold text-gray-500 mt-3">Loading diagnostic records...</span>
        </div>
      ) : historyList.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center max-w-md mx-auto">
          <div className="bg-primary-50 text-primary-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Archive className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No records found</h3>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            You haven't run any leaf scans yet. Diagnose a leaf to save records here.
          </p>
          <button
            onClick={() => setActiveTab('predictor')}
            className="inline-flex items-center space-x-1 bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-xs cursor-pointer hover:shadow-sm"
          >
            <span>Scan Leaf Now</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        /* History Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Log List */}
          <div className={`${selectedRecord ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Specimen</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Crop / Diagnosis</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Confidence</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {historyList.map((rec) => (
                    <tr 
                      key={rec.id}
                      className={`hover:bg-primary-50/20 transition-colors ${
                        selectedRecord && selectedRecord.id === rec.id ? 'bg-primary-50/40' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-12 w-12 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                          <img 
                            src={getApiUrl(rec.image_url)} 
                            alt="Specimen" 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              // If image fails, replace with default icon
                              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2315803d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.58.9 9.8A7 7 0 0 1 11 20z'/%3E%3Cpath d='M19 2c-2.26 4.33-5.27 7.14-8 10'/%3E%3C/svg%3E";
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-800 text-sm">{rec.crop_name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[150px]">{rec.disease_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${
                          rec.status === 'Healthy' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {rec.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-black text-gray-700 text-sm">
                        {rec.confidence}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-2">
                        <button
                          onClick={() => setSelectedRecord(rec)}
                          className="inline-flex items-center p-2 border border-gray-200 rounded-xl hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 text-gray-600 transition-all cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <a
                          href={getApiUrl(`/api/report/${rec.id}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors cursor-pointer"
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar: Detail Review Panel */}
          {selectedRecord && (
            <div className="lg:col-span-5 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm sticky top-24 animate-in slide-in-from-right-4 duration-300">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[9px] font-black uppercase bg-primary-100 text-primary-800 px-3 py-1 rounded-full">
                    Diagnosis Details
                  </span>
                  <h3 className="text-xl font-extrabold text-gray-900 mt-2">
                    {selectedRecord.crop_name}: <span className="text-primary-600">{selectedRecord.disease_name}</span>
                  </h3>
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>{selectedRecord.created_at}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-xs text-gray-400 hover:text-gray-600 font-bold border border-gray-200 px-2 py-1 rounded-lg"
                >
                  Hide
                </button>
              </div>

              {/* Crop Specimen Image */}
              <div className="rounded-2xl overflow-hidden border border-gray-200 h-44 mb-6 flex items-center justify-center bg-gray-50 shadow-2xs">
                <img 
                  src={getApiUrl(selectedRecord.image_url)} 
                  alt="Specimen" 
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Status and Confidence */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl text-center">
                  <div className="text-xs text-gray-400 font-bold">Health Status</div>
                  <div className={`text-sm font-black mt-1 ${
                    selectedRecord.status === 'Healthy' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedRecord.status.toUpperCase()}
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl text-center">
                  <div className="text-xs text-gray-400 font-bold">AI Confidence</div>
                  <div className="text-sm font-black text-gray-800 mt-1">
                    {selectedRecord.confidence}%
                  </div>
                </div>
              </div>

              {/* PDF Action */}
              <a
                href={getApiUrl(`/api/report/${selectedRecord.id}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >

                <Download className="h-4.5 w-4.5" />
                <span>Get PDF Certificate</span>
              </a>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default History;
