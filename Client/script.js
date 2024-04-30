// Call this function when the page loads to populate the dropdown
document.addEventListener('DOMContentLoaded', populateDistrictDropdown);

async function populateDistrictDropdown() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/getSuburb');
        const suburbs = await response.json();
        const dropdown = document.getElementById('district-dropdown');
        suburbs.forEach(suburbObject => {
            const option = document.createElement('option');
            option.value = suburbObject.Suburb.trim(); // Use trim to remove any whitespace
            option.textContent = suburbObject.Suburb.trim(); // Use the key 'Town_suburb' to access the suburb name
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
    console.log(keyword);
    fetchData(keyword);
    fetchCrimeData(keyword);
});

async function fetchData(keyword) {
    const formData = new URLSearchParams();
    formData.append('keyword', keyword);
    
    try {
        const response = await fetch('http://127.0.0.1:5000/api/filter', {
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
        School_name: school.School_name,
        Level_of_schooling: school.Level_of_schooling,
        Street: school.Street,
        Postcode: school.Postcode,
        Phone: school.Phone,
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
    formData.append('suburb', suburb);

    try {
        const response = await fetch('http://127.0.0.1:5000/api/filterCrime', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });
		const full_response = await fetch('http://127.0.0.1:5000/api/totalCrime', {
            method: 'POST'
        });
        const full_data = await full_response.json();
		const data = await response.json();
		console.log(full_data)
		console.log(data)
        drawLineChart(data,full_data);
    } catch (error) {
        console.error('Error fetching crime data:', error);
    }
}

function drawLineChart(data, full_data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const labels = data.map(item => item['Offence category']);
    const counts = data.map(item => item['Dec-22']);
    const fullCounts = full_data.map(item => item['Dec-22']);
    

    const myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Suburb crime',
                    data: counts,
                    backgroundColor: colors[0],
                    borderColor: colors[0],
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'NSW Crime',
                    data: fullCounts,
                    backgroundColor: colors[1],
                    borderColor: colors[1],
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Crime Data Over Time'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 500,
                        // Include a callback to format ticks with commas for thousands
                        callback: function(value, index, values) {
                            return value.toLocaleString();
                        }
                    }
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