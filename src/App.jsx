import React, { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  eachDayOfInterval,
  parseISO,
  setYear,
  getYear,
  setMonth,
  getMonth,
} from "date-fns";

const App = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [events, setEvents] = useState([
    {
      title: "Daily Standup",
      date: "2025-12-18",
      startTime: "00:00",
      endTime: "01:30",
      color: "#f6be23",
    },
    {
      title: "Weekly catchup",
      date: "2025-12-18",
      startTime: "04:30",
      endTime: "07:30",
      color: "#f6501e",
    },
  ]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = getYear(new Date());
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const handleMonthChange = (e) => {
    const monthIndex = parseInt(e.target.value);
    setCurrentMonth(setMonth(currentMonth, monthIndex));
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    setCurrentMonth(setYear(currentMonth, newYear));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (Array.isArray(data)) setEvents(data);
      } catch (err) {
        alert("Invalid JSON format.");
      }
    };
    reader.readAsText(file);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">

        <header className="flex flex-col md:flex-row items-center justify-between p-8 border-b border-slate-100 gap-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <select
              value={getMonth(currentMonth)}
              onChange={handleMonthChange}
              className="bg-slate-100 border-none rounded-lg px-4 py-2 font-bold text-slate-700 cursor-pointer focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={getYear(currentMonth)}
              onChange={handleYearChange}
              className="bg-slate-100 border-none rounded-lg px-4 py-2 font-bold text-slate-700 cursor-pointer focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg active:scale-95 text-sm md:text-base">
              Upload JSON
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition px-5 font-black text-slate-600"
              >
                Prev
              </button>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition px-5 font-black text-slate-600"
              >
                Next
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => {
            const isToday = isSameDay(day, new Date()); //
            const isCurrMonth = isSameMonth(day, monthStart);
            const dayEvents = events.filter((e) =>
              isSameDay(parseISO(e.date), day)
            );

            return (
              <div
                key={idx}
                className={`min-h-[150px] border-r border-b border-slate-100 p-3 transition-all ${
                  !isCurrMonth
                    ? "bg-slate-50/50 text-slate-300"
                    : "bg-white hover:bg-slate-50/20"
                }`}
              >
                <div className="flex justify-start mb-3">
                  <span
                    className={`flex items-center justify-center w-9 h-9 text-sm font-black rounded-full transition-all ${
                      isToday
                        ? "bg-indigo-600 text-white shadow-lg ring-4 ring-indigo-50"
                        : "text-slate-700"
                    } ${!isCurrMonth ? "opacity-30" : ""}`}
                  >
                    {format(day, "d")}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {dayEvents.map((event, i) => {
                    const hasConflict =
                      dayEvents.filter((e) => e.startTime === event.startTime)
                        .length > 1;

                    return (
                      <div
                        key={i}
                        style={{ backgroundColor: event.color }} 
                        className={`p-2 rounded-lg text-[10px] text-white font-bold shadow-sm truncate border-l-4 border-black/20 transition-transform hover:scale-105 ${
                          hasConflict
                            ? "ring-2 ring-rose-500 animate-pulse"
                            : ""
                        }`}
                        title={`${event.title} (${event.startTime}) ${
                          hasConflict ? "⚠️ Time Conflict" : ""
                        }`}
                      >
                        {event.startTime} - {event.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
