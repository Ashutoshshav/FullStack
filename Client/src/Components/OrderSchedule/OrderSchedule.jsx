import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OrderSchedule({ onChangeSchedule }) {
    let token = localStorage.getItem("token");
    const [deliveryDate, setDeliveryDate] = useState("DD-MON-YYYY")
    let fetchDeliveryDate = async () => {
        try {
            let response = await axios.get("http://localhost:3000/api/order/deliverySchedules", {
                headers: {
                  Authorization: `${token}`,
                },
              })
            // console.log(response.data.deliveryTimes)
            setDeliveryDate(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    let setSchedule = async (id) => {
        await onChangeSchedule(id)
    }

    useEffect(() => {
        fetchDeliveryDate()
    }, [])
    return (
        <div className='mt-3'>
            <h2 className="sm:w-96 w-full text-center font-medium text-white text-xl inline-block py-1" style={{ backgroundColor: "#045ab1" }}>
                Schedule Your Order
            </h2>
            <br />
            <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3">
                <p className="font-semibold text-xl">Order Date</p>
                <p className="font-semibold text-blue-500 text-xl pl-10">
                    {deliveryDate.deliveryDate}
                </p>
            </div>

            <div className="text-base flex flex-wrap">
                {deliveryDate.deliveryTimes &&
                    deliveryDate.deliveryTimes.map((item, count = 0) => (
                        <div className="inline-block flex-col border-2 rounded-lg my-3 mx-2 px-3 cursor-pointer" key={item.id} onClick={() => setSchedule(item.id)}>
                            <p className="font-semibold text-xl">Delivery Schedule</p>
                            <p className="font-semibold text-blue-500 text-lg pl-10">
                                Between {item.startTime} - {item.endTime}
                            </p>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default OrderSchedule;