ToolsManager = new function () {
    var self = this;
    self.events = {};
    self.on = function (event, callback) {
        if (!self.events[event]) {
            self.events[event] = [];
        }
        self.events[event].push(callback);
    };
    self.emit = function (event, data) {
        var callbacks = self.events[event];
        if (callbacks) {
            callbacks.forEach(function (callback) {
                callback(data);
            });
        }
    };

    /* Colors */
    var colorExt = document.getElementById('color-extend');
    var colorExtOpen = document.getElementById('color-extend-open');
    var colorExtClose = document.getElementById('color-extend-close');

    colorExtOpen.addEventListener('click', function() {
        colorExt.classList.remove('hide');
    });
    colorExtClose.addEventListener('click', function() {
        colorExt.classList.add('hide');
    });

    var colors = [
        { color: '#1abc9c', border: '#16a085', name: 'turquoise' },// { color: '#16a085', name: 'green-sea' },
        { color: '#2ecc71', border: '#27ae60', name: 'emerald' },// { color: '#27ae60', name: 'nephritis' },
        { color: '#3498db', border: '#2980b9', name: 'peter-river' },// { color: '#2980b9', name: 'belize-hole' },
        { color: '#9b59b6', border: '#8e44ad', name: 'amethyst' },// { color: '#8e44ad', name: 'wisteria' },
        { color: '#34495e', border: '#202B3C', name: 'wet-asphalt' },// { color: '#2c3e50', name: 'midnight-blue' },
        { color: '#f1c40f', border: '#f39c12', name: 'sun-flower' },// { color: '#f39c12', name: 'orange' },
        { color: '#e67e22', border: '#d35400', name: 'carrot' },// { color: '#d35400', name: 'pumpkin' },
        { color: '#e74c3c', border: '#c0392b', name: 'alizarin' },// { color: '#c0392b', name: 'pomegranate' },
        { color: '#ecf0f1', border: '#bdc3c7', name: 'clouds' },// { color: '#bdc3c7', name: 'silver' },
        { color: '#95a5a6', border: '#7f8c8d', name: 'concrete' },// { color: '#7f8c8d', name: 'asbestos' },
        { color: '#000000', border: '#ffffff', name: 'black', active: 1 },
        { color: '#ffffff', border: '#7f8c8d', name: 'white' }
    ];
    var colorsExt = [
        {color: '#D24D57', name: 'Chestnut Rose', border: '#D24D57'},
        {color: '#F22613', name: 'Pomegranate', border: '#F22613'},
        {color: '#FF0000', name: 'Red', border: '#FF0000'},
        {color: '#D91E18', name: 'Thunderbird', border: '#D91E18'},
        {color: '#96281B', name: 'Old Brick', border: '#96281B'},
        {color: '#EF4836', name: 'Flamingo', border: '#EF4836'},
        {color: '#D64541', name: 'Valencia', border: '#D64541'},
        {color: '#C0392B', name: 'Tall Poppy', border: '#C0392B'},
        {color: '#CF000F', name: 'Monza', border: '#CF000F'},
        {color: '#E74C3C', name: 'Cinnabar', border: '#E74C3C'},
        {color: '#DB0A5B', name: 'Razzmatazz', border: '#DB0A5B'},
        {color: '#FFECDB', name: 'Derby', border: '#FFECDB'},
        {color: '#F64747', name: 'Sunset Orange', border: '#F64747'},
        {color: '#F1A9A0', name: 'Wax Flower', border: '#F1A9A0'},
        {color: '#D2527F', name: 'Cabaret', border: '#D2527F'},
        {color: '#E08283', name: 'New York Pink', border: '#E08283'},
        {color: '#F62459', name: 'Radical Red', border: '#F62459'},
        {color: '#E26A6A', name: 'Sunglo', border: '#E26A6A'},
        {color: '#DCC6E0', name: 'Snuff', border: '#DCC6E0'},
        {color: '#663399', name: 'Rebeccapurple', border: '#663399'},
        {color: '#674172', name: 'Honey Flower', border: '#674172'},
        {color: '#AEA8D3', name: 'Wistful', border: '#AEA8D3'},
        {color: '#913D88', name: 'Plum', border: '#913D88'},
        {color: '#9A12B3', name: 'Seance', border: '#9A12B3'},
        {color: '#BF55EC', name: 'Medium Purple', border: '#BF55EC'},
        {color: '#BE90D4', name: 'Light Wisteria', border: '#BE90D4'},
        {color: '#8E44AD', name: 'Studio', border: '#8E44AD'},
        {color: '#9B59B6', name: 'Wisteria', border: '#9B59B6'},
        {color: '#E4F1FE', name: 'Alice Blue', border: '#E4F1FE'},
        {color: '#4183D7', name: 'Royal Blue', border: '#4183D7'},
        {color: '#59ABE3', name: 'Picton Blue', border: '#59ABE3'},
        {color: '#81CFE0', name: 'Spray', border: '#81CFE0'},
        {color: '#52B3D9', name: 'Shakespeare', border: '#52B3D9'},
        {color: '#C5EFF7', name: 'Humming Bird', border: '#C5EFF7'},
        {color: '#22A7F0', name: 'Picton Blue', border: '#22A7F0'},
        {color: '#3498DB', name: 'Curious Blue', border: '#3498DB'},
        {color: '#2C3E50', name: 'Madison', border: '#2C3E50'},
        {color: '#19B5FE', name: 'Dodger Blue', border: '#19B5FE'},
        {color: '#336E7B', name: 'Ming', border: '#336E7B'},
        {color: '#22313F', name: 'Ebony Clay', border: '#22313F'},
        {color: '#6BB9F0', name: 'Malibu', border: '#6BB9F0'},
        {color: '#1E8BC3', name: 'Curious Blue', border: '#1E8BC3'},
        {color: '#3A539B', name: 'Chambray', border: '#3A539B'},
        {color: '#34495E', name: 'Pickled Bluewood', border: '#34495E'},
        {color: '#67809F', name: 'Hoki', border: '#67809F'},
        {color: '#2574A9', name: 'Jelly Bean', border: '#2574A9'},
        {color: '#1F3A93', name: 'Jacksons Purple', border: '#1F3A93'},
        {color: '#89C4F4', name: 'Jordy Blue', border: '#89C4F4'},
        {color: '#4B77BE', name: 'Steel Blue', border: '#4B77BE'},
        {color: '#5C97BF', name: 'Fountain Blue', border: '#5C97BF'},
        {color: '#A2DED0', name: 'Aqua Island', border: '#A2DED0'},
        {color: '#87D37C', name: 'Gossip', border: '#87D37C'},
        {color: '#90C695', name: 'Dark Sea Green', border: '#90C695'},
        {color: '#26A65B', name: 'Eucalyptus', border: '#26A65B'},
        {color: '#03C9A9', name: 'Caribbean Green', border: '#03C9A9'},
        {color: '#68C3A3', name: 'Silver Tree', border: '#68C3A3'},
        {color: '#65C6BB', name: 'Downy', border: '#65C6BB'},
        {color: '#1BBC9B', name: 'Mountain Meadow', border: '#1BBC9B'},
        {color: '#1BA39C', name: 'Light Sea Green', border: '#1BA39C'},
        {color: '#66CC99', name: 'Medium Aquamarine', border: '#66CC99'},
        {color: '#36D7B7', name: 'Turquoise', border: '#36D7B7'},
        {color: '#C8F7C5', name: 'Madang', border: '#C8F7C5'},
        {color: '#86E2D5', name: 'Riptide', border: '#86E2D5'},
        {color: '#2ECC71', name: 'Shamrock', border: '#2ECC71'},
        {color: '#16A085', name: 'Mountain Meadow', border: '#16A085'},
        {color: '#3FC380', name: 'Emerald', border: '#3FC380'},
        {color: '#019875', name: 'Green Haze', border: '#019875'},
        {color: '#03A678', name: 'Free Speech Aquamarine', border: '#03A678'},
        {color: '#4DAF7C', name: 'Ocean Green', border: '#4DAF7C'},
        {color: '#2ABB9B', name: 'Jungle Green', border: '#2ABB9B'},
        {color: '#00B16A', name: 'Jade', border: '#00B16A'},
        {color: '#1E824C', name: 'Salem', border: '#1E824C'},
        {color: '#049372', name: 'Observatory', border: '#049372'},
        {color: '#26C281', name: 'Jungle Green', border: '#26C281'},
        {color: '#F5D76E', name: 'Cream Can', border: '#F5D76E'},
        {color: '#F7CA18', name: 'Ripe Lemon', border: '#F7CA18'},
        {color: '#F4D03F', name: 'Saffron', border: '#F4D03F'},
        {color: '#FDE3A7', name: 'Cape Honey', border: '#FDE3A7'},
        {color: '#F89406', name: 'California', border: '#F89406'},
        {color: '#EB9532', name: 'Fire Bush', border: '#EB9532'},
        {color: '#E87E04', name: 'Tahiti Gold', border: '#E87E04'},
        {color: '#F4B350', name: 'Casablanca', border: '#F4B350'},
        {color: '#F2784B', name: 'Crusta', border: '#F2784B'},
        {color: '#EB974E', name: 'Jaffa', border: '#EB974E'},
        {color: '#F5AB35', name: 'Lightning Yellow', border: '#F5AB35'},
        {color: '#D35400', name: 'Burnt Orange', border: '#D35400'},
        {color: '#F39C12', name: 'Buttercup', border: '#F39C12'},
        {color: '#F9690E', name: 'Ecstasy', border: '#F9690E'},
        {color: '#F9BF3B', name: 'Sandstorm', border: '#F9BF3B'},
        {color: '#F27935', name: 'Jaffa', border: '#F27935'},
        {color: '#E67E22', name: 'Zest', border: '#E67E22'},
        {color: '#6C7A89', name: 'Lynch', border: '#6C7A89'},
        {color: '#D2D7D3', name: 'Pumice', border: '#D2D7D3'},
        {color: '#EEEEEE', name: 'Gallery', border: '#EEEEEE'},
        {color: '#BDC3C7', name: 'Silver Sand', border: '#BDC3C7'},
        {color: '#ECF0F1', name: 'Porcelain', border: '#ECF0F1'},
        {color: '#95A5A6', name: 'Cascade', border: '#95A5A6'},
        {color: '#DADFE1', name: 'Iron', border: '#DADFE1'},
        {color: '#ABB7B7', name: 'Edward', border: '#ABB7B7'},
        {color: '#F2F1EF', name: 'Cararra', border: '#F2F1EF'},
        {color: '#BFBFBF', name: 'Silver', border: '#BFBFBF'},
        {color: '#000000', name: 'Black', border: '#ffffff'},
        {color: '#ffffff', name: 'White', border: '#7f8c8d'}
    ];

    var colorContainer = document.getElementById('color-container');
    var colorExtContainer = document.getElementById('color-extend-container');
    var colorExtPlaceHolder = document.getElementById('color-extend-bottom');
    $("#color-extend-container").niceScroll({ cursorcolor: '#ACACAC', cursorborder: 'none' });

    function initColors(container, colors) {
        function colorClick(e) {
            for (var i = 0; i < colors.length; i++) {
                colors[i].element.classList.remove('active');
                colors[i].active = 0;

                if (colors[i].name == e.target.name) {
                    e.target.classList.add('active');
                    colors[i].active = 1;
                    colorExtPlaceHolder.style.backgroundColor = colors[i].color;
                    colorExtOpen.style.borderColor = colors[i].color;
                    document.body.style.backgroundColor = colors[i].color;
                    self.setToolOption({color: colors[i].color});
                    self.emit('changeColor', colors[i].color);
                }
            }
        }

        for (var i = 0; i < colors.length; i++) {
            var c = document.createElement('div');
            c.classList.add('color-item');
            c.title = c.name = colors[i].name;
            c.style.background = colors[i].color;
            c.style['border-color'] = colors[i].border;
            if (colors[i].active) {
                c.classList.add('active');
                colorExtPlaceHolder.style.backgroundColor = colors[i].color;
                colorExtOpen.style.borderColor = colors[i].color;
                document.body.style.backgroundColor = colors[i].color;
            }
            c.addEventListener('click', colorClick);
            container.appendChild(c);
            colors[i].element = c;
        }
    }
    initColors(colorContainer, colors);
    initColors(colorExtContainer, colorsExt);

    self.applyColor = function () {
        for (var i = 0; i < colors.length; i++) {
            if (colors[i].active) return colors[i].color;
        }
    };
    self.selectColor = function (color) {
        for (var i = 0; i < colors.length; i++) {
            colors[i].element.classList.remove('active');
            colors[i].active = 0;

            if (colors[i].color == color) {
                colors[i].element.classList.add('active');
                colors[i].active = 1;
            }
        }

        colorExtPlaceHolder.style.backgroundColor = color;
        colorExtOpen.style.borderColor = color;
        document.body.style.backgroundColor = color;
    };
    self.disableColorTool = function() {
        colorContainer.classList.add('hide');
        colorExtOpen.classList.add('hide');
        colorExt.classList.add('hide');
    };
    self.enableColorTool = function() {
        colorContainer.classList.remove('hide');
        colorExtOpen.classList.remove('hide');
    };

    /* Tools */
    var selectedToolIndex = 0;
    var tools = [
        {
            name: 'tool-brush', title: 'Brush', icon: 'images/brush2.png', brush: 'images/brushes/3.png',
            options: { opacity: 0.08, density: 0.015, width: 50 }, active: 1
        },
        {
            name: 'tool-marker', title: 'Marker', icon: 'images/marker2.png', brush: 'images/brushes/9.png',
            options: { opacity: 0.3, density: 0.1, width: 20 }
        },
        {
            name: 'tool-highlighter', title: 'Highlighter Marker', icon: 'images/highlighter2.png', brush: 'images/brushes/7.png',
            options: { opacity: 0.5, density: 0.05, width: 20 }
        },
        {
            name: 'tool-pencil', title: 'Pencil', icon: 'images/pencil2.png', brush: 'images/brushes/6.png',
            options: { opacity: 0.2, density: 0.1, color: '#acacac', width: 2, fixedWidth: 1 }
        },
        {
            name: 'tool-crayon', title: 'Crayon', icon: 'images/crayon2.png', brush: 'images/brushes/81.png',
            options: { opacity: 0.1, density: 0.08, width: 30, randomize: 1, opacityDelta: 0.5, rotation: 1, widthMin: 0.8, widthDelta: 0.8 }
        },
        {
            name: 'tool-eraser', title: 'Eraser', icon: 'images/eraser2.png', brush: 'images/brushes/9.png',
            options: { opacity: 0.9, fixedOpacity: 1, density: 0.2, color: '#ffffff', fixedColor: 1, width: 50 }
        }
    ];
    var toolsContainer = document.getElementById('tools');

    function toolClick(e) {
        for (var i = 0; i < tools.length; i++) {
            tools[i].element.classList.remove('active');
            tools[i].active = 0;

            if (tools[i].name == e.currentTarget.name) {
                e.currentTarget.classList.add('active');
                tools[i].active = 1;
                selectedToolIndex = i;
                self.applySelectedTool();
                self.emit('changeTool', tools[i]);
            }
        }
    }

    function initTools() {
        for (var i = 0; i < tools.length; i++) {
            var t = document.createElement('div');
            t.name = tools[i].name;
            t.title = tools[i].title;
            t.classList.add('tool');
            t.classList.add(tools[i].name);


            if (tools[i].active) {
                t.classList.add('active');
            }
            if (tools[i].icon) {
                var icon = document.createElement('img');
                icon.src = tools[i].icon;
                icon.name = tools[i].name;
                t.appendChild(icon);
            }
            t.addEventListener('click', toolClick);

            toolsContainer.appendChild(t);
            tools[i].element = t;
        }
    }
    initTools();

    self.applySelectedTool = function () {
        var tool = tools[selectedToolIndex];
        
        if (tool.options.width) {
            self.setWidth(tool.options.width);
            if (tool.options.fixedWidth)
                self.disableWidthTool();
            else
                self.enableWidthTool();
        } else {
            self.enableWidthTool();
        }
        if (tool.options.opacity) {
            self.setOpacity(tool.options.opacity);
            if (tool.options.fixedOpacity)
                self.disableOpacityTool();
            else
                self.enableOpacityTool();
        } else {
            self.enableOpacityTool();
        }
        if (tool.options.color) {
            self.selectColor(tool.options.color);
            if (tool.options.fixedColor)
                self.disableColorTool();
            else
                self.enableColorTool();
        } else {
            self.enableColorTool();
        }
        return tool;
    };
    self.selectTool = function(name) {
        for (var i = 0; i < tools.length; i++) {
            tools[i].element.classList.remove('active');
            tools[i].active = 0;

            if (tools[i].name == name) {
                tools[i].element.classList.add('active');
                tools[i].active = 1;
                selectedToolIndex = i;
                self.applySelectedTool();
                self.emit('changeTool', tools[i]);
            }
        }
    };
    self.setToolOption = function(option) {
        var tool = tools[selectedToolIndex];

        if(option.width) tool.options.width = option.width;
        if(option.color) tool.options.color = option.color;
        if(option.opacity) tool.options.opacity = option.opacity;
    };

    /* Width tool */
    var widthCore = document.getElementById('size-core');
    var widthContainer = document.getElementById('size-container');
    var widthValue = 20, minWidthValue = 1, maxWidthValue = 100, widthDisabled = 0, widthHeight = widthContainer.offsetHeight;
    var widthMouseDown = 0, widthMouseStart = null, widthMouseEnd = null;

    self.getWidth = function () {
        return widthValue;
    };
    self.setWidth = function (width) {
        widthValue = width;
        var t = width * widthHeight / maxWidthValue;

        widthCore.style.width = t / 2 + 'px';
        widthCore.style.height = t + 'px';
        widthCore.style.marginTop = (widthHeight - t) / 2 + 'px';
        widthCore.style.marginLeft = (widthHeight - t) / 2 + 'px';
        widthContainer.title = 'Width: ' + width + 'px';
        self.setToolOption({width: width});
    };

    widthContainer.addEventListener('mousedown', function (e) {
        if (e.button != 0 || widthDisabled) return;
        widthMouseDown = 1;
        var x, y;
        if(e.offsetX || e.offsetX == 0) {
            x = e.offsetX; y = e.offsetY;
        } else {
            x = e.layerX - self.canvas.offsetLeft;
            y = e.layerY - self.canvas.offsetTop;
        }
        widthMouseStart = { x: x, y: y };
    });
    widthContainer.addEventListener('mousemove', function (e) {
        if (e.button != 0 || !widthMouseDown || widthDisabled) return;
        var x, y;
        if(e.offsetX || e.offsetX == 0) {
            x = e.offsetX; y = e.offsetY;
        } else {
            x = e.layerX - self.canvas.offsetLeft;
            y = e.layerY - self.canvas.offsetTop;
        }
        widthMouseEnd = { x: x, y: y };

        var d, dx, dy;
        dx = widthMouseEnd.x - widthMouseStart.x;
        dy = widthMouseEnd.y - widthMouseStart.y;
        d = Math.floor(Math.sqrt(dx * dx + dy * dy) / 2);

        if (dy < 0) {
            widthValue += d;
            if (widthValue > maxWidthValue) widthValue = maxWidthValue;
        } else {
            widthValue -= d;
            if (widthValue < minWidthValue) widthValue = minWidthValue;
        }

        self.setWidth(widthValue);
        self.emit('changeWidth', widthValue);
    });
    widthContainer.addEventListener('mouseup', function (e) {
        widthMouseDown = 0;
    });
    widthContainer.addEventListener('mouseleave', function (e) {
        widthMouseDown = 0;
    });
    widthContainer.addEventListener('mousewheel', function (e) {
        if (widthDisabled) return;
        widthValue += e.wheelDeltaY / 30;
        if (widthValue > maxWidthValue) widthValue = maxWidthValue;
        if (widthValue < minWidthValue) widthValue = minWidthValue;
        self.setWidth(widthValue);
        self.emit('changeWidth', widthValue);
    });

    self.disableWidthTool = function () {
        widthDisabled = 1;
        widthCore.classList.add('disabled');
    };
    self.enableWidthTool = function () {
        widthDisabled = 0;
        widthCore.classList.remove('disabled');
    };
    self.setWidth(widthValue);

    /* Opacity tool */
    var opacityCore = document.getElementById('opacity-core');
    var opacityContainer = document.getElementById('opacity-container');
    var opacityValue = 100, minOpacityValue = 10, maxOpacityValue = 1000, opacityDisabled = 0, opacityHeight = opacityContainer.offsetHeight;
    var opacityMouseDown = 0, opacityMouseStart = null, opacityMouseEnd = null;

    self.getOpacity = function () {
        return opacityValue / maxOpacityValue;
    };
    self.setOpacity = function (opacity) {
        opacityValue = opacity * maxOpacityValue;
        var t = opacityValue * opacityHeight / maxOpacityValue;

        opacityCore.style.width = t / 2 + 'px';
        opacityCore.style.height = t + 'px';
        opacityCore.style.marginTop = (opacityHeight - t) / 2 + 'px';
        opacityCore.style.marginright = (opacityHeight - t) / 2 + 'px';
        opacityCore.style.opacity = opacity * 100;
        opacityContainer.title = 'Opacity: ' + opacity;
        self.setToolOption({opacity: opacity});
    };

    opacityContainer.addEventListener('mousedown', function (e) {
        if (e.button != 0 || opacityDisabled) return;
        opacityMouseDown = 1;
        var x, y;
        if(e.offsetX || e.offsetX == 0) {
            x = e.offsetX; y = e.offsetY;
        } else {
            x = e.layerX - self.canvas.offsetLeft;
            y = e.layerY - self.canvas.offsetTop;
        }
        opacityMouseStart = { x: x, y: y };
    });
    opacityContainer.addEventListener('mousemove', function (e) {
        if (e.button != 0 || !opacityMouseDown || opacityDisabled) return;
        var x, y;
        if(e.offsetX || e.offsetX == 0) {
            x = e.offsetX; y = e.offsetY;
        } else {
            x = e.layerX - self.canvas.offsetLeft;
            y = e.layerY - self.canvas.offsetTop;
        }
        opacityMouseEnd = { x: x, y: y };

        var d, dx, dy;
        dx = opacityMouseEnd.x - opacityMouseStart.x;
        dy = opacityMouseEnd.y - opacityMouseStart.y;
        d = Math.floor(Math.sqrt(dx * dx + dy * dy) / 2);

        if (dy < 0) {
            opacityValue += 2*d;
            if (opacityValue > maxOpacityValue) opacityValue = maxOpacityValue;
        } else {
            opacityValue -= 2*d;
            if (opacityValue < minOpacityValue) opacityValue = minOpacityValue;
        }

        self.setOpacity(opacityValue / maxOpacityValue);
        self.emit('changeOpacity', opacityValue / maxOpacityValue);
    });
    opacityContainer.addEventListener('mouseup', function (e) {
        opacityMouseDown = 0;
    });
    opacityContainer.addEventListener('mouseleave', function (e) {
        opacityMouseDown = 0;
    });
    opacityContainer.addEventListener('mousewheel', function (e) {
        if (opacityDisabled) return;
        opacityValue += e.wheelDeltaY / 30;
        if (opacityValue > maxOpacityValue) opacityValue = maxOpacityValue;
        if (opacityValue < minOpacityValue) opacityValue = minOpacityValue;
        self.setOpacity(opacityValue / maxOpacityValue);
        self.emit('changeOpacity', opacityValue / maxOpacityValue);
    });

    self.disableOpacityTool = function () {
        opacityDisabled = 1;
        opacityCore.classList.add('disabled');
    };
    self.enableOpacityTool = function () {
        opacityDisabled = 0;
        opacityCore.classList.remove('disabled');
    };
    self.setOpacity(opacityValue / maxOpacityValue);

    /* Canvas size */
    var canvasSizeWidth = 800;
    var canvasSizeHeight = 600;
    self.getCanvasSize = function() {
        return { width: canvasSizeWidth, height: canvasSizeHeight };
    };
    self.setCanvasSize = function(size) {
        canvasSizeWidth = size.width;
        canvasSizeHeight = size.height;
        self.emit('setCanvasSize', size);
    };
    self.changeCanvasSize = function (size) {
        self.setCanvasSize(size);
        self.emit('changeCanvasSize', size);
    };

    /* Download tool */
    var downloadTool = document.getElementById('download');
    downloadTool.addEventListener('click', function (e) {
        self.emit('download', e);
    });

    /* Clear tool */
    var clearTool = document.getElementById('new');
    clearTool.addEventListener('click', function () {
        self.emit('clear');
    });

    /* Open tool */
    self.openImage = function(imageDataUrl) {
        if(imageDataUrl) self.emit('open', imageDataUrl);
    };

    /* Facebook tool */
    var picture = document.getElementById('login-tool');
    var setting = document.getElementById('setting');
    var logout = document.getElementById('logout');

    self.setAccountStatus = function(status) {
        if(status) {
            setting.classList.remove('disabled');
            logout.classList.remove('disabled');
            picture.classList.add('connected');
        } else {
            setting.classList.add('disabled');
            logout.classList.add('disabled');
            picture.classList.remove('connected');
        }
    };
    self.setAccountPicture = function(url) {
        if(!url) return picture.classList.add('empty');

        picture.style.backgroundImage = 'url(\'' + url + '\')';
        picture.classList.remove('empty');
    };

    /* Resize */
    window.addEventListener('resize', function() {
        widthHeight = widthContainer.offsetHeight;
        opacityHeight = opacityContainer.offsetHeight;
        
        self.setWidth(widthValue);
        self.setOpacity(opacityValue / maxOpacityValue);
    });

    /* Sound tool */
    var sounds = {
        newMessage: 'audios/Glass.wav',
        newMember: 'audios/Ping.wav',
        leavedMember: 'audios/Purr.wav'
    };
    self.playSound = function(name) {
        if(!sounds[name]) return false;

        if(ResourceManager.audios[sounds[name]]) {
            ResourceManager.audios[sounds[name]].play();
        }
    };

    /* Resize image tool */
    self.resizeImage = function(img, maxSize) {
        // img must be Image or Canvas
        if(!img || (img.nodeName != 'IMG' && img.nodeName != 'CANVAS')) return false;
        if(!maxSize) return img;

        var currentWidth = img.canvas ? img.canvas.width : img.width,
            currentHeight = img.canvas ? img.canvas.height : img.height,
            scale = maxSize / Math.max(currentWidth, currentHeight);

        if(scale >= 1) {
            var c = document.createElement('canvas');
            c.width = maxSize;
            c.height = maxSize * currentHeight / currentWidth;
            var ctx = c.getContext('2d');
            ctx.drawImage(img, 0, 0, currentWidth, currentHeight, 0, 0, c.width, c.height);

            return c;
        }

        if(img.nodeName == 'IMG') {
            return downScaleImage(img, scale);
        } else {
            return downScaleCanvas(img, scale);
        }
    };
};
