import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { DeepSeekService } from '../lib/deepseek';
import { generatePDF } from '../lib/pdfGenerator';
import { EmailService } from '../lib/emailService';
import { PatientRequest, RequestStatus, CertificateType } from '../types/index';
import { ArrowLeft, Sparkles, Check, X, Printer, Mail, User, FileText, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export const ProcessRequest: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<PatientRequest | null>(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [validDays, setValidDays] = useState(3);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      db.getRequestById(id).then(data => {
        if (data) {
          setRequest(data);
          setDoctorNotes(data.doctorNotes || '');
        }
      });
    }
  }, [id]);

  const handleAIDraft = async () => {
    if (!request) return;
    setGeneratingAI(true);
    const draft = await DeepSeekService.draftMedicalNote(request.symptoms, request.type, request.fullName);
    setDoctorNotes(draft);
    setGeneratingAI(false);
  };

  const handleApprove = async () => {
    if (!request) return;
    setProcessing(true);
    
    const validFrom = new Date();
    const validUntil = new Date();
    validUntil.setDate(validFrom.getDate() + validDays);

    const certId = `MC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    // 1. Prepare Data Object
    const updatedRequestData: Partial<PatientRequest> = {
      status: RequestStatus.APPROVED,
      doctorNotes,
      validFrom: validFrom.toISOString(),
      validUntil: validUntil.toISOString(),
      certificateId: certId
    };

    try {
      // 2. Generate PDF Bytes (Don't download yet)
      const pdfBytes = await generatePDF({ ...request, ...updatedRequestData } as PatientRequest, { returnBytes: true });
      
      // 3. Upload to Supabase Storage (if available and pdfBytes exists)
      if (pdfBytes && (pdfBytes instanceof Uint8Array)) {
         await db.uploadCertificate(certId, pdfBytes);
      }

      // 4. Update DB
      await db.updateRequest(request.id, updatedRequestData);

      // 5. Send Email
      const emailSent = await EmailService.sendApprovalEmail(request.email, request.fullName, certId);
      if (emailSent) {
        await db.updateRequest(request.id, { emailSent: true });
      }

      // 6. Refresh Local State
      const updated = await db.getRequestById(request.id);
      if (updated) setRequest(updated);

      alert(`Permohonan Disetujui! Sertifikat telah dibuat dan diunggah.${emailSent ? ' Email telah dikirim ke pasien.' : ''}`);
    } catch (error) {
      console.error("Approval flow failed", error);
      alert("Terjadi kesalahan saat memproses persetujuan.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!request) return;
    if (!confirm('Apakah Anda yakin ingin menolak permohonan ini?')) return;
    
    setProcessing(true);
    await db.updateRequest(request.id, { status: RequestStatus.REJECTED });
    const updated = await db.getRequestById(request.id);
    if (updated) setRequest(updated);
    setProcessing(false);
  };

  const handleDownloadPDF = async () => {
    if (request) {
       await generatePDF(request, { returnBytes: false });
    }
  };

  if (!request) return <div className="p-8 text-center text-slate-500">Memuat data...</div>;

  const isEditable = request.status === RequestStatus.PENDING;

  const getLetterTypeLabel = (type: string) => {
    if (type === 'SICK_LEAVE') return 'Surat Sakit';
    if (type === 'HEALTH_CHECK') return 'Surat Sehat';
    if (type === 'NARCOTICS_FREE') return 'SKBN';
    if (type === 'COMBINED') return 'SKD + SKBN';
    return type;
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Patient Info Column */}
      <div className="lg:col-span-1 space-y-6">
        <button onClick={() => navigate('/officer/dashboard')} className="flex items-center text-slate-500 hover:text-blue-600 transition-colors font-medium">
          <ArrowLeft className="h-4 w-4 mr-1" /> Kembali ke Dashboard
        </button>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Data Pasien</h3>
          </div>
          
          <div className="space-y-5 text-sm">
            <div>
              <span className="block text-slate-500 mb-1">Nama Lengkap</span>
              <span className="font-bold text-slate-900 text-base">{request.fullName}</span>
            </div>
            <div>
              <span className="block text-slate-500 mb-1">NIK</span>
              <span className="font-mono bg-slate-100 px-2 py-1 rounded inline-block text-slate-700">{request.nik}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-slate-500 mb-1">Tanggal Lahir</span>
                <span className="font-medium text-slate-900">{request.dob}</span>
              </div>
              <div>
                <span className="block text-slate-500 mb-1">Jenis Layanan</span>
                <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold border border-blue-100">
                  {getLetterTypeLabel(request.type)}
                </span>
              </div>
            </div>
            <div>
              <span className="block text-slate-500 mb-1">Alamat</span>
              <span className="font-medium text-slate-900">{request.address}</span>
            </div>
            <div>
               <span className="block text-slate-500 mb-1">Email</span>
               <span className="font-medium text-slate-900 break-all">{request.email}</span>
            </div>
            
            <div className="pt-4 mt-2 border-t border-slate-100">
              <span className="block text-slate-500 text-xs mb-2 uppercase tracking-wider font-bold">Keluhan / Keperluan</span>
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-yellow-800 text-sm italic">
                "{request.symptoms}"
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Action Column */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col relative overflow-hidden">
          {/* Status Badge */}
          <div className="absolute top-0 right-0 p-6">
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                request.status === RequestStatus.APPROVED ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                request.status === RequestStatus.REJECTED ? 'bg-red-100 text-red-700 border border-red-200' :
                'bg-yellow-100 text-yellow-700 border border-yellow-200'
              }`}>
              {request.status === 'PENDING' ? 'Menunggu Pemeriksaan' : 
               request.status === 'APPROVED' ? 'Selesai (Disetujui)' : 'Ditolak'}
            </span>
          </div>

          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <FileText className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Pemeriksaan Medis</h2>
          </div>

          <div className="flex-1 space-y-6">
            {/* AI Action */}
            <div className="flex justify-between items-end mb-2">
              <label className="block text-sm font-bold text-slate-700">Catatan Dokter / Hasil Diagnosa</label>
              {isEditable && (
                <button 
                  onClick={handleAIDraft} 
                  disabled={generatingAI}
                  className="flex items-center space-x-2 text-xs bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all shadow-md shadow-purple-200 disabled:opacity-70"
                >
                  <Sparkles className={`h-3 w-3 ${generatingAI ? 'animate-spin' : ''}`} />
                  <span>{generatingAI ? 'Sedang menulis (DeepSeek)...' : 'Bantu Tulis (DeepSeek)'}</span>
                </button>
              )}
            </div>

            <textarea 
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              disabled={!isEditable}
              rows={10} 
              className="w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm leading-relaxed p-4 bg-slate-50 focus:bg-white transition-all resize-none"
              placeholder="Tuliskan hasil pemeriksaan fisik, tekanan darah, berat badan, dan kesimpulan medis di sini..."
            ></textarea>

            {request.type === CertificateType.SICK_LEAVE && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1">Durasi Istirahat (Hari)</label>
                    <input 
                      type="number" 
                      value={validDays} 
                      onChange={(e) => setValidDays(parseInt(e.target.value))}
                      disabled={!isEditable}
                      min={1}
                      max={14}
                      className="w-24 rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500" 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions Footer */}
          <div className="pt-8 mt-8 border-t border-slate-100 flex gap-4">
            {request.status === RequestStatus.PENDING ? (
              <>
                <button 
                  onClick={handleReject}
                  disabled={processing}
                  className="flex-1 bg-white border-2 border-slate-200 text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700 px-4 py-4 rounded-xl font-bold flex items-center justify-center transition-all"
                >
                  <X className="h-5 w-5 mr-2" /> Tolak
                </button>
                <button 
                  onClick={handleApprove}
                  disabled={processing || !doctorNotes}
                  className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-4 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-2" /> Setujui & Terbitkan Surat
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="w-full flex gap-4">
                <button 
                  onClick={handleDownloadPDF}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-4 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg shadow-blue-500/30"
                >
                  <Printer className="h-5 w-5 mr-2" /> Unduh PDF
                </button>
                {request.emailSent && (
                  <div className="flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-xl border border-green-200 font-medium">
                    <Mail className="h-5 w-5 mr-2" /> Email Terkirim
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};