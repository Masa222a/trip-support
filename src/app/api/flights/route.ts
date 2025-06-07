// app/api/flights/route.ts
export async function POST() {
  const res = await fetch('https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights?fromId=KIX.AIRPORT&toId=BKK.AIRPORT&departDate=2025-12-12&returnDate=2025-06-18&stops=none&pageNo=1&adults=1&sort=CHEAPEST&cabinClass=ECONOMY&currency_code=JPY', {
    method: 'POST',
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
      'X-RapidAPI-Host': process.env.RAPIDAPI_HOST!,
    },
  });

  const data = await res.json();
  return Response.json(data);
}

