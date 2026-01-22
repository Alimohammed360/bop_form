// export async function POST(request) {
//   const body = await request.json()

//   // --- MAPPING LOGIC ---
//   // We construct the "vals" dictionary that Odoo expects
//   const leadVals = {
//     // Standard Fields
//     'type': 'lead', // Create as Lead
//     'name': `${body.applier_type.toUpperCase()} Request: ${body.loan_type}`, // Title
//     'contact_name': body.contact_person,
//     'phone': body.contact_number,
//     'street': body.address,

//     // Custom Fields (Keys must match Python model exactly)
//     'applier_type': body.applier_type,
//     'has_account': body.has_account, // 'yes' or 'no'
//     'loan_type': body.loan_type,     // 'car', 'personal', 'others'
//   }

//   // Conditional Fields
//   if (body.applier_type === 'sme') {
//     leadVals['partner_name'] = body.company_name; // Company Name
//     leadVals['company_type'] = body.company_type; // 'private', 'proprietor', etc
//     leadVals['ntn_no'] = body.ntn_no;
//   } else {
//     // For retailer, we might want the name in the title or contact_name
//     // But since contact_person is separate, we assume:
//     leadVals['contact_name'] = body.retailer_name; // Or keep body.contact_person
//     leadVals['cnic_no'] = body.cnic_no;
//   }

//   // --- ODOO CONNECTION ---
//   const url = process.env.ODOO_URL
//   const db = process.env.ODOO_DB
//   const username = process.env.ODOO_EMAIL
//   const password = process.env.ODOO_API_KEY

//   const common = xmlrpc.createSecureClient({ url: `${url}/xmlrpc/2/common` })
//   const models = xmlrpc.createSecureClient({ url: `${url}/xmlrpc/2/object` })

//   try {
//     const uid = await new Promise((resolve, reject) => {
//       common.methodCall('authenticate', [db, username, password, {}], (err, val) => {
//         if (err) reject(err)
//         else resolve(val)
//       })
//     })

//     const newLeadId = await new Promise((resolve, reject) => {
//       models.methodCall('execute_kw', [
//         db, uid, password,
//         'crm.lead', 'create',
//         [leadVals]
//       ], (err, val) => {
//         if (err) reject(err)
//         else resolve(val)
//       })
//     })

//     return Response.json({ success: true, id: newLeadId })
//   } catch (error) {
//     return Response.json({ error: error.message }, { status: 500 })
//   }
// }

import xmlrpc from 'xmlrpc'

export async function POST(request) {
  try {
    const body = await request.json()

    // --- 1. MAPPING LOGIC ---
    const leadVals = {
      'type': 'lead',
      'name': `${body.applier_type === 'sme' ? body.company_name : body.retailer_name} - ${body.loan_type}`,
      'contact_name': body.contact_person,
      'phone': body.contact_number,
      'street': body.address,
      'applier_type': body.applier_type,
      'has_account': body.has_account,
      'loan_type': body.loan_type,
    }

    if (body.applier_type === 'sme') {
      leadVals['partner_name'] = body.company_name;
      leadVals['company_type'] = body.company_type;
      leadVals['ntn_no'] = body.ntn_no;
    } else {
      leadVals['contact_name'] = body.retailer_name;
      leadVals['cnic_no'] = body.cnic_no;
    }

    // --- 2. ODOO CONNECTION SETUP ---
    const url = process.env.ODOO_URL
    const db = process.env.ODOO_DB
    const username = process.env.ODOO_EMAIL
    const password = process.env.ODOO_API_KEY

    // Remove trailing slash if present
    const cleanUrl = url.replace(/\/$/, "")

    // CRITICAL FIX: Detect HTTP vs HTTPS
    const isSecure = cleanUrl.startsWith('https')
    const clientOptions = { url: `${cleanUrl}/xmlrpc/2/common` }
    const objectOptions = { url: `${cleanUrl}/xmlrpc/2/object` }

    // Use createClient for HTTP, createSecureClient for HTTPS
    const common = isSecure ? xmlrpc.createSecureClient(clientOptions) : xmlrpc.createClient(clientOptions)
    const models = isSecure ? xmlrpc.createSecureClient(objectOptions) : xmlrpc.createClient(objectOptions)

    // --- 3. AUTHENTICATE ---
    console.log(`Connecting to Odoo at: ${cleanUrl} (Secure: ${isSecure})`)
    
    const uid = await new Promise((resolve, reject) => {
      common.methodCall('authenticate', [db, username, password, {}], (err, val) => {
        if (err) reject(err)
        else resolve(val)
      })
    })

    if (!uid) {
      throw new Error("Authentication failed. Check DB Name and API Key.")
    }

    console.log("Authenticated! UID:", uid)

    // --- 4. CREATE LEAD ---
    const newLeadId = await new Promise((resolve, reject) => {
      models.methodCall('execute_kw', [
        db, uid, password,
        'crm.lead', 'create',
        [leadVals]
      ], (err, val) => {
        if (err) reject(err)
        else resolve(val)
      })
    })

    console.log("Lead Created! ID:", newLeadId)
    return Response.json({ success: true, id: newLeadId })

  } catch (error) {
    // This prints the exact error to your VS Code Terminal
    console.error("❌ BACKEND ERROR:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}