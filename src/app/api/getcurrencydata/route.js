import axios from 'axios';

// Define the API route handler
export async function GET() {
  try {
    // URL for the currency exchange API (Hexarate API for USD to MNT rate)
    const response = await axios.get('https://hexarate.paikama.co/api/rates/latest/USD?target=MNT');

    // Extract the MNT exchange rate from the response
    const mntRate = response.data.data.mid;

    // Return the MNT exchange rate as JSON response
    return new Response(
      JSON.stringify({
        mnt: mntRate || null, // If the rate is available, use it; otherwise, set to null
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch exchange rates' }),
      { status: 500 }
    );
  }
}
