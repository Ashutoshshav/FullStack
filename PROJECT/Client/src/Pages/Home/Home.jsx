import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import CustomerContext from '../../Contexts/CustomerContext/CustomerContext';
import Customer from '../Customer/Customer';
import OrderSchedule from '../../Components/OrderSchedule/OrderSchedule';
import Swal from 'sweetalert2';

function Home() {
    const navigate = useNavigate();

    let token = localStorage.getItem("token");

    if(!token) {
        navigate("/Login")
    }

    const [data, setData] = useState(null)
    const [count, setCount] = useState([]);
    // const [tableShow, setTableShow] = useState(0);
    const [showOrderSchedule, setShowOrderSchedule] = useState(false)
    let [selectedSchedule, setSelectedSchedule] = useState(null)
    const [errorMsg, setErrorMsg] = useState({});

    let decreaseCount = async (SKUID, SKUName, Qty) => {
        //console.log(Cust_ID, SKUID, Qty)
        try {
            let response = await axios.post("http://192.168.0.252:3000/api/cart/remove", { SKUID, SKUName, Qty }, {
                headers: {
                    Authorization: `${token}`,
                },
            })
            // console.log(response.data)
            fetchCartQty()
            // setTableShow(prevKey => prevKey + 1)
            setShowOrderSchedule(true)
        } catch (e) {
            console.log(e)
        }
    }

    let increaseCount = async (SKUID, SKUName, Qty) => {
        try {
            console.log(SKUID, Qty)
            let response = await axios.post("http://192.168.0.252:3000/api/cart/insert", { SKUID, SKUName, Qty }, {
                headers: {
                    Authorization: `${token}`,
                },
            })
            //setCount(count.Qty + 1)
            //console.log(response.data)
            fetchCartQty()
            // setTableShow(prevKey => prevKey + 1)
            setShowOrderSchedule(true)
        } catch (e) {
            console.log(e)
        }
    }
    // console.log(token)
    let fetchCartQty = async () => {
        try {
            let response = await axios.get("http://192.168.0.252:3000/api/cart/productQty", {
                headers: {
                    Authorization: `${token}`,
                },
            })

            // console.log(response.data.data)
            // console.log(token)
            let Datas = response.data.data;

            setCount(Datas)
            // setTableShow(prevKey => prevKey + 1)
            setShowOrderSchedule(true)
            // console.log(count)
        } catch (e) {
            console.log(e)
        }
    }

    let handleSubmitOrder = async () => {
        try {
            console.log(count)
            console.log(selectedSchedule)
            if(selectedSchedule) {
                let response = await axios.post("http://192.168.0.252:3000/api/order/submitOrder", {count, selectedSchedule }, {
                    headers: {
                        Authorization: `${token}`,
                    },
                })
                if (response.status === 200) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Order Saved Successfully",
                    showConfirmButton: false,
                    timer: 2000,
                    customClass: {
                        popup: 'p-6 bg-gray-100 rounded-lg shadow-xl',     // Popup styling
                        title: 'text-xl font-semibold text-gray-700',      // Title styling
                        htmlContainer: 'text-sm text-gray-600',            // Text inside the popup
                        confirmButton: 'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700' // Confirm button styling
                    }
                });
                }
            } else {
                Swal.fire({
                    title: 'First Select Delivery Schedule From Top',  // Message
                    icon: 'warning',                         // Optional, you can add an icon like 'warning'
                    customClass: {
                        popup: 'p-6 bg-white rounded-lg shadow-xl',   // Popup styling
                        title: 'text-xl font-semibold text-gray-700', // Title styling
                    }
                });                
            }
        } catch(err) {
            console.log(err)
        }
    }

    let handleDeleteOrder = async () => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You want to Delete Order",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Delete!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let response = await axios.get("http://192.168.0.252:3000/api/order/deleteOrder", {
                        headers: {
                            Authorization: `${token}`,
                        },
                    })
                    if(response.status === 200) {
                        await Swal.fire({
                            title: "Deleted!",
                            text: "You have Successfully Deleted Order.",
                            icon: "success",
                            timer: 2000,
                        });
                        window.location.reload();
                    }
                }
            });
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                let response = await axios.get("http://192.168.0.252:3000/getProduct")
                //console.log(response.data)
                setData(response.data)
                fetchCartQty()
            } catch (e) {
                console.log(e);
            }
        }

        fetchData()
    }, [])
    return (
<<<<<<< Updated upstream:PROJECT/Client/src/Pages/Home/Home.jsx
<<<<<<< Updated upstream
        <div className="bg-gray-50 min-h-screen">
=======
        <div className="min-h-screen">
>>>>>>> Stashed changes
=======
        <div className="min-h-screen">
>>>>>>> Stashed changes:Client/src/Pages/Home/Home.jsx
            {errorMsg.errorForSchedule && (
                <p className="text-red-500 text-lg text-center">{errorMsg.errorForSchedule}</p>
            )}
            {showOrderSchedule && <OrderSchedule onChangeSchedule={setSelectedSchedule} />}

            <h2 className='sm:w-96 sm:rounded-r-lg w-full text-center font-medium text-white text-xl inline-block py-2' style={{ backgroundColor: "#045ab1" }}>
                Select Your Product
            </h2>

            <div className="grid justify-items-center grid-cols-[repeat(auto-fill,_minmax(290px,_1fr))]">
                {data && data.map(product => (
                    <div className="flex border-2 rounded-lg m-3 items-center h-32 shadow-lg hover:shadow-xl transition-shadow" style={{ border: "#045ab1 1px solid" }} key={product.SKUID}>
                        <div className="w-1/3 h-fit m-1 overflow-hidden rounded-lg">
                            <img className='h-full w-full object-cover' src={product.Picture} alt={product.SKUName} />
                        </div>
                        <div className="w-2/3 text-center flex flex-col">
                            <p className="font-semibold text-xl">{product.SKUName}</p>
                            <div className='bg-gray-100 flex justify-evenly items-center rounded-lg font-semibold w-auto'>
                                <span className='py-3 rounded-full flex items-center justify-center cursor-pointer text-black font-semibold w-1/3 hover:bg-blue-200 active:bg-blue-300 transition-colors' onClick={() => decreaseCount(product.SKUID, product.SKUName, count.Qty + 1)}>
                                    <i className="fa-solid fa-minus"></i>
                                </span>
                                {count.map((item) => item.SKUID === product.SKUID && (
                                    <p key={item.SKUID} className='w-1/3 text-center'>{item.Qty}</p>
                                ))}
                                <span className='py-3 rounded-full flex items-center justify-center cursor-pointer text-black w-1/3 hover:bg-blue-200 active:bg-blue-300 transition-colors' onClick={() => increaseCount(product.SKUID, product.SKUName, count.Qty + 1)}>
                                    <i className="fa-solid fa-plus"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="">
                <h2 className="sm:w-96 sm:rounded-r-lg w-full text-center font-medium text-white text-xl inline-block py-2" style={{ backgroundColor: "#045ab1" }}>
                    Item Cart and Qty Selection
                </h2>
                <div className="overflow-x-auto mt-2">
                    <table className="min-w-full border border-gray-200">
                        <thead>
                            <tr className="text-white" style={{ backgroundColor: "#045ab1" }}>
                                <th className="py-2 px-4 border">SNo.</th>
                                <th className="py-2 px-4 border">Item Name</th>
                                <th className="py-2 px-4 border">Qty</th>
                                <th className="py-2 px-4 border">Unit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {count && count.map((item, index) => (
                                <tr key={item.SKUID}>
                                    <td className="py-2 px-4 border">{index + 1}</td>
                                    <td className="py-2 px-4 border">{item.SKUName}</td>
                                    <td className="py-2 px-4 border text-center">{item.Qty}</td>
                                    <td className="py-2 px-4 border">Kg.</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="sm:flex text-base gap-4 justify-center mt-3">
<<<<<<< Updated upstream:PROJECT/Client/src/Pages/Home/Home.jsx
<<<<<<< Updated upstream
                    <button className="sm:w-auto w-full py-2 px-20 font-semibold bg-blue-600 text-lg rounded-3xl text-white m-0 my-3 transition-colors hover:bg-blue-800 active:bg-blue-900">Edit</button>
=======
                    <button className="sm:w-auto w-full py-2 px-20 font-semibold bg-blue-600 text-lg rounded-3xl text-white m-0 my-3 transition-colors hover:bg-blue-800 active:bg-blue-900" onClick={handleDeleteOrder}>Delete</button>
>>>>>>> Stashed changes
=======
                    <button className="sm:w-auto w-full py-2 px-20 font-semibold bg-blue-600 text-lg rounded-3xl text-white m-0 my-3 transition-colors hover:bg-blue-800 active:bg-blue-900" onClick={handleDeleteOrder}>Delete</button>
>>>>>>> Stashed changes:Client/src/Pages/Home/Home.jsx
                    <button className="sm:w-auto w-full py-2 px-20 font-semibold bg-blue-600 text-lg rounded-3xl text-white m-0 my-3 transition-colors hover:bg-blue-800 active:bg-blue-900" onClick={handleSubmitOrder}>Save</button>
                </div>
            </div>
        </div>
    );
}

export default Home;