"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Course_view() {
    const [courses, setCourses] = useState([]);
    const [deleteplusstatuschange, setdeleteplusstatuschange] = useState(false); //delete aur status change  both same use
    const [multiidsget, setmultiidsget] = useState([]); // mutiple ids get fors multiple delete
    const [pageNumber, setPageNumber] = useState(1); // वर्तमान पेज नंबर को ट्रैक करता है (शुरुआत में 1)
    const [totalLen, setTotalLen] = useState(0); // कुल रिकॉर्ड की संख्या को स्टोर करता है
    const [limit, setLimit] = useState(5); //प्रत्येक पेज पर कितने रिकॉर्ड दिखाने हैं

    let changePageNumber = (para) => {
        if (para === "First") {
            // Go to first page
            setPageNumber(1); // पहले पेज पर जाओ
        } else if (para === "Previous") {
            // Go to previous page, but don't go below 1
            setPageNumber(pageNumber - 1); // पिछले पेज पर जाओ
        } else if (para === "Next") {
            setPageNumber(pageNumber + 1); // अगले पेज पर जाओ
        } else if (para === "Last") {
            // Go to last page
            setPageNumber(Math.ceil(totalLen / limit)); // आखिरी पेज पर जाओ
        } else {
            console.log("Unknown pagination action"); // अगर गलत इनपुट हो तो एरर दिखाओ
        }
    };
    useEffect(() => {
        axios
            .post("http://localhost:5000/api/backend/courses/view", {
                page: pageNumber,
                limit: limit,
            })
            .then((response) => {
                if (response.data.status === true) {
                    setCourses(response.data.data);
                    setTotalLen(response.data.pagination.totalRecords || 0);
                } else {
                    setCourses([]);
                    setTotalLen(0);
                }
            })
            .catch((err) => {
                setError(err.message);
            });
    }, [deleteplusstatuschange, pageNumber, limit]); // जब यह वैल्यू बदलेगी तो API कॉल होगी

    // delete api
    let deletecourse = (id) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;

        let data = {
            id: id,
        };
        console.log("data", data);

        axios
            .post("http://localhost:5000/api/backend/courses/delete", data)
            .then((response) => {
                if (response.data.status == true) {
                    setdeleteplusstatuschange(!deleteplusstatuschange);
                    toast.success("Course deleted successfully!");
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((err) => {
                console.error("Delete Error:", err.message);
                toast.error("Something went wrong while deleting!");
            });
    };
    //statuschange y api
    let statuschange = (id, status) => {
        let data = {
            id: id,
            status: !status, // !status इसका मतलब है कि अगर कोर्स true (Active) है, तो false (Inactive) कर देंगे, और अगर false है, तो true कर देंगे।
        };
        console.log("data", status);

        axios
            .put("http://localhost:5000/api/backend/courses/change-status", data)
            .then((response) => {
                if (response.data.status == true) {
                    setdeleteplusstatuschange(!deleteplusstatuschange);
                    toast.success("Course status updated successfully!");
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((err) => {
                console.error("Delete Error:", err.message);
                toast.error("Something went wrong while updating status!");
            });
    };

    //multidelete ke liye pehal multiselec karna padga
    let multiselect = (id) => {
        let updatemultipleIds = [...multiidsget]; // मौजूदा IDs की कॉपी बनाएं
        console.log(updatemultipleIds);
        if (updatemultipleIds.includes(id)) {
            // अगर ID पहले से सेलेक्टेड है, तो उसे लिस्ट से हटा दें
            updatemultipleIds = updatemultipleIds.filter((value) => value !== id);
        } else {
            // अगर ID सेलेक्टेड नहीं है, तो उसे लिस्ट में जोड़ें
            updatemultipleIds.push(id);
        }
        setmultiidsget(updatemultipleIds); // स्टेट अपडेट करें
    };
    let multideletecourse = () => {
        if (multiidsget.length === 0) {
            toast.error("Please select at least one course to delete!");
            return;
        }

        if (!window.confirm("Are you sure you want to delete selected courses?"))
            return;
        let data = {
            ids: multiidsget,
        };
        console.log("data", data);

        axios
            .post("http://localhost:5000/api/backend/courses/multiple-delete", data)
            .then((response) => {
                if (response.data.status == true) {
                    setdeleteplusstatuschange(!deleteplusstatuschange);
                    toast.success("Course deleted successfully!");
                    setmultiidsget([]); // ✅ Deleted IDs Clear करें
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((err) => {
                console.error("Delete Error:", err.message);
                toast.error("Something went wrong while deleting!");
            });
    };

    return (
        <div className="flex justify-center">
            <ToastContainer position="top-right" autoClose={100} />

            <div className="w-full max-w-6xl">
                <div className="bg-white shadow overflow-hidden rounded-lg">
                    <button
                        className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-lg rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex flex-col items-center ${multiidsget.length === 0
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                            }`}
                        onClick={multideletecourse}
                        disabled={multiidsget.length === 0}
                    >
                        <span className="font-semibold">Multiple</span>
                        <span className="font-semibold">Delete</span>
                    </button>

                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    name
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    image
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    price
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    duration
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    description
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    order
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    delete
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {courses.length > 0 ? (
                                courses.map((value, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={multiidsget.includes(value._id)}
                                                onChange={() => multiselect(value._id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">
                                            {(pageNumber - 1) * limit + index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                            <div className="w-[100px] overflow-auto ">
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                            <div className="flex justify-center space-x-4">
                                                <button
                                                    className="bg-red-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-700 transition duration-300"
                                                    onClick={() => deletecourse(value._id)}
                                                >
                                                    <FaTrash className="mr-2" />
                                                    delete
                                                </button>
                                                <Link href={`/course_add/${value._id}`}>
                                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-300 flex items-center">
                                                        <FaEdit className="mr-2" /> Edit
                                                    </button>
                                                </Link>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {value.status == 1 ? (
                                                <button
                                                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                                    onClick={() => statuschange(value._id, value.status)}
                                                >
                                                    Active
                                                </button>
                                            ) : (
                                                <button
                                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                                    onClick={() => statuschange(value._id, value.status)}
                                                >
                                                    Inactive
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center py-8 text-gray-500">
                                        No courses found. Add button new course to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {/* //pagination */}
                    <div className="container mx-auto px-4">
                        <nav className="flex gap-[10px]  justify-between md:justify-center items-center ">
                            {/* First Button */}
                            <button
                                className={`flex items-center justify-centertext-xs px-3 py-1.5 rounded border bg-green-600 text-white border-green-700transition-colors duration-200 ${pageNumber === 1 ? "hidden" : ""
                                    }`}
                                title="First Page"
                                onClick={() => changePageNumber("First")}
                                disabled={pageNumber === 1}
                            >
                                First
                            </button>
                            {/* Previous Button */}

                            <button className={`flex items-center justify-centertext-xs px-3 py-1.5 rounded border bg-green-600 text-white border-green-700transition-colors duration-200 ${pageNumber === 1 ? "hidden" : ""
                                }`}
                                title="Previous Page"
                                onClick={() => changePageNumber("Previous")}
                                disabled={pageNumber === 1}
                            >
                                Previous
                            </button>
                            {/* Next Button */}
                            <button
                                className={`flex items-center justify-center text-xs px-3 py-1.5 rounded border bg-green-600 text-white border-green-700 transition-colors duration-200 ${pageNumber === Math.ceil(totalLen / limit)
                                    ? "hidden" : ""}`}
                                title="Next Page"
                                onClick={() => changePageNumber("Next")}
                                disabled={pageNumber === Math.ceil(totalLen / limit)}
                            >
                                Next
                            </button>

                            {/* Last Button */}
                            <button
                                className={`flex items-center justify-centertext-xs px-3 py-1.5 rounded border bg-green-600 text-white border-green-700transition-colors duration-200 ${pageNumber === Math.ceil(totalLen / limit) ? "hidden" : ""
                                    }`}
                                title="Last Page"
                                onClick={() => changePageNumber("Last")}
                                disabled={pageNumber === Math.ceil(totalLen / limit)}
                            >
                                Last
                            </button>
                        </nav>
                    </div>
                    {/* //pagination */}
                </div>
            </div>
        </div>
    );
}
