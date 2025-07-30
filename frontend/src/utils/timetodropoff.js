import { haversineDistance } from "./distance";
// Usage example: Calculate distance from checkpoint to dropoff point
export const calculateTimeToDropoff = (checkpoint, dropoffCoords) => {
  const { lat: checkpointLat, lng: checkpointLng, speed } = checkpoint;
  
  // Calculate distance between checkpoint and dropoff point
  const distanceMeters = haversineDistance(
    { lat: checkpointLat, lng: checkpointLng },
    dropoffCoords
  );
  
  // Calculate time in seconds: time = distance / speed
  const timeSeconds = distanceMeters / speed;

  // Convert time to minutes and seconds
  const minutes = Math.floor(timeSeconds / 60);
  const seconds = Math.round(timeSeconds % 60);
//   console.log('distance to dropoff: ', timeSeconds)

  return {
    distanceMeters,
    timeSeconds,
    minutes,
    seconds,
  };
};

// // Example of how to use this
// const checkpoint = { lat: 51.5074, lng: -0.1278, speed: 15 }; // speed in m/s (example: 15 m/s)
// const dropoffCoords = { lat: 51.5154, lng: -0.1355 }; // Example dropoff coords

// const { distanceMeters, timeSeconds, minutes, seconds } = calculateTimeToDropoff(checkpoint, dropoffCoords);

// console.log(`Distance to dropoff: ${distanceMeters} meters`);
// console.log(`Time to dropoff: ${minutes} minutes and ${seconds} seconds`);

/** checkpoint is emitted from checkpoint reached (in backend/app.py). Used in trackTrip/page.jsx */