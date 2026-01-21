export async function POST(request) {
  const body = await request.json()

  // --- MAPPING LOGIC ---
  // We construct the "vals" dictionary that Odoo expects
  const leadVals = {
    // Standard Fields
    'type': 'lead', // Create as Lead
    'name': `${body.applier_type.toUpperCase()} Request: ${body.loan_type}`, // Title
    'contact_name': body.contact_person,
    'phone': body.contact_number,
    'street': body.address,

    // Custom Fields (Keys must match Python model exactly)
    'applier_type': body.applier_type,
    'has_account': body.has_account, // 'yes' or 'no'
    'loan_type': body.loan_type,     // 'car', 'personal', 'others'
  }

  // Conditional Fields
  if (body.applier_type === 'sme') {
    leadVals['partner_name'] = body.company_name; // Company Name
    leadVals['company_type'] = body.company_type; // 'private', 'proprietor', etc
    leadVals['ntn_no'] = body.ntn_no;
  } else {
    // For retailer, we might want the name in the title or contact_name
    // But since contact_person is separate, we assume:
    leadVals['contact_name'] = body.retailer_name; // Or keep body.contact_person
    leadVals['cnic_no'] = body.cnic_no;
  }

  // --- ODOO CONNECTION ---
  const url = process.env.ODOO_URL
  const db = process.env.ODOO_DB
  const username = process.env.ODOO_EMAIL
  const password = process.env.ODOO_API_KEY

  const common = xmlrpc.createSecureClient({ url: `${url}/xmlrpc/2/common` })
  const models = xmlrpc.createSecureClient({ url: `${url}/xmlrpc/2/object` })

  try {
    const uid = await new Promise((resolve, reject) => {
      common.methodCall('authenticate', [db, username, password, {}], (err, val) => {
        if (err) reject(err)
        else resolve(val)
      })
    })

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

    return Response.json({ success: true, id: newLeadId })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}