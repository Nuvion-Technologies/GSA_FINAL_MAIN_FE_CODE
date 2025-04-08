// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Users, Clock, Search, UserCheck, UserX, Mail, Phone, Calendar, Shield } from 'lucide-react';
// import moment from 'moment';

// const AdminExtraPage = () => {
//     const [users, setUsers] = useState([]);
//     const [logs, setLogs] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [activeTab, setActiveTab] = useState('logs');
//     const [loading, setLoading] = useState(false);
//     const ip = import.meta.env.VITE_IP;

//     const userid = localStorage.getItem('userid') // Replace with actual user ID

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             const [usersResponse, logsResponse] = await Promise.all([
//                 axios.post(`${ip}/api/superuser/users`, { userid }),
//                 axios.post(`${ip}/api/superuser/logs`, { userid })
//             ]);

//             setUsers(usersResponse.data);
//             setLogs(logsResponse.data);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//         setLoading(false);
//     };

//     const filteredUsers = users.filter(user =>
//         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.mobile_no.includes(searchTerm)
//     );

//     const filteredLogs = logs.filter(log =>
//         log.description.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const getRoleColor = (role) => {
//         switch (role) {
//             case 'Manager':
//                 return 'bg-blue-100 text-blue-800';
//             case 'User':
//                 return 'bg-green-100 text-green-800';
//             default:
//                 return 'bg-gray-100 text-gray-800';
//         }
//     };

//     const getVerificationStatus = (isVerified) => {
//         return isVerified ? (
//             <span className="flex items-center text-green-600">
//         <UserCheck className="w-4 h-4 mr-1" />
//         Verified
//       </span>
//         ) : (
//             <span className="flex items-center text-red-600">
//         <UserX className="w-4 h-4 mr-1" />
//         Not Verified
//       </span>
//         );
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 p-6">
//             <div className="max-w-7xl mx-auto">
//                 <div className="mb-8">
//                     <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
//                     <p className="mt-2 text-gray-600">Manage users and monitor system logs</p>
//                 </div>

//                 <div className="bg-white rounded-lg shadow-sm mb-6">
//                     <div className="border-b border-gray-200">
//                         <div className="flex">
//                             <button
//                                 onClick={() => setActiveTab('users')}
//                                 className={`px-6 py-4 flex items-center ${
//                                     activeTab === 'users'
//                                         ? 'border-b-2 border-blue-500 text-blue-600'
//                                         : 'text-gray-500 hover:text-gray-700'
//                                 }`}
//                             >
//                                 <Users className="w-5 h-5 mr-2" />
//                                 Users
//                             </button>
//                             <button
//                                 onClick={() => setActiveTab('logs')}
//                                 className={`px-6 py-4 flex items-center ${
//                                     activeTab === 'logs'
//                                         ? 'border-b-2 border-blue-500 text-blue-600'
//                                         : 'text-gray-500 hover:text-gray-700'
//                                 }`}
//                             >
//                                 <Clock className="w-5 h-5 mr-2" />
//                                 System Logs
//                             </button>
//                         </div>
//                     </div>

//                     <div className="p-4">
//                         <div className="mb-4 relative">
//                             <input
//                                 type="text"
//                                 placeholder={`Search ${activeTab === 'users' ? 'users' : 'logs'}...`}
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             />
//                             <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
//                         </div>

//                         {loading ? (
//                             <div className="flex justify-center items-center h-64">
//                                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//                             </div>
//                         ) : activeTab === 'users' ? (
//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gray-50">
//                                     <tr>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                     </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                     {filteredUsers.map((user) => (
//                                         <tr key={user._id} className="hover:bg-gray-50 transition-colors">
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="flex items-center">
//                                                     <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
//                               <span className="text-xl font-medium text-gray-600">
//                                 {user.name.charAt(0)}
//                               </span>
//                                                     </div>
//                                                     <div className="ml-4">
//                                                         <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                                                         <div className="flex items-center text-sm text-gray-500">
//                                                             <Calendar className="w-4 h-4 mr-1" />
//                                                             {moment(user.date_of_birth).format('MMM D, YYYY')}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="text-sm text-gray-900 flex items-center mb-1">
//                                                     <Mail className="w-4 h-4 mr-2" />
//                                                     {user.email}
//                                                 </div>
//                                                 <div className="text-sm text-gray-500 flex items-center">
//                                                     <Phone className="w-4 h-4 mr-2" />
//                                                     {user.mobile_no}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//   <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.email === "shivam@nuviontech.com" ? "User":user.email === "mansuri.zahir@gmail.com" ? "Superuser":user.email === "dvij003@gmail.com" ? "Superuser"  : user.role)}`}>
//     <Shield className="w-3 h-3 inline mr-1" />
//       {user.email === "shivam@nuviontech.com" ? "User":user.email === "mansuri.zahir@gmail.com" ? "Superuser" :user.email === "dvij003@gmail.com" ? "Superuser"  : user.role}
//   </span>
//                                             </td>

//                                             <td className="px-6 py-4 whitespace-nowrap text-sm">
//                                                 {getVerificationStatus(user.isVerified)}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         ) : (
//                             <div className="space-y-4">
//                                 {filteredLogs.map((log) => (
//                                     <div
//                                         key={log._id}
//                                         className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
//                                     >
//                                         <div className="flex items-start justify-between">
//                                             <div className="flex items-center">
//                                                 <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
//                                                     <Clock className="w-4 h-4 text-blue-600" />
//                                                 </div>
//                                                 <div className="ml-3">
//                                                     <p className="text-sm font-medium text-gray-900">{log.description}</p>
//                                                     <p className="text-sm text-gray-500">
//                                                         {moment(log.createdAt).format('MMM D, YYYY HH:mm:ss')}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminExtraPage;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Clock, Search, UserCheck, UserX, Mail, Phone, Calendar, Shield, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import moment from 'moment';

const AdminExtraPage = () => {
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('logs');
    const [loading, setLoading] = useState(false);
    const [dateFilter, setDateFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const ip = import.meta.env.VITE_IP;

    const userid = localStorage.getItem('userid');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersResponse, logsResponse] = await Promise.all([
                axios.post(`${ip}/api/superuser/users`, { userid }),
                axios.post(`${ip}/api/superuser/logs`, { userid })
            ]);

            setUsers(usersResponse.data);
            setLogs(logsResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile_no.includes(searchTerm)
    );

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = !dateFilter || moment(log.createdAt).format('YYYY-MM-DD') === dateFilter;
        return matchesSearch && matchesDate;
    });

    const getRoleColor = (role) => {
        switch (role) {
            case 'Manager':
                return 'bg-blue-100 text-blue-800';
            case 'User':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getVerificationStatus = (isVerified) => {
        return isVerified ? (
            <span className="flex items-center text-green-600">
                <UserCheck className="w-4 h-4 mr-1" />
                Verified
            </span>
        ) : (
            <span className="flex items-center text-red-600">
                <UserX className="w-4 h-4 mr-1" />
                Not Verified
            </span>
        );
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen bg-transparent p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="mt-2 text-gray-600">Manage users and monitor system logs</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`px-6 py-4 flex items-center ${activeTab === 'users'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Users className="w-5 h-5 mr-2" />
                                Users
                            </button>
                            <button
                                onClick={() => setActiveTab('logs')}
                                className={`px-6 py-4 flex items-center ${activeTab === 'logs'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Clock className="w-5 h-5 mr-2" />
                                System Logs
                            </button>
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="mb-4 flex flex-wrap gap-4 items-center">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder={`Search ${activeTab === 'users' ? 'users' : 'logs'}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                            </div>

                            {activeTab === 'logs' && (
                                <>
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-5 h-5 text-gray-400" />
                                        <input
                                            type="date"
                                            value={dateFilter}
                                            onChange={(e) => setDateFilter(e.target.value)}
                                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value={25}>25 per page</option>
                                        <option value={50}>50 per page</option>
                                        <option value={100}>100 per page</option>
                                    </select>
                                </>
                            )}
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                            </div>
                        ) : activeTab === 'users' ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredUsers.map((user) => (
                                            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                            <span className="text-xl font-medium text-gray-600">
                                                                {user.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <Calendar className="w-4 h-4 mr-1" />
                                                                {moment(user.date_of_birth).format('MMM D, YYYY')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 flex items-center mb-1">
                                                        <Mail className="w-4 h-4 mr-2" />
                                                        {user.email}
                                                    </div>
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        <Phone className="w-4 h-4 mr-2" />
                                                        {user.mobile_no}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.email === "shivam@nuviontech.com" ? "User" : user.email === "mansuri.zahir@gmail.com" ? "Superuser" : user.email === "dvij003@gmail.com" ? "Superuser" : user.role)}`}>
                                                        <Shield className="w-3 h-3 inline mr-1" />
                                                        {user.email === "shivam@nuviontech.com" ? "User" : user.email === "mansuri.zahir@gmail.com" ? "Superuser" : user.email === "dvij003@gmail.com" ? "Superuser" : user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {getVerificationStatus(user.isVerified)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {/* Pagination */}
                                    <div className="my-4 flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLogs.length)} of {filteredLogs.length} entries
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => paginate(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                .filter(num => {
                                                    if (totalPages <= 5) return true;
                                                    if (num === 1 || num === totalPages) return true;
                                                    if (Math.abs(currentPage - num) <= 1) return true;
                                                    return false;
                                                })
                                                .map((number, index, array) => (
                                                    <React.Fragment key={number}>
                                                        {index > 0 && array[index - 1] !== number - 1 && (
                                                            <span className="text-gray-500">...</span>
                                                        )}
                                                        <button
                                                            onClick={() => paginate(number)}
                                                            className={`px-3 py-1 rounded-lg ${currentPage === number
                                                                ? 'bg-blue-600 text-white'
                                                                : 'text-gray-700 hover:bg-blue-50'
                                                                }`}
                                                        >
                                                            {number}
                                                        </button>
                                                    </React.Fragment>
                                                ))}
                                            <button
                                                onClick={() => paginate(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    {currentLogs.map((log) => (
                                        <div
                                            key={log._id}
                                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <Clock className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900">{log.description}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {moment(log.createdAt).format('MMM D, YYYY HH:mm:ss')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminExtraPage;