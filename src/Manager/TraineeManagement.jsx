// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const TraineeManagement = () => {
//     const ip = import.meta.env.VITE_IP;
//     const [trainees, setTrainees] = useState([]);
//     const [showTraineePopup, setShowTraineePopup] = useState(false);
//     const [editingTrainee, setEditingTrainee] = useState(null);
//     const [traineeFormData, setTraineeFormData] = useState({
//         name: '',
//         father: '',
//         dob: '',
//         address: '',
//         phone: '',
//         plan_id: '',
//         active: true,
//         photo: null,
//     });

//     useEffect(() => {
//         fetchTrainees();
//     }, []);

//     const fetchTrainees = async () => {
//         try {
//             const response = await axios.get(`${ip}/api/academy/trainees`);
//             setTrainees(response.data);
//         } catch (error) {
//             console.error("Error fetching trainees:", error);
//         }
//     };

//     const handleTraineeInputChange = (e) => {
//         const { name, value, files } = e.target;
//         setTraineeFormData({
//             ...traineeFormData,
//             [name]: files ? files[0] : value,
//         });
//     };

//     const handleTraineeSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         for (const key in traineeFormData) {
//             formData.append(key, traineeFormData[key]);
//         }

//         try {
//             if (editingTrainee) {
//                 await axios.put(`${ip}/api/academy/trainee/${editingTrainee._id}`, formData);
//             } else {
//                 await axios.post(`${ip}/api/academy/trainee`, formData);
//             }
//             fetchTrainees();
//             setShowTraineePopup(false);
//             setEditingTrainee(null);
//         } catch (error) {
//             console.error("Error submitting trainee data:", error);
//         }
//     };

//     const toggleTraineeActive = async (id) => {
//         try {
//             await axios.patch(`${ip}/api/academy/trainee/${id}/toggle`);
//             fetchTrainees();
//         } catch (error) {
//             console.error("Error toggling trainee status:", error);
//         }
//     };

//     const generateIdCard = async (id) => {
//         try {
//             await axios.post(`${ip}/api/academy/trainee/${id}/generate-id`);
//             fetchTrainees();
//         } catch (error) {
//             console.error("Error generating ID card:", error);
//         }
//     };

//     const openTraineePopup = (trainee = null) => {
//         setEditingTrainee(trainee);
//         setTraineeFormData(
//             trainee || {
//                 name: '',
//                 father: '',
//                 dob: '',
//                 address: '',
//                 phone: '',
//                 plan_id: '',
//                 active: true,
//                 photo: null,
//             }
//         );
//         setShowTraineePopup(true);
//     };

