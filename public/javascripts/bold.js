$(document).ready(function() {
	var w = $(window).width();
	$('.link').click(function() {
		//display projects 
		$('.page').animate({'margin-left': '-=' + w + 'px'}, 1500);

		//nav arrows appear after 1 second
		setTimeout(function() {
			$('.arrow').fadeTo(1000, 1);
		}, 1000);
	});

	$('')
});