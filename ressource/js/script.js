$(document).ready(function() {

	// '&maxRows=' + $('#maxPhoto').val()	
	$('#commune').autocomplete({
		source: function(request, response){
			$.ajax({	
				url:'http://infoweb-ens/~jacquin-c/codePostal/commune.php',
				type:'GET',
				dataType:'json',
				data:'commune=' + $('#commune').val(),		
				success: function(data){
					response($.map(data, function(item) {
						return {							
							value:item.Ville							
						}
					}));
					$.each(data, function(i,item){
						// $('ul').append('<li>'+ item.Ville +'</li>');
					});
				}				
			});			
		},			
		// minLength:3,
	});
	
	$('#submit').on('click', function() {		
		$("#images").html("");
		$.ajax({
			url:'http://api.flickr.com/services/feeds/photos_public.gne',
			type:'GET',
			dataType:'jsonp',
			jsonp: 'jsoncallback', // a renseigner d'après la doc du service, par défaut callback
			data:'tags='+$('#commune').val()+'&tagmode=any&format=json',
			success:function(data){
				$.each(data.items, function(i,item){
					$("<img/>").attr("src", item.media.m).appendTo("#images");
					if ( i == 6 ) return false ; });
				},
			error: function(resultat,statut,erreur){
				alert("Aucun photo disponible");},
		});
	});	
});