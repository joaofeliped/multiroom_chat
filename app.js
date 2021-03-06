var app = require('./config/server');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
	console.log('Servidor on');
});

var io = require('socket.io').listen(server);

app.set('io', io);

io.on('connection', function(socket){
	console.log('usuário conectou');

	socket.on('disconnect', function(){
		console.log('Usuário desconectou');
	});

	socket.on('msgParaServidor', function(data){

		/* dialogo */
		socket.emit('msgParaCliente', {apelido: data.apelido, mensagem: data.mensagem});
		socket.broadcast.emit('msgParaCliente', {apelido: data.apelido, mensagem: data.mensagem});

		/* participantes */
		if(parseInt(data.apelido_atualizado_nos_clientes) === 0) {
			socket.emit('participantesParaCliente', {apelido: data.apelido});
			socket.broadcast.emit('participantesParaCliente', {apelido: data.apelido});
		}
	});
});