import xmlrpc from 'xmlrpc'

export async function POST(request) {
  const body = await request.json()
  
  // 1. Identify Main Name and Construct Description
  let mainName = ''
  let descriptionText = ''

  if (body.applierType === 'sme') {
    mainName = body.company_name // Title of the Lead
    descriptionText = `
    === SME APPLICATION ===
    Company Type: ${body.company_type}
    NTN No: ${body.ntn_no}
    `
  } else {
    mainName = body.retailer_name // Title of the Lead
    descriptionText = `
    === RETAILER APPLICATION ===
    CNIC No: ${body.cnic_no}
    `
  }

  // Add shared details to description
  descriptionText += `
  ---------------------------
  Already Has Account: ${body.has_account}
  Loan Type Requested: ${body.loan_type}
  Address: ${body.address}
  `

  // 2. Setup Odoo Config
  const url = process.env.ODOO_URL
  const db = process.env.ODOO_DB
  const username = process.env.ODOO_EMAIL
  const password = process.env.ODOO_API_KEY

  // 3. Authenticate and Push to Odoo
  const common = xmlrpc.createSecureClient({ url: `${url}/xmlrpc/2/common` })
  const models = xmlrpc.createSecureClient({ url: `${url}/xmlrpc/2/object` })

  try {
    const uid = await new Promise((resolve, reject) => {
      common.methodCall('authenticate', [db, username, password, {}], (err, val) => {
        if (err) reject(err)
        else resolve(val)
      })
    })

    const leadId = await new Promise((resolve, reject) => {
      models.methodCall('execute_kw', [
        db, uid, password,
        'crm.lead', 'create',
        [{
          // Mapping Form Data to Odoo Fields
          'name': `${mainName} - ${body.loan_type} Request`, // Lead Title
          'contact_name': body.contact_person,                // Contact Person Name
          'partner_name': body.applierType === 'sme' ? body.company_name : '', // Company Name (if SME)
          'phone': body.contact_number,                       // Phone Number
          'street': body.address,                             // Address field in Odoo
          'description': descriptionText,                     // The formatted notes
          'type': 'lead',                                     // Create as a Lead (not Opportunity yet)
          'tag_ids': []                                       // Optional: Add tags IDs if known
        }]
      ], (err, val) => {
        if (err) reject(err)
        else resolve(val)
      })
    })

    return Response.json({ success: true, lead_id: leadId })
  } catch (error) {
    console.error(error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}