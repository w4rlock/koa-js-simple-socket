io = io.connect()
currentsong = null;

function nowPlayingListener(){
	io.on('player:nowplaying',	function(data) {
		if (currentsong == null || currentsong.position != data.position){
			setActiveSong(data.position);
		}

		currentsong = data;
		$('.marquee').text(data.artist+' :: '+data.album+' :: '+data.title);

	});

}


io.emit('playlist:current');

io.on('cover', function(stream){
	$('#cover').attr('src', 'data:image/jpg;base64,' + stream.buffer);
});

io.on('playlist:current', function(songs){
	nowPlayingListener();

	var text = null;
	var idalbum = null;
	var cls = null;

	if (songs && songs.length > 0){
		idalbum = songs[0].date+songs[0].artist;

		songs.forEach(function(s, i){
			text= (i+1) + ' - <strong class="playls_artist">'+s.artist+'</strong>';
			text+= ' - ' + s.date + ' - ' + s.title 
			text+= '<strong class="playls_time">'+s.time+'</strong>';

			cls = "collection-item";
			if (idalbum != s.date+s.artist){
				idalbum = s.date+s.artist;
				cls+=" pl-separator";
			}

			$('.collection').append('<a id="song_'+i+'" href="#!" class="'+cls+'">'+ text +'</a>');
		});
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
	var tranf = null;

	ss(io).emit('upload', stream, {size: file.size, name: file.name });
	transf = ss.createBlobReadStream(file);
	transf.pipe(stream);

	$("#loadingbar").show();

	transf.on('data', function(chunk) {
		size += chunk.length;
		perc = (Math.floor(size / file.size * 100) + '%');

		updateProgressBarUpload(perc);
	});

});


function updateProgressBarUpload(perc){
		$(".determinate").css('width', perc);

		if (perc == "100%"){
			$("#loadingbar").hide();
		}

}



function setActiveSong(indice){
	$('.collection a').removeClass('active');
	$('#song_'+indice).addClass('active');
}


function run(action){
	io.emit(action);
}


function runWithArgs(action,args){
	io.emit(action,args);
}


$('.uploadbutton a').click(function(){
	$(this).parent().find('input').click();
});
