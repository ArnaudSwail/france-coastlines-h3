# Index pour le calcul de la distance à la ligne de côte (source données: OSM)

Méthode pour contruire un index h3 pour le calcul de la distance à la ligne de côte.

Le fichier .csv contient les données d'entrée extraites depuis les données OpenStreetMap:
- [Fichier SHP des lignes de côte OpenStreetMapData](http://openstreetmapdata.com/data/coastlines)

QGIS est utilisé pour:
- sélectionner les zones à tester (France Métropolitaine dans l'exemple);
- convertir le fichier SHP en fichier CSV contenant les géométries au format WKT.

La résolution 9 a été choisi dans le cas présent.
Certaines lignes de côte (en Normandie) ne sont pas continues, 
il est toutefois possible d'utiliser h3line pour être plus précis.

Le fichier généré par ce script NodeJS contient par ligne:
- index H3 de l'hexagone;
- WKT associé.

Pour détecter la ligne de côte depuis une position:
````
h3.kRing( h3.geoToH3( boat.lat, boat.lng, 9 ), distance ).forEach( h3Index => { within |= set.has(h3Index); })
````
