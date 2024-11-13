import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from "moment";

function SiteImages(props) {
    const token = localStorage.getItem('token');
    const [images, setImage] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get(`/api/work/site-image`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setImage(response.data);
                // console.log(response.data);
                
            } catch (error) {
                console.error("Error fetching image:", error);
            }
        };

        fetchImage();
    }, []);
    return (
        <div className='pointer-events-auto w-screen mx-auto px-4'>
            <div className='flow-root'>
                <ul className=''>
                    <li className='grid gap-3 justify-items-center grid-cols-[repeat(auto-fill,_minmax(290px,_1fr))]'>
                        {images && images.length > 0 ? (
                            images.map(img => (
                                <div key={img.id} className='p-4 border border-gray-200 rounded-lg'>
                                    <img src={img.image} alt={`Employee ${img.id}`} className='w-full h-auto max-w-xs' />
                                    <p>{img.employeeName}</p>
                                    <p>{moment(img.entryDTime).format("Do, MMM, YYYY, HH:mm:ss A")}</p>
                                    <p>{img.siteLocation}</p>
                                </div>
                            ))
                        ) : (
                            <p>No images found.</p>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default SiteImages;