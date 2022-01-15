const ViGEmClient = require('vigemclient');

// Tutorial to use the feeder
// to initiate the feeder, we can use :
// let feeder = new feeder("x360", function(){//Do Something}) 
// to change the values, we can use :
// feeder.setButtonValue("X", true)
// feeder.setAxisValue("leftAnalog", x)
// feeder.toggleButton("X")

class feeder 
{

    //-------------------[VARIABLE]-------------------
    _controllerList = 
    {
        "x360" : "x360",
        "ds4" : "ds4"
    }

    _vibration = false;
    _activeController

    // > Variable to contain the Vigem Driver 
    _controller
    _client

    // > Used to contain functions

    _controllerFunctions = []

    _generalFunctions = []

    //-------------------[VARIABLE]-------------------

    
    //-------------------[Constructor]-------------------

    constructor(controller, notificationCallback) // Input ex : new feeder("x360", function(){//Do Something})
    {

        if (!(controller in this._controllerList)) return false // > Check for controller if exists

        // > _activeController from the server.js
        this._activeController = controller

        // > Initiate _controllerFunctions
        this.initiateFunctions()

        // > Initiate _generalFunctions
        this.initiateGeneralFunctions()

        // > Calling the right feeder with _activeController from the _controllerFunctions
        this._controllerFunctions[this._activeController](notificationCallback)
    }

    initiateFunctions()
    {
        this._controllerFunctions["x360"] = (notificationCallback) => {this.x360(notificationCallback)}
        this._controllerFunctions["ds4"] = (notificationCallback) => {this.ds4(notificationCallback)}
    }

    initiateGeneralFunctions()
    {
        switch(this._activeController)
        {
            case this._controllerList["x360"]:
                this._generalFunctions["button"] = (buttonName, buttonValue) => {this.x360SetButtonValue(buttonName, buttonValue)}
                this._generalFunctions["axis"] = (axisName, axisValue, maxValue) => {this.x360SetAxisValue(axisName, axisValue, maxValue)}
                this._generalFunctions["toggle"] = (buttonName) => {this.x360ToggleButton(buttonName)}
                break
            case this._controllerList["ds4"]:
                break
            default:
        }
    }

    //-------------------[Constructor]-------------------

    //-------------------[VigemBus Driver]-------------------

    connectClient()
    {
        // > Calling the vigemclient
        this._client = new ViGEmClient()

        // > Error variable
        let err = this._client.connect() // > establish connection to the ViGEmBus driver
        return err
    }

    connectController(controllerName)
    {
        // > Spawning the right controller
        switch(controllerName)
        {
            case this._controllerList["x360"]:
                this._controller = this._client.createX360Controller() // > Spawn x360 virtual controller
                break
            case this._controllerList["ds4"]:
                this._controller = this._client.createDS4Controller() // > Spawn ds4 virtual controller
                break
            default:
                this._controller = this._client.createX360Controller() // > Spawn x360 virtual controller as default
        }
        return this._controller.connect();
    }

    disconnectController()
    {
        return this._controller.disconnect(); // > Disconnecting the controller
    }

    updateController()
    {
        this._controller.update(); // > update manually for better performance
    }

    controllerInfo(controllerName)
    {
        console.log("Vendor ID:", this._controller.vendorID);
        console.log("Product ID:", this._controller.productID);
        console.log("Index:", this._controller.index);
        console.log("Type:", this._controller.type);
        if(controllerName == this._controllerList[0])
        {
            console.log("User index:", this._controller.userIndex);
        }
    }

    //-------------------[VigemBus Driver]-------------------

    //-------------------[Function For The Input]-------------------

    convertAngleToAxis(a, s)
    {
        let x = (s/100)*Math.cos(a*Math.PI/180);
        let y = (s/100)*Math.sin(a*Math.PI/180);
        let xSquare = 0.5*Math.sqrt(2+2*Math.sqrt(2)*x+Math.pow(x,2)-Math.pow(y,2)) - 0.5*Math.sqrt(2-2*Math.sqrt(2)*x+Math.pow(x,2)-Math.pow(y,2));
        let ySquare = 0.5*Math.sqrt(2+2*Math.sqrt(2)*y-Math.pow(x,2)+Math.pow(y,2)) - 0.5*Math.sqrt(2-2*Math.sqrt(2)*y-Math.pow(x,2)+Math.pow(y,2));
        if(isNaN(xSquare) && isNaN(ySquare)) {
            if(x>=0)
            {
                xSquare = 1;
            } else {
                xSquare = -1;
            }
            if(y>=0)
            {
                ySquare = 1;
            } else {
                ySquare = -1;
            }
        }
        return {x: xSquare, y: ySquare};
    }

