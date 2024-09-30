import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Customer from './Pages/Customer/Customer';
import Invoice from './Pages/Invoice/Invoice';
import SellerKPI from './Pages/SellerKPI/SellerKPI';
import Login from './Pages/Login/Login';
import Navbar from './Components/Navbar/Navbar';
import Home from './Pages/Home/Home';
import ButtomNav from './Components/ButtomNav/ButtomNav';
import ImageSlider from './Components/ImageSlider/ImageSlider';
import CustomerContextProvider from './Contexts/CustomerContext/CustomerContextProvider';
import Signup from './Pages/Signup/Signup';

function App() {

  return (
    <CustomerContextProvider>
      <BrowserRouter>
        <Navbar />
        <ButtomNav/>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/Invoice' element={<Invoice/>} />
          <Route path='/SellerKPI' element={<SellerKPI/>} />
          <Route path='/Signup' element={<Signup/>}/>
          <Route path='/Login' element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </CustomerContextProvider>
  )
}

export default App
