const ss = require('screenshot-desktop');
const fs = require('fs');

// call this with this => new screenshot().screenshot();
class screenshot {
    constructor()
    {
        this._dirname = './screenshots/';
        if (!fs.existsSync(this._dirname)){
            fs.mkdirSync(this._dirname);
        }
    }

    screenshot()
    {
        let date = new Date();
        let year = date.toISOString().slice(0,10);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let miliseconds = date.getMilliseconds();
        let screenshot_filename = `${this._dirname}${year}-${hours}-${minutes}-${seconds}-${miliseconds}.png`;
        ss({ filename: `${screenshot_filename}` }).then((imgPath) => {
            console.log(`Screenshot successfully created on ${imgPath}`);
        });
    }
}

module.exports = screenshot;