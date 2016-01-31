/*
* The Guble client libary, implements the websocket
* protocol for the guble Guble message server.
*
* https://github.com/smancke/guble
*/
class Guble {

    /*
     * @param {string} the base websocket url. If none is given, window.location.href is used..
     */
    constructor(baseUrl) {
        this.baseUrl = baseUrl || window.location.href;
        this.ws = undefined;
        this.onMessageCallback = undefined;
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }

    connect(userId) {
        var url = this.baseUrl
            .replace(/^https:\/\//, "wss://")
            .replace(/^http:\/\//, "ws://")
            .replace(/\/$/, "")

        var fullUrl = url + "/stream/"+userId
        console.log("[guble] connect to: "+ fullUrl)
        this.ws = new WebSocket(fullUrl)
        this.ws.onmessage = (msg) => this._handleIncomming(msg)
    }

    sendRaw(rawData) {
        this.ws.send(rawData)
    }

    sendMessage(path, body, optionalHeader) {
        this.ws.send("> "+ path + "\n"+ (optionalHeader ? optionalHeader : "") +"\n" + body);
    }

    onOpen(callback) {
        this._waitForConnection(callback, 10);
    }

    onMessage(callback) {
        this.onMessageCallback = callback
    }

    _waitForConnection(callback, interval) {
        if (this.ws && this.ws.readyState === 1) {
            callback();
        } else {
            // optional: implement backoff for interval here
            setTimeout(() => {
                this._waitForConnection(callback, interval);
            }, interval);
        }
    }

    _decodeAndSplit(binaryBlob, callback) {
        var f = new FileReader();
        f.onload = function(e) {
            callback(e.target.result.split("\n", 3))
        }
        f.readAsText(binaryBlob);
    }

    _handleMessage(meta, header, body) {
        console.log("[guble] msg "+ meta + "\n"+header + "\n"+body);
        if (this.onMessageCallback) {
            this.onMessageCallback(meta, header, body)
        }
    }

    _handleNotification(meta, header) {
        console.log("[guble] notification "+ meta + (header? ("\n"+header) : ""));
    }

    _handleError(meta, header) {
        console.log("[guble] error "+ meta + "\n"+header);
    }

    _handleIncomming(rawMsg) {
        this._decodeAndSplit(rawMsg.data, (parts) => {
            if (parts[0].length == 0) {
                return
            }
            if (parts[0].match(/^#/)) {

                this._handleNotification(parts[0], parts.length > 1 ? parts[1] : undefined)

            } else if (parts[0].match(/^!/)) {

                this._handleError(parts[0], parts.length > 1 ? parts[1] : undefined)

            } else {

                this._handleMessage(parts[0],
                              parts.length > 1 ? parts[1] : undefined,
                              parts.length > 2 ? parts[2] : undefined)

            }
        });
    }
}

export {Guble as default}
