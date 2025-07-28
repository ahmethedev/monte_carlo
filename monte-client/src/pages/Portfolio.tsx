import { useState } from 'react';
import { Card, CardBody, Tab, Tabs } from '@nextui-org/react';
import { PortfolioTable } from '../components/Portfolio/PortfolioTable';
import { PortfolioPieChart } from '../components/Portfolio/PortfolioPieChart';
import { PortfolioPerformanceChart } from '../components/Portfolio/PortfolioPerformanceChart';
import { PortfolioSummary } from '../components/Portfolio/PortfolioSummary';

const Portfolio = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="text-white p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
        <p className="text-gray-400">Track your investments and performance</p>
      </div>

      <PortfolioSummary />

      <div className="mt-8">
        <Tabs 
          selectedKey={selectedTab} 
          onSelectionChange={(key) => setSelectedTab(key as string)}
          aria-label="Portfolio options"
          classNames={{
            tabList: "bg-gray-800/80 rounded-lg p-1 gap-1 backdrop-blur-sm border border-gray-700/30",
            cursor: "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg rounded-md",
            tab: "px-6 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-200 rounded-md",
            tabContent: "group-data-[selected=true]:text-white"
          }}
        >
          <Tab key="overview" title="Overview">
            <Card className="bg-gray-800/50 border-gray-700 mt-4">
              <CardBody>
                <PortfolioTable />
              </CardBody>
            </Card>
          </Tab>
          
          <Tab key="allocation" title="Asset Allocation">
            <Card className="bg-gray-800/50 border-gray-700 mt-4">
              <CardBody>
                <PortfolioPieChart />
              </CardBody>
            </Card>
          </Tab>
          
          <Tab key="performance" title="Performance">
            <Card className="bg-gray-800/50 border-gray-700 mt-4">
              <CardBody>
                <PortfolioPerformanceChart />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Portfolio;