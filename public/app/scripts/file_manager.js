FileManager = new function() {
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

    var fileExtReg = /(?:\.([^.]+))?$/;

    /* Dropbox */
    var dropboxInitiated = false;
    var dropboxSupported = false;

    function _dropboxFileSelected(files) {
        var file = files[0];
        console.log(file);

        var type =  fileExtReg.exec(file.name)[1];
        return Request.download(file.link)
            .then(function(buffer) {
                return new Blob([buffer], {type: type ? 'image/' + type : null});
            });
    }
    function _selectWithDropbox() {
        var deferred = Q.defer();

        if(!('Dropbox') in window) {
            deferred.reject(new Error('Dropbox is not loaded'));
        } else {
            Dropbox.choose({
                linkType: 'direct',
                extensions: ['.jpg', '.jpeg', '.png'],
                success: function(files) {
                    deferred.resolve(files);
                },
                cancel: function() {
                    deferred.reject();
                }
            });
        }

        return deferred.promise;
    }
    this.selectWithDropbox = function() {
        return _selectWithDropbox().then(_dropboxFileSelected);
    };

    /* Google drive */
    function _googleDriveGetFile(file) {
        return Request.download(file.downloadUrl, null, {'Authorization': 'Bearer ' + gapi.auth.getToken().access_token})
            .then(function(buffer) {
                return new Blob([buffer], {type: file.mimeType});
            });
    }
    function _googleDriveFileSelected(info) {
        var deferred = Q.defer();

        console.log(info);
        var file = info.docs[0];

        var request = gapi.client.drive.files.get({
            'fileId': file.id
        });
        request.execute(function(req) {
            if(req.downloadUrl) deferred.resolve(req);
            else deferred.reject(new Error('File ' + info.name + ' is not downloadable'));
        });

        return deferred.promise;

        //description: ""
        //driveError: "PERMISSION_DENIED"
        //driveSuccess: false
        //iconUrl: "https://ssl.gstatic.com/docs/doclist/images/icon_11_image_list.png"
        //id: "0B2daZ0veBysMbXMzTlB4a0o1ZTA"
        //lastEditedUtc: 1411837901948
        //mimeType: "image/png"
        //name: "brush-512.png"
        //parentId: "0AGdaZ0veBysMUk9PVA"
        //serviceId: "docs"
        //sizeBytes: 21009
        //type: "photo"
        //url: "https://docs.google.com/file/d/0B2daZ0veBysMbXMzTlB4a0o1ZTA/edit?usp=drive_web"
    }
    function _selectWithGoogleDrive() {
        var deferred = Q.defer();

        //var view = new google.picker.View(google.picker.ViewId.DOCS); //ViewId.PHOTOS
        //view.setMimeTypes("image/png,image/jpeg,image/jpg");

        var picker = new google.picker.PickerBuilder()
            .setAppId(AccountManager.getGoogleAppId())
            .setOAuthToken(gapi.auth.getToken().access_token)
            .addView(new google.picker.View(google.picker.ViewId.DOCS).setMimeTypes("image/png,image/jpeg,image/jpg"))
            .addView(new google.picker.View(google.picker.ViewId.PHOTOS).setMimeTypes("image/png,image/jpeg,image/jpg"))
            .setTitle('OPEN IMAGE')
            .setCallback(function(info) {
                if(info[google.picker.Response.ACTION] == google.picker.Action.LOADED) return;
                if(info[google.picker.Response.ACTION] == google.picker.Action.PICKED) deferred.resolve(info);
                else deferred.reject();
            })
            .build();
        picker.setVisible(true);

        return deferred.promise;
    }
    function _connectWithGoogleDrive() {
        return AccountManager.authorizeGooglePlus('https://www.googleapis.com/auth/drive', true)
            .then(function(status) {
                if(status) return true;
                return AccountManager.loginGooglePlus('https://www.googleapis.com/auth/drive')
            });
    }
    this.selectWithGoogleDrive = function() {
        return _connectWithGoogleDrive()
            .then(function(status) {
                if(!status) return new Error('Google Drive is not connected');
            })
            .then(_selectWithGoogleDrive)
            .then(_googleDriveFileSelected)
            .then(_googleDriveGetFile);
    }
};