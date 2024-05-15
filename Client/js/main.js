(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Sidebar Toggler
    $('.sidebar-toggler').click(function () {
        $('.sidebar, .content').toggleClass("open");
        return false;
    });


    // Progress Bar
    $('.pg-bar').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Calender
    $('#calender').datetimepicker({
        inline: true,
        format: 'L'
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: true,
        nav : false
    });


    let isFirstSubmit = true;
    document.getElementById('search-form').addEventListener('submit', function(event) {
        event.preventDefault();
        if (isFirstSubmit) {
            isFirstSubmit = false; // Set the flag to false
        }
        const keyword = document.getElementById('district-dropdown').value;
        const bedroomCount = document.getElementById('bedrooms-dropdown').value;
        console.log(bedroomCount)
        console.log(keyword)

        fetchData(keyword)
        fetchPredictionData(keyword, bedroomCount)
        crime(keyword)
        fetchDataCrime(keyword)
    });

    document.addEventListener('DOMContentLoaded', onload);
    function onload(){
        crime('Fairy Meadow')
        fetchPredictionData('Fairy Meadow', 1)
        fetchData('Fairy Meadow')
        fetchDataCrime('Fairy Meadow')
        populateDistrictDropdown()
    }

    async function populateDistrictDropdown() {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/Suburb');
            const suburbs = await response.json();
            const dropdown = document.getElementById('district-dropdown');
            suburbs.forEach(suburbObject => {
                const option = document.createElement('option');
                option.value = suburbObject.name.trim(); // Use trim to remove any whitespace
                option.textContent = suburbObject.name.trim(); // Use the key 'Town_suburb' to access the suburb name
                if (option.textContent === "Fairy Meadow") {
                    option.selected = true;
                }
                dropdown.appendChild(option);
                
            });
    
        } catch (error) {
            console.error('Error fetching district names:', error);
        }
    }

    // Chart Global Color
    Chart.defaults.color = "#6C7293";
    Chart.defaults.borderColor = "#000000";


    // Worldwide Sales Chart


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
            displayResponsePrediction(data)
    
            console.log(data);
            drawLineGraph(data, 'worldwide-sales'); // Function to draw the graph
    
        } catch (error) {
            console.error('Error fetching prediction data:', error);
        }
    }
    function drawLineGraph(data, elementId) {
        const ctx = document.getElementById(elementId).getContext('2d');
    
        // Ensure the myCharts object exists and is initialized
        window.myCharts = window.myCharts || {};
    
        // Check if there's an existing chart for this specific canvas, and destroy it if it exists
        if (window.myCharts[elementId]) {
            window.myCharts[elementId].destroy();
            console.log("Existing chart on '" + elementId + "' destroyed");
        }
    
        // Draw the new chart
        window.myCharts[elementId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => item.year),
                datasets: [{
                    label: 'Price Prediction',
                    data: data.map(item => item.predictedPrice),
                    fill: false,
                    borderColor: 'rgba(235, 22, 22, .7)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            // Define how ticks are displayed on the y-axis
                            callback: function(value, index, values) {
                                return value >= 1000 ? `${value / 1000}k` : `${value}k`;
                            },
                            // Set the step size to 100000 to match the desired tick marks
                            stepSize: 100000
                        }
                    }
                }
            }
        });
    }
    
    

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
            plotSchoolsOnMap(data)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function displayResponse(data) {
        console.log(data);
        const schools = data.map(school => ({
            School_name: school.name,
            Level_of_schooling: school.level,
            Street: school.street,
            Postcode: school.postcode,
            Website: school.website,
            Email: school.email,
            icsea: school.icsea,  // Not displayed in the main table, used in the popup
            subType: school.subType,  // Not displayed in the main table, used in the popup
            enrollment: school.enrollment,
            LBOTE: school.LBOTE,
            indigenous: school.indigenous

        }));
    
        const container = document.createElement('div');
        container.classList.add('container-fluid', 'pt-4', 'px-4');
    
        const outerDiv = document.createElement('div');
        outerDiv.classList.add('bg-secondary', 'text-center', 'rounded', 'p-4');
    
        const headerDiv = document.createElement('div');
        headerDiv.classList.add('d-flex', 'align-items-center', 'justify-content-between', 'mb-4');
    
        const headerText = document.createElement('h6');
        headerText.textContent = 'School Details';
        headerText.classList.add('mb-0');
    
        headerDiv.appendChild(headerText);
    
        const tableDiv = document.createElement('div');
        tableDiv.classList.add('table-responsive');
    
        const table = document.createElement('table');
        table.classList.add('table', 'text-start', 'align-middle', 'table-bordered', 'table-hover', 'mb-0');
    
        const thead = document.createElement('thead');
        const theadRow = document.createElement('tr');
        theadRow.classList.add('text-white');
    
        const columns = [
            { header: 'School Name', key: 'School_name' },
            { header: 'Level of Schooling', key: 'Level_of_schooling' },
            { header: 'Street', key: 'Street' },
            { header: 'Postcode', key: 'Postcode' },
            { header: 'Website', key: 'Website' },
            { header: 'Email', key: 'Email' }
        ];
    
        columns.forEach(col => {
            const th = document.createElement('th');
            th.scope = 'col';
            th.textContent = col.header;
            theadRow.appendChild(th);
        });
    
        thead.appendChild(theadRow);
    
        const tbody = document.createElement('tbody');
    
        schools.forEach(school => {
            const row = document.createElement('tr');
            columns.forEach(col => {
                const cell = document.createElement('td');
                if (col.key === 'School_name') {
                    const link = document.createElement('a');
                    link.href = '#';
                    link.textContent = school[col.key];
                    link.onclick = (event) => {
                        event.preventDefault();  // Prevent the default anchor behavior
                        showPopup(school);       // Open the popup with school details
                    };
                    cell.appendChild(link);
                } else {
                    cell.textContent = school[col.key];
                }
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        });
    
        table.appendChild(thead);
        table.appendChild(tbody);
        tableDiv.appendChild(table);
        outerDiv.appendChild(headerDiv);
        outerDiv.appendChild(tableDiv);
        container.appendChild(outerDiv);
    
        const jsonResponseContainer = document.getElementById('json-response');
        jsonResponseContainer.innerHTML = '';
        jsonResponseContainer.appendChild(container);
    }
    
    
    function showPopup(school) {
        let popup = document.getElementById('popup-div');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'popup-div';
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.zIndex = '9999';
            popup.style.padding = '20px';
            popup.style.width = '600px'; // Maintain this or adjust as necessary
            popup.style.minHeight = '300px'; // Adjust as necessary for overall content
            popup.style.background = 'white';
            popup.style.border = '2px solid red';
            popup.style.borderRadius = '8px';
            popup.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            document.body.appendChild(popup);
            dragElement(popup);
        }
        //drag

        function dragElement(elmnt) {
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            elmnt.onmousedown = dragMouseDown;
        
            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                // Get the mouse cursor position at startup:
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                // Call a function whenever the cursor moves:
                document.onmousemove = elementDrag;
            }
        
            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                // Calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // Set the element's new position:
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }
        
            function closeDragElement() {
                // Stop moving when mouse button is released:
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }

        //drag end
    
        popup.innerHTML = `
        
        <h4 style="color: black;">${school.School_name} <a href=${school.Website} target="_blank" style="text-decoration: none; color: #007BFF;">Visit</a></h4>
                           <p>School sector: Government</p>
                           <p>Level of Schooling: ${school.Level_of_schooling}</p>
                           <p>Year range: ${school.subType}</p>
                           <p>Average ICSEA value: 1000</p>
                           <p>School ICSEA: ${school.icsea}</p>
                           <p>Last year enrollment :- ${school.enrollment}</p>
                           <div style="width:200px; height:200px; margin:auto;"> <!-- Container for the chart with fixed size -->
                               <canvas id="enrollmentChart"></canvas>
                           </div>
                           <button id="close-popup" style="position: absolute; top: 10px; right: 10px; cursor: pointer;">×</button>`;
    
        const closeButton = popup.querySelector('#close-popup');
        closeButton.onclick = function() {
            popup.style.display = 'none';
        };
    
        popup.onclick = function(event) {
            event.stopPropagation();
        };
    
        popup.style.display = 'block';
    
        // Render the pie chart
        var ctx = document.getElementById('enrollmentChart').getContext('2d');
        var myPieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Others', 'LBOTE Students', 'Indigenous Students'],
                datasets: [{
                    label: 'Enrollment Comparison',
                    data: [100 - (school.LBOTE+school.indigenous), school.LBOTE, school.indigenous],
                    backgroundColor: [
                        'rgb(255, 99, 132)', // Solid Bright Red
                        'rgb(75, 181, 67)',  // Solid Bright Green
                        'rgb(255, 206, 86)'  // Solid Bright Yellow
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)', // Solid Bright Red
                        'rgb(75, 181, 67)',  // Solid Bright Green
                        'rgb(255, 206, 86)'  // Solid Bright Yellow
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    },
                }
            }
        });
    }
    
    
    
    
    
    
    // Salse & Revenue Chart
