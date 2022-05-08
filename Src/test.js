const pathlib = require("path"), SarahJS = require(pathlib.join(__dirname, "sarah.js")), assert = require("assert");

describe("envUtils", () => {
    describe("isNode", () => {
        it("should return true if running in node", () => {assert.equal(SarahJS.envUtils.isNode(), true);});
    });

    describe("isBrowser", () => {
        it("should return false if running in node", () => {assert.equal(SarahJS.envUtils.isBrowser(), false);});
    });

    describe("isNotCompatible", () => {
        it("should return false if running in node or a web browser", () => {
            assert.equal(SarahJS.envUtils.isNotCompatible(), false);
        });
    });
});

describe("webNodeInterop", () => {
    var timeout = null;
    describe("noop", () => {
        it("should return undefined", () => {assert.equal(SarahJS.webNodeInterop.noop(), undefined)});
    });

    describe("sleep", () => {
        it("should sleep", () => {
            SarahJS.webNodeInterop.sleep(3000).then(() => {
                assert.equal(true, true);
            });
            timeout = setTimeout(() => assert.equal(true, false), 4000);
        });

        after(() => {
            clearTimeout(timeout);
        });
    });

    describe("config", () => {
        const os = require("os");

        const config_path = pathlib.join(os.homedir(), "sarah.js-config.test.json");
        const config = SarahJS.config_placeholder;

        it("write config", () => {
            SarahJS.webNodeInterop.config({
                mode: "w",
                path: config_path,
                config: config
            });
        });

        it("read config", () => {
            var iconfig = SarahJS.webNodeInterop.config({
                mode: "r",
                path: config_path
            });

            assert.deepEqual(iconfig, config);
        });
    });
});