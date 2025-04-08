// import { useState, useEffect } from "react";
// import axios from "axios";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faFilePdf,
//   faFileExcel,
//   faPlus,
//   faTimes,
// } from "@fortawesome/free-solid-svg-icons";
//
// const AccountsOverview = () => {
//   const ip = import.meta.env.VITE_IP;
//   const [accounts, setAccounts] = useState([]);
//   const [fetcheddata, setFetched] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [totals, setTotals] = useState({
//     totalAmount: 0,
//     totalIn: 0,
//     totalOut: 0,
//   });
//   const calculateTotals = (data) => {
//     const totalAmount = data.reduce((sum, account) => sum + account.amount, 0);
//     const totalIn = data
//       .filter((account) => account.amt_in_out === "IN")
//       .reduce((sum, account) => sum + account.amount, 0);
//     const totalOut = data
//       .filter((account) => account.amt_in_out === "OUT")
//       .reduce((sum, account) => sum + account.amount, 0);
//
//     setTotals({ totalAmount, totalIn, totalOut });
//   };
//
//   const [filters, setFilters] = useState({
//     amtInOut: "",
//     fromDate: "",
//     toDate: "",
//     description: "",
//     method: "",
//   });
//   const [showExpenseForm, setShowExpenseForm] = useState(false);
//   const [newExpense, setNewExpense] = useState({
//     amt_in_out: "",
//     amount: "",
//     method: "",
//     description: "",
//   });
//
//   const closeExpenseForm = () => {
//     setNewExpense({
//       amt_in_out: "",
//       amount: "",
//       method: "",
//       description: "",
//     });
//     toggleExpenseForm();
//   };
//
//   const toggleExpenseForm = () => {
//     setShowExpenseForm(!showExpenseForm);
//   };
//
//   const handleExpenseChange = (e) => {
//     setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
//   };
//
//   const handleAddExpense = async (e) => {
//     e.preventDefault();
//
//     try {
//       const email = localStorage.getItem("userid");
//
//       if (!email) {
//         console.error("Missing email or societyId in localStorage");
//         return;
//       }
//
//       await axios.post(`https://${ip}/api/accounts/transaction/add`, {
//         ...newExpense,
//         email,
//       });
//
//       fetchAccounts();
//       setShowExpenseForm(false);
//     } catch (error) {
//       console.error("Error adding expense:", error);
//     }
//   };
//
//   const handleFilterChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };
//
//   useEffect(() => {
//     const currentDate = new Date();
//     const startOfMonth = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       1
//     );
//     const endOfMonth = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth() + 1,
//       0
//     );
//
//     // Set filters' fromDate and toDate to current month start and end
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       fromDate: startOfMonth.toISOString().split("T")[0], // YYYY-MM-DD format
//       toDate: endOfMonth.toISOString().split("T")[0], // YYYY-MM-DD format
//     }));
//     fetchAccounts();
//   }, []);
//
//   const fetchAccounts = async () => {
//     setLoading(true);
//     const userid = localStorage.getItem("userid");
//
//     try {
//       const [fetchedResponse, accountResponse] = await Promise.all([
//         axios.post(`https://${ip}/api/accounts/data`, { userid }),
//         axios.post(`https://${ip}/api/accounts/transactions`, { userid }),
//       ]);
//       setAccounts(
//         Array.isArray(accountResponse.data) ? accountResponse.data : []
//       );
//       setFetched(fetchedResponse.data.balance);
//       setError(null);
//     } catch (error) {
//       console.error("Error fetching accounts:", error);
//       setError("Failed to fetch account data.");
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   const applyFilters = (data) => {
//     if (!Array.isArray(data)) {
//       console.error("applyFilters: Expected an array, got:", data);
//       return [];
//     }
//
//     return data.filter((account) => {
//       const matchesAmtInOut = filters.amtInOut
//         ? account.amt_in_out === filters.amtInOut
//         : true;
//       const metchesMethod = filters.Method
//         ? account.method === filters.Method
//         : true;
//       const matchesDescription = filters.description
//         ? account.description
//             .toLowerCase()
//             .includes(filters.description.toLowerCase())
//         : true;
//
//       let matchesDateRange = true;
//       if (filters.fromDate) {
//         matchesDateRange =
//           new Date(account.createdAt) >= new Date(filters.fromDate);
//       }
//       if (filters.toDate) {
//         matchesDateRange =
//           matchesDateRange &&
//           new Date(account.createdAt) <= new Date(filters.toDate);
//       }
//
//       return (
//         metchesMethod &&
//         matchesAmtInOut &&
//         matchesDescription &&
//         matchesDateRange
//       );
//     });
//   };
//
//   const filteredAccounts = applyFilters(accounts || []);
//   useEffect(() => {
//     calculateTotals(filteredAccounts);
//   }, [filteredAccounts]);
//
//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Account Statement", 20, 10);
//     autoTable(doc, {
//       head: [
//         [
//           "#",
//           "Date",
//           "Amount In/Out",
//           "Amount",
//           "Description",
//           "Method",
//           "Balance Before",
//           "Balance After",
//         ],
//       ],
//       body: filteredAccounts.map((account, index) => [
//         index + 1,
//         new Date(account.createdAt).toLocaleString(),
//         account.amt_in_out,
//         account.amount,
//         account.description,
//         account.method,
//         account.balance_before_transaction,
//         account.balance_after_transaction,
//       ]),
//     });
//     doc.save("account-statement.pdf");
//   };
//
//   const handleDownloadXLSX = () => {
//     const ws = XLSX.utils.json_to_sheet(
//       filteredAccounts.map((account, index) => ({
//         "#": index + 1,
//         Date: new Date(account.createdAt).toLocaleString(),
//         "Amount In/Out": account.amt_in_out,
//         Amount: account.amount,
//         Description: account.description,
//         Method: account.method,
//         "Balance Before": account.balance_before_transaction,
//         "Balance After": account.balance_after_transaction,
//       }))
//     );
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Accounts");
//     const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     const data = new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });
//     saveAs(data, "account-statement.xlsx");
//   };
//
//   return (
//
// <>
// <div className="flex flex-col w-auto mt-3 bg-white rounded-lg">
//   <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center w-full">
//
//     <div className="flex flex-col md:flex-row gap-3 w-full md:w-2/3 items-center">
//       <button
//         onClick={handleDownloadPDF}
//         className="flex items-center justify-center px-4 py-2 bg-white text-red-500 font-semibold rounded-lg shadow-md hover:bg-red-500 hover:text-white transition duration-200 ease-in-out"
//       >
//         <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
//         Download PDF
//       </button>
//
//       <button
//         onClick={handleDownloadXLSX}
//         className="flex items-center justify-center px-4 py-2 bg-white text-green-500 font-semibold rounded-lg shadow-md hover:bg-green-500 hover:text-white transition duration-200 ease-in-out"
//       >
//         <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
//         Download XLSX
//       </button>
//
//       <button
//         onClick={toggleExpenseForm}
//         className="flex items-center justify-center px-4 py-2 bg-white text-indigo-500 font-semibold rounded-lg shadow-md hover:bg-indigo-500 hover:text-white transition duration-200 ease-in-out"
//       >
//         <FontAwesomeIcon
//           icon={showExpenseForm ? faTimes : faPlus}
//           className="mr-2"
//         />
//         {showExpenseForm ? "Cancel" : "Add Entry"}
//       </button>
//     </div>
//   </div>
//
//   <div className="flex flex-col md:flex-row gap-6 mt-6">
//     {/* Filter Section */}
//     <div className="flex flex-col w-full gap-3">
//       <h2 className="text-xl font-bold">Filters</h2>
//       <div className="flex flex-wrap gap-3 items-center">
//         <div className="flex flex-col w-full sm:w-1/2 md:w-1/5">
//           <label className="block text-sm font-medium mb-2">Amount In/Out:</label>
//           <select
//             name="amtInOut"
//             value={filters.amtInOut}
//             onChange={handleFilterChange}
//             className="form-select rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             <option value="">All</option>
//             <option value="IN">IN</option>
//             <option value="OUT">OUT</option>
//           </select>
//         </div>
//
//         <div className="flex flex-col w-full sm:w-1/2 md:w-1/5">
//           <label className="block text-sm font-medium mb-2">Method:</label>
//           <select
//             name="Method"
//             value={filters.Method}
//             onChange={handleFilterChange}
//             className="form-select rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             <option value="">All</option>
//             <option value="CASH">CASH</option>
//             <option value="UPI">UPI</option>
//             <option value="CARD">CARD</option>
//             <option value="NET BANKING">NET BANKING</option>
//             <option value="CHEQUE">CHEQUE</option>
//             <option value="DEMAND DRAFT">DEMAND DRAFT</option>
//           </select>
//         </div>
//
//         <div className="flex flex-col w-full sm:w-1/2 md:w-1/5">
//           <label className="block text-sm font-medium mb-2">Description:</label>
//           <input
//             type="text"
//             name="description"
//             value={filters.description}
//             onChange={handleFilterChange}
//             className="form-input rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>
//
//         <div className="flex flex-col w-full sm:w-1/2 md:w-1/5">
//           <label className="block text-sm font-medium mb-2">From Date:</label>
//           <input
//             type="date"
//             name="fromDate"
//             value={filters.fromDate}
//             onChange={handleFilterChange}
//             className="form-input rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>
//
//         <div className="flex flex-col w-full sm:w-1/2 md:w-1/5">
//           <label className="block text-sm font-medium mb-2">To Date:</label>
//           <input
//             type="date"
//             name="toDate"
//             value={filters.toDate}
//             onChange={handleFilterChange}
//             className="form-input rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>
//       </div>
//     </div>
//
//     {/* Total IN/OUT Section */}
//     <div className="flex flex-col w-full md:w-1/3 gap-6">
//       <div className="flex flex-col bg-white rounded-lg p-3 shadow-md border border-indigo-300">
//         <h3 className="text-lg font-semibold text-indigo-600">Current Balance</h3>
//         <p className="text-2xl font-bold text-indigo-700">₹ {fetcheddata}</p>
//       </div>
//
//       <div className="flex flex-col bg-white rounded-lg p-3 shadow-md border border-green-300">
//         <h3 className="text-lg font-semibold text-green-600">Total IN</h3>
//         <p className="text-2xl font-bold text-green-700">₹ {totals.totalIn}</p>
//       </div>
//
//       <div className="flex flex-col bg-white rounded-lg p-3 shadow-md border border-red-300">
//         <h3 className="text-lg font-semibold text-red-600">Total OUT</h3>
//         <p className="text-2xl font-bold text-red-700">₹ {totals.totalOut}</p>
//       </div>
//     </div>
//   </div>
//
//   {/* Account Table */}
//   <div className="overflow-x-auto border-2 rounded-lg mt-6">
//     <table className="table-auto w-full text-sm">
//       <thead className="bg-gray-100 border-b text-gray-600">
//         <tr className="text-center">
//           <th className="px-4 py-2">#</th>
//           <th className="px-4 py-2">Date</th>
//           <th className="px-4 py-2">Amount In/Out</th>
//           <th className="px-4 py-2">Amount</th>
//           <th className="px-4 py-2">Description</th>
//           <th className="px-4 py-2">Method</th>
//           <th className="px-4 py-2">Balance Before</th>
//           <th className="px-4 py-2">Balance After</th>
//         </tr>
//       </thead>
//       <tbody className="text-center">
//         {filteredAccounts.map((account, index) => (
//           <tr key={index} className="border-b">
//             <td className="px-4 py-2">{index + 1}</td>
//             <td className="px-4 py-2">{new Date(account.createdAt).toLocaleString()}</td>
//             <td
//               className={`px-4 py-2 ${
//                 account.amt_in_out === "IN" ? "text-green-600" : "text-red-600"
//               }`}
//             >
//               {account.amt_in_out}
//             </td>
//             <td className="px-4 py-2">{account.amount}</td>
//             <td className="px-4 py-2">{account.description}</td>
//             <td className="px-4 py-2">{account.method}</td>
//             <td className="px-4 py-2">{account.balance_before_transaction}</td>
//             <td className="px-4 py-2">{account.balance_after_transaction}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
//
//   {loading && <p>Loading accounts...</p>}
//   {error && <p className="text-red-500">{error}</p>}
// </div>
//
//
//   {showExpenseForm && (
//     <div className="fixed top-0 left-0 w-screen h-screen bg-gray-500 bg-opacity-50 flex items-center justify-center">
//       <form
//         onSubmit={handleAddExpense}
//         className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[50%]"
//       >
//         <h2 className="text-lg font-bold mb-4">Add New Expense</h2>
//         <div className="flex flex-col gap-6">
//           <div className="flex flex-col">
//             <label htmlFor="amt_in_out">Amount In/Out:</label>
//             <select
//               id="amt_in_out"
//               name="amt_in_out"
//               value={newExpense.amt_in_out}
//               onChange={handleExpenseChange}
//               className="form-select rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               required
//             >
//               <option value="">Select</option>
//               <option value="IN">IN</option>
//               <option value="OUT">OUT</option>
//             </select>
//           </div>
//
//           <div className="flex flex-col">
//             <label htmlFor="method">Method:</label>
//             <select
//               id="method"
//               name="method"
//               value={newExpense.method}
//               onChange={handleExpenseChange}
//               className="form-select rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               required
//             >
//               <option value="">Select</option>
//               <option value="CASH">CASH</option>
//               <option value="UPI">UPI</option>
//               <option value="CARD">CARD</option>
//               <option value="NET BANKING">NET BANKING</option>
//               <option value="CHEQUE">CHEQUE</option>
//               <option value="DEMAND DRAFT">DEMAND DRAFT</option>
//             </select>
//           </div>
//
//           <div className="flex flex-col">
//             <label htmlFor="amount">Amount:</label>
//             <input
//               id="amount"
//               name="amount"
//               type="number"
//               value={newExpense.amount}
//               onChange={handleExpenseChange}
//               className="form-input rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               required
//             />
//           </div>
//
//           <div className="flex flex-col">
//             <label htmlFor="description">Description:</label>
//             <input
//               id="description"
//               name="description"
//               type="text"
//               value={newExpense.description}
//               onChange={handleExpenseChange}
//               className="form-input rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               required
//             />
//           </div>
//
//           <div className="flex gap-6 mt-4">
//             <button
//               type="submit"
//               className="bg-indigo-500 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-200 ease-in-out"
//             >
//               Add Expense
//             </button>
//             <button
//               type="button"
//               onClick={closeExpenseForm}
//               className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   )}
// </>
//
//
//   );
// };
//
// export default AccountsOverview;


import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  FileText,
  FileSpreadsheet,
  Plus,
  X,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet
} from 'lucide-react';

