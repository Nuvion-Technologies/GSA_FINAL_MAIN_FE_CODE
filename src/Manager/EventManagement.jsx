import React, { useState, useEffect } from 'react';
import { Calendar, Edit, Trash2, Plus, X, MapPin, Users } from 'lucide-react';
import axios from "axios";

function EventManagement() {
    const [events, setEvents] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
    const [isAddParticipantModalOpen, setIsAddParticipantModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [currentEventParticipants, setCurrentEventParticipants] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(null);
    const ip = import.meta.env.VITE_IP;
    const userId = localStorage.getItem('userid') || '1';

    const [formData, setFormData] = useState({
        name: '',
        event_date: '',
        location: '',
        event_fee: '',
        event_logo: null
    });

    const [participantFormData, setParticipantFormData] = useState({
        name: '',
        email: '',
        mobile_no: '',
        payment_method: 'UPI',
        amount: ''
    });

    const fetchParticipants = async (eventId) => {
        try {
            const response = await axios.post(`${ip}/api/event/event-participants`, {
                eventid: eventId,
                userid: userId
            });
            setCurrentEventParticipants(response.data);
        } catch (error) {
            console.error('Error fetching participants:', error);
            alert('Failed to fetch participants');
        }
    };

    const handleAddParticipant = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${ip}/api/event/add-event-participants`, {
                ...participantFormData,
                eventid: selectedEventId,
                userid: userId
            });
            setIsAddParticipantModalOpen(false);
            setParticipantFormData({
                name: '',
                email: '',
                mobile_no: '',
                payment_method: 'UPI',
                amount: ''
            });
            fetchParticipants(selectedEventId);
        } catch (error) {
            console.error('Error adding participant:', error);
            alert('Failed to add participant');
        }
    };

    const handleParticipantsClick = async (eventId) => {
        setSelectedEventId(eventId);
        await fetchParticipants(eventId);
        setIsParticipantsModalOpen(true);
    };

    // Fetch events
    const fetchEvents = async () => {
        if (!ip) {
            setError('API URL is not configured');
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post(`${ip}/api/event/events`, {
                userid: userId
            });
            setEvents(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching events:', error);
            setError('Failed to load events. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [ip]);

    // Add new event
    const handleAddEvent = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('event_date', formData.event_date);
            formDataToSend.append('location', formData.location);
            formDataToSend.append('event_fee', formData.event_fee);
            formDataToSend.append('userid', userId);
            if (formData.event_logo) {
                formDataToSend.append('photo', formData.event_logo); // Change 'event_logo' to 'photo'
            }

            const response = await axios.post(`${ip}/api/event/add-new-event`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            setIsAddModalOpen(false);
            setFormData({ name: '', event_date: '', location: '', event_fee: '', event_logo: null });
            setEvents(prev => [...prev, response.data]);
        } catch (error) {
            console.error('Error adding event:', error);
            alert('Failed to add event. Please try again.');
        }
    };


    // Edit event
    const handleEditEvent = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('event_date', formData.event_date);
            formDataToSend.append('location', formData.location);
            formDataToSend.append('event_fee', formData.event_fee);
            formDataToSend.append('eventid', currentEvent._id);
            formDataToSend.append('userid', userId);
            if (formData.event_logo) {
                formDataToSend.append('photo', formData.event_logo); // Change 'event_logo' to 'photo'
            }

            await axios.post(`${ip}/api/event/edit-event`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            setIsEditModalOpen(false);
            setCurrentEvent(null);
            setFormData({ name: '', event_date: '', location: '', event_fee: '', event_logo: null });
            fetchEvents();
        } catch (error) {
            console.error('Error editing event:', error);
            alert('Failed to edit event. Please try again.');
        }
    };


    const handleEditClick = (event) => {
        setCurrentEvent(event);
        setFormData({
            name: event.name,
            event_date: new Date(event.event_date).toISOString().split('T')[0],
            location: event.location,
            event_fee: event.event_fee.toString(),
            event_logo: null
        });
        setIsEditModalOpen(true);
    };


    // Toggle event status
    const handleToggleStatus = async (eventId) => {
        setIsUpdating(eventId);
        try {
            await axios.post(`${ip}/api/event/status-event`, {
                eventid: eventId,
                userid: userId,
            });
            setEvents(prev => prev.map(event =>
                event._id === eventId
                    ? { ...event, status: !event.status }
                    : event
            ));
        } catch (error) {
            console.error('Error toggling status:', error);
            alert('Failed to update status. Please try again.');
            fetchEvents();
        } finally {
            setIsUpdating(null);
        }
    };

    // Delete event with animation
    const handleDeleteEvent = async (event) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                setEvents(prev => prev.filter(e => e._id !== event._id));

                await axios.post(`${ip}/api/event/delete-event`, {
                    eventid: event._id,
                    userid: userId,
                    event_date: event.event_date,
                    event_fee: event.event_fee,
                    location: event.location,
                    name: event.name,
                });
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Failed to delete event. Please try again.');
                fetchEvents();
            }
        }
    };


    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-pulse text-lg text-gray-600">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                    <p className="text-lg text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchEvents}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 ease-in-out"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent p-0 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    {/*<h1 className="text-3xl font-bold text-gray-800 hover:text-gray-700 transition-colors duration-200">*/}
                    {/*    Event Management*/}
                    {/*</h1>*/}
                    <p className="text-gray-600 mt-1">Manage and organize your Event content</p>
                    <button
                        onClick={() => {
                            setIsAddModalOpen(true)
                            setFormData({
                                name: '',
                                event_date: '',
                                location: '',
                                event_fee: '',
                                event_logo: null,
                            });
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                    >
                        <Plus size={20} /> Add Event
                    </button>
                </div>

                {events.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No events found. Create your first event!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => (
                            <div
                                key={event._id}
                                className="group bg-white rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                            >
                                <div className="relative h-48 overflow-hidden bg-gray-100">
                                    <img
                                        src={`${ip}/uploads/${event.event_logo}`}
                                        alt={event.name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `${ip}/uploads/${event.event_logo}`;
                                        }}
                                    />
                                </div>

                                <div className="p-6">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold text-gray-800 truncate max-w-[80%]">
                                            {event.name}
                                        </h3>
                                        <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full">
                                            <Users size={14} className="text-blue-600" />
                                            <span className="text-sm font-medium text-blue-600">{event.count}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar size={16} />
                                            <span className="text-sm">
                                                {new Date(event.event_date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-blue-50 rounded-lg">
                                                    <MapPin size={18} className="text-blue-600" />
                                                </div>
                                                <span className="text-gray-600">{event.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm text-gray-500">Fee:</span>
                                                <span className="text-lg font-bold text-gray-800">₹{event.event_fee}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <button
                                                onClick={() => handleToggleStatus(event._id)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${event.status
                                                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${event.status ? 'bg-green-500' : 'bg-red-500'
                                                        }`} />
                                                    {event.status ? 'Active' : 'Inactive'}
                                                </div>
                                            </button>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                                                    onClick={() => handleParticipantsClick(event._id)}
                                                >
                                                    <Users size={18} />
                                                </button>
                                                <button
                                                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                                                    onClick={() => handleEditClick(event)}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                                                    onClick={() => handleDeleteEvent(event)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Event Modal */}
                {isAddModalOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
                        <div
                            className="bg-white rounded-xl p-8 w-full max-w-md transform transition-all duration-200 animate-slideIn shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Add New Event</h2>
                                    <p className="text-sm text-gray-500 mt-1">Fill in the details for your new event</p>
                                </div>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleAddEvent} className="space-y-6">
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Event Logo
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    event_logo: e.target.files ? e.target.files[0] : null
                                                })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Event Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                                                placeholder="Enter event name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Date
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={formData.event_date}
                                                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Location
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                                                placeholder="Enter event location"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Event Fee (₹)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={formData.event_fee}
                                                onChange={(e) => setFormData({ ...formData, event_fee: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                                                placeholder="Enter event fee"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] font-medium shadow-md hover:shadow-lg"
                                    >
                                        Create Event
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Event Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
                        <div
                            className="bg-white rounded-xl p-8 w-full max-w-md transform transition-all duration-200 animate-slideIn shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Edit Event</h2>
                                    <p className="text-sm text-gray-500 mt-1">Update the event details</p>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleEditEvent} className="space-y-6">
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Event Logo
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    event_logo: e.target.files ? e.target.files[0] : null
                                                })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Event Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    name: e.target.value
                                                })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                                                placeholder="Enter event name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Date
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={formData.event_date}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    event_date: e.target.value
                                                })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Location
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    location: e.target.value
                                                })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                                                placeholder="Enter event location"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Event Fee (₹)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={formData.event_fee}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    event_fee: e.target.value
                                                })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                                                placeholder="Enter event fee"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] font-medium shadow-md hover:shadow-lg"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Participants Modal */}
                {isParticipantsModalOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
                        <div
                            className="bg-white rounded-xl p-8 w-full max-w-2xl transform transition-all duration-200 animate-slideIn shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Event Participants</h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Total Participants: {currentEventParticipants.length}
                                        {currentEventParticipants.length === 1 ? ' person' : ' people'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsParticipantsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Rest of the modal content remains the same */}


                            <div className="mb-4">
                                <button
                                    onClick={() => setIsAddParticipantModalOpen(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-200"
                                >
                                    <Plus size={20} /> Add Participant
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentEventParticipants.map((participant) => (
                                            <tr key={participant._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{participant.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.mobile_no}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${participant.payment_done
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {participant.payment_done ? 'Paid' : 'Pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Participant Modal */}
                {isAddParticipantModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
                        <div className="bg-white rounded-xl p-8 w-full max-w-md transform transition-all duration-200 animate-slideIn shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Add Participant</h2>
                                    <p className="text-sm text-gray-500 mt-1">Enter participant details</p>
                                </div>
                                <button
                                    onClick={() => setIsAddParticipantModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleAddParticipant} className="space-y-6">
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={participantFormData.name}
                                            onChange={(e) => setParticipantFormData({ ...participantFormData, name: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={participantFormData.email}
                                            onChange={(e) => setParticipantFormData({ ...participantFormData, email: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Mobile Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={participantFormData.mobile_no}
                                            onChange={(e) => setParticipantFormData({ ...participantFormData, mobile_no: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Payment Method
                                        </label>
                                        <select
                                            value={participantFormData.payment_method}
                                            onChange={(e) => setParticipantFormData({ ...participantFormData, payment_method: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            required
                                        >
                                            <option value="UPI">UPI</option>
                                            <option value="Cash">Cash</option>
                                            <option value="Card">Card</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Amount
                                        </label>
                                        <input
                                            type="number"
                                            value={participantFormData.amount}
                                            onChange={(e) => setParticipantFormData({ ...participantFormData, amount: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddParticipantModalOpen(false)}
                                        className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                                    >
                                        Add Participant
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventManagement;
