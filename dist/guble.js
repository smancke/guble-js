(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
* The Guble client libary, implements the websocket
* protocol for the guble Guble message server.
*
* https://github.com/smancke/guble
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

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
        this.onMessageCallback = undefined;
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
            var _this = this;

            var url = this.baseUrl.replace(/^https:\/\//, "wss://").replace(/^http:\/\//, "ws://").replace(/\/$/, "");

            var fullUrl = url + "/stream/" + userId;
            console.log("[guble] connect to: " + fullUrl);
            this.ws = new WebSocket(fullUrl);
            this.ws.onmessage = function (msg) {
                return _this._handleIncomming(msg);
            };
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
            this.onMessageCallback = callback;
        }
    }, {
        key: "_waitForConnection",
        value: function _waitForConnection(callback, interval) {
            var _this2 = this;

            if (this.ws && this.ws.readyState === 1) {
                callback();
            } else {
                // optional: implement backoff for interval here
                setTimeout(function () {
                    _this2._waitForConnection(callback, interval);
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
            var _this3 = this;

            this._decodeAndSplit(rawMsg.data, function (parts) {
                if (parts[0].length == 0) {
                    return;
                }
                if (parts[0].match(/^#/)) {

                    _this3._handleNotification(parts[0], parts.length > 1 ? parts[1] : undefined);
                } else if (parts[0].match(/^!/)) {

                    _this3._handleError(parts[0], parts.length > 1 ? parts[1] : undefined);
                } else {

                    _handleMessage(parts[0], parts.length > 1 ? parts[1] : undefined, parts.length > 2 ? parts[2] : undefined);
                }
            });
        }
    }]);

    return Guble;
})();

