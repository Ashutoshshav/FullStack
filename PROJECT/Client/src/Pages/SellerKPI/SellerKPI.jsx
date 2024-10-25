import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

<<<<<<< Updated upstream
function SellerKPI(props) {
    const navigate = useNavigate();

=======
function SellerKPI({ setIsAdmin }) {
    const navigate = useNavigate();
    // let token = localStorage.getItem("token");
    const token = sessionStorage.getItem('token');
    
>>>>>>> Stashed changes
    const [sellerKPI, setSellerKPI] = useState({
        financialPerformance:{},
        customerPerformance:{},
        vendorPerformance:{},
        monthStatics:{},
        avgMonthStatics:{},
    })

<<<<<<< Updated upstream
    let fetchSellerKPI = async () => {
        try {
            let response = await axios.get("http://192.168.0.252:3000/api/seller/SellerKPI")

            console.log(response.data.financialPerformance)
=======
    if(!token) {
        navigate("/AdminLogin")
    }

    let fetchSellerKPI = async () => {
        try {
            setIsAdmin(true)
            let response = await axios.get("http://192.168.0.252:3000/api/seller/SellerKPI", {
                headers: {
                    Authorization: `${token}`,
                },
            })
            console.log(response.data)
>>>>>>> Stashed changes
            setSellerKPI(response.data)
        } catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchSellerKPI()
    }, [])
    return (
        <div>
            <h1 className="text-3xl text-center font-medium my-3">Seller's KPI's</h1>

            <div>
                <h2 className="sm:w-96 sm:rounded-r-lg w-full text-center font-medium text-white text-xl inline-block py-2" style={{ backgroundColor: "#045ab1" }}>
                    Financial Performance
                </h2>

                <div className="text-base grid grid-cols-[repeat(auto-fill,_minmax(290px,_1fr))]">
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-normal text-lg">Outstanding-Coustomers</p>
<<<<<<< Updated upstream
                        <p className="font-semibold text-blue-500 text-lg text-right">
=======
                        <p className="font-semibold text-blue-500 text-2xl text-right">
>>>>>>> Stashed changes
                            {sellerKPI.financialPerformance.outstandingCustomers}
                        </p>
                    </div>
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-normal text-lg">Outstanding-Vendors</p>
<<<<<<< Updated upstream
                        <p className="font-semibold text-blue-500 text-lg text-right">
=======
                        <p className="font-semibold text-blue-500 text-2xl text-right">
>>>>>>> Stashed changes
                        {sellerKPI.financialPerformance.outstandingVendors}
                        </p>
                    </div>
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-normal text-lg">Outstanding-Transport</p>
<<<<<<< Updated upstream
                        <p className="font-semibold text-blue-500 text-lg text-right">
=======
                        <p className="font-semibold text-blue-500 text-2xl text-right">
>>>>>>> Stashed changes
                            {sellerKPI.financialPerformance.outstandingTransport}
                        </p>
                    </div>
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-normal text-lg">Surplus-Revenue</p>
<<<<<<< Updated upstream
                        <p className="font-semibold text-blue-500 text-lg text-right">
=======
                        <p className="font-semibold text-blue-500 text-2xl text-right">
>>>>>>> Stashed changes
                            {((sellerKPI.financialPerformance.outstandingVendors + sellerKPI.financialPerformance.outstandingTransport) - sellerKPI.financialPerformance.outstandingCustomers) || 0}
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="sm:w-96 sm:rounded-r-lg w-full text-center font-medium text-white text-xl inline-block py-2" style={{ backgroundColor: "#045ab1" }}>
                    Customer's Performance
                </h2>

                <div className="text-base grid grid-cols-[repeat(auto-fill,_minmax(290px,_1fr))]">
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-normal text-lg">Total Coustomers</p>
<<<<<<< Updated upstream
                        <p className="font-semibold text-blue-500 text-lg text-right">
=======
                        <p className="font-semibold text-blue-500 text-2xl text-right">
>>>>>>> Stashed changes
                            {sellerKPI.customerPerformance.totalCust}
                        </p>
                    </div>
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-normal text-lg">Active Coustomers</p>
<<<<<<< Updated upstream
                        <p className="font-semibold text-blue-500 text-lg text-right">
=======
                        <p className="font-semibold text-blue-500 text-2xl text-right">
>>>>>>> Stashed changes
                            {sellerKPI.customerPerformance.totalActiveCust}
                        </p>
                    </div>
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-normal text-lg">inactive Coustomers</p>
<<<<<<< Updated upstream
                        <p className="font-semibold text-blue-500 text-lg text-right">
=======
                        <p className="font-semibold text-blue-500 text-2xl text-right">
>>>>>>> Stashed changes
                            {sellerKPI.customerPerformance.totalInactiveCust}
                        </p>
                    </div>
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-normal text-lg">Active Good Coustomers</p>
<<<<<<< Updated upstream
                        <p className="font-semibold text-blue-500 text-lg text-right">
=======
                        <p className="font-semibold text-blue-500 text-2xl text-right">
>>>>>>> Stashed changes
                            {sellerKPI.customerPerformance.totalGoodActiveCust}
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="sm:w-96 sm:rounded-r-lg w-full text-center font-medium text-white text-xl inline-block py-2" style={{ backgroundColor: "#045ab1" }}>
                    Vendor's Performance
                </h2>

                <div className="text-base grid grid-cols-[repeat(auto-fill,_minmax(290px,_1fr))]">
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
<<<<<<< Updated upstream
                        <p className="font-normal text-lg">Outstanding-Coustomers</p>
                        <p className="font-semibold text-blue-500 text-lg text-right">
=======
                        <p className="font-normal text-lg">Total Vendors</p>
                        <p className="font-semibold text-blue-500 text-2xl text-right">
>>>>>>> Stashed changes
                            {sellerKPI.vendorPerformance.totalVendor}
                        </p>
                    </div>
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
<<<<<<< Updated upstream
                        <p className="font-normal text-lg">Outstanding-Vendors</p>
                        <p className="font-semibold text-blue-500 text-lg text-right">
=======
                        <p className="font-normal text-lg">Active Vendors</p>
                        <p className="font-semibold text-blue-500 text-2xl text-right">
>>>>>>> Stashed changes
                            {sellerKPI.vendorPerformance.totalActiveVendor}
                        </p>
                    </div>
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
<<<<<<< Updated upstream
                        <p className="font-normal text-lg">Outstanding-Transport</p>
                        <p className="font-semibold text-blue-500 text-lg text-right">
=======
                        <p className="font-normal text-lg">inactive Vendors</p>
                        <p className="font-semibold text-blue-500 text-2xl text-right">
>>>>>>> Stashed changes
                            {sellerKPI.vendorPerformance.totalInactiveVendor}
                        </p>
                    </div>
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
<<<<<<< Updated upstream
                        <p className="font-normal text-lg">Surplus-Revenue</p>
                        <p className="font-semibold text-blue-500 text-lg text-right">
=======
                        <p className="font-normal text-lg">Active Good Vendors</p>
                        <p className="font-semibold text-blue-500 text-2xl text-right">
>>>>>>> Stashed changes
                            {sellerKPI.vendorPerformance.totalGoodActiveVendor}
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="sm:w-96 sm:rounded-r-lg w-full text-center font-medium text-white text-xl inline-block py-2" style={{ backgroundColor: "#045ab1" }}>
                    Current Month Statics
                </h2>

                <div className="text-base">
                    <div className='grid grid-cols-[repeat(auto-fill,_minmax(290px,_1fr))]'>
                        <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                            <p className="font-normal text-lg">Total Sale</p>
<<<<<<< Updated upstream
                            <p className="font-semibold text-blue-500 text-lg text-right">
                                {sellerKPI.monthStatics.totalSale}
=======
                            <p className="font-semibold text-blue-500 text-2xl text-right">
                                {(sellerKPI.monthStatics.totalSale || 0).toFixed(2)}
>>>>>>> Stashed changes
                            </p>
                        </div>
                        <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                            <p className="font-normal text-lg">Total Purchase</p>
<<<<<<< Updated upstream
                            <p className="font-semibold text-blue-500 text-lg text-right">
                                {sellerKPI.monthStatics.totalPurchase}
=======
                            <p className="font-semibold text-blue-500 text-2xl text-right">
                                {(sellerKPI.monthStatics.totalPurchase || 0).toFixed(2)}
>>>>>>> Stashed changes
                            </p>
                        </div>
                        <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                            <p className="font-normal text-lg">Total Tranport Cost</p>
<<<<<<< Updated upstream
                            <p className="font-semibold text-blue-500 text-lg text-right">
                            {sellerKPI.monthStatics.totalTransportCost}
=======
                            <p className="font-semibold text-blue-500 text-2xl text-right">
                            {(sellerKPI.monthStatics.totalTransportCost || 0).toFixed(2)}
>>>>>>> Stashed changes
                            </p>
                        </div>
                        <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                            <p className="font-normal text-lg">Total Profit</p>
<<<<<<< Updated upstream
                            <p className="font-semibold text-blue-500 text-lg text-right">
                            { (sellerKPI.monthStatics.totalSale - (sellerKPI.monthStatics.totalPurchase + sellerKPI.monthStatics.totalTransportCost)) || 0}
=======
                            <p className="font-semibold text-blue-500 text-2xl text-right">
                            { ((sellerKPI.monthStatics.totalSale - (sellerKPI.monthStatics.totalPurchase + sellerKPI.monthStatics.totalTransportCost)) || 0).toFixed(2)}
>>>>>>> Stashed changes
                            </p>
                        </div>
                    </div>
                    <div className='grid grid-cols-[repeat(auto-fill,_minmax(290px,_1fr))]'>
                        <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                            <p className="font-normal text-lg">Avg. Daily Sale</p>
<<<<<<< Updated upstream
                            <p className="font-semibold text-blue-500 text-lg text-right">
                            {sellerKPI.avgMonthStatics.avgTotalSale}
=======
                            <p className="font-semibold text-blue-500 text-2xl text-right">
                            {(sellerKPI.avgMonthStatics.avgTotalSale || 0).toFixed(2)}
>>>>>>> Stashed changes
                            </p>
                        </div>
                        <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                            <p className="font-normal text-lg">Avg. Daily Purchase</p>
<<<<<<< Updated upstream
                            <p className="font-semibold text-blue-500 text-lg text-right">
                            {sellerKPI.avgMonthStatics.avgTotalPurchase}
=======
                            <p className="font-semibold text-blue-500 text-2xl text-right">
                            {(sellerKPI.avgMonthStatics.avgTotalPurchase || 0).toFixed(2)}
>>>>>>> Stashed changes
                            </p>
                        </div>
                        <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                            <p className="font-normal text-lg">Avg. Daily Trasport Cost</p>
<<<<<<< Updated upstream
                            <p className="font-semibold text-blue-500 text-lg text-right">
                            {sellerKPI.avgMonthStatics.avgTotalTransportCost}
=======
                            <p className="font-semibold text-blue-500 text-2xl text-right">
                            {(sellerKPI.avgMonthStatics.avgTotalTransportCost || 0).toFixed(2)}
>>>>>>> Stashed changes
                            </p>
                        </div>
                        <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                            <p className="font-normal text-lg">Avg. Daily Profit</p>
<<<<<<< Updated upstream
                            <p className="font-semibold text-blue-500 text-lg text-right">
                            { (sellerKPI.avgMonthStatics.avgTotalSale - (sellerKPI.avgMonthStatics.avgTotalPurchase + sellerKPI.avgMonthStatics.avgTotalTransportCost)) || 0}
=======
                            <p className="font-semibold text-blue-500 text-2xl text-right">
                            { ((sellerKPI.avgMonthStatics.avgTotalSale - (sellerKPI.avgMonthStatics.avgTotalPurchase + sellerKPI.avgMonthStatics.avgTotalTransportCost)) || 0).toFixed(2)}
>>>>>>> Stashed changes
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SellerKPI;