import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/db';
import { supabase } from '../lib/supabase';
import { PatientRequest, RequestStatus } from '../types/index';
import { ChevronRight, Clock, Activity, CheckCircle, XCircle, RefreshCw, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export const OfficerDashboard: React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState<PatientRequest[]>([]);
  const [historyRequests, setHistoryRequests] = useState<PatientRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const allRequests = await db.getRequests();
      setPendingRequests(allRequests.filter(r => r.status === RequestStatus.PENDING));
      setHistoryRequests(allRequests.filter(r => r.status !== RequestStatus.PENDING));
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Real-time subscription setup
    if (supabase) {
      const channel = supabase
        .channel('public:requests')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'requests' },
          (payload) => {
            console.log('New request received!', payload);
            setNotification('Permohonan baru masuk!');
            // Play sound effect if available
            // new Audio('/notification.mp3').play().catch(() => {});
            fetchData();
            
            // Clear notification after 3s
            setTimeout(() => setNotification(null), 3000);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const getStatusColor = (status: RequestStatus) => {
    switch(status) {
      case RequestStatus.PENDING: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case RequestStatus.APPROVED: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case RequestStatus.REJECTED: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getLetterTypeLabel = (type: string) => {
    if (type === 'SICK_LEAVE') return 'Surat Sakit';
    if (type === 'HEALTH_CHECK') return 'Surat Sehat';
    if (type === 'NARCOTICS_FREE') return 'SKBN';
    if (type === 'COMBINED') return 'SKD + SKBN';
    return type;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Petugas Medis</h1>
          <p className="text-slate-500">Kelola antrian pemeriksaan dan penerbitan surat.</p>
        </div>
        <button 
          onClick={fetchData} 
          className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Perbarui Data
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-xl flex items-center animate-bounce">
          <Bell className="h-5 w-5 mr-2" />
          {notification}
        </div>
      )}

      {/* Active Queue Section */}
      <section>
        <div className="flex items-center space-x-2 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Antrian Pemeriksaan ({pendingRequests.length})</h2>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">Tidak ada antrian</h3>
            <p className="text-slate-500">Semua permohonan telah diproses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingRequests.map((req) => (
              <div key={req.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    {getLetterTypeLabel(req.type)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {format(new Date(req.requestDate), 'HH:mm')}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-1">{req.fullName}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{req.symptoms}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                   <div className="text-xs text-slate-400">
                      NIK: <span className="font-mono">{req.nik}</span>
                   </div>
                   <Link 
                    to={`/officer/dashboard/process/${req.id}`}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg group-hover:bg-blue-700 transition-colors"
                   >
                     Periksa <ChevronRight className="ml-1 h-4 w-4" />
                   </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* History Section */}
      <section className="pt-8 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Riwayat Permohonan</h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pasien</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Layanan</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {historyRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900">{req.fullName}</div>
                      <div className="text-xs text-slate-500 font-mono">{req.nik}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-700 font-medium">{getLetterTypeLabel(req.type)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {format(new Date(req.requestDate), 'd MMM yyyy', { locale: localeId })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(req.status)}`}>
                        {req.status === 'APPROVED' ? 'Disetujui' : 'Ditolak'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/officer/dashboard/process/${req.id}`} className="text-blue-600 hover:text-blue-900 font-medium">
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
                {historyRequests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      Belum ada riwayat permohonan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};