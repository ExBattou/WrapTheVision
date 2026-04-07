     export default async function handler(req, res) {
       const url = req.query.url;
       const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
       const html = await r.text();
       res.setHeader('Access-Control-Allow-Origin', '*');
       res.send(html);
     }