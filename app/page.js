'use client'
import { useState } from 'react'

export default function LoanForm() {
  const [status, setStatus] = useState('idle')
  const [type, setType] = useState('sme') // 'sme' or 'retailer'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())

    const res = await fetch('/api/create-lead', {
      method: 'POST',
      body: JSON.stringify({ ...data, applier_type: type }),
    })

    if (res.ok) setStatus('success')
    else setStatus('error')
  }

  if (status === 'success') return <div className="p-10 text-center text-green-600 text-2xl">Application Received!</div>

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg w-full max-w-lg space-y-4">
        <h1 className="text-2xl font-bold mb-4">Loan Application</h1>

        {/* 1. Applier Type */}
        <div className="flex gap-4 mb-4">
          <button type="button" onClick={() => setType('sme')} 
            className={`flex-1 p-2 border rounded ${type === 'sme' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
            SME Company
          </button>
          <button type="button" onClick={() => setType('retailer')} 
            className={`flex-1 p-2 border rounded ${type === 'retailer' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
            Retailer
          </button>
        </div>

        {/* 2. Dynamic Fields */}
        {type === 'sme' ? (
          <>
            <input name="company_name" placeholder="Company Name" required className="w-full p-2 border rounded"/>
            <select name="company_type" className="w-full p-2 border rounded">
              <option value="private">Private Ltd</option>
              <option value="proprietor">Sole Proprietor</option>
              <option value="partnership">Partnership</option>
            </select>
            <input name="ntn_no" placeholder="NTN No" required className="w-full p-2 border rounded"/>
          </>
        ) : (
          <>
            <input name="retailer_name" placeholder="Retailer Name" required className="w-full p-2 border rounded"/>
            <input name="cnic_no" placeholder="CNIC (00000-0000000-0)" required className="w-full p-2 border rounded"/>
          </>
        )}

        {/* 3. Common Fields */}
        <input name="contact_person" placeholder="Contact Person Name" required className="w-full p-2 border rounded"/>
        <input name="contact_number" placeholder="Contact Number" required className="w-full p-2 border rounded"/>
        <textarea name="address" placeholder="Address" required className="w-full p-2 border rounded"/>

        {/* 4. Has Account */}
        <div className="p-2 border rounded bg-gray-50">
          <p className="text-sm font-bold">Already Have Account?</p>
          <label className="mr-4"><input type="radio" name="has_account" value="yes" required/> Yes</label>
          <label><input type="radio" name="has_account" value="no"/> No</label>
        </div>

        {/* 5. Loan Type */}
        <div className="p-2 border rounded bg-gray-50">
          <p className="text-sm font-bold">Loan Type</p>
          <label className="block"><input type="radio" name="loan_type" value="car" required/> Car Loan</label>
          <label className="block"><input type="radio" name="loan_type" value="personal"/> Personal Loan</label>
          <label className="block"><input type="radio" name="loan_type" value="others"/> Others</label>
        </div>

        <button disabled={status === 'loading'} className="w-full bg-green-600 text-white p-3 rounded font-bold">
          {status === 'loading' ? 'Sending...' : 'Submit Application'}
        </button>
      </form>
    </div>
  )
}