//     return (
//         <div className="p-4">
//             <h3 className="text-lg font-semibold text-gray-700 mb-4">Trainee Management</h3>
//             <button
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 onClick={() => openTraineePopup()}
//             >
//                 Add Trainee
//             </button>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
//                 {trainees.map((trainee) => (
//                     <div key={trainee._id} className="border p-4 rounded shadow">
//                         {trainee.photo && (
//                            <img
//                            src={`data:image/png;base64,${trainee.photo}`}
//                            alt={trainee.name}
//                            className="w-full h-32 object-cover rounded mb-2"
//                        />
//                         )}
//                         <h4 className="font-semibold">{trainee.name}</h4>
//                         <p>Father: {trainee.father}</p>
//                         <p>Phone: {trainee.phone}</p>
//                         <p>Plan: {trainee.plan_id}</p>
//                         <div className="flex justify-between mt-2">
//                             <button
//                                 className={`px-4 py-2 ${trainee.active ? 'bg-red-500' : 'bg-green-500'} text-white rounded`}
//                                 onClick={() => toggleTraineeActive(trainee._id)}
//                             >
//                                 {trainee.active ? 'Deactivate' : 'Activate'}
//                             </button>
//                             <button
//                                 className="px-4 py-2 bg-yellow-500 text-white rounded"
//                                 onClick={() => openTraineePopup(trainee)}
//                             >
//                                 Edit
//                             </button>
//                             <button
//                                 className="px-4 py-2 bg-blue-500 text-white rounded"
//                                 onClick={() => generateIdCard(trainee._id)}
//                             >
//                                 Generate ID
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             {showTraineePopup && (
//                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-auto">
//                     <div className="bg-white p-6 rounded shadow-md w-96 max-h-[90%] overflow-y-auto">
//                         <h3 className="text-lg font-semibold mb-4">
//                             {editingTrainee ? 'Edit Trainee' : 'Add Trainee'}
//                         </h3>
//                         <form onSubmit={handleTraineeSubmit}>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     value={traineeFormData.name}
//                                     onChange={handleTraineeInputChange}
//                                     className="mt-1 block w-full p-2 border border-gray-300 rounded"
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700">Photo</label>
//                                 <input
//                                     type="file"
//                                     name="photo"
//                                     onChange={handleTraineeInputChange}
//                                     className="mt-1 block w-full"
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700">Father</label>
//                                 <input
//                                     type="text"
//                                     name="father"
//                                     value={traineeFormData.father}
//                                     onChange={handleTraineeInputChange}
//                                     className="mt-1 block w-full p-2 border border-gray-300 rounded"
//                                 />
//                             </div>
//                             <div className="flex justify-end">
//                                 <button
//                                     type="button"
//                                     className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
//                                     onClick={() => setShowTraineePopup(false)}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="px-4 py-2 bg-blue-500 text-white rounded"
//                                 >
//                                     {editingTrainee ? 'Update' : 'Add'}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default TraineeManagement;

















// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const TraineeManagement = () => {
//     const ip = import.meta.env.VITE_IP;
//     const [trainees, setTrainees] = useState([]);
//     const [showTraineePopup, setShowTraineePopup] = useState(false);
//     const [editingTrainee, setEditingTrainee] = useState(null);
//     const [traineeFormData, setTraineeFormData] = useState({
//         name: '',
//         father: '',
//         dob: '',
//         address: '',
//         phone: '',
//         plan_id: '',
//         active: true,
//         photo: null,
//     });

//     useEffect(() => {
//         fetchTrainees();
//     }, []);

//     const fetchTrainees = async () => {
//         try {
//             const response = await axios.get(`${ip}/api/academy/trainees`);
//             setTrainees(response.data);
//         } catch (error) {
//             console.error("Error fetching trainees:", error);
//         }
//     };

//     const handleTraineeInputChange = (e) => {
//         const { name, value, files } = e.target;
//         setTraineeFormData({
//             ...traineeFormData,
//             [name]: files ? files[0] : value,
//         });
//     };

//     const handleTraineeSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         for (const key in traineeFormData) {
//             formData.append(key, traineeFormData[key]);
//         }

//         try {
//             if (editingTrainee) {
//                 await axios.put(`${ip}/api/academy/trainee/${editingTrainee._id}`, formData);
//             } else {
//                 await axios.post(`${ip}/api/academy/trainee`, formData);
//             }
//             fetchTrainees();
//             setShowTraineePopup(false);
//             setEditingTrainee(null);
//         } catch (error) {
//             console.error("Error submitting trainee data:", error);
//         }
//     };

//     const toggleTraineeActive = async (id) => {
//         try {
//             await axios.patch(`${ip}/api/academy/trainee/${id}/toggle`);
//             fetchTrainees();
//         } catch (error) {
//             console.error("Error toggling trainee status:", error);
//         }
//     };

//     const generateIdCard = async (id) => {
//         try {
//             await axios.post(`${ip}/api/academy/trainee/${id}/generate-id`);
//             fetchTrainees();
//         } catch (error) {
//             console.error("Error generating ID card:", error);
//         }
//     };

//     const openTraineePopup = (trainee = null) => {
//         setEditingTrainee(trainee);
//         setTraineeFormData(
//             trainee || {
//                 name: '',
//                 father: '',
//                 dob: '',
//                 address: '',
//                 phone: '',
//                 plan_id: '',
//                 active: true,
//                 photo: null,
//             }
//         );
//         setShowTraineePopup(true);
//     };

//     return (
// <div className="bg-white mt-8">
// <h3 className="text-2xl font-bold text-gray-800 mb-6">
//         Traniee Management
//       </h3>

//   {/* Add Trainee Button */}
//   <button
// className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
//     onClick={() => openTraineePopup()}
//   >
//     Add Trainee
//   </button>

//   {/* Trainee Cards */}
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//     {trainees.map((trainee) => (
//       <div key={trainee._id} className="border p-5 rounded-lg shadow-lg transition-all hover:shadow-xl">
//         {trainee.photo && (
//           <img
//             src={`data:image/png;base64,${trainee.photo}`}
//             alt={trainee.name}
//             className="w-full h-36 object-cover rounded-t-md mb-4"
//           />
//         )}
//         <h4 className="text-lg font-semibold text-gray-800">{trainee.name}</h4>
//         <p className="text-gray-600 mt-2">Father: {trainee.father}</p>
//         <p className="text-gray-600 mt-1">Phone: {trainee.phone}</p>
//         <p className="text-gray-600 mt-1">Plan: {trainee.plan_id}</p>

//         <div className="flex justify-between mt-4">
//           {/* Deactivate/Activate Button */}
//           <button
//             className={`px-4 py-2 text-white rounded-md ${trainee.active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} transition-colors`}
//             onClick={() => toggleTraineeActive(trainee._id)}
//           >
//             {trainee.active ? 'Deactivate' : 'Activate'}
//           </button>

//           {/* Edit Button */}
//           <button
//             className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-all"
//             onClick={() => openTraineePopup(trainee)}
//           >
//             Edit
//           </button>

//           {/* Generate ID Button */}
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
//             onClick={() => generateIdCard(trainee._id)}
//           >
//             Generate ID
//           </button>
//         </div>
//       </div>
//     ))}
//   </div>

//   {/* Trainee Popup Form */}
//   {showTraineePopup && (
//     <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center overflow-auto transition-all">
//       <div className="bg-white p-8 rounded-lg shadow-xl w-96 max-h-[90%] overflow-y-auto transition-all">
//         <h3 className="text-xl font-semibold mb-6">
//           {editingTrainee ? 'Edit Trainee' : 'Add Trainee'}
//         </h3>
//         <form onSubmit={handleTraineeSubmit}>
//           {/* Name Field */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={traineeFormData.name}
//               onChange={handleTraineeInputChange}
//               className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             />
//           </div>

//           {/* Photo Upload */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Photo</label>
//             <input
//               type="file"
//               name="photo"
//               onChange={handleTraineeInputChange}
//               className="mt-1 block w-full text-sm text-gray-700 file:bg-gray-100 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300"
//             />
//           </div>

//           {/* Father Name Field */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Father</label>
//             <input
//               type="text"
//               name="father"
//               value={traineeFormData.father}
//               onChange={handleTraineeInputChange}
//               className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             />
//           </div>

//           {/* Form Buttons */}
//           <div className="flex justify-end mt-6 space-x-4">
//             <button
//               type="button"
//               className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all"
//               onClick={() => setShowTraineePopup(false)}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
//             >
//               {editingTrainee ? 'Update' : 'Add'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )}
// </div>

//     );
// };

// export default TraineeManagement;






// // THIRD CODE
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const TraineeManagement = () => {
//     const ip = import.meta.env.VITE_IP;
//     const [trainees, setTrainees] = useState([]);
//     const [plans, setPlans] = useState([]);
//     const [showTraineePopup, setShowTraineePopup] = useState(false);
//     const [editingTrainee, setEditingTrainee] = useState(null);
//     const [traineeFormData, setTraineeFormData] = useState({
//         name: '',
//         father: '',
//         dob: '',
//         address: '',
//         phone: '',
//         plan_id: '',
//         active: true,
//         photo: null,
//         fatherSignature: null,
//         occupation: '',
//         current_class: '',
//         name_of_school: '',
//         traineeSignature: null,
//         dateAndPlace: '',
//     });

//     useEffect(() => {
//         fetchTrainees();
//         fetchPlans();
//     }, []);

//     const fetchTrainees = async () => {
//         try {
//             const response = await axios.get(`${ip}/api/academy/trainees`);
//             setTrainees(response.data);
//         } catch (error) {
//             console.error("Error fetching trainees:", error);
//         }
//     };

//     const fetchPlans = async () => {
//         try {
//             const response = await axios.post(`${ip}/api/academy/active-plans`);
//             setPlans(response.data);
//             console.log(response.data);
//         } catch (error) {
//             console.error("Error fetching plans:", error);
//         }
//     };

//     const handleTraineeInputChange = (e) => {
//         const { name, value, files } = e.target;
//         setTraineeFormData({
//             ...traineeFormData,
//             [name]: files ? files[0] : value,
//         });
//     };

//     const handleTraineeSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         for (const key in traineeFormData) {
//             formData.append(key, traineeFormData[key]);
//         }

//         try {
//             if (editingTrainee) {
//                 await axios.put(`${ip}/api/academy/trainee/${editingTrainee._id}`, formData);
//             } else {
//                 await axios.post(`${ip}/api/academy/trainee`, formData);
//             }
//             fetchTrainees();
//             setShowTraineePopup(false);
//             setEditingTrainee(null);
//         } catch (error) {
//             console.error("Error submitting trainee data:", error);
//         }
//     };

//     const toggleTraineeActive = async (id) => {
//         try {
//             await axios.patch(`${ip}/api/academy/trainee/${id}/toggle`);
//             fetchTrainees();
//         } catch (error) {
//             console.error("Error toggling trainee status:", error);
//         }
//     };

//     const generateIdCard = async (id) => {
//         try {
//             await axios.post(`${ip}/api/academy/trainee/${id}/generate-id`);
//             fetchTrainees();
//         } catch (error) {
//             console.error("Error generating ID card:", error);
//         }
//     };

//     const openTraineePopup = (trainee = null) => {
//         setEditingTrainee(trainee);
//         setTraineeFormData(
//             trainee || {
//                 name: '',
//                 father: '',
//                 dob: '',
//                 address: '',
//                 phone: '',
//                 plan_id: '',
//                 active: true,
//                 photo: null,
//                 fatherSignature: null,
//                 occupation: '',
//                 current_class: '',
//                 name_of_school: '',
//                 traineeSignature: null,
//                 dateAndPlace: '',
//             }
//         );
//         setShowTraineePopup(true);
//     };

//     const handleCancel = () => {
//         setTraineeFormData({
//             name: '',
//             father: '',
//             dob: '',
//             address: '',
//             phone: '',
//             plan_id: '',
//             active: true,
//             photo: null,
//             fatherSignature: null,
//             occupation: '',
//             current_class: '',
//             name_of_school: '',
//             traineeSignature: null,
//             dateAndPlace: '',
//         });
//         setShowTraineePopup(false);
//     };

//     return (
//         <div className="bg-white mt-8">
//             <h3 className="text-2xl font-bold text-gray-800 mb-6">Trainee Management</h3>

//             {/* Add Trainee Button */}
//             <button
//                 className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
//                 onClick={() => openTraineePopup()}
//             >
//                 Add Trainee
//             </button>

//             {/* Trainee Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//                 {trainees.map((trainee) => (
//                     <div key={trainee._id} className="border p-5 rounded-lg shadow-lg transition-all hover:shadow-xl">
//                         {trainee.photo && (
//                             <img
//                                 src={`data:image/png;base64,${trainee.photo}`}
//                                 alt={trainee.name}
//                                 className="w-full h-36 object-cover rounded-t-md mb-4"
//                             />
//                         )}
//                         <h4 className="text-lg font-semibold text-gray-800">{trainee.name}</h4>
//                         <p className="text-gray-600 mt-2">Father: {trainee.father}</p>
//                         <p className="text-gray-600 mt-1">Phone: {trainee.phone}</p>
//                         <p className="text-gray-600 mt-1">Plan: {trainee.plan_id}</p>

//                         <div className="flex justify-between mt-4">
//                             {/* Deactivate/Activate Button */}
//                             <button
//                                 className={`px-4 py-2 text-white rounded-md ${trainee.active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} transition-colors`}
//                                 onClick={() => toggleTraineeActive(trainee._id)}
//                             >
//                                 {trainee.active ? 'Deactivate' : 'Activate'}
//                             </button>

//                             {/* Edit Button */}
//                             <button
//                                 className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-all"
//                                 onClick={() => openTraineePopup(trainee)}
//                             >
//                                 Edit
//                             </button>

//                             {/* Generate ID Button */}
//                             <button
//                                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
//                                 onClick={() => generateIdCard(trainee._id)}
//                             >
//                                 Generate ID
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Trainee Popup Form */}
//             {showTraineePopup && (
//     <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center overflow-auto transition-all">
//         <div className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-[700px] max-h-[90%] overflow-y-auto transition-all">
//             <h3 className="text-2xl font-semibold mb-6 text-center">
//                 {editingTrainee ? 'Edit Trainee' : 'Add Trainee'}
//             </h3>
//             <form onSubmit={handleTraineeSubmit}>
//                 {/* Two Column Layout */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                     {/* Left Column */}
//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">Trainee Name</label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={traineeFormData.name}
//                             onChange={handleTraineeInputChange}
//                             className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">Father's Name</label>
//                         <input
//                             type="text"
//                             name="father"
//                             value={traineeFormData.father}
//                             onChange={handleTraineeInputChange}
//                             className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">Phone</label>
//                         <input
//                             type="tel"
//                             name="phone"
//                             value={traineeFormData.phone}
//                             onChange={handleTraineeInputChange}
//                             pattern="^[0-9]{10}$"
//                             className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">DOB</label>
//                         <input
//                             type="date"
//                             name="dob"
//                             value={traineeFormData.dob}
//                             onChange={handleTraineeInputChange}
//                             className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">Address</label>
//                         <textarea
//                             name="address"
//                             value={traineeFormData.address}
//                             onChange={handleTraineeInputChange}
//                             className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">School Name</label>
//                         <input
//                             type="text"
//                             name="name_of_school"
//                             value={traineeFormData.name_of_school}
//                             onChange={handleTraineeInputChange}
//                             className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">Current Class</label>
//                         <input
//                             type="text"
//                             name="current_class"
//                             value={traineeFormData.current_class}
//                             onChange={handleTraineeInputChange}
//                             className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">Father's Occupation</label>
//                         <input
//                             type="text"
//                             name="occupation"
//                             value={traineeFormData.occupation}
//                             onChange={handleTraineeInputChange}
//                             className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">Signature of Trainee</label>
//                         <input
//                             type="file"
//                             name="traineeSignature"
//                             onChange={handleTraineeInputChange}
//                             accept="image/*"
//                             className="mt-1 block w-full text-sm text-gray-700 file:bg-gray-100 file:py-3 file:px-5 file:rounded-md file:border file:border-gray-300"
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">Father's Signature</label>
//                         <input
//                             type="file"
//                             name="fatherSignature"
//                             onChange={handleTraineeInputChange}
//                             accept="image/*"
//                             className="mt-1 block w-full text-sm text-gray-700 file:bg-gray-100 file:py-3 file:px-5 file:rounded-md file:border file:border-gray-300"
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">Plan Selection</label>
//                         <select
//                             name="plan_id"
//                             value={traineeFormData.plan_id}
//                             onChange={handleTraineeInputChange}
//                             className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             required
//                         >
//                             {plans.map(plan => (
//                                 <option key={plan._id} value={plan._id}>{plan.name}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 <div className="flex justify-end mt-6 space-x-6">
//                     <button
//                         type="button"
//                         className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all"
//                         onClick={handleCancel}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
//                     >
//                         {editingTrainee ? 'Update' : 'Add'}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     </div>
// )}

//         </div>
//     );
// };

// export default Tra




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from 'moment'
// const TraineeManagement = () => {
//     const ip = import.meta.env.VITE_IP;
//     const [trainees, setTrainees] = useState([]);
//     const [plans, setPlans] = useState([]);
//     const [showTraineePopup, setShowTraineePopup] = useState(false);
//     const [editingTrainee, setEditingTrainee] = useState(null);
//     const [error, setError] = useState("");
//     const [traineeFormData, setTraineeFormData] = useState({
//         name: "",
//         father: "",
//         dob: "",
//         address: "",
//         phone: "",
//         plan_id: "",
//         active: true,
//         photo: null,
//         fatherSignature: null,
//         occupation: "",
//         current_class: "",
//         name_of_school: "",
//         traineeSignature: null,
//         dateAndPlace: "",
//         amount: 0,
//     });

//     useEffect(() => {
//         fetchTrainees();
//         fetchPlans();
//     }, []);

//     const fetchTrainees = async () => {
//         try {
//             const response = await axios.get(`${ip}/api/academy/trainees`);
//             setTrainees(response.data);
//         } catch (error) {
//             console.error("Error fetching trainees:", error);
//         }
//     };

//     const fetchPlans = async () => {
//         try {
//             const response = await axios.post(`${ip}/api/academy/active-plans`);
//             setPlans(response.data);
//         } catch (error) {
//             console.error("Error fetching plans:", error);
//         }
//     };

//     const handleFileChange = (e, field) => {
//         const file = e.target.files[0];
//         if (file && file.size <= 2 * 1024 * 1024) { // 2 MB size limit
//             setTraineeFormData({ ...traineeFormData, [field]: file });
//         } else {
//             setError("File size should be less than 2MB.");
//         }
//     };

//     const handleTraineeInputChange = (e) => {
//         const { name, value } = e.target;
//         if (name === "plan_id") {
//             const selectedPlan = plans.find((plan) => plan._id === value);
//             setTraineeFormData({
//                 ...traineeFormData,
//                 [name]: value,
//                 amount: selectedPlan ? selectedPlan.amount : 0,
//             });
//         } else {
//             setTraineeFormData({ ...traineeFormData, [name]: value });
//         }
//     };

//     const handleTraineeSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         Object.keys(traineeFormData).forEach((key) => {
//             formData.append(key, traineeFormData[key]);
//         });

//         try {
//             if (editingTrainee) {
//                 await axios.put(
//                     `${ip}/api/academy/trainee/${editingTrainee._id}`,
//                     formData
//                 );
//             } else {
//                 await axios.post(`${ip}/api/manager/add-new-trainee`, formData);
//             }
//             fetchTrainees();
//             setShowTraineePopup(false);
//             setEditingTrainee(null);
//             setError("");
//         } catch (error) {
//             console.error("Error submitting trainee data:", error);
//             setError("Failed to submit trainee data. Please try again.");
//         }
//     };

//     const openTraineePopup = (trainee = null) => {
//         setEditingTrainee(trainee);
//         setTraineeFormData(
//             trainee || {
//                 name: "",
//                 father: "",
//                 dob: "",
//                 address: "",
//                 phone: "",
//                 plan_id: "",
//                 active: true,
//                 photo: null,
//                 fatherSignature: null,
//                 occupation: "",
//                 current_class: "",
//                 name_of_school: "",
//                 traineeSignature: null,
//                 dateAndPlace: "",
//                 amount: 0,
//             }
//         );
//         setShowTraineePopup(true);
//     };

//     const handleCancel = () => {
//         setShowTraineePopup(false);
//         setError("");
//     };
//     const formatDateTime = (dateTime) => moment(dateTime).format('DD-MM-YYYY HH:mm:ss');
//     return (
//         <div className="bg-white mt-8">
//             <h3 className="text-2xl font-bold text-gray-800 mb-6">Trainee Management</h3>

//             {/* Add Trainee Button */}
//             <button
//                 className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
//                 onClick={() => openTraineePopup()}
//             >
//                 Add Trainee
//             </button>

//             {/* Trainee Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//                 {trainees.map((trainee) => (
//                     <div key={trainee._id} className="border p-5 rounded-lg shadow-lg">
//                         <div className="w-full flex items-center justify-center">
//                         {trainee.photo && (
//                             <img
//                                 src={`${ip}/uploads/${trainee.photo}`}
//                                 alt={trainee.name}
//                                 className="w-48 h-64 object-cover rounded-md mb-4"
//                             />
//                         )}
//                         </div>
//                         <h4 className="text-xl font-semibold text-gray-800">{trainee.name}</h4>
//                         <p className="text-gray-600 mt-1 flex flex-row justify-between"><span>Roll No</span><span className="text-gray-700 font-bold">{trainee.roll_no}</span></p>
//                         <p className="text-gray-600 mt-1 flex flex-row justify-between"><span>Father</span><span className="text-gray-700 font-bold">{trainee.father}</span></p>
//                         <p className="text-gray-600 mt-1 flex flex-row justify-between"><span>Phone</span><span className="text-gray-700 font-bold">{trainee.phone}</span></p>
//                         <p className="text-gray-600 mt-1 flex flex-row justify-between"><span>Expiry</span><span className="text-gray-700 font-bold">{formatDateTime(trainee.to)}</span></p>
//                         <p className="text-gray-600 mt-1 flex flex-row justify-between"><span>Amount</span><span className="text-gray-700 font-bold">₹{trainee.amount}</span></p>
//                     </div>
//                 ))}
//             </div>

//             {/* Trainee Popup Form */}
//             {showTraineePopup && (
//                 <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center">
//                    <div className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-[700px] lg:w-[900px] xl:w-[1100px] max-h-[90%] overflow-y-auto mx-auto">
//     <h3 className="text-2xl font-semibold mb-6 text-center">
//         {editingTrainee ? 'Edit Trainee' : 'Add Trainee'}
//     </h3>
//     <form onSubmit={handleTraineeSubmit}>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             {/* Trainee Name */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Trainee Name</label>
//                 <input
//                     type="text"
//                     name="name"
//                     value={traineeFormData.name}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     required
//                 />
//             </div>

//             {/* Father's Name */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Father's Name</label>
//                 <input
//                     type="text"
//                     name="father"
//                     value={traineeFormData.father}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     required
//                 />
//             </div>

//             {/* Phone Number */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Phone</label>
//                 <input
//                     type="tel"
//                     name="phone"
//                     value={traineeFormData.phone}
//                     onChange={handleTraineeInputChange}
//                     pattern="^[0-9]{10}$"
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     required
//                 />
//             </div>

//             {/* Trainee Photo */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Trainee Photo</label>
//                 <input
//                     type="file"
//                     onChange={(e) => handleFileChange(e, "photo")}
//                     accept="image/*"
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* Date of Birth */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">DOB</label>
//                 <input
//                     type="date"
//                     name="dob"
//                     value={traineeFormData.dob}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* Address */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Address</label>
//                 <textarea
//                     name="address"
//                     value={traineeFormData.address}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     required
//                 />
//             </div>

//             {/* School Name */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">School Name</label>
//                 <input
//                     type="text"
//                     name="name_of_school"
//                     value={traineeFormData.name_of_school}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     required
//                 />
//             </div>

//             {/* Current Class */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Current Class</label>
//                 <input
//                     type="text"
//                     name="current_class"
//                     value={traineeFormData.current_class}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* Father's Occupation */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Father's Occupation</label>
//                 <input
//                     type="text"
//                     name="occupation"
//                     value={traineeFormData.occupation}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* Trainee Signature */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Signature of Trainee</label>
//                 <input
//                     type="file"
//                     onChange={(e) => handleFileChange(e, "traineeSignature")}
//                     accept="image/*"
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* Father's Signature */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Father's Signature</label>
//                 <input
//                     type="file"
//                     onChange={(e) => handleFileChange(e, "fatherSignature")}
//                     accept="image/*"
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* Plan Selection */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Plan Selection</label>
//                 <select
//                     name="plan_id"
//                     value={traineeFormData.plan_id}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     required
//                 >
//                     {plans.map((plan) => (
//                         <option key={plan._id} value={plan._id}>{plan.name}</option>
//                     ))}
//                 </select>
//             </div>

//             {/* Amount Field */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Amount</label>
//                 <input
//                     type="number"
//                     name="amount"
//                     value={traineeFormData.amount}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end mt-6 space-x-6">
//             <button
//                 type="button"
//                 className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all"
//                 onClick={handleCancel}
//             >
//                 Cancel
//             </button>
//             <button
//                 type="submit"
//                 className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
//             >
//                 {editingTrainee ? 'Update' : 'Add'}
//             </button>
//         </div>
//     </form>
// </div>

//                 </div>
//             )}
//         </div>
//     );
// };

// export default TraineeManagement;







// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from 'moment';

// const TraineeManagement = () => {
//     const ip = import.meta.env.VITE_IP;
//     const [trainees, setTrainees] = useState([]);
//     const [plans, setPlans] = useState([]);
//     const [showTraineePopup, setShowTraineePopup] = useState(false);
//     const [editingTrainee, setEditingTrainee] = useState(null);
//     const [error, setError] = useState("");
//     const [traineeFormData, setTraineeFormData] = useState({
//         name: "",
//         father: "",
//         dob: "",
//         address: "",
//         phone: "",
//         plan_id: "",
//         active: true,
//         photo: null,
//         fatherSignature: null,
//         occupation: "",
//         current_class: "",
//         name_of_school: "",
//         traineeSignature: null,
//         dateAndPlace: "",
//         amount: 0,
//     });

//     useEffect(() => {
//         fetchTrainees();
//         fetchPlans();
//     }, []);

//     const fetchTrainees = async () => {
//         try {
//             const response = await axios.get(`${ip}/api/academy/trainees`);
//             setTrainees(response.data);
//         } catch (error) {
//             console.error("Error fetching trainees:", error);
//         }
//     };

//     const fetchPlans = async () => {
//         try {
//             const response = await axios.post(`${ip}/api/academy/active-plans`);
//             setPlans(response.data);
//         } catch (error) {
//             console.error("Error fetching plans:", error);
//         }
//     };

//     const handleFileChange = (e, field) => {
//         const file = e.target.files[0];
//         if (file && file.size <= 500 * 1024 * 1024) { // 2 MB size limit
//             setTraineeFormData({ ...traineeFormData, [field]: file });
//         } else {
//             setError("File size should be less than 2MB.");
//         }
//     };

//     const handleTraineeInputChange = (e) => {
//         const { name, value } = e.target;
//         if (name === "plan_id") {
//             const selectedPlan = plans.find((plan) => plan._id === value);
//             setTraineeFormData({
//                 ...traineeFormData,
//                 [name]: value,
//                 amount: selectedPlan ? selectedPlan.amount : 0,
//             });
//         } else {
//             setTraineeFormData({ ...traineeFormData, [name]: value });
//         }
//     };

//     const handleTraineeSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         Object.keys(traineeFormData).forEach((key) => {
//             formData.append(key, traineeFormData[key]);
//         });

//         try {
//             if (editingTrainee) {
//                 await axios.put(
//                     `${ip}/api/academy/trainee/${editingTrainee._id}`,
//                     formData
//                 );
//             } else {
//                 await axios.post(`${ip}/api/manager/add-new-trainee`, formData);
//             }
//             fetchTrainees();
//             setShowTraineePopup(false);
//             setEditingTrainee(null);
//             setError("");
//         } catch (error) {
//             console.error("Error submitting trainee data:", error);
//             setError("Failed to submit trainee data. Please try again.");
//         }
//     };

//     const openTraineePopup = (trainee = null) => {
//         setEditingTrainee(trainee);
//         setTraineeFormData(
//             trainee || {
//                 name: "",
//                 father: "",
//                 dob: "",
//                 address: "",
//                 phone: "",
//                 plan_id: "",
//                 active: true,
//                 photo: null,
//                 fatherSignature: null,
//                 occupation: "",
//                 current_class: "",
//                 name_of_school: "",
//                 traineeSignature: null,
//                 dateAndPlace: "",
//                 amount: 0,
//             }
//         );
//         setShowTraineePopup(true);
//     };

//     const handleCancel = () => {
//         setShowTraineePopup(false);
//         setError("");
//     };

//     const formatDateTime = (dateTime) => moment(dateTime).format('DD-MM-YYYY HH:mm:ss');

//     return (
//         <div className="bg-white mt-8">
//             <h3 className="text-2xl font-bold text-gray-800 mb-6">Trainee Management</h3>

//             {/* Add Trainee Button */}
//             <button
//                 className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
//                 onClick={() => openTraineePopup()}
//             >
//                 Add Trainee
//             </button>

//             {/* Trainee Cards */}
//             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-6">
//                 {trainees.map((trainee) => (
//                     <div key={trainee._id} className="border p-3 rounded-lg shadow-lg">
//                         <div className="w-full flex items-center justify-center">
//                             {trainee.photo && (
//                                 <img
//                                     src={`${ip}/uploads/${trainee.photo}`}
//                                     alt={trainee.name}
//                                     className="w-48 h-64 object-cover rounded-md mb-4"
//                                 />
//                             )}
//                         </div>
//                         <h4 className="text-xl font-semibold text-gray-800">{trainee.name}</h4>
//                         <p className="text-gray-600 mt-1 flex flex-row justify-between"><span>Roll No</span><span className="text-gray-700 font-bold">{trainee.roll_no}</span></p>
//                         <p className="text-gray-600 mt-1 flex flex-row justify-between"><span>Father</span><span className="text-gray-700 font-bold">{trainee.father}</span></p>
//                         <p className="text-gray-600 mt-1 flex flex-row justify-between"><span>Phone</span><span className="text-gray-700 font-bold">{trainee.phone}</span></p>
//                         <p className="text-gray-600 mt-1 flex flex-row justify-between"><span>Expiry</span><span className="text-gray-700 font-bold">{formatDateTime(trainee.to)}</span></p>
//                         <p className="text-gray-600 mt-1 flex flex-row justify-between"><span>Amount</span><span className="text-gray-700 font-bold">₹{trainee.amount}</span></p>

//                         {/* Edit Button */}
//                         <button
//                             className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
//                             onClick={() => openTraineePopup(trainee)}
//                         >
//                             Edit
//                         </button>
//                     </div>
//                 ))}
//             </div>

//             {/* Trainee Popup Form */}
//             {showTraineePopup && (
//                 <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center">
//                     <div className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-[700px] lg:w-[900px] xl:w-[1100px] max-h-[90%] overflow-y-auto mx-auto">
//                         <h3 className="text-2xl font-semibold mb-6 text-center">
//                             {editingTrainee ? 'Edit Trainee' : 'Add Trainee'}
//                         </h3>
//                         <form onSubmit={handleTraineeSubmit}>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//              {/* Trainee Name */}
//              <div className="flex flex-col">
//                  <label className="block text-sm font-medium text-gray-700">Trainee Name</label>
//                  <input
//                     type="text"
//                     name="name"
//                     value={traineeFormData.name}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     required
//                 />
//             </div>

//             {/* Father's Name */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Father's Name</label>
//                 <input
//                     type="text"
//                     name="father"
//                     value={traineeFormData.father}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     required
//                 />
//             </div>

//             {/* Phone Number */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Phone</label>
//                 <input
//                     type="tel"
//                     name="phone"
//                     value={traineeFormData.phone}
//                     onChange={handleTraineeInputChange}
//                     pattern="^[0-9]{10}$"
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     required
//                 />
//             </div>

//             {/* Trainee Photo */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Trainee Photo</label>
//                 <input
//                     type="file"
//                     onChange={(e) => handleFileChange(e, "photo")}
//                     accept="image/*"
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* Date of Birth */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">DOB</label>
//                 <input
//                     type="date"
//                     name="dob"
//                     value={traineeFormData.dob}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* Address */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Address</label>
//                 <textarea
//                     name="address"
//                     value={traineeFormData.address}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     required
//                 />
//             </div>

//             {/* School Name */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">School Name</label>
//                 <input
//                     type="text"
//                     name="name_of_school"
//                     value={traineeFormData.name_of_school}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     required
//                 />
//             </div>

//             {/* Current Class */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Current Class</label>
//                 <input
//                     type="text"
//                     name="current_class"
//                     value={traineeFormData.current_class}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* Father's Occupation */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Father's Occupation</label>
//                 <input
//                     type="text"
//                     name="occupation"
//                     value={traineeFormData.occupation}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* Trainee Signature */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Signature of Trainee</label>
//                 <input
//                     type="file"
//                     onChange={(e) => handleFileChange(e, "traineeSignature")}
//                     accept="image/*"
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* Father's Signature */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Father's Signature</label>
//                 <input
//                     type="file"
//                     onChange={(e) => handleFileChange(e, "fatherSignature")}
//                     accept="image/*"
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* Plan Selection */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Plan Selection</label>
//                 <select
//                     name="plan_id"
//                     value={traineeFormData.plan_id}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     required
//                 >
//                     {plans.map((plan) => (
//                         <option key={plan._id} value={plan._id}>{plan.name}</option>
//                     ))}
//                 </select>
//             </div>

//             {/* Amount Field */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Amount</label>
//                 <input
//                     type="number"
//                     name="amount"
//                     value={traineeFormData.amount}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>
//         </div>

//                             <div className="flex justify-end mt-6 space-x-6">
//                                 <button
//                                     type="button"
//                                     className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all"
//                                     onClick={handleCancel}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
//                                 >
//                                     {editingTrainee ? 'Update' : 'Add'}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default TraineeManagement;

import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from 'moment';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import imageCompression from 'browser-image-compression';
import { FaEdit, FaEye, FaSyncAlt, FaIdCard, FaIdBadge, FaTrashAlt } from "react-icons/fa";
import {
    Search,
    Plus,
    Edit2,
    Eye,
    RefreshCw,
    CreditCard,
    BadgeCheck,
    Trash2,
    X,
    Filter,
    FileSpreadsheet,
} from 'lucide-react';

const TraineeManagement = () => {
    const ip = import.meta.env.VITE_IP;
    const [trainees, setTrainees] = useState([]);
    const [plans, setPlans] = useState([]);
    const [showTraineePopup, setShowTraineePopup] = useState(false);
    const [showRenewalPopup, setShowRenewalPopup] = useState(false);
    const [editingTrainee, setEditingTrainee] = useState(null);
    const [error, setError] = useState("");
    const [renewalFormData, setRenewalFormData] = useState({
        trainee_id: "",
        name: "",
        roll_no: "",
        plan_id: "",
        amount: 0,
        payment_method: "",
        start_date: moment().format('YYYY-MM-DD'),
        expiry_date: "",
    });
    const [traineeFormData, setTraineeFormData] = useState({
        name: "",
        father: "",
        dob: moment().format('YYYY-MM-DD'),
        address: "",
        phone: "",
        plan_id: "",
        active: true,
        photo: null,
        fatherSignature: null,
        occupation: "",
        current_class: "",
        name_of_school: "",
        traineeSignature: null,
        dateAndPlace: "",
        amount: 0,
        payment_method: "",
        start_date: moment().format('YYYY-MM-DD'),
        expiry_date: "",
    });
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const [membershipFilter, setMembershipFilter] = useState("all"); // all, expired, or active
    const [selectedTrainee, setSelectedTrainee] = useState(null);

    const exportToExcel = () => {
        if (trainees.length === 0) {
            alert("No trainee data available for export.");
            return;
        }

        // Define the Excel data
        const excelData = trainees.map((trainee) => ({
            "Name": trainee.name,
            "Father's Name": trainee.father,
            "Phone": trainee.phone,
            "DOB": moment(trainee.dob).format('DD-MM-YYYY'),
            "Address": trainee.address,
            "Plan": trainee.plan_id,
            "Start Date": moment(trainee.start_date).format('DD-MM-YYYY'),
            "Expiry Date": moment(trainee.expiry_date).format('DD-MM-YYYY'),
            "Amount Paid": `₹${trainee.amount}`,
            "Active": trainee.active ? "Yes" : "No",
        }));

        // Convert data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Trainees");

        // Write the file and trigger download
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });

        saveAs(blob, `Trainee_Data_${moment().format('YYYYMMDD')}.xlsx`);
    };

    // Function to open the View Popup
    const handleViewTrainee = (trainee) => {
        setSelectedTrainee(trainee);
    };

    // Function to close the Popup
    const handleClosePopup = () => {
        setSelectedTrainee(null);
    };


    // Filter trainees based on search query
    const filteredTrainees = trainees.filter((trainee) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            trainee.name.toLowerCase().includes(searchLower) ||
            trainee.roll_no.toLowerCase().includes(searchLower);

        const today = moment();
        const isExpired = moment(trainee.to).isBefore(today, "day");
        const isActive = !isExpired;

        const matchesMembershipFilter =
            membershipFilter === "all" ||
            (membershipFilter === "expired" && isExpired) ||
            (membershipFilter === "active" && isActive) ||
            (membershipFilter === "idcardgiven" && trainee.id_card_given) ||
            (membershipFilter === "idcardgenerated" && trainee.id_card_generated && !trainee.id_card_given) ||
            (membershipFilter === "idcardnotgenerated" && !trainee.id_card_generated);

        return matchesSearch && matchesMembershipFilter;
        return matchesSearch && matchesFilter;
    });



    useEffect(() => {
        fetchTrainees();
        fetchPlans();
    }, []);

    const fetchTrainees = async () => {
        try {
            const response = await axios.get(`${ip}/api/academy/trainees`);
            setTrainees(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("Error fetching trainees:", error);
        }
    };

    const fetchPlans = async () => {
        try {
            const response = await axios.post(`${ip}/api/academy/active-plans`);
            setPlans(response.data);
        } catch (error) {
            console.error("Error fetching plans:", error);
        }
    };

    const compressImage = async (file) => {
        if (!file) return null;

        const options = {
            maxSizeMB: 0.05, // 50KB = 0.05MB
            maxWidthOrHeight: 1024,
            useWebWorker: true,
        };

        try {
            const compressedFile = await imageCompression(file, options);
            // Convert to File object with original name and type
            return new File([compressedFile], file.name, { type: file.type });
        } catch (error) {
            console.error("Error compressing image:", error);
            setError("Failed to compress image. Please try again.");
            return null;
        }
    };

    const handleFileChange = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const compressedFile = await compressImage(file);
            if (compressedFile) {
                setTraineeFormData({ ...traineeFormData, [field]: compressedFile });
                setError("");
            }
        } catch (error) {
            console.error("Error handling file:", error);
            setError("Failed to process image. Please try again.");
        }
    };

    const calculateExpiryDate = (planId) => {
        const selectedPlan = plans.find((plan) => plan._id === planId);
        if (selectedPlan && selectedPlan.plan_limit) {
            const startDate = moment();
            const expiryDate = moment(startDate).add(selectedPlan.plan_limit, 'days');
            return expiryDate.format('YYYY-MM-DD');
        }
        return '';
    };

    const calculateTraineeExpiryDate = (planId, startDate) => {
        const selectedPlan = plans.find((plan) => plan._id === planId);
        if (selectedPlan && selectedPlan.plan_limit && startDate) {
            // Use the provided start date instead of current date
            const expiryDate = moment(startDate).add(selectedPlan.plan_limit, 'days');
            return expiryDate.format('YYYY-MM-DD');
        }
        return '';
    };

    const handleTraineeInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "plan_id") {
            const selectedPlan = plans.find((plan) => plan._id === value);
            const expiryDate = calculateTraineeExpiryDate(value, traineeFormData.start_date);
            setTraineeFormData({
                ...traineeFormData,
                [name]: value,
                amount: selectedPlan ? selectedPlan.amount : 0,
                expiry_date: expiryDate
            });
        } else if (name === "start_date") {
            const expiryDate = calculateTraineeExpiryDate(traineeFormData.plan_id, value);
            setTraineeFormData({
                ...traineeFormData,
                start_date: value,
                expiry_date: expiryDate
            });
        } else {
            setTraineeFormData({ ...traineeFormData, [name]: value });
        }
    };

    const handleRenewalInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "plan_id") {
            const selectedPlan = plans.find((plan) => plan._id === value);
            const expiryDate = calculateExpiryDate(value, renewalFormData.start_date);

            setRenewalFormData({
                ...renewalFormData,
                [name]: value,
                amount: selectedPlan ? selectedPlan.amount : 0,
                expiry_date: expiryDate,
            });
        } else if (name === "start_date") {
            const expiryDate = calculateExpiryDate(renewalFormData.plan_id, value);
            setRenewalFormData({
                ...renewalFormData,
                start_date: value,
                expiry_date: expiryDate,
            });
        } else {
            setRenewalFormData({ ...renewalFormData, [name]: value });
        }
    };

    const handleTraineeSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(traineeFormData).forEach((key) => {
            formData.append(key, traineeFormData[key]);
        });

        try {
            if (editingTrainee) {
                await axios.put(
                    `${ip}/api/manager/update-trainee/${editingTrainee._id}`,
                    formData
                );
            } else {
                await axios.post(`${ip}/api/manager/add-new-trainee`, formData);
            }
            fetchTrainees();
            setShowTraineePopup(false);
            setEditingTrainee(null);
            setError("");
        } catch (error) {
            console.error("Error submitting trainee data:", error);
            setError("Failed to submit trainee data. Please try again.");
        }
    };

    const handleRenewalSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${ip}/api/academy/renewal`, renewalFormData);
            fetchTrainees();
            setShowRenewalPopup(false);
            setError("");
        } catch (error) {
            console.error("Error submitting renewal data:", error);
            setError("Failed to submit renewal data. Please try again.");
        }
    };

    const openTraineePopup = (trainee = null) => {
        setEditingTrainee(trainee);

        setTraineeFormData(
            trainee
                ? {
                    ...trainee,
                    dob: trainee.dob ? moment(trainee.dob).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'), // Format dob
                    start_date: trainee.from ? moment(trainee.from).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
                    expiry_date: trainee.to ? moment(trainee.to).format('YYYY-MM-DD') : '',
                }
                : {
                    name: "",
                    father: "",
                    dob: moment().format('YYYY-MM-DD'),
                    address: "",
                    phone: "",
                    plan_id: "",
                    active: true,
                    photo: null,
                    fatherSignature: null,
                    occupation: "",
                    current_class: "",
                    name_of_school: "",
                    traineeSignature: null,
                    dateAndPlace: "",
                    amount: 0,
                    payment_method: "",
                    start_date: moment().format('YYYY-MM-DD'),
                    expiry_date: "",
                }
        );
        setShowTraineePopup(true);
    };


    const openRenewalPopup = (trainee) => {
        const startDate = moment().format('YYYY-MM-DD');
        const expiryDate = calculateExpiryDate(trainee.plan_id);

        setRenewalFormData({
            trainee_id: trainee._id,
            name: trainee.name,
            roll_no: trainee.roll_no,
            plan_id: trainee.plan_id,
            amount: trainee.amount,
            payment_method: "",
            start_date: startDate,
            expiry_date: expiryDate,
        });
        setShowRenewalPopup(true);
    };

    const handleCancel = () => {
        setShowTraineePopup(false);
        setShowRenewalPopup(false);
        setError("");
    };

    // const formatDateTime = (dateTime) => moment(dateTime).format('DD-MM-YYYY HH:mm:ss');
    const formatDateTime1 = (dateTime) => moment(dateTime).format('DD-MM-YYYY');

    // New function to check if renewal is allowed
    const isRenewalAllowed = (expiryDate) => {
        const today = moment();
        const expiry = moment(expiryDate);
        const daysUntilExpiry = expiry.diff(today, 'days');
        return daysUntilExpiry <= 3 && daysUntilExpiry >= -36500; // Allow renewal 3 days before expiry and up to 30 days after expiry
    };

    const handleDeleteTrainee = async (id) => {
        try {
            const response = await axios.post(`${ip}/api/manager/delete-trainee`, {
                id, // Pass the trainee's ID or any other required data
                userid: localStorage.getItem('userid'),
            });
            fetchTrainees();
            // Optionally update state here to reflect the change, e.g., updating `id_card_given`
            // alert('ID Card has been given successfully!');
        } catch (error) {
            console.error('Error deleting Trainee:', error);

        }
    }

    const handleIDcardbuttonClick = async (id) => {
        try {
            const response = await axios.post(`${ip}/api/academy/id-card-given`, {
                id, // Pass the trainee's ID or any other required data
                userid: localStorage.getItem('userid'),
            });
            fetchTrainees();
            // Optionally update state here to reflect the change, e.g., updating `id_card_given`
            // alert('ID Card has been given successfully!');
        } catch (error) {
            console.error('Error giving ID card:', error);
            alert('Failed to give ID card. Please try again.');
        }
    };
    const handleGenIDcardbuttonClick = async (id) => {
        try {
            const response = await axios.post(`${ip}/api/academy/id-card-generated`, {
                id, // Pass the trainee's ID or any other required data
                userid: localStorage.getItem('userid'),
            });
            fetchTrainees();
            // Optionally update state here to reflect the change, e.g., updating `id_card_given`
            // alert('ID Card has been given successfully!');
        } catch (error) {
            console.error('Error giving ID card:', error);
            alert('Failed to give ID card. Please try again.');
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25); // Default limit

    // Calculate total pages
    const totalPages = Math.ceil(trainees.length / itemsPerPage);

    // Get the data for the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTrainees = trainees.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="bg-white rounded-xl shadow-sm p-0 md:p-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Trainee Management ({filteredTrainees.length})
                </h2>

                <div className="flex flex-wrap gap-4 items-center">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or roll no..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                        />
                    </div>

                    {/* Filter Dropdown */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                            value={membershipFilter}
                            onChange={(e) => setMembershipFilter(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                        >
                            <option value="all">All Memberships</option>
                            <option value="expired">Expired Memberships</option>
                            <option value="active">Active Memberships</option>
                            <option value="idcardgiven">ID Card Given</option>
                            <option value="idcardgenerated">ID Card Generated</option>
                            <option value="idcardnotgenerated">ID Card Not Generated</option>
                        </select>
                    </div>

                    <button
                        onClick={exportToExcel}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm sm:text-base"
                    >
                        <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5" />
                        Export Excel
                    </button>

                    {/* Add Trainee Button */}
                    <button
                        onClick={() => openTraineePopup()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Trainee
                    </button>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* Trainees Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {filteredTrainees.map((trainee) => (
                    <div
                        key={trainee._id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
                    >
                        <div className="flex items-start p-4 gap-4">

                            <div className="flex-shrink-0">
                                <img
                                    src={`${ip}/uploads/${trainee.photo}`}
                                    alt={trainee.name}
                                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                    onClick={() => handleViewTrainee(trainee)}
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                    {trainee.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Roll No: <span className="font-medium">{trainee.roll_no}</span>
                                </p>
                                <p className="text-sm text-gray-600">
                                    Expires: <span className="font-medium">{formatDateTime1(trainee.to)}</span>
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 bg-gray-50 p-3 flex justify-end gap-2">
                            <button
                                onClick={() => openTraineePopup(trainee)}
                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
                                title="Edit"
                            >
                                <Edit2 className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => handleViewTrainee(trainee)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                title="View Details"
                            >
                                <Eye className="w-5 h-5" />
                            </button>

                            {isRenewalAllowed(trainee.to) && (
                                <button
                                    onClick={() => openRenewalPopup(trainee)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                    title="Renew Membership"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                            )}

                            {!trainee.id_card_generated && (
                                <button
                                    onClick={() => handleGenIDcardbuttonClick(trainee._id)}
                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                                    title="Generate ID Card"
                                >
                                    <CreditCard className="w-5 h-5" />
                                </button>
                            )}

                            {!trainee.id_card_given && trainee.id_card_generated && (
                                <button
                                    onClick={() => handleIDcardbuttonClick(trainee._id)}
                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                    title="Mark ID Card as Given"
                                >
                                    <BadgeCheck className="w-5 h-5" />
                                </button>
                            )}

                            <button
                                onClick={() => handleDeleteTrainee(trainee._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/*<div>*/}
            {/*    /!* Dropdown to change number of items per page *!/*/}
            {/*    <div className="flex justify-between items-center mb-4">*/}
            {/*        <span className="text-gray-700">Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, trainees.length)} of {trainees.length}</span>*/}
            {/*        <select*/}
            {/*            value={itemsPerPage}*/}
            {/*            onChange={(e) => {*/}
            {/*                setItemsPerPage(parseInt(e.target.value));*/}
            {/*                setCurrentPage(1); // Reset to first page when limit changes*/}
            {/*            }}*/}
            {/*            className="border p-2 rounded-md"*/}
            {/*        >*/}
            {/*            <option value="25">25 per page</option>*/}
            {/*            <option value="50">50 per page</option>*/}
            {/*            <option value="100">100 per page</option>*/}
            {/*        </select>*/}
            {/*    </div>*/}

            {/*    /!* Pagination Controls *!/*/}
            {/*    <div className="flex justify-between items-center mt-4">*/}
            {/*        <button*/}
            {/*            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}*/}
            {/*            disabled={currentPage === 1}*/}
            {/*            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"*/}
            {/*        >*/}
            {/*            Previous*/}
            {/*        </button>*/}

            {/*        <span>Page {currentPage} of {totalPages}</span>*/}

            {/*        <button*/}
            {/*            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}*/}
            {/*            disabled={currentPage === totalPages}*/}
            {/*            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"*/}
            {/*        >*/}
            {/*            Next*/}
            {/*        </button>*/}
            {/*    </div>*/}

            {/*    /!* Trainee List *!/*/}
            {/*    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">*/}
            {/*        {currentTrainees.map((trainee) => (*/}
            {/*            <div*/}
            {/*                key={trainee._id}*/}
            {/*                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"*/}
            {/*            >*/}
            {/*                <div className="flex items-start p-4 gap-4">*/}
            {/*                    /!* Trainee Photo *!/*/}
            {/*                    <div className="flex-shrink-0">*/}
            {/*                        <img*/}
            {/*                            src={`${ip}/uploads/${trainee.photo}`}*/}
            {/*                            alt={trainee.name}*/}
            {/*                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"*/}
            {/*                            onClick={() => handleViewTrainee(trainee)}*/}
            {/*                        />*/}
            {/*                    </div>*/}

            {/*                    /!* Trainee Info *!/*/}
            {/*                    <div className="flex-1 min-w-0">*/}
            {/*                        <h3 className="text-lg font-semibold text-gray-900 truncate">*/}
            {/*                            {trainee.name}*/}
            {/*                        </h3>*/}
            {/*                        <p className="text-sm text-gray-600">*/}
            {/*                            Roll No: <span className="font-medium">{trainee.roll_no}</span>*/}
            {/*                        </p>*/}
            {/*                        <p className="text-sm text-gray-600">*/}
            {/*                            Expires: <span className="font-medium">{formatDateTime1(trainee.to)}</span>*/}
            {/*                        </p>*/}
            {/*                    </div>*/}
            {/*                </div>*/}

            {/*                /!* Action Buttons *!/*/}
            {/*                <div className="border-t border-gray-200 bg-gray-50 p-3 flex justify-end gap-2">*/}
            {/*                    <button*/}
            {/*                        onClick={() => openTraineePopup(trainee)}*/}
            {/*                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"*/}
            {/*                        title="Edit"*/}
            {/*                    >*/}
            {/*                        <Edit2 className="w-5 h-5" />*/}
            {/*                    </button>*/}

            {/*                    <button*/}
            {/*                        onClick={() => handleViewTrainee(trainee)}*/}
            {/*                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"*/}
            {/*                        title="View Details"*/}
            {/*                    >*/}
            {/*                        <Eye className="w-5 h-5" />*/}
            {/*                    </button>*/}

            {/*                    {isRenewalAllowed(trainee.to) && (*/}
            {/*                        <button*/}
            {/*                            onClick={() => openRenewalPopup(trainee)}*/}
            {/*                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"*/}
            {/*                            title="Renew Membership"*/}
            {/*                        >*/}
            {/*                            <RefreshCw className="w-5 h-5" />*/}
            {/*                        </button>*/}
            {/*                    )}*/}

            {/*                    {!trainee.id_card_generated && (*/}
            {/*                        <button*/}
            {/*                            onClick={() => handleGenIDcardbuttonClick(trainee._id)}*/}
            {/*                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"*/}
            {/*                            title="Generate ID Card"*/}
            {/*                        >*/}
            {/*                            <CreditCard className="w-5 h-5" />*/}
            {/*                        </button>*/}
            {/*                    )}*/}

            {/*                    {!trainee.id_card_given && trainee.id_card_generated && (*/}
            {/*                        <button*/}
            {/*                            onClick={() => handleIDcardbuttonClick(trainee._id)}*/}
            {/*                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"*/}
            {/*                            title="Mark ID Card as Given"*/}
            {/*                        >*/}
            {/*                            <BadgeCheck className="w-5 h-5" />*/}
            {/*                        </button>*/}
            {/*                    )}*/}

            {/*                    <button*/}
            {/*                        onClick={() => handleDeleteTrainee(trainee._id)}*/}
            {/*                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"*/}
            {/*                        title="Delete"*/}
            {/*                    >*/}
            {/*                        <Trash2 className="w-5 h-5" />*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        ))}*/}
            {/*    </div>*/}

            {/*    /!* Pagination Controls *!/*/}
            {/*    <div className="flex justify-between items-center mt-4">*/}
            {/*        <button*/}
            {/*            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}*/}
            {/*            disabled={currentPage === 1}*/}
            {/*            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"*/}
            {/*        >*/}
            {/*            Previous*/}
            {/*        </button>*/}

            {/*        <span>Page {currentPage} of {totalPages}</span>*/}

            {/*        <button*/}
            {/*            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}*/}
            {/*            disabled={currentPage === totalPages}*/}
            {/*            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"*/}
            {/*        >*/}
            {/*            Next*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* View Trainee Modal */}
            {selectedTrainee && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Trainee Details
                                </h2>
                                <button
                                    onClick={handleClosePopup}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>

                            {/* Images Section */}
                            <div className="grid grid-cols-3 gap-6 mb-6">
                                <div className="flex flex-col items-center">
                                    <span className="text-sm text-gray-600 mb-2">Trainee Photo</span>
                                    <img
                                        src={`${ip}/uploads/${selectedTrainee.photo}`}
                                        alt="Trainee"
                                        className="w-32 h-44 object-cover rounded-lg border border-gray-200"
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-sm text-gray-600 mb-2">Trainee's Signature</span>
                                    <img
                                        src={`${ip}/uploads/${selectedTrainee.signature}`}
                                        alt="Trainee Signature"
                                        className="w-32 h-44 object-cover rounded-lg border border-gray-200"
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-sm text-gray-600 mb-2">Father's Signature</span>
                                    <img
                                        src={`${ip}/uploads/${selectedTrainee.father_signature}`}
                                        alt="Father's Signature"
                                        className="w-32 h-44 object-cover rounded-lg border border-gray-200"
                                    />
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailItem label="Name" value={selectedTrainee.name} />
                                <DetailItem label="Roll No" value={selectedTrainee.roll_no} />
                                <DetailItem label="Father's Name" value={selectedTrainee.father} />
                                <DetailItem label="Phone" value={selectedTrainee.phone} />
                                <DetailItem label="Start Date" value={formatDateTime1(selectedTrainee.from)} />
                                <DetailItem label="Expiry Date" value={formatDateTime1(selectedTrainee.to)} />
                                <DetailItem label="Amount" value={`₹${selectedTrainee.amount}`} />
                                <DetailItem label="Father's Occupation" value={selectedTrainee.occupation} />
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Trainee Popup Form */}
            {showTraineePopup && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
                    <div className="min-h-screen px-4 py-8 flex items-center justify-center">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl relative">
                            {/* Close button */}
                            <button
                                onClick={handleCancel}
                                className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>

                            <div className="p-6 sm:p-8">
                                <h3 className="text-2xl font-semibold mb-8 text-gray-800 text-center">
                                    {editingTrainee ? 'Edit Trainee' : 'Add New Trainee'}
                                </h3>

                                <form onSubmit={handleTraineeSubmit} className="space-y-8">
                                    {/* Personal Information */}
                                    <div className="space-y-6">
                                        <h4 className="text-lg font-medium text-gray-700 border-b pb-2">Personal Information</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Trainee Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={traineeFormData.name}
                                                    onChange={handleTraineeInputChange}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                                                <input
                                                    type="text"
                                                    name="father"
                                                    value={traineeFormData.father}
                                                    onChange={handleTraineeInputChange}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={traineeFormData.phone}
                                                    onChange={handleTraineeInputChange}
                                                    pattern="^[0-9]{10}$"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                                <input
                                                    type="date"
                                                    name="dob"
                                                    value={traineeFormData.dob}
                                                    onChange={handleTraineeInputChange}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact & Education */}
                                    <div className="space-y-6">
                                        <h4 className="text-lg font-medium text-gray-700 border-b pb-2">Contact & Education</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="sm:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                                <textarea
                                                    name="address"
                                                    value={traineeFormData.address}
                                                    onChange={handleTraineeInputChange}
                                                    rows={3}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                                                <input
                                                    type="text"
                                                    name="name_of_school"
                                                    value={traineeFormData.name_of_school}
                                                    onChange={handleTraineeInputChange}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Class</label>
                                                <input
                                                    type="text"
                                                    name="current_class"
                                                    value={traineeFormData.current_class}
                                                    onChange={handleTraineeInputChange}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Father's Occupation</label>
                                                <input
                                                    type="text"
                                                    name="occupation"
                                                    value={traineeFormData.occupation}
                                                    onChange={handleTraineeInputChange}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Documents */}
                                    <div className="space-y-6">
                                        <h4 className="text-lg font-medium text-gray-700 border-b pb-2">Documents</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Trainee Photo <span className="text-sm text-gray-500">(Max 50KB)</span>
                                                </label>
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleFileChange(e, "photo")}
                                                    accept="image/*"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Trainee Signature <span className="text-sm text-gray-500">(Max 50KB)</span>
                                                </label>
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleFileChange(e, "traineeSignature")}
                                                    accept="image/*"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Father's Signature <span className="text-sm text-gray-500">(Max 50KB)</span>
                                                </label>
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleFileChange(e, "fatherSignature")}
                                                    accept="image/*"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Plan & Payment */}
                                    <div className="space-y-6">
                                        <h4 className="text-lg font-medium text-gray-700 border-b pb-2">Plan & Payment Details</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Selection</label>
                                                <select
                                                    name="plan_id"
                                                    value={traineeFormData.plan_id}
                                                    onChange={handleTraineeInputChange}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    required
                                                >
                                                    <option value="">Select a plan</option>
                                                    {plans.map((plan) => (
                                                        <option key={plan._id} value={plan._id}>{plan.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                                <select
                                                    name="payment_method"
                                                    value={traineeFormData.payment_method}
                                                    onChange={handleTraineeInputChange}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    required
                                                >
                                                    <option value="">Select Payment Method</option>
                                                    <option value="CASH">Cash</option>
                                                    <option value="UPI">UPI</option>
                                                    <option value="CARD">Card</option>
                                                    <option value="CHEQUE">Cheque</option>
                                                    <option value="NET BANKING">Net Banking</option>
                                                    <option value="DEMAND DRAFT">Demand Draft</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                                <input
                                                    type="number"
                                                    name="amount"
                                                    value={traineeFormData.amount}
                                                    onChange={handleTraineeInputChange}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                                <input
                                                    type="date"
                                                    name="start_date"
                                                    value={traineeFormData.start_date}
                                                    onChange={handleTraineeInputChange}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                                <input
                                                    type="date"
                                                    name="expiry_date"
                                                    value={traineeFormData.expiry_date}
                                                    onChange={handleTraineeInputChange}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex justify-end gap-4 pt-4 border-t">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="px-6 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors"
                                        >
                                            {editingTrainee ? 'Update Trainee' : 'Add Trainee'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }

            {/* Renewal Popup Form */}
            {showRenewalPopup && (
                <div className="fixed inset-0 z-50 bg-gray-700 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl h-auto max-h-[90%] overflow-y-auto mx-auto">
                        <h3 className="text-2xl font-semibold mb-6 text-center">Renew Membership</h3>
                        <form onSubmit={handleRenewalSubmit}>
                            <div className="space-y-4">
                                {/* Student Name (Read-only) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Student Name</label>
                                    <input
                                        type="text"
                                        value={renewalFormData.name}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                                        readOnly
                                    />
                                </div>

                                {/* Roll Number (Read-only) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                                    <input
                                        type="text"
                                        value={renewalFormData.roll_no}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                                        readOnly
                                    />
                                </div>

                                {/* Plan Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Plan Selection</label>
                                    <select
                                        name="plan_id"
                                        value={renewalFormData.plan_id}
                                        onChange={handleRenewalInputChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    >
                                        <option value="">Select a plan</option>
                                        {plans.map((plan) => (
                                            <option key={plan._id} value={plan._id}>{plan.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Amount */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={renewalFormData.amount}
                                        onChange={handleRenewalInputChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                    <select
                                        name="payment_method"
                                        value={renewalFormData.payment_method}
                                        onChange={handleRenewalInputChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    >
                                        <option value="" disabled>Select Payment Method</option>
                                        <option value="CASH">Cash</option>
                                        <option value="UPI">UPI</option>
                                        <option value="CARD">Card</option>
                                        <option value="CHEQUE">Cheque</option>
                                        <option value="NET BANKING">Net Banking</option>
                                        <option value="DEMAND DRAFT">Demand Draft</option>
                                    </select>
                                </div>

                                {/* Start Date (Editable) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={renewalFormData.start_date}
                                        onChange={handleRenewalInputChange}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                                    />
                                </div>

                                {/* Expiry Date (Editable) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                    <input
                                        type="date"
                                        name="expiry_date"
                                        value={renewalFormData.expiry_date}
                                        onChange={(e) =>
                                            setRenewalFormData({
                                                ...renewalFormData,
                                                expiry_date: e.target.value,
                                            })
                                        }
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end mt-6 space-x-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Submit Renewal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper component for detail items
const DetailItem = ({ label, value }) => (
    <div className="p-3 bg-gray-50 rounded-lg">
        <span className="text-sm text-gray-600">{label}</span>
        <p className="font-medium text-gray-900">{value}</p>
    </div>
);

export default TraineeManagement;
