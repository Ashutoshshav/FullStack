import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import CustomerContext from '../../Contexts/CustomerContext/CustomerContext';
import Customer from '../Customer/Customer';
import OrderSchedule from '../../Components/OrderSchedule/OrderSchedule';

function Home() {
    const navigate = useNavigate();

    let token = localStorage.getItem("token");

    const [data, setData] = useState(null)
    const [count, setCount] = useState([]);
    // const [tableShow, setTableShow] = useState(0);
    const [showOrderSchedule, setShowOrderSchedule] = useState(false)
    let [selectedSchedule, setSelectedSchedule] = useState(null)
    const [errorMsg, setErrorMsg] = useState({});

    let decreaseCount = async (SKUID, SKUName, Qty) => {
        //console.log(Cust_ID, SKUID, Qty)
        try {
            let response = await axios.post("http://localhost:3000/api/cart/remove", { SKUID, SKUName, Qty }, {
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
            let response = await axios.post("http://localhost:3000/api/cart/insert", { SKUID, SKUName, Qty }, {
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
            let response = await axios.get("http://localhost:3000/api/cart/productQty", {
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
                let response = await axios.post("http://localhost:3000/api/order/submitOrder", {count, selectedSchedule }, {
                    headers: {
                      Authorization: `${token}`,
                    },
                })
            } else {
                setErrorMsg({ errorForSchedule: "First Select Sutable Schedule" })
            }
        } catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                let response = await axios.get("http://localhost:3000/getProduct")
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
        <div>
            {
                errorMsg.errorForSchedule ? <p className="text-red-500 text-lg text-center">{errorMsg.errorForSchedule}</p> : ""
            }
            {
                showOrderSchedule ? <OrderSchedule onChangeSchedule={setSelectedSchedule} /> : null
            }

            <h2 className='sm:w-96 w-full text-center font-medium text-white text-xl inline-block py-1' style={{ backgroundColor: "#045ab1" }}>Select Your Product</h2>

            <div className="grid justify-items-center grid-cols-[repeat(auto-fill,_minmax(290px,_1fr))]">
                {data &&
                    data.map(product => (
                        <div className="flex border-2 rounded-lg m-3 items-center h-32" style={{ border: "#045ab1 1px solid" }} key={product.SKUID}>
                            <div className="w-1/3 m-1">
                                <img className='h-full w-full'
                                    src={product.Picture}
                                    alt=""
                                />
                            </div>
                            <div className="w-2/3 text-center flex flex-col">
                                <p className="font-semibold text-xl">{product.SKUName}</p>
                                <div className='bg-gray-100 flex justify-evenly items-center rounded-lg font-semibold w-auto'>
                                    <span className='py-3 rounded-full flex items-center justify-center cursor-pointer text-black font-semibold w-1/3' onClick={() => decreaseCount(product.SKUID, product.SKUName, count.Qty + 1)}><i className="fa-solid fa-minus"></i></span>
                                    {count.map((item) => {
                                        if (item.SKUID === product.SKUID) {
                                            return (<p key={item.SKUID} className='w-1/3 text-center'>{item.Qty}</p>);
                                        }
                                        return null;
                                    })}
                                    {/* <span className='text-xl mx-1 w-10 text-center'>{count.Qty ? count.Qty : "Add"}</span> */}
                                    <span className='py-3 rounded-full flex items-center justify-center cursor-pointer text-black w-1/3' onClick={() => increaseCount(product.SKUID, product.SKUName, count.Qty + 1)}><i className="fa-solid fa-plus"></i></span>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className="">
                <div className="mt-7">
                    <h2 className="sm:w-96 w-full text-center font-medium text-white text-xl inline-block py-1" style={{ backgroundColor: "#045ab1" }}>
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
                                {count &&
                                    count.map((item, count = 1) => {
                                        return (
                                            <tr key={item.SKUID}>
                                                <td className="py-2 px-4 border">{count += 1}</td>
                                                <td className="py-2 px-4 border">{item.SKUName}</td>
                                                <td className="py-2 px-4 border">{item.Qty}</td>
                                                <td className="py-2 px-4 border">Kg.</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="sm:flex text-base justify-center">
                        <button className="sm:w-auto w-full py-2 px-20 font-semibold text-lg rounded-3xl text-white m-3" style={{ backgroundColor: "#045ab1" }}>Edit</button>
                        <button className="sm:w-auto w-full py-2 px-20 font-semibold text-lg rounded-3xl text-white m-3" style={{ backgroundColor: "#045ab1" }}  onClick={handleSubmitOrder}>Save</button>
                    </div>
                </div>
            </div>

            {/* {
                tableShow ? <Customer key={tableShow} schedule={selectedSchedule}/> : null
            } */}
        </div>
    );
}

export default Home;