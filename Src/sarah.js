/**
 * @file sarah.js
 * @author MXPSQL
 */

if(typeof SarahJS === 'undefined') {
    /**
     * @name SarahJS
     * @namespace SarahJS logics are hidden here
     */
    const SarahJS = (() => {
        /**
         * Freeze object recursively
         * @param {Object} obj the object to freeze
         */
        let recursive_freezer = (obj) => {
            // freeze recursively
            for(let iel in obj) {
                if(typeof obj[iel] === 'object') {
                    recursive_freezer(obj[iel]);
                }
                Object.freeze(obj[iel]);
            }
        }



        const imodules = {
            play_sound: require('play-sound'),
        };
        recursive_freezer(imodules);

        const author = "MXPSQL";
        const version = "1.0.0";

        const sarahjs_config = "sarah.js-config";
        const sarahjs_config_json = sarahjs_config + ".json";
        const sarahjs_config_placeholder = {
            "sarah": ".js"
        };

        let envUtils = {
            /**
             * Is it nodejs
             * @returns is nodejs
             */
            "isNode": () => {
                return (typeof window === 'undefined' && (typeof process === 'object') && (typeof require === 'function'));
            },
            /**
             * Is it a web browser
             * @returns is web browser
             */
            "isBrowser": () => {return !envUtils.isNode();},
            /**
             * Not a web browser and nodejs
             * @returns is not browser and nodejs
             */
            "isNotCompatible": () => {
                return !envUtils.isBrowser() && !envUtils.isNode();
            }
        };
        recursive_freezer(envUtils);

        let strUtils = {
            /**
             * Format a string
             * @param {string} string format
             * @param  {...any} args arguments for formatting
             * @returns formatted string
             */
            "strFmt": (string, ...args) => {
                for(let i = 0; i < args.length; i++) {
                    string = string.replace(`{${i}}`, args[i]);
                }

                return string;
            },
            /**
             * Generate a random string
             * @param {number} len how long to create
             * @param {string} charset the character set
             * @returns the random string
             */
            "genRandomStr": (len, charset) => {
                let str = '';
                let l = len || 6;
                let cset = charset || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                for (let i = 0; i < l; i++) {
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
            "mktmp": (template, opt) => {
                let options = opt || {
                    "len": 6,
                    "charset": null,
                };

                let str = strUtils.genRandomStr(options.len, options.charset);
                return strUtils.strFmt(template, str);
            }
        };
        recursive_freezer(strUtils);

        const webNodeInterop = {
            /**
             * do nothing at all
             * @param  {...any} _vaargs ignored
             * @returns undefined as if nothing is returned
             */
            "noop": (..._vaargs) => {return undefined;},
            /**
             * Sleep for a given amount of time.
             * @param {number} ms milliseconds to sleep
             * @returns a promise
             */
            "sleep": (ms) => {
                return new Promise(resolve => setTimeout(resolve, ms));
            },
            /**
             * construct an audio player
             * @param {string} src the sound file
             * @param {Object} opts options
             * @returns the audio player
             */
            "audioPlayer": (src, opts) => {
                class AudioPlayer{
                    constructor(isrc){
                        this.src = isrc;
                    }

                    play(_options, next){if(next) next();}

                    pause(next){if(next) next();}

                    stop(next){if(next) next();}

                    getStatus(){
                        return null;
                    }

                    setTime(_time, next){if(next) next();}

                    getTime(){return null;}

                    setVolume(_volume, next){if(next) next();}

                    getVolume(){return null;}

                    setSrc(isrc, next){
                        this.src = isrc;
                        if(next) next();
                    }

                    getSrc(){
                        return this.src;
                    }
                }

                class NodeJSAudioPlayer extends AudioPlayer{
                    constructor(isrc, iopts){
                        super(isrc);
                        this.player = imodules.play_sound(iopts);
                    }

                    play(options, next){
                        this.player.play(this.src, options, next);
                    }
                }

                class HTML5AudioPlayer extends AudioPlayer{
                    constructor(isrc){
                        super(isrc);

                        this.player = document.createElement('audio');
                        this.player.src = this.src;
                    }

                    play(_options, next){
                        this.player.play();

                        if(next) next();
                    }

                    pause(next){
                        this.player.pause();
                        if(next) next();
                    }

                    stop(next){
                        this.pause();
                        this.setTime(0);
                        if(next) next();
                    }

                    getStatus(){
                        return this.player.paused ? 'paused' : 'playing';
                    }

                    setTime(time, next){
                        this.player.currentTime = time;
                        if(next) next();
                    }

                    getTime(){
                        return this.player.currentTime;
                    }

                    setVolume(volume, next){
                        this.player.volume = volume;
                        if(next) next();
                    }

                    getVolume(){
                        return this.player.volume;
                    }

                    setSrc(isrc, next){
                        this.player.src = isrc;
                        if(next) next();
                    }

                    getSrc(){
                        return this.player.src;
                    }
                }

                if(envUtils.isNotCompatible()) return null;

                if(envUtils.isNode()) return new NodeJSAudioPlayer(src, opts);
                else return new HTML5AudioPlayer(src, opts);
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
            "config": (options) => {
                // stores in localstorage or file using fs
                let opts = options || {
                    mode: "r",
                    path: null,
                    config: sarahjs_config_placeholder,
                    data: sarahjs_config_placeholder
                };

                if(envUtils.isNotCompatible()) return null;
                if(envUtils.isNode()){
                    const fs = require('fs');
                    const os = require('os');
                    const pathlib = require('path');
                    let cpath = "";
                    if(opts.path == null){
                        cpath = pathlib.join(os.homedir(), sarahjs_config_json);
                    }
                    else{
                        cpath = opts.path;
                    }

                    if(opts.mode == "r"){
                        return JSON.parse(fs.readFileSync(cpath, 'utf8'));
                    }
                    else if(opts.mode == "w"){
                        fs.writeFileSync(cpath, JSON.stringify(opts.config || opts.data));
                    }
                    else{
                        throw new Error("Invalid mode");
                    }
                }
                else{
                    const localStorage = window.localStorage;
                    let ipath = "";
                    if(opts.path == null){
                        ipath = sarahjs_config;
                    }
                    else{
                        ipath = opts.path;
                    }

                    if(opts.mode == "r"){
                        return JSON.parse(localStorage.getItem(ipath));
                    }
                    else if(opts.mode == "w"){
                        localStorage.setItem(ipath, JSON.stringify(opts.config || opts.data));
                    }
                    else{
                        throw new Error("Invalid mode");
                    }
                }
            },
            /**
             * 
             * @param {string} id the url or module of the script to be required
             * @returns the module or element
             */
            "require": (id) => {
                let mod = null;
                if(envUtils.isNotCompatible()) throw new Error("Incompatible environment");

                if(envUtils.isNode()){
                    mod = require(id);
                }
                else{
                    mod = document.createElement('script');
                    mod.src = id;
                    document.body.appendChild(mod);
                }
                return mod;
            }
        };

        let monkeyPatchExtensions = () => {
            // common
            {
                // monkeypatch strUtils
                if(!String.fmt) String.fmt = webNodeInterop.strFmt;
                if(!String.genRandomStr) String.genRandomStr = strUtils.genRandomStr;
                if(!String.mktmp) String.mktmp = strUtils.mktmp;

                // monkeypatch webNodeInterop.config
                if(!JSON.config) JSON.config = webNodeInterop.config;
            }

            // environment specific
            if(envUtils.isBrowser()){
                {
                    // monkeypatch webnodeinterop
                    if(!window.noop) window.noop = webNodeInterop.noop;
                    if(!window.sleep) window.sleep = webNodeInterop.sleep;
                    if(!window.audioPlayer) window.audioPlayer = webNodeInterop.audioPlayer;
                    if(!window.require) window.require = webNodeInterop.require;
                }

                {
                    // monkeypatch evnUtils
                    if(!window.isNode) window.isNode = envUtils.isNode;
                    if(!window.isBrowser) window.isBrowser = envUtils.isBrowser;
                    if(!window.isNotCompatible) window.isNotCompatible = envUtils.isNotCompatible;
                }
            }
            else{
                {
                    // monkeypatch webnodeinterop
                    if(!global.noop) global.noop = webNodeInterop.noop;
                    if(!global.sleep) global.sleep = webNodeInterop.sleep;
                    if(!global.audioPlayer) global.audioPlayer = webNodeInterop.audioPlayer;
                    if(!global.require) global.require = webNodeInterop.require;
                }

                {
                    // monkeypatch evnUtils
                    if(!global.isNode) global.isNode = envUtils.isNode;
                    if(!global.isBrowser) global.isBrowser = envUtils.isBrowser;
                    if(!global.isNotCompatible) global.isNotCompatible = envUtils.isNotCompatible;
                }
            }
        }

        const out = {
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
    })();

    if(SarahJS.envUtils.isNode()){
        module.exports = SarahJS;

        // check if main
        if(require.main === module) {
            console.log("Sarah.JS demonstration");
            SarahJS.webNodeInterop.config({
                mode: "w",
                config: SarahJS.config_placeholder
            });

            console.log(SarahJS.webNodeInterop.config({
                mode: "r"
            }));
        }
    }
    else{
        window.SarahJS = SarahJS;
    }
}