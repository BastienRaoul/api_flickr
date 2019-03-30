let v = "";
$("#datepicker").datepicker();
$('#myTable').DataTable({});

function vuePhoto(i,item) {
		$("<div/>").attr("id",'img_'+i).attr("class",'m-3').appendTo("#images");
		$("<div/>").attr("id",'overlay_'+i).attr("class",'view overlay').appendTo("#img_"+i);
		$("<img/>").attr("src", item.media.m).appendTo("#overlay_"+i);

		$("<div/>").attr("id",'dialog_'+i).attr("class",'dialogImage').attr("title",'Informations').appendTo("#img_"+i);
		$("<p/>").append("Titre: " + item.title).appendTo("#dialog_"+i);
		temp = item.date_taken;
		$("<p/>").append("Date: " + temp.slice(0,10)).appendTo("#dialog_"+i);
		$("<p/>").append("Heure: " + temp.slice(11,19)).appendTo("#dialog_"+i);
		$("<p/>").append("Auteur id: " + item.author_id).appendTo("#dialog_"+i);
		$('#dialog_'+i).css('display','none');
		$('#dialog_'+i).css('width','500px');
		
	    $("#img_"+i).click(function() {
	        $("#dialog_"+i).dialog({
	        	width:500
	        });
	        $("#dialog_"+v).dialog("close");
	        v = i;
	        return false;
	    });
}

$(document).ready(function() {
	$('#commune').autocomplete({
		source: function(request, response){
			$.ajax({	
				/*url:'http://infoweb-ens/~jacquin-c/codePostal/commune.php',*/
				url:'http://localhost/flickr/serveur/commune.php',
				type:'GET',
				dataType:'json',
				data:'commune=' + $('#commune').val(),		
				success: function(data){
					response($.map(data, function(item) {
						return {							
							value:item.Ville							
						}
					}));
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
					vuePhoto(i,item);									
					if ( i == $('#maxPhoto').val()-1) return false ; });
				},
			error: function(resultat,statut,erreur){
				/*alert("Aucun photo disponible");*/
		        $("#dialogNoPhoto").dialog();
			},
		});
	});	
});