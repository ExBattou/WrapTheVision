export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL requerida' });
  }

  try {
    // Decodificamos la URL por si viene con caracteres especiales de VistaGolf
    const targetUrl = decodeURIComponent(url);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      // Esto ayuda si el sitio remoto tiene certificados SSL viejos
      redirect: 'follow'
    });

    if (!response.ok) {
      // Si el sitio remoto responde 403, 404, etc, lo atrapamos aquí
      const errorText = await response.text();
      console.error(`Error del sitio remoto (${response.status}):`, errorText);
      return res.status(response.status).send(`Error remoto: ${response.status}`);
    }

    const html = await response.text();

    // Headers de salida para que tu HTML en Vercel lo acepte
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'text/html; charset=iso-8859-1'); // VistaGolf suele usar este encoding viejo
    
    return res.status(200).send(html);

  } catch (error) {
    // Este log aparecerá en tu consola de Vercel (Pestaña Logs)
    console.error("DETALLE DEL ERROR EN PROXY:", error.message);
    
    return res.status(500).json({ 
      error: 'Fallo interno en el proxy', 
      detail: error.message 
    });
  }
}