// Function to initialize the chart with fetched data
function initChart(data1, data2) {
    var ctx2 = $("#salse-revenue").get(0).getContext("2d");

    // Initialize myCharts object if not already
    window.myCharts = window.myCharts || {};

    // Destroy the existing chart instance if exists
    if (window.myCharts['salse-revenue']) {
        window.myCharts['salse-revenue'].destroy();
        console.log("Existing 'salse-revenue' chart destroyed");
    }

    window.myCharts['salse-revenue'] = new Chart(ctx2, {
        type: "line",
        data: {
            labels: data1.map(item => item.crime_Subcategory),
            datasets: [{
                label: "Suburb Crime",
                data: data1.map(item => item.total_count),
                backgroundColor: "rgba(235, 22, 22, 0.7)", // Red with transparency
                borderColor: "rgb(235, 22, 22)", // Solid Red for line
                fill: false // Set to false for line only without fill
            }, {
                label: "NSW Crime",
                data: data2.map(item => item.total_count),
                backgroundColor: "rgba(0, 106, 78, 0.7)", // Bottle green with transparency
                borderColor: "rgb(0, 106, 78)", // Solid Bottle Green for line
                fill: false // Set to false for line only without fill
            }]
        },
        options: {
            responsive: true
        }
    });
    
}


