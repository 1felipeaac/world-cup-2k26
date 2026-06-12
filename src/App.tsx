import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DatabaseProvider } from './contexts/db-context';
import { Dashboard } from './pages/dashboard'
import { MainLayout } from './layouts/main-layout';
import { Sweepstakes } from './pages/sweepstakes';
import { KnockoutStage } from './pages/knockout-stage';
import { Rules } from './pages/rules';
import { About } from './pages/about';
import { Stats } from './pages/stats';
import { Schedule } from './pages/schedule';

function App() {

  return (
    <DatabaseProvider>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mata-mata" element={<KnockoutStage />} />
            <Route path="/estatisticas" element={<Stats />} />
            <Route path="/calendario" element={<Schedule />} />
            <Route path="/bolao" element={<Sweepstakes/>} />
            <Route path="/regras" element={<Rules />} />
            <Route path="/sobre" element={<About />} />
          </Route>
        </Routes>
      </Router>
    </DatabaseProvider>
  )
}

export default App
