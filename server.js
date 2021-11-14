const path = require('path');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, 'build');
const port = process.env.PORT || 3000;

const { exec } = require("child_process");

app.use(express.static(publicPath));

const showFiles = () => {
    exec("ls -l", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

app.get('*', (req, res) => {
    showFiles();
    console.log ("PORT = "+process.env.PORT);
    console.log(__dirname);
    console.log(publicPath);
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
    console.log('Server is up!');
});