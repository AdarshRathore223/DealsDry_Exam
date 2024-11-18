import { useEffect, useRef, useState } from 'react';
import { useFetchData } from '../hooks/useFetchData';
import Chart, { ChartOptions } from 'chart.js/auto';

interface CategoryData {
  Amount: number;
  Category: string;
}

const PivotChart = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const { data, error, isLoading } = useFetchData<CategoryData[]>('/api/user');
  const chartRef = useRef<Chart | null>(null);

  const formatAmount = (amount: number): string => {
    return `Rs: ${amount.toFixed(2)}`; 
  };

  useEffect(() => {
    if (data && data.length > 0) {
      const total = data.reduce((sum, item) => sum + parseFloat(item.Amount.toString()), 0);
      setTotalAmount(total);

      const categories = data.map((item) => item.Category);
      const amounts = data.map((item) => parseFloat(item.Amount.toString()));

      if (canvasRef.current) {
        chartRef.current?.destroy();

        chartRef.current = new Chart(canvasRef.current, {
          type: 'pie',
          data: {
            labels: categories,
            datasets: [
              {
                label: 'Expense Category Distribution',
                data: amounts,
                backgroundColor: [
                  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40', '#FFB6C1',
                  '#8E44AD', '#3498DB', '#2ECC71', '#F39C12', '#E74C3C', '#9B59B6',
                  '#1ABC9C', '#D35400', '#34495E', '#16A085', '#F1C40F', '#7F8C8D',
                  '#9C27B0', '#00BCD4', '#8BC34A', '#FFC107', '#009688', '#FF5722',
                  '#673AB7', '#03A9F4',
                ],
                hoverBackgroundColor: [
                  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40', '#FFB6C1',
                  '#8E44AD', '#3498DB', '#2ECC71', '#F39C12', '#E74C3C', '#9B59B6',
                  '#1ABC9C', '#D35400', '#34495E', '#16A085', '#F1C40F', '#7F8C8D',
                  '#9C27B0', '#00BCD4', '#8BC34A', '#FFC107', '#009688', '#FF5722',
                  '#673AB7', '#03A9F4',
                ],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    const amount = tooltipItem.raw as number;
                    return `${tooltipItem.label}: ${formatAmount(amount)}`;
                  },
                },
              },
            },
          } as ChartOptions,
        });
      }
    }
  }, [data]);

  if (isLoading) {
    return <div className="text-center text-xl font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{`Error: ${error}`}</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-4">Expense Category Distribution</h2>
      <canvas ref={canvasRef}></canvas>
      <div className="mt-6 text-lg font-medium text-center">
        <strong>Total Amount Expended: {formatAmount(totalAmount)}</strong>
      </div>
    </div>
  );
};

export default PivotChart;