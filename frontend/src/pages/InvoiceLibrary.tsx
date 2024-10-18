import React, { useEffect, useState } from 'react';
import { Invoice } from '../types/Invoice';
import './../styles/InvoiceLibrary.css';
import { FaDownload, FaArrowLeft } from 'react-icons/fa'; // Ícones de download e seta para voltar
import { Link } from 'react-router-dom'; // Importa o Link para navegação
import api from '../api/api';

// Abreviações dos meses (mesmo formato usado no banco de dados)
const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// Anos disponíveis para filtro
const years = [2021, 2022, 2023, 2024];

const InvoiceLibrary = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [customerNumber, setCustomerNumber] = useState<string>(''); // Estado para o filtro do número do cliente
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear()); // Estado para o filtro do ano

  useEffect(() => {
    api.get('/invoices').then((response) => {
      setInvoices(response.data);
      setFilteredInvoices(response.data); // Inicialmente, todas as faturas
    });
  }, []);

  const handleDownload = (id: number) => {
    api
      .get(`/invoices/${id}/download`, { responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice-${id}.pdf`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error('Erro ao baixar o arquivo:', error);
      });
  };

  // Atualizar a lista de faturas filtradas conforme o número do cliente e ano mudam
  useEffect(() => {
    let filtered = invoices;
    if (customerNumber) {
      filtered = filtered.filter((invoice) =>
        invoice.customerNumber.includes(customerNumber)
      );
    }
    if (selectedYear) {
      filtered = filtered.filter((invoice) => {
        const year = invoice.referenceMonth.split('/')[1]; // Extrai o ano da referência da fatura
        return parseInt(year) === selectedYear; // Compara com o ano selecionado
      });
    }
    setFilteredInvoices(filtered);
  }, [customerNumber, selectedYear, invoices]);

  // Função para agrupar faturas por número do cliente
  const groupedInvoices = filteredInvoices.reduce((acc: { [key: string]: Invoice[] }, invoice) => {
    if (!acc[invoice.customerNumber]) {
      acc[invoice.customerNumber] = [];
    }
    acc[invoice.customerNumber].push(invoice);
    return acc;
  }, {});

  return (
    <div className="library-container">
      {/* Botão de voltar para a página inicial no topo */}
      <div className="back-button-container">
        <Link to="/" className="back-button">
          <FaArrowLeft className="back-icon" /> Início
        </Link>
      </div>

      <h1>Biblioteca de Faturas</h1>

      {/* Filtros por número do cliente e ano */}
      <div className="filter-container">
        <div>
          <label htmlFor="customerNumber">Filtrar pelo número do cliente:</label>
          <input
            type="text"
            id="customerNumber"
            value={customerNumber}
            onChange={(e) => setCustomerNumber(e.target.value)}
            placeholder="Digite o número do cliente"
          />
        </div>
        <div>
          <label htmlFor="yearSelect">Filtrar por ano:</label>
          <select
            id="yearSelect"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela de faturas agrupadas por cliente e mês */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Cliente</th>
            {months.map((month) => (
              <th key={month}>{month}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedInvoices).map((customer) => (
            <tr key={customer}>
              {/* Cliente */}
              <td>{customer}</td>

              {/* Meses com faturas */}
              {months.map((month, index) => {
                const invoiceForMonth = groupedInvoices[customer].find(invoice => {
                  const [invoiceMonth, invoiceYear] = invoice.referenceMonth.split('/'); // Extrai o mês e o ano
                  return invoiceMonth.toLowerCase().startsWith(month.toLowerCase()); // Compara o mês
                });

                return (
                  <td key={month}>
                    {invoiceForMonth && invoiceForMonth.referenceMonth.includes(selectedYear.toString()) ? (
                      <button onClick={() => handleDownload(invoiceForMonth.id)} className="download-btn">
                        <FaDownload />
                        <span className="sr-only">Download fatura de {month}</span> {/* Texto acessível */}
                      </button>
                    ) : (
                      <span>-</span> // Mostrar um traço se não houver fatura para o mês
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceLibrary;
