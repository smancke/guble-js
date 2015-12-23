

var Guble = (function () {
    return function(baseUrl) {
        var self = this;
        self.baseUrl = baseUrl || window.location.href;
        self.ws = undefined;
        self.onMessage = undefined;
        function decodeAndSplit(binaryBlob, callback) {
            var f = new FileReader();
            f.onload = function(e) {
                callback(e.target.result.split("\n", 3))
            }
            f.readAsText(binaryBlob);
        }

        
        function handleMessage(meta, header, body) {
            console.log("msg "+ meta + "\n"+header + "\n"+body);
            if (self.onMessage) {
                self.onMessage(meta, header, body)
            }
        }

        function handleNotification(meta, header) {
                console.log("notification "+ meta + "\n"+header);
        }

        function handleError(meta, header) {
                console.log("error "+ meta + "\n"+header);
        }
        
        function handleIncomming(rawMsg) {
            decodeAndSplit(rawMsg.data, function(parts) {
                if (parts[0].length == 0) {
                    return
                }
                if (parts[0].match(/^#/)) {

                    handleNotification(parts[0], parts.length > 1 ? parts[1] : undefined)

                } else if (parts[0].match(/^!/)) {

                    handleError(parts[0], parts.length > 1 ? parts[1] : undefined)

                } else {

                    handleMessage(parts[0],
                                  parts.length > 1 ? parts[1] : undefined,
                                  parts.length > 2 ? parts[2] : undefined)

                }
            });
        }

        self.close = function() {
            if (self.ws) {
                self.ws.close();
            }
        }
        
        self.connect = function(userId) {
            var url = self.baseUrl
                .replace(/^https:\/\//, "wss://")
                .replace(/^http:\/\//, "ws://");


            var fullUrl = url + "/stream/user/"+userId;
            console.log("[guble] connect to: "+ fullUrl)
            self.ws = new WebSocket(fullUrl);
            self.ws.onmessage = handleIncomming            
        }

        self.waitForConnection = function (callback, interval) {
            if (self.ws && self.ws.readyState === 1) {
                callback();
            } else {
                // optional: implement backoff for interval here
                setTimeout(function () {
                    self.waitForConnection(callback, interval);
                }, interval);
            }
        }
        
        self.onOpen = function(callback) {
            self.waitForConnection(callback, 10);
        }

        self.sendRaw = function(rawData) {
            self.ws.send(rawData)
        }

        self.sendMessage = function(path, body, optionalHeader) {
            self.ws.send("> "+ path + "\n"+ (optionalHeader ? optionalHeader : "") +"\n" + body);
        }

        self.onMessage = function(callback) {
            self.onMessage = callback
        }
    }
}());
