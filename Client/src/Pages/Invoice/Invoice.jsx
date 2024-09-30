import React from "react";

function Invoice(props) {
    return (
        <div>
            <h1 className="text-3xl text-center font-medium my-3">Seller Invoicing - Form</h1>

            <div>
                <h2 className="sm:w-96 w-full text-center font-medium text-white text-xl inline-block py-1" style={{backgroundColor: "#045ab1"}}>
                    Delivery Order Schedule
                </h2>

                <div className="text-base flex flex-wrap">
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-semibold text-xl">Order Date</p>
                        <p className="font-semibold text-blue-500 text-xl pl-10">
                            DD-MON-YYYY
                        </p>
                    </div>
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-semibold text-xl">Delivery Schedule</p>
                        <p className="font-semibold text-blue-500 text-xl pl-10">
                            Between HH-MM AM
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-7">
                <h2 className="sm:w-96 w-full text-center font-medium text-white text-xl inline-block py-1" style={{backgroundColor: "#045ab1"}}>
                    Item Cart and Qty Rate Entry
                </h2>

                <div className="overflow-x-auto mt-2">
                    <table className="min-w-full border border-gray-200">
                        <thead>
                            <tr className="text-white" style={{backgroundColor: "#045ab1"}}>
                                <th className="py-2 px-4 border">SNo.</th>
                                <th className="py-2 px-4 border">Item Name</th>
                                <th className="py-2 px-4 border">Qty</th>
                                <th className="py-2 px-4 border">Unit</th>
                                <th className="py-2 px-4 border">Rate</th>
                                <th className="py-2 px-4 border">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-2 px-4 border">1</td>
                                <td className="py-2 px-4 border">Item_1</td>
                                <td className="py-2 px-4 border">10</td>
                                <td className="py-2 px-4 border">Kg.</td>
                                <td className="py-2 px-4 border">120</td>
                                <td className="py-2 px-4 border">{10 * 120}</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border">2</td>
                                <td className="py-2 px-4 border">Item_2</td>
                                <td className="py-2 px-4 border">12</td>
                                <td className="py-2 px-4 border">Kg.</td>
                                <td className="py-2 px-4 border">125</td>
                                <td className="py-2 px-4 border">{12 * 125}</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 text-right" colspan="3">Total Amount</td>
                                <td className="py-2 px-4 text-left" colspan="3">{1200 + 1500}</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 text-right" colspan="3">Transport</td>
                                <td className="py-2 px-4 text-left" colspan="3">{300}</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 text-right" colspan="3">Net Payable Amount</td>
                                <td className="py-2 px-4 text-left" colspan="3">{1200 + 1500 + 300}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="sm:flex text-base justify-center">
                <button className="sm:w-auto w-full py-2 px-20 font-semibold text-lg rounded-3xl text-white m-3" style={{backgroundColor: "#045ab1"}}>Save</button>
                <button className="sm:w-auto w-full py-2 px-20 font-semibold text-lg rounded-3xl text-white m-3" style={{backgroundColor: "#045ab1"}}>Send Invoice</button>
            </div>
        </div>
    );
}

export default Invoice;
