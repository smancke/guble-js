(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiogVGhlIEd1YmxlIGNsaWVudCBsaWJhcnksIGltcGxlbWVudHMgdGhlIHdlYnNvY2tldFxuKiBwcm90b2NvbCBmb3IgdGhlIGd1YmxlIEd1YmxlIG1lc3NhZ2Ugc2VydmVyLlxuKlxuKiBodHRwczovL2dpdGh1Yi5jb20vc21hbmNrZS9ndWJsZVxuKi9cblwidXNlIHN0cmljdFwiO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBHdWJsZSA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICAvKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0aGUgYmFzZSB3ZWJzb2NrZXQgdXJsLiBJZiBub25lIGlzIGdpdmVuLCB3aW5kb3cubG9jYXRpb24uaHJlZiBpcyB1c2VkLi5cbiAgICAgKi9cblxuICAgIGZ1bmN0aW9uIEd1YmxlKGJhc2VVcmwpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEd1YmxlKTtcblxuICAgICAgICB0aGlzLmJhc2VVcmwgPSBiYXNlVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICB0aGlzLndzID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLm9uTWVzc2FnZSA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoR3VibGUsIFt7XG4gICAgICAgIGtleTogXCJjbG9zZVwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy53cykge1xuICAgICAgICAgICAgICAgIHRoaXMud3MuY2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcImNvbm5lY3RcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbm5lY3QodXNlcklkKSB7XG4gICAgICAgICAgICB2YXIgdXJsID0gdGhpcy5iYXNlVXJsLnJlcGxhY2UoL15odHRwczpcXC9cXC8vLCBcIndzczovL1wiKS5yZXBsYWNlKC9eaHR0cDpcXC9cXC8vLCBcIndzOi8vXCIpLnJlcGxhY2UoL1xcLyQvLCBcIlwiKTtcblxuICAgICAgICAgICAgdmFyIGZ1bGxVcmwgPSB1cmwgKyBcIi9zdHJlYW0vXCIgKyB1c2VySWQ7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltndWJsZV0gY29ubmVjdCB0bzogXCIgKyBmdWxsVXJsKTtcbiAgICAgICAgICAgIHRoaXMud3MgPSBuZXcgV2ViU29ja2V0KGZ1bGxVcmwpO1xuICAgICAgICAgICAgdGhpcy53cy5vbm1lc3NhZ2UgPSB0aGlzLl9oYW5kbGVJbmNvbW1pbmc7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJzZW5kUmF3XCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZW5kUmF3KHJhd0RhdGEpIHtcbiAgICAgICAgICAgIHRoaXMud3Muc2VuZChyYXdEYXRhKTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcInNlbmRNZXNzYWdlXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZW5kTWVzc2FnZShwYXRoLCBib2R5LCBvcHRpb25hbEhlYWRlcikge1xuICAgICAgICAgICAgdGhpcy53cy5zZW5kKFwiPiBcIiArIHBhdGggKyBcIlxcblwiICsgKG9wdGlvbmFsSGVhZGVyID8gb3B0aW9uYWxIZWFkZXIgOiBcIlwiKSArIFwiXFxuXCIgKyBib2R5KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcIm9uT3BlblwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25PcGVuKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLl93YWl0Rm9yQ29ubmVjdGlvbihjYWxsYmFjaywgMTApO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwib25NZXNzYWdlXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbk1lc3NhZ2UoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMub25NZXNzYWdlID0gY2FsbGJhY2s7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJfd2FpdEZvckNvbm5lY3Rpb25cIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF93YWl0Rm9yQ29ubmVjdGlvbihjYWxsYmFjaywgaW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLndzICYmIHRoaXMud3MucmVhZHlTdGF0ZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIG9wdGlvbmFsOiBpbXBsZW1lbnQgYmFja29mZiBmb3IgaW50ZXJ2YWwgaGVyZVxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLndhaXRGb3JDb25uZWN0aW9uKGNhbGxiYWNrLCBpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgfSwgaW50ZXJ2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiX2RlY29kZUFuZFNwbGl0XCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZGVjb2RlQW5kU3BsaXQoYmluYXJ5QmxvYiwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHZhciBmID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgICAgIGYub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlLnRhcmdldC5yZXN1bHQuc3BsaXQoXCJcXG5cIiwgMykpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGYucmVhZEFzVGV4dChiaW5hcnlCbG9iKTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcIl9oYW5kbGVNZXNzYWdlXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfaGFuZGxlTWVzc2FnZShtZXRhLCBoZWFkZXIsIGJvZHkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibXNnIFwiICsgbWV0YSArIFwiXFxuXCIgKyBoZWFkZXIgKyBcIlxcblwiICsgYm9keSk7XG4gICAgICAgICAgICBpZiAodGhpcy5vbk1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uTWVzc2FnZShtZXRhLCBoZWFkZXIsIGJvZHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiX2hhbmRsZU5vdGlmaWNhdGlvblwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2hhbmRsZU5vdGlmaWNhdGlvbihtZXRhLCBoZWFkZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm90aWZpY2F0aW9uIFwiICsgbWV0YSArIChoZWFkZXIgPyBcIlxcblwiICsgaGVhZGVyIDogXCJcIikpO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiX2hhbmRsZUVycm9yXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfaGFuZGxlRXJyb3IobWV0YSwgaGVhZGVyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIFwiICsgbWV0YSArIFwiXFxuXCIgKyBoZWFkZXIpO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiX2hhbmRsZUluY29tbWluZ1wiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2hhbmRsZUluY29tbWluZyhyYXdNc2cpIHtcbiAgICAgICAgICAgIHRoaXMuX2RlY29kZUFuZFNwbGl0KHJhd01zZy5kYXRhLCBmdW5jdGlvbiAocGFydHMpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFydHNbMF0ubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocGFydHNbMF0ubWF0Y2goL14jLykpIHtcblxuICAgICAgICAgICAgICAgICAgICBfaGFuZGxlTm90aWZpY2F0aW9uKHBhcnRzWzBdLCBwYXJ0cy5sZW5ndGggPiAxID8gcGFydHNbMV0gOiB1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGFydHNbMF0ubWF0Y2goL14hLykpIHtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVFcnJvcihwYXJ0c1swXSwgcGFydHMubGVuZ3RoID4gMSA/IHBhcnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIF9oYW5kbGVNZXNzYWdlKHBhcnRzWzBdLCBwYXJ0cy5sZW5ndGggPiAxID8gcGFydHNbMV0gOiB1bmRlZmluZWQsIHBhcnRzLmxlbmd0aCA+IDIgPyBwYXJ0c1syXSA6IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gR3VibGU7XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEd1YmxlOyJdfQ==
