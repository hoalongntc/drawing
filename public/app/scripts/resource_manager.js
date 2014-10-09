ResourceManager = new function() {
    var self = this;

    this.images = {
        'images/brushes/3.png': null,
        'images/brushes/4.png': null,
        'images/brushes/6.png': null,
        'images/brushes/7.png': null,
        'images/brushes/9.png': null,
        'images/brushes/81.png': null
    };

    this.audios = {
        'audios/Glass.wav': null,
        'audios/Ping.wav': null,
        'audios/Purr.wav': null
    };

    this.totalResources = 9;
    this.resourceCount = 0;

    this.isReady = function() {
        return this.resourceCount >= this.totalResources;
    };

    function allDone() {
        window.setTimeout(function() {
            document.getElementById('loader-wrapper').classList.add('disabled');
        }, 1000);
    }
    function resourceLoadDone(e) {
        self.resourceCount++;
        if(self.resourceCount >= self.totalResources) allDone();
    }
    function loadAllResource() {
        for(var image in self.images) {
            if(self.images.hasOwnProperty(image)) {
                var img = new Image();
                img.addEventListener('load', resourceLoadDone, false);
                img.src = image;
                self.images[image] = img;
            }
        }


        for(var audio in self.audios) {
            if(self.audios.hasOwnProperty(audio)) {
                var au = new Audio(audio);
                au.addEventListener('canplay', resourceLoadDone, false);
                self.audios[audio] = au;
            }
        }
    }
    loadAllResource();
};