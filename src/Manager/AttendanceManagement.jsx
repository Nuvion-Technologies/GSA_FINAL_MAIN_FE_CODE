import React, { useState, useEffect, useRef } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Download, FileSpreadsheet, File as FilePdf, Users, UserX } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';


const localizer = momentLocalizer(moment);

const AttendanceManagement = () => {
    const [rollno, setRollno] = useState("");
    const [attendanceMessage, setAttendanceMessage] = useState("");
    const [attendanceData, setAttendanceData] = useState([]);
    const [absentData, setAbsentData] = useState([]);
    const [filteredPresentData, setFilteredPresentData] = useState([]);
    const [filteredAbsentData, setFilteredAbsentData] = useState([]);
    const [date, setDate] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentAttendance, setStudentAttendance] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    // Add this with your other useState declarations at the top of the component
    const [monthAttendance, setMonthAttendance] = useState([]);
    const ip = import.meta.env.VITE_IP;
    const inputRef = useRef(null);

    const updateTraineeStudent = async () => {
        try {
            const response = await fetch(`${ip}/api/manager/update-trainee-student`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userid: localStorage.getItem("userid") }),
            });

            if (!response.ok) {
                console.error("Failed to update trainee-student information.");
            }
        } catch (error) {
            console.error("An error occurred while updating trainee-student information:", error);
        }
    };

    const fetchAttendanceData = async (selectedDate = date) => {
        try {
            const response = await fetch(`${ip}/api/manager/trainee-attendance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ date: selectedDate, userid: localStorage.getItem("userid") }),
            });

            const data = await response.json();
            if (response.ok) {
                setAttendanceData(data.presentStudents || []);
                setAbsentData(data.absentStudents || []);
                setFilteredPresentData(data.presentStudents || []);
                setFilteredAbsentData(data.absentStudents || []);
            } else {
                setAttendanceMessage(data.message || "Failed to fetch attendance data.");
            }
        } catch (error) {
            setAttendanceMessage("An error occurred while fetching attendance data.");
            console.error(error);
        }
    };

    // const fetchMonthAttendance = async (startDate, endDate) => {
    //     const dates = [];
    //     let currentDate = new Date(startDate);
    //     const end = new Date(endDate);

    //     // Generate array of dates for the month
    //     while (currentDate <= end) {
    //         dates.push(new Date(currentDate));
    //         currentDate.setDate(currentDate.getDate() + 1);
    //     }

    //     // Fetch attendance for each date
    //     const attendancePromises = dates.map(async (date) => {
    //         const formattedDate = date.toISOString().split('T')[0];
    //         const response = await fetch(`${ip}/api/manager/trainee-attendance`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 date: formattedDate,
    //                 userid: localStorage.getItem("userid")
    //             }),
    //         });
    //         const data = await response.json();
    //         return {
    //             date: formattedDate,
    //             presentStudents: data.presentStudents || [],
    //             absentStudents: data.absentStudents || []
    //         };
    //     });

    //     const monthData = await Promise.all(attendancePromises);
    //     setMonthAttendance(monthData);

    //     // Update calendar events for the selected student
    //     if (selectedStudent) {
    //         const events = monthData.map(day => {
    //             const isPresent = day.presentStudents.some(s => s.rollno === selectedStudent.rollno);
    //             return {
    //                 title: isPresent ? 'Present' : 'Absent',
    //                 start: new Date(day.date),
    //                 end: new Date(day.date),
    //                 allDay: true,
    //                 status: isPresent ? 'present' : 'absent'
    //             };
    //         });
    //         setCalendarEvents(events);
    //     }
    // };

    const fetchMonthAttendance = async (startDate, endDate) => {
        const dates = [];
        let currentDate = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        // today.setHours(0, 0, 0, 0); // Normalize today to midnight

        // Generate an array of dates for the month (including today, excluding future dates)
        while (currentDate <= end) {
            const normalizedDate = new Date(currentDate);

            if (normalizedDate <= today) { // Include today, exclude future dates
                dates.push(new Date(normalizedDate));
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Fetch attendance for each valid date
        const attendancePromises = dates.map(async (date) => {
            const formattedDate = date.toISOString().split('T')[0];
            const response = await fetch(`${ip}/api/manager/trainee-attendance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    date: formattedDate,
                    userid: localStorage.getItem("userid")
                }),
            });

            const data = await response.json();
            return {
                date: formattedDate,
                presentStudents: data.presentStudents || [],
                absentStudents: data.absentStudents || []
            };
        });

        const monthData = await Promise.all(attendancePromises);
        setMonthAttendance(monthData);

        // Update calendar events for the selected student
        if (selectedStudent) {
            const events = monthData
                .filter(day => {
                    const dayDate = new Date(day.date);
                    dayDate.setHours(0, 0, 0, 0); // Normalize to remove time
                    return dayDate <= today; // Ensure today is included
                })
                .map(day => {
                    const isPresent = day.presentStudents.some(s => s.rollno === selectedStudent.rollno);
                    return {
                        title: isPresent ? 'Present' : 'Absent',
                        start: new Date(day.date),
                        end: new Date(day.date),
                        allDay: true,
                        status: isPresent ? 'present' : 'absent'
                    };
                });

            setCalendarEvents(events);
        }
    };


    const updateCalendarEvents = (date, isPresent) => {
        setCalendarEvents(prev => {
            const existingEventIndex = prev.findIndex(
                event => event.start.toISOString().split('T')[0] === date
            );

            const newEvent = {
                title: isPresent ? 'Present' : 'Absent',
                start: new Date(date),
                end: new Date(date),
                allDay: true,
                status: isPresent ? 'present' : 'absent'
            };

            if (existingEventIndex >= 0) {
                const updatedEvents = [...prev];
                updatedEvents[existingEventIndex] = newEvent;
                return updatedEvents;
            }

            return [...prev, newEvent];
        });
    };

    const handleCalendarRangeChange = (range) => {
        const startDate = moment(range.start).startOf('month').format('YYYY-MM-DD');
        const endDate = moment(range.end).endOf('month').format('YYYY-MM-DD');
        fetchMonthAttendance(startDate, endDate);
    };

    const exportToExcel = () => {
        if (!selectedStudent || !monthAttendance.length) return;

        const exportData = monthAttendance.map(day => {
            const isPresent = day.presentStudents.some(s => s.rollno === selectedStudent.rollno);
            return {
                Date: moment(day.date).format('DD-MM-YYYY'),
                Status: isPresent ? 'Present' : 'Absent'
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
        XLSX.writeFile(workbook, `${selectedStudent.name}_attendance.xlsx`);
    };

    const exportToPDF = () => {
        if (!selectedStudent || !monthAttendance.length) return;

        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text(`Attendance Report - ${selectedStudent.name}`, 14, 15);

        doc.setFontSize(10);
        doc.text(`Roll Number: ${selectedStudent.rollno}`, 14, 25);
        doc.text(`Generated on: ${moment().format('DD-MM-YYYY HH:mm')}`, 14, 30);

        const tableData = monthAttendance.map(day => {
            const isPresent = day.presentStudents.some(s => s.rollno === selectedStudent.rollno);
            return [
                moment(day.date).format('DD-MM-YYYY'),
                isPresent ? 'Present' : 'Absent'
            ];
        });

        doc.autoTable({
            startY: 35,
            head: [['Date', 'Status']],
            body: tableData,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            alternateRowStyles: { fillColor: [245, 245, 245] }
        });

        doc.save(`${selectedStudent.name}_attendance.pdf`);
    };

    const eventStyleGetter = (event) => {
        const style = {
            backgroundColor: event.status === 'present' ? '#10B981' : '#EF4444',
            borderRadius: '4px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
        };
        return { style };
    };

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setDate(today);
        updateTraineeStudent();
        fetchAttendanceData(today);
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (selectedStudent) {
            const startDate = moment().startOf('month').format('YYYY-MM-DD');
            const endDate = moment().endOf('month').format('YYYY-MM-DD');
            fetchMonthAttendance(startDate, endDate);
        }
    }, [selectedStudent]);

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            markAttendance();
        }
    };

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setDate(today);
        updateTraineeStudent();
        fetchAttendanceData(today);
        inputRef.current?.focus();
    }, []);

    const markAttendance = async () => {
        try {
            const response = await fetch(`${ip}/api/manager/take-attendance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rollno, userid: localStorage.getItem("userid") }),
            });

            const data = await response.json();
            if (response.ok) {
                setAttendanceMessage(data.message);
                fetchAttendanceData(date);
            } else {
                setAttendanceMessage(data.message || "Failed to mark attendance.");
            }
            setRollno("");
            inputRef.current?.focus();
        } catch (error) {
            setAttendanceMessage("An error occurred while marking attendance.");
            console.error(error);
        }
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, [rollno]);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        setFilteredPresentData(
            attendanceData.filter(
                (student) =>
                    student.name.toLowerCase().includes(query) || student.rollno.toLowerCase().includes(query)
            )
        );
        setFilteredAbsentData(
            absentData.filter(
                (student) =>
                    student.name.toLowerCase().includes(query) || student.rollno.toLowerCase().includes(query)
            )
        );
    }, [searchQuery, attendanceData, absentData]);

    return (
        <div className="bg-transparent transition-all">
            <div className="p-6 space-y-8">
                {/* Mark Attendance Section */}
                <section className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-800">Mark Attendance</h4>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            className="flex h-10 w-full md:w-1/2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter Roll Number"
                            value={rollno}
                            ref={inputRef}
                            onChange={(e) => setRollno(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
                            onClick={markAttendance}
                        >
                            Submit
                        </button>
                    </div>
                    {attendanceMessage && (
                        <p className="text-green-600 font-medium animate-fade-in">
                            {attendanceMessage}
                        </p>
                    )}
                </section>

                {/* Student Selection and Calendar Section */}
                <section className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-800">Student Attendance Calendar</h4>
                    <div className="flex flex-wrap items-center gap-4">
                        <select
                            className="flex h-10 w-full md:w-64 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            onChange={(e) => {
                                const student = [...attendanceData, ...absentData].find(s => s.rollno === e.target.value);
                                setSelectedStudent(student);
                            }}
                            value={selectedStudent?.rollno || ''}
                        >
                            <option value="">Select Student</option>
                            {[...attendanceData, ...absentData]
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map(student => (
                                    <option key={student.rollno} value={student.rollno}>
                                        {student.name} ({student.rollno})
                                    </option>
                                ))}
                        </select>

                        {selectedStudent && (
                            <div className="flex gap-3 animate-fade-in">
                                <button
                                    onClick={exportToExcel}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2 gap-2"
                                >
                                    <FileSpreadsheet size={18} />
                                    Export Excel
                                </button>
                                <button
                                    onClick={exportToPDF}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-700 h-10 px-4 py-2 gap-2"
                                >
                                    <FilePdf size={18} />
                                    Export PDF
                                </button>
                            </div>
                        )}
                    </div>

                    {selectedStudent && (
                        <div
                            className="rounded-xl border border-gray-200/60 bg-white p-6 shadow-sm transition-all hover:shadow-md animate-fade-in">
                            <div className="mb-4">
                                <h5 className="text-lg font-semibold text-gray-800">
                                    {selectedStudent.name}'s Attendance Calendar
                                </h5>
                                <p className="text-sm text-gray-600">
                                    Roll Number: {selectedStudent.rollno}
                                </p>
                            </div>
                            <Calendar
                                localizer={localizer}
                                events={calendarEvents}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: 500 }}
                                eventPropGetter={eventStyleGetter}
                                views={['month']}
                                defaultView="month"
                                toolbar={true}
                                popup
                                onRangeChange={handleCalendarRangeChange}
                                className="rounded-lg border border-gray-200/60 shadow-sm"
                            />
                        </div>
                    )}
                </section>

                {/* Attendance Records Section */}
                <section className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-800">Attendance Records</h4>
                    <div className="flex flex-wrap items-center gap-4">
                        <input
                            type="date"
                            className="flex h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={date}
                            onChange={(e) => {
                                setDate(e.target.value);
                                fetchAttendanceData(e.target.value);
                            }}
                        />
                        <input
                            type="text"
                            className="flex h-10 w-full md:w-auto rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Search by name or roll number"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                        {/* Present Students */}
                        <div
                            className="rounded-xl border border-green-200/60 bg-green-50/50 p-6 transition-all hover:shadow-md">
                            <h5 className="font-semibold text-green-800 text-lg mb-4 flex items-center gap-2">
                                <Users size={20} />
                                Present Students ({filteredPresentData.length})
                            </h5>
                            {filteredPresentData.length > 0 ? (
                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                    {filteredPresentData.map((student, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-4 bg-white rounded-lg p-4 border border-green-200/60 shadow-sm transition-all hover:shadow-md animate-fade-in"
                                            style={{
                                                animationDelay: `${index * 50}ms`
                                            }}
                                        >
                                            <div className="flex-grow">
                                                <p className="font-medium text-gray-900">{student.name}</p>
                                                <p className="text-sm text-gray-600">Roll No: {student.rollno}</p>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Expiry: <span className="font-medium">{student.expiringDate}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic text-center py-4">No present students found.</p>
                            )}
                        </div>

                        {/* Absent Students */}
                        <div
                            className="rounded-xl border border-red-200/60 bg-red-50/50 p-6 transition-all hover:shadow-md">
                            <h5 className="font-semibold text-red-800 text-lg mb-4 flex items-center gap-2">
                                <UserX size={20} />
                                Absent Students ({filteredAbsentData.length})
                            </h5>
                            {filteredAbsentData.length > 0 ? (
                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                    {filteredAbsentData.map((student, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-4 bg-white rounded-lg p-4 border border-red-200/60 shadow-sm transition-all hover:shadow-md animate-fade-in"
                                            style={{
                                                animationDelay: `${index * 50}ms`
                                            }}
                                        >
                                            <div className="flex-grow">
                                                <p className="font-medium text-gray-900">{student.name}</p>
                                                <p className="text-sm text-gray-600">Roll No: {student.rollno}</p>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Expiry: <span className="font-medium">{student.expiringDate}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic text-center py-4">No absent students found.</p>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AttendanceManagement;
