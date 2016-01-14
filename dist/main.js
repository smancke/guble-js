/*
* The Guble client libary, implements the websocket
* protocol for the guble Guble message server.
*
* https://github.com/smancke/guble
*/
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Guble = (function () {

    /*
     * @param {string} the base websocket url. If none is given, window.location.href is used..
     */

    function Guble(baseUrl) {
        _classCallCheck(this, Guble);

        this.baseUrl = baseUrl || window.location.href;
        this.ws = undefined;
        this.onMessage = undefined;
    }

    _createClass(Guble, [{
        key: "close",
        value: function close() {
            if (this.ws) {
                this.ws.close();
            }
        }
    }, {
        key: "connect",
        value: function connect(userId) {
            var url = this.baseUrl.replace(/^https:\/\//, "wss://").replace(/^http:\/\//, "ws://").replace(/\/$/, "");

            var fullUrl = url + "/stream/" + userId;
            console.log("[guble] connect to: " + fullUrl);
            this.ws = new WebSocket(fullUrl);
            this.ws.onmessage = this._handleIncomming;
        }
    }, {
        key: "sendRaw",
        value: function sendRaw(rawData) {
            this.ws.send(rawData);
        }
    }, {
        key: "sendMessage",
        value: function sendMessage(path, body, optionalHeader) {
            this.ws.send("> " + path + "\n" + (optionalHeader ? optionalHeader : "") + "\n" + body);
        }
    }, {
        key: "onOpen",
        value: function onOpen(callback) {
            this._waitForConnection(callback, 10);
        }
    }, {
        key: "onMessage",
        value: function onMessage(callback) {
            this.onMessage = callback;
        }
    }, {
        key: "_waitForConnection",
        value: function _waitForConnection(callback, interval) {
            if (this.ws && this.ws.readyState === 1) {
                callback();
            } else {
                // optional: implement backoff for interval here
                setTimeout(function () {
                    this.waitForConnection(callback, interval);
                }, interval);
            }
        }
    }, {
        key: "_decodeAndSplit",
        value: function _decodeAndSplit(binaryBlob, callback) {
            var f = new FileReader();
            f.onload = function (e) {
                callback(e.target.result.split("\n", 3));
            };
            f.readAsText(binaryBlob);
        }
    }, {
        key: "_handleMessage",
        value: function _handleMessage(meta, header, body) {
            console.log("msg " + meta + "\n" + header + "\n" + body);
            if (this.onMessage) {
                this.onMessage(meta, header, body);
            }
        }
    }, {
        key: "_handleNotification",
        value: function _handleNotification(meta, header) {
            console.log("notification " + meta + (header ? "\n" + header : ""));
        }
    }, {
        key: "_handleError",
        value: function _handleError(meta, header) {
            console.log("error " + meta + "\n" + header);
        }
    }, {
        key: "_handleIncomming",
        value: function _handleIncomming(rawMsg) {
            this._decodeAndSplit(rawMsg.data, function (parts) {
                if (parts[0].length == 0) {
                    return;
                }
                if (parts[0].match(/^#/)) {

                    _handleNotification(parts[0], parts.length > 1 ? parts[1] : undefined);
                } else if (parts[0].match(/^!/)) {

                    this._handleError(parts[0], parts.length > 1 ? parts[1] : undefined);
                } else {

                    _handleMessage(parts[0], parts.length > 1 ? parts[1] : undefined, parts.length > 2 ? parts[2] : undefined);
                }
            });
        }
    }]);

    return Guble;
})();

module.exports = Guble;