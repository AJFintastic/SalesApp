import React, { useState, useEffect } from "react";
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
import {
  FiDollarSign,
  FiUsers,
  FiShoppingCart,
  FiActivity,
  FiChevronDown,
  FiChevronUp,
  FiDownload,
} from "react-icons/fi";
import {
  MdOutlineDashboard,
  MdPeopleAlt,
} from "react-icons/md";

/* 
  --------------------------------------------------------------------------------
  GlobalStyle
    - Resets default margins, applies global fonts, etc.
  --------------------------------------------------------------------------------
*/
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

/* 
  --------------------------------------------------------------------------------
  Styled Components for Layout and Structure
  --------------------------------------------------------------------------------
*/
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

/* 
  1. Smaller Sidebar
    - We use a toggle (collapsedSidebar) to handle whether the sidebar is expanded or collapsed.
    - When collapsed, we only show icons; on hover, you can optionally expand or show tooltips.
*/
const Sidebar = styled.div`
  width: ${(props) => (props.collapsed ? "70px" : "200px")};
  background: white;
  padding: 1rem;
  box-shadow: 4px 0 6px rgba(0, 0, 0, 0.1);
  position: fixed;
  height: 100%;
  transition: width 0.3s ease;
`;

const SidebarToggle = styled.div`
  display: flex;
  justify-content: ${(props) => (props.collapsed ? "center" : "flex-end")};
  margin-bottom: 1rem;
  cursor: pointer;
  color: #4a5568;
`;

const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.collapsed ? "0" : "1rem")};
  padding: 0.75rem 0.5rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  color: #4a5568;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;

  &:hover {
    background: #f1f5f9;
  }

  svg {
    font-size: 1.25rem;
    margin-right: ${(props) => (props.collapsed ? "0" : "0.5rem")};
  }

  span {
    display: ${(props) => (props.collapsed ? "none" : "inline")};
  }
`;

const MainContent = styled.div`
  margin-left: ${(props) => (props.collapsed ? "70px" : "220px")};
  padding: 2rem;
  flex: 1;
  transition: margin-left 0.3s ease;
`;

/* 
  MetricGrid & MetricCard
    - Same style as before, used for top-level metrics like Total Sales, etc.
*/
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
  margin-bottom: 2rem;
`;

/* 
  2. Dropdown Filters with Search
    - A simple filter bar with dropdowns and a date range for illustration.
    - You might replace these <select> elements with react-select for better search capabilities.
*/
const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;

  select,
  input[type="date"] {
    padding: 0.5rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: white;
    font-size: 0.9rem;
    color: #374151;
  }
`;

const ExportButton = styled.button`
  background-color: #3b82f6;
  color: #fff;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`;

/* 
  3. Additional Graphs and Visuals
    - Styles for some additional chart containers or KPI indicators can be extended here.
*/
const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const KPICard = styled.div`
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

/* 
  4 & 5. Enhanced Column Usage & Interactivity 
    - We will create new charts for top products, sales by category (pie), 
      and a basic interactive bar chart for comparison of quantity sold per product.
    - Heatmap will be shown as a simplified mock (using squares) for illustration.
*/
const HeatmapContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 5px;
  margin-top: 1rem;
`;

const HeatmapCell = styled.div`
  height: 40px;
  background-color: ${(props) => props.color || "#e5e7eb"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.7rem;
  border-radius: 4px;
`;

/* 
  6. Export Functionality 
    - We'll provide a simple "Export to CSV" approach as an example. 
      For PDF, you could integrate libraries like jsPDF.
*/

