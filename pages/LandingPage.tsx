import React from 'react';
import { Link } from 'react-router-dom';
import { Chatbot } from '../components/patient/Chatbot';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white font-sans">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center max-w-6xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Layanan Surat <br className="hidden md:block"/>
          <span className="text-blue-600">Kesehatan Digital</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          Dapatkan Surat Kesehatan Dokter (SKD) dan Surat Keterangan Bebas Narkoba (SKBN) dengan cepat dan terpercaya.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/patient/form"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
          >
            Buat Surat Sekarang
          </Link>
          <Link 
            to="/verify"
            className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Cek Status
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">SKD</h3>
            <p className="text-gray-600 mb-6">
              Surat Keterangan Dokter untuk keperluan kerja, sekolah, dan lainnya.
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center"><span className="text-green-500 mr-2 font-bold">✓</span> Pemeriksaan kesehatan umum</li>
              <li className="flex items-center"><span className="text-green-500 mr-2 font-bold">✓</span> Tanda tangan dokter berlisensi</li>
              <li className="flex items-center"><span className="text-green-500 mr-2 font-bold">✓</span> Hasil dalam hari yang sama</li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">SKBN</h3>
            <p className="text-gray-600 mb-6">
              Surat Keterangan Bebas Narkoba dengan tes urine terpercaya.
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center"><span className="text-green-500 mr-2 font-bold">✓</span> Tes 6 parameter narkoba</li>
              <li className="flex items-center"><span className="text-green-500 mr-2 font-bold">✓</span> Hasil laboratorium terakreditasi</li>
              <li className="flex items-center"><span className="text-green-500 mr-2 font-bold">✓</span> QR Code verifikasi keaslian</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};