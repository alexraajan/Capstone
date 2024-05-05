// Call this function when the page loads to populate the dropdown
document.addEventListener('DOMContentLoaded', populateDistrictDropdown);

async function populateDistrictDropdown() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/Suburb');
        const suburbs = await response.json();
        const dropdown = document.getElementById('district-dropdown');
        suburbs.forEach(suburbObject => {
            const option = document.createElement('option');
            option.value = suburbObject.name.trim(); // Use trim to remove any whitespace
            option.textContent = suburbObject.name.trim(); // Use the key 'Town_suburb' to access the suburb name
            dropdown.appendChild(option);
        });

    } catch (error) {
        console.error('Error fetching district names:', error);
    }
}

function displayResponse(data) {
    const schools = data.map(school => ({
        School_name: school.School_name,
        Level_of_schooling: school.Level_of_schooling,
        Street: school.Street,
        Postcode: school.Postcode,
        Phone: school.Phone
    }));

    const table = document.createElement('table');
    const headerRow = table.insertRow();
    for (const key in schools[0]) {
        const headerCell = document.createElement('th');
        headerCell.textContent = key.replace(/_/g, ' ');
        headerRow.appendChild(headerCell);
    }

    schools.forEach(school => {
        const row = table.insertRow();
        for (const key in school) {
            const cell = row.insertCell();
            cell.textContent = school[key];
        }
    });

    const jsonResponseContainer = document.getElementById('json-response');
    jsonResponseContainer.innerHTML = '';
    jsonResponseContainer.appendChild(table);
}

let isFirstSubmit = true;
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    if (isFirstSubmit) {
        // Uncollapse all elements with the id 'row'
        document.querySelectorAll('#uncollapse').forEach(element => {
            element.classList.remove('uncollapse');
        });
        document.querySelectorAll('#main-collapse').forEach(element => {
            element.classList.remove('main-collapse');
        });
        document.querySelectorAll('#main-collapse-2').forEach(element => {
            element.classList.remove('main-collapse-2');
        });
        document.querySelectorAll('#row-1').forEach(element => {
            element.classList.remove('row-1');
        });
        document.querySelectorAll('#row-2').forEach(element => {
            element.classList.remove('row-2');
        });
        document.querySelectorAll('#row-3').forEach(element => {
            element.classList.remove('row-3');
        });
        isFirstSubmit = false; // Set the flag to false
    }
    const keyword = document.getElementById('district-dropdown').value;
    const bedroomCount = document.getElementById('bedrooms-dropdown').value;
    console.log(bedroomCount)
    console.log(keyword);
    fetchData(keyword);
    fetchCrimeData(keyword);
    fetchPredictionData(keyword,bedroomCount);
});

