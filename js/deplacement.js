/*
    Listener commandes directions robot

    Methode de communication: POST
    
 */
$(document).ready(function() {
	$(".btn_deplacement").click(function() {
		var id = $(this).attr('id');
		sendMove(id);
	});

});

function sendMove(dir) {
	var servlet = "Robotmove";
	$.post(servlet, {
		direction : dir,
		avancer : 1
	}, function(data, status) {
		if (data.ok != 1) {
			alert(data.err);
		} else {
			myRefresher.refreshMap();
		}
	});
									{
										myRefresher.refresher();
									}
}

$(function() {
	$(document).keydown(function(event){
		//alert(event.which);
		//event.preventDefault();
		if (event.which == 37) { 
			sendMove("left");
			event.preventDefault();
		} else if (event.which == 38) {
			sendMove("up");
			event.preventDefault();
		} else if (event.which == 39) {
			sendMove("right");
			event.preventDefault();
		} else if (event.which == 40) {
			sendMove("down");
			event.preventDefault();
		}
	});
});