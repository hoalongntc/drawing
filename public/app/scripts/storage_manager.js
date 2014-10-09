StorageManager = new function() {
    var self = this;
    this.localStorage = window.localStorage || null;
    this.isLocalStorageSupported = this.localStorage != null;

    this.setItem = function(key, obj) {
        if(!self.isLocalStorageSupported) return false;

        if(obj == null) return;
        if(typeof(obj) == 'string') {
            self.localStorage.setItem(key, obj);
        } else {
            self.localStorage.setItem(key, JSON.stringify(obj));
        }
    };

    this.getItem = function(key) {
        if(!self.isLocalStorageSupported) return null;

        return self.localStorage.getItem(key);
    };

    this.removeItem = function(key) {
        if(!self.isLocalStorageSupported) return false;

        self.localStorage.removeItem(key);
    }
};