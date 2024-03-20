const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Create a server
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        // Read the HTML file
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('File not found');
                res.end();
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            }
        });
    } else if (req.url === '/commands') {
        // Read the commands JSON file
        fs.readFile(path.join(__dirname, 'commands.json'), (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.write('Internal Server Error');
                res.end();
            } else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(data);
                res.end();
            }
        });
    } else if (req.url === '/execute' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { command } = JSON.parse(body);
            // Execute the command
            exec(`bash -c "${command}"`, (error, stdout, stderr) => {
                if (error) {
                    console.error('Error:', error.message);
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.write('Error executing command');
                    res.end();
                } else {
                    console.log('Command executed successfully:', stdout);
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.write('Command executed successfully');
                    res.end();
                }
            });
        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('Not Found');
        res.end();
    }
});

// Listen on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://node.default.svc.cluster.local:${PORT}`);
});
