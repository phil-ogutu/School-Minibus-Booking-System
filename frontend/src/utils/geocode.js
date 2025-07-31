// // src/utils/geocode.js
// export const fetchLatLng = async (locationName) => {
//   console.log("STRING CALLED")
//   try {
//     const res = await fetch(
//       `https://nominatim.openstreetmap.org/search?q=${locationName}&format=json`
//     );
//     const data = await res.json();

//     if (data.length === 0) {
//       throw new Error("Location not found");
//     }

//     return {
//       lat: parseFloat(data[0].lat),
//       lng: parseFloat(data[0].lon),
//     };
//   } catch (err) {
//     console.error("Error fetching location coordinates:", err);
//     throw err;
//   }
// };

// // Utility for Fetching Latitude and Longitude from location names e.g Nairobi, Mandera
// // With this, we get lat/long for our start/end points in routes
// // distance.js (haversineDistance and calculatePrice) then calculates the distance and price for the route respectively

// utils/geocode.js - Enhanced with caching
const geocodeCache = new Map()

export const fetchLatLng = async (locationName) => {
  if (!locationName) return null
  
  // Check cache first
  if (geocodeCache.has(locationName)) {
    return geocodeCache.get(locationName)
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`
    )
    
    if (!res.ok) throw new Error('Geocoding service error')
    
    const data = await res.json()
    if (data.length === 0) {
      throw new Error('Location not found')
    }

    const result = {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      address: data[0].display_name
    }

    // Cache the result
    geocodeCache.set(locationName, result)
    return result
  } catch (error) {
    console.error('Geocoding error:', error)
    throw error
  }
}

// Batch geocode multiple locations
export const batchGeocode = async (locations) => {
  const results = {}
  
  await Promise.all(locations.map(async (location) => {
    try {
      const coords = await fetchLatLng(location)
      results[location] = coords
    } catch (error) {
      results[location] = null
    }
  }))
  
  return results
}