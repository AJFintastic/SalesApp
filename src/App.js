import { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  FiDollarSign, 
  FiUsers, 
  FiShoppingCart, 
  FiTrendingUp,
  FiChevronUp,
  FiChevronDown,
  FiAlertCircle,
  FiActivity
} from 'react-icons/fi';
import { MdOutlineDashboard, MdPeopleAlt } from 'react-icons/md';

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
const ModernText = styled.div`
  color: ${props => props.color || '#1a1a1a'};
  line-height: 1.6;
  margin: ${props => props.margin || '0'};

  ${props => props.variant === 'title' && `
    font-size: 2.5rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  `}

  ${props => props.variant === 'heading' && `
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  `}

  ${props => props.variant === 'subheading' && `
    font-size: 0.875rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `}

  ${props => props.variant === 'body' && `
    font-size: 1rem;
    font-weight: 400;
    color: #475569;
  `}

  ${props => props.variant === 'metric' && `
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: #0f172a;
  `}
`;

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
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
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
    background: ${props => props.bg || '#f1f5f9'};
    color: ${props => props.color || '#3b82f6'};
  }
`;

const ChartCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
`;

const TrendIndicator = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.trend > 0 ? '#10b981' : '#ef4444'};
`;

const StatsPanel = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MetricRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
`;

const MetricItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: ${props => props.background || '#f8fafc'};
  border-radius: 8px;
`;

const StatusBar = styled.div`
  height: 4px;
  background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 2px;
  margin-top: 1rem;
`;

const InsightsContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  max-width: 600px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #475569;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px #bfdbfe;
    }
  }
`;

const SubmitButton = styled.button`
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`;

// Dummy data generator
const generateData = () => ({
  totalSales: 53000,
  totalUsers: 2300,
  newClients: 3462,
  salesTrend: 5.5,
  activeUsers: 823,
  salesData: Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString('default', { month: 'short' }),
    sales: Math.floor(Math.random() * 80000 + 20000),
  })),
  users: 3,
  clicks: 5,
  sales: 6,
  items: 43
});

