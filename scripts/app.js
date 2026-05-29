const bounds = [
    [47.43, 18.97],
    [47.55, 19.12] 
];

const map = L.map('map', {
    center: [47.4979, 19.0402],
    zoom: 13,
    minZoom: 12,                
    maxBounds: bounds,          
    maxBoundsViscosity: 1.0,
    zoomControl: false 
});

L.control.zoom({
    position: 'topleft',
    zoomInText: '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
    zoomOutText: '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>'
}).addTo(map);

const lightBasemap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO | Adatok: BKK / Teszt'
});

const darkBasemap = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO | Adatok: BKK / Teszt'
});

lightBasemap.addTo(map);

const toggleBtn = document.getElementById('darkModeToggle');
const sunIconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
const moonIconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        map.removeLayer(lightBasemap); 
        darkBasemap.addTo(map);        
        
        toggleBtn.innerHTML = sunIconSvg;
        toggleBtn.style.backgroundColor = '#f39c12';
        toggleBtn.style.color = '#fff';
    } else {
        map.removeLayer(darkBasemap);
        lightBasemap.addTo(map);
        
        toggleBtn.innerHTML = moonIconSvg;
        toggleBtn.style.backgroundColor = '#2c3e50';
        toggleBtn.style.color = '#fff';
    }
});

async function loadBubiData() {
    try {
        // Fetching data from our secure Vercel backend route!
        let response = await fetch('/api/bubi');
        let json = await response.json();
        
        let stations = json.data.list;

        if (stations.length === 0) {
            stations = [
                { name: "ELTE Lágymányosi Campus", lat: 47.4734, lon: 19.0622, bikes: 12, spaces: 5 },
                { name: "Astoria", lat: 47.4944, lon: 19.0592, bikes: 0, spaces: 15 },
                { name: "Kálvin tér", lat: 47.4895, lon: 19.0618, bikes: 3, spaces: 10 },
                { name: "Deák Ferenc tér", lat: 47.4979, lon: 19.0528, bikes: 25, spaces: 2 },
                { name: "Jászai Mari tér", lat: 47.5135, lon: 19.0483, bikes: 1, spaces: 20 },
                { name: "Fővám tér", lat: 47.4873, lon: 19.0581, bikes: 8, spaces: 12 },
                { name: "Szent Gellért tér", lat: 47.4841, lon: 19.0525, bikes: 5, spaces: 5 },
                { name: "Oktogon", lat: 47.5055, lon: 19.0628, bikes: 0, spaces: 18 },
                { name: "Margit híd, budai hídfő", lat: 47.5143, lon: 19.0396, bikes: 4, spaces: 8 }
            ];
        }

        for (let i = 0; i < stations.length; i++) {
            let station = stations[i];
            let bikesAvailable = station.bikes;
            let emptySlots = station.spaces;

            let markerColor = '#2ecc71'; 
            if (bikesAvailable === 0) {
                markerColor = '#e74c3c'; 
            } else if (bikesAvailable <= 5) {
                markerColor = '#e67e22'; 
            }

            let circle = L.circleMarker([station.lat, station.lon], {
                color: '#ffffff',
                weight: 2,
                fillColor: markerColor,
                fillOpacity: 0.9,
                radius: 8
            }).addTo(map);

            let popupContent = `
                <div class="popup-title">${station.name}</div>
                <div class="popup-data">
                    Szabad biciklik: <span class="highlight" style="color: ${markerColor}">${bikesAvailable}</span> db<br>
                    Szabad helyek: <span class="highlight">${emptySlots}</span> db
                </div>
            `;

            circle.bindPopup(popupContent, {
                className: 'custom-popup'
            });
        }
    } catch (error) {
        console.error("Hiba az adatok betöltésekor: ", error);
    }
}

let legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = `
        <div class="legend-box">
            <h4>Foglaltság</h4>
            <div class="legend-item"><i style="background: #2ecc71;"></i> Sok (> 5 db)</div>
            <div class="legend-item"><i style="background: #e67e22;"></i> Kevés (1-5 db)</div>
            <div class="legend-item"><i style="background: #e74c3c;"></i> Üres (0 db)</div>
        </div>
    `;
    return div;
};
legend.addTo(map);

loadBubiData();