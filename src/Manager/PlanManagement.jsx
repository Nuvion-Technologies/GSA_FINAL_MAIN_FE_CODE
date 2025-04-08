import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Pencil, Plus, RefreshCw } from 'lucide-react';

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
    const [view, setView] = useState('plans'); // 'bookings' or 'plans'
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPlanForm, setShowPlanForm] = useState(false);
    const [plans, setPlans] = useState([]);
    const [editing, setEditing] = useState(false);
    const [checked, setChecked] = React.useState(true);
    const ip = import.meta.env.VITE_IP;
    const userid = localStorage.getItem("userid");

    const [planFormData, setPlanFormData] = useState({
        name: '',
        amount: '',
        time_hr: '',
        time_min: '',
        category: 'TURF',
        sport: 'Cricket',
        from: '09:00',
        to: '18:59'
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


    const addBoxCricketPlan = async (e) => {
        e.preventDefault();
        if (!editing){
        try {
            await axios.post(`${ip}/api/turf-admin/add-plan`, {
                userid: localStorage.getItem("userid"),
                ...planFormData
            });
            toast.success('Plan added successfully');
            setShowPlanForm(false);
            fetchBoxCricketPlans();
            setPlanFormData({
                name: '',
                amount: '',
                time_hr: '',
                time_min: '',
                category: 'TURF',
                sport: 'Cricket',
                from: '09:00',
                to: '18:59'
            });
        } catch (error) {
            toast.error('Failed to add plan');
            console.error('Error adding plan:', error);
        }}
        else {
            console.log(planFormData);
            const res =  await axios.post(`${ip}/api/turf-admin/edit-plan`, {
                userid: localStorage.getItem("userid"),
                ...planFormData
            });
            if (res.status == 200) {
                toast.success('Plan Edited successfully');
                setShowPlanForm(false);
                setEditing(false);
                setPlanFormData({
                    name: '',
                    amount: '',
                    time_hr: '',
                    time_min: '',
                    category: 'TURF',
                    sport: 'Cricket',
                    from: '09:00',
                    to: '18:59'
                });

                fetchBoxCricketPlans();

            }
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

    const handlePlanInputChange = (e) => {
        const { name, value } = e.target;
        setPlanFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditPlan = async (id) => {
        setEditing(true);
        setShowPlanForm(true);

        const selectedPlan = plans.find(plan => plan._id === id); // Find the plan by ID

        if (selectedPlan) {
            setPlanFormData(selectedPlan); // Set the form data
            planFormData.append('planid', selectedPlan._id)
        }
    };


    const renderPlans = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Plans Management</h2>
                    <button
                        onClick={() => setShowPlanForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20}/>
                        Add New Plan
                    </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => (
                    <div
                        key={plan._id}
                        className="group bg-white rounded-xl shadow-sm hover:shadow-xl p-6 pb-0 transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 hover:border-blue-100 relative overflow-hidden"
                    >
                        {/* Decorative background pattern */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.2) 1px, transparent 0)`,
                                backgroundSize: '24px 24px'
                            }}></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                                    {plan.name}
                                </h3>
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                        {plan.category}
                    </span>
                            </div>

                            <div className="space-y-4">
                                {/* Price */}
                                <div className="flex items-baseline">
                                    <span className="text-2xl font-bold text-gray-900">₹{plan.amount}</span>
                                    <span className="ml-1 text-gray-500">/session</span>
                                </div>

                                {/* Details */}
                                <div className="space-y-3 pt-4 border-t border-gray-100">
                                    <div className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        <span className="font-medium">Duration:</span>
                                        <span className="ml-2">{plan.time_hr}h {plan.time_min}m</span>
                                    </div>

                                    <div className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                        </svg>
                                        <span className="font-medium">Sport:</span>
                                        <span className="ml-2">{plan.sport}</span>
                                    </div>

                                    <div className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        <span className="font-medium">Timings:</span>
                                        <span className="ml-2">{plan.from} - {plan.to}</span>
                                    </div>

                                    <button
                                        onClick={() => handleEditPlan(plan._id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Pencil size={20}/>
                                        Edit Plan
                                    </button>
                                </div>
                            </div>

                            {/* Hover effect button */}
                            <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {/*<button*/}
                                {/*    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center">*/}
                                {/*    <span>Select Plan</span>*/}
                                {/*    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
                                {/*        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"*/}
                                {/*              d="M9 5l7 7-7 7"/>*/}
                                {/*    </svg>*/}
                                {/*</button>*/}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showPlanForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <h2 className="text-2xl font-semibold mb-4">{editing ? 'Editing Plan' : 'Add New Plan'}



                        </h2>
                        {
                            editing ? <div className='my-2'>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        className="text-sm font-bold"
                                        onChange={() => setChecked(!checked)}
                                    />
                                    Active
                                </label>
                            </div> : ''
                        }
                        <form onSubmit={addBoxCricketPlan} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Plan Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={planFormData.name}
                                    onChange={handlePlanInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={planFormData.amount}
                                    onChange={handlePlanInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Hours</label>
                                    <input
                                        type="number"
                                        name="time_hr"
                                        value={planFormData.time_hr}
                                        onChange={handlePlanInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Minutes</label>
                                    <input
                                        type="number"
                                        name="time_min"
                                        value={planFormData.time_min}
                                        onChange={handlePlanInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    name="category"
                                    value={planFormData.category}
                                    onChange={handlePlanInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="TURF">TURF</option>
                                    <option value="GROUND-A">GROUND-A</option>
                                    <option value="GROUND-B">GROUND-B</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sport</label>
                                <select
                                    name="sport"
                                    value={planFormData.sport}
                                    onChange={handlePlanInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="Cricket">Cricket</option>
                                    <option value="Football">Football</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">From Time</label>
                                    <input
                                        type="time"
                                        name="from"
                                        value={planFormData.from}
                                        onChange={handlePlanInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">To Time</label>
                                    <input
                                        type="time"
                                        name="to"
                                        value={planFormData.to}
                                        onChange={handlePlanInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {setShowPlanForm(false), setEditing(false)} }
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    { !editing ? 'Add Plan' : 'Edit Plan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Plans Management System</h1>
                    <p className="text-gray-600 mt-2">Manage your turf bookings and plans</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setView('plans')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            view === 'plans'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Show Plans
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
