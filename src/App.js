// App.js
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FiDollarSign, FiUsers, FiShoppingCart, FiTrendingUp } from 'react-icons/fi';
import { MdOutlineDashboard, MdPeopleAlt } from 'react-icons/md';

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
  box-shadow: 4px 0 6px rgba(0,0,0,0.1);
  position: fixed;
  height: 100%;
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
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    font-size: 2rem;
    color: ${props => props.color || '#4a5568'};
    padding: 0.5rem;
    background: ${props => props.bg || '#f7fafc'};
    border-radius: 8px;
  }
`;

const MetricText = styled.div`
  h3 {
    margin: 0;
    font-size: 1rem;
    color: #718096;
  }
  
  p {
    margin: 0.25rem 0 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #2d3748;
  }

  span {
    font-size: 0.875rem;
    color: ${props => props.trend > 0 ? '#48bb78' : '#f56565'};
  }
`;

const ChartCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  margin-bottom: 2rem;

  h2 {
    margin: 0 0 2rem;
    color: #2d3748;
  }
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
    background: #edf2f7;
  }

  svg {
    font-size: 1.25rem;
  }
`;

// Dummy data and metrics calculation
const generateData = () => ({
  totalSales: 53000,
  totalUsers: 2300,
  newClients: 3462,
  salesTrend: 5.5,
  activeUsers: 823,
  salesData: Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString('default', { month: 'short' }),
    sales: Math.floor(Math.random() * 80000 + 20000),
  }))
});

function App() {
  const [metrics, setMetrics] = useState(generateData());

  useEffect(() => {
    fetch('https://tasteapi.onrender.com/products/')
      .then(res => res.json())
      .then(data => {
        // Process your actual API data here
      })
      .catch(() => {
        // Use dummy data if API fails
        setMetrics(generateData());
      });
  }, []);

  return (
    <DashboardContainer>
      <Sidebar>
        <h2 style={{ margin: '0 0 2rem' }}>Sales Dashboard</h2>
        
        <SidebarItem><MdOutlineDashboard /> Dashboard</SidebarItem>
        <SidebarItem><FiShoppingCart /> Sales</SidebarItem>
        <SidebarItem><MdPeopleAlt /> Customers</SidebarItem>
        <SidebarItem><FiUsers /> Users</SidebarItem>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ color: '#718096' }}>ACCOUNT</h3>
          <SidebarItem>Profile</SidebarItem>
          <SidebarItem>Sign Out</SidebarItem>
        </div>
      </Sidebar>

      <MainContent>
        <MetricGrid>
          <MetricCard>
            <FiDollarSign color="#48bb78" bg="#f0fff4" />
            <MetricText>
              <h3>Today's Money</h3>
              <p>${metrics.totalSales?.toLocaleString()}</p>
              <span trend={metrics.salesTrend}>+{metrics.salesTrend}%</span>
            </MetricText>
          </MetricCard>

          <MetricCard>
            <FiUsers color="#4299e1" bg="#ebf8ff" />
            <MetricText>
              <h3>Today's Users</h3>
              <p>{metrics.totalUsers?.toLocaleString()}</p>
              <span trend={3}>+3%</span>
            </MetricText>
          </MetricCard>

          <MetricCard>
            <MdPeopleAlt color="#9f7aea" bg="#faf5ff" />
            <MetricText>
              <h3>New Clients</h3>
              <p>+{metrics.newClients?.toLocaleString()}</p>
              <span trend={-2}>-2%</span>
            </MetricText>
          </MetricCard>

          <MetricCard>
            <FiTrendingUp color="#ed64a6" bg="#fff5f7" />
            <MetricText>
              <h3>Total Sales</h3>
              <p>${(metrics.totalSales * 2)?.toLocaleString()}</p>
              <span trend={5}>+5%</span>
            </MetricText>
          </MetricCard>
        </MetricGrid>

        <ChartCard>
          <h2>Sales Overview</h2>
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.salesData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#4299e1" 
                  strokeWidth={2}
                  dot={{ fill: '#4299e1' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
          <ChartCard>
            <h2>Active Users</h2>
            <div style={{ height: '200px' }}>
              {/* Add your users chart here */}
            </div>
          </ChartCard>

          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px' }}>
            <h3 style={{ marginTop: 0 }}>Sales Documentation</h3>
            <p style={{ color: '#718096' }}>
              From product details to sales strategies, find all documentation related to our sales process.
            </p>
            <button style={{
              background: '#4299e1',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Read More
            </button>
          </div>
        </div>
      </MainContent>
    </DashboardContainer>
  );
}

export default App;
