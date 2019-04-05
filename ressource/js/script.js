$(document).ready(function() {
	let v = "";
	let dataResults = [];
	$("#datepicker").datepicker(); // Initialisation datepicker

	function vuePhoto(i,item) { // Permet d'afficher des images + dialog pour la vue photo
		$("<div/>").attr("id",'img_'+i).attr("class",'m-3').appendTo("#images");
		$("<div/>").attr("id",'overlay_'+i).attr("class",'view overlay').appendTo("#img_"+i);
		$("<img/>").attr("src", item.media.m).appendTo("#overlay_"+i); // Affiche l'image

		$("<div/>").attr("id",'dialog_'+i).attr("class",'dialogImage').attr("title",'Informations').appendTo("#img_"+i); // Création d'une boite de dialog pour chaque image
		$("<p/>").append("Titre: " + item.title).appendTo("#dialog_"+i); // Ajout du titre de l'image à la boite de dialog
		temp = item.date_taken;
		$("<p/>").append("Date: " + temp.slice(0,10)).appendTo("#dialog_"+i); // Ajout de la date de l'image à la boite de dialog
		$("<p/>").append("Heure: " + temp.slice(11,19)).appendTo("#dialog_"+i); // Ajout de l'heure de prise de l'image à la boite de dialog
		$("<p/>").append("Auteur id: " + item.author_id).appendTo("#dialog_"+i); // Ajout de l'id de l'autheur de l'image à la boite de dialog
		$('#dialog_'+i).css('display','none'); // Permet que la boite de dialog ne soit pas affiché
		
	    $("#img_"+i).click(function() { // Quand on click sur une image on affiche la boite de dialog
	        $("#dialog_"+i).dialog({ // On défini une taille a la boite de dialog
	        	width:500
	        });
	        $("#dialog_"+v).dialog("close"); // Si une seconde boite de dialog est ouverte, permet de fermer la boite de dialog précédente
	        v = i;
	        return false;
	    });
	}

	let dataTable = $('#myTable').DataTable({ // Initialisation du tableau
		data: dataResults,
		columns: [		
			{ title: 'Image'},		        
		    { title: 'Titre'},
		    { title: 'Date et heure' },
		    { title: 'Auteur id'}
		]
	}); 

	$('#commune').autocomplete({ //Permet l'autocompletation des noms de commune
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
		minLength:3,
	});

	$('#submit').on('click', function() {		
		$("#images").empty(); // Permet d'effacer les images de la précédente requete
		$.ajax({
			url:'http://api.flickr.com/services/feeds/photos_public.gne',
			type:'GET',
			dataType:'jsonp',
			jsonp: 'jsoncallback', // a renseigner d'après la doc du service, par défaut callback
			data:'tags='+$('#commune').val()+','+$('#datepicker').val()+'&tagmode=all&format=json&lang=fr-fr',
			success:function(data){
				dataResults = []; // On reset le tableau
				let itemDisplay = 0;
				$.each(data.items, function(i,item){	
					vuePhoto(i,item); // Fonction pour affichage vue photo
					dataResults.push(["<img src='"+item.media.m+"'/>", item.title, item.date_taken, item.author_id]); // on ajoute les valeurs au tableau					
					itemDisplay++;

					if ( i == $('#maxPhoto').val()-1) return false ;
				});
				dataTable.clear(); // On efface la table
				dataTable.rows.add(dataResults); // On met a jour la table avec les résultats
				dataTable.draw();
				if ( itemDisplay == 0) $("#dialogNoPhoto").dialog(); // Si aucune photo n'est affiché, affiche une boite de dialog
			},
			error: function(resultat,statut,erreur){
				alert("Erreur requete");		        
			},
		});
	});	
});