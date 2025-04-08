// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Plus, Edit2, Package, ShoppingCart, RefreshCcw, Search, PlusCircle, History } from 'lucide-react';
// const ip = import.meta.env.VITE_IP;
// const InventoryManagement = () => {
//     const [inventory, setInventory] = useState([]);
//     const [givenInventory, setGivenInventory] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [formData, setFormData] = useState({
//         name: '',
//         amount: '',
//         qty: '',
//         description: ''
//     });
//     const [selectedItem, setSelectedItem] = useState(null);
//     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//     const [isAllotModalOpen, setIsAllotModalOpen] = useState(false);
//     const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
//     const [isGivenInventoryModalOpen, setIsGivenInventoryModalOpen] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [addItemQty, setAddItemQty] = useState('');

//     const userid = localStorage.getItem('userid') // Replace with actual user ID

//     useEffect(() => {
//         fetchInventory();
//     }, []);

//     const fetchInventory = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.post(`${ip}/api/inventory/get-all-inventory`, {
//                 userid: userid
//             });
//             setInventory(response.data);
//         } catch (error) {
//             console.error('Error fetching inventory:', error);
//         }
//         setLoading(false);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             if (selectedItem) {
//                const response = await axios.post(`${ip}/api/inventory/update-inventory`, {
//                     userid: userid,
//                     invid: selectedItem._id,
//                     ...formData
//                 });
//                 if (response.status == 200){
//                     fetchInventory();
//                     setIsAddModalOpen(false);
//                     setSelectedItem(null);
//                     setFormData({ name: '', amount: '', qty: '', description: '' });
//                 }
//             } else {
//                 console.log(formData)
//                 const response = await axios.post(`${ip}/api/inventory/add-inventory`, {
//                     userid: userid,
//                     ...formData
//                 });
//                 if (response.status == 200){
//                     fetchInventory();
//                     setIsAddModalOpen(false);
//                     setSelectedItem(null);
//                     setFormData({ name: '', amount: '', qty: '', description: '' });
//                 }
//             }

//         } catch (error) {
//             console.error('Error saving inventory:', error);
//         }
//     };

//     const handleAllotItem = async (e) => {
//         e.preventDefault();
//         try {
//             const totalAmount = parseFloat(formData.amount) * parseInt(formData.qty);

//             await axios.post(`${ip}/api/inventory/alot-item`, {
//                 userid: userid,
//                 invid: selectedItem._id,
//                 name: formData.name,
//                 amount: totalAmount, // Updated amount calculation
//                 qty: parseInt(formData.qty),
//                 description: formData.description,
//                 payment_method: formData.payment_method || 'CASH'
//             });

//             fetchInventory();
//             setIsAllotModalOpen(false);
//             setSelectedItem(null);
//             setFormData({ name: '', amount: '', qty: '', description: '', payment_method: 'CASH' });
//         } catch (error) {
//             console.error('Error allotting item:', error);
//         }
//     };


//     const handleAddItem = async (e) => {
//         e.preventDefault();
//         try {
//             console.log(selectedItem._id)
//             await axios.post(`${ip}/api/inventory/add-item`, {
//                 userid: userid,
//                 invid: selectedItem._id,
//                 qty: parseInt(addItemQty)
//             });
//             fetchInventory();
//             setIsAddItemModalOpen(false);
//             setSelectedItem(null);
//             setAddItemQty('');
//         } catch (error) {
//             console.error('Error adding item:', error);
//         }
//     };

//     const fetchGivenInventory = async (invid) => {
//         try {
//             const response = await axios.post(`${ip}/api/inventory/fetch-given`, {
//                 userid: userid,
//                 invid
//             });
//             console.log(response);
//             setGivenInventory(response.data);
//             setIsGivenInventoryModalOpen(true);
//         } catch (error) {
//             console.error('Error fetching given inventory:', error);
//         }
//     };



