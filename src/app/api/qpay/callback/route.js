export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { invoice_id, payment_status } = req.body;
  
      if (payment_status === 'PAID') {
        console.log(`Payment for invoice ${invoice_id} was successful.`);
        // Update your database or trigger other actions
      }
  
      res.status(200).json({ success: true });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }