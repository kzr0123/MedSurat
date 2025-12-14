import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { db } from '../lib/db';
import { PatientRequest } from '../types/index';
import { ShieldCheck, AlertCircle, CheckCircle, Loader2, ArrowLeft, Search, Calendar, User, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export const VerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  // Support both 'verify' (from prompt) and 'id' (from PDF generator)
  const verifyParam = searchParams.get('verify') || searchParams.get('id');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');
  const [result, setResult] = useState<PatientRequest | null>(null);
  const [inputId, setInputId] = useState('');

  useEffect(() => {
    if (verifyParam) {
      handleVerify(verifyParam);
    }
  }, [verifyParam]);

  const handleVerify = async (id: string) => {
    setStatus('loading');
    // Simulate network delay for better UX if instantaneous
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const data = await db.verifyCertificate(id);
      if (data && data.status === 'APPROVED') {
        setResult(data);
        setStatus('valid');
      } else {
        setStatus('invalid');
      }
    } catch (error) {
      console.error(error);
      setStatus('invalid');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputId.trim()) {
      handleVerify(inputId.trim());
    }
  };

  const resetVerification = () => {
    setStatus('idle');
    setResult(null);
    setInputId('');
    // Remove query params to allow new search
    window.history.replaceState({}, '', window.location.pathname);
  };

  const getLetterTypeLabel = (type: string) => {
    if (type === 'SICK_LEAVE') return 'Surat Keterangan Sakit';
    if (type === 'HEALTH_CHECK') return 'Surat Keterangan Sehat';
    if (type === 'NARCOTICS_FREE') return 'Surat Bebas Narkoba';
    if (type === 'COMBINED') return 'Paket SKD + SKBN';
    return type;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* Navigation Back */}
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Beranda
        </Link>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-slate-900 p-8 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <ShieldCheck className="h-8 w-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Verifikasi Dokumen</h1>
            <p className="text-slate-400 text-sm mt-1">Sistem Validasi MedSurat</p>
          </div>

          <div className="p-8">
            
            {/* LOADING STATE */}
            {status === 'loading' && (
              <div className="text-center py-8">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">Memverifikasi...</h3>
                <p className="text-slate-500 text-sm">Mohon tunggu sebentar</p>
              </div>
            )}

            {/* VALID STATE */}
            {status === 'valid' && result && (
              <div className="animate-fade-in text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-green-700 mb-1">DOKUMEN VALID</h2>
                <p className="text-slate-500 text-sm mb-8">Terverifikasi di database kami</p>

                <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-4 border border-slate-100 mb-8">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase">Jenis Surat</span>
                      <span className="font-semibold text-slate-900">{getLetterTypeLabel(result.type)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase">Nama Pasien</span>
                      <span className="font-semibold text-slate-900">{result.fullName}</span>
                      <span className="text-xs text-slate-500 block font-mono mt-0.5">{result.nik}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase">Tanggal Terbit</span>
                      <span className="font-semibold text-slate-900">
                        {format(new Date(result.requestDate), 'd MMMM yyyy', { locale: localeId })}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-200">
                    <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Nomor Sertifikat</span>
                    <span className="font-mono text-sm bg-white border border-slate-200 px-2 py-1 rounded text-slate-700 block text-center">
                      {result.certificateId}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={resetVerification}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                  Cek Dokumen Lain
                </button>
              </div>
            )}

            {/* INVALID STATE */}
            {status === 'invalid' && (
              <div className="animate-fade-in text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-red-700 mb-2">DOKUMEN TIDAK VALID</h2>
                <p className="text-slate-500 mb-8">
                  Dokumen dengan ID tersebut tidak ditemukan atau telah ditarik kembali oleh pihak klinik.
                </p>

                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-800 mb-8 text-left">
                  <p className="font-bold mb-1">Kemungkinan penyebab:</p>
                  <ul className="list-disc list-inside space-y-1 ml-1 opacity-80">
                    <li>ID Sertifikat salah ketik</li>
                    <li>Dokumen palsu / hasil editan</li>
                    <li>Masa berlaku dokumen telah habis</li>
                  </ul>
                </div>

                <button 
                  onClick={resetVerification}
                  className="w-full bg-white border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            )}

            {/* IDLE STATE (MANUAL INPUT) */}
            {status === 'idle' && (
              <form onSubmit={handleManualSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="certId" className="block text-sm font-semibold text-slate-700">
                    Masukkan ID Sertifikat
                  </label>
                  <div className="relative">
                    <input
                      id="certId"
                      type="text"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all font-mono placeholder:font-sans"
                      placeholder="Contoh: MC-2024-1234"
                      value={inputId}
                      onChange={(e) => setInputId(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500">
                    ID Sertifikat dapat ditemukan di bagian atas atau bawah dokumen fisik/digital.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!inputId}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30"
                >
                  Verifikasi Sekarang
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};