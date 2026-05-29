export default async function handler(request, response) {
    const apiKey = process.env.BKK_API_KEY;
    const url = `https://go.bkk.hu/api/query/v1/ws/otp/api/where/bicycle-rental.json?key=${apiKey}&version=3`;

    try {
        const bkkResponse = await fetch(url);
        const data = await bkkResponse.json();
        
        // Send the data back to your frontend
        response.status(200).json(data);
    } catch (error) {
        response.status(500).json({ error: 'Failed to fetch Bubi data' });
    }
}