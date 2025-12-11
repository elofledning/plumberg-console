import { useState, useRef } from 'react';
import './StockCalendar.css';

interface StockPosition {
  id: string;
  ticker: string;
  percentage: string;
  monthlyPerformance: number[];
  dateAdded: string;
  startMonth: number;
}

interface YearData {
  [year: number]: StockPosition[];
}

const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

function StockCalendar() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [yearData, setYearData] = useState<YearData>({});
  const [newTicker, setNewTicker] = useState('');
  const [newPercentage, setNewPercentage] = useState('');
  const [newStartMonth, setNewStartMonth] = useState(0);
  const tickerInputRef = useRef<HTMLInputElement>(null);

  // Get positions for the currently selected year
  const positions = yearData[selectedYear] || [];

  // Calculate which months have passed for a given year
  const getPassedMonths = (year: number): number => {
    const now = new Date();
    const currentYearNum = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11
    
    if (year < currentYearNum) {
      return 12; // All months passed
    } else if (year === currentYearNum) {
      return currentMonth + 1; // Months passed including current
    } else {
      return 0; // Future year, no months passed
    }
  };

  // Simulate randomized stock movements starting from a specific month
  const simulateStockMovements = (passedMonths: number, startMonth: number): number[] => {
    const movements: number[] = [];
    
    for (let i = 0; i < 12; i++) {
      // Only generate data for months >= startMonth and < passedMonths
      if (i >= startMonth && i < passedMonths) {
        // Generate random percentage change between -15% and +15%
        const change = (Math.random() * 30 - 15).toFixed(2);
        movements.push(parseFloat(change));
      } else {
        // Months before start or after current month have no data
        movements.push(0);
      }
    }
    
    return movements;
  };

  const addPosition = () => {
    if (newTicker.trim() === '') return;
    
    const passedMonths = getPassedMonths(selectedYear);
    const monthlyPerformance = simulateStockMovements(passedMonths, newStartMonth);
    
    // Create date from selected year and start month (first day of the month)
    const date = new Date(selectedYear, newStartMonth, 1);
    const dateAdded = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const position: StockPosition = {
      id: Date.now().toString(),
      ticker: newTicker.toUpperCase(),
      percentage: newPercentage || '0',
      monthlyPerformance,
      dateAdded,
      startMonth: newStartMonth
    };
    
    const currentPositions = yearData[selectedYear] || [];
    setYearData({
      ...yearData,
      [selectedYear]: [...currentPositions, position]
    });
    setNewTicker('');
    setNewPercentage('');
    // Keep newStartMonth - don't reset it
    
    // Focus back on ticker input
    setTimeout(() => tickerInputRef.current?.focus(), 0);
  };

  const removePosition = (id: string) => {
    const currentPositions = yearData[selectedYear] || [];
    setYearData({
      ...yearData,
      [selectedYear]: currentPositions.filter(pos => pos.id !== id)
    });
  };

  const updatePercentage = (id: string, value: string) => {
    const currentPositions = yearData[selectedYear] || [];
    setYearData({
      ...yearData,
      [selectedYear]: currentPositions.map(pos => 
        pos.id === id ? { ...pos, percentage: value } : pos
      )
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPosition();
    }
  };

  return (
    <div className="stock-calendar">
      <div className="calendar-header">
        <h2>PORTFOLIO CALENDAR MATRIX</h2>
        <div className="year-selector">
          <button 
            onClick={() => setSelectedYear(selectedYear - 1)}
            className="year-btn"
          >
            ◀
          </button>
          <span className="year-display">{selectedYear}</span>
          <button 
            onClick={() => setSelectedYear(selectedYear + 1)}
            className="year-btn"
          >
            ▶
          </button>
        </div>
      </div>
      
      <div className="calendar-grid">
        {/* Header Row with Months */}
        <div className="grid-header">
          <div className="cell header-cell ticker-col">TICKER</div>
          <div className="cell header-cell percent-col">%</div>
          {MONTHS.map((month) => (
            <div key={month} className="cell header-cell month-col">
              {month}
            </div>
          ))}
          <div className="cell header-cell total-col">TOTAL %</div>
          <div className="cell header-cell action-col">ACTION</div>
        </div>

        {/* Stock Position Rows */}
        {positions.map((position) => (
          <div key={position.id} className="grid-row">
            <div className="cell data-cell ticker-col">{position.ticker}</div>
            <div className="cell data-cell percent-col">
              <div className="percent-date-container">
                <input
                  type="number"
                  value={position.percentage}
                  onChange={(e) => updatePercentage(position.id, e.target.value)}
                  className="percent-input"
                  min="0"
                  max="100"
                />
                <div className="date-added">{MONTHS[position.startMonth]}</div>
              </div>
            </div>
            {MONTHS.map((month, index) => {
              const performance = position.monthlyPerformance[index];
              const hasData = performance !== 0;
              const isPositive = performance > 0;
              
              // Check if this is the current month
              const now = new Date();
              const isCurrentMonth = selectedYear === now.getFullYear() && index === now.getMonth();
              
              // Calculate adjusted allocation
              const baseAllocation = parseFloat(position.percentage) || 0;
              const adjustedAllocation = baseAllocation * (1 + performance / 100);
              
              return (
                <div key={month} className={`cell data-cell month-col ${isCurrentMonth ? 'current-month' : ''}`}>
                  {hasData ? (
                    <div className="month-data-container">
                      <div className={`month-performance ${isPositive ? 'positive' : 'negative'}`}>
                        {isPositive ? '+' : ''}{performance.toFixed(2)}%
                        {isCurrentMonth && <span className="in-progress">⟳</span>}
                      </div>
                      <div className="month-allocation">
                        {adjustedAllocation.toFixed(2)}%
                      </div>
                    </div>
                  ) : (
                    <div className="month-data">-</div>
                  )}
                </div>
              );
            })}
            <div className="cell data-cell total-col">
              {(() => {
                // Calculate accumulated percentage across all months
                const baseAllocation = parseFloat(position.percentage) || 0;
                let accumulated = baseAllocation;
                
                position.monthlyPerformance.forEach((perf) => {
                  if (perf !== 0) {
                    accumulated = accumulated * (1 + perf / 100);
                  }
                });
                
                const totalChange = accumulated - baseAllocation;
                const isPositive = totalChange > 0;
                
                return (
                  <div className="total-data-container">
                    <div className={`total-performance ${isPositive ? 'positive' : 'negative'}`}>
                      {isPositive ? '+' : ''}{totalChange.toFixed(2)}%
                    </div>
                    <div className="total-allocation">
                      {accumulated.toFixed(2)}%
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="cell data-cell action-col">
              <button 
                onClick={() => removePosition(position.id)}
                className="remove-btn"
              >
                REMOVE
              </button>
            </div>
          </div>
        ))}

        {/* Input Row */}
        <div className="grid-row input-row">
          <div className="cell data-cell ticker-col">
            <input
              ref={tickerInputRef}
              type="text"
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="TICKER"
              className="ticker-input"
              maxLength={10}
            />
          </div>
          <div className="cell data-cell percent-col">
            <div className="percent-start-container">
              <input
                type="number"
                value={newPercentage}
                onChange={(e) => setNewPercentage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="%"
                className="percent-input-small"
                min="0"
                max="100"
              />
              <select
                value={newStartMonth}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value);
                  setNewStartMonth(newValue);
                  // If user clicked to select (even if same value), add position
                  addPosition();
                }}
                onKeyPress={handleKeyPress}
                className="month-select"
              >
                {MONTHS.map((month, index) => (
                  <option key={month} value={index}>{month}</option>
                ))}
              </select>
            </div>
          </div>
          {MONTHS.map((month) => (
            <div key={month} className="cell data-cell month-col">
              <div className="month-data">-</div>
            </div>
          ))}
          <div className="cell data-cell total-col">
            <div className="month-data">-</div>
          </div>
          <div className="cell data-cell action-col">
            <button onClick={addPosition} className="add-btn">
              ADD
            </button>
          </div>
        </div>
      </div>

      <div className="calendar-footer">
        <div className="info-text">
          <span className="blink">▶</span> Enter ticker symbol and percentage allocation
        </div>
        <div className="info-text">
          Total Positions: {positions.length}
        </div>
      </div>

      <div className="portfolio-summary">
        <div className="summary-item">
          <span className="summary-label">TOTAL PORTFOLIO ALLOCATION:</span>
          <span className="summary-value">
            {positions.reduce((sum, pos) => sum + (parseFloat(pos.percentage) || 0), 0).toFixed(2)}%
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">CURRENT TOTAL VALUE:</span>
          <span className="summary-value">
            {(() => {
              const currentTotal = positions.reduce((sum, pos) => {
                const baseAllocation = parseFloat(pos.percentage) || 0;
                let accumulated = baseAllocation;
                
                pos.monthlyPerformance.forEach((perf) => {
                  if (perf !== 0) {
                    accumulated = accumulated * (1 + perf / 100);
                  }
                });
                
                return sum + accumulated;
              }, 0);
              
              return currentTotal.toFixed(2);
            })()}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default StockCalendar;
