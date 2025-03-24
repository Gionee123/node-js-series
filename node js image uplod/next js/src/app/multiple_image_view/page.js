"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from 'react-slick';
export default function Multiple_image_view() {
    const [categories, setCategories] = useState([]); // API से डेटा स्टोर करने के लिए।
    const [imagepath, setimagepath] = useState(null); // इमेज का बेस URL स्टोर करने के लिए।
    console.log(categories.frontImage
    )
    useEffect(() => {
        axios
            .post("http://localhost:5000/api/backend/two-image/view")
            .then((response) => {
                console.log(response.data.imagepath)
                if (response.data.success) {
                    setCategories(response.data.data);  // API से मिली इमेज लिस्ट सेट करें।
                    setimagepath(response.data.imagepath);  // API से मिला इमेज पाथ सेट करें।

                }
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    var settings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1024, // Large Screens (Below 1024px)
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768, // Tablets (Below 768px)
                settings: {
                    slidesToShow: 1,
                },
            },
            {
                breakpoint: 480, // Mobile (Below 480px)
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    }
    return (
        <div className="w-full max-h-screen bg-gray-100 py-10 px-4 overflow-auto">
            <h1 className="text-center text-3xl md:text-4xl font-bold text-blue-600 mb-6 uppercase">
                Multiple Image View
            </h1>

            <div className="w-[100%] overflow-auto mx-auto">
                <div className="max-w-[95%] mx-auto">
                    {categories.length > 0 ? (
                        categories.map((category, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300"
                            >
                                {/* Category Name */}
                                <h2 className="text-center text-lg font-semibold text-gray-800 py-3 bg-blue-100 rounded-t-lg">
                                    {category.name}
                                </h2>

                                {/* Image Gallery */}
                                <div className=" ">
                                    <div className="">
                                        <h2 className='text-center text-[25px] font-medium'>fronted image</h2>
                                        {/* Front Images */}
                                        <Slider {...settings}>
                                            {category.frontImage.map((img, i) => (
                                                <div key={i}> {/* Each image must be in its own div for proper sliding */}
                                                    <img
                                                        src={imagepath + img}
                                                        alt={`Front ${i}`}
                                                        className="h-40 w-full p-3 border border-gray-300 rounded-lg"
                                                    />
                                                </div>
                                            ))}
                                        </Slider>


                                    </div>

                                    {/* Back Images */}
                                    <div className="">
                                        <h2 className='text-center text-[25px] font-medium'>backend image</h2>
                                        <Slider {...settings}>

                                            {category.backImage.map((img, i) => (
                                                <div key={i}>

                                                    <img
                                                        src={imagepath + img}
                                                        alt={`Back ${i}`}
                                                        className="h-40 w-full p-3 border border-gray-300 rounded-lg"
                                                    />
                                                </div>

                                            ))}
                                        </Slider>

                                    </div>
                                </div>

                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600 text-lg font-medium col-span-full">
                            No categories found
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
