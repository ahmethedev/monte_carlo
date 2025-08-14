import { useState } from 'react';
import { Card, CardBody, Tab, Tabs } from '@nextui-org/react';
import { PortfolioTable } from '../components/Portfolio/PortfolioTable';
import { PortfolioPieChart } from '../components/Portfolio/PortfolioPieChart';
import { PortfolioPerformanceChart } from '../components/Portfolio/PortfolioPerformanceChart';
import { PortfolioSummary } from '../components/Portfolio/PortfolioSummary';

const Portfolio = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="text-white p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Portfolio</h1>
        <p className="text-gray-400 text-sm sm:text-base">Track your investments and performance</p>
      </div>

      <PortfolioSummary />

      <div className="mt-6 sm:mt-8">
        <Tabs 
          selectedKey={selectedTab} 
          onSelectionChange={(key) => setSelectedTab(key as string)}
          aria-label="Portfolio options"
          classNames={{
            tabList: "bg-gray-800/80 rounded-lg p-1 gap-1 backdrop-blur-sm border border-gray-700/30 flex-wrap sm:flex-nowrap",
            cursor: "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg rounded-md",
            tab: "px-3 sm:px-6 py-2 text-xs sm:text-sm font-medium text-gray-300 hover:text-white transition-all duration-200 rounded-md min-w-0 flex-1 sm:flex-initial",
            tabContent: "group-data-[selected=true]:text-white"
          }}
        >
          <Tab key="overview" title="Overview">
            <div className="mt-4">
              <PortfolioTable />
            </div>
          </Tab>
          
          <Tab key="allocation" title="Asset Allocation">
            <div className="mt-4">
              <PortfolioPieChart />
            </div>
          </Tab>
          
          <Tab key="performance" title="Performance">
            <div className="mt-4">
              <PortfolioPerformanceChart />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Portfolio;