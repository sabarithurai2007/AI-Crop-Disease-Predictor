import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  LineChart, Line, CartesianGrid 
} from 'recharts';
import { LayoutDashboard, Award, ShieldAlert, Sparkles, Sprout, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#15803d', '#22c55e', '#a3e635', '#f59e0b', '#ef4444', '#3b82f6'];

const Dashboard = ({ setActiveTab }) => {
  const { authenticatedFetch } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await authenticatedFetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 max-w-6xl mx-auto">
        <Sprout className="h-8 w-8 text-primary-600 animate-spin" />
        <span className="text-sm font-semibold text-gray-500 mt-3">Compiling statistical reports...</span>
      </div>
    );
  }

  // Check if we have predictions recorded
  const hasData = stats && stats.total > 0;

  // Format Recharts data
  const cropData = stats ? Object.keys(stats.crop_counts).map(crop => ({
    name: crop,
    value: stats.crop_counts[crop]
  })) : [];

  const diseaseData = stats ? Object.keys(stats.disease_counts).map(disease => ({
    name: disease.split("___").pop().replace(/_/g, " "),
    count: stats.disease_counts[disease]
  })) : [];

  const timelineData = stats ? stats.timeline.map(item => ({
    ...item,
    // Format date string to simpler MM/DD format
    shortDate: item.date.split('-').slice(1).join('/')
  })) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Performance <span className="text-primary-700 font-semibold">Analytics Dashboard</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Monitor your leaf scans, disease distribution, and diagnostics analytics.
        </p>
      </div>

      {!hasData ? (
        /* Empty Dashboard state */
        <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center max-w-md mx-auto">
          <div className="bg-primary-50 text-primary-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Dashboard Empty</h3>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            We don't have enough diagnostic records to compile statistics yet.
          </p>
          <button
            onClick={() => setActiveTab('predictor')}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-xs cursor-pointer hover:shadow-sm"
          >
            Perform First Diagnosis
          </button>
        </div>
      ) : (
        /* Dashboard Content */
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Aggregates Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Total */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center space-x-4">
              <div className="bg-primary-50 text-primary-600 p-3.5 rounded-xl">
                <Sprout className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Scans</div>
                <div className="text-2xl font-black text-gray-900 mt-0.5">{stats.total}</div>
              </div>
            </div>

            {/* Card 2: Healthy */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center space-x-4">
              <div className="bg-green-50 text-green-600 p-3.5 rounded-xl">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Healthy Crops</div>
                <div className="text-2xl font-black text-gray-900 mt-0.5">{stats.healthy}</div>
              </div>
            </div>

            {/* Card 3: Diseased */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center space-x-4">
              <div className="bg-red-50 text-red-600 p-3.5 rounded-xl">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Infections Detected</div>
                <div className="text-2xl font-black text-gray-900 mt-0.5">{stats.diseased}</div>
              </div>
            </div>

            {/* Card 4: Accuracy */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center space-x-4">
              <div className="bg-amber-50 text-amber-600 p-3.5 rounded-xl">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Avg Confidence</div>
                <div className="text-2xl font-black text-gray-900 mt-0.5">{stats.avg_confidence}%</div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Crop Distribution - Pie */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col h-[380px]">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 flex items-center">
                <span className="w-1.5 h-3 bg-primary-600 rounded-full mr-2"></span>
                Crop Specimen Share
              </h3>
              <div className="flex-1 min-h-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cropData}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {cropData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Diseases Frequency - Bar */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col h-[380px]">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 flex items-center">
                <span className="w-1.5 h-3 bg-red-500 rounded-full mr-2"></span>
                Infection Frequency
              </h3>
              <div className="flex-1 min-h-0">
                {diseaseData.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
                    <span className="text-xs text-gray-400 font-bold">No crop disease detections to chart yet</span>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={diseaseData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f3f3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #eee' }} />
                      <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={25} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Diagnostic Timeline - Line */}
            <div className="lg:col-span-12 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col h-[350px]">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 flex items-center">
                <span className="w-1.5 h-3 bg-blue-500 rounded-full mr-2"></span>
                Scan Load Activity
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f3f3" vertical={false} />
                    <XAxis dataKey="shortDate" tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #eee' }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      name="Total Scans" 
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      dot={{ r: 4 }} 
                      activeDot={{ r: 6 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="diseased" 
                      name="Diseased Leaves" 
                      stroke="#ef4444" 
                      strokeWidth={2} 
                      strokeDasharray="4 4" 
                      dot={{ r: 3 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
