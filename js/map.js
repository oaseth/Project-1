// Initialise map
var map = L.map('map').setView([7.0, -0.09], 7);

// Add tile Layers to map
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var googleStreets = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

var googleHybrid = L.tileLayer('http://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

var googleSat = L.tileLayer('http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
})

var googleTerrain = L.tileLayer('http://{s}.google.com/vt?lyrs=p&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});



// Add a marker
//var marker = L.marker([7.0, -0.09])
 //.addTo(map);

// Add styles for the GeoJson Layers
// Style for region layer
var regionStyle = {
	color: "rgb(160,82,45)",
	opacity: 0.4,
	weight: 1
}

// Style for health facility layer
var healthFaciStyle = {
	radius: 2,
	fillColor: "green",
	color: "red",
	weight: 1
}

// Style for railway layer
var railwayStyle = {
	color: "black",
	weight: 5
}


// Add GeoJson layers
// Regions
var regions = L.geoJSON(regions, {
    style: regionStyle,
	onEachFeature: function (feature, layer) {
		// Compute area of the region polygon using turf.js
		area = (turf.area(feature)/1000000).toFixed(3) 
		// Get the centroids of the region polygons 
		center_lng = turf.center(feature).geometry.coordinates[0].toFixed(3)
		center_lat = turf.center(feature).geometry.coordinates[1].toFixed(3)
		
		label = `Name: ${feature.properties.region}<br>`
		label += `Region_code: ${feature.properties.reg_code}<br>`
		label += `Area: ${area}<br>`
		label += `Center: ${center_lng}, ${center_lat}<br>`
		//layer.bindPopup(feature.properties.region)
		layer.bindPopup(label)
	}
}).addTo(map);


// Health Facilities
var healthSitesLayer = L.geoJSON(healthFaci, {
    //color: "red"
	pointToLayer: function(geoJsonPoint, latlng) {
    return L.circleMarker(latlng,healthFaciStyle);
}
})
//.addTo(map);


// Railway lines
var railwayLayer = L.geoJSON(railway, {
    style: railwayStyle
})
// .addTo(map);



// Adding WMS layers
// Water bodies
var waterBodiesWMS = L.tileLayer.wms("http://localhost:8080/geoserver/geospatial/wms", {
    layers: 'geospatial:water_bodies',
    format: 'image/png',
    transparent: true,
    attribution: "Weather data © 2012 IEM Nexrad"
})
//.addTo(map);

// Tree cover
var treeCoverWMS = L.tileLayer.wms("http://localhost:8080/geoserver/geospatial/wms", {
    layers: 'geospatial:Treecover',
    format: 'image/png',
    transparent: true,
    attribution: "Weather data © 2012 IEM Nexrad"
})
//.addTo(map);


// A set of Basemaps/tile layers
var baseLayers = {
    "OpenStreetMap": osm,
	"Google Street Map": googleStreets,
	"Google Hybrid": googleHybrid,
	"Google Satellite": googleSat,
	"Google Terrain": googleTerrain,	
};


// A set of GeoJson Layers and WMS layers
var overlays = {
    //"Marker": marker,
	"Regions": regions,
	"HealthFacilities": healthSitesLayer,
	"RailwayLines": railwayLayer,
	"WaterBodiesWMS": waterBodiesWMS,
	"TreeCoverWMS": treeCoverWMS
	
    //"Roads": roadsLayer
};


// Add layer control to map
L.control.layers(baseLayers, overlays, {collapsed:false}).addTo(map);



// Add leaflet browser print control to map
L.control.browserPrint({position: 'topleft'}).addTo(map);


// Mousemove coordinates
map.on("mousemove", function(e){
	//console.log(e)
	$("#coordinate").html(`<b>Lat</b>: ${e.latlng.lat.toFixed(3)}, <b>Lng</b>: ${e.latlng.lng.toFixed(3)}`)
})

// Add a scale
L.control.scale().addTo(map);
