const ws = require('nodejs-websocket');
const server = ws.createServer((conn) => {
	conn.on('text', (str) => {
		broadcast(str);
	});
	conn.on('error', (err) => {
		console.log(err);
	});
});
server.listen(3000, function () {
	console.log('open');
});
// 群发消息
function broadcast(data) {
	server.connections.forEach((conn) => {
		conn.sendText(data);
	});
}
