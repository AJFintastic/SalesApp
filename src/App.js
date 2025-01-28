import { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FiDollarSign,
  FiUsers,
  FiShoppingCart,
  FiTrendingUp,
  FiChevronUp,
  FiChevronDown,
  FiActivity,
} from "react-icons/fi";
import { MdOutlineDashboard, MdPeopleAlt } from "react-icons/md";

// Global Styles
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: 'Inter', sans-serif;
  }

  ::selection {
    background: #e0f2fe;
    color: #0369a1;
  }
`;

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const Sidebar = styled.div`
  width: 240px;
  background: white;
  padding: 1.5rem;
  box-shadow: 4px 0 6px rgba(0, 0, 0, 0.1);
  position: fixed;
  height: 100%;
`;

const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
  }

  svg {
    font-size: 1.25rem;
  }
`;

const MainContent = styled.div`
  margin-left: 240px;
  padding: 2rem;
  flex: 1;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  svg {
    font-size: 2rem;
    padding: 0.75rem;
    border-radius: 8px;
    background: ${(props) => props.bg || "#f1f5f9"};
    color: ${(props) => props.color || "#3b82f6"};
  }
`;

const ChartCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const TrendIndicator = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => (props.trend > 0 ? "#10b981" : "#ef4444")};
`;

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch transactions from the API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          "https://tasteapi.onrender.com/transactions"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Aggregate metrics
  const totalSales = transactions.reduce(
    (sum, transaction) => sum + transaction.price * transaction.quantity,
    0
  );
  const totalProducts = transactions.reduce(
    (sum, transaction) => sum + transaction.quantity,
    0
  );
  const totalTransactions = transactions.length;

  return (
    <>
      <GlobalStyle />
      <DashboardContainer>
        <Sidebar>
          <SidebarItem>
            <MdOutlineDashboard /> Dashboard
          </SidebarItem>
          <SidebarItem>
            <FiActivity /> Analytics
          </SidebarItem>
          <SidebarItem>
            <FiShoppingCart /> Transactions
          </SidebarItem>
          <SidebarItem>
            <MdPeopleAlt /> Customers
          </SidebarItem>
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
                <MetricCard bg="#f0fdf4" color="#22c55e">
                  <FiDollarSign />
                  <div>
                    <p>Total Sales</p>
                    <h2>${totalSales.toLocaleString()}</h2>
                  </div>
                </MetricCard>
                <MetricCard bg="#eff6ff" color="#3b82f6">
                  <FiUsers />
                  <div>
                    <p>Total Transactions</p>
                    <h2>{totalTransactions}</h2>
                  </div>
                </MetricCard>
                <MetricCard bg="#f5f3ff" color="#8b5cf6">
                  <FiShoppingCart />
                  <div>
                    <p>Total Products Sold</p>
                    <h2>{totalProducts}</h2>
                  </div>
                </MetricCard>
              </MetricGrid>
              <ChartCard>
                <h3>Sales Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={transactions.map((t) => ({
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
              </ChartCard>
            </>
          )}
        </MainContent>
      </DashboardContainer>
    </>
  );
}

export default Dashboard;
