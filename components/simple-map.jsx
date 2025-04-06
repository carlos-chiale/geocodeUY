"use client"

import { useEffect, useRef, useState } from "react"

// A simple map implementation with base layer controls
export default function SimpleMap({ marker, clickCoordinates, onMapClick }) {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [markerLayer, setMarkerLayer] = useState(null)
  const [clickLayer, setClickLayer] = useState(null)

  // Initialize map on component mount
  useEffect(() => {
    // Import Leaflet dynamically to avoid SSR issues
    import("leaflet").then((L) => {
      // Add Leaflet CSS
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
      document.head.appendChild(link)

      // Initialize map if it doesn't exist
      if (!map && mapRef.current) {
        const newMap = L.map(mapRef.current).setView([-34.901112, -56.164532], 13)

        // Define base layers
        const baseLayers = {
          OpenStreetMap: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }),
          "Google Maps": L.tileLayer("https://maps.googleapis.com/maps/vt/lyrs=r&x={x}&y={y}&z={z}", {
            attribution: "&copy; Google Maps",
          }),
          "Esri World Street Map": L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
            {
              attribution:
                "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
            },
          ),
          "Ortofotos IDE": L.tileLayer(
            "https://mapas.ide.uy/geoserver-raster/gwc/service/wmts/rest/ortofotos:ORTOFOTOS_2019/raster/EPSG:3857/EPSG:3857:{z}/{y}/{x}?format=image/jpeg",
            {
              attribution: "&copy; IDE Uruguay",
            },
          ),
          "ESRI World Imagery": L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
              attribution:
                "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
            },
          ),
          "Google Satelite": L.tileLayer("https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}", {
            attribution: "&copy; Google Maps",
          }),
        }

        // Add the default layer to the map
        baseLayers["OpenStreetMap"].addTo(newMap)

        // Add layer control to the map
        L.control.layers(baseLayers, {}, { position: "topright" }).addTo(newMap)

        // Add click handler
        newMap.on("click", (e) => {
          if (onMapClick) {
            onMapClick([e.latlng.lat, e.latlng.lng])
          }
        })

        setMap(newMap)
      }
    })

    // Cleanup on unmount
    return () => {
      if (map) {
        map.remove()
      }
    }
  }, [])

  // Handle marker updates
  useEffect(() => {
    if (!map) return

    import("leaflet").then((L) => {
      // Remove existing marker layer
      if (markerLayer) {
        map.removeLayer(markerLayer)
      }

      // Add new marker if coordinates exist
      if (marker) {
        const icon = L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
          shadowSize: [41, 41],
        })

        const newMarkerLayer = L.marker(marker, { icon }).addTo(map)
        newMarkerLayer.bindPopup(
          `<div>Dirección encontrada<br>Lat: ${marker[0].toFixed(6)}, Lon: ${marker[1].toFixed(6)}</div>`,
        )

        setMarkerLayer(newMarkerLayer)
        map.setView(marker, 16)
      }
    })
  }, [map, marker])

  // Handle click coordinates updates
  useEffect(() => {
    if (!map) return

    import("leaflet").then((L) => {
      // Remove existing click layer
      if (clickLayer) {
        map.removeLayer(clickLayer)
      }

      // Add new marker for click coordinates
      if (clickCoordinates) {
        const icon = L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
          shadowSize: [41, 41],
        })

        const newClickLayer = L.marker(clickCoordinates, { icon }).addTo(map)
        newClickLayer.bindPopup(
          `<div>Coordenadas<br>Lat: ${clickCoordinates[0].toFixed(6)}, Lon: ${clickCoordinates[1].toFixed(6)}</div>`,
        )

        setClickLayer(newClickLayer)
      }
    })
  }, [map, clickCoordinates])

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
}

