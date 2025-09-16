"use client";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const VeiculoChart = () => {
    const data = {
        labels: ['Tesla Model Y', 'Nissan Leaf', 'Chevrolet Bolt', 'BYD Dolphin'],
        datasets: [{
            data: [30, 25, 20, 15],
            backgroundColor: [
                'hsl(180, 100%, 50%)',
                'hsl(145, 100%, 50%)',
                'hsl(200, 100%, 50%)',
                'hsl(52, 93%, 60%)',
            ],
            borderColor: '#1e293b',
            borderWidth: 4,
            hoverOffset: 8
        }]
    };

    const options = {
        responsive: true,
        cutout: '70%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#cbd5e1',
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: '#0f172a',
                titleColor: '#cbd5e1',
                bodyColor: '#cbd5e1',
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                    label: function(context) {
                        return `${context.label}: ${context.raw}%`;
                    }
                }
            }
        }
    };

    return <Doughnut data={data} options={options} />;
};

export default VeiculoChart;