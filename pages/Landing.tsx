import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldCheck, Stethoscope, ArrowRight } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="space-y-16 py-10">
      {/* Hero */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
          Medical Certificates, <span className="text-primary">Simplified.</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Digital issuance and verification of medical certificates. 
          Trusted by hospitals, accessible for patients, verified instantly.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link to="/request" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary hover:bg-sky-600 shadow-lg shadow-sky-500/30 transition-all">
            <Stethoscope className="mr-2 h-5 w-5" />
            Request Certificate
          </Link>
          <Link to="/verify/check" className="inline-flex items-center justify-center px-8 py-3 border border-slate-200 text-base font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-all">
            <ShieldCheck className="mr-2 h-5 w-5" />
            Verify Document
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Digital Requests</h3>
          <p className="text-slate-500">Submit your health details and symptoms online without waiting in long queues.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Verification</h3>
          <p className="text-slate-500">Employers and institutions can verify the authenticity of certificates instantly via QR or ID.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
            <Activity className="h-6 w-6 text-purple-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">AI Assisted</h3>
          <p className="text-slate-500">Doctors use advanced AI to assist in drafting accurate medical notes efficiently.</p>
        </div>
      </div>
    </div>
  );
};

// Helper icon
import { Activity } from 'lucide-react';
