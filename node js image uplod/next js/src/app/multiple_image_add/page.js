"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function MultipleImageAdd() {
    const [formSubmit, setFormSubmit] = useState(false);
    const [frontImagePreview, setFrontImagePreview] = useState([]);
    const [backImagePreview, setBackImagePreview] = useState([]);

    // Handle Form Submission
    const submitHandler = (event) => {
        event.preventDefault();

        let form = event.target;
        let formData = new FormData(form);

        axios
            .post("http://localhost:5000/api/backend/two-image/add", formData)
            .then((result) => {
                if (result.data.success == true) {
                    setFormSubmit(true);
                    toast.success("Images uploaded successfully! 🎉");
                    setFrontImagePreview([]); // Clear preview after upload
                    setBackImagePreview([]);
                } else {
                    toast.error(result.data.message || "Something went wrong. ❌");
                }
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "Upload failed! ❌");
                console.error(error);
            });
    };

    // Handle Image Preview for Front & Back Images
    const fronthandleImageChange = (event, setPreview) => {
        const files = event.target.files;
        if (files.length > 5) {
            alert("You can only upload a maximum of 2 images.");
            event.target.value = ""; // Reset input field
            return;
        }

        if (files.length > 0) {
            const imageUrls = Array.from(files).map((file) => URL.createObjectURL(file));
            setPreview(imageUrls);
        }
    };
    const backhandleImageChange = (event, setPreview) => {
        const files = event.target.files;
        if (files.length > 7) {
            alert("You can only upload a maximum of 5 images.");
            event.target.value = ""; // Reset input field
            return;
        }

        if (files.length > 0) {
            const imageUrls = Array.from(files).map((file) => URL.createObjectURL(file));
            setPreview(imageUrls);
        }
    };
    useEffect(() => {

    }, [formSubmit])

    return (
        <div className="w-full flex flex-col items-center py-10 px-4">
            <ToastContainer position="top-right" autoClose={3000} />

            <form
                onSubmit={submitHandler}
                className="border p-6 flex flex-col gap-6 w-full max-w-lg shadow-lg rounded-md bg-white"
            >
                <h2 className="text-center text-xl font-bold text-blue-600">Upload Multiple Images</h2>

                {/* Name Input */}
                <label className="flex flex-col">
                    <span className="font-semibold mb-1">Name:</span>
                    <input
                        type="text"
                        name="name"
                        className="border w-full p-2 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name"
                        required
                    />
                </label>

                {/* Front Image Upload */}
                <label className="flex flex-col">
                    <span className="font-semibold mb-1">Front Images:</span>
                    <input
                        type="file"
                        name="frontImage"
                        className="border w-full p-2 rounded cursor-pointer"
                        accept="image/*"

                        multiple
                        onChange={(e) => fronthandleImageChange(e, setFrontImagePreview)}
                        required
                    />
                </label>

                {/* Front Image Previews */}
                {frontImagePreview.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto">
                        {frontImagePreview.map((src, index) => (
                            <img key={index} src={src} alt={`Front ${index}`} className="h-20 rounded border" />
                        ))}
                    </div>
                )}

                {/* Back Image Upload */}
                <label className="flex flex-col">
                    <span className="font-semibold mb-1">Back Images:</span>
                    <input
                        type="file"
                        name="backImage"
                        className="border w-full p-2 rounded cursor-pointer"
                        accept="image/*"
                        multiple
                        onChange={(e) => backhandleImageChange(e, setBackImagePreview)}
                        required
                    />
                </label>

                {/* Back Image Previews */}
                {backImagePreview.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto">
                        {backImagePreview.map((src, index) => (
                            <img key={index} src={src} alt={`Back ${index}`} className="h-20 rounded border" />
                        ))}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
