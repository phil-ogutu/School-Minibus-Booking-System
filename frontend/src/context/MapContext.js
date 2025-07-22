import React, { createContext, useState, useContext, useEffect } from "react";
// import { routesData } from "@/data/RoutesData";

// Create the context
const MapContext = createContext();

// Context Provider Component
export const MapProvider = ({ children }) => {
  const [coordinates, setCoordinates] = useState(); // holds the current logged-in user
  // const [currentRoutes, setCurrentRoutes] = useState(routesData)
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");


  return (
    <MapContext.Provider
      value={{
        coordinates,
        setCoordinates,
        from,
        setFrom,
        to,
        setTo,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

// Custom hook to use the context safely
export const useTheContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useTheContext must be used within a Provider");
  }
  return context;
};
