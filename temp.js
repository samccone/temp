var five  = require('johnny-five');
var net   = require('net');
var _     = require('underscore');
var clients = [];

var emiter  = _.throttle(function(v){_.each(clients, function(c) {
  try {
    c.write(v + "\n")
  } catch (e) {}})
}, 5000);

five.Board().on('ready', function() {
  var sensor = new five.Sensor("A0");

  sensor.on("data", function() {
    var voltage = this.value * 0.004882814;
    var celsius = (voltage - 0.5) * 100;
    var fahrenheit = celsius * (9 / 5) + 32;
    emiter(~~fahrenheit + " F");
  });
});

net.createServer(function(socket) {
  console.log("-- new connecton --");
  clients.push(socket);
  socket.on('end', function() {
    clients.splice(clients.indexOf(socket), 1);
    socket.destroy();
  });

  socket.on('error', function() {});
}).listen(3000);
