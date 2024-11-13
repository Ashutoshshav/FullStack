import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmployeeLogin from "./Pages/EmployeeLogin/EmployeeLogin";
import Navbar from './Components/Navbar/Navbar';
import Home from './Pages/Home/Home';
import './App.css';
import AllWorks from './Pages/AllWorks/AllWorks';
import SiteVisit from './Pages/SiteVisit/SiteVisit';
import SiteImages from './Pages/SiteImages/SiteImages';
import DailyEmployeeEntry from './Pages/DailyEmployeeEntry/DailyEmployeeEntry';

function App() {
    const [isOpen, setIsOpen] = useState(true); // Default to open on desktop

    // Handle resize for responsive behavior
    useEffect(() => {
        setIsOpen(false); 
    }, []);

    const toggleNavbar = () => {
        setIsOpen(!isOpen); // Toggle sidebar open/close state
    };

    return (
        <BrowserRouter>
            <div className="flex">
                <Navbar isOpen={isOpen} toggleNavbar={toggleNavbar} />
                <div className={`flex-1 flex flex-col mt-20 transition-all duration-300 ${isOpen ? '' : 'ml-0'}`}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/Login" element={<EmployeeLogin />} />
                        <Route path='/AllWorks' element={<AllWorks />} />
                        <Route path='/SiteVisit' element={<SiteVisit/>} />
                        <Route path='/SiteImages' element={<SiteImages/>} />
                        <Route path='/DailyEmployeeEntry' element={<DailyEmployeeEntry/>} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
