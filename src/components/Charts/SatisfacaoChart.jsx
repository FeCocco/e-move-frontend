"use client";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SatisfacaoChart = () => {
    const data = {
        labels: ['Muito Satisfeito', 'Satisfeito', 'Neutro', 'Insatisfeito', 'Muito Insatisfeito'],
        datasets: [{
            label: 'Satisfação do Usuário',
            data: [40, 35, 15, 8, 2],
            backgroundColor: ['#00ff99', '#00e0ff', '#ffcc00', '#ff4d6d', '#6c757d']
        }]
    };
    const options = {  };
    return <Bar data={data} options={options} />;
};
export default SatisfacaoChart;