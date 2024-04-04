document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const keyword = document.getElementById('district-dropdown').value;
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
        Website: school.Website
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
		 dropdown.addEventListener('change', function(event) {
            const selectedSuburb = event.target.value;
            // Now fetch the additional details based on selected suburb
			console.log(selectedSuburb)
            fetchDetailsForSuburb(selectedSuburb);
        });
    } catch (error) {
        console.error('Error fetching district names:', error);
    }
}

async function fetchDetailsForSuburb(suburb) {
    const formData = new URLSearchParams();
    formData.append('keyword', suburb);
	console.log(suburb+"inside")
    
try {
        const response = await fetch('http://127.0.0.1:5000/api/address', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });
        const details = await response.json();
        console.log(details);

        // Assume `details` is an array of address objects
        const addressesDropdown = document.getElementById('addresses-dropdown');
        addressesDropdown.innerHTML = ''; // Clear existing options
        
        details.forEach(address => {
            const fullAddress = `${address["House No."]} ${address["Street"]}, ${address["Suburb"]} ${address["Postcode"]}`;
			console.log(fullAddress);
            const option = document.createElement('option');
            option.value = fullAddress; // Here we're assigning the full address as the value
            option.textContent = fullAddress; // And also as the text content that will be displayed
            addressesDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching details for suburb:', error);
    }
}

// Call this function when the page loads to populate the dropdown
document.addEventListener('DOMContentLoaded', populateDistrictDropdown);


function drawLineChart(data, full_data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const labels = data.map(item => item['Offence category']);
    const counts = data.map(item => item['Dec-22']);
    console.log(counts);
    const fullCounts = full_data.map(item => item['Dec-22']);
    console.log(fullCounts);

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
