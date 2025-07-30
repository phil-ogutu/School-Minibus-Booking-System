// // utils/distance.js
// export const haversineDistance = (coord1, coord2) => {
//   const R = 6371; // Earth radius in km
//   const toRad = (deg) => (deg * Math.PI) / 180;
//   const dLat = toRad(coord2.lat - coord1.lat);
//   const dLon = toRad(coord2.lng - coord1.lng);

//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(toRad(coord1.lat)) *
//       Math.cos(toRad(coord2.lat)) *
//       Math.sin(dLon / 2) ** 2;

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // distance in km
// };

export const calculatePrice = (distanceInKm) => {
  const baseFare = 50;
  const perKm = 10;
  return baseFare + distanceInKm * perKm;
};

// utils/distance.js - Enhanced with ETA calculations
export const haversineDistance = (coord1, coord2) => {
  const R = 6371; // Earth radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in km
};

// Calculate route distance through multiple points
export const calculateRouteDistance = (points) => {
  if (points.length < 2) return 0
  
  let totalDistance = 0
  for (let i = 1; i < points.length; i++) {
    totalDistance += haversineDistance(points[i-1], points[i])
  }
  
  return totalDistance
}

// Estimate travel time in minutes
export const estimateTravelTime = (distanceKm, speedKmH = 30) => {
  return (distanceKm / speedKmH) * 60
}

// Calculate remaining distance to destination along a route
export const calculateRemainingRouteDistance = (currentPosition, routePoints) => {
  if (!currentPosition || !routePoints?.length) return 0
  
  // Find the nearest point on the route
  let nearestIndex = 0
  let minDistance = Infinity
  
  routePoints.forEach((point, index) => {
    const dist = haversineDistance(currentPosition, point)
    if (dist < minDistance) {
      minDistance = dist
      nearestIndex = index
    }
  })
  
  // Calculate distance from nearest point to end
  let remainingDistance = 0
  for (let i = nearestIndex; i < routePoints.length - 1; i++) {
    remainingDistance += haversineDistance(routePoints[i], routePoints[i+1])
  }
  
  return remainingDistance
}