async function crime(keyword){
    const response = await fetch('http://127.0.0.1:5000/api/TotalCrimeData');
    const totalCrime = await response.json();

    const formData = new URLSearchParams();
    formData.append('keyword', keyword);
    
        try {
            const response = await fetch('http://127.0.0.1:5000/api/CrimeData', {
                method: 'POST',
                body: formData
            });
            const suburbCrime = await response.json();
            initChart(suburbCrime, totalCrime);
}catch (error) {
    console.error('Error fetching data:', error);
}
}
  

    let map;

  function plotSchoolsOnMap(schools) {
    if (map) map.remove(); // Clear existing map instance if exists
    map = L.map("map").setView([-34.9279, 138.6007], 13); // Default view
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  
    schools.forEach((school) => {
      if (school.latitude && school.longitude) {
        let popupContent = `<b>${school.name}</b><br>ICSEA Value: ${school.icsea}<br><a href="${school.website}" target="_blank">Visit Website</a>`;
        L.marker([school.latitude, school.longitude], {
          title: school.name,
        })
          .addTo(map)
          .bindPopup(popupContent);
      }
    });
  
    if (schools.length > 0) {
      map.fitBounds(schools.map((school) => [school.latitude, school.longitude]));
    }
  }
  


  async function fetchDataCrime(keyword) {
    const formData = new URLSearchParams();
    formData.append('keyword', keyword);

    try {
        const response = await fetch('http://127.0.0.1:5000/api/CrimeDataRaw', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        displayResponseCrime(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayResponseCrime(data) {
    console.log(data)
    const crimes = data.map(crime => ({
        Category: crime.crime_Subcategory,
        Count: crime.total_count,
    }));

    const container = document.createElement('div');
    container.classList.add('container-fluid', 'pt-4', 'px-4');

    const outerDiv = document.createElement('div');
    outerDiv.classList.add('bg-secondary', 'text-center', 'rounded', 'p-4');

    const headerDiv = document.createElement('div');
    headerDiv.classList.add('d-flex', 'align-items-center', 'justify-content-between', 'mb-4');

    const headerText = document.createElement('h6');
    headerText.textContent = 'Crime Details';
    headerText.classList.add('mb-0');

    const showAllLink = document.createElement('a');
    

    headerDiv.appendChild(headerText);
    headerDiv.appendChild(showAllLink);

    // Create a scrollable table container
    const tableDiv = document.createElement('div');
    tableDiv.classList.add('table-responsive');
    tableDiv.style.maxHeight = '180px'; // Set a maximum height for the table container
    tableDiv.style.overflowY = 'scroll'; // Enable vertical scrolling

    const table = document.createElement('table');
    table.classList.add('table', 'text-start', 'align-middle', 'table-bordered', 'table-hover', 'mb-0');

    const thead = document.createElement('thead');
    const theadRow = document.createElement('tr');
    theadRow.classList.add('text-white');

    const columns = ['Crime Category', 'Count'];
    columns.forEach(colName => {
        const th = document.createElement('th');
        th.scope = 'col';
        th.textContent = colName;
        theadRow.appendChild(th);
    });

    thead.appendChild(theadRow);
    const tbody = document.createElement('tbody');

    crimes.forEach(crime => {
        const row = document.createElement('tr');
        for (const key in crime) {
            const cell = document.createElement('td');
            cell.textContent = crime[key];
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    tableDiv.appendChild(table);
    outerDiv.appendChild(headerDiv);
    outerDiv.appendChild(tableDiv);
    container.appendChild(outerDiv);

    const jsonResponseContainer = document.getElementById('crimejson-response');
    jsonResponseContainer.innerHTML = '';
    jsonResponseContainer.appendChild(container);
}

function displayResponsePrediction(data) {
    console.log(data)
    const prices = data.map(price => ({
        Category: price.year,
        Count: Number(price.predictedPrice.toFixed(2)),
    }));

    const container = document.createElement('div');
    container.classList.add('container-fluid', 'pt-4', 'px-4');

    const outerDiv = document.createElement('div');
    outerDiv.classList.add('bg-secondary', 'text-center', 'rounded', 'p-4');

    const headerDiv = document.createElement('div');
    headerDiv.classList.add('d-flex', 'align-items-center', 'justify-content-between', 'mb-4');

    const headerText = document.createElement('h6');
    headerText.textContent = 'Prediction Details for house/appartment';
    headerText.classList.add('mb-0');

    const showAllLink = document.createElement('a');
    

    headerDiv.appendChild(headerText);
    headerDiv.appendChild(showAllLink);

    // Create a scrollable table container
    const tableDiv = document.createElement('div');
    tableDiv.classList.add('table-responsive');
    tableDiv.style.maxHeight = '130px'; // Set a maximum height for the table container
    tableDiv.style.overflowY = 'scroll'; // Enable vertical scrolling

    const table = document.createElement('table');
    table.classList.add('table', 'text-start', 'align-middle', 'table-bordered', 'table-hover', 'mb-0');

    const thead = document.createElement('thead');
    const theadRow = document.createElement('tr');
    theadRow.classList.add('text-white');

    const columns = ['Year', 'Price'];
    columns.forEach(colName => {
        const th = document.createElement('th');
        th.scope = 'col';
        th.textContent = colName;
        theadRow.appendChild(th);
    });

    thead.appendChild(theadRow);
    const tbody = document.createElement('tbody');

    prices.forEach(price => {
        const row = document.createElement('tr');
        for (const key in price) {
            const cell = document.createElement('td');
            cell.textContent = price[key];
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    tableDiv.appendChild(table);
    outerDiv.appendChild(headerDiv);
    outerDiv.appendChild(tableDiv);
    container.appendChild(outerDiv);

    const jsonResponseContainer = document.getElementById('pricejson-response');
    jsonResponseContainer.innerHTML = '';
    jsonResponseContainer.appendChild(container);
}




})(jQuery);



