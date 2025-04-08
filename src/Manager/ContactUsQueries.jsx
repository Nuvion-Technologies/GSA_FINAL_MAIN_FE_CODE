import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, Trash2, Mail, Phone, Clock, AlertCircle, X } from 'lucide-react';

const ContactUsQueries = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);
    const ip = import.meta.env.VITE_IP;

    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`${ip}/api/other/get-queries`, {
                userid: localStorage.getItem('userid')
            });
            setQueries(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch queries. Please try again later.');
            console.error('Error fetching queries:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (!confirmAction) return;
        try {
            await axios.post(confirmAction.api, {
                userid: localStorage.getItem('userid'),
                queryid: confirmAction.queryId
            });
            setConfirmAction(null); // Close the popup
            fetchQueries(); // Refresh the queries list
        } catch (err) {
            console.error(`Error ${confirmAction.type} query:`, err);
            setError(`Failed to ${confirmAction.type} query. Please try again.`);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-2 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Contact Us Queries</h1>
                <span className="bg-indigo-100 text-indigo-800 text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1 rounded-full">
                {queries.length} Queries
            </span>
            </div>

            {error && (
                <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center text-sm sm:text-base">
                    <AlertCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                    {error}
                </div>
            )}

            <div className="grid gap-3 sm:gap-4 md:gap-6">
                {queries.map((query) => (
                    <div key={query._id} className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 transition-all hover:shadow-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <div className="w-full sm:w-auto">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800">{query.name}</h3>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-2 text-gray-600 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Mail className="w-4 h-4" />
                                        <a href={`mailto:${query.email}`} className="hover:text-indigo-600 break-all">
                                            {query.email}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Phone className="w-4 h-4" />
                                        <a href={`tel:${query.mobile_no}`} className="hover:text-indigo-600">
                                            {query.mobile_no}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 self-end sm:self-start">
                                <button
                                    onClick={() =>
                                        setConfirmAction({
                                            type: 'resolve',
                                            queryId: query._id,
                                            api: `${ip}/api/other/resolve-query`
                                        })
                                    }
                                    className={`p-2 rounded-full transition-colors ${
                                        query.active
                                            ? 'text-green-600 hover:bg-green-50'
                                            : 'text-gray-400 cursor-not-allowed'
                                    }`}
                                    title={query.active ? "Mark as Resolved" : "Already Resolved"}
                                    disabled={!query.active}
                                >
                                    <Check className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() =>
                                        setConfirmAction({
                                            type: 'delete',
                                            queryId: query._id,
                                            api: `${ip}/api/other/delete-query`
                                        })
                                    }
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete Query"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4 bg-gray-50 p-3 sm:p-4 rounded-lg">
                            {query.description}
                        </p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>
                                Received on {new Date(query.createdAt).toLocaleDateString()} at{' '}
                                    {new Date(query.createdAt).toLocaleTimeString()}
                            </span>
                            </div>

                            <div>
                                {query.active ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Active
                                </span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Resolved
                                </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {queries.length === 0 && !error && (
                    <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
                        <Mail className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No queries</h3>
                        <p className="mt-1 text-xs sm:text-sm text-gray-500">No contact queries have been received yet.</p>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {confirmAction && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 p-4">
                    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                                Confirm {confirmAction.type === 'resolve' ? 'Resolution' : 'Deletion'}
                            </h2>
                            <button
                                onClick={() => setConfirmAction(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600">
                            Are you sure you want to {confirmAction.type} this query?
                        </p>
                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmAction(null)}
                                className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-3 sm:px-4 py-2 text-sm sm:text-base text-white rounded-lg bg-red-600 hover:bg-red-700 transition"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactUsQueries;