//     const filteredInventory = inventory.filter(item =>
//         item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.description.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="min-h-screen bg-gray-50 p-6">
//             <div className="max-w-7xl mx-auto">
//                 <div className="flex justify-between items-center mb-8">
//                     <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
//                     <button
//                         onClick={() => setIsAddModalOpen(true)}
//                         className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                         <Plus className="w-5 h-5 mr-2" />
//                         Add New Item
//                     </button>
//                 </div>

//                 <div className="mb-6 flex items-center bg-white rounded-lg shadow-sm p-2 border-gray-400">
//                     <Search className="w-5 h-5 text-gray-400 mr-2" />
//                     <input
//                         type="text"
//                         placeholder="Search inventory..."
//                         className="w-full outline-none"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                 </div>

//                 <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                             </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                             {loading ? (
//                                 <tr>
//                                     <td colSpan="5" className="px-6 py-4 text-center">Loading...</td>
//                                 </tr>
//                             ) : filteredInventory.map((item) => (
//                                 <tr key={item._id} className="hover:bg-gray-50">
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <div className="flex items-center">
//                                             <Package className="w-5 h-5 text-gray-400 mr-2" />
//                                             <span className="font-medium text-gray-900">{item.name}</span>
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.qty}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-gray-500">${item.amount}</td>
//                                     <td className="px-6 py-4 text-gray-500">{item.description}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <div className="flex space-x-2">
//                                             <button
//                                                 onClick={() => {
//                                                     setSelectedItem(item);
//                                                     setFormData(item);
//                                                     setIsAddModalOpen(true);
//                                                 }}
//                                                 className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
//                                                 title="Edit"
//                                             >
//                                                 <Edit2 className="w-4 h-4" />
//                                             </button>
//                                             <button
//                                                 onClick={() => {
//                                                     setSelectedItem(item);
//                                                     setFormData(item);
//                                                     setIsAllotModalOpen(true);
//                                                 }}
//                                                 className="p-2 text-green-600 hover:bg-green-50 rounded-full"
//                                                 title="Allot"
//                                             >
//                                                 <ShoppingCart className="w-4 h-4" />
//                                             </button>
//                                             <button
//                                                 onClick={() => {
//                                                     setSelectedItem(item);
//                                                     setIsAddItemModalOpen(true);
//                                                 }}
//                                                 className="p-2 text-purple-600 hover:bg-purple-50 rounded-full"
//                                                 title="Add Items"
//                                             >
//                                                 <PlusCircle className="w-4 h-4" />
//                                             </button>
//                                             <button
//                                                 onClick={() => fetchGivenInventory(item._id)}
//                                                 className="p-2 text-orange-600 hover:bg-orange-50 rounded-full"
//                                                 title="View Given History"
//                                             >
//                                                 <History className="w-4 h-4" />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>

