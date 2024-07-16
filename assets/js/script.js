let data;
let chart;

async function obtenerDatos() {
    try {
        const res = await fetch('https://mindicador.cl/api');
        data = await res.json();
    } catch (error) {
        document.querySelector('#resultado').textContent = "Error al conectar con el servidor.";
    }
}

const convertirValor = function() {
    const valor = document.querySelector('#valor').value;
    const moneda = document.querySelector('#moneda').value;

    try { 
        const valorConvertido = valor / data[moneda].valor;
        document.querySelector('#resultado').textContent = `Resultado: ${valorConvertido.toFixed(2)}`; 
    } catch (error) {
        document.querySelector('#resultado').textContent = `Data no disponible`;
    }

    displayChart(moneda);
}

async function getHistoricalData(moneda) {
    try {
        const response = await fetch(`https://mindicador.cl/api/${moneda}`);
        const data = await response.json();
        return data.serie.slice(0, 10).reverse(); 
    } catch (error) {
        document.querySelector('#resultado').textContent = `sin data`;

    }
}

async function displayChart(moneda) {
    const historicalData = await getHistoricalData(moneda);

    let hasData = false;
    if (historicalData) {
    hasData = historicalData.length > 0;
    }

    if (hasData === false) {
        console.error('Data no disponible.');
        return;
    }

    const labels = historicalData.map(function(item) {
        return item.fecha.split('T')[0];
    });
    
    const values = historicalData.map(function(item) {
        return item.valor;
    });
    

    const ctx = document.getElementById('myChart').getContext('2d');

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Valor (${moneda})`,
                data: values,
                borderColor: 'rgb(170, 166, 202)',
                borderWidth: 2,
                pointBackgroundColor: 'rgb(229, 208, 255)',
                pointBorderColor: 'rgb(229, 208, 255'
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                y: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            }
        }
    });
    
        
}

obtenerDatos();

document.querySelector('#moneda').addEventListener('change', convertirValor);
