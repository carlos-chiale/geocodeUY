"use client";

import { useEffect, useRef, useState } from "react";

export default function SimpleMap({ marker, clickCoordinates, onMapClick }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerLayerRef = useRef(null);
  const clickLayerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    import("leaflet").then((L) => {
      if (isCancelled) return;

      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!mapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current, {
          scrollWheelZoom: false,
        }).setView([-34.901112, -56.164532], 13);

        const baseLayers = {
          OpenStreetMap: L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }
          ),
          "Google Maps": L.tileLayer(
            "https://maps.googleapis.com/maps/vt/lyrs=r&x={x}&y={y}&z={z}",
            {
              attribution: "&copy; Google Maps",
            }
          ),
          "Esri World Street Map": L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
            {
              attribution:
                "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
            }
          ),
          "Ortofotos IDE": L.tileLayer(
            "https://mapas.ide.uy/geoserver-raster/gwc/service/wmts/rest/ortofotos:ORTOFOTOS_2019/raster/EPSG:3857/EPSG:3857:{z}/{y}/{x}?format=image/jpeg",
            {
              attribution: "&copy; IDE Uruguay",
            }
          ),
          "ESRI World Imagery": L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
              attribution:
                "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
            }
          ),
          "Google Satelite": L.tileLayer(
            "https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}",
            {
              attribution: "&copy; Google Maps",
            }
          ),
        };

        baseLayers["OpenStreetMap"].addTo(map);
        L.control.layers(baseLayers, {}, { position: "topright" }).addTo(map);

        map.on("click", (e) => {
          if (onMapClick) {
            onMapClick([e.latlng.lat, e.latlng.lng]);
          }
        });

        mapInstanceRef.current = map;
        setIsReady(true);
      }
    });

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markerLayerRef.current = null;
      clickLayerRef.current = null;
    };
  }, [onMapClick]);

  useEffect(() => {
    if (!isReady || !mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;

      if (markerLayerRef.current) {
        map.removeLayer(markerLayerRef.current);
        markerLayerRef.current = null;
      }

      if (marker) {
        const icon = L.icon({
          iconUrl:
            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl:
            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
          shadowSize: [41, 41],
        });

        const newMarkerLayer = L.marker(marker, { icon }).addTo(map);
        newMarkerLayer.bindPopup(
          `<div>Dirección encontrada<br>Lat: ${marker[0].toFixed(
            6
          )}, Lon: ${marker[1].toFixed(6)}</div>`
        );

        markerLayerRef.current = newMarkerLayer;
        map.setView(marker, 16);
      }
    });
  }, [isReady, marker]);

  useEffect(() => {
    if (!isReady || !mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;

      if (clickLayerRef.current) {
        map.removeLayer(clickLayerRef.current);
        clickLayerRef.current = null;
      }

      if (clickCoordinates) {
        const icon = L.icon({
          iconUrl:
            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl:
            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
          shadowSize: [41, 41],
        });

        const newClickLayer = L.marker(clickCoordinates, { icon }).addTo(map);
        newClickLayer.bindPopup(
          `<div>Coordenadas<br>Lat: ${clickCoordinates[0].toFixed(
            6
          )}, Lon: ${clickCoordinates[1].toFixed(6)}</div>`
        );

        clickLayerRef.current = newClickLayer;
      }
    });
  }, [isReady, clickCoordinates]);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }}></div>
  );
}
