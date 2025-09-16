"use client";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const RotasChart = () => {
    const data = {
        labels: ['Centro-Norte', 'Litoral-Serra', 'Residencial', 'Comercial'],
        datasets: [{
            label: 'Viagens',
            data: [45, 30, 15, 10],
            borderColor: 'hsl(180, 100%, 50%)',
            backgroundColor: 'hsla(180, 100%, 50%, 0.1)',
            pointBackgroundColor: 'hsl(145, 100%, 50%)',
            pointBorderColor: '#fff',
            pointHoverRadius: 7,
            pointRadius: 5,
            fill: true,
            tension: 0.4 // Linha mais suave
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0f172a',
                titleColor: '#cbd5e1',
                bodyColor: '#cbd5e1',
                padding: 10,
                cornerRadius: 8,
            }
        },
        scales: {
            x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
            y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.1)' }, border: { dash: [4, 4] } }
        }
    };

    return <Line data={data} options={options} />;
};

export default RotasChart;