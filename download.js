// Cloudflare Pages Function – API Proxy für YouTube MP3
// Wird automatisch unter /download erreichbar

const RAPIDAPI_KEY = '0bb9e26c32msh55f6e42484e86eap1579d6jsnd2beb5b07131';
const RAPIDAPI_HOST = 'youtube-mp310.p.rapidapi.com';

export async function onRequestGet({ request }) {
  const { searchParams } = new URL(request.url);
  const ytUrl = searchParams.get('url');

  if (!ytUrl) {
    return Response.json({ error: 'Keine URL angegeben' }, { status: 400 });
  }

  try {
    const apiUrl = `https://${RAPIDAPI_HOST}/download/mp3?url=${encodeURIComponent(ytUrl)}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return Response.json(
        { error: `RapidAPI Fehler ${response.status}`, detail: text.slice(0, 300) },
        { status: response.status }
      );
    }

    const data = await response.json();

    return Response.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// CORS Preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
