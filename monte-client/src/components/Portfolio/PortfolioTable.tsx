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
  Input,
  Textarea,
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Portfolio Entries</h2>
        <Button
          color="primary"
          onPress={onOpen}
          startContent={<Plus className="w-4 h-4" />}
        >
          Add Entry
        </Button>
      </div>

      <Table
        aria-label="Portfolio entries table"
        classNames={{
          wrapper: "bg-gray-800/50 border border-gray-700",
          th: "bg-gray-700/50 text-gray-300",
          td: "text-white"
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

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        classNames={{
          base: "bg-gray-800 border border-gray-700",
          header: "text-white",
          body: "text-white",
          footer: "border-t border-gray-700"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add Portfolio Entry</ModalHeader>
              <ModalBody>
                <Input
                  label="Asset Symbol"
                  placeholder="e.g., BTC, ETH, AAPL"
                  value={newEntry.asset}
                  onChange={(e) => setNewEntry({ ...newEntry, asset: e.target.value })}
                  classNames={{
                    input: "text-white",
                    label: "text-gray-300"
                  }}
                />
                <Input
                  label="Amount"
                  placeholder="0.00"
                  type="number"
                  step="any"
                  value={newEntry.amount}
                  onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                  classNames={{
                    input: "text-white",
                    label: "text-gray-300"
                  }}
                />
                <Input
                  label="Purchase Price"
                  placeholder="0.00"
                  type="number"
                  step="any"
                  value={newEntry.price}
                  onChange={(e) => setNewEntry({ ...newEntry, price: e.target.value })}
                  classNames={{
                    input: "text-white",
                    label: "text-gray-300"
                  }}
                />
                <Textarea
                  label="Notes (Optional)"
                  placeholder="Add any notes about this investment"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  classNames={{
                    input: "text-white",
                    label: "text-gray-300"
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleAddEntry}>
                  Add Entry
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};