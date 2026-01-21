'use client'
import { useState } from 'react'
import { Building2, User, Car, Wallet, HelpCircle, CheckCircle, Briefcase, MapPin, Phone, CreditCard } from 'lucide-react'

export default function LoanForm() {
  const [status, setStatus] = useState('idle')
  const [type, setType] = useState('sme')
  const [loanType, setLoanType] = useState('car')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())

    // Ensure we send the state values for the buttons that aren't native inputs
    const payload = { ...data, applier_type: type, loan_type: loanType }

    const res = await fetch('/api/create-lead', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    if (res.ok) setStatus('success')
    else setStatus('error')
  }

  if (status === 'success') return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Application Received</h2>
        <p className="text-slate-500 mt-2">Our loan officer will review your details and contact you within 24 hours.</p>
        <button onClick={() => window.location.reload()} className="mt-6 text-blue-600 font-medium hover:underline">Submit another application</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Loan Application</h1>
          <p className="mt-2 text-lg text-slate-600">Secure funding for your business or personal needs.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
          
          {/* Section 1: Who are you? */}
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <label className="block text-sm font-semibold text-slate-900 mb-4">I am applying as a:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* SME Card */}
              <div 
                onClick={() => setType('sme')}
                className={`cursor-pointer relative flex items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                  type === 'sme' ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' : 'border-slate-200 hover:border-blue-300 bg-white'
                }`}
              >
                <div className={`p-2 rounded-lg ${type === 'sme' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <span className={`block font-semibold ${type === 'sme' ? 'text-blue-900' : 'text-slate-900'}`}>SME Company</span>
                  <span className="text-xs text-slate-500">For business financing</span>
                </div>
              </div>

              {/* Retailer Card */}
              <div 
                onClick={() => setType('retailer')}
                className={`cursor-pointer relative flex items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                  type === 'retailer' ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' : 'border-slate-200 hover:border-blue-300 bg-white'
                }`}
              >
                <div className={`p-2 rounded-lg ${type === 'retailer' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <User className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <span className={`block font-semibold ${type === 'retailer' ? 'text-blue-900' : 'text-slate-900'}`}>Retailer</span>
                  <span className="text-xs text-slate-500">For individual financing</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            
            {/* Section 2: Dynamic Details */}
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-slate-400" />
                {type === 'sme' ? 'Company Details' : 'Personal Details'}
              </h3>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {type === 'sme' ? (
                  <>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700">Company Name</label>
                      <input name="company_name" required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Company Type</label>
                      <select name="company_type" className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3">
                        <option value="private">Private Ltd</option>
                        <option value="proprietor">Sole Proprietor</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">NTN Number</label>
                      <input name="ntn_no" required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700">Full Name</label>
                      <input name="retailer_name" required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700">CNIC Number</label>
                      <input name="cnic_no" placeholder="00000-0000000-0" required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3" />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Section 3: Contact Info */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-slate-400" /> Contact Information
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Contact Person</label>
                  <input name="contact_person" required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                  <input name="contact_number" type="tel" required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Address</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute top-3 left-0 pl-3 flex items-center">
                      <MapPin className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    </div>
                    <textarea name="address" rows="2" required className="block w-full rounded-lg border-slate-300 pl-10 focus:border-blue-500 focus:ring-blue-500 py-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Loan Details */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-slate-400" /> Loan Preferences
              </h3>
              
              {/* Visual Selection Grid for Loan Type */}
              <label className="block text-sm font-medium text-slate-700 mb-3">Type of Loan</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'car', label: 'Car Loan', icon: Car },
                  { id: 'personal', label: 'Personal', icon: Wallet },
                  { id: 'others', label: 'Others', icon: HelpCircle },
                ].map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setLoanType(item.id)}
                    className={`cursor-pointer flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                      loanType === item.id 
                        ? 'border-blue-600 bg-blue-50 text-blue-700' 
                        : 'border-slate-200 hover:border-blue-300 text-slate-600'
                    }`}
                  >
                    <item.icon className={`w-6 h-6 mb-1 ${loanType === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Do you have an existing account?</span>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input type="radio" name="has_account" value="yes" className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-slate-700">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="has_account" value="no" defaultChecked className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-slate-700">No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer / Submit */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Processing Application...' : 'Submit Application'}
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">
              By submitting, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}