exports["default"] = Guble;
module.exports = exports["default"];
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuKiBUaGUgR3VibGUgY2xpZW50IGxpYmFyeSwgaW1wbGVtZW50cyB0aGUgd2Vic29ja2V0XG4qIHByb3RvY29sIGZvciB0aGUgZ3VibGUgR3VibGUgbWVzc2FnZSBzZXJ2ZXIuXG4qXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9zbWFuY2tlL2d1YmxlXG4qL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgR3VibGUgPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgLypcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGhlIGJhc2Ugd2Vic29ja2V0IHVybC4gSWYgbm9uZSBpcyBnaXZlbiwgd2luZG93LmxvY2F0aW9uLmhyZWYgaXMgdXNlZC4uXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBHdWJsZShiYXNlVXJsKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBHdWJsZSk7XG5cbiAgICAgICAgdGhpcy5iYXNlVXJsID0gYmFzZVVybCB8fCB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgICAgdGhpcy53cyA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5vbk1lc3NhZ2VDYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoR3VibGUsIFt7XG4gICAgICAgIGtleTogXCJjbG9zZVwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy53cykge1xuICAgICAgICAgICAgICAgIHRoaXMud3MuY2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcImNvbm5lY3RcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbm5lY3QodXNlcklkKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICB2YXIgdXJsID0gdGhpcy5iYXNlVXJsLnJlcGxhY2UoL15odHRwczpcXC9cXC8vLCBcIndzczovL1wiKS5yZXBsYWNlKC9eaHR0cDpcXC9cXC8vLCBcIndzOi8vXCIpLnJlcGxhY2UoL1xcLyQvLCBcIlwiKTtcblxuICAgICAgICAgICAgdmFyIGZ1bGxVcmwgPSB1cmwgKyBcIi9zdHJlYW0vXCIgKyB1c2VySWQ7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltndWJsZV0gY29ubmVjdCB0bzogXCIgKyBmdWxsVXJsKTtcbiAgICAgICAgICAgIHRoaXMud3MgPSBuZXcgV2ViU29ja2V0KGZ1bGxVcmwpO1xuICAgICAgICAgICAgdGhpcy53cy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLl9oYW5kbGVJbmNvbW1pbmcobXNnKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJzZW5kUmF3XCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZW5kUmF3KHJhd0RhdGEpIHtcbiAgICAgICAgICAgIHRoaXMud3Muc2VuZChyYXdEYXRhKTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcInNlbmRNZXNzYWdlXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZW5kTWVzc2FnZShwYXRoLCBib2R5LCBvcHRpb25hbEhlYWRlcikge1xuICAgICAgICAgICAgdGhpcy53cy5zZW5kKFwiPiBcIiArIHBhdGggKyBcIlxcblwiICsgKG9wdGlvbmFsSGVhZGVyID8gb3B0aW9uYWxIZWFkZXIgOiBcIlwiKSArIFwiXFxuXCIgKyBib2R5KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcIm9uT3BlblwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25PcGVuKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLl93YWl0Rm9yQ29ubmVjdGlvbihjYWxsYmFjaywgMTApO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwib25NZXNzYWdlXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbk1lc3NhZ2UoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMub25NZXNzYWdlQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcIl93YWl0Rm9yQ29ubmVjdGlvblwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX3dhaXRGb3JDb25uZWN0aW9uKGNhbGxiYWNrLCBpbnRlcnZhbCkge1xuICAgICAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLndzICYmIHRoaXMud3MucmVhZHlTdGF0ZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIG9wdGlvbmFsOiBpbXBsZW1lbnQgYmFja29mZiBmb3IgaW50ZXJ2YWwgaGVyZVxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpczIuX3dhaXRGb3JDb25uZWN0aW9uKGNhbGxiYWNrLCBpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgfSwgaW50ZXJ2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiX2RlY29kZUFuZFNwbGl0XCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZGVjb2RlQW5kU3BsaXQoYmluYXJ5QmxvYiwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHZhciBmID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgICAgIGYub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlLnRhcmdldC5yZXN1bHQuc3BsaXQoXCJcXG5cIiwgMykpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGYucmVhZEFzVGV4dChiaW5hcnlCbG9iKTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcIl9oYW5kbGVNZXNzYWdlXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfaGFuZGxlTWVzc2FnZShtZXRhLCBoZWFkZXIsIGJvZHkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibXNnIFwiICsgbWV0YSArIFwiXFxuXCIgKyBoZWFkZXIgKyBcIlxcblwiICsgYm9keSk7XG4gICAgICAgICAgICBpZiAodGhpcy5vbk1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uTWVzc2FnZShtZXRhLCBoZWFkZXIsIGJvZHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiX2hhbmRsZU5vdGlmaWNhdGlvblwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2hhbmRsZU5vdGlmaWNhdGlvbihtZXRhLCBoZWFkZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm90aWZpY2F0aW9uIFwiICsgbWV0YSArIChoZWFkZXIgPyBcIlxcblwiICsgaGVhZGVyIDogXCJcIikpO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiX2hhbmRsZUVycm9yXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfaGFuZGxlRXJyb3IobWV0YSwgaGVhZGVyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yIFwiICsgbWV0YSArIFwiXFxuXCIgKyBoZWFkZXIpO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiX2hhbmRsZUluY29tbWluZ1wiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2hhbmRsZUluY29tbWluZyhyYXdNc2cpIHtcbiAgICAgICAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLl9kZWNvZGVBbmRTcGxpdChyYXdNc2cuZGF0YSwgZnVuY3Rpb24gKHBhcnRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnRzWzBdLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBhcnRzWzBdLm1hdGNoKC9eIy8pKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgX3RoaXMzLl9oYW5kbGVOb3RpZmljYXRpb24ocGFydHNbMF0sIHBhcnRzLmxlbmd0aCA+IDEgPyBwYXJ0c1sxXSA6IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJ0c1swXS5tYXRjaCgvXiEvKSkge1xuXG4gICAgICAgICAgICAgICAgICAgIF90aGlzMy5faGFuZGxlRXJyb3IocGFydHNbMF0sIHBhcnRzLmxlbmd0aCA+IDEgPyBwYXJ0c1sxXSA6IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICBfaGFuZGxlTWVzc2FnZShwYXJ0c1swXSwgcGFydHMubGVuZ3RoID4gMSA/IHBhcnRzWzFdIDogdW5kZWZpbmVkLCBwYXJ0cy5sZW5ndGggPiAyID8gcGFydHNbMl0gOiB1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIEd1YmxlO1xufSkoKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBHdWJsZTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07Il19