function App() {
  const [metrics, setMetrics] = useState(generateData());
  const [activeView, setActiveView] = useState('dashboard');
  const [storeInput, setStoreInput] = useState('');
  const [regionInput, setRegionInput] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAIInsights = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setApiResponse('');

    try {
      const response = await fetch('https://tasteapi.onrender.com/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          store: storeInput,
          region: regionInput
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setApiResponse(data.generated_text);
    } catch (err) {
      setError('Failed to get insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <DashboardContainer>
        <Sidebar>
          <ModernText variant="title" style={{ 
            background: 'linear-gradient(45deg, #6366f1, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '2rem'
          }}>
            Sales Dashboard
          </ModernText>
          
          <SidebarItem onClick={() => setActiveView('dashboard')}>
            <MdOutlineDashboard /> Dashboard
          </SidebarItem>
          <SidebarItem onClick={() => setActiveView('insights')}>
            <FiActivity /> AI Insights
          </SidebarItem>
          <SidebarItem><FiShoppingCart /> Sales</SidebarItem>
          <SidebarItem><MdPeopleAlt /> Customers</SidebarItem>
          <SidebarItem><FiUsers /> Users</SidebarItem>

          <div style={{ marginTop: '2rem' }}>
            <ModernText variant="subheading" style={{ marginBottom: '1rem' }}>ACCOUNT</ModernText>
            <SidebarItem>Profile</SidebarItem>
            <SidebarItem>Sign Out</SidebarItem>
          </div>
        </Sidebar>

        <MainContent>
          {activeView === 'dashboard' ? (
            <>
              <MetricGrid>
                <MetricCard bg="#f0fdf4" color="#22c55e">
                  <FiDollarSign />
                  <div>
                    <ModernText variant="subheading">Today's Money</ModernText>
                    <ModernText variant="metric">${metrics.totalSales?.toLocaleString()}</ModernText>
                    <TrendIndicator trend={metrics.salesTrend}>
                      {metrics.salesTrend > 0 ? <FiChevronUp /> : <FiChevronDown />}
                      {metrics.salesTrend}%
                    </TrendIndicator>
                  </div>
                </MetricCard>

                <MetricCard bg="#eff6ff" color="#3b82f6">
                  <FiUsers />
                  <div>
                    <ModernText variant="subheading">Today's Users</ModernText>
                    <ModernText variant="metric">{metrics.totalUsers?.toLocaleString()}</ModernText>
                    <TrendIndicator trend={3}>
                      <FiChevronUp />
                      3%
                    </TrendIndicator>
                  </div>
                </MetricCard>

                <MetricCard bg="#f5f3ff" color="#8b5cf6">
                  <MdPeopleAlt />
                  <div>
                    <ModernText variant="subheading">New Clients</ModernText>
                    <ModernText variant="metric">+{metrics.newClients?.toLocaleString()}</ModernText>
                    <TrendIndicator trend={-2}>
                      <FiChevronDown />
                      2%
                    </TrendIndicator>
                  </div>
                </MetricCard>

                <MetricCard bg="#fce7f3" color="#ec4899">
                  <FiTrendingUp />
                  <div>
                    <ModernText variant="subheading">Total Sales</ModernText>
                    <ModernText variant="metric">${(metrics.totalSales * 2)?.toLocaleString()}</ModernText>
                    <TrendIndicator trend={5}>
                      <FiChevronUp />
                      5%
                    </TrendIndicator>
                  </div>
                </MetricCard>
              </MetricGrid>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <ChartCard>
                  <ModernText variant="heading" margin="0 0 2rem">Sales Overview</ModernText>
                  <div style={{ height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metrics.salesData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          content={({ active, payload }) => active && payload && (
                            <div style={{ 
                              background: 'white', 
                              padding: '1rem', 
                              borderRadius: '8px', 
                              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                            }}>
                              <ModernText variant="subheading">{payload[0].payload.month}</ModernText>
                              <ModernText variant="metric" style={{ fontSize: '1.5rem' }}>
                                ${payload[0].value.toLocaleString()}
                              </ModernText>
                            </div>
                          )}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="sales" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={{ fill: '#3b82f6' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>

                <StatsPanel>
                  <div>
                    <ModernText variant="subheading" style={{ marginBottom: '0.5rem' }}>
                      Active Users
                      <span style={{ color: '#10b981', marginLeft: '0.5rem' }}>(+23%)</span>
                    </ModernText>
                    <ModernText variant="metric" style={{ fontSize: '2.5rem' }}>36K</ModernText>
                    <StatusBar />
                  </div>

                  <div>
                    <ModernText variant="subheading" style={{ marginBottom: '1rem' }}>
                      Performance Metrics
                    </ModernText>
                    <MetricRow>
                      <MetricItem background="#f0fdf4">
                        <ModernText variant="subheading">Users</ModernText>
                        <ModernText variant="metric" style={{ fontSize: '1.5rem' }}>3</ModernText>
                      </MetricItem>
                      <MetricItem background="#f0fdfa">
                        <ModernText variant="subheading">Clicks</ModernText>
                        <ModernText variant="metric" style={{ fontSize: '1.5rem' }}>5</ModernText>
                      </MetricItem>
                      <MetricItem background="#f5f3ff">
                        <ModernText variant="subheading">Sales</ModernText>
                        <ModernText variant="metric" style={{ fontSize: '1.5rem' }}>6</ModernText>
                      </MetricItem>
                      <MetricItem background="#fce7f3">
                        <ModernText variant="subheading">Items</ModernText>
                        <ModernText variant="metric" style={{ fontSize: '1.5rem' }}>43</ModernText>
                      </MetricItem>
                    </MetricRow>
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    <ModernText variant="body" style={{ color: '#64748b' }}>
                      <FiAlertCircle style={{ marginRight: '0.5rem' }} />
                      Updated 2 hours ago
                    </ModernText>
                  </div>
                </StatsPanel>
              </div>
            </>
          ) : (
            <InsightsContainer>
              <ModernText variant="heading" margin="0 0 2rem">
                AI Insights Analysis
              </ModernText>

              <form onSubmit={handleAIInsights}>
                <FormGroup>
                  <label>Store Name</label>
                  <input
                    type="text"
                    value={storeInput}
                    onChange={(e) => setStoreInput(e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>Region</label>
                  <input
                    type="text"
                    value={regionInput}
                    onChange={(e) => setRegionInput(e.target.value)}
                    required
                  />
                </FormGroup>

                <SubmitButton type="submit" disabled={isLoading}>
                  {isLoading ? 'Analyzing...' : 'Get Insights'}
                </SubmitButton>

                {error && (
                  <ModernText variant="body" style={{ color: '#ef4444', marginTop: '1rem' }}>
                    {error}
                  </ModernText>
                )}

                {apiResponse && (
                  <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '6px' }}>
                    <ModernText variant="subheading" style={{ marginBottom: '0.5rem' }}>
                      AI Insights:
                    </ModernText>
                    <ModernText variant="body">{apiResponse}</ModernText>
                  </div>
                )}
              </form>
            </InsightsContainer>
          )}
        </MainContent>
      </DashboardContainer>
    </>
  );
}

export default App;
