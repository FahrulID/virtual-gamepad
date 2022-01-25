// Feeder
const feeder = require('./app.feeder');

// FS and ssl
const fs = require('fs');
const key = fs.readFileSync(__dirname + '/ssl/key.pem', 'utf8');
const cert = fs.readFileSync(__dirname + '/ssl/cert.pem', 'utf8');
var cred = {key: key, cert: cert};

// Screenshot, ss.screenshot()
const ss = require('./screenshot');

// Express
const express = require('express');

const buttons = {
    BOTTOM_BUTTON : "A",
    RIGHT_BUTTON : "B",
    TOP_BUTTON : "Y",
    LEFT_BUTTON : "X",
    RIGHT_SHOULDER : "RIGHT_SHOULDER",
    LEFT_SHOULDER : "LEFT_SHOULDER",
    START : "START",
    BACK : "BACK"
}

const axes = {
    ANALOG_LEFT : "left",
    ANALOG_RIGHT: "right"
}

const shoulder = {
    LEFT_TRIGGER : "left",
    RIGHT_TRIGGER: "right"
}

class server {
    constructor()
    {
        this.start();
    }

    async start()
    {
        this.setVariables();
        
        // Sleep for 0.1s to let the variables set up
        await new Promise(resolve => setTimeout(resolve, 100));

        this.createPaths();
        this.createSocket();
        this.runPort();
    }

    setVariables()
    {
        this._controllers = {};
        this._app = express();
        this._https = require('https').createServer(cred, this._app);
        this._socket = require('socket.io')(this._https);
        this._port = process.env.PORT || 7200;
        this.getLocalIP();
    }

    createPaths()
    {
        // Set root to xbox layout
        this._app.get('/', (req, res) => {
            return res.sendFile(__dirname + "/static/s-new.html");
        });
        
        // Set /static as root so the assets and stuffs can be loaded
        this._app.use('/', express.static(__dirname + '/static'));
    }

    createSocket()
    {
        this._socket.on('connection', (socket) => {
            // Notification Callback
            let notificationCallback = function(data)
            {
                // Do something when receive callback
            }

            
            this._controllers[socket.id] = new feeder("x360", notificationCallback);
            let client = this._controllers[socket.id];

            if(this._controllers[socket.id] !== false)
            {
                socket.on('disconnect', () => {
                    console.log('user disconnected');
                    client.disconnectController();
                });

                socket.on('latency', function(msg, callback){
                    callback();
                });

                socket.on('message', (data) => {
                    switch(data.inputType)
                    {
                        case "axis":
                            if(data.axis == "ANALOG_LEFT" || data.axis == "ANALOG_RIGHT")
                            {
                                // Use this if circular joystick : var coord = client.convertCircleCoordToSquareCoord(data.x, data.y, data.r)
                                client.setAxisValue(`${axes[data.axis]}X`, data.x, data.r);
                                client.setAxisValue(`${axes[data.axis]}Y`, data.y, data.r);
                            }
                            break;
                        case "triggerAxis":
                            if(data.axis == "LEFT_TRIGGER" || data.axis == "RIGHT_TRIGGER")
                            {
                                client.setAxisValue(`${shoulder[data.axis]}Trigger`, data.value, data.max);
                            }
                            break;
                        case "button":
                            client.setButtonValue(buttons[data.button], !!data.v);
                            break;
                        case "dpad":
                            client.setAxisValue("dpadHorz", data.v.x, data.max);
                            client.setAxisValue("dpadVert", data.v.y, data.max);
                            break;
                    }
                });
            }
        });
    }

    getLocalIP()
    {
        var t = this;
        require('dns').lookup(require('os').hostname(), function (err, add, fam) {
            t._local = add;
        });
    }

    runPort()
    {
        this._https.listen(this._port, () => {
            console.log(`Open this link on your phone :`);
            console.log(`https://${this._local}:${this._port}`);
        });
    }
}

let srv = new server();