import React, { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import './../styles/Dashboard.css';
import { FaFolderOpen } from 'react-icons/fa'; 
import api from '../api/api';

// Helper function to sort months (mapping month abbreviations to numbers)
const monthMap = {
  'JAN': 1, 'FEV': 2, 'MAR': 3, 'ABR': 4, 'MAI': 5, 'JUN': 6,
  'JUL': 7, 'AGO': 8, 'SET': 9, 'OUT': 10, 'NOV': 11, 'DEZ': 12
};

// Helper function to convert month number back to abbreviation
const reverseMonthMap: { [key: number]: string } = {
  1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun',
  7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez'
};

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [customers, setCustomers] = useState<string[]>([]);
  const [customerData, setCustomerData] = useState<{ [key: string]: any[] }>({});

  useEffect(() => {
    api.get('/api/invoices').then((response) => {
      const formattedData = response.data.map((invoice: any) => {
        const [month, year] = invoice.referenceMonth.split('/');
        return {
          customerNumber: invoice.customerNumber,
          referenceMonth: `${monthMap[month as keyof typeof monthMap]}/${year}`,
          energyConsumed: invoice.energyConsumedQty + invoice.energySCEEQty,
          energyCompensated: invoice.energyCompensatedQty,
          totalWithoutGD: invoice.energyConsumedVal + invoice.energySCEEVal + invoice.publicLighting,
          gdEconomy: invoice.energyCompensatedVal,
        };
      });

      setData(formattedData);

      const uniqueCustomers: string[] = Array.from(new Set<string>(formattedData.map((item: any) => item.customerNumber)));
      setCustomers(uniqueCustomers);

      const customerDataMap: { [key: string]: any[] } = {};
      uniqueCustomers.forEach((customer) => {
        const sortedData = formattedData
          .filter((item: any) => item.customerNumber === customer)
          .sort((a: { referenceMonth: { split: (arg0: string) => [any, any]; }; }, b: { referenceMonth: { split: (arg0: string) => [any, any]; }; }) => {
            const [aMonth, aYear] = a.referenceMonth.split('/');
            const [bMonth, bYear] = b.referenceMonth.split('/');
            return new Date(parseInt(aYear), parseInt(aMonth)).getTime() - new Date(parseInt(bYear), parseInt(bMonth)).getTime();
          });

        customerDataMap[customer] = sortedData;
      });
      setCustomerData(customerDataMap);
    }).catch((error) => {
      console.error('Erro ao carregar faturas:', error);
      toast.error('Erro ao carregar faturas do servidor');
    });
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsUploading(true);

    try {
      await api.post('/api/invoices', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const response = await api.get('/api/invoices');
      const formattedData = response.data.map((invoice: any) => {
        const [month, year] = invoice.referenceMonth.split('/');
        return {
          customerNumber: invoice.customerNumber,
          referenceMonth: `${monthMap[month as keyof typeof monthMap]}/${year}`,
          energyConsumed: invoice.energyConsumedQty + invoice.energySCEEQty,
          energyCompensated: invoice.energyCompensatedQty,
          totalWithoutGD: invoice.energyConsumedVal + invoice.energySCEEVal + invoice.publicLighting,
          gdEconomy: invoice.energyCompensatedVal,
        };
      });
      setData(formattedData);

      const uniqueCustomers: string[] = Array.from(new Set<string>(formattedData.map((item: any) => item.customerNumber)));
      setCustomers(uniqueCustomers);

      const customerDataMap: { [key: string]: any[] } = {};
      uniqueCustomers.forEach((customer) => {
        const sortedData = formattedData
          .filter((item: any) => item.customerNumber === customer)
          .sort((a: { referenceMonth: { split: (arg0: string) => [any, any]; }; }, b: { referenceMonth: { split: (arg0: string) => [any, any]; }; }) => {
            const [aMonth, aYear] = a.referenceMonth.split('/');
            const [bMonth, bYear] = b.referenceMonth.split('/');
            return new Date(parseInt(aYear), parseInt(aMonth)).getTime() - new Date(parseInt(bYear), parseInt(bMonth)).getTime();
          });
        customerDataMap[customer] = sortedData;
      });
      setCustomerData(customerDataMap);
      toast.success('Fatura enviada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao enviar o arquivo:', error);
      
      if (error.response && error.response.data && error.response.data.error) {
        const backendErrorMessage = error.response.data.error;
  
        let translatedErrorMessage = backendErrorMessage;
  
        if (backendErrorMessage.includes('already exists')) {
          translatedErrorMessage = 'Fatura para este mês já existe para este cliente.';
        }
  
        toast.error(`Erro: ${translatedErrorMessage}`);
      } else {
        toast.error('Erro ao enviar o arquivo. Tente novamente.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const formatMonthTick = (tick: string) => {
    const [month, year] = tick.split('/');
    return `${reverseMonthMap[parseInt(month)]}/${year}`;
  };

  return (
    <div className="dashboard-container">
      <ToastContainer />
      <div className="navigation-bar">
      <Link to="/invoices" className="invoice-link">
        <span className="invoice-text">Acessar Biblioteca de Faturas</span>
        <FaFolderOpen className="invoice-icon" size={24} />
      </Link>
        <h1 className="dashboard-title">Dashboard de Energia</h1>
      </div>

      {/* Seção de Upload */}
      <div className="upload-section">
        <form onSubmit={handleSubmit} className="upload-form">
          <input type="file" accept="application/pdf" onChange={handleFileChange} className="file-input" />
          <button type="submit" className="upload-btn" disabled={!selectedFile || isUploading}>
            {isUploading ? 'Enviando...' : 'Enviar Fatura'}
          </button>
        </form>
      </div>

      {/* Gerar gráficos e resumo para cada cliente */}
      {customers.map((customer) => {
        const customerTotals = customerData[customer].reduce(
          (totals, item) => {
            totals.totalEnergyConsumed += item.energyConsumed;
            totals.totalEnergyCompensated += item.energyCompensated;
            totals.totalWithoutGD += item.totalWithoutGD;
            totals.totalEconomyGD += item.gdEconomy;
            return totals;
          },
          {
            totalEnergyConsumed: 0,
            totalEnergyCompensated: 0,
            totalWithoutGD: 0,
            totalEconomyGD: 0
          }
        );

        return (
          <div key={customer} className="customer-section">
            <h2 className="customer-title">Cliente: {customer}</h2>

            {/* Resumo dos Totais por Cliente */}
            <div className="summary-cards">
              <div className="card">
                <h3>Total de Energia Consumida (kWh)</h3>
                <p>{customerTotals.totalEnergyConsumed.toFixed(2)} kWh</p>
              </div>
              <div className="card">
                <h3>Total de Energia Compensada (kWh)</h3>
                <p>{customerTotals.totalEnergyCompensated.toFixed(2)} kWh</p>
              </div>
              <div className="card">
                <h3>Valor Total sem GD (R$)</h3>
                <p>{customerTotals.totalWithoutGD.toFixed(2)} R$</p>
              </div>
              <div className="card">
                <h3>Economia GD Total (R$)</h3>
                <p>{customerTotals.totalEconomyGD.toFixed(2)} R$</p>
              </div>
            </div>

            {/* Gráfico 1: Consumo de Energia vs Energia Compensada */}
            <div className="chart-container">
              <h3 className="chart-title">Consumo de Energia (kWh) vs Energia Compensada (kWh)</h3>
              <ResponsiveContainer style={{ display: 'flex', justifyContent: 'center' }} width="100%" height={280}>
                <LineChart data={customerData[customer]} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <Line type="monotone" dataKey="energyConsumed" name="Energia Consumida (kWh)" stroke="#4A90E2" strokeWidth={2} />
                  <Line type="monotone" dataKey="energyCompensated" name="Energia Compensada (kWh)" stroke="#50E3C2" strokeWidth={2} />
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis dataKey="referenceMonth" tickFormatter={formatMonthTick} />
                  <YAxis />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico 2: Valor Total sem GD vs Economia GD */}
            <div className="chart-container">
              <h3 className="chart-title">Valor Total sem GD (R$) vs Economia GD (R$)</h3>
              <ResponsiveContainer style={{ display: 'flex', justifyContent: 'center' }} width="100%" height={280}>
                <BarChart data={customerData[customer]} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="referenceMonth" tickFormatter={formatMonthTick} />
                  <YAxis />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="totalWithoutGD" name="Valor Total sem GD (R$)" fill="#4A90E2" />
                  <Bar dataKey="gdEconomy" name="Economia GD (R$)" fill="#50E3C2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
