function toggleFullScreen(elem) {
    // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        if (elem.requestFullScreen) {
            elem.requestFullScreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

function changeSection(elem)
{
    var sections = document.getElementsByTagName("section");
    for (const el of sections) {
        el.classList.remove("active");
        el.classList.add("inactive");
    }
    var target = document.getElementById(elem.getAttribute("for"));
    target.classList.add("active");
    target.classList.remove("inactive");
    toggleMenu();
}

function toggleMenu()
{
    if ($("#menu_toggle").hasClass("active")) {
        $("#menu_toggle").removeClass("active");
        document.getElementById("menu").style.height = "0%";
    } else {
        $("#menu_toggle").addClass("active");
        document.getElementById("menu").style.height = "100%";
    }
}

function toggleRotate()
{
    let fullscreen = document.getElementById("fullscreen");
    if(screen.orientation.type == "portrait-primary")
    {
        screen.orientation.lock('landscape').then(res=>console.log(res)).catch(err=>console.log(err))
        fullscreen.classList.add("pressed")
    } else {
        screen.orientation.lock('portrait').then(res=>console.log(res)).catch(err=>console.log(err))
        fullscreen.classList.remove("pressed")
    }
}

// Settings
var modeAccelerometer = false;
var modeGyroscope = false;

// Global Variable
var latency = null;

function openSocketIO()
{
    this.socket = io();

    this.socket.on('message', function(data){
        // console.log(data);  
    });

    this.send = function(data)
    {
        this.socket.emit('message', data);
        // console.log(data);  
    }

    this.ping = function()
    {
        var start = Date.now();
        this.socket.emit('latency', "ping", function(){
            var delta = Date.now() - start;
            document.getElementById("ping-latency").innerText = delta + " ms";
        });
    }
}
let socket = new openSocketIO();

function ping()
{
    socket.ping();
}

function gamepad()
{

}

function controller()
{
    this.joystick_left = null;
    this.joystick_right = null;
    this.a = null;         
    this.b = null;
    this.y = null;
    this.x = null;
    this.lb = null;
    this.rb = null;
    this.start = null;
    this.back = null;
    this.guide = null;
    this.lt = null;
    this.rt = null;
    this.ud = null;
    this.rd = null;
    this.dd = null;
    this.ld = null;
    this.urd = null;
    this.uld = null;
    this.drd = null;
    this.dld = null;
    this.steer = null;

    function Steering(b, bt)
    {
        var self = this;

        this.lockToLock = 900;
        this.fullRotate = 0; // 1+ Amount of full rotate clockwise, otherwise
        this.lastRotate = 0;

        this.type = null;
        this.bind = b;
        this.bindType = bt;

        // Sensor Raw Value
        // 9.8 = Max Value
        this.x = null;
        this.y = null;
        this.z = null;

        this.axis = function()
        {
            socket.send({
                inputType: "axis", 
                axis: this.bind.canvas.getAttribute("name"), 
                a: 0, 
                s: 0, 
                x: this.y*3.5, // 3.5 dari radius joystick / 10
                y: 0,
                r: this.bind.radius
            });
        }

        this.axisStop = function()
        {
            socket.send({
                inputType: "axis", 
                axis: this.bind.canvas.getAttribute("name"), 
                a: 0, 
                s: 0, 
                x: 0,
                y: 0,
                r: this.bind.radius
            });
        }

        this.button = function()
        {

        }

        this.buttonStop = function()
        {

        }

        this.sensor = function(event)
        {
            if(modeAccelerometer)
            {
                self.x = event.accelerationIncludingGravity.x;
                self.y = event.accelerationIncludingGravity.y;
                self.z = event.accelerationIncludingGravity.z;
    
                self.type[self.bindType]();
            } else {
                self.stopEventListener();
            }
        }

        this.startEventListener = function()
        {
            window.addEventListener("devicemotion", this.sensor, true);
        }

        this.stopEventListener = function()
        {
            window.removeEventListener("devicemotion", this.sensor, true);
            self.type[self.bindType + "Stop"]();
            self.x = null;
            self.y = null;
            self.z = null;
        }

        this.Init = function()
        {

            this.type = {
                "Axis": function(){self.axis()},
                "AxisStop": function(){self.axisStop()},
                "Button": function(){self.button()},
                "ButtonStop": function(){self.buttonStop()}
            }

            this.startEventListener()
        }
    }

    function Button(id)
    {
        // Declare all
        var self = this;
        this.button = document.getElementById(id);

        
        //Normal button
        this.set_handlers = function() {
            // Install event handlers for the given element
            this.button.ontouchstart = function(event)
            {
                self.start_handler(event)
            }
            // Use same handler for touchcancel and touchend
            this.button.ontouchcancel = function(event)
            {
                self.end_handler(event)
            }
            this.button.ontouchend = function(event)
            {
                self.end_handler(event)
            }
        }

        this.start_handler = function(ev) {
            ev.preventDefault();
            this.button.classList.add("pressed");
            socket.send({inputType: "button", button: this.button.name, v: 1});
        }

        this.end_handler = function(ev) {
            ev.preventDefault();
            if (ev.targetTouches.length == 0) {
                // Restore background and border to original values
                // Kirim sinyal hentikan tekan tombol
                this.button.classList.remove("pressed");
                socket.send({inputType: "button", button: this.button.name, v: 0});
            }
        }

        this.Init = function()
        {
            self.set_handlers();
        }
        this.Init();
    }

    function Dpad(id)
    {
        // Declare all
        var self = this;
        this.button = document.getElementById(id);

        
        //Normal button
        this.set_handlers = function() {
            // Install event handlers for the given element
            this.button.ontouchstart = function(event)
            {
                self.start_handler(event)
            }
            // Use same handler for touchcancel and touchend
            this.button.ontouchcancel = function(event)
            {
                self.end_handler(event)
            }
            this.button.ontouchend = function(event)
            {
                self.end_handler(event)
            }
        }

        this.start_handler = function(ev) {
            ev.preventDefault();
            this.hover();
            socket.send({inputType: "dpad", max: 1, button: this.button.name, v: {x: parseInt(this.button.getAttribute("x")), y: parseInt(this.button.getAttribute("y"))}});
        }

        this.end_handler = function(ev) {
            ev.preventDefault();
            if (ev.targetTouches.length == 0) {
                // Restore background and border to original values
                // Kirim sinyal hentikan tekan tombol
                this.unhover();
                socket.send({inputType: "dpad", max: 1, button: this.button.name, v: {x: 0, y: 0}});
            }
        }

        this.hover = function()
        {
            this.button.classList.add("hover");
        }

        this.unhover = function()
        {
            this.button.classList.remove("hover");
        }

        this.Init = function()
        {
            self.set_handlers();
        }
        this.Init();
    }

    function ShoulderAxis(id)
    {
        // Declare all
        var self = this;
        this.id = id;
        this.el = document.getElementById(this.id);

        this.reset = function()
        {
            this.el.value = "0"
        }

        //one axes button
        this.set_axis_handlers = function() {
            // Install event handlers for the given element
            this.el.ontouchstart = function(event)
            {
                self.start_axis_handler(event)
            }
            this.el.ontouchmove = function(event)
            {
                // self.move_axis_handler(event)
            }
            // Use same handler for touchcancel and touchend
            this.el.ontouchcancel = function(event)
            {
                self.end_axis_handler(event)
                self.reset()
            }
            this.el.ontouchend = function(event)
            {
                self.end_axis_handler(event)
                self.reset()
            }
            this.el.oninput = function(event)
            {
                self.move_axis_handler(event)
            }
        }

        this.start_axis_handler = function(ev) {
            this.el.classList.add("pressed");
        }

        this.move_axis_handler = function(ev)
        {
            socket.send({
                inputType: "triggerAxis", 
                axis: this.el.getAttribute("name"), 
                value: parseInt(this.el.value),
                max: parseInt(this.el.getAttribute("max"))
            });
        }

        this.end_axis_handler = function(ev) {
            self.reset();
            this.el.classList.remove("pressed");
            socket.send({
                inputType: "triggerAxis", 
                axis: this.el.getAttribute("name"), 
                value: 0,
                max: parseInt(this.el.getAttribute("max"))
            });
        }

        this.Init = function()
        {
            this.reset();
            self.set_axis_handlers();
        }
        this.Init();
    }

    function Joystick(id)
    {
        // Declare all
        var self = this;
        
        window.addEventListener('resize', this.resize);
        this.id = id;
        this.canvas = document.getElementById(this.id);
        this.ctx = this.canvas.getContext('2d');
        this.data = {
            x: 0,
            y: 0,
            speed: 0,
            angle: 0
        }

        this.width = 150;
        this.radius = 35;
        this.height = 150;
        this.x_orig = this.width / 2;
        this.y_orig = this.height / 2;
        this.coord = { x: this.x_orig, y: this.y_orig };
        this.paint = false;

        this.resize = function()
        {

            // console.log("resize")

            this.ctx.canvas.width = this.width;
            this.ctx.canvas.height = this.height;
            this.background();
            this.joystick(this.x_orig, this.y_orig);
        }

        this.background = function()
        {    
            // console.log("background")

            this.ctx.beginPath();
            this.ctx.arc(this.x_orig, this.y_orig, this.radius + 20, 0, Math.PI * 2, true);
            this.ctx.fillStyle = '#272727';
            this.ctx.fill();
        }

        this.joystick = function(width, height) {

            // console.log("joystick")

            this.ctx.beginPath();
            this.ctx.arc(width, height, this.radius, 0, Math.PI * 2, true);
            this.ctx.fillStyle = '#4e4e4e';
            this.ctx.fill();
            this.ctx.strokeStyle = '#606060';
            this.ctx.lineWidth = 8;
            this.ctx.stroke();
        }

        this.getPosition = function(event) {

            // console.log("getpos")

            var mouse_x = event.clientX || this.joystickEvent.clientX;
            var mouse_y = event.clientY || this.joystickEvent.clientY;
            this.coord.x = mouse_x - this.canvas.offsetLeft;
            this.coord.y = mouse_y - this.canvas.offsetTop;
        }

        this.is_it_in_the_circle = function() {

            var current_radius = Math.sqrt(Math.pow(this.coord.x - this.x_orig, 2) + Math.pow(this.coord.y - this.y_orig, 2));
            return this.radius >= current_radius;
        }

        this.is_it_in_the_rectangle = function() {

            var xLen = this.coord.x - this.x_orig
            var yLen = this.coord.y - this.y_orig

            return (xLen > -this.radius && xLen < this.radius && yLen > -this.radius && yLen < this.radius)
        }

        this.startDrawing = function(event) {

            // console.log("drawing")
            this.paint = true;
            // this.getPosition(event);
            if (this.is_it_in_the_circle()) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.background();
                this.joystick(this.x_orig, this.y_orig);
                // this.Draw(event);
            }
        }


        this.stopDrawing = function() {

            // console.log("stop drawing")

            this.coord.x = this.x_orig;
            this.coord.y = this.y_orig;

            this.paint = false;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.background();
            this.joystick(this.x_orig, this.y_orig);
            document.getElementById("x_coordinate-" + this.id).innerText = 0;
            document.getElementById("y_coordinate-" + this.id).innerText = 0;
            document.getElementById("speed-" + this.id).innerText = 0;
            document.getElementById("angle-" + this.id).innerText = 0;

            this.data = {
                x: 0,
                y: 0,
                speed: 0,
                angle: 0
            }

            socket.send({
                inputType: "axis", 
                axis: this.canvas.getAttribute("name"), 
                a: 0, 
                s: 0, 
                x: 0, 
                y: 0
            });
        }

        this.Draw = function(event) {

            // console.log("draw")

            if (this.paint) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.background();
                var angle_in_degrees,x, y, speed;
                var angle = Math.atan2((this.coord.y - this.y_orig), (this.coord.x - this.x_orig));

                if (Math.sign(angle) == -1) {
                    angle_in_degrees = Math.round(-angle * 180 / Math.PI);
                }
                else {
                    angle_in_degrees =Math.round( 360 - angle * 180 / Math.PI);
                }


                // Use this if circular joystick
                // if (this.is_it_in_the_circle()) {
                //     this.joystick(this.coord.x, this.coord.y);
                //     x = this.coord.x;
                //     y = this.coord.y;
                // }
                // else {
                //     // Clamp it to circle
                //     u = this.radius * Math.cos(angle) + this.x_orig;
                //     v = this.radius * Math.sin(angle) + this.y_orig;
                //     // Make it in square
                //     x = u;
                //     y = v;
                //     this.joystick(u, v);
                // }


                if (this.is_it_in_the_rectangle()) {
                    this.joystick(this.coord.x, this.coord.y);
                    x = this.coord.x;
                    y = this.coord.y;
                }
                else {
                    // Clamp it to square
                    u = Math.min(this.radius + this.x_orig, Math.max(this.x_orig-this.radius, this.coord.x));
                    v = Math.min(this.radius + this.y_orig, Math.max(this.y_orig-this.radius, this.coord.y));
                    // Make it in square
                    x = u;
                    y = v;
                    this.joystick(u, v);
                }



            
                this.getPosition(event);

                var speed =  Math.round(100 * Math.sqrt(Math.pow(x - this.x_orig, 2) + Math.pow(y - this.y_orig, 2)) / this.radius);

                var x_relative = Math.round(x - this.x_orig);
                var y_relative = Math.round(y - this.y_orig);

                
                document.getElementById("x_coordinate-" + this.id).innerText = x_relative;
                document.getElementById("y_coordinate-" + this.id).innerText = y_relative;
                document.getElementById("speed-" + this.id).innerText = speed;
                document.getElementById("angle-" + this.id).innerText = angle_in_degrees;

                this.data.x  =  x_relative;
                this.data.y = -y_relative ; // Invert karena di client terinvert, y positif arahnya ke bawah
                this.data.speed = speed;
                this.data.angle = angle_in_degrees;

                socket.send({
                    inputType: "axis", 
                    axis: this.canvas.getAttribute("name"), 
                    a: angle_in_degrees, 
                    s: speed, 
                    x: x_relative, 
                    y: -y_relative, // Invert karena di client terinvert, y positif arahnya ke bawah
                    r: this.radius
                });

                //send( x_relative,y_relative,speed,angle_in_degrees);
                //send(angle_in_degrees, speed, x_relative, y_relative);
            }
        } 

        // Handler
        
        this.joystickEvent = null;

        this.set_handler = function() {
            // Install event handlers for the given element
            this.canvas.ontouchstart = function(event)
            {
                self.start_joystick_handler(event)
            }
            this.canvas.ontouchmove = function(event)
            {
                self.move_joystick_handler(event)
            }
            // Use same handler for touchcancel and touchend
            this.canvas.ontouchcancel = function(event)
            {
                self.end_joystick_handler(event)
            }
            this.canvas.ontouchend = function(event)
            {
                self.end_joystick_handler(event)
            }
        }

        this.start_joystick_handler = function(ev) {
            // console.log("Start handler")
            ev.preventDefault();
            this.startDrawing(ev);
        }

        this.move_joystick_handler = function(ev) {
            // console.log("Move handler")
            ev.preventDefault();
            this.joystickEvent = this.findParent(event.touches, this.id);
            this.Draw(ev);
        }

        this.end_joystick_handler = function(ev) {
            // console.log("End handler")
            ev.preventDefault();
            if (ev.targetTouches.length == 0) {
                // Restore background and border to original values
                this.stopDrawing();
            }
        }
        
        this.findParent = function(obj, target) {
            for(i = 0; i < obj.length;i++){
                if(obj[i].target.id == target){
                    return obj[i];
                }
            }
        }

        // Initilization
        

        this.Init = function()
        {
            this.resize();
            self.set_handler();
        }
        
        this.Init();
    }

    this.Init = function() {
        this.joystick_left = new Joystick("lsb");
        this.joystick_right = new Joystick("rsb");
        this.a = new Button("a")              
        this.b = new Button("b")
        this.y = new Button("y")
        this.x = new Button("x")
        this.lb = new Button("lb")
        this.rb = new Button("rb")
        this.start = new Button("start")
        this.back = new Button("back")
        this.guide = new Button("guide")
        this.lt = new ShoulderAxis("lt-range");
        this.rt = new ShoulderAxis("rt-range");
        this.ud = new Dpad("d-pad-up");
        this.rd = new Dpad("d-pad-right");
        this.dd = new Dpad("d-pad-down");
        this.ld = new Dpad("d-pad-left");
        this.urd = new Dpad("d-pad-up-right");
        this.uld = new Dpad("d-pad-up-left");
        this.drd = new Dpad("d-pad-down-right");
        this.dld = new Dpad("d-pad-down-left");

        this.steer = new Steering(this.joystick_left, "Axis");
    }

    this.Init();
}

let con = null;

$(document).ready(function(){
    con = new controller();
});

function updateSettings()
{
    var acce = document.getElementById("accelerometer");
    var gyro = document.getElementById("gyro");

    modeAccelerometer = acce.checked;
    if(modeAccelerometer)
        con.steer.Init();
    modeGyroscope = gyro.checked;
}
