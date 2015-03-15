/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Parser = require('./parser.model');

exports.register = function(socket) {
  Parser.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Parser.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('parser:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('parser:remove', doc);
}