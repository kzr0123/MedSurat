import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { PatientRequest } from '../types';
import { Search, ShieldCheck, AlertCircle } from 'lucide-react';

export const Verification: React.FC = () => {
  const [certId, setCertId] = useState('');
  const [result, setResult] = useState<PatientRequest | null | undefined>(undefined);
  const [searched, setSearched] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId) return;
    setSearched(false);
    const data = await StorageService.verifyCertificate(certId);
    setResult(data);
    setSearched(true);
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <div className="text-center mb-10">
        <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Certificate Verification</h1>
        <p className="text-slate-500 mt-2">Enter the Certificate ID found on the document.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
        <form onSubmit={handleVerify} className="flex gap-4">
          <input 
            type="text" 
            placeholder="e.g. MC-2024-1234" 
            className="flex-1 rounded-xl border-slate-200 focus:border-primary focus:ring-primary"
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
          />
          <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-colors">
            Verify
          </button>
        </form>
      </div>

      {searched && (
        <div className="mt-8 animate-fade-in">
          {result ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
                <h3 className="text-lg font-bold text-emerald-900">Valid Certificate Found</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-emerald-600/70">Patient Name</span>
                  <span className="font-medium text-emerald-900">{result.fullName}</span>
                </div>
                <div>
                  <span className="block text-emerald-600/70">Certificate Type</span>
                  <span className="font-medium text-emerald-900">{result.type}</span>
                </div>
                <div>
                  <span className="block text-emerald-600/70">Issued Date</span>
                  <span className="font-medium text-emerald-900">{new Date(result.requestDate).toLocaleDateString()}</span>
                </div>
                <div>
                   <span className="block text-emerald-600/70">Doctor</span>
                   <span className="font-medium text-emerald-900">dr. MedSurat AI</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-center space-x-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="text-lg font-bold text-red-900">Certificate Not Found</h3>
                <p className="text-red-700 text-sm">The ID provided does not match any valid certificate in our system.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
