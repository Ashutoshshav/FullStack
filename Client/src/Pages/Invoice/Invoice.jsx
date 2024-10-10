import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

function Invoice(props) {
    const navigate = useNavigate();
    let token = localStorage.getItem("token");

    const [deliveryDetails, setDeliveryDetails] = useState({
        OrderDate: '',
        startTime: '',
        endTime: '',
        custInvoicedOrder: [],
        Total_Amount: 0,
        error: "",
    })
    const [errorMsg, setErrorMsg] = useState("");

    let fetchDeliveryDetails = async () => {
        try {
            let response = await axios.get("http://192.168.0.252:3000/api/invoice/generated", {
                headers: {
                    Authorization: `${token}`,
                },
            })
            if(response.data.error) {
                setErrorMsg("Invoice will generate soon")
            } else {
            }
            console.log(response.data)
            // console.log(response.data.custInvoicedOrder)
            setDeliveryDetails(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    const downloadInvoice = async () => {
        try {
            const response = await axios.get('http://192.168.0.252:3000/api/invoice/generateInvoice', {
              responseType: 'blob', // Important to get the PDF as a binary file (blob)
              headers: {
                Authorization: `${token}`,
            },
            },);
      
            const fileURL = window.URL.createObjectURL(new Blob([response.data]));
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', 'invoice.pdf'); // File name
            document.body.appendChild(fileLink);
            fileLink.click(); // Trigger the download
          } catch (err) {
            console.error('Error downloading the PDF:', err);
        }
    }

    useEffect(() => {
        if (!token) {
            navigate("/Login")
        } else {
            fetchDeliveryDetails()
        }
    }, [token])

    return (
        <div>
            <div>
                <h1 className="text-3xl text-center font-medium my-3">Seller Invoicing - Form</h1>
                <h2 className="sm:w-96 sm:rounded-r-lg w-full text-center font-medium text-white text-xl inline-block py-2" style={{ backgroundColor: "#045ab1" }}>
                    Delivery Order Schedule
                </h2>

                <div className="text-base flex flex-wrap">
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-semibold text-xl">Order Date</p>
                        <p className="font-semibold text-blue-500 text-xl pl-10">
                            {deliveryDetails.OrderDate}
                        </p>
                    </div>
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-semibold text-xl">Delivery Schedule</p>
                        <p className="font-semibold text-blue-500 text-xl pl-10">
                            Between {deliveryDetails.startTime} To {deliveryDetails.endTime}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-7">
                <h2 className="sm:w-96 sm:rounded-r-lg w-full text-center font-medium text-white text-xl inline-block py-2" style={{ backgroundColor: "#045ab1" }}>
                    Item Cart and Qty Rate Entry
                </h2>

                <div className="overflow-x-auto mt-2">
                    <table className="min-w-full border border-gray-200">
                        <thead>
                            <tr className="text-white" style={{ backgroundColor: "#045ab1" }}>
                                <th className="py-2 px-4 border">SNo.</th>
                                <th className="py-2 px-4 border">Item Name</th>
                                <th className="py-2 px-4 border">Qty</th>
                                {/* <th className="py-2 px-4 border">Unit</th> */}
                                <th className="py-2 px-4 border">Rate</th>
                                <th className="py-2 px-4 border">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveryDetails.custInvoicedOrder && deliveryDetails.custInvoicedOrder.map((item, index) => (
                                <tr key={item.SKUID}>
                                    <td className="py-2 px-4 border">{index + 1}</td>
                                    <td className="py-2 px-4 border">{item.SKUName}</td>
                                    <td className="py-2 px-4 border">{item.Qty}</td>
                                    <td className="py-2 px-4 border">{item.Rate}</td>
                                    <td className="py-2 px-4 border">{item.Amount}</td>
                                </tr>
                            ))}
                            <tr>
                                <td className="py-2 px-4 text-center font-semibold text-xl" colSpan={5}><span className="font-bold">Total Amount  :  </span>{deliveryDetails.Total_Amount}</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 text-center text-xl font-normal" colSpan={5}><span>Transport  :  </span>{300}</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 text-center font-semibold text-2xl" colSpan={5}><span>Net Payable Amount  :  </span>{deliveryDetails.Total_Amount + 300}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="sm:flex text-base gap-3 justify-center">
                <button className="sm:w-auto w-full py-2 px-20 font-semibold text-lg rounded-3xl text-white my-3" style={{ backgroundColor: "#045ab1" }}>Save</button>
                <button className="sm:w-auto w-full py-2 px-20 font-semibold text-lg rounded-3xl text-white my-3" style={{ backgroundColor: "#045ab1" }} onClick={downloadInvoice}>Send Invoice</button>
            </div>
        </div>
    );
}

export default Invoice;
