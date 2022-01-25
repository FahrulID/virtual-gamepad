<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<!--
***<div align="center">
***  <a href="https://github.com/FahrulID/virtual-gamepad">
***    <img src="images/logo.png" alt="Logo" width="80" height="80">
***  </a>
-->

<h3 align="center">virtual-gamepad</h3>

  <p align="center">
    Transform your phone into a virtual gamepad.
    <br />
    <a href="https://github.com/FahrulID/virtual-gamepad"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/FahrulID/virtual-gamepad">View Demo</a>
    ·
    <a href="https://github.com/FahrulID/virtual-gamepad/issues">Report Bug</a>
    ·
    <a href="https://github.com/FahrulID/virtual-gamepad/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#build">Build</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://github.com/FahrulID/virtual-gamepad/)

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [vigemclient](https://github.com/jangxx/node-ViGEmClient)
* [socket.io](https://socket.io/)
* [Express.js](https://expressjs.com/)
* [screenshot-desktop](https://github.com/bencevans/screenshot-desktop)
* [JQuery](https://jquery.com)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you can setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

Prerequisites for building this project.

#### Node-server

* npm
  ```sh
  npm install npm@latest -g
  ```

* ViGEmBus, Download from [here](https://github.com/ViGEm/ViGEmBus/releases)

* Python, Latest Python 3

* Visual Studio, Latest Visual Studio including the "Desktop development with C++" workload.

#### Webview-app

* android studio, Download from [here](https://developer.android.com/studio)

### Build

#### Node-server

1. Clone the repo
   ```sh
   git clone https://github.com/FahrulID/virtual-gamepad.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create self-signed SSL and then put it inside the "SSL" folder, 
   you can use this command using git bash in windows
   ```sh
   openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
   ```
4. To create executable, run this command
   ```sh
   pkg --config package.json index.js
   ```

#### Webview-app

1. Clone the repo
   ```sh
   git clone https://github.com/FahrulID/virtual-gamepad.git
   ```
2. Open Android Studio
3. Open an Existing Project
   ```sh
   Open project ./src/webview
   ```
4. Build


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

#### Node-server

1. To use this application, you need to install [ViGEmBus](https://github.com/ViGEm/ViGEmBus/releases)
2. After installing ViGEmBus, download released [virtual-gamepad](https://github.com/FahrulID/virtual-gamepad/releases)
3. Run the portable executable you downloaded
4. Go to the link as the application instructed

#### Webview-app

1. Simply download the .apk from the release page [apk](https://github.com/FahrulID/virtual-gamepad/releases)
2. Install it on your phone
3. Run it
4. Run the Node-server
5. Input URL shown in Node-server to the Webview-app
6. Press "Connect"

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

#### Node-server

- [ ] Add Steering Mode ( Accelerometer )
- [ ] Add Aiming Mode ( Gyroscope )
- [ ] Multi-language Support
- [ ] Support For Other Than Windows OS
- [ ] DS4 Controller
- [ ] Controller Skin
    - [ ] Hotas
    - [ ] Yoke
- [ ] Many More...

See the [open issues](https://github.com/FahrulID/virtual-gamepad/issues) for a full list of proposed features (and known issues).
You can also [request feature](https://github.com/FahrulID/virtual-gamepad/issues).

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Fahrul Ramadhan Putra - [Twitter](https://twitter.com/fahrulrputra) - [Instagram](https://www.instagram.com/fahrulrputra/) - fahrulrputra@gmail.com

Project Link: [https://github.com/FahrulID/virtual-gamepad](https://github.com/FahrulID/virtual-gamepad)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Biggest thanks to

* [Nefarius](https://github.com/nefarius)
* [Jan Scheiper](https://github.com/jangxx)

as without them, this project will not work.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/FahrulID/virtual-gamepad.svg?style=for-the-badge
[contributors-url]: https://github.com/FahrulID/virtual-gamepad/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/FahrulID/virtual-gamepad.svg?style=for-the-badge
[forks-url]: https://github.com/FahrulID/virtual-gamepad/network/members
[stars-shield]: https://img.shields.io/github/stars/FahrulID/virtual-gamepad.svg?style=for-the-badge
[stars-url]: https://github.com/FahrulID/virtual-gamepad/stargazers
[issues-shield]: https://img.shields.io/github/issues/FahrulID/virtual-gamepad.svg?style=for-the-badge
[issues-url]: https://github.com/FahrulID/virtual-gamepad/issues
[license-shield]: https://img.shields.io/github/license/FahrulID/virtual-gamepad.svg?style=for-the-badge
[license-url]: https://github.com/FahrulID/virtual-gamepad/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/fahrul-ramadhan-putra-1914701b0/
[product-screenshot]: others/screenshot.png
