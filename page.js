'use client'
import { useState } from 'react'

export default function LeadForm() {
  const [status, setStatus] = useState('idle')
  const [applierType, setApplierType] = useState('sme') // Default to SME

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    // Collect Form Data
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())

    // Send to our internal API
    const res = await fetch('/api/submit-lead', {
      method: 'POST',
      body: JSON.stringify({ ...data, applierType }),
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.ok) setStatus('success')
    else setStatus('error')
  }

  if (status === 'success') return (
    <div className="flex h-screen items-center justify-center bg-green-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-600">Request Received!</h1>
        <p className="mt-2 text-gray-600">Our team will contact you shortly.</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-blue-500 underline">Submit another</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-900 p-6 text-white">
          <h2 className="text-2xl font-bold">Loan Application</h2>
          <p className="opacity-80">Please fill in your details below</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* 1. Applier Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">I am apply as a:</label>
            <div className="flex space-x-4">
              <label className={`flex-1 text-center p-3 border rounded cursor-pointer ${applierType === 'sme' ? 'bg-blue-100 border-blue-500 font-bold' : 'bg-gray-50'}`}>
                <input type="radio" name="type_selector" className="hidden" onClick={() => setApplierType('sme')} />
                🏢 SME Company
              </label>
              <label className={`flex-1 text-center p-3 border rounded cursor-pointer ${applierType === 'retailer' ? 'bg-blue-100 border-blue-500 font-bold' : 'bg-gray-50'}`}>
                <input type="radio" name="type_selector" className="hidden" onClick={() => setApplierType('retailer')} />
                👤 Retailer
              </label>
            </div>
          </div>

          {/* 2. SME Specific Fields */}
          {applierType === 'sme' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input name="company_name" required className="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type of Company</label>
                  <select name="company_type" className="mt-1 block w-full p-2 border border-gray-300 rounded">
                    <option>Private Ltd</option>
                    <option>Sole Proprietor</option>
                    <option>Partnership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">NTN No</label>
                  <input name="ntn_no" required className="mt-1 block w-full p-2 border border-gray-300 rounded" />
                </div>
              </div>
            </div>
          )}

          {/* 3. Retailer Specific Fields */}
          {applierType === 'retailer' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input name="retailer_name" required className="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CNIC No</label>
                <input name="cnic_no" placeholder="00000-0000000-0" required className="mt-1 block w-full p-2 border border-gray-300 rounded" />
              </div>
            </div>
          )}

          {/* 4. Shared Fields (Contact Info) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Person</label>
              <input name="contact_person" required className="mt-1 block w-full p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input name="contact_number" type="tel" required className="mt-1 block w-full p-2 border border-gray-300 rounded" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea name="address" rows="2" required className="mt-1 block w-full p-2 border border-gray-300 rounded"></textarea>
          </div>

          {/* 5. Account Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Already Have Account?</label>
            <div className="flex space-x-4">
              <label className="flex items-center"><input type="radio" name="has_account" value="Yes" className="mr-2" /> Yes</label>
              <label className="flex items-center"><input type="radio" name="has_account" value="No" defaultChecked className="mr-2" /> No</label>
            </div>
          </div>

          {/* 6. Loan Type */}
          <div className="bg-gray-50 p-4 rounded border">
            <label className="block text-sm font-bold text-gray-700 mb-2">Loan Type Request:</label>
            <div className="space-y-2">
              <label className="flex items-center"><input type="radio" name="loan_type" value="Car Loan" className="mr-2" required /> Car Loan</label>
              <label className="flex items-center"><input type="radio" name="loan_type" value="Personal Loan" className="mr-2" /> Personal Loan</label>
              <label className="flex items-center"><input type="radio" name="loan_type" value="Others" className="mr-2" /> Others</label>
            </div>
          </div>

          <button type="submit" disabled={status === 'loading'} className="w-full bg-blue-900 text-white font-bold p-3 rounded hover:bg-blue-800 transition">
            {status === 'loading' ? 'Submitting...' : 'Submit Application'}
          </button>

        </form>
      </div>
    </div>
  )
}