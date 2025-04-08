import React, { useState, useEffect } from "react";
import axios from "axios";
import TraineeManagement from "./TraineeManagement";
import {
  Plus,
  Edit,
  Users,
  ClipboardList,
  CheckCircle,
  XCircle
} from 'lucide-react';

const AcademyManagement = () => {
  const ip = import.meta.env.VITE_IP;
  const [plans, setPlans] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showPlans, setShowPlans] = useState(false);
  const [showTrainee, setShowTrainee] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    plan_limit: "",
    sport: "",
    active: true,
  });

  const toggleSection = (section) => {
    if (section === 'plans') {
      setShowPlans(!showPlans);
    } else if (section === 'trainee') {
      setShowTrainee(!showTrainee);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.post(`${ip}/api/academy/all-plans`, {
        userId: localStorage.getItem("userid"),
      });
      setPlans(response.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await axios.put(
            `${ip}/api/academy/update-plan/${editingPlan._id}`,
            formData
        );
      } else {
        await axios.post(`${ip}/api/academy/add-plan`, {
          ...formData,
          userId: localStorage.getItem("userid"),
        });
      }

      setFormData({
        name: "",
        amount: "",
        plan_limit: "",
        sport: "",
        active: true,
      });
      setShowPopup(false);
      setEditingPlan(null);
      fetchPlans();
    } catch (error) {
      console.error("Error saving plan:", error);
    }
  };

  const togglePlanActive = async (id) => {
    try {
      await axios.patch(
          `${ip}/api/academy/update-plan-status/${id}/toggle`
      );
      fetchPlans();
    } catch (error) {
      console.error("Error toggling plan status:", error);
    }
  };

  const openEditPopup = (plan) => {
    setEditingPlan(plan);
    setFormData(plan);
    setShowPopup(true);
  };

  const openAddPopup = () => {
    setEditingPlan(null);
    setFormData({
      name: "",
      amount: "",
      plan_limit: "",
      sport: "",
      active: true,
    });
    setShowPopup(true);
  };

  return (
      <div className="min-h-screen  p-0 md:p-4">
        <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
          {/*<h1 className="text-2xl sm:text-2.5xl md:text-3xl font-bold text-gray-900 text-center mb-4 sm:mb-6 md:mb-8">*/}
          {/*  Academy Management*/}
          {/*</h1>*/}

          {/* Navigation Buttons */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            <button
                onClick={() => toggleSection('plans')}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg shadow-sm transition-all duration-200 text-sm sm:text-base ${
                    showPlans
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-400'
                }`}
            >
              <ClipboardList className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
              {showPlans ? 'Hide Plans' : 'Show Plans'}
            </button>

            <button
                onClick={() => toggleSection('trainee')}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg shadow-sm transition-all duration-200 text-sm sm:text-base ${
                    showTrainee
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-400'
                }`}
            >
              <Users className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
              {showTrainee ? 'Hide Trainees' : 'Show Trainees'}
            </button>
          </div>

          {/* Plans Section */}
          {showPlans && (
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <div className="flex justify-end">
                  <button
                      onClick={openAddPopup}
                      className="flex items-center  gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  >
                    <Plus className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
                    Add New Plan
                  </button>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {plans.map((plan) => (
                      <div
                          key={plan._id}
                          className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3 sm:mb-4">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                            {plan.name}
                          </h3>
                          <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                        ${
                                  plan.active
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                              }`}
                          >
                      {plan.active ? 'Active' : 'Inactive'}
                    </span>
                        </div>

                        <div className="space-y-2 mb-4 sm:mb-6">
                          <p className="text-sm sm:text-base text-gray-600">
                            <span className="font-medium">Sport:</span> {plan.sport}
                          </p>
                          <p className="text-sm sm:text-base text-gray-600">
                            <span className="font-medium">Duration:</span>{' '}
                            {plan.plan_limit} days
                          </p>
                          <p className="text-xl sm:text-2xl font-bold text-blue-600">
                            ₹{plan.amount}
                          </p>
                        </div>

                        <div className="flex gap-2 sm:gap-3">
                          <button
                              onClick={() => togglePlanActive(plan._id)}
                              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base ${
                                  plan.active
                                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                              } transition-colors`}
                          >
                            {plan.active ? (
                                <XCircle className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
                            ) : (
                                <CheckCircle className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
                            )}
                            {plan.active ? 'Deactivate' : 'Activate'}
                          </button>

                          <button
                              onClick={() => openEditPopup(plan)}
                              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors text-sm sm:text-base"
                          >
                            <Edit className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
                            Edit
                          </button>
                        </div>
                      </div>
                  ))}
                </div>

                {/* Add/Edit Plan Modal */}
                {showPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center p-2 sm:p-3 md:p-4">
                      <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-2 p-3 sm:p-4 md:p-6">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                          {editingPlan ? 'Edit Plan' : 'Add New Plan'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Plan Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                                required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Amount (₹)
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                                required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Duration (Days)
                            </label>
                            <input
                                type="number"
                                name="plan_limit"
                                value={formData.plan_limit}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                                required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Sport
                            </label>
                            <select
                                name="sport"
                                value={formData.sport}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                                required
                            >
                              <option value="">Select Sport</option>
                              <option value="Cricket">Cricket</option>
                              <option value="Football">Football</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="active"
                                id="active"
                                checked={formData.active}
                                onChange={handleInputChange}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <label htmlFor="active" className="text-sm text-gray-700">
                              Active Plan
                            </label>
                          </div>

                          <div className="flex gap-3 sm:gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                  setShowPopup(false);
                                  setEditingPlan(null);
                                }}
                                className="flex-1 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
                            >
                              Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                            >
                              {editingPlan ? 'Update Plan' : 'Add Plan'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                )}
              </div>
          )}

          {/* Trainee Section */}
          {showTrainee && <TraineeManagement />}
        </div>
      </div>
  );
};

export default AcademyManagement;
