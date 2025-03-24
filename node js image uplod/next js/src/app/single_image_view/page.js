"use client"
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import axios from 'axios';


export default function Single_image() {
    const [categories, setCategories] = useState([]); // API से डेटा स्टोर करने के लिए।
    const [imagepath, setimagepath] = useState(null); // इमेज का बेस URL स्टोर करने के लिए।
    console.log(categories.frontImage
    )
    useEffect(() => {
        axios
            .post("http://localhost:5000/api/backend/image/view")
            .then((response) => {
                console.log(response.data.imagepath)
                if (response.data.success) {
                    setCategories(response.data.data);  // API से मिली इमेज लिस्ट सेट करें।
                    setimagepath(response.data.imagepath);  // API से मिला इमेज पाथ सेट करें।

                }
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);
    return (
        <>
            <div className="w-full bg-amber-400 max-h-screen overflow-auto py-6">
                <h1 className="text-center text-[35px] font-bold text-red-600 py-4 uppercase tracking-wide">
                    Single Image View - Node.js API
                </h1>

                <div className="max-w-[95%] mx-auto">
                    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
                        {categories.length > 0 ? (
                            categories.map((v, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl"
                                >
                                    <img
                                        src={imagepath + v.imageUrl}
                                        alt={v.name}
                                        className="h-[200px] w-full "
                                    />
                                    <div className="p-4 text-center">
                                        <h2 className="text-lg font-semibold text-[15px] text-gray-900">{v.name}</h2>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-700 text-lg font-medium col-span-full">
                                No categories found
                            </p>
                        )}
                    </div>
                </div>
            </div>

        </>
    )
}
