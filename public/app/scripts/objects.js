/* POINT */

function Point(x, y) {
    this.x = 0;
    this.y = 0;
    if(typeof(x) == 'number' && typeof(y) == 'number') {
        if(x < 0) x = 0;
        if(y < 0) y = 0;

        this.x = x;
        this.y = y;
    } else throw new Error('X and Y must be number');
}

Point.prototype.set = function(x, y) {
    if(typeof(x) == 'number' && typeof(y) == 'number') {
        this.x = x;
        this.y = y;
    } else throw new Error('X and Y must be a number');
};

/* PATH */

function Path(points) {
    this.points = [];
    this.length = 0;

    if(Array.isArray(points)) {
        this.points = points;
        this.length  = points.length;
    }
}

Path.prototype.addPoint = function(point) {
    this.points.push(new Point(point.x, point.y));
    this.length = this.points.length;
};

Path.prototype.getPoint = function(index) {
    if(index < 0 || index >= this.length) return null;
    return this.points[index];
};

Path.prototype.getPoints = function() {
    return this.points;
};

Path.prototype.getLength = function() {
    return this.length;
};

Path.prototype.clone = function() {
    var _tmp = [];
    for(var i = 0; i < this.points.length; i++)
        _tmp.push(new Point(this.points[i].x, this.points[i].y));

    return new Path(_tmp);
};

Path.prototype.clear = function() {
    this.points.splice(0, this.points.length);
    this.length = 0;
};


/* BrushStyle */

function Brush(options, callback) {
    this.context = null;

    this._id = null;
    this._factor = 1;
    this._image = null;
    this.image = null;
    this.width = 20;
    this.color = '#000000';
    this.opacity = 0.1;
    this.density = 0.03;
    this.stabilizer = null;
    this.stabilizeLevel = 8;
    this.stabilizeWeight = 0.6;
    this.stablizeInterval = 5;
    this.randomize = 0;
    this.onDone = callback;

    // Drawing
    this.isDone = 0;
    this.isStabilizing = 0;
    this.path = options.path || new Path();
    this.lx = 0; this.ly = 0; this.delta = 0;
    this.dDraw = this.density * this.width;
    this.offsetX = this.width * 0.5; this.offsetY = this.width * 0.5;

    if(options) {
        if(options.id != null) this._id = options.id;
        if(options.width) this.width = options.width;
        if(options.color) this.color = options.color;
        if(options.opacity) this.opacity = options.opacity;
        if(options.density) this.density = options.density;
        if(options.stabilizeLevel) this.stabilizeLevel = options.stabilizeLevel;
        if(options.stabilizeWeight) this.stabilizeWeight = options.stabilizeWeight;
        if(options.stablizeInterval) this.stablizeInterval = options.stablizeInterval;

        if(options.randomize) this.randomize = options.randomize;
        if(options.opacityDelta) this.opacityDelta = options.opacityDelta;
        if(options.rotation) this.rotation = options.rotation;
        if(options.widthMin) this.widthMin = options.widthMin;
        if(options.widthDelta) this.widthDelta = options.widthDelta;

        if(options.path) {
            if(options.path.constructor.name == 'Path')
                this.path = options.path;
            else if(Array.isArray(options.path))
                this.path = new Path(options.path);
            else if(typeof(options.path) == 'object' && Array.isArray(options.path.points))
                this.path = new Path(options.path.points);
        }

        if(options.image) this.setImage(options.image);
        if(this.stabilizeLevel > 0)
            this.stabilizer = new Brush.Stabilizer({ level: this.stabilizeLevel, weight: this.stabilizeWeight }, this);
    }
}