//             {/* Add/Edit Modal */}
//             {isAddModalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-lg max-w-md w-full p-6">
//                         <h2 className="text-xl font-semibold mb-4">
//                             {selectedItem ? 'Edit Item' : 'Add New Item'}
//                         </h2>
//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                                 <input
//                                     type="text"
//                                     value={formData.name}
//                                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                                     required
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Amount</label>
//                                 <input
//                                     type="number"
//                                     value={formData.amount}
//                                     onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                                     required
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Quantity</label>
//                                 <input
//                                     type="number"
//                                     value={formData.qty}
//                                     onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                                     required
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Description</label>
//                                 <textarea
//                                     value={formData.description}
//                                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                                     rows="3"
//                                     required
//                                 />
//                             </div>
//                             <div className="flex justify-end space-x-3">
//                                 <button
//                                     type="button"
//                                     onClick={() => {
//                                         setIsAddModalOpen(false);
//                                         setSelectedItem(null);
//                                         setFormData({ name: '', amount: '', qty: '', description: '', payment_method: 'CASH' });
//                                     }}
//                                     className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                                 >
//                                     {selectedItem ? 'Update' : 'Add'}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* Allot Modal */}
// {isAllotModalOpen && selectedItem && (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <h2 className="text-xl font-semibold mb-4">Allot Item</h2>
//             <form onSubmit={handleAllotItem} className="space-y-4">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Name</label>
//                     <input
//                         type="text"
//                         value={formData.name}
//                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Amount (Per Unit)</label>
//                     <input
//                         type="number"
//                         value={formData.amount}
//                         onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Quantity to Allot</label>
//                     <input
//                         type="number"
//                         value={formData.qty}
//                         onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
//                         max={selectedItem?.qty}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Total Amount</label>
//                     <input
//                         type="text"
//                         value={formData.qty && formData.amount ? (parseFloat(formData.amount) * parseInt(formData.qty)).toFixed(2) : 0}
//                         readOnly
//                         className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Description</label>
//                     <textarea
//                         value={formData.description}
//                         onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                         rows="3"
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Payment Method</label>
//                     <select
//                         value={formData.payment_method || 'CASH'}
//                         onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                         required
//                     >
//                         <option value="CASH">Cash</option>
//                         <option value="CARD">Card</option>
//                         <option value="UPI">UPI</option>
//                         <option value="BANK_TRANSFER">Bank Transfer</option>
//                     </select>
//                 </div>
//                 <div className="flex justify-end space-x-3">
//                     <button
//                         type="button"
//                         onClick={() => {
//                             setIsAllotModalOpen(false);
//                             setSelectedItem(null);
//                             setFormData({ name: '', amount: '', qty: '', description: '', payment_method: 'CASH' });
//                         }}
//                         className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//                     >
//                         Allot
//                     </button>
//                 </div>
//             </form>
//         </div>
//     </div>
// )}

//             {/* Add Item Modal */}
//             {isAddItemModalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-lg max-w-md w-full p-6">
//                         <h2 className="text-xl font-semibold mb-4">Add Items to Inventory</h2>
//                         <form onSubmit={handleAddItem} className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Quantity to Add</label>
//                                 <input
//                                     type="number"
//                                     value={addItemQty}
//                                     onChange={(e) => setAddItemQty(e.target.value)}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                                     required
//                                     min="1"
//                                 />
//                             </div>
//                             <div className="flex justify-end space-x-3">
//                                 <button
//                                     type="button"
//                                     onClick={() => {
//                                         setIsAddItemModalOpen(false);
//                                         setSelectedItem(null);
//                                         setAddItemQty('');
//                                     }}
//                                     className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//                                 >
//                                     Add Items
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* Given Inventory Modal */}
//             {isGivenInventoryModalOpen && (
//                 <div onClick={() => setIsGivenInventoryModalOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-lg max-w-4xl w-full p-6">
//                         <div className="flex justify-between items-center mb-4">
//                             <h2 className="text-xl font-semibold">Given Inventory History</h2>
//                             <button
//                                 onClick={() => setIsGivenInventoryModalOpen(false)}
//                                 className="text-gray-500 hover:text-gray-700"
//                             >
//                                 ×
//                             </button>
//                         </div>
//                         <div className="overflow-x-auto">
//                             <table className="min-w-full divide-y divide-gray-200">
//                                 <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Amount</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
//                                 </tr>
//                                 </thead>
//                                 <tbody className="bg-white divide-y divide-gray-200">
//                                 {givenInventory.map((item, index) => (
//                                     <tr key={index}>
//                                         <td className="px-6 py-4 whitespace-nowrap text-gray-500">
//                                             {new Date(item.createdAt).toLocaleDateString()}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.name}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.qty}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.payment_method}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.amount}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.description}</td>
//                                     </tr>
//                                 ))}
//                                 {givenInventory.length === 0 && (
//                                     <tr>
//                                         <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
//                                             No history found
//                                         </td>
//                                     </tr>
//                                 )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default InventoryManagement;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Package, ShoppingCart, RefreshCcw, Search, PlusCircle, History, Loader2 } from 'lucide-react';

