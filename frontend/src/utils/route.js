export const getRouteFromStops = async (stops,setRouteCoordinates) => {
    try {
      // Validate stops input
      if (!stops || stops?.length === 0) {
        console.warn('No valid stops provided for routing');
        return;
      }

      const validStops = stops?.filter(stop => 
        stop && typeof stop?.lat === 'number' && typeof stop?.lng === 'number'
      );

      if (validStops?.length < 2) {
        console.warn('Need at least 2 valid stops for routing');
        const fallbackRoute = validStops?.map(stop => [stop?.lat, stop?.lng]);
        setRouteCoordinates(fallbackRoute);
        return;
      }

      // Try multiple routing services for better road-following
      const routingServices = [
        // OSRM with full geometry
        {
          name: 'OSRM',
          url: (waypoints) => `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson&steps=true`
        },
        // Alternative OSRM endpoint
        {
          name: 'OSRM-Alt',
          url: (waypoints) => `https://router.project-osrm.org/route/v1/car/${waypoints}?overview=full&geometries=geojson`
        }
      ];

      // Create waypoints string for routing service
      const waypoints = validStops?.map(stop => `${stop?.lng},${stop?.lat}`).join(';');
      
        for (const service of routingServices) {
            try {
                console.log(`Trying ${service?.name} routing service...`);
                const response = await fetch(service.url(waypoints));
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(`${service?.name} response:`, data);
                    
                    if (data?.routes && data?.routes[0] && data?.routes[0].geometry) {
                    const geometry = data?.routes[0]?.geometry;
                    
                    if (geometry?.coordinates && geometry?.coordinates.length > 0) {
                        // Convert coordinates from [lng, lat] to [lat, lng] for Leaflet
                        const coordinates = geometry?.coordinates
                        .filter(coord => coord && coord?.length >= 2 && 
                                typeof coord[0] === 'number' && typeof coord[1] === 'number')
                        .map(coord => [coord[1], coord[0]]);
                        
                        if (coordinates.length > 2) { // Need more than 2 points for a good route
                            console.log(`Successfully got ${coordinates?.length} route points from ${service?.name}`);
                            setRouteCoordinates(coordinates);
                            return; // Success, exit function
                        }
                    }
                    }
                }
            } catch (serviceError) {
                console.warn(`${service.name} failed:`, serviceError);
                continue; // Try next service
            }
        }

      console.log('All routing services failed, creating enhanced fallback route');
      const enhancedRoute = [];
      
      for (let i = 0; i < validStops?.length - 1; i++) {
        const start = validStops[i];
        const end = validStops[i + 1];
        
        // Add start point
        enhancedRoute.push([start?.lat, start?.lng]);
        
        // Add intermediate points for smoother curves
        const latDiff = end?.lat - start?.lat;
        const lngDiff = end?.lng - start?.lng;
        const steps = Math.max(3, Math.floor(Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 100));
        
        for (let j = 1; j < steps; j++) {
          const ratio = j / steps;
          const lat = start?.lat + latDiff * ratio;
          const lng = start?.lng + lngDiff * ratio;
          enhancedRoute.push([lat, lng]);
        }
      }
      
      // Add final point
      const lastStop = validStops[validStops?.length - 1];
      enhancedRoute.push([lastStop?.lat, lastStop?.lng]);
      
      setRouteCoordinates(enhancedRoute);
    } catch (error) {
      console.error('Complete routing failure:', error);
      // Final fallback to simple direct lines
      const validStops = stops?.filter(stop => 
        stop && typeof stop?.lat === 'number' && typeof stop.lng === 'number'
      );
      const simpleRoute = validStops?.map(stop => [stop?.lat, stop.lng]);
      setRouteCoordinates(simpleRoute);
    }
  };