// src/utils/geocode.js
export const fetchLatLng = async (locationName) => {
  console.log("STRING CALLED")
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${locationName}&format=json`
    );
    const data = await res.json();

    if (data.length === 0) {
      throw new Error("Location not found");
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch (err) {
    console.error("Error fetching location coordinates:", err);
    throw err;
  }
};

// Utility for Fetching Latitude and Longitude from location names e.g Nairobi, Mandera
// With this, we get lat/long for our start/end points in routes
// distance.js (haversineDistance and calculatePrice) then calculates the distance and price for the route respectively