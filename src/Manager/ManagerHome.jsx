import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import AcademyManagement from "./AcademyManagement";
import AttendanceManagement from "./AttendanceManagement";
import AccountsOverview from "./AccountsOverview";
import BoxCricketManagement from "./BoxCricketManagement";
import ContactUsQueries from "./ContactUsQueries";
import EventManagement from "./EventManagement";
import EventParticipants from "./EventParticipants";
import GalleryManagement from "./GalleryManagement";
import GroundManagement from "./GroundManagement";
import InventoryManagement from "./InventoryManagement";
import StaffManagement from "./StaffManagement";
import StaffAttendance from "./StaffAttendance";
import ManagerHome from "./ManagerHome";
import {
    TrendingUp,
    TrendingDown,
    Users,
    Calendar,
    UserCheck,
    Search,
    AlertCircle,
    MapPin,
    Trophy,
    Clock,
    IndianRupee
} from "lucide-react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);


const ip = import.meta.env.VITE_IP;

const StatCard = ({ icon: Icon, title, value, trend, trendDirection, comparisonText, onClick }) => (
    <div onClick={onClick}
        className="h-full bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
        <div className="flex justify-between items-start">
            <div className="space-y-2">
                <p className="text-gray-600 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${trendDirection === "up" ? "bg-green-100" : "bg-red-100"
                }`}>
                <Icon className={`w-6 h-6 ${trendDirection === "up" ? "text-green-600" : "text-red-600"
                    }`} />
            </div>
        </div>
        {trend !== undefined && (
            <div className="mt-4 flex items-center">
                {trendDirection === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${trendDirection === "up" ? "text-green-600" : "text-red-600"
                    }`}>
                    {trend}%
                </span>
                <span className="text-gray-600 text-sm ml-2">{comparisonText}</span>
            </div>
        )}
    </div>
);


const QueryCard = ({ query }) => {
    const date = new Date(query.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800">{query.name}</h3>
            <p className="text-sm text-gray-600">Email: {query.email}</p>
            <p className="text-sm text-gray-600">Mobile No: {query.mobile_no}</p>
            <p className="text-sm text-gray-600">Description: {query.description}</p>
            <p className="text-xs text-gray-500 mt-2">Received on: {date}</p>
        </div>
    );
};


const EventCard = ({ event }) => {
    const date = new Date(event.event_date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-semibold text-gray-900">{event.name}</h3>
                    <div className="mt-2 space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            {date}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <IndianRupee className="w-4 h-4 mr-2" />
                            ₹{event.event_fee.toLocaleString()}
                        </div>
                    </div>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                    <Trophy className="w-6 h-6 text-blue-600" />
                </div>
            </div>
        </div>
    );
};

