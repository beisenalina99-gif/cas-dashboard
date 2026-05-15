import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainDashboard from './components/MainDashboard';
import HealthDashboard from './components/HealthDashboard';
import SocialDashboard from './components/SocialDashboard';
import EducationDashboard from './components/EducationDashboard';
import EnergyDashboard from './components/EnergyDashboard';
import TransportDashboard from './components/TransportDashboard';
import AgriDashboard from './components/AgriDashboard';
import VetDashboard from './components/VetDashboard';
import LandDashboard from './components/LandDashboard';
import EcologyDashboard from './components/EcologyDashboard';
import ProcurementDashboard from './components/ProcurementDashboard';
import ConstructionDashboard from './components/ConstructionDashboard';
import EconomyDashboard from './components/EconomyDashboard';
import EntrepreneurDashboard from './components/EntrepreneurDashboard';
import FinanceDashboard from './components/FinanceDashboard';
import DigitalDashboard from './components/DigitalDashboard';
import TourismDashboard from './components/TourismDashboard';
import ReligionDashboard from './components/ReligionDashboard';
import DERDashboard from './components/DERDashboard';
import ReportBuilder from './components/ReportBuilder';
import './index.css';

const DASHBOARDS: Record<string, React.ComponentType> = {
  main: MainDashboard,
  health: HealthDashboard,
  social: SocialDashboard,
  education: EducationDashboard,
  energy: EnergyDashboard,
  transport: TransportDashboard,
  agri: AgriDashboard,
  vet: VetDashboard,
  land: LandDashboard,
  ecology: EcologyDashboard,
  construction: ConstructionDashboard,
  economy: EconomyDashboard,
  entrepreneur: EntrepreneurDashboard,
  finance: FinanceDashboard,
  digital: DigitalDashboard,
  tourism: TourismDashboard,
  religion: ReligionDashboard,
  der: DERDashboard,
  procurement: ProcurementDashboard,
  reports: ReportBuilder,
};

export default function App() {
  const [active, setActive] = useState('main');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const Component = DASHBOARDS[active] || MainDashboard;

  return (
    <div className="app-layout">
      <Sidebar active={active} setActive={setActive} open={sidebarOpen} setOpen={setSidebarOpen} />
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Component />
      </main>
    </div>
  );
}