const AccountsOverview = () => {
  const ip = import.meta.env.VITE_IP;
  const [accounts, setAccounts] = useState([]);
  const [fetcheddata, setFetched] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState({
    totalAmount: 0,
    totalIn: 0,
    totalOut: 0,
  });

  const [filters, setFilters] = useState({
    amtInOut: "",
    fromDate: "",
    toDate: "",
    description: "",
    method: "",
  });

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amt_in_out: "",
    amount: "",
    method: "",
    description: "",
  });

  // Calculate totals from filtered data
  const calculateTotals = (data) => {
    const totalAmount = data.reduce((sum, account) => sum + account.amount, 0);
    const totalIn = data
      .filter((account) => account.amt_in_out === "IN")
      .reduce((sum, account) => sum + account.amount, 0);
    const totalOut = data
      .filter((account) => account.amt_in_out === "OUT")
      .reduce((sum, account) => sum + account.amount, 0);

    setTotals({ totalAmount, totalIn, totalOut });
  };

  // Form handlers
  const closeExpenseForm = () => {
    setNewExpense({
      amt_in_out: "",
      amount: "",
      method: "",
      description: "",
    });
    setShowExpenseForm(false);
  };

  const handleExpenseChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const email = localStorage.getItem("userid");
      if (!email) {
        throw new Error("User ID not found");
      }
      await axios.post(`${ip}/api/accounts/transaction/add`, {
        ...newExpense,
        email,
      });
      fetchAccounts();
      closeExpenseForm();
    } catch (error) {
      console.error("Error adding expense:", error);
      setError("Failed to add expense");
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Fetch accounts data
  const fetchAccounts = async () => {
    setLoading(true);
    const userid = localStorage.getItem("userid");
    try {
      const [fetchedResponse, accountResponse] = await Promise.all([
        axios.post(`${ip}/api/accounts/data`, { userid }),
        axios.post(`${ip}/api/accounts/transactions`, { userid }),
      ]);
      setAccounts(Array.isArray(accountResponse.data) ? accountResponse.data : []);
      setFetched(fetchedResponse.data.balance);
      setError(null);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setError("Failed to fetch account data");
    } finally {
      setLoading(false);
    }
  };



  // Filter accounts
  // const applyFilters = (data) => {
  //   if (!Array.isArray(data)) return [];

  //   return data.filter((account) => {
  //     const matchesAmtInOut = !filters.amtInOut || account.amt_in_out === filters.amtInOut;
  //     const matchesMethod = !filters.method || account.method === filters.method;
  //     const matchesDescription = !filters.description ||
  //         account.description.toLowerCase().includes(filters.description.toLowerCase());

  //     let matchesDateRange = true;
  //     if (filters.fromDate) {
  //       matchesDateRange = new Date(account.createdAt) >= new Date(filters.fromDate);
  //     }
  //     if (filters.toDate) {
  //       matchesDateRange = matchesDateRange &&
  //           new Date(account.createdAt) <= new Date(filters.toDate);
  //     }

  //     return matchesAmtInOut && matchesMethod && matchesDescription && matchesDateRange;
  //   });
  // };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default to 10 items per page
  const [filteredData, setFilteredData] = useState([]);

  // Function to filter and sort data
  const applyFilters = (data) => {
    if (!Array.isArray(data)) return [];

    const filtered = data.filter((account) => {
      const matchesAmtInOut = !filters.amtInOut || account.amt_in_out === filters.amtInOut;
      const matchesMethod = !filters.method || account.method === filters.method;
      const matchesDescription = !filters.description ||
        account.description.toLowerCase().includes(filters.description.toLowerCase());

      let matchesDateRange = true;
      if (filters.fromDate) {
        matchesDateRange = new Date(account.createdAt) >= new Date(filters.fromDate);
      }
      if (filters.toDate) {
        matchesDateRange = matchesDateRange &&
          new Date(account.createdAt) <= new Date(filters.toDate);
      }

      return matchesAmtInOut && matchesMethod && matchesDescription && matchesDateRange;
    });

    // Sort the filtered data in descending order based on createdAt
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  // Apply filters whenever accounts or filters change
  useEffect(() => {
    setFilteredData(applyFilters(accounts));
    setCurrentPage(1); // Reset to first page when filters change
  }, [accounts, filters]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Slice data for the current page
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);



  // Export functions
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Account Statement", 20, 10);
    autoTable(doc, {
      head: [
        [
          "#",
          "Date",
          "Amount In/Out",
          "Amount",
          "Description",
          "Method",
          "Balance Before",
          "Balance After",
        ],
      ],
      body: filteredAccounts.map((account, index) => [
        index + 1,
        new Date(account.createdAt).toLocaleString(),
        account.amt_in_out,
        account.amount,
        account.description,
        account.method,
        account.balance_before_transaction,
        account.balance_after_transaction,
      ]),
    });
    doc.save("account-statement.pdf");
  };

  const handleDownloadXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredAccounts.map((account, index) => ({
        "#": index + 1,
        Date: new Date(account.createdAt).toLocaleString(),
        "Amount In/Out": account.amt_in_out,
        Amount: account.amount,
        Description: account.description,
        Method: account.method,
        "Balance Before": account.balance_before_transaction,
        "Balance After": account.balance_after_transaction,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Accounts");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "account-statement.xlsx");
  };

  // Initialize filters with current month
  useEffect(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 2);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    setFilters(prev => ({
      ...prev,
      fromDate: startOfMonth.toISOString().split('T')[0],
      toDate: endOfMonth.toISOString().split('T')[0],
    }));

    fetchAccounts();
  }, []);

  const filteredAccounts = applyFilters(accounts);

  useEffect(() => {
    calculateTotals(filteredAccounts);
  }, [filteredAccounts]);

  return (
    <div className="min-h-screen bg-transparent p-0 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
          <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={handleDownloadPDF}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm sm:text-base"
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              Export PDF
            </button>

            <button
              onClick={handleDownloadXLSX}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm sm:text-base"
            >
              <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              Export Excel
            </button>
          </div>

          <button
            onClick={() => setShowExpenseForm(true)}
            className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm sm:text-base sm:ml-auto"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
            Add Transaction
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Current Balance</h3>
              <Wallet className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-blue-600 mt-2">₹{fetcheddata || 0}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Total In</h3>
              <ArrowUpCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600 mt-2">₹{totals.totalIn}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-red-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Total Out</h3>
              <ArrowDownCircle className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-red-600 mt-2">₹{totals.totalOut}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Filters</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                name="amtInOut"
                value={filters.amtInOut}
                onChange={handleFilterChange}
                className="w-full rounded-md sm:rounded-lg text-sm border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1.5 sm:py-2"
              >
                <option value="">All</option>
                <option value="IN">IN</option>
                <option value="OUT">OUT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Method
              </label>
              <select
                name="method"
                value={filters.method}
                onChange={handleFilterChange}
                className="w-full rounded-md sm:rounded-lg text-sm border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1.5 sm:py-2"
              >
                <option value="">All</option>
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
                <option value="CARD">Card</option>
                <option value="NET BANKING">Net Banking</option>
                <option value="CHEQUE">Cheque</option>
                <option value="DEMAND DRAFT">Demand Draft</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-3 lg:col-span-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={filters.description}
                onChange={handleFilterChange}
                placeholder="Search..."
                className="w-full rounded-md sm:rounded-lg text-sm border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1.5 sm:py-2"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleFilterChange}
                className="w-full rounded-md sm:rounded-lg text-sm border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1.5 sm:py-2"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                name="toDate"
                value={filters.toDate}
                onChange={handleFilterChange}
                className="w-full rounded-md sm:rounded-lg text-sm border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1.5 sm:py-2"
              />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        {/* <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance Before
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance After
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filteredAccounts.map((account, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(account.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${account.amt_in_out === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {account.amt_in_out}
                      </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{account.amount}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {account.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {account.method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{account.balance_before_transaction}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{account.balance_after_transaction}
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div> */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          
          {/* Pagination Controls */}
          <div className="flex justify-between items-center p-4">
            <span className="text-gray-600 text-sm">
              Showing {itemsPerPage} records per page
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to page 1 when changing limit
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              {[10, 25, 50, 100].map((limit) => (
                <option key={limit} value={limit}>
                  {limit}
                </option>
              ))}
            </select>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center p-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance Before</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance After</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((account, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(account.createdAt).toLocaleString()}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(account.createdAt)
                        .toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true, // Enables AM/PM format
                        })
                        .replace("am", "AM")
                        .replace("pm", "PM")}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${account.amt_in_out === "IN" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                      >
                        {account.amt_in_out}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{account.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{account.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.method}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{account.balance_before_transaction.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{account.balance_after_transaction.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center p-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showExpenseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Transaction</h2>
              <button
                onClick={closeExpenseForm}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  name="amt_in_out"
                  value={newExpense.amt_in_out}
                  onChange={handleExpenseChange}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="IN">IN</option>
                  <option value="OUT">OUT</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Method
                </label>
                <select
                  name="method"
                  value={newExpense.method}
                  onChange={handleExpenseChange}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Method</option>
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="CARD">Card</option>
                  <option value="NET BANKING">Net Banking</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="DEMAND DRAFT">Demand Draft</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={newExpense.amount}
                  onChange={handleExpenseChange}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={newExpense.description}
                  onChange={handleExpenseChange}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Transaction
                </button>
                <button
                  type="button"
                  onClick={closeExpenseForm}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-0 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4">
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsOverview;
