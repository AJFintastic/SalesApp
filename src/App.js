// App.js
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiDollarSign, FiShoppingBag, FiBox, FiTrendingUp } from 'react-icons/fi';

// Styled components
const DashboardContainer = styled.div`
  padding: 2rem;
  background-color: #f5f6fa;
  min-height: 100vh;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    font-size: 1.8rem;
    color: ${props => props.color || '#2c3e50'};
  }
`;

const MetricText = styled.div`
  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #7f8c8d;
  }
  
  p {
    margin: 0.5rem 0 0;
    font-size: 1.8rem;
    font-weight: 600;
    color: #2c3e50;
  }
`;

const ChartContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const RecentSales = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #ecf0f1;
  }

  th {
    color: #7f8c8d;
    font-weight: 500;
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  background: ${props => props.background};
  color: white;
  font-size: 0.875rem;
`;

// Generate dummy data
const generateDummyData = () => {
  const products = [];
  for (let i = 0; i < 50; i++) {
    products.push({
      id: i,
      name: `Product ${i + 1}`,
      price: Math.floor(Math.random() * 500) + 50,
      sold: Math.floor(Math.random() * 1000),
      stock: Math.floor(Math.random() * 500),
      category: ['Electronics', 'Fashion', 'Home', 'Beauty'][Math.floor(Math.random() * 4)],
    });
  }
  return products;
};

const calculateMetrics = (products) => {
  const totalSales = products.reduce((sum, product) => sum + (product.price * product.sold), 0);
  const averagePrice = products.length > 0 ? totalSales / products.reduce((sum, product) => sum + product.sold, 0) : 0;
  const monthlySales = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString('default', { month: 'short' }),
    sales: products.reduce((sum, product) => sum + (product.sold * (Math.random() * 0.5 + 0.5)), 0),
  }));
  
  return {
    totalSales,
    averagePrice: averagePrice.toFixed(2),
    monthlySales,
    totalItems: products.reduce((sum, product) => sum + product.sold, 0),
  };
};

function App() {
  const [products, setProducts] = useState([]);
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    fetch('https://tasteapi.onrender.com/products/')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setMetrics(calculateMetrics(data));
      })
      .catch(() => {
        // Use dummy data if API fails
        const dummyProducts = generateDummyData();
        setProducts(dummyProducts);
        setMetrics(calculateMetrics(dummyProducts));
      });
  }, []);

  return (
    <DashboardContainer>
      <MetricsGrid>
        <MetricCard color="#2ecc71">
          <FiDollarSign />
          <MetricText>
            <h3>Total Sales</h3>
            <p>${metrics.totalSales?.toLocaleString()}</p>
          </MetricText>
        </MetricCard>

        <MetricCard color="#3498db">
          <FiShoppingBag />
          <MetricText>
            <h3>Total Items Sold</h3>
            <p>{metrics.totalItems?.toLocaleString()}</p>
          </MetricText>
        </MetricCard>

        <MetricCard color="#9b59b6">
          <FiBox />
          <MetricText>
            <h3>Average Price</h3>
            <p>${metrics.averagePrice}</p>
          </MetricText>
        </MetricCard>

        <MetricCard color="#e67e22">
          <FiTrendingUp />
          <MetricText>
            <h3>Monthly Growth</h3>
            <p>+{(Math.random() * 15 + 5).toFixed(1)}%</p>
          </MetricText>
        </MetricCard>
      </MetricsGrid>

      <ChartContainer>
        <h2>Sales Overview</h2>
        <div style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#3498db" 
                strokeWidth={2}
                dot={{ fill: '#3498db' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>

      <RecentSales>
        <h2>Recent Sales</h2>
        <Table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.slice(0, 5).map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{new Date().toLocaleDateString()}</td>
                <td>${(product.price * product.sold).toLocaleString()}</td>
                <td>
                  <StatusBadge background={product.stock > 0 ? '#2ecc71' : '#e74c3c'}>
                    {product.stock > 0 ? 'Completed' : 'Out of Stock'}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </RecentSales>
    </DashboardContainer>
  );
}

export default App;