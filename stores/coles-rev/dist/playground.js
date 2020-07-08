"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readLineFromFile = void 0;

var _fs = _interopRequireDefault(require("fs"));

var readLineFromFile = function readLineFromFile(filePath) {
  var fileData = _fs["default"].readFileSync(filePath, 'utf8');

  return fileData.split('\n').map(function (line) {
    return line.replace(/\r/g, '');
  });
};

exports.readLineFromFile = readLineFromFile;