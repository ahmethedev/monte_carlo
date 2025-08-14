import { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@nextui-org/react';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { PortfolioEntry } from '../../types';
import { portfolioService, CreatePortfolioEntryRequest } from '../../services/portfolioService';


export const PortfolioTable = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [entries, setEntries] = useState<PortfolioEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEntry, setNewEntry] = useState({
    asset: '',
    amount: '',
    price: '',
    notes: ''
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await portfolioService.getEntries();
      setEntries(data);
    } catch (error) {
      console.error('Error fetching portfolio entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const calculateCurrentValue = (entry: PortfolioEntry) => {
    // This should ideally use real-time prices from the API
    // For now, we'll use the purchase price as fallback
    const currentPrice = entry.purchase_price; // You can implement real-time price fetching here
    return entry.amount * currentPrice;
  };

  const calculatePnL = (entry: PortfolioEntry) => {
    const currentValue = calculateCurrentValue(entry);
    return currentValue - (entry.amount * entry.purchase_price);
  };

  const calculatePnLPercent = (entry: PortfolioEntry) => {
    const pnl = calculatePnL(entry);
    const totalInvested = entry.amount * entry.purchase_price;
    return totalInvested > 0 ? (pnl / totalInvested) * 100 : 0;
  };

  const handleAddEntry = async () => {
    if (!newEntry.asset || !newEntry.amount || !newEntry.price) return;
    
    try {
      const entryData: CreatePortfolioEntryRequest = {
        asset_symbol: newEntry.asset.toUpperCase(),
        amount: parseFloat(newEntry.amount),
        purchase_price: parseFloat(newEntry.price),
        purchase_date: new Date().toISOString(),
        notes: newEntry.notes || undefined
      };

      await portfolioService.createEntry(entryData);
      await fetchEntries(); // Refresh the list
      setNewEntry({ asset: '', amount: '', price: '', notes: '' });
      onOpenChange();
    } catch (error) {
      console.error('Error creating portfolio entry:', error);
      // You could add a toast notification here
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-white">Portfolio Entries</h2>
        <Button
          className="btn-primary w-full sm:w-auto"
          onPress={onOpen}
          startContent={<Plus className="w-4 h-4" />}
        >
          <span className="hidden sm:inline">Add Entry</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table
          aria-label="Portfolio entries table"
          classNames={{
            wrapper: "bg-gray-800/50 border border-gray-700 min-w-full",
            th: "bg-gray-700/50 text-gray-300 text-xs sm:text-sm",
            td: "text-white text-xs sm:text-sm"
          }}
        >
        <TableHeader>
          <TableColumn>Date</TableColumn>
          <TableColumn>Asset</TableColumn>
          <TableColumn>Amount</TableColumn>
          <TableColumn>Purchase Price</TableColumn>
          <TableColumn>Invested</TableColumn>
          <TableColumn>Current Value</TableColumn>
          <TableColumn>P&L</TableColumn>
          <TableColumn>Notes</TableColumn>
        </TableHeader>
        <TableBody>
          {loading ? (
            [...Array(3)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(8)].map((_, j) => (
                  <TableCell key={j}>
                    <div className="animate-pulse h-4 bg-gray-600 rounded"></div>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : entries.length === 0 ? (
            <TableRow>
              <TableCell className="text-center text-gray-400 py-8">
                No portfolio entries found. Add your first investment to get started.
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          ) : (
            entries.map((entry) => {
              const currentValue = calculateCurrentValue(entry);
              const pnl = calculatePnL(entry);
              const pnlPercent = calculatePnLPercent(entry);
              const isProfit = pnl >= 0;
              const totalInvested = entry.amount * entry.purchase_price;

              return (
                <TableRow key={entry.id}>
                  <TableCell>{formatDate(entry.purchase_date)}</TableCell>
                  <TableCell>
                    <span className="font-semibold">{entry.asset_symbol}</span>
                  </TableCell>
                  <TableCell>{entry.amount}</TableCell>
                  <TableCell>{formatCurrency(entry.purchase_price)}</TableCell>
                  <TableCell>{formatCurrency(totalInvested)}</TableCell>
                  <TableCell>{formatCurrency(currentValue)}</TableCell>
                  <TableCell>
                    <div className={`flex items-center space-x-1 ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                      {isProfit ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <div>
                        <div>{formatCurrency(pnl)}</div>
                        <div className="text-xs">
                          {pnl >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-400 text-sm">
                      {entry.notes || '-'}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
        </Table>
      </div>

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="md"
        placement="center"
        classNames={{
          base: "bg-gray-900/95 border border-gray-700/50 backdrop-blur-xl mx-4",
          header: "text-white border-b border-gray-700/50 pb-3",
          body: "text-white py-4",
          footer: "border-t border-gray-700/50 pt-4"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add Portfolio Entry</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">Asset Symbol</label>
                    <input
                      type="text"
                      placeholder="e.g., BTC, ETH, AAPL"
                      value={newEntry.asset}
                      onChange={(e) => setNewEntry({ ...newEntry, asset: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/20 hover:border-gray-500/70 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">Amount</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={newEntry.amount}
                      onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/20 hover:border-gray-500/70 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">Purchase Price (USD)</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={newEntry.price}
                      onChange={(e) => setNewEntry({ ...newEntry, price: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/20 hover:border-gray-500/70 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">Notes (Optional)</label>
                    <textarea
                      placeholder="Add any notes about this investment"
                      value={newEntry.notes}
                      onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/20 hover:border-gray-500/70 transition-colors resize-none"
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex gap-3 w-full sm:w-auto sm:justify-end">
                  <Button 
                    color="danger" 
                    variant="light" 
                    onPress={onClose}
                    className="flex-1 sm:flex-initial"
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="btn-primary flex-1 sm:flex-initial" 
                    onPress={handleAddEntry}
                    isDisabled={!newEntry.asset || !newEntry.amount || !newEntry.price}
                  >
                    Add Entry
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};