    convertCircleCoordToSquareCoord(u, v, r)
    {
        u = this.normalize(u, r)// r = radius of the joystick // u,v element u^2 + v^2 <= 1
        v = this.normalize(v, r)// r = radius of the joystick // u,v element u^2 + v^2 <= 1 // The y is inverted, from the client so we need to invert it here
        let xSquare = 0.5*Math.sqrt(2+2*Math.sqrt(2)*u+Math.pow(u,2)-Math.pow(v,2)) - 0.5*Math.sqrt(2-2*Math.sqrt(2)*u+Math.pow(u,2)-Math.pow(v,2)); // x = ½ √( 2 + 2u√2 + u² - v² ) - ½ √( 2 - 2u√2 + u² - v² )
        let ySquare = 0.5*Math.sqrt(2+2*Math.sqrt(2)*v-Math.pow(u,2)+Math.pow(v,2)) - 0.5*Math.sqrt(2-2*Math.sqrt(2)*v-Math.pow(u,2)+Math.pow(v,2)); // y = ½ √( 2 + 2v√2 - u² + v² ) - ½ √( 2 - 2v√2 - u² + v² )
        if(isNaN(xSquare) && isNaN(ySquare)) {
            if(u>0)
            {
                xSquare = 1;
            } else if(u<0) {
                xSquare = -1;
            }
            if(v>0)
            {
                ySquare = 1;
            } else if(v<0) {
                ySquare = -1;
            }
        }
        return {x: xSquare, y: ySquare};
    }

    clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    normalize(value, max)
    {
        return value/max;
    }

    //-------------------[Function For The Input]-------------------

    //-------------------[General Functions]-------------------

    setButtonValue(buttonName, buttonValue)
    {
        this._generalFunctions["button"](buttonName, buttonValue)
    }

    setAxisValue(axisName, axisValue, maxValue)
    {
        this._generalFunctions["axis"](axisName, axisValue, maxValue)
    }

    toggleButton(buttonName)
    {
        this._generalFunctions["toggle"](buttonName)
    }

    //-------------------[General Functions]-------------------

    //-------------------[XBOX 360 FEEDER]-------------------

    x360(notificationCallback)
    {
        let connectClient = this.connectClient()

        if(connectClient == null)
        {
            let errConnectController = this.connectController(this._activeController)
            
            if(errConnectController)
            {
                console.log(connectController.message) // > Outputting the error message
                process.exit(1);
            }

            this.controllerInfo(this._activeController) // > Outputting the controller info

            // > Fetching the notification
            this._controller.on("notification", data => {
                console.log("notification", data)
                if(this._vibration)
                {
                    if(data.LargeMotor > 0 || data.SmallMotor > 0)
                    {
                        notificationCallback(true);
                    } else {
                        notificationCallback(false);
                    }
                }
            });

            this._controller.updateMode = "manual"; // requires manual calls to controller.update()

        }
    }

    x360SetButtonValue(buttonName, buttonValue)
    {
        if (buttonName in this._controller.button) // > Check native button in x360
        {
            this._controller.button[buttonName].setValue(buttonValue === true) // > Changing the value of the button
            this.updateController()
            return true;
        } else {
            return false;
        }
    }

    x360ToggleButton(buttonName)
    {
        if (!(buttonName in this._controller.button)) return false // > Check native button in x360
        this._controller.button[buttonName].setValue(!this._controller.button[buttonName].value); // invert button value
        this.updateController()
    }

    x360SetAxisValue(axisName, axisValue, maxValue)
    {

        if (!(axisName in this._controller.axis)) return false // > Check native axis in x360
        
        // Use this if circular joystick
        // var analog = {leftX: "", leftY: "", rightX: "", rightY: ""};
        // if(!(axisName in analog)) // > Normalize only if not analog, because if analog then convert circle to square coord first
        //     axisValue = this.normalize(axisValue, maxValue) // > Normalize the value so not lower than -1 and no bigger than +1
        
        axisValue = this.normalize(axisValue, maxValue) // > Normalize the value so not lower than -1 and no bigger than +1
        this._controller.axis[axisName].setValue(axisValue) // > Changing the value of the axis
        this.updateController()
    }

    //-------------------[DUALSHOCK 4 FEEDER]-------------------

    ds4(notificationCallback)
    {
        // Do DS4
    }
}

module.exports = feeder;