Brush.prototype.setOptions = function(options) {
    if(options) {
        var r = 0, s = 0;
        if(options.width) {
            this.width = options.width;
            r = 1;
        }
        if(options.color) {
            this.color = options.color;
            r = 1;
        }
        if(options.opacity) {
            this.opacity = options.opacity;
            r = 1;
        }
        if(options.density) this.density = options.density;
        if(options.randomize) this.randomize = options.randomize;
        if(options.opacityDelta) this.opacityDelta = options.opacityDelta;
        if(options.rotation) this.rotation = options.rotation;
        if(options.widthMin) this.widthMin = options.widthMin;
        if(options.widthDelta) this.widthDelta = options.widthDelta;

        if(options.stabilizeLevel) {
            this.stabilizeLevel = options.stabilizeLevel;
            s = 1;
        }
        if(options.stabilizeWeight) {
            this.stabilizeWeight = options.stabilizeWeight;
            s = 1;
        }
        if(options.stablizeInterval) {
            this.stablizeInterval = options.stablizeInterval;
            s = 1;
        }

        if(options.image || r) this.setImage(options.image || null);
        if(this.stabilizeLevel > 0 && s)
            this.stabilizer = new Brush.Stabilizer({
                level: this.stabilizeLevel, weight: this.stabilizeWeight
            });
    }
};

Brush.prototype.setImage = function(image) {
    if(image) {
        var _image = ResourceManager.images[image];
        this._image = image;
        this._factor = _image.width / _image.height;
        this.offsetX = this.width * 0.5;
        this.offsetY = this.width * 0.5 / this._factor;
    }

    this.image = document.createElement('canvas');
    this.image.width = this.width;
    this.image.height = this.width / this._factor;

    var ctx = this.image.getContext('2d');
    ctx.clearRect(0, 0, this.image.width, this.image.height);
    ctx.drawImage(ResourceManager.images[this._image], 0, 0, this.image.width, this.image.height);
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fillRect(0, 0, this.image.width, this.image.height);
};

Brush.prototype.setContext = function(context) {
    if(context) this.context = context;  
};

Brush.prototype.clone = function() {
    return {
        path: this.path.clone(),
        id: this._id,
        image: this._image,
        width: this.width,
        color: this.color,
        opacity: this.opacity,
        density: this.density,
        randomize: this.randomize,
        rotation: this.rotation,
        opacityDelta: this.opacityDelta,
        widthMin: this.widthMin,
        widthDelta: this.widthDelta
    };
};

Brush.prototype.down = function(point, nativeOnly) {
    if(!nativeOnly && this.stabilizer) {
        this.isStabilizing = 1;
        this.stabilizer.down(point);
    } else {
        this.path.addPoint(point);
        this.lx = point.x; this.ly = point.y; this.delta = 0;
        this.isDone = 1;
        this._draw(0);
    }
};

Brush.prototype.move = function(point, nativeOnly) {
    if(!nativeOnly && this.stabilizer) return this.stabilizer.move(point);

    this.path.addPoint(point);
    this._draw(this.path.length - 1);
};

Brush.prototype.up = function(point, nativeOnly) {
    if(!nativeOnly && this.stabilizer) return this.stabilizer.up(point);

    this.path.addPoint(point);
    this._draw(this.path.length - 1, 1);
    this.isDone = 0;
    this.isStabilizing = 0;
};

Brush.prototype.__draw = function(x, y) {
    this.context.save();
    if(this.randomize) {
        var r;
        this.context.translate(x + this.offsetX, y + this.offsetY);
        if(this.rotation) {
            r = Math.random();
            this.context.rotate(r * 2 * Math.PI);
        }
        if(this.widthDelta > 0) {
            r = Math.random();
            this.context.scale(this.widthMin + r * this.widthDelta, this.widthMin + r * this.widthDelta);
        }
        this.context.translate(-x - this.offsetX, -y - this.offsetY);
        if(this.opacityDelta > 0) {
            r = Math.random();
            this.context.globalAlpha = 1 - r * this.opacityDelta;
        }
    }
    this.context.drawImage(this.image, x, y);
    this.context.restore();
};

