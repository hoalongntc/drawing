NotifyManager = new function() {
    var self = this;
    toastr.options = {
        closeButton: !0,
        positionClass: 'toast-top-left',
        timeOut: '5000'
    };

    var types = ['success', 'info', 'warning', 'error'];
    types.forEach(function(type) {
        self[type] = function(message) {
            if(!message) return;
            toastr[type](message);
        };
    });
};
