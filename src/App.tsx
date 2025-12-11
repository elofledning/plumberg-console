import './App.css'
import StockCalendar from './components/StockCalendar'

function App() {
  return (
    <div className="terminal-container">
      <header className="terminal-header">
        <h1>PLUMBERG TERMINAL</h1>
        <div className="terminal-status">
          <span className="status-item">LIVE</span>
          <span className="status-item">{new Date().toLocaleTimeString()}</span>
        </div>
      </header>
      <main className="terminal-content">
        <StockCalendar />
      </main>
    </div>
  )
}

export default App
