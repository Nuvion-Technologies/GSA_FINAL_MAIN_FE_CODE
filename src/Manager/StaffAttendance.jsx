import React, { useState, useEffect, useRef } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Download, FileSpreadsheet, File as FilePdf, Users, UserCheck, UserX, Clock, Search } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'jspdf-autotable';

const localizer = momentLocalizer(moment);

const StaffAttendance = () => {
    const [selectedCoach, setSelectedCoach] = useState('');
    const [allStaff, setAllStaff] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [monthAttendance, setMonthAttendance] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
    const [todaysPresentStaff, setTodaysPresentStaff] = useState([]);
    const [todaysAbsentStaff, setTodaysAbsentStaff] = useState([]);
    const [rollno, setRollno] = useState('');
    const [attendanceMessage, setAttendanceMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPresentStaff, setFilteredPresentStaff] = useState([]);
    const [filteredAbsentStaff, setFilteredAbsentStaff] = useState([]);
    const ip = import.meta.env.VITE_IP;
    const inputRef = useRef(null);

    useEffect(() => {
        fetchTodaysAttendance();
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (selectedCoach) {
            const startDate = moment(selectedDate).startOf('month').format('YYYY-MM-DD');
            const endDate = moment(selectedDate).endOf('month').format('YYYY-MM-DD');
            fetchMonthAttendance(startDate, endDate);
        }
    }, [selectedDate, selectedCoach]);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        setFilteredPresentStaff(
            todaysPresentStaff.filter(staff =>
                staff.name.toLowerCase().includes(query) ||
                staff.rollno.toLowerCase().includes(query)
            )
        );
        setFilteredAbsentStaff(
            todaysAbsentStaff.filter(staff =>
                staff.name.toLowerCase().includes(query) ||
                staff.rollno.toLowerCase().includes(query)
            )
        );
    }, [searchQuery, todaysPresentStaff, todaysAbsentStaff]);

    const fetchTodaysAttendance = async () => {
        try {
            const response = await fetch(`${ip}/api/manager/staff-attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: moment().format('YYYY-MM-DD'),
                    userid: localStorage.getItem('userid')
                }),
            });

            const data = await response.json();
            if (response.ok) {
                const presentStaffData = processAttendanceData(data.presentStudents || []);
                setTodaysPresentStaff(presentStaffData);
                setFilteredPresentStaff(presentStaffData);
                setTodaysAbsentStaff(data.absentStudents || []);
                setFilteredAbsentStaff(data.absentStudents || []);

                // Get unique staff list
                const allUniqueStaff = [
                    ...new Set([
                        ...data.presentStudents.map(staff => staff.name),
                        ...data.absentStudents.map(staff => staff.name)
                    ])
                ];
                setAllStaff(allUniqueStaff);
            }
        } catch (error) {
            console.error('Error fetching today\'s attendance:', error);
        }
    };

    const fetchMonthAttendance = async (startDate, endDate) => {
        try {
            const dates = [];
            let currentDate = new Date(startDate);
            const end = new Date(endDate);

            while (currentDate <= end) {
                dates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }

            const monthData = await Promise.all(
                dates.map(async (date) => {
                    const formattedDate = date.toISOString().split('T')[0];
                    const response = await fetch(`${ip}/api/manager/staff-attendance`, {
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
                })
            );

            setMonthAttendance(monthData);

            if (selectedCoach) {
                const events = [];
                monthData.forEach(dayData => {
                    const staffSessions = dayData.presentStudents.filter(s => s.name === selectedCoach);
                    staffSessions.forEach(session => {
                        events.push({
                            title: `${session.in_out}`,
                            start: new Date(dayData.date),
                            end: new Date(dayData.date),
                            status: session.in_out,
                            allDay: true
                        });
                    });
                });
                setCalendarEvents(events);
            }
        } catch (error) {
            console.error('Error fetching month attendance:', error);
        }
    };

    const processAttendanceData = (presentStudents) => {
        const staffSessions = presentStudents.reduce((acc, curr) => {
            if (!acc[curr.name]) {
                acc[curr.name] = [];
            }
            acc[curr.name].push({
                ...curr,
                time: moment(curr.time).format('HH:mm:ss')
            });
            return acc;
        }, {});

        return Object.entries(staffSessions).map(([name, sessions]) => ({
            name,
            rollno: sessions[0].rollno,
            sessions: sessions.sort((a, b) => moment(a.time, 'HH:mm:ss').diff(moment(b.time, 'HH:mm:ss')))
        }));
    };

    const handleCoachSelect = (coach) => {
        setSelectedCoach(coach);
        if (coach) {
            const startDate = moment(selectedDate).startOf('month').format('YYYY-MM-DD');
            const endDate = moment(selectedDate).endOf('month').format('YYYY-MM-DD');
            fetchMonthAttendance(startDate, endDate);
        } else {
            setCalendarEvents([]);
        }
    };

    const markAttendance = async () => {
        try {
            const response = await fetch(`${ip}/api/manager/take-attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rollno, userid: localStorage.getItem('userid') }),
            });

            const data = await response.json();
            if (response.ok) {
                setAttendanceMessage(data.message);
                fetchTodaysAttendance();
                if (selectedCoach) {
                    const startDate = moment(selectedDate).startOf('month').format('YYYY-MM-DD');
                    const endDate = moment(selectedDate).endOf('month').format('YYYY-MM-DD');
                    fetchMonthAttendance(startDate, endDate);
                }
            } else {
                setAttendanceMessage(data.message || 'Failed to mark attendance.');
            }
            setRollno('');
            inputRef.current?.focus();
        } catch (error) {
            setAttendanceMessage('An error occurred while marking attendance.');
            console.error(error);
        }
    };

    const exportToExcel = () => {
        if (!selectedCoach) {
            alert('Please select a coach first');
            return;
        }

        const flattenedData = monthAttendance.flatMap(day =>
            day.presentStudents
                .filter(staff => staff.name === selectedCoach)
                .map(staff => ({
                    Date: day.date,
                    Name: staff.name,
                    ID: staff.rollno,
                    Status: staff.in_out,
                    Time: moment(staff.time).format('HH:mm:ss')
                }))
        );

        const worksheet = XLSX.utils.json_to_sheet(flattenedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Coach Attendance');
        XLSX.writeFile(workbook, `${selectedCoach}_attendance_${selectedDate}.xlsx`);
    };

    const exportToPDF = () => {
        if (!selectedCoach) {
            alert('Please select a coach first');
            return;
        }

        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.text('Gandhinagar Sports Academy', 105, 20, { align: 'center' });

        // Subtitle
        doc.setFontSize(12);
        doc.text(`Attendance Report for Coach: ${selectedCoach}`, 105, 30, { align: 'center' });
        doc.text(`Generated on: ${moment().format('DD-MM-YYYY HH:mm')}`, 105, 36, { align: 'center' });

        // Table headers
        const tableColumn = ['Date', 'Name', 'Roll No', 'In/Out', 'Time'];

        // Table rows
        const tableRows = monthAttendance.flatMap(day =>
            day.presentStudents
                .filter(staff => staff.name === selectedCoach)
                .map(staff => [
                    moment(day.date).format('DD-MM-YYYY'),
                    staff.name,
                    staff.rollno,
                    staff.in_out,
                    moment(staff.time).format('HH:mm:ss')
                ])
        );

        // Add table
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 45,
            styles: {
                fontSize: 10,
                cellPadding: 4,
                valign: 'middle',
            },
            headStyles: {
                fillColor: [0, 102, 204],
                textColor: 255,
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]
            },
            theme: 'striped',
        });

        // Save the PDF
        doc.save(`Attendance_${selectedCoach}_${moment().format('YYYYMMDD')}.pdf`);
    };


    const eventStyleGetter = (event) => ({
        style: {
            backgroundColor: event.status === 'IN' ? '#4CAF50' : '#F44336',
            color: '#fff',
            borderRadius: '4px',
            border: 'none',
            display: 'block'
        }
    });

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && rollno) {
            markAttendance();
        }
    };

    return (
        <div className="p-0 md:p-6">
            <div className="mb-6 flex justify-between items-center">
                {/*<h1 className="text-2xl font-bold">Staff Attendance</h1>*/}
                <div className="flex gap-4">
                    <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        <FileSpreadsheet size={20} />
                        Export Excel
                    </button>
                    <button
                        onClick={exportToPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        <FilePdf size={20} />
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="mb-6 bg-white rounded-lg shadow p-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="flex-1">
                        <label htmlFor="rollno" className="block text-sm font-medium text-gray-700 mb-2">
                            Staff ID
                        </label>
                        <input
                            type="text"
                            id="rollno"
                            ref={inputRef}
                            value={rollno}
                            onChange={(e) => setRollno(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter Staff ID"
                        />
                    </div>
                    <button
                        onClick={markAttendance}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Mark Attendance
                    </button>
                </div>
                {attendanceMessage && (
                    <div className={`mt-2 p-2 rounded ${
                        attendanceMessage.includes('successfully') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                        {attendanceMessage}
                    </div>
                )}
            </div>

            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 pl-10 border border-gray-300 rounded-md"
                        placeholder="Search by name or ID..."
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <UserCheck className="text-green-500" size={24} />
                        <h2 className="text-xl font-semibold">Present Today</h2>
                    </div>
                    <div className="overflow-y-auto max-h-64">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPresentStaff.map((staff, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">{staff.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{staff.rollno}</td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-2">
                                            {staff.sessions.map((session, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <Clock size={16} className="text-gray-400" />
                                                    <span className={`px-2 py-1 rounded text-white ${
                                                        session.in_out === 'IN' ? 'bg-green-500' : 'bg-red-500'
                                                    }`}>
                                                            {session.in_out} - {session.time}
                                                        </span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <UserX className="text-red-500" size={24} />
                        <h2 className="text-xl font-semibold">Absent Today</h2>
                    </div>
                    <div className="overflow-y-auto max-h-64">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAbsentStaff.map((staff, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">{staff.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{staff.rollno}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Staff Member
                </label>
                <select
                    value={selectedCoach}
                    onChange={(e) => handleCoachSelect(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                >
                    <option value="">Select a staff member</option>
                    {allStaff.map((staff, index) => (
                        <option key={index} value={staff}>
                            {staff}
                        </option>
                    ))}
                </select>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 600 }}
                    eventPropGetter={eventStyleGetter}
                    views={['month', 'week', 'day']}
                    defaultView="month"
                    onNavigate={(date) => setSelectedDate(moment(date).format('YYYY-MM-DD'))}
                />
            </div>

            {selectedCoach && monthAttendance.length > 0 && (
                <div className="mt-6 bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Session Details for {selectedCoach}</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {monthAttendance.map((day, index) => {
                                const staffSessions = day.presentStudents.filter(s => s.name === selectedCoach);
                                return staffSessions.map((session, sessionIndex) => (
                                    <tr key={`${index}-${sessionIndex}`}>

                                        <td className="px-6 py-4 whitespace-nowrap">{day.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded text-white ${
                                                    session.in_out === 'IN' ? 'bg-green-500' : 'bg-red-500'
                                                }`}>
                                                    {session.in_out}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {moment(session.time).format('HH:mm:ss')}
                                        </td>
                                    </tr>
                                ));
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffAttendance;
