"use client";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const PostoChart = () => {
    const data = {
        labels: ['Posto A', 'Posto B', 'Posto C', 'Posto D'],
        datasets: [{
            label: 'Nº de Recargas',
            data: [50, 35, 20, 10],
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                gradient.addColorStop(0, 'hsla(180, 100%, 50%, 0.8)');
                gradient.addColorStop(1, 'hsla(145, 100%, 50%, 0.8)');
                return gradient;
            },
            borderRadius: 8,
            borderWidth: 0,
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

    return <Bar data={data} options={options} />;
};

export default PostoChart;