const AttendanceMarker = ({ onSuccess }) => {
    const [rollno, setRollno] = useState("");
    const [attendanceMessage, setAttendanceMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const inputRef = useRef(null);

    const markAttendance = async () => {
        try {
            const response = await fetch(`${ip}/api/manager/take-attendance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rollno, userid: localStorage.getItem("userid") }),
            });

            const data = await response.json();
            if (response.ok) {
                setAttendanceMessage(data.message);
                setMessageType("success");
                onSuccess();
            } else {
                setAttendanceMessage(data.message || "Failed to mark attendance.");
                setMessageType("error");
            }
            setRollno("");
            inputRef.current?.focus();
        } catch (error) {
            setAttendanceMessage("An error occurred while marking attendance.");
            setMessageType("error");
            console.error(error);
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Attendance</h3>
            <div className="space-y-4">
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={rollno}
                        onChange={(e) => setRollno(e.target.value)}
                        placeholder="Enter Roll Number"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        onKeyPress={(e) => e.key === 'Enter' && markAttendance()}
                    />
                    <button
                        onClick={markAttendance}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <UserCheck className="w-4 h-4" />
                    </button>
                </div>
                {attendanceMessage && (
                    <div className={`flex items-center p-3 rounded-lg ${messageType === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}>
                        <AlertCircle className="w-4 h-4 mr-2" />
                        <p className="text-sm">{attendanceMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const TraineeSearch = () => {
    const [searchRollNo, setSearchRollNo] = useState("");
    const [trainees, setTrainees] = useState([]);
    const [filteredTrainee, setFilteredTrainee] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchTrainees = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${ip}/api/academy/trainees`);
            setTrainees(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching trainees:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainees();
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        if (value.length <= 8) {
            setSearchRollNo(value);
            if (value.length === 8) {
                const found = trainees.find(trainee => trainee.roll_no === value);
                setFilteredTrainee(found || null);
            } else {
                setFilteredTrainee(null);
            }
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Search</h3>
            <div className="space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        value={searchRollNo}
                        onChange={handleSearchChange}
                        placeholder="Enter 8-digit Roll Number"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>

                {loading && (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {filteredTrainee && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900">{filteredTrainee.name}</h4>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                            <p>Roll No: {filteredTrainee.roll_no}</p>
                            <p>Father: {filteredTrainee.father}</p>
                            <p>Contact: {filteredTrainee.phone}</p>
                            <p>Address: {filteredTrainee.address}</p>
                        </div>
                    </div>
                )}

                {searchRollNo.length === 8 && !filteredTrainee && !loading && (
                    <div className="p-4 bg-red-50 rounded-lg text-red-600 text-sm">
                        No trainee found with this roll number.
                    </div>
                )}
            </div>
        </div>
    );
};

const Dashboard = ({ onNavigate }) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleNavigation = (component) => {
        if (typeof onNavigate === 'function') {
            onNavigate(component);
        } else {
            localStorage.setItem("activeComponent", component);
            window.location.reload();
        }
    };

    const fetchDashboardData = async () => {
        try {
            const response = await axios.post(`${ip}/api/admin/home/home`, { userid: localStorage.getItem("userid") });
            const data = await response.data;
            setDashboardData(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }


    // const RevenueChart = ({ data }) => {
    //     const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    //
    //     const chartData = {
    //         labels: months,
    //         datasets: [
    //             {
    //                 label: 'Income',
    //                 data: [
    //                     data.lastMonthIN,
    //                     data.currentMonthIN,
    //                     data.twoMonthTotalIn,
    //                     data.threeMonthTotalIn,
    //                     data.fourMonthTotalIn,
    //                     data.fiveMonthTotalIn,
    //                     data.sixMonthTotalIn
    //                 ],
    //                 backgroundColor: 'rgba(59, 130, 246, 0.5)',
    //                 borderColor: 'rgb(59, 130, 246)',
    //                 borderWidth: 1
    //             },
    //             {
    //                 label: 'Expenses',
    //                 data: [
    //                     data.lastMonthTotalOut,
    //                     data.currentMonthTotalOut,
    //                     data.twoMonthTotalOut,
    //                     data.threeMonthTotalOut,
    //                     data.fourMonthTotalOut,
    //                     data.fiveMonthTotalOut,
    //                     data.sixMonthTotalOut
    //                 ],
    //                 backgroundColor: 'rgba(239, 68, 68, 0.5)',
    //                 borderColor: 'rgb(239, 68, 68)',
    //                 borderWidth: 1
    //             }
    //         ]
    //     };
    //
    //     const options = {
    //         responsive: true,
    //         maintainAspectRatio: false,
    //         plugins: {
    //             legend: {
    //                 position: 'top',
    //             },
    //             title: {
    //                 display: true,
    //                 text: 'Revenue vs Expenses (Last 6 Months)'
    //             }
    //         },
    //         scales: {
    //             y: {
    //                 beginAtZero: true,
    //                 ticks: {
    //                     callback: (value) => `₹${value.toLocaleString()}`
    //                 }
    //             }
    //         }
    //     };
    //
    //     return (
    //         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    //             <div className="h-[400px]">
    //                 <Bar data={chartData} options={options} />
    //             </div>
    //         </div>
    //     );
    // };

    // const RevenueChart = ({ data }) => {
    //     const getLastSixMonthsLabels = () => {
    //         const currentDate = new Date();
    //         const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    //         // Get the last 6 months including the current month
    //         return Array.from({ length: 6 }, (_, index) => {
    //             const monthIndex = (currentDate.getMonth() - index + 12) % 12;
    //             return monthNames[monthIndex];
    //         }).reverse(); // Reverse to show oldest first
    //     };

    //     const monthLabels = getLastSixMonthsLabels();

    //     const chartData = {
    //         labels: monthLabels,
    //         datasets: [
    //             {
    //                 label: 'Income',
    //                 data: [
    //                     data.fiveMonthTotalIn,
    //                     data.fourMonthTotalIn,
    //                     data.threeMonthTotalIn,
    //                     data.twoMonthTotalIn,
    //                     data.lastMonthIN,
    //                     data.currentMonthIN,

    //                 ],
    //                 backgroundColor: 'rgba(59, 130, 246, 0.5)',
    //                 borderColor: 'rgb(59, 130, 246)',
    //                 borderWidth: 1
    //             },
    //             {
    //                 label: 'Expenses',
    //                 data: [
    //                     data.fiveMonthTotalOut,
    //                     data.fourMonthTotalOut,
    //                     data.threeMonthTotalOut,
    //                     data.twoMonthTotalOut,
    //                     data.lastMonthTotalOut,
    //                     data.currentMonthTotalOut,
    //                 ],
    //                 backgroundColor: 'rgba(239, 68, 68, 0.5)',
    //                 borderColor: 'rgb(239, 68, 68)',
    //                 borderWidth: 1
    //             }
    //         ]
    //     };

    //     const options = {
    //         responsive: true,
    //         maintainAspectRatio: false,
    //         plugins: {
    //             legend: {
    //                 position: 'top',
    //             },
    //             title: {
    //                 display: true,
    //                 text: 'Revenue vs Expenses (Last 6 Months)'
    //             }
    //         },
    //         scales: {
    //             y: {
    //                 beginAtZero: true,
    //                 ticks: {
    //                     callback: (value) => `₹${value.toLocaleString()}`
    //                 }
    //             }
    //         }
    //     };

    //     return (
    //         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer" onClick={() => handleNavigation("Accounts")}>
    //             <div className="h-[400px]">
    //                 <Bar data={chartData} options={options} />
    //             </div>
    //         </div>
    //     );
    // };

    const RevenueChart = ({ data }) => {
        const [chartType, setChartType] = useState('bar');

        const getLastSixMonthsLabels = () => {
            const currentDate = new Date();
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return Array.from({ length: 6 }, (_, index) => {
                const monthIndex = (currentDate.getMonth() - index + 12) % 12;
                return monthNames[monthIndex];
            }).reverse();
        };

        const monthLabels = getLastSixMonthsLabels();

        const colors = [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
        ];

        const borderColors = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ];

        const chartData = {
            labels: monthLabels,
            datasets: [
                {
                    label: 'Income',
                    data: [
                        data.fiveMonthTotalIn,
                        data.fourMonthTotalIn,
                        data.threeMonthTotalIn,
                        data.twoMonthTotalIn,
                        data.lastMonthIN,
                        data.currentMonthIN,
                    ],
                    backgroundColor: chartType === 'bar' ? 'rgba(59, 130, 246, 0.5)' : colors,
                    borderColor: chartType === 'bar' ? 'rgb(59, 130, 246)' : borderColors,
                    borderWidth: 1,
                    fill: chartType === 'line'
                },
                {
                    label: 'Expenses',
                    data: [
                        data.fiveMonthTotalOut,
                        data.fourMonthTotalOut,
                        data.threeMonthTotalOut,
                        data.twoMonthTotalOut,
                        data.lastMonthTotalOut,
                        data.currentMonthTotalOut,
                    ],
                    backgroundColor: chartType === 'bar' ? 'rgba(239, 68, 68, 0.5)' : colors,
                    borderColor: chartType === 'bar' ? 'rgb(239, 68, 68)' : borderColors,
                    borderWidth: 1,
                    fill: chartType === 'line'
                }
            ]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Revenue vs Expenses (Last 6 Months)'
                }
            },
            scales: chartType !== 'pie' ? {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => `₹${value.toLocaleString()}`
                    }
                }
            } : {}
        };

        return (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer">
                <div className="flex justify-end mb-4">
                    <select className="border p-2 rounded" value={chartType} onChange={(e) => setChartType(e.target.value)}>
                        <option value="bar">Bar Chart</option>
                        <option value="line">Line Chart</option>
                        <option value="pie">Pie Chart</option>
                    </select>
                </div>
                <div className="h-[400px]">
                    {chartType === 'bar' && <Bar data={chartData} options={options} />}
                    {chartType === 'line' && <Line data={chartData} options={options} />}
                    {chartType === 'pie' && <Pie data={chartData} options={options} />}
                </div>
            </div>
        );
    };


    // const RevenueChart = ({ data }) => {
    //     const getMonthLabels = () => {
    //         const currentDate = new Date();
    //         const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    //
    //         return ['Current', 'Last', '2 Months', '3 Months', '4 Months', '5 Months', '6 Months'].map((label, index) => {
    //             if (index === 0) return `${monthNames[currentDate.getMonth()]}`;
    //             if (index === 1) return `${monthNames[(currentDate.getMonth() - 1 + 12) % 12]}`;
    //
    //             const startMonth = (currentDate.getMonth() - (index - 1) + 12) % 12;
    //             const endMonth = currentDate.getMonth();
    //
    //             return `${monthNames[startMonth]}-${monthNames[endMonth]}`;
    //         });
    //     };
    //
    //     const monthLabels = getMonthLabels();
    //
    //     const chartData = {
    //         labels: monthLabels,
    //         datasets: [
    //             {
    //                 label: 'Income',
    //                 data: [
    //                     data.currentMonthIN,
    //                     data.lastMonthIN,
    //                     data.twoMonthTotalIn,
    //                     data.threeMonthTotalIn,
    //                     data.fourMonthTotalIn,
    //                     data.fiveMonthTotalIn,
    //                     data.sixMonthTotalIn
    //                 ],
    //                 backgroundColor: 'rgba(59, 130, 246, 0.5)',
    //                 borderColor: 'rgb(59, 130, 246)',
    //                 borderWidth: 1
    //             },
    //             {
    //                 label: 'Expenses',
    //                 data: [
    //                     data.currentMonthTotalOut,
    //                     data.lastMonthTotalOut,
    //                     data.twoMonthTotalOut,
    //                     data.threeMonthTotalOut,
    //                     data.fourMonthTotalOut,
    //                     data.fiveMonthTotalOut,
    //                     data.sixMonthTotalOut
    //                 ],
    //                 backgroundColor: 'rgba(239, 68, 68, 0.5)',
    //                 borderColor: 'rgb(239, 68, 68)',
    //                 borderWidth: 1
    //             }
    //         ]
    //     };
    //
    //     const options = {
    //         responsive: true,
    //         maintainAspectRatio: false,
    //         plugins: {
    //             legend: {
    //                 position: 'top',
    //             },
    //             title: {
    //                 display: true,
    //                 text: 'Revenue vs Expenses (Last 6 Months)'
    //             }
    //         },
    //         scales: {
    //             y: {
    //                 beginAtZero: true,
    //                 ticks: {
    //                     callback: (value) => `₹${value.toLocaleString()}`
    //                 }
    //             }
    //         }
    //     };
    //
    //     return (
    //         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    //             <div className="h-[400px]">
    //                 <Bar data={chartData} options={options} />
    //             </div>
    //         </div>
    //     );
    // };


    const TurfBookingCard = ({ booking }) => {
        const startTime = new Date(booking.start_date).toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        const endTime = new Date(booking.end_date).toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });

        return (
            <div className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900">{booking.name}</h3>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Booked by:</span> {booking.booked_by}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Time:</span> {startTime} - {endTime}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Amount:</span> ₹{booking.amount.toLocaleString()}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.payment_status === 'Pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                                    }`}>
                                    {booking.payment_status}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.played
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {booking.played ? 'Played' : 'Upcoming'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={`p-2 rounded-lg ${booking.payment_status === 'Pending'
                        ? 'bg-yellow-50 text-yellow-600'
                        : 'bg-green-50 text-green-600'
                        }`}>
                        <IndianRupee className="w-6 h-6" />
                    </div>
                </div>
            </div>
        );
    };


    const GroundBookingCard = ({ booking }) => {
        const startTime = new Date(booking.start_date).toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            day: 'numeric',
            month: 'short'
        });

        const endTime = new Date(booking.end_date).toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });

        return (
            <div className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{booking.name}</h3>
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {booking.ground}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Contact:</span> {booking.mobile_no}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Time:</span> {startTime} - {endTime}
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Total:</span> ₹{booking.amount.toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Advance:</span> ₹{booking.advance.toLocaleString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.payment_status === 'Pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                                    }`}>
                                    {booking.payment_status}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.started
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {booking.started ? 'Started' : 'Not Started'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={`p-2 rounded-lg ${booking.payment_status === 'Pending'
                        ? 'bg-yellow-50 text-yellow-600'
                        : 'bg-green-50 text-green-600'
                        }`}>
                        <IndianRupee className="w-6 h-6" />
                    </div>
                </div>
            </div>
        );
    };

    const ExpiringAdmissionCard = ({ admission }) => {
        const expiryDate = new Date(admission.to);
        const daysLeft = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));

        return (
            <div className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{admission.name}</h3>
                            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                {admission.roll_no}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Session:</span> {admission.session}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Contact:</span> {admission.phone}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">School:</span> {admission.name_of_school}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${daysLeft <= 3
                                    ? 'bg-red-100 text-red-800'
                                    : daysLeft <= 7
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {daysLeft} days left
                                </span>
                                {!admission.id_card_generated && (
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                        ID Card Pending
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                        <UserCheck className="w-6 h-6" />
                    </div>
                </div>
            </div>
        );
    };

    const StaffInfoCard = ({ totalStaff, totalCoaches }) => (
        <div className="bg-white rounded-lg p-6 border border-gray-100 hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Overview</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-blue-600 font-medium">Total Staff</p>
                            <p className="text-2xl font-bold text-blue-700">{totalStaff}</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Trophy className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-purple-600 font-medium">Total Coaches</p>
                            <p className="text-2xl font-bold text-purple-700">{totalCoaches}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );




    return (
        <div className="min-h-screen bg-transparent p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white">
                    <h1 className="text-3xl font-bold">Dashboard Overview</h1>
                    <p className="mt-2 opacity-90">Welcome back! Here's your academy's current status.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div onClick={() => handleNavigation("Accounts")}>
                        <StatCard
                            icon={IndianRupee}
                            title="Current Month Revenue"
                            value={`₹${dashboardData.currentMonthIN}`}
                            // trend={dashboardData.percentageChange.toFixed(2)}
                            trend={Number(dashboardData.percentageChange).toFixed(2)}
                            trendDirection={dashboardData.InTrend}
                            comparisonText="vs Last Month"
                        />
                    </div>
                    <div onClick={() => handleNavigation("Academy")}>
                        <StatCard
                            icon={Users}
                            title="Active Students"
                            value={dashboardData.currentActiveStudents}
                            trendDirection="up"
                        />
                    </div>
                    <div onClick={() => handleNavigation("Events")}>
                        <StatCard
                            icon={Trophy}
                            title="Active Events"
                            value={dashboardData.activeEvents}
                            trendDirection="up"
                        />
                    </div>
                    <div onClick={() => handleNavigation("Attendance")}>
                        <StatCard
                            icon={Calendar}
                            title="Today's Attendance"
                            value={dashboardData.todayPresentCount}
                            trend={Number(dashboardData.attendancePercentageChange).toFixed(2)}
                            trendDirection={dashboardData.attendanceTrend}
                            comparisonText="vs Yesterday"
                        />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AttendanceMarker onSuccess={fetchDashboardData} />
                    <TraineeSearch />
                </div>

                {/* Staff Information */}
                <div onClick={() => handleNavigation("Staff")} className="grid grid-cols-1 md:grid-cols-2 gap-6 cursor-pointer">
                    <StaffInfoCard
                        totalStaff={dashboardData.totalStaff}
                        totalCoaches={dashboardData.totalCoaches}
                    />
                    {/* You can add another card here if needed */}
                </div>

                {/* Revenue Chart */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Revenue Overview
                    </h2>
                    <RevenueChart data={dashboardData} />
                </div>

                {/* Upcoming Events */}
                {dashboardData.upcomingEvents.length > 0 && (
                    <div onClick={() => handleNavigation("Events")} className="cursor-pointer">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <Clock className="w-5 h-5 mr-2" />
                            Upcoming Events
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dashboardData.upcomingEvents
                                .filter((event) => !event.delete) // Filter out events where delete is true
                                .map((event) => (
                                    <EventCard key={event._id} event={event} />
                                ))}
                        </div>
                    </div>
                )}

                {/* Today's Queries */}
                {dashboardData.todaysQueries.length > 0 && (
                    <div onClick={() => handleNavigation("ContactUs")} className="cursor-pointer">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <Clock className="w-5 h-5 mr-2" />
                            Today's Queries
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dashboardData.todaysQueries
                                .filter((query) => !query.delete) // Filter out queries where delete is true
                                .map((query) => (
                                    <QueryCard key={query._id} query={query} />
                                ))}
                        </div>
                    </div>
                )}




                {/* Today's Turf Bookings */}
                {dashboardData.todaysTurfBookings && dashboardData.todaysTurfBookings.length > 0 && (
                    <div onClick={() => handleNavigation("BoxCricket")} className="cursor-pointer">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <Calendar className="w-5 h-5 mr-2" />
                            Today's Turf Bookings
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dashboardData.todaysTurfBookings.map((booking) => (
                                <TurfBookingCard key={booking._id} booking={booking} />
                            ))}
                        </div>
                    </div>
                )}


                {/* Ground Bookings */}
                {dashboardData.todaysGroundBookings && dashboardData.todaysGroundBookings.length > 0 && (
                    <div onClick={() => handleNavigation("Ground")} className="cursor-pointer">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <MapPin className="w-5 h-5 mr-2" />
                            Today's Ground Bookings
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dashboardData.todaysGroundBookings.map((booking) => (
                                <GroundBookingCard key={booking._id} booking={booking} />
                            ))}
                        </div>
                    </div>
                )}

                {/* today Admissions */}
                {dashboardData.todaysAcademyAdmissions && dashboardData.todaysAcademyAdmissions.length > 0 && (
                    <div onClick={() => handleNavigation("Academy")} className="cursor-pointer">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            Todays Admissions
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dashboardData.todaysAcademyAdmissions.map((admission) => (
                                <ExpiringAdmissionCard key={admission._id} admission={admission} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Expiring Admissions */}
                {dashboardData.ExpiringAdmissions && dashboardData.ExpiringAdmissions.length > 0 && (
                    <div onClick={() => handleNavigation("Academy")} className="cursor-pointer">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            Expiring Admissions
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dashboardData.ExpiringAdmissions.map((admission) => (
                                <ExpiringAdmissionCard key={admission._id} admission={admission} />
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Dashboard;
