KeyboardInputManager = new function() {
    this.events = {};

    if (window.navigator.msPointerEnabled) {
        //Internet Explorer 10 style
        this.eventTouchstart = "MSPointerDown";
        this.eventTouchmove = "MSPointerMove";
        this.eventTouchend = "MSPointerUp";
    } else {
        this.eventTouchstart = "touchstart";
        this.eventTouchmove = "touchmove";
        this.eventTouchend = "touchend";
    }

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
    this.bindPress = function (selector, fn) {
        var button = document.querySelector(selector);
        button.addEventListener("click", fn.bind(this));
        button.addEventListener(this.eventTouchend, fn.bind(this));
    };
    this.listen = function () {
        var self = this;

        var map = {
            38: 0, // Up
            39: 1, // Right
            40: 2, // Down
            37: 3, // Left
            75: 0, // Vim up
            76: 1, // Vim right
            74: 2, // Vim down
            72: 3, // Vim left
            87: 0, // W
            68: 1, // D
            83: 2, // S
            65: 3  // A
        };

        // Respond to direction keys
        document.addEventListener("keydown", function (e) {
            var c = e.ctrlKey, m = e.metaKey;
            if(/Mac/i.test(navigator.userAgent)) {
                c = e.metaKey;
                m = e.ctrlKey;
            }

            var ctrl = c;
            var ctrlShift = c || e.shiftKey;
            var altMeta = e.altKey || m;
            var altShiftMeta = e.altKey || m || e.shiftKey;
            var all = c || m || e.altKey || e.shiftKey;

            if(ctrl && !altShiftMeta) { // Ctrl Z
                if(e.keyCode == 90) {
                    e.preventDefault();
                    return self.emit('undo');
                } // Z - Undo
                if(e.keyCode == 83) {
                    e.preventDefault();
                    return self.emit('save');
                } // S - Save
                if(e.keyCode == 68) {
                    e.preventDefault();
                    return self.emit('download');
                } // D - Download
                if(e.keyCode == 88) {
                    e.preventDefault();
                    self.emit('clear');
                    return false;
                } // X - Clear
            } else if(ctrlShift && !altMeta && e.keyCode == 90) {
                self.emit('redo');
            } else if(!all) {
                if(e.keyCode == 66) return ToolsManager.selectTool('tool-brush'); //B
                if(e.keyCode == 77) return ToolsManager.selectTool('tool-marker'); //M
                if(e.keyCode == 72) return ToolsManager.selectTool('tool-highlighter'); //H
                if(e.keyCode == 80) return ToolsManager.selectTool('tool-pencil'); //P
                if(e.keyCode == 67) return ToolsManager.selectTool('tool-crayon'); //C
                if(e.keyCode == 69) return ToolsManager.selectTool('tool-eraser'); //E
            }
        });

        document.addEventListener('mousedown', function(e) {
            self.emit('parentMouseDown', e);
        });

        document.addEventListener('mouseup', function(e) {
            self.emit('parentMouseUp', e);
        });


        var container = document.getElementById("main-canvas");

        container.addEventListener('mousedown', function(event) {
            self.emit('mouseDown', event);
        });
        container.addEventListener('mousemove', function(event) {
            self.emit('mouseMove', event);
        });
        container.addEventListener('mouseup', function(event) {
            self.emit('mouseUp', event);
        });
        container.addEventListener('mouseover', function(event) {
            self.emit('mouseOver', event);
        });
        container.addEventListener('mouseleave', function(event) {
            self.emit('mouseLeave', event);
        });
    };

    this.listen();
};
