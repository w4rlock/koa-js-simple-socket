io = io.connect()
//ss = require('socket.io-stream');

setInterval(function(){
	io.emit('player:nowplaying');
}, 2000);


io.on('player:nowplaying',	function(data) {
	$('.marquee').text(data.artist+' :: '+data.album+' :: '+data.title);
});


io.emit('playlist:current');
io.on('playlist:current', function(songs){
	for (var i in songs){
		$('.collection').append('<a id="song_'+i+'" href="#!" class="collection-item">'+songs[i]+'</a>');
	}

	$('.collection a').click(function(){
		var id = $(this).attr('id').split('_')[1];
		runWithArgs('player:play',id);
	});
});


$('#file').change(function(e) {
	var file = e.target.files[0];
	var stream = ss.createStream();
	var size = null;
	var perc = null;

	// upload a file to the server.
	ss(io).emit('upload', stream, {size: file.size, name: file.name });
	var transf = ss.createBlobReadStream(file);
	transf.pipe(stream);

	$("#loadingbar").show();

	transf.on('data', function(chunk) {
		size += chunk.length;
		perc = (Math.floor(size / file.size * 100) + '%');

		$(".determinate").css('width', perc);

		if (perc == "100%"){
			$("#loadingbar").hide();
		}

	});

});


				 

function run(action){
	io.emit(action);
}
function runWithArgs(action,args){
	io.emit(action,args);
}

