import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function VerticalBarChart({ datasets, labels }) {
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    };
    
    const data = {
      labels,
      datasets: datasets || [
        {
          label: 'Dataset 1',
        //   data: labels.map(() => faker.datatype.number({ min: 0, max: 10 })),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Dataset 2',
        //   data: labels.map(() => faker.datatype.number({ min: 0, max: 10 })),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    };
  return <Bar options={options} data={data} />;
}

export default VerticalBarChart