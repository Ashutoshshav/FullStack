import React from "react"; 
import Logo from "../../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";

function Navbar(props) {
    const navigate = useNavigate();
    let openCart = async () => {
        navigate("/Customer");
    }
    return (
        <div className="bg-gray-200 flex items-center justify-between h-20 border-b border-blue-200">
            <Link to='/'>
                <img className="h-28 mx-4" src={Logo} alt="Logo" />
                {/* <h1 className="text-xl flex flex-col px-2 py-4">
                    <span className="text-center">Rozana</span>
                    <span className="text-center">Basket</span>
                </h1> */}
            </Link>
            <div className="bg-white px-4 text-xl rounded-xl flex justify-center items-center">
                <input
                    className="p-3"
                    type="text"
                    placeholder="Search"
                    style={{
                        outline: "none"
                    }}
                />
                <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <div className="flex justify-center items-center text-2xl">
                <Link to='/Login'>
                    <button className="p-3 bg-green-500 text-white rounded-xl mx-4">Login</button>
                </Link>
                <Link to='/Signup'>
                    <button className="p-3 bg-blue-400 text-white rounded-xl mx-4" onClick={openCart}>
                        Cart<i className="fa-solid fa-cart-shopping"></i>
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Navbar;
