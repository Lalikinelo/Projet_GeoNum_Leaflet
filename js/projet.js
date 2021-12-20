var map = L.map('map');
var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib = 'Map data OpenstreetMap contributors';



// add OSM basemap
var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib}).addTo(map);


//#################################################
//
//			Lignes de metro
//
//#################################################


// couleur de la ligen de metro
function style_line(ligne)
	{
	switch(ligne)
		{
		case 'A':
			style = {
				color: "#ef1821",
				weight: 3,
				opacity: 1,
				};
			break;
		case 'B':
			style = {
				color: "#009ce7",
				weight: 3,
				opacity: 1,
				};
			break;
  
		case 'C':
			style = {
				color: "#ffb518",
				weight: 3,
				opacity: 1,
				};
			break;
			
		case 'D':
			style = {
				color: "#21a563",
				weight: 3,
				opacity: 1,
				};
			break;
			
		case 'F1':
			style = {
				color: "#8cce39",
				weight: 3,
				opacity: 1,
				};
			break;
		
		case 'F2':
			style = {
				color: "#8cce39",
				weight: 3,
				opacity: 1,
				};
			break;
		}
	return  style;

	}

// icon for animated marker
var animIcon = L.icon({
	iconUrl: 'data/img/yellowSquare.png',
  	iconSize: [4, 4],
	iconAnchor: [2,2]
});

	
	
//#################################################
//
//		Lignes de metro
//
//#################################################

var metro_lines = [];
var metro_data_lines;

var metro_data= shp('./data/lignes_metro.zip').then(function(metro_features_collection)
	{	
	
	
	// Suppression des données en double et inversion Lat/Long
	for (var i = 0; i <  metro_features_collection.features.length; i++) 
				{
				
				//suppression des doublons
				var already_exist = false;	
				for (var j = 0; j <  metro_lines.length; j++) 
					{
					
					if(metro_features_collection.features[i].properties.ligne == metro_lines[j])
						{
						already_exist=true;
						}
					}
					if(already_exist==true) // suppression de l'élément si il existe déjà
						{
						metro_features_collection.features.splice(i, 1);
						i=i-1; // decallage de l'indice car la longueur du tableau raccourcit
						}
					else
						{
						metro_lines.push(metro_features_collection.features[i].properties.ligne);// mise à jour de la liste des lignes de metro	
						}				

				
				}
	
	
	metro_data_lines = L.geoJSON(metro_features_collection, 
		{

		style: function (feature) 
			{
			return style_line(feature.properties.ligne);
			},
			
		onEachFeature: function (feature, layer)
			{
			
			var coord_for_aminated_marker = new Array();

			for (var i = 0; i <  feature.geometry.coordinates.length; i++) 
				{	
					x = feature.geometry.coordinates[i][1];
					y = feature.geometry.coordinates[i][0];
					coord_for_aminated_marker.push([x,y]);			
				}
			
			var line_animated = new L.polyline(coord_for_aminated_marker);
			

			var animatedMarker = new L.animatedMarker(line_animated.getLatLngs(), 	
				{
				distance: 100,
				interval: 50,
				autoStart: false,
				icon: animIcon,
				/*onEnd: function() {
					console.log(this);
				*/
				  
				}).addTo(map);
			
			
			layer.on('mouseover', function() 
				{
				animatedMarker.start();
				});	
			layer.on('mouseout', function() 
				{
				animatedMarker.stop();
				});	
			}
		}).addTo(map);	
	});


//#################################################
//
//				Acces metro
//
//#################################################

var icon_acces_metro = L.icon (
	{
	iconUrl: 'data/img/arret_logo.png',
	iconSize: [10, 10],
	iconAnchor: [5,5],
	popupAnchor: [0, -5] 
	});

var acces_metro_markers;
	
let url = 'https://download.data.grandlyon.com/wfs/rdata?SERVICE=WFS&VERSION=2.0.0&request=GetFeature&typename=tcl_sytral.tclstation&SRSNAME=EPSG:4326&outputFormat=application/json; subtype=geojson&startIndex=0';
var data = fetch(url).then(data => data.json()).then(data => {acces_metro_markers=
      L.geoJson(data,
	  {
	  pointToLayer: function (feature, latlng) 
		{
		var acces_metro = new L.marker(latlng, {icon : icon_acces_metro});
		acces_metro.bindPopup("<h3> "+feature.properties.nom+"</h3>");
		return acces_metro;
		}
	  }).addTo(map);
    });

