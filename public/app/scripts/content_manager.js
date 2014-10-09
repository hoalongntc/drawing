function ContentManager(KeyboardInputManager, ToolsManager, StateManager) {
    var self = this;
    this.inputManager = KeyboardInputManager;
    this.toolsManager = ToolsManager;
    this.socketManager = SocketManager;
    this.accountManager = AccountManager;
    this.notifyManager = NotifyManager;
    this.fileManager = FileManager;

    this.canvasSize = this.toolsManager.getCanvasSize();
    this.canvas = document.getElementById('main-canvas');
    this.canvas.width = this.canvasSize.width;
    this.canvas.height = this.canvasSize.height;
    this.context = this.canvas.getContext('2d');
    this.stateManager = new StateManager(this.context);
    this.stateManager.clear();

    this.blockDrawing = 0;
    this.blockMessage = '';
    this.defaultBrustStyle = { width: 20, opacity: 0.1, density: 0.03, stabilizeLevel: 8, stabilizeWeight: 0.6 };
    this.defaultBrustStyle.width = this.toolsManager.getWidth();
    this.defaultBrustStyle.color = this.toolsManager.applyColor();
    this.changeTool(this.toolsManager.applySelectedTool());

    this.stateManager.on('drawDone', this.drawBrushDone.bind(this));

    this.isMouseDown = !1;
    this.isParentMouseDown = !1;
    this.inputManager.on('mouseDown', this.mouseDown.bind(this));
    this.inputManager.on('mouseUp', this.mouseUp.bind(this));
    this.inputManager.on('mouseMove', this.mouseMove.bind(this));
    this.inputManager.on('mouseOver', this.mouseOver.bind(this));
    this.inputManager.on('mouseLeave', this.mouseLeave.bind(this));
    this.inputManager.on('parentMouseDown', this.parentMouseDown.bind(this));
    this.inputManager.on('parentMouseUp', this.parentMouseUp.bind(this));

    this.inputManager.on('undo', this.undo.bind(this));
    this.inputManager.on('redo', this.redo.bind(this));
    this.inputManager.on('save', this.save.bind(this));
    this.inputManager.on('download', this.download.bind(this));
    this.inputManager.on('clear', this.clear.bind(this));

    this.toolsManager.on('changeColor', this.changeColor.bind(this));
    this.toolsManager.on('changeTool', this.changeTool.bind(this));
    this.toolsManager.on('changeWidth', this.changeWidth.bind(this));
    this.toolsManager.on('changeCanvasSize', this.changeCanvasSize.bind(this));
    this.toolsManager.on('changeOpacity', this.changeOpacity.bind(this));
    this.toolsManager.on('clear', this.clear.bind(this));
    this.toolsManager.on('download', this.download.bind(this));
    this.toolsManager.on('open', this.initDrawingWithImageDataURL.bind(this));

    this.stateManager.on('setCanvasSize', this.setCanvasSize.bind(this));

    this.socketManager.on('requestInitImage', this.getCurrentImage.bind(this));
    this.socketManager.on('block', this.block.bind(this));
    this.socketManager.on('unblock', this.unblock.bind(this));
    this.socketManager.on('sharingNewImage', this.initDrawingWithImageDataURL.bind(this));
    this.socketManager.on('sharingNewBrush', this.addBrush.bind(this));

    this.accountManager.on('accountInfoUpdated', this.changeAccountInfo.bind(this));

    this.fileManager.on('open', this.initDrawingWithImageDataURL.bind(this));

    this.accountManager.init();
    window.addEventListener('beforeunload', self.save.bind(self));
}

ContentManager.prototype.block = function(reason) {
    this.blockDrawing = 1;
    this.blockMessage = reason;
};
ContentManager.prototype.unblock = function() {
    this.blockDrawing = 0;
    this.blockMessage = '';
};

ContentManager.prototype.mouseDown = function(e) {
    if(e.button != 0) return;
    if(this.blockDrawing) return this.notifyManager.warning(this.blockMessage);

    var x, y;
    if(e.offsetX || e.offsetX == 0) {
        x = e.offsetX; y = e.offsetY;
    } else {
        x = e.layerX - this.canvas.offsetLeft;
        y = e.layerY - this.canvas.offsetTop;
    }
    this.stateManager.down(this.defaultBrustStyle, new Point(x, y));
    this.isMouseDown = 1;
};
ContentManager.prototype.mouseUp = function(e) {
    if(e.button != 0) return;
    if(this.isMouseDown) {
        var x, y;
        if(e.offsetX || e.offsetX == 0) {
            x = e.offsetX; y = e.offsetY;
        } else {
            x = e.layerX - this.canvas.offsetLeft;
            y = e.layerY - this.canvas.offsetTop;
        }
        this.stateManager.up(new Point(x, y));
    }
    this.isMouseDown = 0;
};
ContentManager.prototype.mouseMove = function(e) {
    if(this.isMouseDown) {
        var x, y;
        if(e.offsetX || e.offsetX == 0) {
            x = e.offsetX; y = e.offsetY;
        } else {
            x = e.layerX - this.canvas.offsetLeft;
            y = e.layerY - this.canvas.offsetTop;
        }
        this.stateManager.move(new Point(x, y));
    }
};
ContentManager.prototype.mouseOver = function(e) {
    if(this.isParentMouseDown) {
        if(this.blockDrawing) return this.notifyManager.warning(this.blockMessage);
        this.isMouseDown = 1;
        var x, y;
        if(e.offsetX || e.offsetX == 0) {
            x = e.offsetX; y = e.offsetY;
        } else {
            x = e.layerX - this.canvas.offsetLeft;
            y = e.layerY - this.canvas.offsetTop;
        }
        this.stateManager.down(this.defaultBrustStyle, new Point(x, y));
    }
};
ContentManager.prototype.mouseLeave = function(e) {
    if(this.isMouseDown) {
        var x, y;
        if(e.offsetX || e.offsetX == 0) {
            x = e.offsetX; y = e.offsetY;
        } else {
            x = e.layerX - this.canvas.offsetLeft;
            y = e.layerY - this.canvas.offsetTop;
        }
        this.stateManager.up(new Point(x, y));
    }
    this.isMouseDown = 0;
};

