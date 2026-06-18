import './App.css'
import ScanPage from './ScanPage'

export default function App() {
  return (
    <div className="page" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 100 }}>
        <ScanPage />
      </div>
    </div>
  )
}
