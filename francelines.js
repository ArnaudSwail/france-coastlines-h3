const h3 = require('h3-js');

const fs = require('fs');
const byline = require('byline');

const olFeature = require('ol/Feature');
const olWkt = require('ol/format/WKT');

const wgs84 = 'EPSG:4326';

//==============================================================================
//
//  FRANCE LINES
//
//  OSM Coastlines http://openstreetmapdata.com/data/coastlines
// 	QGIS
//  Conversion en fichier texte avec géométrie en WKT (FranceLines.csv)
//
// 	NodeJS (ce code)
//	Conversion des points de la ligne de côte en hexagones pour écriture nouveau fichier
//
function francelines()
{
  var inputPath = 'FranceLines.csv';
  var outputPath = 'FranceLines.hex';
  readFile( inputPath, outputPath );
}

function readFile( inputPath, outputPath )
{
    debugger;
		console.log("Reading", inputPath );

    var stream = fs.createReadStream( inputPath ); // , { encoding: 'utf8' });
    stream = byline.createStream( stream );

    var output = fs.createWriteStream( outputPath );
    var set = new Set();

    stream.on( 'data', function( line )
    {
      line = line.toString();
      var wkt = line.split( ";" )[0];
      console.log("Line", wkt );
			if( wkt != 'WKT' )
			{
        wkt = wkt.replace(/['"]+/g, '');
        processWKT( wkt, output, set );
			}
    })
		.on('error', function (e) {
			console.log("error", e);
		})
		.on('close', function(){
      console.log( "DONE!")
      output.end();
		});
}

//==============================================================================
//
// création d'un hexagone pour chaque point défini dans le wkt
// ajout de l'hexagone si nouveau
// création d'une ligne en texte délimité h3Index;lat;lng;WKT écrite dans le fichier de sortie
//
function processWKT( wkt, output, set )
{
  var feature = format.readFeature( wkt, { dataProjection: wgs84, featureProjection: wgs84 });
  var coordinates = feature.getGeometry().getCoordinates();
  coordinates[0].forEach( coords => {
    var h3Index = h3.geoToH3( coords[1], coords[0], 9 );
    if( !set.has( h3Index ))
    {
      console.log( h3Index );
      set.add( h3Index );
      var formatAsGeoJson = true;
      var bounds = h3.h3ToGeoBoundary(h3Index, formatAsGeoJson)
      var sBounds = [];
			bounds.forEach( bound => { sBounds.push( bound.join(' ')) } );
      var line = h3Index + ";" + coords[1] + ";" + coords[0] + ";POLYGON((" + sBounds.join(',') + "))\r\n";
      output.write( new Buffer( line ));
    }
  });
}
