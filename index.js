const http = require('http');
const fs = require('fs');
const EventEmitter = require('events');
const fruits = require('fruits'); // Importing the 'fruits' npm package

// Instantiate an event emitter
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

// Create multi-route http server
const server = http.createServer((req, res) => {
    const { url } = req;
    let filePath = './views' + (url === '/' ? '/index.html' : url) + '.html';

    // Task #1: Use switch statement to handle routes
    switch(url) {
        case '/':
            filePath = './views/index.html';
            break;
        case '/about':
            filePath = './views/about.html';
            break;
        case '/contact':
            filePath = './views/contact.html';
            break;
        case '/products':
            filePath = './views/products.html';
            break;
        case '/subscribe':
            filePath = './views/subscribe.html';
            break;
        case '/fruits':
            // Handle the /fruits route
            try {
                const fruitNames = Object.keys(fruits);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(`Fruits: ${fruitNames.join(', ')}`); // Display the list of fruits
            } catch (error) {
                console.error('Error:', error);
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 Internal Server Error</h1>');
            }
            return; // Return early to avoid executing the file read logic below
        default:
            filePath = './views/error.html'; // Handle 404 errors
            break;
    }

    // Task #2: Read html files from a views folder and display to browse
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        }
    });

    // Task #3: 
    myEmitter.emit('routeAccessed', { url: url, timestamp: new Date() });
});

// Task #3: Event listener for route access
myEmitter.on('routeAccessed', ({ url, timestamp }) => {
    console.log(`Route accessed: ${url} at ${timestamp}`);
});

// Start server on port 3000
const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));