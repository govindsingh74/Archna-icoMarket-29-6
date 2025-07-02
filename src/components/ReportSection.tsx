import React, { useState } from 'react';
import { Shield, AlertTriangle, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ReportSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.message.trim()) newErrors.message = 'Please describe the fraudulent project';
    else if (formData.message.length < 20) newErrors.message = 'Please provide more details (minimum 20 characters)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          name: formData.name,
          email: formData.email,
          subject: 'fraud_report',
          message: formData.message
        });

      if (error) throw error;

      setSuccessMessage('Thank you for reporting! Our security team will investigate this immediately.');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error submitting report:', error);
      setErrors({ general: 'Failed to submit report. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactRedirect = () => {
    window.location.href = '/contact';
  };

  return (
    <>
      <section className="py-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-500/10 dark:via-orange-500/10 dark:to-yellow-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full mb-6">
              <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
              Help Us Keep TokenLaunch Safe
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Your vigilance helps protect our community. Report suspicious projects or fraudulent activities 
              to help us maintain a secure platform for all users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Security Features */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                24/7 Monitoring
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Our security team continuously monitors all projects for suspicious activities and potential fraud.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                Verified Projects
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                All projects undergo thorough verification before being approved for listing on our platform.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                Quick Response
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Fraud reports are prioritized and investigated within 2 hours of submission.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Report Fraud</span>
            </button>
            
            <button
              onClick={handleContactRedirect}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-semibold rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transform hover:-translate-y-1 transition-all duration-300"
            >
              <Send className="w-5 h-5" />
              <span>Contact Support</span>
            </button>
          </div>
        </div>
      </section>

      {/* Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
              onClick={() => setIsModalOpen(false)}
            ></div>

            {/* Modal */}
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-800 shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  Report Fraudulent Project
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  ×
                </button>
              </div>

              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
                  <p className="text-green-600 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {successMessage}
                  </p>
                </div>
              )}

              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
                  <p className="text-red-600 dark:text-red-400">{errors.general}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                        errors.name ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="Your full name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                        errors.email ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Report Details *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                      errors.message ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Please provide detailed information about the fraudulent project, including project name, suspicious activities, evidence, etc."
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-lg p-4">
                  <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                    <strong>Important:</strong> False reports may result in account suspension. 
                    Please ensure your report is accurate and provide as much evidence as possible.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Send className="w-5 h-5" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportSection;