import { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Select } from "antd";
import {
  FiDollarSign,
  FiUsers,
  FiShoppingCart,
  FiTrendingUp,
} from "react-icons/fi";
import { MdOutlineDashboard } from "react-icons/md";

// Ant Design Styles
import "antd/dist/reset.css";

const { Option } = Select;

// Global Styles
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background-color: #f8f9fa;
  }
`;

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
`;

const Sidebar = styled.div`
  width: 200px;
  background: #ffffff;
  padding: 1rem;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
  position: fixed;
  height: 100vh;
`;

const SidebarItem = styled.div`
  margin-bottom: 1rem;
  color: #4a5568;
  cursor: pointer;
  &:hover {
    color: #3b82f6;
  }
`;

const MainContent = styled.div`
  margin-left: 200px;
  padding: 2rem;
  flex: 1;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ChartContainer = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

// Color Palette for Pie Chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filters, setFilters] = useState({ city: null, product: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("https://tasteapi.onrender.com/transactions/");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setTransactions(data);
        setFilteredTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setFilteredTransactions(
      transactions.filter((t) => {
        return (
          (!value || t[field] === value) &&
          (!filters.city || t.city === filters.city) &&
          (!filters.product || t.product === filters.product)
        );
      })
    );
  };

  const totalSales = filteredTransactions.reduce(
    (sum, t) => sum + t.price * t.quantity,
    0
  );
  const totalTransactions = filteredTransactions.length;
  const totalProducts = filteredTransactions.reduce(
    (sum, t) => sum + t.quantity,
    0
  );

  // Data preparation for visualizations
  const salesByProduct = Object.entries(
    filteredTransactions.reduce((acc, t) => {
      acc[t.product] = (acc[t.product] || 0) + t.quantity;
      return acc;
    }, {})
  ).map(([product, quantity]) => ({ product, quantity }));

  const salesByCity = Object.entries(
    filteredTransactions.reduce((acc, t) => {
      acc[t.city] = (acc[t.city] || 0) + t.price * t.quantity;
      return acc;
    }, {})
  ).map(([city, sales]) => ({ city, sales }));

  const productDistribution = Object.entries(
    filteredTransactions.reduce((acc, t) => {
      acc[t.product] = (acc[t.product] || 0) + 1;
      return acc;
    }, {})
  ).map(([product, count]) => ({ product, count }));

  return (
    <>
      <GlobalStyle />
      <DashboardContainer>
        <Sidebar>
          <SidebarItem>Dashboard</SidebarItem>
          <SidebarItem>Analytics</SidebarItem>
          <SidebarItem>Transactions</SidebarItem>
        </Sidebar>
        <MainContent>
          <h1>Sales Dashboard</h1>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <>
              <MetricGrid>
                <MetricCard>
                  <FiDollarSign size={30} color="#22c55e" />
                  <p>Total Sales: ${totalSales.toFixed(2)}</p>
                </MetricCard>
                <MetricCard>
                  <FiUsers size={30} color="#3b82f6" />
                  <p>Total Transactions: {totalTransactions}</p>
                </MetricCard>
                <MetricCard>
                  <FiShoppingCart size={30} color="#8b5cf6" />
                  <p>Total Products Sold: {totalProducts}</p>
                </MetricCard>
              </MetricGrid>

              <ChartContainer>
                <h3>Sales Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={filteredTransactions.map((t) => ({
                      date: t.date,
                      sales: t.price * t.quantity,
                    }))}
                  >
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>

              <ChartContainer>
                <h3>Quantity Sold by Product</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesByProduct}>
                    <XAxis dataKey="product" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              <ChartContainer>
                <h3>Product Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productDistribution}
                      dataKey="count"
                      nameKey="product"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                    >
                      {productDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </>
          )}
        </MainContent>
      </DashboardContainer>
    </>
  );
}

export default Dashboard;