Brush.prototype._draw = function(index, last) {
    if(index == 0) {
        this.__draw(this.path.getPoint(0).x - this.offsetX, this.path.getPoint(0).y - this.offsetY);
    } else {
        var d, dx, dy, dl, dlx, dly, dir;
        var p1 = this.path.getPoint(index), p2 = this.path.getPoint(index - 1);
        dx = p1.x - p2.x;
        dy = p1.y - p2.y;
        d = Math.sqrt(dx * dx + dy * dy);
        dlx = p1.x - this.lx;
        dly = p1.y - this.ly;
        dl = Math.sqrt(dlx * dlx + dly * dly);
        this.delta += d;

        if(this.delta < this.dDraw) {
            if(last && typeof(this.onDone) == 'function') this.onDone(this._id, this.context);
            return;
        }
        if(dl < this.dDraw) {
            this.__draw(p1.x - this.offsetX, p1.y - this.offsetY);
            this.delta -= this.dDraw;
            if(last && typeof(this.onDone) == 'function') this.onDone(this._id, this.context);
        } else {
            var tx, ty;
            while(this.delta >= this.dDraw) {
                dlx = p1.x - this.lx;
                dly = p1.y - this.ly;
                dir = Math.atan2(dly, dlx);
                tx = Math.cos(dir);
                ty = Math.sin(dir);
                this.lx += tx * this.dDraw;
                this.ly += ty * this.dDraw;
                this.__draw(this.lx - this.offsetX, this.ly - this.offsetY);
                this.delta -= this.dDraw;
            }
            if(last && typeof(this.onDone) == 'function') this.onDone(this._id, this.context);
        }
    }
};

Brush.prototype.draw = function(context) {
    var self = this;

    var loop = window.setInterval(function() {
        if(!self.isStabilizing) {
            var points = [], i;
            for(i = 0; i < self.path.length; i++) points.push(self.path.getPoint(i));
            self.path.clear();

            if(context) self.setContext(context);
            self.down(points[0], 1);
            for(i = 1; i < points.length - 1; i++) {
                self.move(points[i], 1);
            }
            self.up(points[i], 1);

            window.clearInterval(loop);
        }
    }, 5);
};

Brush.Stabilizer = function(stabilizeOptions, brush) {
    this.level = 0;
    this.weight = 0.5;
    this.interval = 5;
    this.brush = brush;
    this.stopped = 0;

    if(stabilizeOptions) {
        if(stabilizeOptions.level) this.level = stabilizeOptions.level;
        if(stabilizeOptions.weight) this.weight = stabilizeOptions.weight;
        if(stabilizeOptions.interval) this.interval = stabilizeOptions.interval;
    }

    this.follow = 1 - Math.min(0.95, Math.max(0, this.weight));
    this.points = [];
    this.current = null; this.first = null; this.last = null;
};

Brush.Stabilizer.prototype.down = function(point) {
    this.brush.down(point, 1);

    for(var i = 0; i < this.level; i++) this.points.push(new Point(point.x, point.y));
    this.current = new Point(point.x, point.y);
    this.first = this.points[0];
    this.last = this.points[this.points.length - 1];
    this.stopped = 0;

    window.setTimeout(this.stabilize.bind(this), this.interval);
};

Brush.Stabilizer.prototype.move = function(point) {
    this.current.x = point.x;
    this.current.y = point.y;
};

Brush.Stabilizer.prototype.up = function(point) {
    this.current.x = point.x;
    this.current.y = point.y;
    this.stopped = 1;
};

Brush.Stabilizer.prototype.stabilize = function(calOnly) {
    var _curr, _prev, dx, dy, delta = 0;
    this.first.x = this.current.x;
    this.first.y = this.current.y;
    for(var i = 1; i < this.points.length; i++) {
        _curr = this.points[i];
        _prev = this.points[i - 1];
        dx = _prev.x - _curr.x;
        dy = _prev.y - _curr.y;
        delta += Math.abs(dx);
        delta += Math.abs(dy);
        _curr.x = _curr.x + dx * this.follow;
        _curr.y = _curr.y + dy * this.follow;
    }

    if(calOnly) return delta;
    if(this.stopped) {
        while(delta > 1) {
            this.brush.move(this.last, 1);
            delta = this.stabilize(1);
        }
        this.brush.up(this.last, 1);
    } else {
        this.brush.move(this.last, 1);
        window.setTimeout(this.stabilize.bind(this), this.interval);
    }
};


