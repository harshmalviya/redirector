const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// --- Existing Root Redirector ---
app.get('/', (req, res) => {
    const url = req.query.url;
    const fallbackUrl = req.query.fallbackUrl;

    if (!url) {
        return res.status(400).send('Please provide a URL in the "url" query parameter. Example: /?url=https://www.example.com or /?url=uber%3A%2F%2F...');
    }

    try {
        const decodedUrl = decodeURIComponent(url);
        const decodedFallbackUrl = fallbackUrl ? decodeURIComponent(fallbackUrl) : null;

        res.render('redirect', { targetUrl: decodedUrl, fallbackUrl: decodedFallbackUrl });

    } catch (error) {
        console.error('Error decoding URL:', error);
        return res.status(400).send('Invalid URL provided.');
    }
});

// --- NEW: Uber Redirector UI ---
app.get('/uber-redirector', (req, res) => {
    let initialInput = '';
    let initialLat = '';
    let initialLon = '';

    if (req.query.input) {
        initialInput = req.query.input;
        const parts = initialInput.split(',');
        if (parts.length === 2 && !isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1]))) {
            initialLat = parseFloat(parts[0].trim()).toFixed(7); // Format to 7 decimal places
            initialLon = parseFloat(parts[1].trim()).toFixed(7); // Format to 7 decimal places
        }
    }

    res.render('uber-redirector-ui', {
        initialInput: initialInput,
        initialLat: initialLat,
        initialLon: initialLon
    });
});


app.listen(port, () => {
    console.log(`Request Redirector listening at http://localhost:${port}`);
    console.log(`Example usage (Root): http://localhost:${port}/?url=https://www.google.com`);
    console.log(`Deep Link example (Root): http://localhost:${port}/?url=uber%3A%2F%2F%3Faction%3DsetPickup%26pickup%3Dmy_location%26dropoff%5Blatitude%5D%3D28.6413251%26dropoff%5Blongitude%5D%3D77.3342567`);
    console.log(`---`);
    console.log(`Uber Redirector UI: http://localhost:${port}/uber-redirector`);
    console.log(`Uber Redirector UI with input: http://localhost:${port}/uber-redirector?input=28.5127698,76.7758902`);
});