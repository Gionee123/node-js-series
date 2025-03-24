"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function AddImage() {
    const [fromSubmit, setfromSubmit] = useState(false) //fromSubmit – यह स्टेट यह ट्रैक करता है कि फॉर्म सबमिट हुआ या नहीं।



    // Handle form submission
    const submitHandler = (event) => {
        event.preventDefault();

        let form = event.target;
        let formData = new FormData(form); //FormData` बनाता है, जो फाइल अपलोड सपोर्ट करता है।

        axios.post("http://localhost:5000/api/backend/image/add", formData).then((result) => {
            console.log(result.data.success == true)
            if (result.data.success == true) {
                setfromSubmit(true)
                toast.success("Image uploaded successfully!"); // ✅ Success message

            }
            else {
                toast.error(result.data.message || "Something went wrong."); // ❌ Error message
            }
        }).catch((error) => {
            toast.error(error.response?.data?.message || "Upload failed!"); // ❌ Handle network error
            console.error(error);
        })
    };


    const [imagePreview, setImagePreview] = useState(null); //यह यूजर द्वारा चुनी गई इमेज का प्रीव्यू दिखाने के लिए इस्तेमाल होता है।


    //इमेज प्रीव्यू हैंडलर (handleImageChange)
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file)); // // चुनी गई इमेज का URL बनाता है।
        }
    };

    useEffect(() => {

    }, [fromSubmit])
    return (
        <div className="w-full flex flex-col items-center  ">
            <ToastContainer position="top-right" autoClose={3000} />

            <form onSubmit={submitHandler} className="border p-4 flex flex-col gap-4 w-96 shadow-lg rounded-md">
                <label className="flex flex-col">
                    <span className="font-semibold mb-1">Name:</span>
                    <input type="text" name="name" className="border w-full p-2 rounded" placeholder="Enter your name" required />
                </label>

                <label className="flex flex-col">
                    <span className="font-semibold mb-1">File:</span>
                    <input type="file" name="imageUrl" className="border w-full p-2 rounded" accept="image/*"

                        onChange={handleImageChange}

                        required />
                </label>

                {/* Image preview */}
                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-40  rounded border"
                    />
                )}
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    submit
                </button>

                {/* Upload message */}
            </form>
        </div>
    );
}