//#################################################
//
//				Parking avec buffer 300m
//
//#################################################

	


// icone du Parking  	
var parking_icon_small = L.icon (
	{
	iconUrl: 'data/img/parking_logo.png',
	iconSize: [20, 20],
	iconAnchor: [10,10],
	popupAnchor: [0, -30] 
	});

var parking_icon_larger = L.icon (
	{
	iconUrl: 'data/img/parking_logo.png',
	iconSize: [26, 26],
	iconAnchor: [13,13],
	popupAnchor: [0, -30] 
	});



var parking_markers = L.geoJSON(park, 
	{
	pointToLayer: function (feature, latlng) 
		{
		var buffer_300m = new L.circle(latlng, 300, {opacity:0 , fillOpacity: 0}).addTo(map);
		var parking = new L.marker(latlng, {icon : parking_icon_small});
		
		parking.bindPopup("<h2>Parking : "+feature.properties.nom+"</h2><h3>"+feature.properties.fermeture+"</h3><h3>"+feature.properties.reglementation+"</h3><h3>"+feature.properties.situation+"</h3>");	
		
		parking.on('mouseover', function() 
			{
			buffer_300m.setStyle({fillColor: 'blue', fillOpacity: 0.5})
			parking.setIcon(parking_icon_larger);
			});
		
		parking.on('mouseout', function() 
			{
			buffer_300m.setStyle({fillOpacity: 0});
			parking.setIcon(parking_icon_small);
			});	
		return parking;
		}
	});


//#################################################
//
//				Parking Cluster
//
//#################################################

var markersCluster = L.markerClusterGroup({disableClusteringAtZoom: 15});
markersCluster.addLayer(parking_markers);
map.addLayer(markersCluster);


	

//#################################################
//
//			pollution 2.5 par iris
//
//#################################################

// fonction qui définit les seuils de couleurs
function getColor(value) 
	{
	return value<3 ? '#fef0d9' :
		value<6 ? '#fdd49e' :
		value<8 ? '#fdbb84' :
		value<10 ? '#fc8d59' :
		value<12 ? '#ef6548' :
		value<14 ? '#d7301f' :
					'#990000';
	}


// Ajout les iris n à la carte	
var iris_data = L.geoJSON(iris, 
	{
	style : function (geoJsonFeature) 
		{
		return {
				fillColor: getColor(geoJsonFeature.properties["moyenne_pm2.5"]),
				fillOpacity : 0.7,
				color : '#000000',
				weight : 1
				}
		},
	onEachFeature: function (feature, layer) 
		{
		layer.on('click', function() 
			{
			this.bindTooltip(feature.properties.NOM_IRIS)

			});
		}
	}).addTo(map);

	
	
//#################################################
//
// 					legende
//
//#################################################



var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0,3,6,8,10,12,14],
		metro_lines = ["A","B","C","D","F1","F2"], // la ligne 113 du fichier s'execute après celle ci. Il faut donc coder "en dur" les noms des lignes ou refaire un settimout ou un event
        labels = ["Taux de particules PM 2.5 en ppm", "Ligne de metro","Parking"];
	
	div.innerHTML = '<b>'+labels[0]+ '</b><br>';
	
	// legende de la pollution aux particules des iris
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] : '+')+ ' ppm <br>';
    }
	
	div.innerHTML += '<br><b>'+ labels[1] +'</b><br>';
	
	// legende des lignes de metro
    for (var i = 0; i < metro_lines.length; i++) {
		div.innerHTML +='<i style="background:' + style_line(metro_lines[i]).color + '"></i> ' + metro_lines[i] + '<br>';
    }
    return div;
};

legend.addTo(map);


	
//#################################################
//
// 		control de l'affichage des couches
//
//#################################################


// créer un selecteur de geometries

setTimeout(function() // attente que les couches soient chargées
	{
	var baseLayers = {"OpenStreetMap": osm};

	var overlays = 
		{
		"Lignes de métro": metro_data_lines,
		"arrêts de métro": acces_metro_markers,
		"Parkings": markersCluster,
		"Pollution aux particules 2.5PM": iris_data,
		};
		L.control.layers(baseLayers, overlays).addTo(map);
	}, 8000);



// ajouste le zoom aux données
map.fitBounds(iris_data.getBounds());
map.setZoom(12);
