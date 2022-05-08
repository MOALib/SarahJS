"use strict";

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.json.stringify.js");

require("core-js/modules/es.regexp.to-string.js");

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * @file sarah.js
 * @author MXPSQL
 */
if (typeof SarahJS === 'undefined') {
  /**
   * @name SarahJS
   * @namespace SarahJS logics are hidden here
   */
  var _SarahJS = function () {
    /**
     * Freeze object recursively
     * @param {Object} obj the object to freeze
     */
    var recursive_freezer = function recursive_freezer(obj) {
      // freeze recursively
      for (var iel in obj) {
        if (typeof obj[iel] === 'object') {
          recursive_freezer(obj[iel]);
        }

        Object.freeze(obj[iel]);
      }
    };

    var imodules = {
      play_sound: require('play-sound')
    };
    recursive_freezer(imodules);
    var author = "MXPSQL";
    var version = "1.0.0";
    var sarahjs_config = "sarah.js-config";
    var sarahjs_config_json = sarahjs_config + ".json";
    var sarahjs_config_placeholder = {
      "sarah": ".js"
    };
    var envUtils = {
      /**
       * Is it nodejs
       * @returns is nodejs
       */
      "isNode": function isNode() {
        return typeof window === 'undefined' && typeof process === 'object' && typeof require === 'function';
      },

      /**
       * Is it a web browser
       * @returns is web browser
       */
      "isBrowser": function isBrowser() {
        return !envUtils.isNode();
      },

      /**
       * Not a web browser and nodejs
       * @returns is not browser and nodejs
       */
      "isNotCompatible": function isNotCompatible() {
        return !envUtils.isBrowser() && !envUtils.isNode();
      }
    };
    recursive_freezer(envUtils);
    var strUtils = {
      /**
       * Format a string
       * @param {string} string format
       * @param  {...any} args arguments for formatting
       * @returns formatted string
       */
      "strFmt": function strFmt(string) {
        for (var i = 0; i < (arguments.length <= 1 ? 0 : arguments.length - 1); i++) {
          string = string.replace("{".concat(i, "}"), i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1]);
        }

        return string;
      },

      /**
       * Generate a random string
       * @param {number} len how long to create
       * @param {string} charset the character set
       * @returns the random string
       */
      "genRandomStr": function genRandomStr(len, charset) {
        var str = '';
        var l = len || 6;
        var cset = charset || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < l; i++) {
          str += cset.charAt(Math.floor(Math.random() * cset.length));
        }

        return str;
      },

      /**
       * make name (can be temporary file)
       * @param {*} template the template for the name
       * @param {*} opt options to be passed to genRandomStr
       * @returns the name
       * 
       * @see genRandomStr
       */
      "mktmp": function mktmp(template, opt) {
        var options = opt || {
          "len": 6,
          "charset": null
        };
        var str = strUtils.genRandomStr(options.len, options.charset);
        return strUtils.strFmt(template, str);
      }
    };
    recursive_freezer(strUtils);
    var webNodeInterop = {
      /**
       * do nothing at all
       * @param  {...any} _vaargs ignored
       * @returns undefined as if nothing is returned
       */
      "noop": function noop() {
        return undefined;
      },

      /**
       * Sleep for a given amount of time.
       * @param {number} ms milliseconds to sleep
       * @returns a promise
       */
      "sleep": function sleep(ms) {
        return new Promise(function (resolve) {
          return setTimeout(resolve, ms);
        });
      },

      /**
       * construct an audio player
       * @param {string} src the sound file
       * @param {Object} opts options
       * @returns the audio player
       */
      "audioPlayer": function audioPlayer(src, opts) {
        var AudioPlayer = /*#__PURE__*/function () {
          function AudioPlayer(isrc) {
            _classCallCheck(this, AudioPlayer);

            this.src = isrc;
          }

          _createClass(AudioPlayer, [{
            key: "play",
            value: function play(_options, next) {
              if (next) next();
            }
          }, {
            key: "pause",
            value: function pause(next) {
              if (next) next();
            }
          }, {
            key: "stop",
            value: function stop(next) {
              if (next) next();
            }
          }, {
            key: "getStatus",
            value: function getStatus() {
              return null;
            }
          }, {
            key: "setTime",
            value: function setTime(_time, next) {
              if (next) next();
            }
          }, {
            key: "getTime",
            value: function getTime() {
              return null;
            }
          }, {
            key: "setVolume",
            value: function setVolume(_volume, next) {
              if (next) next();
            }
          }, {
            key: "getVolume",
            value: function getVolume() {
              return null;
            }
          }, {
            key: "setSrc",
            value: function setSrc(isrc, next) {
              this.src = isrc;
              if (next) next();
            }
          }, {
            key: "getSrc",
            value: function getSrc() {
              return this.src;
            }
          }]);

          return AudioPlayer;
        }();

        var NodeJSAudioPlayer = /*#__PURE__*/function (_AudioPlayer) {
          _inherits(NodeJSAudioPlayer, _AudioPlayer);

          var _super = _createSuper(NodeJSAudioPlayer);

          function NodeJSAudioPlayer(isrc, iopts) {
            var _this;

            _classCallCheck(this, NodeJSAudioPlayer);

            _this = _super.call(this, isrc);
            _this.player = imodules.play_sound(iopts);
            return _this;
          }

          _createClass(NodeJSAudioPlayer, [{
            key: "play",
            value: function play(options, next) {
              this.player.play(this.src, options, next);
            }
          }]);

          return NodeJSAudioPlayer;
        }(AudioPlayer);

        var HTML5AudioPlayer = /*#__PURE__*/function (_AudioPlayer2) {
          _inherits(HTML5AudioPlayer, _AudioPlayer2);

          var _super2 = _createSuper(HTML5AudioPlayer);

          function HTML5AudioPlayer(isrc) {
            var _this2;

            _classCallCheck(this, HTML5AudioPlayer);

            _this2 = _super2.call(this, isrc);
            _this2.player = document.createElement('audio');
            _this2.player.src = _this2.src;
            return _this2;
          }

          _createClass(HTML5AudioPlayer, [{
            key: "play",
            value: function play(_options, next) {
              this.player.play();
              if (next) next();
            }
          }, {
            key: "pause",
            value: function pause(next) {
              this.player.pause();
              if (next) next();
            }
          }, {
            key: "stop",
            value: function stop(next) {
              this.pause();
              this.setTime(0);
              if (next) next();
            }
          }, {
            key: "getStatus",
            value: function getStatus() {
              return this.player.paused ? 'paused' : 'playing';
            }
          }, {
            key: "setTime",
            value: function setTime(time, next) {
              this.player.currentTime = time;
              if (next) next();
            }
          }, {
            key: "getTime",
            value: function getTime() {
              return this.player.currentTime;
            }
          }, {
            key: "setVolume",
            value: function setVolume(volume, next) {
              this.player.volume = volume;
              if (next) next();
            }
          }, {
            key: "getVolume",
            value: function getVolume() {
              return this.player.volume;
            }
          }, {
            key: "setSrc",
            value: function setSrc(isrc, next) {
              this.player.src = isrc;
              if (next) next();
            }
          }, {
            key: "getSrc",
            value: function getSrc() {
              return this.player.src;
            }
          }]);

          return HTML5AudioPlayer;
        }(AudioPlayer);

        if (envUtils.isNotCompatible()) return null;
        if (envUtils.isNode()) return new NodeJSAudioPlayer(src, opts);else return new HTML5AudioPlayer(src, opts);
      },

      /**
       * 
       * @param {Object} options the options, contains mode, path or the config object itself
       * the mode can be either r or w
       * the path should be null for default
       * the config object is empty for default, fill it with your own config
       * 
       * @returns the config or none
       */
      "config": function config(options) {
        // stores in localstorage or file using fs
        var opts = options || {
          mode: "r",
          path: null,
          config: sarahjs_config_placeholder,
          data: sarahjs_config_placeholder
        };
        if (envUtils.isNotCompatible()) return null;

        if (envUtils.isNode()) {
          var fs = require('fs');

          var os = require('os');

          var pathlib = require('path');

          var cpath = "";

          if (opts.path == null) {
            cpath = pathlib.join(os.homedir(), sarahjs_config_json);
          } else {
            cpath = opts.path;
          }

          if (opts.mode == "r") {
            return JSON.parse(fs.readFileSync(cpath, 'utf8'));
          } else if (opts.mode == "w") {
            fs.writeFileSync(cpath, JSON.stringify(opts.config || opts.data));
          } else {
            throw new Error("Invalid mode");
          }
        } else {
          var localStorage = window.localStorage;
          var ipath = "";

          if (opts.path == null) {
            ipath = sarahjs_config;
          } else {
            ipath = opts.path;
          }

          if (opts.mode == "r") {
            return JSON.parse(localStorage.getItem(ipath));
          } else if (opts.mode == "w") {
            localStorage.setItem(ipath, JSON.stringify(opts.config || opts.data));
          } else {
            throw new Error("Invalid mode");
          }
        }
      },

      /**
       * 
       * @param {string} id the url or module of the script to be required
       * @returns the module or element
       */
      "require": function (_require) {
        function require(_x) {
          return _require.apply(this, arguments);
        }

        require.toString = function () {
          return _require.toString();
        };

        return require;
      }(function (id) {
        var mod = null;
        if (envUtils.isNotCompatible()) throw new Error("Incompatible environment");

        if (envUtils.isNode()) {
          mod = require(id);
        } else {
          mod = document.createElement('script');
          mod.src = id;
          document.body.appendChild(mod);
        }

        return mod;
      })
    };

    var monkeyPatchExtensions = function monkeyPatchExtensions() {
      // common
      {
        // monkeypatch strUtils
        if (!String.fmt) String.fmt = webNodeInterop.strFmt;
        if (!String.genRandomStr) String.genRandomStr = strUtils.genRandomStr;
        if (!String.mktmp) String.mktmp = strUtils.mktmp; // monkeypatch webNodeInterop.config

        if (!JSON.config) JSON.config = webNodeInterop.config;
      } // environment specific

      if (envUtils.isBrowser()) {
        {
          // monkeypatch webnodeinterop
          if (!window.noop) window.noop = webNodeInterop.noop;
          if (!window.sleep) window.sleep = webNodeInterop.sleep;
          if (!window.audioPlayer) window.audioPlayer = webNodeInterop.audioPlayer;
          if (!window.require) window.require = webNodeInterop.require;
        }
        {
          // monkeypatch evnUtils
          if (!window.isNode) window.isNode = envUtils.isNode;
          if (!window.isBrowser) window.isBrowser = envUtils.isBrowser;
          if (!window.isNotCompatible) window.isNotCompatible = envUtils.isNotCompatible;
        }
      } else {
        {
          // monkeypatch webnodeinterop
          if (!global.noop) global.noop = webNodeInterop.noop;
          if (!global.sleep) global.sleep = webNodeInterop.sleep;
          if (!global.audioPlayer) global.audioPlayer = webNodeInterop.audioPlayer;
          if (!global.require) global.require = webNodeInterop.require;
        }
        {
          // monkeypatch evnUtils
          if (!global.isNode) global.isNode = envUtils.isNode;
          if (!global.isBrowser) global.isBrowser = envUtils.isBrowser;
          if (!global.isNotCompatible) global.isNotCompatible = envUtils.isNotCompatible;
        }
      }
    };

    var out = {
      "author": author,
      "version": version,
      "config_placeholder": sarahjs_config_placeholder,
      "monkeyPatchExtensions": monkeyPatchExtensions,
      "recursiveFreezer": recursive_freezer,
      "envUtils": {
        "isNode": envUtils.isNode,
        "isBrowser": envUtils.isBrowser,
        "isNotCompatible": envUtils.isNotCompatible
      },
      "strUtils": {
        "strFmt": strUtils.strFmt,
        "genRandomStr": strUtils.genRandomStr,
        "mktmp": strUtils.mktmp
      },
      "webNodeInterop": {
        "noop": webNodeInterop.noop,
        "sleep": webNodeInterop.sleep,
        "audioPlayer": webNodeInterop.audioPlayer,
        "config": webNodeInterop.config,
        "require": webNodeInterop.require
      }
    };
    recursive_freezer(out);
    return out;
  }();

  if (_SarahJS.envUtils.isNode()) {
    module.exports = _SarahJS; // check if main

    if (require.main === module) {
      console.log("Sarah.JS demonstration");

      _SarahJS.webNodeInterop.config({
        mode: "w",
        config: _SarahJS.config_placeholder
      });

      console.log(_SarahJS.webNodeInterop.config({
        mode: "r"
      }));
    }
  } else {
    window.SarahJS = _SarahJS;
  }
}