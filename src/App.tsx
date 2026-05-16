import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import { DatabaseProvider } from './contexts/db-context';
import { Dashboard } from './pages/dashboard'
import { MainLayout } from './layouts/main-layout';
import { Sweepstakes } from './pages/sweepstakes';

function App() {


  return (
    <DatabaseProvider>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bolao" element={<Sweepstakes/>} />
          </Route>
        </Routes>
      </Router>
    </DatabaseProvider>
  )
}

export default App
