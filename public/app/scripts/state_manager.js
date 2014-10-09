function StateManager(Context) {
    this.events = {};
    this.on = function (event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    };
    this.emit = function (event, data) {
        var callbacks = this.events[event];
        if (callbacks) {
            callbacks.forEach(function (callback) {
                callback(data);
            });
        }
    };

    var self = this;
    this.brushes = [];
    this.currentBrush = -1;
    this.maxBrush = 30;
    this.context = Context;
    this.savedImage = null;

    //-- init, get old data and draw it back
    this.init = function(initDataURL) {
        if(!StorageManager.isLocalStorageSupported) return;
        if(this.context) {
            var _savedDataURL = initDataURL || StorageManager.getItem('html5-drawing-image');
            if(_savedDataURL) {
                var img = new Image();
                img.onload = function() {
                    self.context.canvas.width = img.width;
                    self.context.canvas.height = img.height;
                    self.context.drawImage(img, 0, 0);
                    self.savedImage = img;
                    self.emit('setCanvasSize', {width: img.width, height: img.height});
                };
                img.src = _savedDataURL;
            }
        }
    };
    this.save = function() {
        if(!StorageManager.isLocalStorageSupported) return;
        StorageManager.setItem('html5-drawing-image', this.context.canvas.toDataURL('image/png'));

        var sharingInfo = SocketManager.getSharingInfo();
        if(sharingInfo.sharing) {
            StorageManager.setItem('html5-drawing-shared-key', sharingInfo.sharingKey || sharingInfo.sharedKey);
        } else {
            StorageManager.removeItem('html5-drawing-shared-key');
        }
    };
    this.init();
}

StateManager.prototype.setContext = function(context) {
    this.context = context;
};

StateManager.prototype.getContext = function() {
    return this.context;
};

StateManager.prototype.firstDrawDone = function(id, context) {
    this.brushes[id].isDone = 1;
    this.brushes[id].imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    this.emit('drawDone', this.brushes[id].brush.clone());
};

StateManager.prototype.secondDrawDone = function(id, context) {
    this.brushes[id].isDone = 1;
};

StateManager.prototype.down = function(brushOptions, point) {
    var self = this;

    if(this.currentBrush < this.brushes.length - 1) { // Disable redo
        if(this.brushes.length > 0) {
            this.brushes.splice(this.currentBrush + 1, this.brushes.length - this.currentBrush - 1);
            this.currentBrush = this.brushes.length - 1;
        }
    }
    if(this.brushes.length > this.maxBrush) {
        this.brushes.splice(0, this.brushes.length - this.maxBrush);
        this.currentBrush = this.brushes.length - 1;
    }

    brushOptions.id = ++self.currentBrush;
    var brush = new Brush(brushOptions, self.firstDrawDone.bind(self));
    brush.setContext(this.context);
    this.brushes.push({brush: brush, isDone: 0});
    this.brushes[this.currentBrush].brush.down(point);
};

StateManager.prototype.move = function(point) {
    this.brushes[this.currentBrush].brush.move(point);
};

StateManager.prototype.up = function(point) {
    this.brushes[this.currentBrush].brush.up(point);
};

StateManager.prototype.add = function(brushOptions) {
    var self = this;

    if(this.currentBrush < this.brushes.length - 1) { // Disable redo
        if(this.brushes.length > 0) {
            this.brushes.splice(this.currentBrush + 1, this.brushes.length - this.currentBrush - 1);
            this.currentBrush = this.brushes.length - 1;
        }
    }
    if(this.brushes.length > this.maxBrush) {
        this.brushes.splice(0, this.brushes.length - this.maxBrush);
        this.currentBrush = this.brushes.length - 1;
    }

    brushOptions.id = ++self.currentBrush;
    var brush = new Brush(brushOptions, self.secondDrawDone.bind(self));
    brush.setContext(this.context);
    this.brushes.push({brush: brush, isDone: 0});
    this.brushes[this.currentBrush].brush.draw();
};

StateManager.prototype.cloneAndClear = function(dstContext) {
    var self = this;
    var id = self.currentBrush;
    var loop = window.setInterval(function() {
        if(!self.brushes[id]) return window.clearInterval(loop);
        if(self.brushes[id].isDone) {
            window.clearInterval(loop);
            self.context.clearRect(0, 0, self.context.canvas.width, self.context.canvas.height);
            self.brushes[id].isDone = 0;
            self.brushes[id].brush.onDone = self.secondDrawDone.bind(self);
            self.brushes[id].brush.draw(dstContext);
        }
    }, 20);
};

StateManager.prototype.undo = function() {
    var self = this;
    if(self.currentBrush < 0) return; // Nothing to undo
    var id = self.currentBrush;
    var loop = window.setInterval(function() {
        if(!self.brushes[id]) return window.clearInterval(loop);
        if(self.brushes[id].isDone) {
            window.clearInterval(loop);
            self.currentBrush = id - 1;
            if(self.currentBrush < 0) {
                if(self.savedImage)
                    self.context.drawImage(self.savedImage, 0, 0);
                else
                    self.context.clearRect(0, 0, self.context.canvas.width, self.context.canvas.height);
            } else {
                self.context.putImageData(self.brushes[id -1].imageData, 0, 0);
            }
        }
    }, 20);
};

StateManager.prototype.redo = function() {
    var self = this;
    if(self.currentBrush == self.brushes.length - 1) return; // Nothing to redo
    var id = self.currentBrush;
    var loop = window.setInterval(function() {
        if(!self.brushes[id]) return window.clearInterval(loop);
        if((id > -1 && self.brushes[id].isDone) || id < 0) {
            window.clearInterval(loop);
            self.currentBrush = id + 1;
            self.context.clearRect(0, 0, self.context.canvas.width, self.context.canvas.height);
            self.context.putImageData(self.brushes[id + 1].imageData, 0, 0);
        }
    }, 20);
};

StateManager.prototype.justdo = function() {
    var self = this;
    if(self.currentBrush < 0 && self.savedImage) return self.context.drawImage(self.savedImage, 0, 0);
    var id = self.currentBrush;
    var loop = window.setInterval(function() {
        if(!self.brushes[id]) return window.clearInterval(loop);
        if(self.brushes[id].isDone) {
            window.clearInterval(loop);
            self.context.putImageData(self.brushes[id].imageData, 0, 0, 0, 0, self.brushes[id].imageData.width, self.brushes[id].imageData.height);
        }
    }, 20);
};

StateManager.prototype.fillBackground = function() {
    this.context.fillStyle = '#FFF';
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
};

StateManager.prototype.clear = function() {
    if(this.brushes.length > 1) {
        this.brushes = null;
        this.brushes = [];
    }
    this.currentBrush = -1;
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.fillBackground();
    this.savedImage = null;
};