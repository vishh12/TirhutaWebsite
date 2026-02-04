
const fs = require('fs');
const path = require('path');

const PORT = 8888;

const WEBSITE_DIR = path.join(__dirname, 'website');

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
    let filePath = path.join(WEBSITE_DIR, req.url === '/' ? 'index.html' : req.url);
    
    // Remove query strings
    filePath = filePath.split('?')[0];
    
    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found
                fs.readFile(path.join(WEBSITE_DIR, '404.html'), (err404, content404) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content404 || '<h1>404 - Page Not Found</h1>', 'utf-8');
                });
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`, 'utf-8');
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 Tirhuta Website Server Started!');
    console.log('='.repeat(60));
    console.log(`📍 Server running at: http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${WEBSITE_DIR}`);
    console.log('='.repeat(60));
    console.log('Available pages:');
    console.log(`  • Home:        http://localhost:${PORT}/`);
    console.log(`  • About:       http://localhost:${PORT}/about.html`);
    console.log(`  • Business:    http://localhost:${PORT}/business.html`);
    console.log(`  • Operations:  http://localhost:${PORT}/operations.html`);
    console.log(`  • Leadership:  http://localhost:${PORT}/leadership.html`);
    console.log(`  • Investors:   http://localhost:${PORT}/investors.html`);
    console.log(`  • Contact:     http://localhost:${PORT}/contact.html`);
    console.log('='.repeat(60));
    console.log('Press Ctrl+C to stop the server');
    console.log('='.repeat(60));
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped successfully');
        process.exit(0);
    });
});
