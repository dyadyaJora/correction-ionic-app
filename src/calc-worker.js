var Kr = 0.299;
var Kb = 0.114;

self.addEventListener('install', function(event) {
    console.log('install', event);
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    console.log('Активирован');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('message', function(event) {
  var image = event.data.imageData;
  var timestamp = event.data.timestamp;
  var w_step = parseInt(image.width / 10);
  var h_step = parseInt(image.height / 10);
	var sum = 0;
  var r, g, b;
  for (var i = 0; i < h_step; i++) {
  	for (var j = 0; j < w_step; j++) {
	  	var ind = i * image.height * 10 * 4 + j * 10 * 4;
	  	var r = image.data[ind];
	  	var g = image.data[ind + 1];
	  	var b = image.data[ind + 2];
	  	var y = Kr * r + (1 - Kr - Kb) * g + Kb * b;
	  	sum += y;
	  }
  }
  sum = Math.round(sum);
  event.ports[0].postMessage({
  	timestamp: timestamp,
  	sum: sum
  });
  console.log('sum == ', sum);
});
