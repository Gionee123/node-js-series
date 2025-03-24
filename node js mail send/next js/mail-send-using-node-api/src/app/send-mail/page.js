"use client"
import axios from 'axios';
import React, { useState } from 'react'
import { ToastContainer, toast } from "react-toastify";

export default function Send_mail() {



    let handleSubmit = (event) => {
        event.preventDefault();
        let dataSave = {
            name: event.target.name.value,
            email: event.target.email.value,
            message: event.target.message.value,
        }

        axios.post("http://localhost:5000/api/frontend/users/send-mail", dataSave).then((result) => {

            toast.success(result.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            })
            console.log(result.data.message)


        }).catch((err) => {
            console.error("Axios Error:", error);
            toast.error("❌ Failed to send email. Please try again.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        })
        event.target.reset();

    }

    return (
        <>

            <>
                <div className='  h-screen bg-gray-100'>
                    <h1 className='text-center font-medium text-[35px] text-[red] py-[12px]'>send mail to using node js api</h1>
                    <div className="flex items-center justify-center">
                        <ToastContainer /> {/* ✅ Toastify Component */}

                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Send an Email</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"

                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Recipient Email"

                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <textarea
                                    name="message"
                                    placeholder="Your Message"

                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                                ></textarea>
                                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                                    Send Email
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            </>

        </>
    )
}
