import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DatePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}

const DatePicker = React.memo(({ startDate, endDate, onChange }: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectingStart, setSelectingStart] = useState(true);
  const pickerRef = useRef<HTMLDivElement>(null);

  const availableDates = [
    '2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25',
    '2026-09-26', '2026-09-27', '2026-09-28', '2026-09-29', '2026-09-30'
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}.${month}`;
  };

  const handleDateClick = (date: string) => {
    if (selectingStart) {
      onChange(date, endDate);
      setSelectingStart(false);
    } else {
      if (date >= startDate) {
        onChange(startDate, date);
      } else {
        onChange(date, startDate);
      }
      setSelectingStart(true);
      setIsOpen(false);
    }
  };

  const isAvailable = (date: string) => availableDates.includes(date);
  const isInRange = (date: string) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };
  const isStart = (date: string) => date === startDate;
  const isEnd = (date: string) => date === endDate;

  const septemberDays = () => {
    const days = [];
    const firstDayOfWeek = 2;
    const daysInMonth = 30;
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const displayValue = startDate && endDate
    ? `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`
    : startDate
    ? formatDisplayDate(startDate)
    : 'Выберите период';

  return (
    <div className="flex flex-col relative" ref={pickerRef}>
      <label className="text-base font-semibold text-black mb-1">Дата кормления</label>
      <div
        className="flex items-center gap-2 px-3 min-w-[200px] cursor-pointer hover:opacity-80 transition-opacity rounded-lg"
        style={{ height: '44px', backgroundColor: '#F6F6F8' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-base font-semibold text-black">{displayValue}</span>
        <Calendar className="w-4 h-4 text-black ml-auto" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl p-4 w-[280px]" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 100 }}>
          <div className="flex items-center justify-between mb-3">
            <button className="p-1 rounded hover:bg-gray-100 opacity-30 cursor-not-allowed" disabled>
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
            <span className="text-sm font-semibold text-gray-900">Сентябрь 2026</span>
            <button className="p-1 rounded hover:bg-gray-100 opacity-30 cursor-not-allowed" disabled>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="text-xs text-gray-500 mb-3 text-center">
            {selectingStart ? 'Выберите дату начала' : 'Выберите дату окончания'}
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {dayNames.map((name) => (
              <div key={name} className="text-center text-xs font-medium text-gray-400 py-1">
                {name}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {septemberDays().map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="h-8"></div>;
              }
              const dateStr = `2026-09-${day.toString().padStart(2, '0')}`;
              const available = isAvailable(dateStr);
              const inRange = isInRange(dateStr);
              const start = isStart(dateStr);
              const end = isEnd(dateStr);
              return (
                <button
                  key={dateStr}
                  onClick={() => available && handleDateClick(dateStr)}
                  disabled={!available}
                  className={`h-8 rounded-lg text-sm font-medium transition-colors ${
                    start || end
                      ? 'bg-purple-600 text-white'
                      : inRange
                      ? 'bg-purple-100 text-purple-700'
                      : available
                      ? 'hover:bg-purple-50 text-gray-700 cursor-pointer'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
