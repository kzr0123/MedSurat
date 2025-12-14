import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, ArrowRight } from 'lucide-react';

export const PatientSuccess: React.FC = () => {
  const location = useLocation();
  const state = location.state as { ticketId: string; name: string; type: string } | null;

  // Fallback if accessed directly
  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Link to="/" className="text-blue-600 hover:underline">Kembali ke Beranda</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden text-center p-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Permohonan Berhasil!</h1>
        <p className="text-slate-500 mb-8">
          Terima kasih <strong>{state.name}</strong>. Data Anda telah kami terima untuk layanan <strong>{state.type}</strong>.
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-8 text-left space-y-4">
          <div className="flex items-start space-x-3">
            <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Jadwal Pemeriksaan</h4>
              <p className="text-sm text-slate-500">Silakan datang hari ini (08:00 - 16:00) untuk pemeriksaan fisik.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
             <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
              <MapPin className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Lokasi</h4>
              <p className="text-sm text-slate-500">MedSurat Health Center, Jl. Digital No. 123, Jakarta Selatan.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
          <p className="text-xs text-blue-700 font-mono uppercase tracking-wider mb-1">ID Tiket Anda</p>
          <p className="text-2xl font-bold text-blue-900 tracking-widest">{state.ticketId}</p>
        </div>

        <div className="space-y-3">
          <Link to="/" className="block w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
            Kembali ke Beranda
          </Link>
          <Link to="/verify" className="block w-full bg-white text-slate-700 py-3 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-colors">
            Cek Status Permohonan
          </Link>
        </div>
      </div>
    </div>
  );
};