/* LINE */
function Line(brushStyle, path) {
    this.brushStyle = brushStyle || new Brush();
    this.path = path || new Path();

    this.drawLine = function(context) {
        var points = this.path.getPoints(), i;

        context.strokeStyle = this.brushStyle.color;
        context.lineJoin = this.brushStyle.lineJoin;
        context.lineCap = this.brushStyle.lineCap;
        context.lineWidth = this.brushStyle.width;

        context.beginPath();
        context.moveTo(points[0].x, points[0].y);

        for (i = 1; i < points.length - 2; i++) {
            context.quadraticCurveTo(points[i].x, points[i].y,
                    (points[i].x + points[i + 1].x) / 2,
                    (points[i].y + points[i + 1].y) / 2);
        }
        if(points.length > 2) {
            context.quadraticCurveTo(points[i].x, points[i].y,
                    (points[i].x + points[i + 1].x) / 2,
                    (points[i].y + points[i + 1].y) / 2);
        }

        context.stroke();
    };

    this.drawImageLine = function(context) {
        var points = this.path.getPoints(), i;
        var offsetX = this.brushStyle.width * 0.5,
            offsetY = offsetX / (this.brushStyle.image.width / this.brushStyle.image.height);

        // One click
        if(points.length < 3)
            return context.drawImage(this.brushStyle.image, points[0].x - offsetX, points[0].y - offsetY);

        // Line
        var lx, ly, dlx, dly, dl, dx, dy, d, dDraw, delta, dir;
        lx = points[0].x;
        ly = points[0].y;

        var follow = 1 - Math.min(0.95 , Math.max(0, this.brushStyle.stabilizeWeight));
        var _points = [];
        for(i = 0; i < this.brushStyle.stabilizeLevel; i++) {
            _points.push(new Point(lx, ly));
        }


        dDraw = Math.max(0.5, this.brushStyle.density * this.brushStyle.width);
        delta = 0;

        for (i = 0; i < points.length - 1; i++) {
            dx = points[i + 1].x - points[i].x;
            dy = points[i + 1].y - points[i].y;
            d = Math.sqrt(dx * dx + dy * dy);
            dlx = points[i + 1].x - lx;
            dly = points[i + 1].y - ly;
            dl = Math.sqrt(dlx * dlx + dly * dly);
            delta += d;

            if(delta < dDraw) continue;
            if(dl < dDraw) {
                context.drawImage(this.brushStyle.image, points[i + 1].x - offsetX, points[i + 1].y - offsetY);
                delta -= dDraw;
            } else {
                var tx, ty;
                context.save();
                while(delta >= dDraw) {
                    dlx = points[i + 1].x - lx;
                    dly = points[i + 1].y - ly;
                    dir = Math.atan2(dly, dlx);
                    tx = Math.cos(dir);
                    ty = Math.sin(dir);
                    lx += tx * dDraw;
                    ly += ty * dDraw;
                    context.drawImage(this.brushStyle.image, lx - offsetX, ly - offsetY);
                    delta -= dDraw;
                }
                context.restore();
            }
        }
    }
}

Line.prototype.setBrushStyle = function(brushStyle) {
    if(brushStyle) this.brushStyle = brushStyle;
};

Line.prototype.getPath = function() {
    return this.path;
};

Line.prototype.setPath = function(path) {
    if(path) this.path = path;
};

Line.prototype._draw = function(context, clearFirst) {
    if(clearFirst) context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    if(this.brushStyle.type == 'LINE')
        this.drawLine(context);
    else
        this.drawImageLine(context);
};
