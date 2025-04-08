import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Edit2, CheckCircle } from 'lucide-react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const localizer = momentLocalizer(moment);
const GroundManagement = () => {
    const [plans, setPlans] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [filterGround, setFilterGround] = useState("UPCOMING");
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [filteredPlans, setFilteredPlans] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filterDate, setFilterDate] = useState("");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [markAsPaidAmount, setMarkAsPaidAmount] = useState(0);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [bookingForm, setBookingForm] = useState({
        name: '',
        mobile_no: '',
        date: '',
        start_date: '',
        end_date: '',
        ground: '',
        payment_method: '',
        payment_status: 'Pending',
        status: true,
        description: '',
        advance: 0,
        advpaymentmode: '',
        plan_id: '',
        started: false,
        ended: false,
        amount: 0,
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [transactions, setTransactions] = useState([]);

    const ip = import.meta.env.VITE_IP;

    const [calendarEvents, setCalendarEvents] = useState([]);

    // Custom event styling
    const eventStyleGetter = (event) => {
        const isGroundA = event.ground === 'GROUND-A';
        let backgroundColor = isGroundA ? '#2563EB' : '#059669'; // blue-600 for Ground A, emerald-600 for Ground B

        const style = {
            backgroundColor,
            borderRadius: '6px',
            opacity: 0.9,
            color: 'white',
            border: 'none',
            display: 'block',
            overflow: 'hidden',
            fontWeight: '500',
            fontSize: '0.875rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            transition: 'all 0.2s ease'
        };

        if (event.isHalfDay) {
            style.backgroundImage = 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.3) 5px, rgba(255,255,255,0.3) 10px)';
            style.borderLeft = '4px solid ' + (isGroundA ? '#1E40AF' : '#047857'); // darker shade for border
        } else {
            style.borderLeft = '4px solid ' + (isGroundA ? '#1E40AF' : '#047857');
        }

        return {
            style,
            className: 'hover:opacity-95 cursor-pointer'
        };
    };

    // Custom event component
    const EventComponent = ({ event }) => (
        <div className="p-1">
            <div className="font-medium text-sm">{event.title}</div>
            <div className="text-xs opacity-90">
                {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
            </div>
        </div>
    );

    // Custom toolbar
    const CustomToolbar = (toolbar) => {
        const goToToday = () => {
            toolbar.onNavigate('TODAY');
        };

        return (
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="flex space-x-2">
                    <button
                        onClick={() => toolbar.onNavigate('PREV')}
                        className="px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-1"
                    >
                        <span>←</span>
                        <span>Previous</span>
                    </button>
                    <button
                        onClick={goToToday}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                    >
                        This Month
                    </button>
                    <button
                        onClick={() => toolbar.onNavigate('NEXT')}
                        className="px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-1"
                    >
                        <span>Next</span>
                        <span>→</span>
                    </button>
                </div>
                <span className="text-lg my-3 font-semibold text-gray-800">
                    {toolbar.label}
                </span>
                <div className="flex space-x-2">
                    {toolbar.views.map(view => (
                        <button
                            key={view}
                            onClick={() => toolbar.onView(view)}
                            className={`px-4 py-2 rounded-md transition-colors duration-200 ${view === toolbar.view
                                ? 'bg-blue-500 text-white shadow-sm'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {view.charAt(0).toUpperCase() + view.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    // useEffect(() => {
    //     // Fetch ground plans
    //     fetch(`${ip}/api/ground/plans`)
    //         .then((response) => response.json())
    //         .then((data) => setPlans(data))
    //         .catch((error) => console.error('Error fetching ground plans:', error));

    //     // Fetch bookings
    //     fetch(`${ip}/api/ground/bookings`)
    //         .then((response) => response.json())
    //         .then((data) => {
    //             const sortedBookings = data.sort((a, b) => {
    //                 // Sort by ground alphabetically
    //                 // if (a.ground < b.ground) return -1;
    //                 // if (a.ground > b.ground) return 1;

    //                 // If ground names are the same, sort by start date
    //                 return new Date(a.start_date) - new Date(b.start_date);
    //             });
    //             setBookings(sortedBookings);
    //             setFilteredBookings(sortedBookings);
    //         })
    //         .catch((error) => console.error('Error fetching bookings:', error));
    // }, []);

    useEffect(() => {
        // Fetch ground plans
        fetch(`${ip}/api/ground/plans`)
            .then((response) => response.json())
            .then((data) => setPlans(data))
            .catch((error) => console.error('Error fetching ground plans:', error));
    
        // Fetch bookings
        fetch(`${ip}/api/ground/bookings`)
            .then((response) => response.json())
            .then((data) => {
                const sortedBookings = data.sort((a, b) => {
                    return new Date(b.start_date) - new Date(a.start_date); // Descending order (latest first)
                });
                setBookings(sortedBookings);
                setFilteredBookings(sortedBookings);
            })
            .catch((error) => console.error('Error fetching bookings:', error));
    }, []);    

    // Convert all bookings to calendar events
useEffect(() => {
    if (bookings) {
        const events = bookings.map(booking => {
            const startDate = new Date(booking.start_date);
            const endDate = new Date(booking.end_date);

            // Calculate duration in hours
            const duration = moment(endDate).diff(moment(startDate), 'hours');

            // If end time is before 2 PM or start time is after 2 PM, it's a half-day
            const startHour = moment(startDate).hour();
            const endHour = moment(endDate).hour();
            const isHalfDay = startHour >= 14 || endHour <= 14;

            return {
                id: booking._id,
                title: `${booking.name} (${booking.ground})`,
                start: startDate,
                end: endDate,
                isHalfDay,
                ground: booking.ground,
                resource: booking,
                duration
            };
        });
        setCalendarEvents(events);
    }
}, [bookings]); // Use `bookings` instead of `filteredBookings`


    useEffect(() => {
        if (bookingForm.ground) {
            setFilteredPlans(plans.filter((plan) => plan.category === bookingForm.ground));
        } else {
            setFilteredPlans([]);
        }
    }, [bookingForm.ground, plans]);

    // Function to filter bookings
    useEffect(() => {
        let filtered = bookings;

        // Get today's date (formatted)
        const today = moment().format("YYYY-MM-DD");

        // Filter for today’s and upcoming bookings
        if (filterGround === "UPCOMING") {
            filtered = bookings.filter((booking) => {
                const bookingDate = moment(booking.start_date).format("YYYY-MM-DD");
                return bookingDate >= today; // Include today and future dates
            });
        } else if (filterGround === "PAST") {
            filtered = bookings.filter((booking) => new Date(booking.end_date) < new Date());
        } else if (filterGround !== "ALL") {
            filtered = bookings.filter((booking) => booking.ground === filterGround);
        }

        // Apply date filter if a specific date is selected
        if (filterDate) {
            filtered = filtered.filter((booking) =>
                moment(booking.start_date).format("YYYY-MM-DD") === filterDate
            );
        }

        setFilteredBookings(filtered);
    }, [filterGround, filterDate, bookings]);

    const handleBookingChange = (e) => {
        const { name, value } = e.target;

        if (name === 'plan_id') {
            const selectedPlan = filteredPlans.find((plan) => plan._id === value);
            setBookingForm((prevState) => ({
                ...prevState,
                [name]: value,
                amount: selectedPlan ? selectedPlan.amount : 0,
            }));
            checkBookingAvailability(value, bookingForm.date);  // Check availability after plan change
        } else if (name === 'date') {
            setBookingForm((prevState) => ({ ...prevState, [name]: value }));
            checkBookingAvailability(bookingForm.plan_id, value); // Check availability after date change
        } else {
            setBookingForm((prevState) => ({ ...prevState, [name]: value }));
        }
    };

    const checkBookingAvailability = (planId, selectedDate) => {
        if (!planId || !selectedDate) {
            setErrorMessage('');
            setSuccessMessage('');
            return;
        }

        const selectedPlan = filteredPlans.find((plan) => plan._id === planId);
        const startDateTime = new Date(`${selectedDate}T${selectedPlan.from}:00Z`);
        const endDateTime = new Date(`${selectedDate}T${selectedPlan.to}:00Z`);

        const isConflict = bookings.some((booking) => {
            const bookingStart = new Date(booking.start_date);
            const bookingEnd = new Date(booking.end_date);
            return booking.ground === bookingForm.ground &&
                ((startDateTime >= bookingStart && startDateTime < bookingEnd) ||
                    (endDateTime > bookingStart && endDateTime <= bookingEnd) ||
                    (startDateTime <= bookingStart && endDateTime >= bookingEnd));
        });

        if (isConflict) {
            setErrorMessage('Slot Already Booked, please choose another timing or date.');
            setSuccessMessage('');
        } else {
            setSuccessMessage('Booking Available');
            setErrorMessage('');
        }
    };


    const handleEditBooking = async (booking) => {
        setEditMode(true);
        const userId = localStorage.getItem('userid');
        try {
            const response = await fetch(`${ip}/api/ground/booking/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userid: userId,
                    id: booking._id,
                }),
            });
            const data = await response.json();
            console.log(data);
            setTransactions(data); // Update state with transactions
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setTransactions([]); // Reset transactions in case of error
        }
        setCurrentEditId(booking._id);

        // Convert start_date to 'YYYY-MM-DD' format for the date picker
        const formattedDate = booking.start_date
            ? new Date(booking.start_date).toISOString().split('T')[0] // Extract YYYY-MM-DD
            : ''; // Fallback if start_date is not available

        setBookingForm({
            ...booking,
            date: formattedDate, // Set the formatted date
            plan_id: booking.plan_id || '',
            ground: booking.ground || '',
        });
        setShowModal(true);
    };

    const handleMarkasPaid = (id, amount) => {
        setSelectedBookingId(id);
        setMarkAsPaidAmount(amount);
        setShowModal(false);
        setShowPaymentModal(true);
    }

    const confirmPayment = () => {
        if (!paymentMethod) {
            alert('Please select a payment method.');
            return;
        }

        const userId = localStorage.getItem('userid'); // Assuming user ID is stored in localStorage
        console.log(userId);
        console.log(paymentMethod);
        console.log(markAsPaidAmount)
        fetch(`${ip}/api/ground/booking/mark-as-paid`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userid: userId,
                id: selectedBookingId,
                method: paymentMethod,
                amount: markAsPaidAmount,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                setShowPaymentModal(false);
                setSelectedBookingId(null);
                setPaymentMethod('');
                window.location.reload(); // Reload the page to fetch updated data
            })
            .catch((error) => console.error('Error marking as paid:', error));
    };
    const handleSubmitBooking = (e) => {
        e.preventDefault();

        if (!bookingForm.plan_id) {
            alert('Please select a plan before submitting the booking.');
            return;
        }

        const selectedPlan = filteredPlans.find((plan) => plan._id === bookingForm.plan_id);
        if (!selectedPlan) {
            alert('Invalid plan selected.');
            return;
        }

        const selectedDate = bookingForm.date;
        const startDateTimeUTC = new Date(`${selectedDate}T${selectedPlan.from}:00Z`);
        const endDateTimeUTC = new Date(`${selectedDate}T${selectedPlan.to}:00Z`);

        const startDateTimeIST = new Date(startDateTimeUTC.getTime() - 5.5 * 60 * 60 * 1000);
        const endDateTimeIST = new Date(endDateTimeUTC.getTime() - 5.5 * 60 * 60 * 1000);

        const updatedBookingForm = {
            ...bookingForm,
            start_date: startDateTimeIST.toISOString(),
            end_date: endDateTimeIST.toISOString(),
        };

        if (editMode) {
            fetch(`${ip}/api/ground/bookings/${currentEditId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBookingForm),
            })
                .then((response) => response.json())
                .then((data) => {
                    setBookings((prevState) =>
                        prevState.map((booking) =>
                            booking._id === currentEditId ? data.booking : booking
                        )
                    );
                    setEditMode(false);
                    setCurrentEditId(null);
                    resetBookingForm();
                    setShowModal(false);
                    window.location.reload();
                })
                .catch((error) => console.error('Error updating booking:', error));
        } else {
            fetch(`${ip}/api/ground/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBookingForm),
            })
                .then((response) => response.json())
                .then((data) => {
                    setBookings((prevState) => [...prevState, data.booking]);
                    resetBookingForm();
                    setShowModal(false);
                    window.location.reload();
                })
                .catch((error) => console.error('Error creating booking:', error));
        }
    };

    const resetBookingForm = () => {
        setBookingForm({
            name: '',
            mobile_no: '',
            date: '',
            ground: '',
            payment_method: '',
            payment_status: 'Pending',
            status: true,
            description: '',
            advance: 0,
            advpaymentmode: '',
            plan_id: '',
            started: false,
            ended: false,
            amount: 0,
        });
    };

    const formatDateTime = (dateTime) => moment(dateTime).format('DD-MM-YYYY HH:mm:ss');

    return (
        <div className='p-0 md:p-6 w-full mx-auto'>
            {/*<h3 className="text-lg font-semibold text-gray-700 mb-4">Ground Management</h3>*/}
            <button
                onClick={() => {
                    setShowModal(true);
                    setEditMode(false);
                    resetBookingForm();
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            >
                Create Booking
            </button>

            {/* Calendar View Backup*/}
            {/*<div className="mb-8 bg-white rounded-lg shadow-lg p-6 border border-gray-100">*/}
            {/*    <div className="flex items-center justify-between mb-6">*/}
            {/*        <h4 className="text-lg font-semibold text-gray-800">Calendar View</h4>*/}
            {/*        <div className="flex items-center space-x-6">*/}
            {/*            <div className="flex items-center">*/}
            {/*                <div className="w-4 h-4 bg-blue-600 rounded-md mr-2 shadow-sm"></div>*/}
            {/*                <span className="text-sm text-gray-600">Ground A</span>*/}
            {/*            </div>*/}
            {/*            <div className="flex items-center">*/}
            {/*                <div className="w-4 h-4 bg-emerald-600 rounded-md mr-2 shadow-sm"></div>*/}
            {/*                <span className="text-sm text-gray-600">Ground B</span>*/}
            {/*            </div>*/}
            {/*            <div className="flex items-center">*/}
            {/*                <div className="w-4 h-4 bg-blue-600 rounded-md mr-2 shadow-sm" style={{*/}
            {/*                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.3) 5px, rgba(255,255,255,0.3) 10px)'*/}
            {/*                }}></div>*/}
            {/*                <span className="text-sm text-gray-600">Half Day Ground A</span>*/}
            {/*            </div>*/}
            {/*            <div className="flex items-center">*/}
            {/*                <div className="w-4 h-4 bg-emerald-600 rounded-md mr-2 shadow-sm" style={{*/}
            {/*                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.3) 5px, rgba(255,255,255,0.3) 10px)'*/}
            {/*                }}></div>*/}
            {/*                <span className="text-sm text-gray-600">Half Day Ground B</span>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="h-[600px]">*/}
            {/*        <Calendar*/}
            {/*            localizer={localizer}*/}
            {/*            events={calendarEvents}*/}
            {/*            startAccessor="start"*/}
            {/*            endAccessor="end"*/}
            {/*            views={['month', 'week', 'day']}*/}
            {/*            defaultView="month"*/}
            {/*            eventPropGetter={eventStyleGetter}*/}
            {/*            components={{*/}
            {/*                toolbar: CustomToolbar,*/}
            {/*                event: EventComponent*/}
            {/*            }}*/}
            {/*            popup*/}
            {/*            selectable*/}
            {/*            onSelectSlot={(slotInfo) => {*/}
            {/*                setShowModal(true);*/}
            {/*                setEditMode(false);*/}
            {/*                resetBookingForm();*/}
            {/*                setBookingForm(prev => ({*/}
            {/*                    ...prev,*/}
            {/*                    date: moment(slotInfo.start).format('YYYY-MM-DD')*/}
            {/*                }));*/}
            {/*            }}*/}
            {/*            onSelectEvent={(event) => {*/}
            {/*                const booking = event.resource;*/}
            {/*                handleEditBooking(booking);*/}
            {/*            }}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*</div>*/}


            <div className="min-h-screen bg-transparent p-4">
                <div className="mb-8 bg-white rounded-lg shadow-lg p-4 sm:p-6 border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                        <h4 className="text-lg font-semibold text-gray-800">Calendar View</h4>
                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:space-x-6">
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-blue-600 rounded-md mr-2 shadow-sm"></div>
                                <span className="text-sm text-gray-600">Ground A</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-emerald-600 rounded-md mr-2 shadow-sm"></div>
                                <span className="text-sm text-gray-600">Ground B</span>
                            </div>
                            <div className="flex items-center">
                                <div
                                    className="w-4 h-4 bg-blue-600 rounded-md mr-2 shadow-sm"
                                    style={{
                                        backgroundImage:
                                            'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.3) 5px, rgba(255,255,255,0.3) 10px)',
                                    }}
                                ></div>
                                <span className="text-sm text-gray-600">Half Day A</span>
                            </div>
                            <div className="flex items-center">
                                <div
                                    className="w-4 h-4 bg-emerald-600 rounded-md mr-2 shadow-sm"
                                    style={{
                                        backgroundImage:
                                            'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.3) 5px, rgba(255,255,255,0.3) 10px)',
                                    }}
                                ></div>
                                <span className="text-sm text-gray-600">Half Day B</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[600px] overflow-hidden">
                        <Calendar
                            localizer={localizer}
                            events={calendarEvents}
                            startAccessor="start"
                            endAccessor="end"
                            views={['month', 'week', 'day']}
                            defaultView="month"
                            eventPropGetter={eventStyleGetter}
                            components={{
                                toolbar: CustomToolbar,
                                event: EventComponent,
                            }}
                            popup
                            selectable
                            onSelectSlot={(slotInfo) => {
                                setShowModal(true);
                                setEditMode(false);
                                resetBookingForm();
                                setBookingForm((prev) => ({
                                    ...prev,
                                    date: moment(slotInfo.start).format('YYYY-MM-DD'),
                                }));
                            }}
                            onSelectEvent={(event) => {
                                const booking = event.resource;
                                handleEditBooking(booking);
                            }}
                            className="rounded-lg"
                        />
                    </div>
                </div>
            </div>


            {/* Filter Buttons */}
            <div className="flex space-x-4 mb-4">
                <button
                    onClick={() => setFilterGround("ALL")}
                    className={`px-4 py-2 rounded ${filterGround === "ALL" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilterGround("GROUND-A")}
                    className={`px-4 py-2 rounded ${filterGround === "GROUND-A" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
                >
                    Ground A
                </button>
                <button
                    onClick={() => setFilterGround("GROUND-B")}
                    className={`px-4 py-2 rounded ${filterGround === "GROUND-B" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
                >
                    Ground B
                </button>
                <button
                    onClick={() => setFilterGround("PAST")}
                    className={`px-4 py-2 rounded ${filterGround === "PAST" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
                >
                    Past Bookings
                </button>
                <button
                    onClick={() => setFilterGround("UPCOMING")}
                    className={`px-4 py-2 rounded ${filterGround === "UPCOMING" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
                >
                    Upcoming Bookings
                </button>
            </div>

            <div className="mb-4">
                <label className="mr-2">Filter by Date:</label>
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md"
                />
            </div>


            {/*BACKUP*/}
            {/*<div className='h-[70vh] overflow-y-auto'>*/}
            {/*    <h4 className="text-md font-semibold text-gray-700 mb-2">Bookings</h4>*/}
            {/*    <table className="w-full border">*/}
            {/*        <thead>*/}
            {/*        <tr>*/}
            {/*            <th className="border px-4 py-2">Name</th>*/}
            {/*            <th className="border px-4 py-2">Mobile</th>*/}
            {/*            <th className="border px-4 py-2">Ground</th>*/}
            {/*            <th className="border px-4 py-2">Start Date</th>*/}
            {/*            <th className="border px-4 py-2">End Date</th>*/}
            {/*            <th className="border px-4 py-2">Due Amount</th>*/}
            {/*            /!*<th className="border px-4 py-2">Status</th>*!/*/}
            {/*            <th className="border px-4 py-2">Actions</th>*/}
            {/*        </tr>*/}
            {/*        </thead>*/}
            {/*        <tbody>*/}
            {/*        {filteredBookings.map((booking) => (*/}
            {/*            <tr key={booking._id}>*/}
            {/*                <td className="border px-4 py-2">{booking.name}</td>*/}
            {/*                <td className="border px-4 py-2">{booking.mobile_no}</td>*/}
            {/*                <td className="border px-4 py-2">{booking.ground}</td>*/}
            {/*                <td className="border px-4 py-2">{formatDateTime(booking.start_date)}</td>*/}
            {/*                <td className="border px-4 py-2">{formatDateTime(booking.end_date)}</td>*/}
            {/*                <td className="border px-4 py-2">Rs.{booking.leftover}</td>*/}
            {/*                /!*<td className="border px-4 py-2">{booking.status ? 'Active' : 'Inactive'}</td>*!/*/}
            {/*                <td className="border px-4 py-2 flex gap-2">*/}
            {/*                    <button*/}
            {/*                        onClick={() => handleMarkasPaid(booking._id, booking.leftover)}*/}
            {/*                        className={`bg-blue-500 text-white px-2 py-1 no-underline rounded hover:bg-blue-600 ${*/}
            {/*                            booking.leftover === 0 ? 'opacity-50 cursor-not-allowed' : ''*/}
            {/*                        }`}*/}
            {/*                        disabled={booking.leftover === 0}*/}
            {/*                    >*/}
            {/*                        Mark as Paid*/}
            {/*                    </button>*/}

            {/*                    <button*/}
            {/*                        onClick={() => handleEditBooking(booking)}*/}
            {/*                        className="bg-yellow-500 text-white px-2 py-1 no-underline rounded hover:bg-yellow-600"*/}
            {/*                    >*/}
            {/*                        Edit*/}
            {/*                    </button>*/}
            {/*                </td>*/}

            {/*            </tr>*/}
            {/*        ))}*/}
            {/*        </tbody>*/}
            {/*    </table>*/}
            {/*</div>*/}


            <div className="h-screen bg-gradient-to-br p-1 sm:p-2">
                <div className="max-w-7xl mx-auto bg-white rounded-xl overflow-hidden">
                    <div className="p-4 sm:p-6">
                        <h4 className="text-xl font-semibold text-gray-800 text-center">Bookings</h4>
                    </div>

                    <div className="overflow-x-auto overflow-y-auto hidden sm:block">
                        <div className="inline-block min-w-full align-middle">
                            <div>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col"
                                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name
                                            </th>
                                            <th scope="col"
                                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile
                                            </th>
                                            <th scope="col"
                                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ground
                                            </th>
                                            <th scope="col"
                                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start
                                                Date
                                            </th>
                                            <th scope="col"
                                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End
                                                Date
                                            </th>
                                            <th scope="col"
                                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due
                                                Amount
                                            </th>
                                            <th scope="col"
                                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredBookings.map((booking) => (
                                            <tr
                                                key={booking._id}
                                                className="hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.name}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{booking.mobile_no}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{booking.ground}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(booking.start_date)}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(booking.end_date)}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                                    <span className="font-medium text-gray-900">
                                                        ₹{booking.leftover.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleMarkasPaid(booking._id, booking.leftover)}
                                                            disabled={booking.leftover === 0}
                                                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white 
                              ${booking.leftover === 0
                                                                    ? 'bg-gray-300 cursor-not-allowed'
                                                                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                                                } transition-colors duration-200`}
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                            Mark as Paid
                                                        </button>

                                                        <button
                                                            onClick={() => handleEditBooking(booking)}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white
                              bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                                        >
                                                            <Edit2 className="w-4 h-4 mr-1" />
                                                            Edit
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Responsive card view for mobile */}
                    <div className="block sm:hidden">
                        {filteredBookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-white p-2 md:p-4 rounded-lg shadow-sm mb-4 border border-gray-200"
                            >
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-gray-500">Name</span>
                                        <span className="text-sm text-gray-900">{booking.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-gray-500">Mobile</span>
                                        <span className="text-sm text-gray-900">{booking.mobile_no}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-gray-500">Ground</span>
                                        <span className="text-sm text-gray-900">{booking.ground}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-gray-500">Start Date</span>
                                        <span
                                            className="text-sm text-gray-900">{formatDateTime(booking.start_date)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-gray-500">End Date</span>
                                        <span
                                            className="text-sm text-gray-900">{formatDateTime(booking.end_date)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-gray-500">Due Amount</span>
                                        <span
                                            className="text-sm font-medium text-gray-900">₹{booking.leftover.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            onClick={() => handleMarkasPaid(booking._id, booking.leftover)}
                                            disabled={booking.leftover === 0}
                                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white 
                      ${booking.leftover === 0
                                                    ? 'bg-gray-300 cursor-not-allowed'
                                                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                                } transition-colors duration-200`}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Mark as Paid
                                        </button>

                                        <button
                                            onClick={() => handleEditBooking(booking)}
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white
                      bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                        >
                                            <Edit2 className="w-4 h-4 mr-1" />
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
                        >
                            <option value="" disabled>Select Payment Method</option>
                            <option value="CASH">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="CARD">Card</option>
                            <option value="CHEQUE">Cheque</option>
                            <option value="NET BANKING">Net Banking</option>
                            <option value="DEMAND DRAFT">Demand Draft</option>
                        </select>

                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={markAsPaidAmount}
                            onChange={(e) => setMarkAsPaidAmount(e.target.value)}
                            className="mt-1 mb-2 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmPayment}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg md:w-1/2 max-h-[90%] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {editMode ? "Edit Booking" : "Create New Booking"}
                            </h2>

                            {/* Mark as Paid Button (Only in Edit Mode) */}
                            {/* Mark as Paid Button (Only in Edit Mode) */}
                            {editMode && (
                                <button
                                    onClick={() => handleMarkasPaid(bookingForm._id, bookingForm.leftover)}
                                    disabled={bookingForm.leftover === 0}
                                    className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white 
                    ${bookingForm.leftover === 0
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                    } transition-colors duration-200`}
                                >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Mark as Paid
                                </button>
                            )}
                        </div>

                        {editMode && (
                            <>
                                <h3 className="text-lg font-semibold mb-2">Transactions</h3>
                                {transactions.length > 0 ? (
                                    <table className="w-full border">
                                        <thead>
                                        <tr>
                                            <th className="border px-4 py-2">Payment Method</th>
                                            <th className="border px-4 py-2">Amount</th>
                                            <th className="border px-4 py-2">Date</th>
                                            <th className="border px-4 py-2">Description</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {transactions.map((transaction, index) => (
                                            <tr key={index}>
                                                <td className="border px-4 py-2">{transaction.method}</td>
                                                <td className="border px-4 py-2">{transaction.amount}</td>
                                                <td className="border px-4 py-2">
                                                    {moment(transaction.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                                                </td>
                                                <td className="border px-4 py-2">{transaction.description}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No transactions found for this booking.</p>
                                )}
                            </>
                        )}

                        <form onSubmit={handleSubmitBooking}>
                            <div className="mb-4">
                                <label className="block text-sm font-bold">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={bookingForm.name}
                                    onChange={handleBookingChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold">Mobile No:</label>
                                <input
                                    type="number"
                                    name="mobile_no"
                                    value={bookingForm.mobile_no}
                                    onChange={handleBookingChange}
                                    className="border p-2 w-full border-gray-400 rounded mt-1"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-bold">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={bookingForm.date}
                                    onChange={handleBookingChange}
                                    className="border p-2 w-full border-gray-400 rounded mt-1"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold">Ground:</label>
                                <select
                                    name="ground"
                                    value={bookingForm.ground}
                                    onChange={handleBookingChange}
                                    className="border p-2 w-full border-gray-400 rounded mt-1"
                                >
                                    <option value="">Select Ground</option>
                                    <option value="GROUND-A">GROUND A</option>
                                    <option value="GROUND-B">GROUND B</option>
                                </select>
                            </div>


                            <div className="mb-4">
                                <label className="block text-sm font-bold">Plan</label>
                                <select
                                    name="plan_id"
                                    value={bookingForm.plan_id}
                                    onChange={handleBookingChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="">Select Plan</option>
                                    {filteredPlans.map((plan) => (
                                        <option key={plan._id} value={plan._id}>
                                            {plan.name} - {plan.sport} - {plan.amount} INR - {plan.from} - {plan.to}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <p className={`text-lg ${errorMessage ? 'text-red-500' : 'text-green-500'}`}>
                                {errorMessage || successMessage}
                            </p>

                            <div className="mb-4">
                                <label className="block text-sm font-bold">Amount:</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={bookingForm.amount}
                                    onChange={handleBookingChange}
                                    className="border p-2 w-full border-gray-400 rounded mt-1"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold">Payment Method:</label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={bookingForm.payment_method}
                                        className="border p-2 w-full border-gray-400 rounded mt-1 bg-gray-100"
                                        readOnly
                                    />
                                ) : (
                                    <select
                                        name="payment_method"
                                        value={bookingForm.payment_method}
                                        onChange={handleBookingChange}
                                        className="border p-2 w-full border-gray-400 rounded mt-1"
                                    >
                                        <option value="">Select Payment Method</option>
                                        <option value="CASH">CASH</option>
                                        <option value="UPI">UPI</option>
                                        <option value="CARD">CARD</option>
                                        <option value="NET BANKING">NET BANKING</option>
                                        <option value="CHEQUE">CHEQUE</option>
                                        <option value="DEMAND DRAFT">DEMAND DRAFT</option>
                                    </select>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-bold">Payment Status:</label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={bookingForm.payment_status}
                                        className="border p-2 w-full border-gray-400 rounded mt-1 bg-gray-100"
                                        readOnly
                                    />
                                ) : (
                                    <select
                                        name="payment_status"
                                        value={bookingForm.payment_status}
                                        onChange={handleBookingChange}
                                        className="border p-2 w-full border-gray-400 rounded mt-1"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Partial">Partial</option>
                                    </select>
                                )}
                            </div>
                            <div className='flex space-x-4 mt-6 mb-4'>
                                <label className="block text-sm font-bold">Status:</label>
                                <input
                                    type="checkbox"
                                    name="status"
                                    className='w-5'
                                    checked={bookingForm.status}
                                    onChange={() => setBookingForm((prevState) => ({
                                        ...prevState,
                                        status: !prevState.status
                                    }))}
                                />
                                <span>Active</span>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold">Description:</label>
                                <textarea
                                    name="description"
                                    value={bookingForm.description}
                                    onChange={handleBookingChange}
                                    className="border p-2 w-full border-gray-400 rounded mt-1"
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold">Advance:</label>
                                <input
                                    type="number"
                                    name="advance"
                                    value={bookingForm.advance}
                                    onChange={handleBookingChange}
                                    className={`border p-2 w-full border-gray-400 rounded mt-1 ${
                                        editMode ? 'bg-gray-100' : ''
                                    }`}
                                    readOnly={editMode}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-bold">Advance Payment Mode:</label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={bookingForm.advpaymentmode}
                                        className="border p-2 w-full border-gray-400 rounded mt-1 bg-gray-100"
                                        readOnly
                                    />
                                ) : (
                                    <select
                                        name="advpaymentmode"
                                        value={bookingForm.advpaymentmode}
                                        onChange={handleBookingChange}
                                        className="border p-2 w-full border-gray-400 rounded mt-1"
                                    >
                                        <option value="">Select Advance Payment Mode</option>
                                        <option value="CASH">CASH</option>
                                        <option value="UPI">UPI</option>
                                        <option value="CARD">CARD</option>
                                        <option value="NET BANKING">NET BANKING</option>
                                        <option value="CHEQUE">CHEQUE</option>
                                        <option value="DEMAND DRAFT">DEMAND DRAFT</option>
                                    </select>
                                )}
                            </div>

                            <div className='flex space-x-4 mt-6'>
                                <label className="block text-sm font-bold">Started:</label>
                                <input
                                    type="checkbox"
                                    name="started"
                                    className='w-5'
                                    checked={bookingForm.started}
                                    onChange={() => setBookingForm((prevState) => ({
                                        ...prevState,
                                        started: !prevState.started
                                    }))}
                                />
                            </div>
                            <div className='flex space-x-4 mt-6 '>
                                <label className="block text-sm font-bold">Ended:</label>
                                <input
                                    type="checkbox"
                                    name="ended"
                                    className='w-5'
                                    checked={bookingForm.ended}
                                    onChange={() => setBookingForm((prevState) => ({
                                        ...prevState,
                                        ended: !prevState.ended
                                    }))}
                                />
                            </div>


                            <div className="mt-6 flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    {editMode ? "Update Booking" : "Submit Booking"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroundManagement;
