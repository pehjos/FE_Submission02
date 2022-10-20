/**
 * This script handles all the functionalities within the dashboard
 * It is used only within the dashboard page
 */

// predefine values to prevent code from
// breaking when no data is fetched
let sales_over_time_week = [];
let sales_over_time_year = [];

let days = [];
let months = [];
let days_data = [];
let months_data = [];

// fetch and use the dashboard related data
fetchData(dashboardURL, getCookie('access_token'))
    .then((response) =>
    {
        const bestsellers = response.dashboard.bestsellers;
        sales_over_time_week = response.dashboard.sales_over_time_week;
        sales_over_time_year = response.dashboard.sales_over_time_year;
        
        days = Object.keys(sales_over_time_week);
        months = Object.keys(sales_over_time_year);
        
        days.map((day) =>
        {
            days_data.push(sales_over_time_week[day].total);
        });
        
        // rename the 1st and 2nd days
        for (let i = 0; i < days.length; i++)
        {
            if (i === 0)
            {
                days[i] = 'today';
            }
            else if (i === 1)
            {
                days[i] = 'yesterday';
            }
            else
            {
                days[i] = 'day ' + days[i];
            }
        }
        
        // rename the 1st and 2nd months
        months.map((month) =>
        {
            months_data.push(sales_over_time_year[month].total);
        });
        for (let j = 0; j < months.length; j++)
        {
            if (j === 0)
            {
                months[j] = 'this month';
            }
            else if (j === 1)
            {
                months[j] = 'last month';
            }
            else
            {
                months[j] = 'month ' + months[j];
            }
        }
        
        createChart(days_data, days);
        createChart(months_data, months, 'monthsChart');
        
        // populate the table with data
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = '';
        for (let rows of bestsellers)
        {
            let tr = document.createElement('TR');
            
            const name = appendToTable(tr, rows.product.name);
            const price = appendToTable(tr,
            `$${rows.revenue / rows.units}`);
            const units = appendToTable(tr, rows.units);
            const revenue = appendToTable(tr, `$${rows.revenue}`);
            
            tbody.appendChild(name);
            tbody.appendChild(price);
            tbody.appendChild(units);
            tbody.appendChild(revenue);
        }
    })
    .catch((error) => console.log('Error fetching dashboard data', error));

function createChart(dataset, labels, id = 'daysChart')
{
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Sales',
                data: dataset,
                backgroundColor: ['rgb(151, 151, 151, 0.2)'],
                borderColor: ['rgb(151, 151, 151)'],
                borderWidth: 1,
            },
        ],
    };
    
    const config = {
        type: 'bar',
        data: data,
        options:
        {
            responsive: true,
            scales:
            {
                y:
                {
                    beginAtZero: true,
                },
            },
            plugins:
            {
                legend:
                {
                    position: 'top',
                },
                title:
                {
                    display: false,
                    text: '',
                },
            },
        },
    };
    
    const myChart = new Chart(document.getElementById(id), config);
}

const toggle = document.querySelector('.toggle');
toggle.addEventListener('change', switchChart);

function switchChart()
{
    const chart_heading = document.querySelector('.chart-head');
    const days_chart = document.querySelector('.days-chart');
    const months_chart = document.querySelector('.months-chart');
    
    if (toggle.checked)
    {
        chart_heading.innerHTML = 'Revenue (Last 12 months)';
        days_chart.classList.add('hidden');
        months_chart.classList.remove('hidden');
    }
    else
    {
        chart_heading.innerHTML = 'Revenue (last 7 days)';
        months_chart.classList.add('hidden');
        days_chart.classList.remove('hidden');
    }
}