async function fetchData(keyword) {
    const formData = new URLSearchParams();
    formData.append('keyword', keyword);

    try {
        const response = await fetch('http://127.0.0.1:5000/api/SchoolData', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        displayResponse(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}



function displayResponse(data) {
    const schools = data.map(school => ({
        School_name: school.name,
        Level_of_schooling: school.level,
        Street: school.street,
        Postcode: school.postcode,
        Phone: school.phone,
        // Email: school.email
    }));

    const table = document.createElement('table');
    table.classList.add('table','table-responsive', 'table-bordered','rounded-10', 'table-hover','rounded-table', 'text-center', 'text-capitalize');
    const headerRow = table.insertRow();
    headerRow.classList.add('table-dark', 'table-active', 'text-uppercase', 'text-white')
    for (const key in schools[0]) {
        const headerCell = document.createElement('th');
        headerCell.textContent = key.replace(/_/g, ' ');
        headerRow.appendChild(headerCell);
    }

    schools.forEach(school => {
        const row = table.insertRow();
        for (const key in school) {
            const cell = row.insertCell();
            cell.textContent = school[key];
        }
    });

    const jsonResponseContainer = document.getElementById('json-response');
    jsonResponseContainer.innerHTML = '';
    jsonResponseContainer.appendChild(table);
}

const colors = [
    '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D'
];

async function fetchCrimeData(suburb) {
      const formData = new URLSearchParams();
      formData.append('keyword', suburb);

      try {
        const response = await fetch('http://127.0.0.1:5000/api/CrimeData', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData
        });
        const full_response = await fetch('http://127.0.0.1:5000/api/TotalCrimeData', {
          method: 'POST'
        });
        const full_data = await full_response.json();
        const data = await response.json();

        console.log(full_data);
        console.log(data);

        drawBarGraph(data, 'crimeDataChart');
        drawBarGraph(full_data, 'totalCrimeDataChart');
      } catch (error) {
        console.error('Error fetching crime data:', error);
      }
    }

    function drawBarGraph(data, canvasId) {
      const ctx = document.getElementById(canvasId).getContext('2d');
      
      const labels = data.map(item => item.crime_Subcategory);
      const counts = data.map(item => item.total_count);
      
      const barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Crime Data',
            data: counts,
            backgroundColor: '#a9e34b',
            borderColor: '#5c940d',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

async function fetchPredictionData(suburb,count) {
    const formData = new URLSearchParams();
    formData.append('suburb', suburb);
    formData.append('bedroomCount', count);

    try {
        const response = await fetch('http://127.0.0.1:5000/api/Prediction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });
        const data = await response.json();

        console.log(data);

    } catch (error) {
        console.error('Error fetching crime data:', error);
    }
}

async function fetchPredictionData(suburb, bedroomCount) {
    const formData = new URLSearchParams();
    formData.append('suburb', suburb);
    formData.append('bedroomCount', bedroomCount);

    try {
        const response = await fetch('http://127.0.0.1:5000/api/Prediction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });
        const data = await response.json();

        console.log(data);
        drawLineGraph(data, 'predictionChart'); // Function to draw the graph

    } catch (error) {
        console.error('Error fetching prediction data:', error);
    }
}




function drawLineGraph(data, elementId) {
    const ctx = document.getElementById(elementId).getContext('2d');
    const labels = data.map(item => item.year); // Adjust 'date' based on your data properties
    const values = data.map(item => item.predictedPrice); // Adjust 'value' based on your data properties

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price Prediction',
                data: values,
                fill: false,
                borderColor: '#a9e34b',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}


const cityToPostcodes = {
    Wollongong: [2500, 2515, 2519, 2516, 2518, 2506],
    Kiama: [2533, 2535, 2534, 2577, 2527],
    Shellharbour: [2528, 2529, 2527],
    Sutherland: [
      2234, 2226, 2230, 2229, 2233, 2232, 2227, 2224, 2231, 2225, 2228, 2172,
      2288,
    ],
    Campbelltown: [2558, 2560, 2559, 2565, 2566, 2167, 2564, 2179],
  };

  let schoolsData = [];
  let map;

  function populateCityOptions() {
    const citySelect = document.getElementById("city-select");
    Object.keys(cityToPostcodes).forEach((city) => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
      console.log("inside the populate function")
    });
  }

  function plotSchoolsOnMap(schools) {
    if (map) map.remove(); // Clear existing map instance if exists
    map = L.map("map").setView([-34.9279, 138.6007], 13); // Default view
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    schools.forEach((school) => {
      if (school.Latitude && school.Longitude) {
        let popupContent = `<b>${school.School_name}</b><br>ICSEA Value: ${school.ICSEA_value}<br><a href="${school.Website}" target="_blank">Visit Website</a>`;
        L.marker([school.Latitude, school.Longitude], {
          title: school.School_name,
        })
          .addTo(map)
          .bindPopup(popupContent);
      }
    });

    if (schools.length > 0) {
      map.fitBounds(schools.map((school) => [school.Latitude, school.Longitude]));
    }
  }

fetch("school_data.json")
    .then((response) => response.json())
    .then((data) => {
      schoolsData = data;
      populateCityOptions();
      filterSchoolsByCity(); // Initialize map with all schools
    })
    .catch((error) => console.error("Error loading the JSON data:", error));

  function filterSchoolsByCity() {
    const selectedCity = document.getElementById("city-select").value;
    const filteredSchools = selectedCity
      ? schoolsData.filter((school) =>
          cityToPostcodes[selectedCity].includes(parseInt(school.Postcode))
        )
      : schoolsData;
    plotSchoolsOnMap(filteredSchools);
  }