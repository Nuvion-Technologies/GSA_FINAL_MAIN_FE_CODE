import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Calendar, Clock, IndianRupee, Phone, CheckCircle, XCircle, Plus, RefreshCw } from 'lucide-react';
import moment from "moment/moment.js";

const formatTime = (hours, minutes) => {
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${formattedHours}:${formattedMinutes}`;
};

const getCurrentTime = () => {
    const now = new Date();
    return formatTime(now.getHours(), now.getMinutes());
};

const TurfBooking = () => {
    const [view, setView] = useState('bookings'); // 'bookings' or 'plans'
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [plans, setPlans] = useState([]);
    const ip = import.meta.env.VITE_IP;
    const userid = localStorage.getItem("userid");

    const [formData, setFormData] = useState({
        name: '',
        mobile_no: '',
        start_date: new Date().toISOString(),
        start_time: getCurrentTime(),
        end_date: new Date().toISOString(),
        end_time: getCurrentTime(),
        amount: '',
        payment_method: 'Card',
        payment_status: 'Pending',
        advance: '0',
        userid: localStorage.getItem("userid") || '1',
        plan_id: ''
    });

    useEffect(() => {
        const userid = localStorage.getItem("userid");
        if (!userid) {
            toast.error('Please log in to access bookings');
            return;
        }
    }, []);

    const fetchBookings = async () => {
        const userid = localStorage.getItem("userid");
        if (!userid) {
            toast.error('Please log in to view bookings');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${ip}/api/turf-admin/get-all-bookings`, {
                userid: localStorage.getItem("userid")
            });
            setBookings(response.data);
        } catch (error) {
            toast.error('Failed to fetch bookings');
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBoxCricketPlans = async () => {
        try {
            const response = await axios.post(`${ip}/api/turf-admin/plans`,{userid:localStorage.getItem("userid")});
            setPlans(response.data);
        } catch (error) {
            toast.error('Failed to fetch plans');
            console.error('Error fetching plans:', error);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            if (view === 'bookings') {
                await fetchBookings();
            }
            await fetchBoxCricketPlans(); // Always fetch plans as they're needed for both views
        };

        fetchInitialData();
    }, [view]);

    const updateEndDateTime = (startDate, startTime, duration) => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const start = new Date(startDate);
        start.setHours(hours, minutes, 0, 0);

        const end = new Date(start);
        end.setHours(end.getHours() + duration.hours);
        end.setMinutes(end.getMinutes() + duration.minutes);

        return {
            endDate: end.toISOString(),
            endTime: formatTime(end.getHours(), end.getMinutes())
        };
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'start_date' || name === 'start_time') {
            const selectedPlan = plans.find(plan => plan._id === formData.plan_id);
            if (selectedPlan) {
                const duration = {
                    hours: selectedPlan.time_hr || 0,
                    minutes: selectedPlan.time_min || 0
                };

                const { endDate, endTime } = updateEndDateTime(
                    name === 'start_date' ? value : formData.start_date,
                    name === 'start_time' ? value : formData.start_time,
                    duration
                );

                setFormData(prev => ({
                    ...prev,
                    [name]: value,
                    end_date: endDate,
                    end_time: endTime
                }));
                return;
            }
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlanChange = (e) => {
        const selectedPlan = plans.find(plan => plan._id === e.target.value);
        if (selectedPlan) {
            const duration = {
                hours: selectedPlan.time_hr || 0,
                minutes: selectedPlan.time_min || 0
            };

            const { endDate, endTime } = updateEndDateTime(
                formData.start_date,
                formData.start_time,
                duration
            );

            setFormData(prev => ({
                ...prev,
                plan_id: selectedPlan._id,
                amount: selectedPlan.amount.toString(),
                end_date: endDate,
                end_time: endTime
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userid = localStorage.getItem("userid");
        if (!userid) {
            toast.error('Please log in to create a booking');
            return;
        }

        try {
            const [startDate] = formData.start_date.split('T');
            const [endDate] = formData.end_date.split('T');

            const bookingData = {
                ...formData,
                userid,
                start_date: `${startDate}T${formData.start_time}:00.000Z`,
                end_date: `${endDate}T${formData.end_time}:00.000Z`
            };

            await axios.post(`${ip}/api/turf-admin/book`, bookingData);
            toast.success('Booking created successfully');
            setShowBookingForm(false);
            fetchBookings();
            setFormData({
                name: '',
                mobile_no: '',
                start_date: new Date().toISOString(),
                start_time: getCurrentTime(),
                end_date: new Date().toISOString(),
                end_time: getCurrentTime(),
                amount: '',
                payment_method: 'Card',
                payment_status: 'Pending',
                advance: '0',
                userid: userid,
                plan_id: ''
            });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to create booking';
            toast.error(errorMessage);
            console.error('Error creating booking:', error);
        }
    };

    const markAsPaid = async (booking) => {
        const userid = localStorage.getItem("userid");
        if (!userid) {
            toast.error('Please log in to update payment status');
            return;
        }

        try {
            await axios.post(`${ip}/api/turf-admin/mark-as-paid`, {
                userid,
                amount: booking.amount,
                id: booking._id,
                payment_method: booking.payment_method.toUpperCase()
            });
            toast.success('Payment marked as completed');
            fetchBookings();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to mark as paid';
            toast.error(errorMessage);
            console.error('Error marking as paid:', error);
        }
    };

    const updateBookingStatus = async (booking, status) => {
        const userid = localStorage.getItem("userid");
        if (!userid) {
            toast.error('Please log in to update booking status');
            return;
        }

        try {
            await axios.post(`${ip}/api/turf-admin/update`, {
                userid,
                name: booking.name,
                mobile_no: booking.mobile_no,
                status,
                played: status,
                id: booking._id,
                amount: booking.amount
            });
            toast.success('Booking status updated');
            fetchBookings();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update booking';
            toast.error(errorMessage);
            console.error('Error updating booking:', error);
        }
    };

    const renderBookings = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold">Bookings Management</h2>
                </div>
                <button
                    onClick={() => {
                        if (!localStorage.getItem("userid")) {
                            toast.error('Please log in to create a booking');
                            return;
                        }
                        setShowBookingForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20}/>
                    New Booking
                </button>
            </div>

            {showBookingForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <h2 className="text-2xl font-semibold mb-4">New Booking</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobile_no"
                                    value={formData.mobile_no}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Select Plan</label>
                                <select
                                    name="plan_id"
                                    value={formData.plan_id}
                                    onChange={handlePlanChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select a plan</option>
                                    {plans.map((plan) => (
                                        <option key={plan._id} value={plan._id}>
                                            {plan.name} - {plan.time_hr}:{plan.time_min.toString().padStart(2, '0')}h -
                                            ₹{plan.amount}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                                    <input
                                        type="time"
                                        name="start_time"
                                        value={formData.start_time}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                                    <input
                                        type="time"
                                        name="end_time"
                                        value={formData.end_time}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={formData.start_date.split('T')[0]}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                                    required
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Advance Amount</label>
                                <input
                                    type="number"
                                    name="advance"
                                    value={formData.advance}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    min="0"
                                    max={formData.amount}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                <select
                                    name="payment_method"
                                    value={formData.payment_method}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="Card">Card</option>
                                    <option value="Cash">Cash</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Net Banking">Net Banking</option>
                                </select>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowBookingForm(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Create Booking
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bookings.map((booking) => (
                    <div key={booking._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{booking.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                                booking.payment_status === 'Paid'
                                    ? 'bg-green-100 text-green-800'
                                    : booking.payment_status === 'Partial'
                                        ? 'bg-orange-100 text-orange-800'
                                        : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {booking.payment_status}
                            </span>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-center text-gray-600">
                                <Calendar size={16} className="mr-2" />
                                <span>{format(new Date(booking.start_date), 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Clock size={16} className="mr-2" />
                                <span>{moment(booking.start_date).format('HH:mm')} - {moment(booking.end_date).format('HH:mm')}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <IndianRupee size={16} className="mr-2" />
                                <span>{booking.amount}</span>
                                {booking.advance > 0 && (
                                    <span className="ml-2 text-green-600">(Advance: ₹{booking.advance})</span>
                                )}
                            </div>
                            {booking.mobile_no && (
                                <div className="flex items-center text-gray-600">
                                    <Phone size={16} className="mr-2" />
                                    <span>{booking.mobile_no}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex gap-3">
                            {booking.payment_status !== 'Paid' && (
                                <button
                                    onClick={() => markAsPaid(booking)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <IndianRupee size={16} />
                                    Mark Paid
                                </button>
                            )}
                            {!booking.played && (
                                <button
                                    onClick={() => updateBookingStatus(booking, !booking.played)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                        booking.played
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    <CheckCircle size={16} />
                                    Mark Complete
                                </button>
                            )}

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Turf Management System</h1>
                    <p className="text-gray-600 mt-2">Manage your turf bookings and plans</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setView('bookings')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            view === 'bookings'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Show Bookings
                    </button>
                    <button
                        onClick={() => view === 'plans' ? fetchBoxCricketPlans() : fetchBookings()}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <RefreshCw size={20} />
                        Refresh
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                view === 'plans' ? renderPlans() : renderBookings()
            )}
        </div>
    );
};

export default TurfBooking;
