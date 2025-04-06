"use client"

import { useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import the Map component with no SSR
const SimpleMap = dynamic(() => import("../components/simple-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
      <div className="text-blue-500">Cargando mapa...</div>
    </div>
  ),
})

export default function Home() {
  // Basic state
  const [activeTab, setActiveTab] = useState("ide")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // IDE geocoder state
  const [direccion, setDireccion] = useState("")
  const [localidad, setLocalidad] = useState("")
  const [departamento, setDepartamento] = useState("")

  // OSM geocoder state
  const [addressOSM, setAddressOSM] = useState("")
  const [cityOSM, setCityOSM] = useState("")

  // Results state
  const [marker, setMarker] = useState(null)
  const [clickCoordinates, setClickCoordinates] = useState(null)
  const [dirFromCoordinatesIDE, setDirFromCoordinatesIDE] = useState("")
  const [dirFromCoordinatesOSM, setDirFromCoordinatesOSM] = useState("")

  // Handle map click
  const handleMapClick = (coords) => {
    setClickCoordinates(coords)
    setMarker(null)

    // Find addresses by coordinates
    findByCoordinatesIDE(coords[0], coords[1])
    findByCoordinatesOSM(coords[0], coords[1])
  }

  // Function to find address by coordinates using IDE
  const findByCoordinatesIDE = async (lat, lon) => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://direcciones.ide.uy/api/v1/geocode/reverse?latitud=${lat}&limit=10&longitud=${lon}`,
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
    } finally {
      setLoading(false)
    }
  }

  // Function to find address by coordinates using OSM
  const findByCoordinatesOSM = async (lat, lon) => {
    setLoading(true)
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
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
    } finally {
      setLoading(false)
    }
  }

  // Function to search for address using IDE
  const searchAddressIDE = async () => {
    if (!direccion) return

    setClickCoordinates(null)
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://direcciones.ide.uy/api/v0/geocode/BusquedaDireccion?calle=${direccion}&departamento=${departamento}&localidad=${localidad}`,
      )
      const responseJson = await response.json()
      if (responseJson && responseJson.length > 0) {
        const newMarker = [responseJson[0].puntoY, responseJson[0].puntoX]
        setMarker(newMarker)
      } else {
        setError("No se encontraron resultados")
      }
    } catch (error) {
      console.error("Error searching IDE address:", error)
      setError("Error al buscar la dirección")
    } finally {
      setLoading(false)
    }
  }

  // Function to search for address using OSM
  const searchAddressOSM = async () => {
    if (!addressOSM || !cityOSM) return

    setClickCoordinates(null)
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?country=Uruguay&city=${cityOSM}&street=${addressOSM}&format=json`,
      )
      const responseJson = await response.json()
      if (responseJson && responseJson.length > 0) {
        const newMarker = [Number.parseFloat(responseJson[0].lat), Number.parseFloat(responseJson[0].lon)]
        setMarker(newMarker)
      } else {
        setError("No se encontraron resultados")
      }
    } catch (error) {
      console.error("Error searching OSM address:", error)
      setError("Error al buscar la dirección")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold max-w-7xl mx-auto">Geocodificadores Uruguay</h1>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">Buscar dirección</h2>

              {/* Tabs */}
              <div className="mb-6">
                <div className="flex border-b">
                  <button
                    className={`py-2 px-4 font-medium ${
                      activeTab === "ide"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("ide")}
                  >
                    IDE Uruguay
                  </button>
                  <button
                    className={`py-2 px-4 font-medium ${
                      activeTab === "osm"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("osm")}
                  >
                    OpenStreetMap
                  </button>
                </div>
              </div>

              {/* IDE Form */}
              {activeTab === "ide" && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <input
                      type="text"
                      id="direccion"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Ingrese dirección"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="localidad" className="block text-sm font-medium text-gray-700 mb-1">
                      Localidad
                    </label>
                    <input
                      type="text"
                      id="localidad"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Ingrese localidad"
                      value={localidad}
                      onChange={(e) => setLocalidad(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-1">
                      Departamento
                    </label>
                    <input
                      type="text"
                      id="departamento"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Ingrese departamento"
                      value={departamento}
                      onChange={(e) => setDepartamento(e.target.value)}
                    />
                  </div>

                  <button
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                    onClick={searchAddressIDE}
                    disabled={loading}
                  >
                    {loading ? "Buscando..." : "Buscar"}
                  </button>
                </div>
              )}

              {/* OSM Form */}
              {activeTab === "osm" && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="addressOSM" className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <input
                      type="text"
                      id="addressOSM"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Ingrese dirección"
                      value={addressOSM}
                      onChange={(e) => setAddressOSM(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="cityOSM" className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      id="cityOSM"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Ingrese ciudad"
                      value={cityOSM}
                      onChange={(e) => setCityOSM(e.target.value)}
                    />
                  </div>

                  <button
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                    onClick={searchAddressOSM}
                    disabled={loading}
                  >
                    {loading ? "Buscando..." : "Buscar"}
                  </button>
                </div>
              )}

              {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
            </div>

            {/* Results */}
            {clickCoordinates && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Dirección encontrada</h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">IDE Uruguay:</h3>
                    <div className="p-2 bg-gray-100 rounded-md text-sm">
                      {loading ? "Cargando..." : dirFromCoordinatesIDE || "No disponible"}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-1">OpenStreetMap:</h3>
                    <div className="p-2 bg-gray-100 rounded-md text-sm">
                      {loading ? "Cargando..." : dirFromCoordinatesOSM || "No disponible"}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-1">Coordenadas:</h3>
                    <div className="p-2 bg-gray-100 rounded-md text-sm">
                      Lat: {clickCoordinates[0].toFixed(6)}, Lon: {clickCoordinates[1].toFixed(6)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 text-center text-sm text-gray-500">
              Haga clic en el mapa para obtener la dirección de ese punto
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2 h-[calc(100vh-12rem)] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-md">
            <SimpleMap marker={marker} clickCoordinates={clickCoordinates} onMapClick={handleMapClick} />
          </div>
        </div>
      </main>
    </div>
  )
}