/* 
  7. Customization Options
    - We'll show how to filter by city, product, sales_rep, and date range.
*/
function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Sidebar state
  const [collapsedSidebar, setCollapsedSidebar] = useState(false);

  // Filter states
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedRep, setSelectedRep] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* 
    ------------------------------------------------------------------------------
    Fetch transactions from API
    ------------------------------------------------------------------------------
  */
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("https://tasteapi.onrender.com/transactions/");
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

  /* 
    ------------------------------------------------------------------------------
    Filtered data based on user selections
      - We match city, product, sales_rep if selected
      - We also filter by date range if both start & end are selected
    ------------------------------------------------------------------------------
  */
  const filteredData = transactions.filter((t) => {
    const withinCity = selectedCity ? t.city === selectedCity : true;
    const withinProduct = selectedProduct ? t.product === selectedProduct : true;
    const withinRep = selectedRep ? t.sales_rep === selectedRep : true;
    const withinDates =
      startDate && endDate
        ? new Date(t.date) >= new Date(startDate) &&
          new Date(t.date) <= new Date(endDate)
        : true;
    return withinCity && withinProduct && withinRep && withinDates;
  });

  /* 
    ------------------------------------------------------------------------------
    Aggregate Metrics (using filteredData, so metrics reflect the current filters)
    ------------------------------------------------------------------------------
  */
  const totalSales = filteredData.reduce(
    (sum, transaction) => sum + transaction.price * transaction.quantity,
    0
  );
  const totalProducts = filteredData.reduce(
    (sum, transaction) => sum + transaction.quantity,
    0
  );
  const totalTransactions = filteredData.length;

  // Example KPI: Average Order Value
  const averageOrderValue = totalTransactions
    ? (totalSales / totalTransactions).toFixed(2)
    : 0;

  // Example KPI: Count of distinct cities in filtered data
  const distinctCities = new Set(filteredData.map((t) => t.city)).size;

  /* 
    ------------------------------------------------------------------------------
    Top 5 products by quantity
    ------------------------------------------------------------------------------
  */
  const productSummary = {};
  filteredData.forEach((t) => {
    if (!productSummary[t.product]) {
      productSummary[t.product] = { quantity: 0, sales: 0 };
    }
    productSummary[t.product].quantity += t.quantity;
    productSummary[t.product].sales += t.price * t.quantity;
  });
  const topProductsByQuantity = Object.entries(productSummary)
    .sort((a, b) => b[1].quantity - a[1].quantity)
    .slice(0, 5);

  /* 
    ------------------------------------------------------------------------------
    Performance Rankings for Sales Rep
    ------------------------------------------------------------------------------
  */
  const repSummary = {};
  filteredData.forEach((t) => {
    if (!repSummary[t.sales_rep]) {
      repSummary[t.sales_rep] = { sales: 0 };
    }
    repSummary[t.sales_rep].sales += t.price * t.quantity;
  });
  const sortedReps = Object.entries(repSummary).sort((a, b) => b[1].sales - a[1].sales);

  /* 
    ------------------------------------------------------------------------------
    Distribution of sales by product category (Pie Chart)
    For demo, we assume 'product' can act like a category. In practice,
    you might have a 'category' field in the transaction.
    ------------------------------------------------------------------------------
  */
  const pieData = Object.entries(productSummary).map(([product, val]) => ({
    name: product,
    value: val.sales,
  }));

  // Colors for pie slices
  const COLORS = ["#6366F1", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"];

  /* 
    ------------------------------------------------------------------------------
    Heatmap (Simplified example):
    - We'll group by sales_rep => total monthly sales, 
      then color cells by intensity (higher sales = darker color).
    ------------------------------------------------------------------------------
  */
  const heatmapData = {}; // { sales_rep: { 'YYYY-MM': totalSales, ... }, ... }
  filteredData.forEach((t) => {
    const rep = t.sales_rep;
    const month = t.date.substring(0, 7); // e.g. "2023-01"
    if (!heatmapData[rep]) heatmapData[rep] = {};
    if (!heatmapData[rep][month]) heatmapData[rep][month] = 0;
    heatmapData[rep][month] += t.price * t.quantity;
  });

  // Create a set of all months in the data for a consistent grid
  const allMonths = new Set();
  Object.values(heatmapData).forEach((monthsObj) => {
    Object.keys(monthsObj).forEach((m) => allMonths.add(m));
  });
  const sortedMonths = Array.from(allMonths).sort();

  // Flatten for color scaling
  const allSalesValues = [];
  Object.values(heatmapData).forEach((monthsObj) => {
    Object.values(monthsObj).forEach((val) => allSalesValues.push(val));
  });
  const maxSales = Math.max(...allSalesValues, 1);

  // Helper function to scale color
  const getHeatmapColor = (val) => {
    if (!val) return "#e5e7eb";
    // scale 0 -> maxSales into 0x00 -> 0xff for green channel, e.g. #1* (some greenish color)
    const intensity = Math.round((val / maxSales) * 255);
    return `rgb(${255 - intensity}, ${intensity}, 100)`;
  };

  /* 
    ------------------------------------------------------------------------------
    Handle Export to CSV
    ------------------------------------------------------------------------------
  */
  const handleExport = () => {
    // Build CSV string
    const headers = "transaction_id,date,city,product,sku,sales_rep,quantity,price";
    const rows = filteredData.map(
      (t) =>
        `${t.transaction_id},${t.date},${t.city},${t.product},${t.sku},${t.sales_rep},${t.quantity},${t.price}`
    );
    const csvContent = [headers, ...rows].join("\n");

    // Create a temporary link to download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "filtered_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <GlobalStyle />
      <DashboardContainer>
        {/* Sidebar with collapse/expand */}
        <Sidebar collapsed={collapsedSidebar}>
          <SidebarToggle
            collapsed={collapsedSidebar}
            onClick={() => setCollapsedSidebar(!collapsedSidebar)}
          >
            {collapsedSidebar ? <FiChevronDown /> : <FiChevronUp />}
          </SidebarToggle>

          <SidebarItem collapsed={collapsedSidebar}>
            <MdOutlineDashboard />
            <span>Dashboard</span>
          </SidebarItem>
          <SidebarItem collapsed={collapsedSidebar}>
            <FiActivity />
            <span>Analytics</span>
          </SidebarItem>
          <SidebarItem collapsed={collapsedSidebar}>
            <FiShoppingCart />
            <span>Transactions</span>
          </SidebarItem>
          <SidebarItem collapsed={collapsedSidebar}>
            <MdPeopleAlt />
            <span>Customers</span>
          </SidebarItem>
        </Sidebar>

        <MainContent collapsed={collapsedSidebar}>
          <h1>Sales Dashboard</h1>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <>
              {/* 2. Dropdown Filters with Search */}
              <FilterBar>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">All Cities</option>
                  {[...new Set(transactions.map((t) => t.city))].map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="">All Products</option>
                  {[...new Set(transactions.map((t) => t.product))].map((prod) => (
                    <option key={prod} value={prod}>
                      {prod}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedRep}
                  onChange={(e) => setSelectedRep(e.target.value)}
                >
                  <option value="">All Sales Reps</option>
                  {[...new Set(transactions.map((t) => t.sales_rep))].map((rep) => (
                    <option key={rep} value={rep}>
                      {rep}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />

                {/* 6. Export Functionality */}
                <ExportButton onClick={handleExport}>
                  <FiDownload />
                  Export CSV
                </ExportButton>
              </FilterBar>

              {/* Top-Level Metrics */}
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

              {/* Additional KPI Indicators */}
              <KPIGrid>
                <KPICard>
                  <h4>Avg. Order Value</h4>
                  <p style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                    ${averageOrderValue}
                  </p>
                </KPICard>
                <KPICard>
                  <h4>Distinct Cities</h4>
                  <p style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                    {distinctCities}
                  </p>
                </KPICard>
              </KPIGrid>

              {/* 3. Additional Graphs and Visuals */}

              {/* 3a. Sales Trend (existing line chart) */}
              <ChartCard>
                <h3>Sales Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={filteredData.map((t) => ({
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
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* 3b. Comparison chart: quantity sold per product (bar chart) */}
              <ChartCard>
                <h3>Top 5 Products (by Quantity)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={topProductsByQuantity.map(([product, stats]) => ({
                      name: product,
                      quantity: stats.quantity,
                    }))}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#6366F1" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* 3c. Pie chart: distribution of sales by product category */}
              <ChartCard>
                <h3>Sales by Product (Pie Chart)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius="80%"
                      fill="#8884d8"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* 3d. Heatmap for sales performance by sales_rep over time */}
              <ChartCard>
                <h3>Sales Performance Heatmap (by Sales Rep & Month)</h3>
                {Object.entries(heatmapData).map(([rep, monthsObj]) => (
                  <div key={rep} style={{ marginBottom: "1rem" }}>
                    <strong>{rep}</strong>
                    <HeatmapContainer>
                      {sortedMonths.map((m) => (
                        <HeatmapCell key={m} color={getHeatmapColor(monthsObj[m])}>
                          {monthsObj[m] ? Math.round(monthsObj[m]) : 0}
                        </HeatmapCell>
                      ))}
                    </HeatmapContainer>
                  </div>
                ))}
              </ChartCard>

              {/* 4. Enhanced Column Usage: 
                  Top 5 products by quantity and sales (already shown in bar chart above),
                  Performance ranking for sales reps 
              */}
              <ChartCard>
                <h3>Sales Rep Rankings</h3>
                <ul>
                  {sortedReps.map(([rep, val], idx) => (
                    <li key={rep}>
                      <strong>#{idx + 1} {rep}:</strong> ${val.sales.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </ChartCard>
            </>
          )}
        </MainContent>
      </DashboardContainer>
    </>
  );
}

export default Dashboard;
