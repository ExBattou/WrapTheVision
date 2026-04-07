export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('Falta el parámetro URL');
  }

  try {
    const response = await fetch(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' 
      }
    });
    
    const html = await response.text();
    
    // Configurar CORS para que tu propio sitio pueda leer los datos
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send('Error al obtener los datos');
  }
}