import { NextResponse } from 'next/server';

const AUTH_URL = 'https://merchant-sandbox.qpay.mn/v2/auth/token';
const INVOICE_URL = 'https://merchant-sandbox.qpay.mn/v2/invoice';

export async function POST(request) {
  try {
    const { amount } = await request.json();

    // Step 1: Get Authentication Token
    const authResponse = await fetch(AUTH_URL, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic VEVTVF9NRVJDSEFOVDoxMjM0NTY=',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'TEST_MERCHANT',
        password: '123456',
      }),
    });

    if (!authResponse.ok) throw new Error('Failed to get auth token');
    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // Step 2: Create Invoice
    const invoiceResponse = await fetch(INVOICE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invoice_code: 'TEST_INVOICE',
        sender_invoice_no: `INV-${Date.now()}`,
        invoice_receiver_code: 'terminal',
        invoice_description: `Payment for ${amount} MNT`,
        amount: amount,
        callback_url: 'https://your-app.com/api/paymentCallback',
      }),
    });

    if (!invoiceResponse.ok) throw new Error('Failed to create invoice');
    const invoiceData = await invoiceResponse.json();

    return NextResponse.json(invoiceData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}