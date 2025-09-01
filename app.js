const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    const url = req.query.url;
    const fallbackUrl = req.query.fallbackUrl; // New: Optional fallback URL

    if (!url) {
        return res.status(400).send('Please provide a URL in the "url" query parameter. Example: /?url=https://www.example.com or /?url=uber%3A%2F%2F...');
    }

    try {
        const decodedUrl = decodeURIComponent(url);
        const decodedFallbackUrl = fallbackUrl ? decodeURIComponent(fallbackUrl) : null;

        // Render the redirect page
        res.render('redirect', { targetUrl: decodedUrl, fallbackUrl: decodedFallbackUrl });

    } catch (error) {
        console.error('Error decoding URL:', error);
        return res.status(400).send('Invalid URL provided.');
    }
});

app.listen(port, () => {
    console.log(`Request Redirector listening at http://localhost:${port}`);
    console.log(`Example usage: http://localhost:${port}/?url=https://www.google.com`);
    console.log(`Deep Link example (Uber): http://localhost:${port}/?url=uber%3A%2F%2F%3Faction%3DsetPickup%26pickup%3Dmy_location%26dropoff%5Blatitude%5D%3D28.6413251%26dropoff%5Blongitude%5D%3D77.3342567`);
    console.log(`Deep Link with Fallback: http://localhost:${port}/?url=myapp%3A%2F%2Fhome&fallbackUrl=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.my.app`);
});