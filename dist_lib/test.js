"use strict";

var pathlib = require("path"),
    SarahJS = require(pathlib.join(__dirname, "sarah.js")),
    assert = require("assert");

describe("envUtils", function () {
  describe("isNode", function () {
    it("should return true if running in node", function () {
      assert.equal(SarahJS.envUtils.isNode(), true);
    });
  });
  describe("isBrowser", function () {
    it("should return false if running in node", function () {
      assert.equal(SarahJS.envUtils.isBrowser(), false);
    });
  });
  describe("isNotCompatible", function () {
    it("should return false if running in node or a web browser", function () {
      assert.equal(SarahJS.envUtils.isNotCompatible(), false);
    });
  });
});
describe("webNodeInterop", function () {
  var timeout = null;
  describe("noop", function () {
    it("should return undefined", function () {
      assert.equal(SarahJS.webNodeInterop.noop(), undefined);
    });
  });
  describe("sleep", function () {
    it("should sleep", function () {
      SarahJS.webNodeInterop.sleep(3000).then(function () {
        assert.equal(true, true);
      });
      timeout = setTimeout(function () {
        return assert.equal(true, false);
      }, 4000);
    });
    after(function () {
      clearTimeout(timeout);
    });
  });
  describe("config", function () {
    var os = require("os");

    var config_path = pathlib.join(os.homedir(), "sarah.js-config.test.json");
    var config = SarahJS.config_placeholder;
    it("write config", function () {
      SarahJS.webNodeInterop.config({
        mode: "w",
        path: config_path,
        config: config
      });
    });
    it("read config", function () {
      var iconfig = SarahJS.webNodeInterop.config({
        mode: "r",
        path: config_path
      });
      assert.deepEqual(iconfig, config);
    });
  });
});