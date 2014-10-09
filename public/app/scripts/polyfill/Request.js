Request = new function() {

    var xhr = function() {
        if (typeof XMLHttpRequest !== 'undefined') {
            return new XMLHttpRequest();
        }
        var versions = [
            "MSXML2.XmlHttp.5.0",
            "MSXML2.XmlHttp.4.0",
            "MSXML2.XmlHttp.3.0",
            "MSXML2.XmlHttp.2.0",
            "Microsoft.XmlHttp"
        ];

        var xhr;
        for(var i = 0; i < versions.length; i++) {
            try {
                xhr = new ActiveXObject(versions[i]);
                break;
            } catch (e) {
            }
        }
        return xhr;
    };

    var send = function(url, method, data, headers, responseType) {
        var deferred = Q.defer(),
            req = xhr();

        req.open(method, url, true);
        if(responseType) req.responseType = responseType;
        if(headers)
            for(var header in headers) {
                if(!headers.hasOwnProperty(header)) continue;
                req.setRequestHeader(header, headers[header]);
            }

        req.onreadystatechange = function(e) {
            if (req.readyState == 4) {
                if([200,304].indexOf(req.status) === -1) {
                    deferred.reject(new Error(req.responseText));
                } else {
                    deferred.resolve(e.target.response);
                }
            }
        };

        if (method == 'POST') {
            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        req.send(data);

        return deferred.promise;
    };

    this.download = function(url, data, headers) {
        var query = [];
        for (var key in data || {}) {
            if(!data.hasOwnProperty(key)) continue;
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }

        return send(url + '?' + query.join('&'), 'GET', null, headers, 'arraybuffer');
    };

    this.get = function(url, data) {
        var query = [];
        for (var key in data || {}) {
            if(!data.hasOwnProperty(key)) continue;
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }

        return send(url + '?' + query.join('&'), 'GET');
    };

    this.post = function(url, data) {
        var query = [];
        for (var key in data || {}) {
            if(!data.hasOwnProperty(key)) continue;
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        return send(url, 'POST', query.join('&'));
    };
};

