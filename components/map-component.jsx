"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, LayersControl } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "/images/marker-shadow.png",
  shadowSize: [41, 41],
})

const { BaseLayer } = LayersControl

// Component to set the map view when marker changes
function SetViewOnMarker({ coords }) {
  const map = useMap()

  useEffect(() => {
    if (coords) {
      map.setView(coords, 16, { animate: true })
    }
  }, [coords, map])

  return null
}

// Component to handle map click events
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng])
    },
  })

  return null
}

export default function MapComponent({
  marker,
  clickCoordinates,
  onMapClick,
  dirFromCoordinatesIDE,
  dirFromCoordinatesOSM,
}) {
  // Use state to ensure component is mounted before rendering map
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Set the default icon for all markers
    L.Marker.prototype.options.icon = DefaultIcon
  }, [])

  if (!mounted) return null

  return (
    <MapContainer
      center={[-34.901112, -56.164532]} // Montevideo, Uruguay
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <MapClickHandler onMapClick={onMapClick} />

      {marker && (
        <>
          <Marker position={marker}>
            <Popup>
              <div className="min-w-[200px]">
                <div className="font-medium">Dirección encontrada</div>
                <div className="text-sm mt-1">
                  Lat: {marker[0].toFixed(6)}, Lon: {marker[1].toFixed(6)}
                </div>
              </div>
            </Popup>
          </Marker>
          <SetViewOnMarker coords={marker} />
        </>
      )}

      {clickCoordinates && (
        <Marker position={clickCoordinates}>
          <Popup>
            <div className="min-w-[200px]">
              <div className="mb-2">
                <div className="font-medium">IDE:</div>
                <div className="text-sm">{dirFromCoordinatesIDE || "Cargando..."}</div>
              </div>
              <div>
                <div className="font-medium">OSM:</div>
                <div className="text-sm">{dirFromCoordinatesOSM || "Cargando..."}</div>
              </div>
            </div>
          </Popup>
        </Marker>
      )}

      <LayersControl position="topright">
        <BaseLayer checked name="OpenStreetMap">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>
        <BaseLayer name="Google Maps">
          <TileLayer url="https://maps.googleapis.com/maps/vt/lyrs=r&amp;x={x}&amp;y={y}&amp;z={z}" />
        </BaseLayer>
        <BaseLayer name="Esri World Street Map">
          <TileLayer
            attribution="Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          />
        </BaseLayer>
        <BaseLayer name="Ortofotos IDE">
          <TileLayer url="https://mapas.ide.uy/geoserver-raster/gwc/service/wmts/rest/ortofotos:ORTOFOTOS_2019/raster/EPSG:3857/EPSG:3857:{z}/{y}/{x}?format=image/jpeg" />
        </BaseLayer>
        <BaseLayer name="ESRI World Imagery">
          <TileLayer
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </BaseLayer>
        <BaseLayer name="Google Satelite">
          <TileLayer url="https://mt0.google.com/vt/lyrs=y&amp;hl=en&amp;x={x}&amp;y={y}&amp;z={z}" />
        </BaseLayer>
      </LayersControl>
    </MapContainer>
  )
}