ContentManager.prototype.parentMouseDown = function(e) {
    if(e.button != 0) return;
    this.isParentMouseDown = 1;
};
ContentManager.prototype.parentMouseUp = function(e) {
    if(e.button != 0) return;
    this.isParentMouseDown = 0;
    this.isMouseDown = 0;
};

ContentManager.prototype.changeColor = function(color) {
    this.defaultBrustStyle.color = color;
};
ContentManager.prototype.changeWidth = function(width) {
    this.defaultBrustStyle.width = width;
};
ContentManager.prototype.changeOpacity = function(opacity) {
    this.defaultBrustStyle.opacity = opacity;
};
ContentManager.prototype.setCanvasSize = function(size) {
    this.canvasSize = size;
    this.toolsManager.setCanvasSize(size);
};
ContentManager.prototype.changeCanvasSize = function(size) {
    this.canvasSize = size;
    this.canvas.width = size.width;
    this.canvas.height = size.height;
    this.justdo();
};
ContentManager.prototype.changeTool = function(tool) {
    var self = this;
    if(tool) {
        if(tool.options.opacity)
            self.defaultBrustStyle.opacity = tool.options.opacity;
        self.defaultBrustStyle.density = tool.options.density || 0.03;
        if(tool.options.color)
            self.defaultBrustStyle.color = tool.options.color;
        self.defaultBrustStyle.stabilizeLevel = tool.options.stabilizeLevel || 8;
        self.defaultBrustStyle.stabilizeWeight = tool.options.stabilizeWeight || 0.6;
        if(tool.options.width)
            self.defaultBrustStyle.width = tool.options.width;

        self.defaultBrustStyle.randomize = tool.options.randomize || 0;
        self.defaultBrustStyle.opacityDelta = tool.options.opacityDelta || 0;
        self.defaultBrustStyle.rotation = tool.options.rotation || 0;
        self.defaultBrustStyle.widthMin = tool.options.widthMin || 1;
        self.defaultBrustStyle.widthDelta = tool.options.widthDelta || 0;

        self.defaultBrustStyle.image = tool.brush;
    }
};
ContentManager.prototype.download = function(e) {
    this.context.canvas.toBlob(function(blob) {
        window.saveAs(blob, 'paint.png');
    });
};

ContentManager.prototype.undo = function() {
    if(this.blockDrawing) return this.notifyManager.warning(this.blockMessage);
    if(this.socketManager.isSharing()) return this.notifyManager.warning('Undo is disabled on sharing mode');

    this.stateManager.undo();
};
ContentManager.prototype.redo = function() {
    if(this.blockDrawing) return this.notifyManager.warning(this.blockMessage);
    if(this.socketManager.isSharing()) return this.notifyManager.warning('Redo is disabled on sharing mode');
    this.stateManager.redo();
};
ContentManager.prototype.justdo = function() {
    this.stateManager.fillBackground();
    this.stateManager.justdo();
};

ContentManager.prototype.clear = function() {
    if(this.blockDrawing) return this.notifyManager.warning(this.blockMessage);
    if(this.socketManager.isSharing()) return this.notifyManager.warning('Clear painting is disabled on sharing mode');
    if(!confirm('Are you sure you want to clear current painting?')) return;
    this.stateManager.clear();
};
ContentManager.prototype.save = function(e) {
    this.stateManager.save();
    if(e) return e.returnValue = "Your painting may lost!";
    return "Your painting may lost!";
};

ContentManager.prototype.getCurrentImage = function(done) {
    done(this.context.canvas.toDataURL('image/png'));
};
ContentManager.prototype.initDrawingWithImageDataURL = function(imageDataURL) {
    this.stateManager.clear();
    this.stateManager.init(imageDataURL);
    this.unblock();
};
ContentManager.prototype.drawBrushDone = function(brushOptions) {
    if(this.socketManager.isSharing())
        this.socketManager.broadcastNewBrush(brushOptions);
};
ContentManager.prototype.addBrush = function(brushOptions) {
    this.stateManager.add(brushOptions);
};

ContentManager.prototype.changeAccountInfo = function(info) {
    if(info) {
        this.toolsManager.setAccountPicture(info.picture);
        this.toolsManager.setAccountStatus(true);

        this.socketManager.identify(info);
    } else {
        this.toolsManager.setAccountPicture(null);
        this.toolsManager.setAccountStatus(false);

        this.socketManager.unIdentify();
    }
};
