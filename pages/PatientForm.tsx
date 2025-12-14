import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CertificateType } from '../types/index';
import { db } from '../lib/db';
import { ArrowLeft, User, FileText, CheckCircle, ChevronRight, ChevronLeft, CreditCard } from 'lucide-react';

export const PatientForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nik: '',
    fullName: '',
    email: '',
    dob: '',
    address: '',
    gender: 'Male',
    phone: '',
    letterType: 'SKD', // UI State: 'SKD', 'SKBN', 'BOTH'
    purpose: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const mapLetterTypeToEnum = (type: string): CertificateType => {
    switch(type) {
      case 'SKD': return CertificateType.HEALTH_CHECK;
      case 'SKBN': return CertificateType.NARCOTICS_FREE;
      case 'BOTH': return CertificateType.COMBINED;
      default: return CertificateType.HEALTH_CHECK;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Map UI state to Database Schema
      const requestData = {
        nik: formData.nik,
        fullName: formData.fullName,
        email: formData.email,
        dob: formData.dob,
        address: formData.address,
        type: mapLetterTypeToEnum(formData.letterType),
        symptoms: formData.purpose || `Permohonan ${formData.letterType}`, // Map purpose to symptoms field
      };

      const newReq = await db.createRequest(requestData);
      
      // Navigate to success page with state
      navigate('/patient/success', { 
        state: { 
          ticketId: newReq.id, 
          name: newReq.fullName,
          type: formData.letterType 
        } 
      });
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim permohonan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Step Indicators
  const steps = [
    { id: 1, label: 'Data Diri', icon: User },
    { id: 2, label: 'Pilih Layanan', icon: FileText },
    { id: 3, label: 'Review', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation / Header */}
        <button onClick={() => navigate('/')} className="flex items-center text-slate-500 hover:text-blue-600 mb-8 transition-colors font-medium">
          <ArrowLeft className="h-5 w-5 mr-2" /> Kembali ke Beranda
        </button>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
            <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-500`} style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
            
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = step >= s.id;
              const isCurrent = step === s.id;
              return (
                <div key={s.id} className="flex flex-col items-center bg-slate-50 px-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isActive ? 'bg-blue-600 border-blue-100 text-white shadow-lg shadow-blue-500/30' : 'bg-white border-slate-200 text-slate-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`mt-3 text-sm font-bold ${isCurrent ? 'text-blue-600' : 'text-slate-500'}`}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Form Content */}
          <div className="p-8 md:p-12">
            
            {/* STEP 1: Personal Data */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Lengkapi Data Diri</h2>
                  <p className="text-slate-500">Isi data sesuai KTP untuk keperluan administrasi surat.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                      placeholder="Contoh: Budi Santoso"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">NIK (Nomor Induk Kependudukan)</label>
                    <input
                      type="text"
                      name="nik"
                      value={formData.nik}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                      placeholder="16 digit angka"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tanggal Lahir</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Alamat Lengkap</label>
                  <textarea
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    placeholder="Nama jalan, RT/RW, Kelurahan, Kecamatan"
                  ></textarea>
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!formData.fullName || !formData.nik || !formData.email}
                    className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30"
                  >
                    Lanjut <ChevronRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Service Selection */}
            {step === 2 && (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-2xl font-bold text-slate-900">Pilih Layanan</h2>
                  <p className="text-slate-500">Pilih jenis surat keterangan yang Anda butuhkan.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: 'SKD', title: 'SKD', desc: 'Surat Keterangan Dokter', price: 'Rp 50.000', color: 'blue' },
                    { id: 'SKBN', title: 'SKBN', desc: 'Surat Bebas Narkoba', price: 'Rp 150.000', color: 'purple' },
                    { id: 'BOTH', title: 'Paket Lengkap', desc: 'SKD + SKBN (Hemat)', price: 'Rp 190.000', color: 'emerald' },
                  ].map((type) => (
                    <div
                      key={type.id}
                      onClick={() => setFormData({ ...formData, letterType: type.id })}
                      className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                        formData.letterType === type.id
                          ? `border-${type.color}-500 bg-${type.color}-50 shadow-xl ring-1 ring-${type.color}-500`
                          : 'border-slate-100 hover:border-blue-200 hover:shadow-lg'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${formData.letterType === type.id ? `bg-${type.color}-500 text-white` : 'bg-slate-100 text-slate-600'}`}>
                          <FileText className="h-6 w-6" />
                        </div>
                        {formData.letterType === type.id && (
                          <CheckCircle className={`h-6 w-6 text-${type.color}-500`} />
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{type.title}</h3>
                      <p className="text-sm text-slate-500 mb-4">{type.desc}</p>
                      <div className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${formData.letterType === type.id ? `bg-white text-${type.color}-700` : 'bg-slate-100 text-slate-600'}`}>
                        {type.price}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Keperluan / Tujuan Pembuatan</label>
                  <input
                    type="text"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    placeholder="Contoh: Melamar Pekerjaan, Mendaftar Kuliah"
                  />
                </div>

                <div className="flex justify-between pt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center px-6 py-3 text-slate-600 font-bold hover:text-slate-900 transition-colors"
                  >
                    <ChevronLeft className="mr-2 h-5 w-5" /> Kembali
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!formData.purpose}
                    className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/30"
                  >
                    Lanjut <ChevronRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Review */}
            {step === 3 && (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-2xl font-bold text-slate-900">Konfirmasi Data</h2>
                  <p className="text-slate-500">Pastikan semua data sudah benar sebelum mengirim permohonan.</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm border-b border-slate-200 pb-4">
                    <div>
                      <span className="block text-slate-500 mb-1">Nama Lengkap</span>
                      <span className="font-bold text-slate-900">{formData.fullName}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 mb-1">NIK</span>
                      <span className="font-bold text-slate-900 font-mono">{formData.nik}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 mb-1">Email</span>
                      <span className="font-bold text-slate-900">{formData.email}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 mb-1">Tanggal Lahir</span>
                      <span className="font-bold text-slate-900">{formData.dob}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <div>
                      <span className="block text-slate-500 mb-1">Layanan Dipilih</span>
                      <span className="text-lg font-bold text-blue-600">{formData.letterType === 'BOTH' ? 'Paket Lengkap (SKD + SKBN)' : formData.letterType}</span>
                    </div>
                    <div className="text-right">
                       <span className="block text-slate-500 mb-1">Keperluan</span>
                       <span className="font-medium text-slate-900">{formData.purpose}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 flex items-start space-x-3 text-blue-800 text-sm">
                  <CreditCard className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p>
                    Pembayaran akan dilakukan di klinik saat pemeriksaan fisik. 
                    Silakan datang membawa KTP asli setelah mendapatkan notifikasi jadwal.
                  </p>
                </div>

                <div className="flex justify-between pt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center px-6 py-3 text-slate-600 font-bold hover:text-slate-900 transition-colors"
                  >
                    <ChevronLeft className="mr-2 h-5 w-5" /> Kembali
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/30"
                  >
                    {loading ? 'Mengirim...' : 'Kirim Permohonan'}
                    {!loading && <CheckCircle className="ml-2 h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};