"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';

export default function Course_view() {
    const [searchQuery, setSearchQuery] = useState({
        name: "",
        duration: "",
    })
    const [searchType, setSearchType] = useState("name"); // ✅ Fixed: Defined useState


    const [courses, setCourses] = useState([]);


    const handleSearch = () => {


        let searchdata = {
            name: searchType === "name" || searchType === "both" ? searchQuery.name : "",
            duration: searchType === "duration" || searchType === "both" ? searchQuery.duration : "",
        };
        axios
            .post("http://localhost:5000/api/backend/courses/search", searchdata)
            .then((response) => {
                if (response.data.status == true) {
                    setCourses(response.data.data);
                } else {
                    setCourses([]);
                    toast.error(response.data.message);
                }
            })
            .catch((err) => {
                console.error("Search Error:", err);
                toast.error(err.response?.data?.message || "Something went wrong!");
            });
    };
    useEffect(() => {
        axios.post('http://localhost:5000/api/backend/courses/view')
            .then((response) => {
                console.log(response.data)
                if (response.data.status == true) {
                    setCourses(response.data.data)

                }
                else {
                    setCourses([])
                }                // setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                // setLoading(false);
            });
    }, [searchQuery]);




    return (
        <div className="flex justify-center">
            <ToastContainer position="top-right" autoClose={100} />

            <div className="w-full max-w-6xl">
                <div className="bg-white shadow overflow-hidden rounded-lg">
                    <div className='flex items-center gap-2'>
                        {/* Search Type Dropdown */}
                        <div className="relative">
                            <select
                                className="appearance-none h-full rounded-lg border border-gray-300 bg-gray-100 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                aria-label="Search by"
                            >
                                <option value="name">Name</option>
                                <option value="duration">Duration</option>
                                <option value="both">Both</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>

                        {/* Conditional Input Fields */}
                        {(searchType === 'name' || searchType === 'both') && (
                            <div className="flex items-center border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                                <input
                                    type="text"
                                    placeholder="Search by name"
                                    className="outline-none px-3 py-2 w-64"
                                    value={searchQuery.name}
                                    onChange={(e) => setSearchQuery({ ...searchQuery, name: e.target.value })}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                />
                            </div>
                        )}

                        {(searchType === 'duration' || searchType === 'both') && (
                            <div className="flex items-center border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                                <input
                                    type="text"
                                    placeholder="Search by duration"
                                    className="outline-none px-3 py-2 w-64"
                                    value={searchQuery.duration}
                                    onChange={(e) => setSearchQuery({ ...searchQuery, duration: e.target.value })}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                />
                            </div>
                        )}

                        {/* Search Button */}
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">


                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">name</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">image</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">price</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">duration</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">description</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">order</th>

                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {courses.length > 0 ? courses.map((value, index) => (
                                <tr key={index}>
                                    <td>

                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                        <div className='w-[100px] overflow-auto '>
                                            {value.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                        {value.image}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                        ${value.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                        ${value.duration}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                        ${value.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                        ${value.order}
                                    </td>


                                </tr>

                            )) : <tr>
                                <td colSpan="10" className="text-center py-8 text-gray-500">
                                    No courses found. Add a new course to get started.
                                </td>
                            </tr>}
                        </tbody>
                    </table>
                </div>
            </div >
        </div >)
}
