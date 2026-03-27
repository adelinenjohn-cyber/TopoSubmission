// creating the map
const map = L.map("map").setView([1.3521, 103.8198], 11);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const regionFilter = document.getElementById("regionFilter");
const resultCount = document.getElementById("resultCount");
const hawkerList = document.getElementById("hawkerList");

let allHawkers = [];
let allMarkers = [];

// building addr to display
function getAddress(properties) {
    if (properties.ADDRESS_MYENV) {
        return properties.ADDRESS_MYENV;
    }

    const block = properties.ADDRESSBLOCKHOUSENUMBER || "";
    const street = properties.ADDRESSSTREETNAME || "";
    const postal = properties.ADDRESSPOSTALCODE || "";

    return `${block} ${street} Singapore ${postal}`.trim();
}

// formiing the regions using lat & long ranges
function getRegion(lat, lng) {
    // Very simple heuristic, not official boundaries
    if (lat >= 1.41) {
        return "North";
    } else if (lng >= 103.91) {
        return "East";
    } else if (lng <= 103.76) {
        return "West";
    } else if (lat <= 1.295) {
        return "South";
    } else {
        return "Central";
    }
}

function clearMarkers() { function clearMarkers() { // removes old markers from the map before drawing new filtered ones
    for (let i = 0; i < allMarkers.length; i++) {
        map.removeLayer(allMarkers[i]);
    }
    allMarkers = [];
}

// forming the status filter dropdown
function populateStatusFilter(hawkers) {
    const statuses = [];

    for (let i = 0; i < hawkers.length; i++) {
        const status = hawkers[i].properties.STATUS;

        if (status && !statuses.includes(status)) {
            statuses.push(status);
        }
    }

    statuses.sort();

    for (let i = 0; i < statuses.length; i++) {
        const option = document.createElement("option");
        option.value = statuses[i];
        option.textContent = statuses[i];
        statusFilter.appendChild(option);
    }
}

function renderHawkerList(hawkers) { // making hawker cards
    hawkerList.innerHTML = "";

    for (let i = 0; i < hawkers.length; i++) {
        const hawker = hawkers[i];
        const props = hawker.properties;
        const coords = hawker.geometry.coordinates;

        const lng = coords[0];
        const lat = coords[1];
        const region = getRegion(lat, lng);

        const card = document.createElement("div"); // creating the hawker card
        card.className = "hawker-card";

        card.innerHTML = `
            <h3>${props.NAME || "Unknown Hawker Centre"}</h3>
            <p><strong>Address:</strong> ${getAddress(props)}</p>
            <p><strong>Postal Code:</strong> ${props.ADDRESSPOSTALCODE || "N/A"}</p>
            <p><strong>Status:</strong> ${props.STATUS || "N/A"}</p>
            <p><strong>Region:</strong> ${region}</p>
        `; // details for each hawker for the sidebar 

        card.addEventListener("click", function () {
            map.setView([lat, lng], 16);
        }); // on clicking the hawker card on sidebar, move to hawker in map

        hawkerList.appendChild(card);
    }
}


function renderMarkers(hawkers) { // making hawker markers for the map
    clearMarkers();

    for (let i = 0; i < hawkers.length; i++) {
        const hawker = hawkers[i];
        const props = hawker.properties;
        const coords = hawker.geometry.coordinates;

        const lng = coords[0];
        const lat = coords[1];
        const region = getRegion(lat, lng);

        const marker = L.marker([lat, lng]).addTo(map);

        marker.bindPopup(`
            <b>${props.NAME || "Unknown Hawker Centre"}</b><br>
            Address: ${getAddress(props)}<br>
            Postal Code: ${props.ADDRESSPOSTALCODE || "N/A"}<br>
            Status: ${props.STATUS || "N/A"}<br>
            Region: ${region}
        `); // hawker details to marker on map as a popup 

        allMarkers.push(marker);
    }
}

// filter
function filterHawkers() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value;
    const selectedRegion = regionFilter.value;

    const filteredHawkers = [];

	for (let i = 0; i < allHawkers.length; i++) {
		const hawker = allHawkers[i];

		const props = hawker.properties;
		const name = (props.NAME || "").toLowerCase();

		const coords = hawker.geometry.coordinates;
		const lng = coords[0];
		const lat = coords[1];

		const status = props.STATUS || "";
		const region = getRegion(lat, lng);

		const matchesSearch = name.includes(searchText);
		const matchesStatus = selectedStatus === "all" || status === selectedStatus;
		const matchesRegion = selectedRegion === "all" || region === selectedRegion;

		if (matchesSearch && matchesStatus && matchesRegion) {
			filteredHawkers.push(hawker);
    }
}

    renderMarkers(filteredHawkers);
    renderHawkerList(filteredHawkers);
    resultCount.textContent = `Showing ${filteredHawkers.length} hawker centres`;
}

// getting data from flask
fetch("/api/hawkers")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        allHawkers = data;

        populateStatusFilter(allHawkers);
        filterHawkers();
    })
    .catch(function (error) {
        console.error("Error loading hawker data:", error);
        resultCount.textContent = "Failed to load hawker data";
    });

searchInput.addEventListener("input", filterHawkers);
statusFilter.addEventListener("change", filterHawkers);
regionFilter.addEventListener("change", filterHawkers);