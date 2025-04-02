"use client"

import { useState, useEffect } from "react"
import "./App.css"
import { MapContainer, TileLayer, LayersControl, Marker, useMap, useMapEvents, Popup } from "react-leaflet"
import { AutoComplete, Button, Input, Layout, Radio, Card, Divider, Spin, Typography, Space } from "antd"
import "leaflet/dist/leaflet.css"
import "antd/dist/antd.css"
import L from "leaflet"
import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons"

// Define the marker icon
const icon = L.icon({
  iconUrl: "/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
})

const { BaseLayer } = LayersControl
const { Header, Content, Sider } = Layout
const { Title, Text } = Typography

// Component to set the map view
function SetView(props) {
  const map = useMap()

  useEffect(() => {
    if (props.marker) {
      map.setView(props.marker, 18, { animate: true })
    }
  }, [map, props.marker])

  return null
}

// Component to handle map click events
function MapEvents(props) {
  useMapEvents({
    click(e) {
      props.setClickCoordinates([e.latlng.lat, e.latlng.lng])
      props.cleanMarker(null)
    },
  })
  return null
}

function App() {
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [searchResults, setSearchResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // State variables
  const [options, setOptions] = useState([])
  const [direccion, setDireccion] = useState("")
  const [localidad, setLocalidad] = useState("")
  const [departamento, setDepartamento] = useState("")
  const [cityOSM, setCityOSM] = useState("")
  const [addressOSM2, setAddressOSM2] = useState("")
  const [marker, setMarker] = useState(null)
  const [geocoderSelected, setGeocoderSelected] = useState("IDE")
  const [clickCoordinates, setClickCoordinates] = useState(null)
  const [dirFromCoordinatesIDE, setDirFromCoordinatesIDE] = useState("")
  const [dirFromCoordinatesOSM, setDirFromCoordinatesOSM] = useState("")

  // Effect to handle click coordinates
  useEffect(() => {
    if (clickCoordinates) {
      setLoading(true)

      // Find addresses by coordinates
      findByCoordinatesIDE(clickCoordinates[0], clickCoordinates[1])
      findByCoordinatesOSM(clickCoordinates[0], clickCoordinates[1])

      // Set loading to false after a timeout to ensure it completes
      setTimeout(() => setLoading(false), 1000)
    }
  }, [clickCoordinates])

  // Function to find address by coordinates using IDE
  const findByCoordinatesIDE = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://direcciones.ide.uy/api/v1/geocode/reverse?latitud=${lat}&limit=10&longitud=${lon}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      const responseJson = await response.json()
      if (responseJson && responseJson.length > 0) {
        setDirFromCoordinatesIDE(
          `${responseJson[0].address}, ${responseJson[0].localidad}, ${responseJson[0].departamento}`,
        )
      }
    } catch (error) {
      console.error("Error fetching IDE coordinates:", error)
      setDirFromCoordinatesIDE("No se pudo obtener la dirección")
    }
  }

  // Function to find address by coordinates using OSM
  const findByCoordinatesOSM = async (lat, lon) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const responseJson = await response.json()
      if (responseJson && responseJson.address) {
        const road = responseJson.address.road || ""
        const houseNumber = responseJson.address.house_number || ""
        const city = responseJson.address.city || responseJson.address.town || responseJson.address.village || ""
        const state = responseJson.address.state || ""

        setDirFromCoordinatesOSM(`${road} ${houseNumber}, ${city}, ${state}`)
      }
    } catch (error) {
      console.error("Error fetching OSM coordinates:", error)
      setDirFromCoordinatesOSM("No se pudo obtener la dirección")
    }
  }

  // Function to search for addresses
  const onSearch = async (searchText) => {
    if (!searchText || searchText.length < 3) return

    setLoading(true)
    try {
      const response = await fetch(
        `https://direcciones.ide.uy/api/v0/geocode/SugerenciaCalleCompleta?entrada=${searchText}&todos=true`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      const responseJson = await response.json()

      const newOptions = []
      responseJson.forEach((address, i) => {
        newOptions.push({
          key: `${i},${address.calle}`,
          label: `${address.calle}, ${address.localidad}, ${address.departamento}`,
          value: `${address.calle}, ${address.localidad}, ${address.departamento}`,
        })
      })

      setOptions(newOptions)
    } catch (error) {
      console.error("Error searching addresses:", error)
    } finally {
      setLoading(false)
    }
  }

  // Function to handle selection from autocomplete
  const onSelect = (data) => {
    const split = data.split(",")
    setDireccion(split[0])
    setLocalidad(split[1].trim())
    setDepartamento(split[2].trim())
  }

  // Function to handle input change
  const onChange = (data) => {
    setDireccion(data)
  }

  // Function to handle input change for different fields
  const onChangeInput = (inputId, data) => {
    if (inputId === "localidad") setLocalidad(data)
    if (inputId === "departamento") setDepartamento(data)
    if (inputId === "cityOSM") setCityOSM(data)
    if (inputId === "addressOSM") setAddressOSM2(data)
  }

  // Function to search for address using IDE
  const searchAddressIDE = async () => {
    if (!direccion) return

    setClickCoordinates(null)
    setLoading(true)

    try {
      const response = await fetch(
        `https://direcciones.ide.uy/api/v0/geocode/BusquedaDireccion?calle=${direccion}&departamento=${departamento}&localidad=${localidad}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      const responseJson = await response.json()
      if (responseJson && responseJson.length > 0) {
        const newMarker = [responseJson[0].puntoY, responseJson[0].puntoX]
        setMarker(newMarker)
      }
    } catch (error) {
      console.error("Error searching IDE address:", error)
    } finally {
      setLoading(false)
    }
  }

  // Function to search for address using OSM
  const searchAddressOSM = async () => {
    if (!addressOSM2 || !cityOSM) return

    setClickCoordinates(null)
    setLoading(true)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?country=Uruguay&city=${cityOSM}&street=${addressOSM2}&format=json`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      const responseJson = await response.json()
      if (responseJson && responseJson.length > 0) {
        const newMarker = [responseJson[0].lat, responseJson[0].lon]
        setMarker(newMarker)
      }
    } catch (error) {
      console.error("Error searching OSM address:", error)
    } finally {
      setLoading(false)
    }
  }

  const searchAddress = async (e) => {
    e.preventDefault()
    if (!address || !city) {
      setError("Por favor ingrese dirección y ciudad")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?country=Uruguay&city=${city}&street=${address}&format=json`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      const data = await response.json()

      if (data && data.length > 0) {
        setSearchResults(data[0])
      } else {
        setError("No se encontraron resultados")
      }
    } catch (err) {
      console.error("Error searching address:", err)
      setError("Error al buscar la dirección")
    } finally {
      setLoading(false)
    }
  }

  // Function to check if marker exists
  const existsMarker = () => {
    return marker && marker[0] !== undefined && marker[1] !== undefined
  }

  // Function to handle radio button change
  const onChangeRadio = (e) => {
    setGeocoderSelected(e.target.value)
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          background: "#1890ff",
        }}
      >
        <Title level={3} style={{ color: "white", margin: 0 }}>
          Geocodificadores Uruguay
        </Title>
      </Header>
      <Layout>
        <Sider
          theme="light"
          width={350}
          style={{
            padding: "20px",
            height: "calc(100vh - 64px)",
            overflow: "auto",
          }}
        >
          <Card title="Buscar dirección" bordered={false} style={{ marginBottom: "16px" }}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div>
                <Text strong>Seleccionar Geocodificador</Text>
                <Radio.Group
                  onChange={onChangeRadio}
                  value={geocoderSelected}
                  style={{ marginTop: "8px", display: "flex", justifyContent: "space-around" }}
                >
                  <Radio value="IDE">IDE Uruguay</Radio>
                  <Radio value="OpenStreetMap">OpenStreetMap</Radio>
                </Radio.Group>
              </div>

              <Divider style={{ margin: "12px 0" }} />

              {geocoderSelected === "IDE" ? (
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  <AutoComplete
                    style={{ width: "100%" }}
                    options={options}
                    value={direccion}
                    onSelect={onSelect}
                    onSearch={onSearch}
                    onChange={onChange}
                    placeholder="Ingresar dirección"
                  >
                    <Input prefix={<SearchOutlined />} size="large" allowClear />
                  </AutoComplete>

                  <Input
                    placeholder="Localidad"
                    value={localidad}
                    onChange={(e) => onChangeInput("localidad", e.target.value)}
                    size="large"
                    allowClear
                  />

                  <Input
                    placeholder="Departamento"
                    value={departamento}
                    onChange={(e) => onChangeInput("departamento", e.target.value)}
                    size="large"
                    allowClear
                  />

                  <Button
                    type="primary"
                    icon={<EnvironmentOutlined />}
                    onClick={searchAddressIDE}
                    size="large"
                    block
                    loading={loading}
                  >
                    Buscar
                  </Button>
                </Space>
              ) : (
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  <Input
                    placeholder="Dirección"
                    value={addressOSM2}
                    onChange={(e) => onChangeInput("addressOSM", e.target.value)}
                    prefix={<SearchOutlined />}
                    size="large"
                    allowClear
                  />

                  <Input
                    placeholder="Ciudad"
                    value={cityOSM}
                    onChange={(e) => onChangeInput("cityOSM", e.target.value)}
                    size="large"
                    allowClear
                  />

                  <Button
                    type="primary"
                    icon={<EnvironmentOutlined />}
                    onClick={searchAddressOSM}
                    size="large"
                    block
                    loading={loading}
                  >
                    Buscar
                  </Button>
                </Space>
              )}
            </Space>
          </Card>

          {clickCoordinates && (
            <Card title="Dirección encontrada" bordered={false}>
              <Spin spinning={loading}>
                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                  <div>
                    <Text strong>IDE Uruguay:</Text>
                    <div style={{ padding: "8px", background: "#f5f5f5", borderRadius: "4px", marginTop: "4px" }}>
                      {dirFromCoordinatesIDE || "Cargando..."}
                    </div>
                  </div>

                  <div>
                    <Text strong>OpenStreetMap:</Text>
                    <div style={{ padding: "8px", background: "#f5f5f5", borderRadius: "4px", marginTop: "4px" }}>
                      {dirFromCoordinatesOSM || "Cargando..."}
                    </div>
                  </div>

                  {clickCoordinates && (
                    <div>
                      <Text strong>Coordenadas:</Text>
                      <div style={{ padding: "8px", background: "#f5f5f5", borderRadius: "4px", marginTop: "4px" }}>
                        Lat: {clickCoordinates[0].toFixed(6)}, Lon: {clickCoordinates[1].toFixed(6)}
                      </div>
                    </div>
                  )}
                </Space>
              </Spin>
            </Card>
          )}

          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <Text type="secondary">Haga clic en el mapa para obtener la dirección de ese punto</Text>
          </div>
        </Sider>

        <Content style={{ position: "relative" }}>
          <MapContainer
            center={[-34.901112, -56.164532]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "calc(100vh - 64px)" }}
          >
            <MapEvents setClickCoordinates={setClickCoordinates} cleanMarker={setMarker} />

            {clickCoordinates && (
              <Marker position={clickCoordinates} icon={icon}>
                <Popup>
                  <div style={{ minWidth: "200px" }}>
                    <div style={{ marginBottom: "8px" }}>
                      <Text strong>IDE:</Text>
                      <div>{dirFromCoordinatesIDE || "Cargando..."}</div>
                    </div>
                    <div>
                      <Text strong>OSM:</Text>
                      <div>{dirFromCoordinatesOSM || "Cargando..."}</div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}

            {existsMarker() && (
              <>
                <Marker position={marker} icon={icon}>
                  <Popup>
                    <div style={{ minWidth: "200px" }}>
                      <Text strong>Dirección encontrada</Text>
                      <div>
                        Lat: {marker[0].toFixed(6)}, Lon: {marker[1].toFixed(6)}
                      </div>
                    </div>
                  </Popup>
                </Marker>
                <SetView marker={marker} />
              </>
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

          {loading && (
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "white",
                padding: "8px 16px",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                zIndex: 1000,
              }}
            >
              <Spin /> <Text style={{ marginLeft: "8px" }}>Cargando...</Text>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  )
}

export default App

