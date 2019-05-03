/** 
index.js

This is the main javascript for the web app.
Please see the README.md file to find out how to use
the web app. 

It was inspired by the emoji scavenger hunt google project (see CREDITS below).
The emoji savenger hunt however was written in typscript. I modified the code so it
could run with raw/vanilla javascript. (Thank you  to the dev team of the
emoji scavenger hunt for answering my questions regarding their app). 

In the  original, the game tasked the user to look for an emoji. When an object
was matched with an emoji, a point was scored so the camera had to keep panning around
in search of an emoji-like object.


The logic in this script is different. The camera is targeted at the 
same image (of a fracture) and persistently takes image data frame by frame in real time.
I devised a scoring system (a sort of 'final layer' for the algorithm written in javascript) 
that runs on top of the machine learning algorithm originally trained in python 
(converted for the web with tensorflowjs).
The scoring system I devised is based on my own experience as a radiologist.




CREDITS:
inspired by code from 
https://github.com/google/emoji-scavenger-hunt under the APACHE 2.0 License





AUTHOR OF CURRENT CODE: Erwin John T. Carpio

 Copyright 2019 ERWIN JOHN T. CARPIO

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
**/





document.addEventListener("DOMContentLoaded", function () {

    let showMenu = (function () {

        // variables

        // cache dom
        let header__burger = document.querySelector("#header__burger");
        let menu_exit = document.querySelector("#menu_exit");
        let dimmer = document.querySelector('#dimmer');

        // bind dom
        header__burger.addEventListener('click', function () {
            menu.classList.remove('menu--hide');
            dimmer.classList.remove('dimmer--hide');
        });

        // functions

        // render function

        // API

    })();


    let hideMenu = (function () {

        // variables

        // cache dom
        let menu = document.querySelector('#menu');
        let menu_exit = menu.querySelector("#menu_exit");
        let dimmer = document.querySelector('#dimmer');

        // bind dom
        menu_exit.addEventListener('click', function () {
            menu.classList.add('menu--hide');
            dimmer.classList.add('dimmer--hide');
        });

        dimmer.addEventListener('click', function () {
            menu.classList.add('menu--hide');
            dimmer.classList.add('dimmer--hide');
        });

        // functions

        // render function

        // API

    })();

    let toggleShare = (function () {

        // var

        // cache dom
        let shareIcon = document.querySelector("#shareIcon");
        let shareBtns = document.querySelector("#share__btns");

        // bind dom
        shareIcon.addEventListener("click", function () {
            shareBtns.classList.toggle("share__btns--hidden");
        });

        // functions

        // render

        // API

    })();


    let errors = document.getElementById("errors");
    errors.innerHTML = 'Error log';

    let errorTracker = (function () {

        // cache dom
        let errors = document.getElementById("errors");

        // bind dom
        window.onerror = function (message, url, lineNo) {
            console.log('Error: ' + message + '\n' + 'Line Number: ' + lineNo);
            errors.innerHTML += 'Error: ' + message + '\n' + 'Line Number: ' + lineNo;
            return true;
        };
    })();


    document.api = {};

    // let isPredicting = false;

    let switchOn = (function () {

        // vars

        // cache dom
        let gfab = document.querySelector("#gfab");
        let header = document.querySelector("#header");
        let fractureType = document.querySelector("#fracture");

        // bind dom
        gfab.addEventListener('click', function () {
            gfab.classList.toggle("gfab-active");
            document.api.toggleWebCam();
            document.api.toggleAi();
            header.classList.toggle("header--hide");
        });

        // functions

        // render functions

        function render() {}

        // API

    })();

    let toggleDebug = (function () {

        // var

        // cache dom
        let debug = document.querySelector('#debug');
        let fps = document.querySelector('#fps');
        let errors = document.querySelector('#errors');

        // bind dom
        debug.addEventListener("click", function () {
            fps.classList.toggle("fps--hide");
            errors.classList.toggle("errors--hide");
        });

        // functions

        // render

        // API

    })();


    // capture web cam and put in video element

    let webCamElement = (function () {

        // variables

        // cache dom
        let video = document.querySelector("#videoElement");
        let gfab = document.querySelector("#gfab");
        let fractureType = document.querySelector("#fracture");
        let localStream = null;

        // functions
        video.height = document.documentElement.clientHeight;
        video.width = document.documentElement.clientWidth;

        window.addEventListener("resize", function () {
            video.height = document.documentElement.clientHeight;
            video.width = document.documentElement.clientWidth;
        });

        function resetPrediction() {
            fractureType.innerHTML = "<p>Thinking...</p>";
        }

        function camToTag() {

            // FROM https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia

            // START the polyfill for webRTC and media devices get user media            

            // Older browsers might not implement mediaDevices at all, so we set an empty object first
            if (navigator.mediaDevices === undefined) {
                navigator.mediaDevices = {};
            }

            // Some browsers partially implement mediaDevices. We can't just assign an object
            // with getUserMedia as it would overwrite existing properties.
            // Here, we will just add the getUserMedia property if it's missing.
            if (navigator.mediaDevices.getUserMedia === undefined) {
                navigator.mediaDevices.getUserMedia = function (constraints) {

                    // First get ahold of the legacy getUserMedia, if present
                    var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

                    // var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

                    // Some browsers just don't implement it - return a rejected promise with an error
                    // to keep a consistent interface
                    if (!getUserMedia) {
                        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                    }

                    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
                    return new Promise(function (resolve, reject) {
                        getUserMedia.call(navigator, constraints, resolve, reject);
                    });
                }
            }

            // END the polyfill for webRTC and media devices get user media


            var constraints = {
                audio: false,
                video: {
                    facingMode: "environment"
                }
            }

            navigator.mediaDevices.getUserMedia(constraints)
                .then(function (mediaStream) {
                    video.srcObject = mediaStream;
                    video.onloadedmetadata = function (e) {
                        video.play();
                    };
                    localStream = mediaStream;
                })
                .catch(function (err) {
                    console.log(err.name + ": " + err.message);
                    alert("error");
                }); // always check for errors at the end.
        }




        function camOffTag() {
            video.pause();
            video.src = "";
            if (localStream === null || localStream === undefined) {
                return;
            } else {
                localStream.getTracks()[0].stop();
                console.log("Vid off");
            }
        }

        // render function

        function render() {
            console.log('api running');
            gfab = null;
            gfab = document.querySelector("#gfab");
            if (gfab.classList.contains("gfab-active")) {
                resetPrediction();
                camToTag();
            } else {
                camOffTag();
            }
        }

        render();

        // API

        document.api.toggleWebCam = render;

    })();



    // The use of tensorflow js to extracte a tensor using fromPixels required me to study the
    // code for the Emoji scavenger hunt at https://github.com/google/emoji-scavenger-hunt/
    // The initial web app used typescript. Parts of the code had to be re-written so it could work as 
    // raw/vanilla javascript.

    // for the webcam to produce tensor
    class Webcam {
        // class Webcam {

        /**
         * @param {HTMLVideoElement} webcamElement A HTMLVideoElement representing the webcam feed.
         */
        constructor(webcamElement) {
            this.webcamElement = webcamElement;
        }

        /**
         * Captures a frame from the webcam and normalizes it between -1 and 1.
         * Returns a batched image (1-element batch) of shape [1, w, h, c].
         */
        capture() {
            console.log('running ES6 CLASSES')

            return tf.tidy(() => {
                // Reads the image as a Tensor from the webcam <video> element.
                // const webcamImage = tf.fromPixels(this.webcamElement); Older API replaced by the tf.browser name space
                const webcamImage = tf.browser.fromPixels(this.webcamElement);


                // Crop the image so we're using the center square of the rectangular
                // webcam.
                const croppedImage = this.cropImage224(webcamImage);

                // Expand the outer most dimension so we have a batch size of 1.

                const batchedImage = croppedImage.expandDims(0);
                // const batchedImage = croppedImage;

                // Normalize the image between -1 and 1. The image comes in between 0-255,
                // so we divide by 127 and subtract 1.
                return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
            });
        }

        /**
         * Crops an image tensor so we get a square image with no white space.
         * @param {Tensor4D} img An input image Tensor to crop.
         */
        cropImage(img) {
            const size = Math.min(img.shape[0], img.shape[1]);
            const centerHeight = img.shape[0] / 2;
            const beginHeight = centerHeight - (size / 2);
            const centerWidth = img.shape[1] / 2;
            const beginWidth = centerWidth - (size / 2);
            return img.slice([beginHeight, beginWidth, 0], [size, size, 3]);
        }

        // rewrite cropImage for 224 pixels
        cropImage224(img) {
            // const size = Math.min(img.shape[0], img.shape[1]);
            const centerHeight = img.shape[0] / 2;
            const beginHeight = centerHeight - (224 / 2);
            const centerWidth = img.shape[1] / 2;
            const beginWidth = centerWidth - (224 / 2);
            return img.slice([beginHeight, beginWidth, 0], [224, 224, 3]);
        }


        /**
         * Adjusts the video size so we can make a centered square crop without
         * including whitespace.
         * @param {number} width The real width of the video element.
         * @param {number} height The real height of the video element.
         */
        adjustVideoSize(width, height) {
            const aspectRatio = width / height;
            if (width >= height) {
                this.webcamElement.width = aspectRatio * this.webcamElement.height;
            } else if (width < height) {
                this.webcamElement.height = this.webcamElement.width / aspectRatio;
            }
        }

        async setup() {
            return new Promise((resolve, reject) => {
                const navigatorAny = navigator;
                navigator.getUserMedia = navigator.getUserMedia ||
                    navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
                    navigatorAny.msGetUserMedia;
                if (navigator.getUserMedia) {
                    navigator.getUserMedia({
                            video: true
                        },
                        stream => {
                            this.webcamElement.srcObject = stream;
                            this.webcamElement.addEventListener('loadeddata', async () => {
                                this.adjustVideoSize(
                                    this.webcamElement.videoWidth,
                                    this.webcamElement.videoHeight);
                                resolve();
                            }, false);
                        },
                        error => {
                            document.querySelector('#no-webcam').style.display = 'block';
                        });
                } else {
                    reject();
                }
            });
        }
    }

    const webcam = new Webcam(document.getElementById('videoElement'));

    // loading AND RUNNING the model
    let loadRunModel = (function () {

        // set variables

        // cache dom
        let splash = document.querySelector('#splash');
        let fps = document.querySelector('#fps');

        // functions
        async function kerasMod() {
            // const model = await tf.loadModel('./kerasModel/model.json'); Older API replaced by the tf.loadLayersModel name space
            const model = await tf.loadLayersModel('./kerasModel/model.json', {
                strict: false
            });

            console.log('model loaded');

            splash.classList.add('splash__out');

            let predictStaticImage = (function () {

                // set variables

                //cache dom

                // functions

                function predictImage() {
                    // const pic = tf.fromPixels(document.querySelector("#pic")); // Older API replaced by the tf.browser name space
                    const pic = tf.browser.fromPixels(document.querySelector("#pic")); // for example

                    const picE = pic.expandDims(0);
                    const picF = picE.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
                    console.log(picE);
                    console.log(picF);
                    const prediction = model.predict(picF);

                    model.predict(picF).print();

                }
                // render function
                function render() {
                    predictImage();
                }

                // render();

                // API

            })();


            let predictWebCam = (function () {
                // set variables
                let isPredicting = false;
                let galeazziScore = 0;
                let monteggiaScore = 0;

                // cache dom
                let fractureType = document.querySelector("#fracture");
                let gfab = document.querySelector("#gfab");

                // functions

                async function webcamPredictionLoop() {
                    //   THE LOOP FOR LOGGIN PREDICTIONS

                    while (isPredicting) {

                        console.log("predicting");

                        const predictedClass = tf.tidy(() => {
                            const img = webcam.capture();
                            let errors = document.getElementById("errors");
                            errors.innerHTML = 'webcam captures <br>';

                            const predictions = model.predict(img);

                            errors.innerHTML += 'model predicts <br>';

                            const info = predictions.as1D();
                            errors.innerHTML += 'info is 1D <br>';
                            // const ftype = predictions.as1D().argMax(); only if I want the the hightest prediction. 
                            return info;
                        });

                        let galeazziGuess = (await predictedClass.data())[0];
                        let monteggiaGuess = (await predictedClass.data())[1];

                        // for only the monteggia and galeazzi scores in Real Time.
                        fps.innerHTML = "monteggia probability: " + monteggiaGuess + "<br>" + "galeazzi probability: " + galeazziGuess + "<br>";

           
                        // The scoring sytem I devised for the galeazzi and monteggia fractures.
                        if (galeazziGuess > 0.45 && monteggiaGuess < 0.6) {
                            galeazziScore += 1;
                            if (monteggiaScore <= 0) {
                                monteggiaScore = 0;
                            } else {
                                monteggiaScore -= 1;
                            }
                            console.log('monteggia  guess: ' + monteggiaGuess);
                            console.log('galeazzi guess: ' + galeazziGuess);
                            console.log('galeazziScore: ' + galeazziScore);
                        } else if (galeazziGuess < 0.45 && monteggiaGuess > 0.6) {
                            monteggiaScore += 1;
                            if (galeazziScore <= 0) {
                                galeazziScore = 0;
                            } else {
                                galeazziScore -= 1;
                            }
                            console.log('monteggia  guess: ' + monteggiaGuess);
                            console.log('galeazzi guess: ' + galeazziGuess);
                            console.log('monteggiaScore: ' + monteggiaScore);
                        } else {
                            fractureType.innerHTML = '<p>Thinking...</p> ';
                        }

                        if (galeazziScore > 50 && galeazziScore > monteggiaScore) {
                            fractureType.innerHTML = '<p>Is that a <a href="https://www.google.com.ph/search?q=galeazzi+fracture&source=lnms&tbm=isch">Galeazzi fracture</a> ?</p> ';
                            console.log('galeazziScore: ' + galeazziScore);
                            console.log('monteggiaScore: ' + monteggiaScore);
                            galeazziScore = 0;
                            monteggiaScore = 0;
                            gfab.click();
                        } else if (monteggiaScore > 50 && monteggiaScore > galeazziScore) {
                            fractureType.innerHTML = '<p>Is that a <a href="https://www.google.com.ph/search?q=monteggia+fracture&source=lnms&tbm=isch">Monteggia fracture</a> ?</p> ';
                            console.log('galeazziScore: ' + galeazziScore);
                            console.log('monteggiaScore: ' + monteggiaScore);
                            galeazziScore = 0;
                            monteggiaScore = 0;
                            gfab.click();
                        }

                        await tf.nextFrame();
                    }
                }

                // render
                function render() {
                    if (gfab.classList.contains("gfab-active")) {
                        isPredicting = true;
                    } else {
                        isPredicting = false;
                    }
                    webcamPredictionLoop();
                }

                render();

                // API
                document.api.toggleAi = render;
                console.log(document.api);
            })();
        }


        // render function
        function render() {
            kerasMod();
        }

        render();

        // API

    })();

});