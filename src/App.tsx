import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  Marker,
  useMap,
} from "react-leaflet";
import { AutoComplete, Button, Input } from "antd";
import "leaflet/dist/leaflet.css";
import "antd/dist/antd.css";
import L from "leaflet";

const icon = L.icon({ iconUrl: "/images/marker-icon.png" });

const { BaseLayer } = LayersControl;

function MyComponent(props: any) {
  const map = useMap();
  map.setView(props.marker, 18, { animate: true });
  return null;
}

function App() {
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const [direccion, setDireccion] = useState<string>("");
  const [localidad, setLocalidad] = useState<string>("");
  const [departamento, setDepartamento] = useState<string>("");
  const [marker, setMarker] = useState<any>();

  const onSearch = async (searchText: string) => {
    const response = await fetch(
      `https://direcciones.ide.uy/api/v0/geocode/SugerenciaCalleCompleta?entrada=${searchText}&todos=true`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let responseJson = await response.json();

    let options: any = [];
    let i = 0;
    responseJson.forEach((address: any) => {
      options.push({
        key: `${i},${address.calle}`,
        value: `${address.calle}, ${address.localidad}, ${address.departamento}`,
      });
      i++;
    });

    setOptions(options);
  };

  const onSelect = (data: string) => {
    let split = data.split(",");
    setDireccion(split[0]);
    setLocalidad(split[1]);
    setDepartamento(split[2]);
  };

  const onChange = (data: string) => {
    setDireccion(data);
  };

  const searchAddressIDE = async () => {
    const response = await fetch(
      `https://direcciones.ide.uy/api/v0/geocode/BusquedaDireccion?calle=${direccion}&departamento=${departamento}&localidad=${localidad}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let responseJson = await response.json();
    let marker: any = [responseJson[0].puntoY, responseJson[0].puntoX];
    setMarker(marker);
  };

  const existsMarker = () => {
    return marker && marker[0] != undefined && marker[1] != undefined;
  };

  return (
    <>
      <AutoComplete
        options={options}
        value={direccion}
        style={{ width: 500 }}
        onSelect={onSelect}
        onSearch={onSearch}
        onChange={onChange}
        placeholder="Ingresar direccion"
      />
      <Input id="localidad" placeholder="Localidad" value={localidad} />
      <Input
        id="departamento"
        placeholder="Departamento"
        value={departamento}
      />
      <Button type="primary" onClick={() => searchAddressIDE()}>
        Buscar
      </Button>
      <MapContainer
        center={[-34.901112, -56.164532]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "650px" }}
      >
        {existsMarker() && (
          <>
            <Marker position={marker} icon={icon} />{" "}
            <MyComponent marker={marker} />
          </>
        )}
        <LayersControl>
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
    </>
  );
}

export default App;
