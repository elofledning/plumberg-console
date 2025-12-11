import { useState } from 'react';
import './StockCalendar.css';

interface StockPosition {
  id: string;
  ticker: string;
  percentage: string;
}

const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

function StockCalendar() {
  const [positions, setPositions] = useState<StockPosition[]>([]);
  const [newTicker, setNewTicker] = useState('');
  const [newPercentage, setNewPercentage] = useState('');

  const addPosition = () => {
    if (newTicker.trim() === '') return;
    
    const position: StockPosition = {
      id: Date.now().toString(),
      ticker: newTicker.toUpperCase(),
      percentage: newPercentage || '0'
    };
    
    setPositions([...positions, position]);
    setNewTicker('');
    setNewPercentage('');
  };

  const removePosition = (id: string) => {
    setPositions(positions.filter(pos => pos.id !== id));
  };

  const updatePercentage = (id: string, value: string) => {
    setPositions(positions.map(pos => 
      pos.id === id ? { ...pos, percentage: value } : pos
    ));
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
          <div className="cell header-cell action-col">ACTION</div>
        </div>

        {/* Stock Position Rows */}
        {positions.map((position) => (
          <div key={position.id} className="grid-row">
            <div className="cell data-cell ticker-col">{position.ticker}</div>
            <div className="cell data-cell percent-col">
              <input
                type="number"
                value={position.percentage}
                onChange={(e) => updatePercentage(position.id, e.target.value)}
                className="percent-input"
                min="0"
                max="100"
              />
            </div>
            {MONTHS.map((month) => (
              <div key={month} className="cell data-cell month-col">
                <div className="month-data">-</div>
              </div>
            ))}
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
            <input
              type="number"
              value={newPercentage}
              onChange={(e) => setNewPercentage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="%"
              className="percent-input"
              min="0"
              max="100"
            />
          </div>
          {MONTHS.map((month) => (
            <div key={month} className="cell data-cell month-col">
              <div className="month-data">-</div>
            </div>
          ))}
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
    </div>
  );
}

export default StockCalendar;
