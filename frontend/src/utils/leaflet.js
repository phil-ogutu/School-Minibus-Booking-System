import L from 'leaflet';

let L_Instance = null;

const loadLeaflet = async (setIsMapLoaded) => {
    if (typeof window !== 'undefined') {
        // Load CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(cssLink);
    
        // Load JS
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
        script.onload = () => {
            setIsMapLoaded(true);
        };
        document.head.appendChild(script);
    }
};

export {
    loadLeaflet,
    L as L_Instance
}
