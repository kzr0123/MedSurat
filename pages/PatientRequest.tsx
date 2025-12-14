import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CertificateType } from '../types';
import { StorageService } from '../services/storage';
import { ArrowLeft, Send } from 'lucide-react';

export const PatientRequest: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nik: '',
    fullName: '',
    dob: '',
    address: '',
    type: CertificateType.SICK_LEAVE,
    symptoms: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await StorageService.createRequest(formData);
      alert("Request submitted successfully! Please wait for approval.");
      navigate('/');
    } catch (error) {
      alert("Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate('/')} className="flex items-center text-slate-500 hover:text-slate-800 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </button>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Request Medical Certificate</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input required name="fullName" type="text" className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary" onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">NIK (ID Number)</label>
              <input required name="nik" type="text" className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary" onChange={handleChange} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
              <input required name="dob" type="date" className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary" onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Certificate Type</label>
              <select name="type" className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary" onChange={handleChange}>
                <option value={CertificateType.SICK_LEAVE}>Sick Leave (Surat Sakit)</option>
                <option value={CertificateType.HEALTH_CHECK}>Health Check (Surat Sehat)</option>
                <option value={CertificateType.REFERRAL}>Referral (Surat Rujukan)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <textarea required name="address" rows={2} className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary" onChange={handleChange}></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Complaints / Symptoms / Purpose</label>
            <textarea required name="symptoms" rows={4} className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary" placeholder="Describe your symptoms or the purpose of this request..." onChange={handleChange}></textarea>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-primary hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors">
              {loading ? 'Submitting...' : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
