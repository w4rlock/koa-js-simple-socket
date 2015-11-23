io = io.connect()
currentsong = null;
currentUploadName = null;

function nowPlayingListener(){
	io.on('player:nowplaying',	function(data) {
		if (currentsong == null || currentsong.position != data.position){
			setActiveSong(data.position);
		}

		console.log(data);
		updateSongProgressTime(data.progress.perc);
		currentsong = data;
		$('.marquee').text(data.artist+' :: '+data.album+' :: '+data.title);

	});

}


io.emit('playlist:current');

io.on('cover', function(stream){
	if (stream.id){
		$('#'+stream.id).attr('src', 'data:image/jpg;base64,' + stream.buffer);
	}
	else{
		$('#cover').attr('src', 'data:image/jpg;base64,' + stream.buffer);
	}
});

io.on('playlist:current', function(songs){
	nowPlayingListener();

	var text = null;
	var idalbum = null;
	var cls = null;

	if (songs && songs.length > 0){
		songs.forEach(function(s, i){
			text = (i+1) + ' - <strong class="playls_artist">'+s.artist+'</strong>';
			text+= ' - ' + s.title 

			var l = (s.artist+s.title+s.year).length;
			if (l > 68){
				var offset = 51;
				text = text.substr(0,52+offset) + '...';
				console.log(text);
			}

			text+= '<strong class="playls_time">'+s.duration+'</strong>';

			cls = "collection-item";
			if (idalbum != s.album.replace(/\s/g, '')){
				idalbum = s.album.replace(/\s/g, '');

				io.emit('playlist:albumcover',{ fromPlaylist: true, file: s.file, id: idalbum });

				$('.collection').append(
						'<div class="row header-album">'+
						'<div class="col s9">'+
							'<h5>'+s.artist+'</h5>'+
							'<h6>'+s.album+' (' + s.year +')</h6>'+
						'</div>'+
						'<div class="col s2">'+
							'<img id='+idalbum+' class="small-cover"></img>'+
						'</div>'+
						'</div>'
				);
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

	currentUploadName = file.name;
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
		console.log('Uploading + (' + perc + ') - ' + currentUploadName);
		$(".determinate").css('width', perc);

		if (perc == "100%"){
			$("#loadingbar").hide();
		}
}

function updateSongProgressTime(perc){
		$(".timeperc").css('width', perc+'%');
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
