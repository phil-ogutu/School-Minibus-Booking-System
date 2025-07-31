"use client";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import { BASE_URL } from "@/utils/constants";
import Text from "@/components/ui/Text";
import Container from "@/components/ui/Container";
import { useRoutes } from "@/hooks/useRoutes";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

const DragIcon = () => (
  <svg className="w-5 h-5 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
  </svg>
);

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function StopsContainer() {
    const searchParams = useSearchParams();
    const routeId = searchParams.get('id');
    const [stops,setStops]=useState([{
        id: Date.now(),
        location_name: '',
        latitude: '',
        longitude: ''
    }]);
    const fetchExistingroute=async()=>{
        if(routeId){
            const res = await fetch(`${BASE_URL}/api/routes/${routeId}`, { credentials:'include'});
            const result = await res.json();
            console.log(result)
            setStops(result?.locations)
        }
    }
    useEffect(()=>{
        fetchExistingroute()
    },[routeId]);

    const { createNewRoute, updateExistingRoute } = useRoutes(`/api/routes`);
    
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    const handlePlaceSelect = (stopIndex, place) => {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const description = place.formatted_address || place.description;

        setStops(prev =>
            prev.map((stop, idx) =>
                idx === stopIndex
                    ? {
                        ...stop,
                        latitude: lat,
                        longitude: lng,
                        location_name: description,
                    }
                    : stop
            )
        );

        console.log(`Stop ${stopIndex + 1} selected:`, place);
    };

    const addStop = () => {
        setStops(prev => [...prev, { id: Date.now(), place: null }]);
    };

    const removeStop = (stopIndex) => {
        if (stops.length > 1) {
            setStops(prev => prev.filter((_, idx) => idx !== stopIndex));
        }
    };
    const handleDragStart = (e, index) => {
        setDraggedItem(index);
        e.dataTransfer.effectAllowed = 'move';
        e.target.style.opacity = '0.5';
        console.log('started drag')
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        setDraggedItem(null);
        setDragOverIndex(null);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        
        if (draggedItem === null || draggedItem === dropIndex) {
            return;
        }

        const newStops = [...stops];
        const draggedStop = newStops[draggedItem];
        
        // Remove dragged item
        newStops.splice(draggedItem, 1);
        
        // Insert at new position
        const insertIndex = draggedItem < dropIndex ? dropIndex - 1 : dropIndex;
        newStops.splice(insertIndex, 0, draggedStop);
        
        setStops(newStops);
        setDraggedItem(null);
        setDragOverIndex(null);
    };

    const handleSaveRoutes = async() => {
        const payload = {
            start:stops[0]?.location_name,
            end:stops[stops?.length - 1]?.location_name,
            stops
        }
        if(routeId){
            await updateExistingRoute(routeId,payload).then(()=>{
                toast.success('Route updated successfully');
            }).catch((err)=>{
                toast.error('Could not update Route',err)
            })
            return;
        }
        if(stops?.length >= 2){
            await createNewRoute(payload).then(()=>{
                toast.success('Route created successfully');
                setStops([{
                    id: Date.now(),
                    location_name: '',
                    latitude: '',
                    longitude: ''
                }]);
            }).catch((err)=>{
                toast.error('Could not create route')
            })
        }else{
            toast.error('You need to select at least two stops')
        }
    };

    return (
        <div className="flex-1 grid grid-cols-2 w-full">
            {/* Left Side */}
            <div className="overflow-y-auto no-scrollbar h-[calc(100vh-150px)] w-full p-4 ">
                <Container className='flex flex-row justify-between my-2'>
                    <Text className='text-4xl fw-bold' as='h1'>{routeId ? 'Manage':'Create'} Route</Text>
                    <button className="p-2 bg-dark rounded-md text-white" onClick={()=>{addStop()}}>add stop</button>
                </Container>
                {stops?.map((stop,idx)=>{
                    return(
                        <div
                            key={stop?.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, idx)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOver(e, idx)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, idx)}
                            className={`bg-white p-4 rounded-lg shadow-sm transition-all duration-200 cursor-move mb-2 ${
                                dragOverIndex === idx && draggedItem !== idx
                                ? 'border-yellow-400 bg-yellow-50 scale-105'
                                : draggedItem === idx
                                ? 'border-neutral-300 bg-neutral-50'
                                : 'border-neutral-200 hover:border-neutral-300'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-neutral-100 rounded">
                                        <DragIcon />
                                    </div>
                                    <h3 className="text-lg font-semibold text-neutral-700">Stop {idx + 1}</h3>
                                </div>
                                {stops.length > 1 && (
                                    <button
                                        onClick={() => removeStop(idx)}
                                        className="text-red-500 hover:text-red-700 font-medium text-sm px-2 py-1 hover:bg-red-50 rounded transition-colors"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <StopSelector stops={stops?.length} stop={stop} onPlaceSelect={(place) => handlePlaceSelect(idx, place)} value={stop?.location_name || ""}/>
                        </div>
                    )
                })}
                <div className="flex flex-row">
                    <button className="p-2 bg-primary rounded-md text-dark" onClick={()=>{handleSaveRoutes()}}>Save route</button>
                </div>
            </div>
            {/* Right Side - Map */}
            <div className="hidden md:block md:w-full md:h-full md:p-2">
                <Map locations={stops ??[]} />
            </div>
        </div>
    );
};

const StopSelector=({ onPlaceSelect, placeholder = "Search places", value = "" })=>{
    const [query, setQuery] = useState(value);
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);

    // Google Places API integration
    const searchPlaces = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);

        try {
            // Check if Google Maps API is loaded
            if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
                throw new Error('Google Maps API not loaded. Please include the Google Maps JavaScript API with Places library.');
            }

            const service = new google.maps.places.AutocompleteService();
            const request = {
                input: searchQuery,
                types: ['establishment', 'geocode'],
                componentRestrictions: { country: 'ke' },
            };

            service.getPlacePredictions(request, (predictions, status) => {
                setIsLoading(false);
                
                if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                setSuggestions(predictions);
                } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                setSuggestions([]);
                } else {
                console.error('Places API error:', status);
                setSuggestions([]);
                }
            });
        } catch (error) {
            console.error('Error searching places:', error);
            setIsLoading(false);
            setSuggestions([]);
            
            // Fallback to show error message to user
            setSuggestions([{
                place_id: 'error',
                description: 'Google Maps API not available',
                structured_formatting: {
                main_text: 'API Error',
                secondary_text: 'Please check Google Maps API setup'
                }
            }]);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            searchPlaces(query);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
            suggestionsRef.current && 
            !suggestionsRef.current.contains(event.target) &&
            !inputRef.current.contains(event.target)
            ) {
            setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = async (place) => {
        console.log(place)
        if (place.place_id === 'error') {
            return;
        }
        
        
        if (onPlaceSelect) {
            try {
                const placeDetails = await getPlaceDetails(place.place_id);
                console.log('placeDetails',placeDetails)
                const enrichedPlace = {
                    ...place,
                    geometry: placeDetails.geometry,
                    lat: placeDetails.geometry.location.lat(),
                    lng: placeDetails.geometry.location.lng()
                };
                setQuery(place.description);
                setShowSuggestions(false);
                console.log('enrichedPlace',enrichedPlace)
                onPlaceSelect(enrichedPlace);
            } catch (error) {
                console.error('Error getting place details:', error);
                onPlaceSelect(place);
            }
        }
    };

    const getPlaceDetails = (placeId) => {
        return new Promise((resolve, reject) => {
            if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
                reject(new Error('Google Maps API not loaded'));
                return;
            }

            const service = new google.maps.places.PlacesService(document.createElement('div'));
            const request = {
                placeId: placeId,
                fields: ['geometry', 'name', 'formatted_address']
            };

            service.getDetails(request, (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(place);
                } else {
                    reject(new Error(`Places service failed: ${status}`));
                }
            });
        });
    };

    const handleInputFocus = () => {
        if (suggestions.length > 0) {
        setShowSuggestions(true);
        }
    };
    return(
        <div className="relative w-full">
            <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={query ?? value}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            />
            {showSuggestions && (suggestions.length > 0 || isLoading) && (
                <div 
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto mt-1"
                >
                {isLoading ? (
                    <div className="px-4 py-3 text-center text-neutral-500">
                    <div className="inline-block w-4 h-4 border-2 border-neutral-300 border-t-yellow-400 rounded-full animate-spin mr-2"></div>
                    Searching...
                    </div>
                ) : (
                    suggestions.map((place) => (
                    <div
                        key={place.place_id}
                        onClick={() => handleSuggestionClick(place)}
                        className="px-4 py-3 hover:bg-neutral-50 cursor-pointer border-b border-neutral-100 last:border-b-0"
                    >
                        <div className="font-medium text-neutral-900">
                        {place.structured_formatting.main_text}
                        </div>
                        <div className="text-sm text-neutral-600">
                        {place.structured_formatting.secondary_text}
                        </div>
                    </div>
                    ))
                )}
                </div>
            )}
        </div>
    )
}