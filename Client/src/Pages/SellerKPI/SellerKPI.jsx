import React from 'react';

function SellerKPI(props) {
    return (
        <div>
            <h1 className="text-3xl text-center font-medium my-3">Seller's KPI's</h1>

            <div>
                <h2 className="sm:w-96 w-full text-center font-medium text-white text-xl inline-block py-1" style={{ backgroundColor: "#045ab1" }}>
                    Financial Performance
                </h2>

                <div className="text-base grid grid-cols-[repeat(auto-fill,_minmax(290px,_1fr))]">
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-normal text-lg">Outstanding-Coustomers</p>
                        <p className="font-semibold text-blue-500 text-lg text-right">
                            18,15,263
                        </p>
                    </div>
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-normal text-lg">Outstanding-Vendors</p>
                        <p className="font-semibold text-blue-500 text-lg text-right">
                            18,15,263
                        </p>
                    </div>
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-normal text-lg">Outstanding-Transport</p>
                        <p className="font-semibold text-blue-500 text-lg text-right">
                            18,15,263
                        </p>
                    </div>
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-normal text-lg">Surplus-Revenue</p>
                        <p className="font-semibold text-blue-500 text-lg text-right">
                            18,15,263
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="sm:w-96 w-full text-center font-medium text-white text-xl inline-block py-1" style={{ backgroundColor: "#045ab1" }}>
                    Customer's Performance
                </h2>

                <div className="text-base grid grid-cols-[repeat(auto-fill,_minmax(290px,_1fr))]">
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-normal text-lg">Total Coustomers</p>
                        <p className="font-semibold text-blue-500 text-lg text-right">
                            263
                        </p>
                    </div>
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-normal text-lg">Active Coustomers</p>
                        <p className="font-semibold text-blue-500 text-lg text-right">
                            163
                        </p>
                    </div>
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-normal text-lg">inactive Coustomers</p>
                        <p className="font-semibold text-blue-500 text-lg text-right">
                            {263 - 163}
                        </p>
                    </div>
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-normal text-lg">Active Good Coustomers</p>
                        <p className="font-semibold text-blue-500 text-lg text-right">
                            150
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="sm:w-96 w-full text-center font-medium text-white text-xl inline-block py-1" style={{ backgroundColor: "#045ab1" }}>
                    Vendor's Performance
                </h2>

                <div className="text-base grid grid-cols-[repeat(auto-fill,_minmax(290px,_1fr))]">
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-normal text-lg">Outstanding-Coustomers</p>
                        <p className="font-semibold text-blue-500 text-lg text-right">
                            375
                        </p>
                    </div>
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-normal text-lg">Outstanding-Vendors</p>
                        <p className="font-semibold text-blue-500 text-lg text-right">
                            275
                        </p>
                    </div>
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-normal text-lg">Outstanding-Transport</p>
                        <p className="font-semibold text-blue-500 text-lg text-right">
                            {135 - 275}
                        </p>
                    </div>
                    <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                        <p className="font-normal text-lg">Surplus-Revenue</p>
                        <p className="font-semibold text-blue-500 text-lg text-right">
                            176
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="sm:w-96 w-full text-center font-medium text-white text-xl inline-block py-1" style={{ backgroundColor: "#045ab1" }}>
                    Sep 2024 Statics
                </h2>

                <div className="text-base">
                    <div className='grid grid-cols-[repeat(auto-fill,_minmax(290px,_1fr))]'>
                        <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                            <p className="font-normal text-lg">Total Sale</p>
                            <p className="font-semibold text-blue-500 text-lg text-right">
                                18,15,263
                            </p>
                        </div>
                        <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                            <p className="font-normal text-lg">Total Purchase</p>
                            <p className="font-semibold text-blue-500 text-lg text-right">
                                18,15,263
                            </p>
                        </div>
                        <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                            <p className="font-normal text-lg">Total Tranport Cost</p>
                            <p className="font-semibold text-blue-500 text-lg text-right">
                                18,15,263
                            </p>
                        </div>
                        <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                            <p className="font-normal text-lg">Total Profit</p>
                            <p className="font-semibold text-blue-500 text-lg text-right">
                                18,15,263
                            </p>
                        </div>
                    </div>
                    <div className='grid grid-cols-[repeat(auto-fill,_minmax(290px,_1fr))]'>
                        <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                            <p className="font-normal text-lg">Avg. Daily Sale</p>
                            <p className="font-semibold text-blue-500 text-lg text-right">
                                18,15,263
                            </p>
                        </div>
                        <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                            <p className="font-normal text-lg">Avg. Daily Purchase</p>
                            <p className="font-semibold text-blue-500 text-lg text-right">
                                18,15,263
                            </p>
                        </div>
                        <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                            <p className="font-normal text-lg">Avg. Daily Trasport Cost</p>
                            <p className="font-semibold text-blue-500 text-lg text-right">
                                18,15,263
                            </p>
                        </div>
                        <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                            <p className="font-normal text-lg">Avg. Daily Profit</p>
                            <p className="font-semibold text-blue-500 text-lg text-right">
                                18,15,263
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SellerKPI;