const ip = import.meta.env.VITE_IP;

const InventoryManagement = () => {
    const [inventory, setInventory] = useState([]);
    const [givenInventory, setGivenInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        qty: '',
        description: ''
    });
    const [selectedItem, setSelectedItem] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAllotModalOpen, setIsAllotModalOpen] = useState(false);
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const [isGivenInventoryModalOpen, setIsGivenInventoryModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [addItemQty, setAddItemQty] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitAction, setSubmitAction] = useState('');

    const userid = localStorage.getItem('userid')

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${ip}/api/inventory/get-all-inventory`, {
                userid: userid
            });
            setInventory(response.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        setSubmitAction(selectedItem ? 'Updating...' : 'Adding...');

        try {
            if (selectedItem) {
                const response = await axios.post(`${ip}/api/inventory/update-inventory`, {
                    userid: userid,
                    invid: selectedItem._id,
                    ...formData
                });
                if (response.status === 200) {
                    fetchInventory();
                    setIsAddModalOpen(false);
                    setSelectedItem(null);
                    setFormData({ name: '', amount: '', qty: '', description: '' });
                }
            } else {
                const response = await axios.post(`${ip}/api/inventory/add-inventory`, {
                    userid: userid,
                    ...formData
                });
                if (response.status === 200) {
                    fetchInventory();
                    setIsAddModalOpen(false);
                    setSelectedItem(null);
                    setFormData({ name: '', amount: '', qty: '', description: '' });
                }
            }
        } catch (error) {
            console.error('Error saving inventory:', error);
        } finally {
            setIsSubmitting(false);
            setSubmitAction('');
        }
    };

    const handleAllotItem = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        setSubmitAction('Alloting...');

        try {
            const totalAmount = parseFloat(formData.amount) * parseInt(formData.qty);
            await axios.post(`${ip}/api/inventory/alot-item`, {
                userid: userid,
                invid: selectedItem._id,
                name: formData.name,
                amount: totalAmount,
                qty: parseInt(formData.qty),
                description: formData.description,
                payment_method: formData.payment_method || 'CASH'
            });

            fetchInventory();
            setIsAllotModalOpen(false);
            setSelectedItem(null);
            setFormData({ name: '', amount: '', qty: '', description: '', payment_method: 'CASH' });
        } catch (error) {
            console.error('Error allotting item:', error);
        } finally {
            setIsSubmitting(false);
            setSubmitAction('');
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        setSubmitAction('Adding Items...');

        try {
            await axios.post(`${ip}/api/inventory/add-item`, {
                userid: userid,
                invid: selectedItem._id,
                qty: parseInt(addItemQty)
            });
            fetchInventory();
            setIsAddItemModalOpen(false);
            setSelectedItem(null);
            setAddItemQty('');
        } catch (error) {
            console.error('Error adding item:', error);
        } finally {
            setIsSubmitting(false);
            setSubmitAction('');
        }
    };

    const fetchGivenInventory = async (invid) => {
        try {
            const response = await axios.post(`${ip}/api/inventory/fetch-given`, {
                userid: userid,
                invid
            });
            console.log(response);
            setGivenInventory(response.data);
            setIsGivenInventoryModalOpen(true);
        } catch (error) {
            console.error('Error fetching given inventory:', error);
        }
    };

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [totalAmount, setTotalAmount] = useState(
        formData.qty && formData.amount ? (parseFloat(formData.amount) * parseInt(formData.qty)).toFixed(2) : 0
    );

    useEffect(() => {
        setTotalAmount(
            formData.qty && formData.amount ? (parseFloat(formData.amount) * parseInt(formData.qty)).toFixed(2) : 0
        );
    }, [formData.qty, formData.amount]);


    return (
        <div className="min-h-screen bg-transparent p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Item
                    </button>
                </div>

                <div className="mb-6 flex items-center bg-white rounded-lg shadow-sm p-2 border-gray-400">
                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search inventory..."
                        className="w-full outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center">Loading...</td>
                                </tr>
                            ) : filteredInventory.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Package className="w-5 h-5 text-gray-400 mr-2" />
                                            <span className="font-medium text-gray-900">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.qty}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">₹{item.amount}</td>
                                    <td className="px-6 py-4 text-gray-500">{item.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setFormData(item);
                                                    setIsAddModalOpen(true);
                                                }}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setFormData(item);
                                                    setIsAllotModalOpen(true);
                                                }}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                                                title="Allot"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setIsAddItemModalOpen(true);
                                                }}
                                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-full"
                                                title="Add Items"
                                            >
                                                <PlusCircle className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => fetchGivenInventory(item._id)}
                                                className="p-2 text-orange-600 hover:bg-orange-50 rounded-full"
                                                title="View Given History"
                                            >
                                                <History className="w-4 h-4" />
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

            {/* Add/Edit Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {selectedItem ? 'Edit Item' : 'Add New Item'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Amount</label>
                                <input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                <input
                                    type="number"
                                    value={formData.qty}
                                    onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddModalOpen(false);
                                        setSelectedItem(null);
                                        setFormData({ name: '', amount: '', qty: '', description: '', payment_method: 'CASH' });
                                    }}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 relative ${
                                        isSubmitting ? 'cursor-not-allowed opacity-70' : ''
                                    }`}
                                >
                                    {isSubmitting && submitAction === (selectedItem ? 'Updating...' : 'Adding...') ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                                            {submitAction}
                                        </>
                                    ) : (
                                        selectedItem ? 'Update' : 'Add'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Allot Modal */}
            {isAllotModalOpen && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-semibold mb-4">Allot Item</h2>
                        <form onSubmit={handleAllotItem} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Amount (Per Unit)</label>
                                <input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quantity to Allot</label>
                                <input
                                    type="number"
                                    value={formData.qty}
                                    onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                                    max={selectedItem?.qty}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                                <input
                                    type="text"
                                    value={totalAmount}
                                    onChange={(e) => setTotalAmount(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                <select
                                    value={formData.payment_method || 'CASH'}
                                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                >
                                    <option value="CASH">Cash</option>
                                    <option value="CARD">Card</option>
                                    <option value="UPI">UPI</option>
                                    <option value="BANK_TRANSFER">Bank Transfer</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAllotModalOpen(false);
                                        setSelectedItem(null);
                                        setFormData({ name: '', amount: '', qty: '', description: '', payment_method: 'CASH' });
                                    }}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 relative ${
                                        isSubmitting ? 'cursor-not-allowed opacity-70' : ''
                                    }`}
                                >
                                    {isSubmitting && submitAction === 'Alloting...' ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                                            {submitAction}
                                        </>
                                    ) : (
                                        'Allot'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Item Modal */}
            {isAddItemModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-semibold mb-4">Add Items to Inventory</h2>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quantity to Add</label>
                                <input
                                    type="number"
                                    value={addItemQty}
                                    onChange={(e) => setAddItemQty(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    min="1"
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddItemModalOpen(false);
                                        setSelectedItem(null);
                                        setAddItemQty('');
                                    }}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 relative ${
                                        isSubmitting ? 'cursor-not-allowed opacity-70' : ''
                                    }`}
                                >
                                    {isSubmitting && submitAction === 'Adding Items...' ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                                            {submitAction}
                                        </>
                                    ) : (
                                        'Add Items'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Given Inventory Modal */}
            {isGivenInventoryModalOpen && (
                <div onClick={() => setIsGivenInventoryModalOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Given Inventory History</h2>
                            <button
                                onClick={() => setIsGivenInventoryModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {givenInventory.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.qty}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.payment_method}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.amount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.description}</td>
                                    </tr>
                                ))}
                                {givenInventory.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                            No history found
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryManagement;
