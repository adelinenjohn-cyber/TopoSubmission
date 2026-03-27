# TopoSubmission
A web application that visualizes Singapore hawker centers on an interactive map, built with Flask, JavaScript, HTML, and CSS.

# Overview

This project is an interactive geospatial web application that visualizes hawker centres across Singapore on a map.

The application allows users to:
- view hawker centre locations as map markers
- click markers to see hawker centre details
- search hawker centres by name
- filter hawker centres by status and region

The project is built using Flask for the backend and Leaflet with OpenStreetMap for the frontend map visualization.

# Approach and Architecture

I used Flask for the backend to serve both the webpage and the hawker centre dataset. The dataset is stored locally as a .geojson file.

For the frontend, JavaScript fetches the hawker data from Flask and uses Leaflet to render:
- the interactive map
- hawker centre markers
- popup details
- search anf filter feature

The application is split into two parts:

Backend
- Flask
- Reads the `hawkers.geojson` file
- Serves the main HTML page
- Provides hawker data through `/api/hawkers`

Frontend
- HTML for page structure
- CSS for styling
- JavaScript for interactivity
- Leaflet for map rendering
- OpenStreetMap for map tiles

# Data Flow

1. User opens the Flask app in the browser
2. Flask renders `index.html`
3. JavaScript requests hawker data from `/api/hawkers`
4. Flask returns hawker data as JSON
5. JavaScript renders sidebar cards and map markers
6. Search and filter inputs update the displayed hawkers 

# Setup Instructions

1. Clone the repository
'''bash
git clone https://github.com/adelinenjohn-cyber/TopoSubmission
cd hawker-map

2. Install Flask
'''bash
pip install flask

3. Run the application
'''bash
python app.py

4. View the application
Go to http://127.0.0.1:5000

# Testing instructions

Testing of the app can be done by manual checking of its functionality as follows:
1. Open the app
2. Check the app's features such as:
The map loads correctly
Hawker centre markers appear on the map
Clicking on a marker displays a popup with details
Typing in the search bar filters hawker centres by name
Selecting a status and/or from the dropdown filters results correctly
The sidebar updates according to the applied filters
Typing in the search bar yields results complying with filters


