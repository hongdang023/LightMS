import React, { useState } from 'react';
import { useCommunity } from '../../context/CommunityContext';
import { EVENT_TYPE_CONFIG } from '../../types/database';
import { PageHeader } from '../../components/PageHeader';
import {
  ChevronLeft, ChevronRight, Plus, Edit3,
  ChevronsRight, Clock, CalendarDays, List, Calendar, Bell
} from 'lucide-react';
import type { CalendarEvent, EventType } from '../../types/database';

// ─── Helpers ────────────────────────────────────────────────────────────────

const DAYS_VN = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTHS_VN = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                   'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];

// Get color hex from eventType (fallback for colorClass-based events)
// Commented out as it is currently unused and causing TS compile errors
/*
function getEventColor(event: CalendarEvent): string {
  if (event.eventType && EVENT_TYPE_CONFIG[event.eventType]) {
    return EVENT_TYPE_CONFIG[event.eventType].color;
  }
  // Legacy fallback
  if (event.colorClass.includes('blue')) return '#2563EB';
  if (event.colorClass.includes('purple') || event.colorClass.includes('violet')) return '#7C3AED';
  if (event.colorClass.includes('green')) return '#16A34A';
  return '#EA580C';
}
*/

function getEventBg(event: CalendarEvent): string {
  if (event.eventType && EVENT_TYPE_CONFIG[event.eventType]) {
    return EVENT_TYPE_CONFIG[event.eventType].color;
  }
  return '#EA580C';
}

// Returns all dates (as YYYY-MM-DD strings) on which a CalendarEvent occurs
function getEventDates(event: CalendarEvent, year: number, month: number): number[] {
  const dates: number[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  if (event.date !== undefined && event.month === month && event.year === year) {
    dates.push(event.date);
    return dates;
  }

  if (event.dayOfWeek !== undefined) {
    // dayOfWeek: 1=Mon...7=Sun; JS getDay: 0=Sun...6=Sat
    const jsTarget = event.dayOfWeek === 7 ? 0 : event.dayOfWeek;
    for (let d = 1; d <= daysInMonth; d++) {
      const js = new Date(year, month, d).getDay();
      if (js === jsTarget) {
        const ts = new Date(year, month, d).getTime();
        const inRange =
          (!event.startRecur || ts >= event.startRecur) &&
          (!event.endRecur || ts <= event.endRecur);
        if (inRange) dates.push(d);
      }
    }
  }
  return dates;
}
import { EventModal } from '../../components/admin/calendar/EventModal';

// ─── Calendar View ───────────────────────────────────────────────────────────

interface CalendarViewProps {
  year: number;
  month: number;
  events: CalendarEvent[];
  onDayClick: (dateStr: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ year, month, events, onDayClick, onEventClick }) => {
  const today = new Date();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  // Build grid: 6 weeks × 7 days
  const cells: { day: number; currentMonth: boolean }[] = [];
  // Prefix from previous month (start week on Monday)
  const startOffset = (firstDay + 6) % 7; // Mon-based
  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, currentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, currentMonth: true });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.length - daysInMonth - startOffset + 1, currentMonth: false });
  }

  // Map events to days
  const eventsByDay: Record<number, CalendarEvent[]> = {};
  events.forEach(ev => {
    const dates = getEventDates(ev, year, month);
    dates.forEach(d => {
      if (!eventsByDay[d]) eventsByDay[d] = [];
      eventsByDay[d].push(ev);
    });
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {['T2','T3','T4','T5','T6','T7','CN'].map(d => (
          <div key={d} className="py-3 text-center text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {cells.map((cell, idx) => {
          const isToday = cell.currentMonth &&
            cell.day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          const dayEvents = cell.currentMonth ? (eventsByDay[cell.day] || []) : [];
          const m = String(month + 1).padStart(2, '0');
          const d = String(cell.day).padStart(2, '0');
          const dateStr = `${year}-${m}-${d}`;

          return (
            <div
              key={idx}
              onClick={() => cell.currentMonth && onDayClick(dateStr)}
              className={`min-h-[100px] p-2 border-b border-r border-gray-100 transition-colors group ${
                cell.currentMonth
                  ? 'cursor-pointer hover:bg-blue-50/40'
                  : 'bg-gray-50/50 cursor-default'
              } ${idx % 7 === 6 ? 'border-r-0' : ''}`}
            >
              {/* Date number */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    isToday
                      ? 'bg-blue-600 text-white'
                      : cell.currentMonth
                      ? 'text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-700'
                      : 'text-gray-300'
                  }`}
                >
                  {cell.day}
                </span>
                {cell.currentMonth && (
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus size={12} className="text-blue-400" />
                  </span>
                )}
              </div>

              {/* Events */}
              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map((ev, i) => (
                  <div
                    key={ev.id + i}
                    onClick={e => { e.stopPropagation(); onEventClick(ev); }}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded text-white text-[10px] font-semibold truncate cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: getEventBg(ev) }}
                  >
                    {ev.allDay ? (
                      <span className="truncate">{ev.title}</span>
                    ) : (
                      <>
                        <span className="shrink-0">{ev.time}</span>
                        <span className="truncate">{ev.title}</span>
                      </>
                    )}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[10px] text-gray-400 font-semibold pl-1">+{dayEvents.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── List View ───────────────────────────────────────────────────────────────

interface ListViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  currentYear: number;
  currentMonth: number;
}

const ListView: React.FC<ListViewProps> = ({ events, onEventClick, currentYear, currentMonth }) => {
  // Show events for current month + expand to recurring ones
  const expanded: { event: CalendarEvent; date: Date; dateNum: number }[] = [];
  events.forEach(ev => {
    const dates = getEventDates(ev, currentYear, currentMonth);
    dates.forEach(d => {
      expanded.push({ event: ev, date: new Date(currentYear, currentMonth, d), dateNum: d });
    });
  });

  expanded.sort((a, b) => a.date.getTime() - b.date.getTime());

  if (expanded.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
        <CalendarDays size={36} className="text-gray-200 mx-auto mb-3" />
        <p className="text-gray-400 text-sm font-semibold">Không có sự kiện trong tháng này</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
      {expanded.map(({ event, date, dateNum }, idx) => {
        const cfg = event.eventType ? EVENT_TYPE_CONFIG[event.eventType] : null;
        const color = getEventBg(event);
        const weekDay = DAYS_VN[date.getDay()];
        return (
          <div
            key={event.id + idx}
            onClick={() => onEventClick(event)}
            className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors group"
          >
            {/* Date column */}
            <div className="w-14 shrink-0 text-center">
              <div className="text-[10px] font-bold text-gray-400 uppercase">{weekDay}</div>
              <div className="text-lg font-extrabold text-gray-800 leading-none">{dateNum}</div>
            </div>

            {/* Color bar */}
            <div className="w-1 h-10 rounded-full shrink-0" style={{ backgroundColor: color }} />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-gray-800 truncate">{event.title}</span>
                {cfg && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {cfg.label}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-400 font-semibold mt-0.5">
                {event.allDay
                  ? 'Cả ngày'
                  : `${event.time}${event.endTime ? ` – ${event.endTime}` : ''}`}
                {event.dayOfWeek !== undefined && (
                  <span className="ml-2 text-blue-400">↻ Hàng tuần</span>
                )}
              </div>
              {event.details && (
                <div className="text-[11px] text-gray-400 mt-0.5 truncate">{event.details.split('\n')[0]}</div>
              )}
            </div>

            <Edit3 size={14} className="text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
          </div>
        );
      })}
    </div>
  );
};

// ─── Legend ──────────────────────────────────────────────────────────────────

const EventLegend: React.FC = () => (
  <div className="flex flex-wrap gap-x-4 gap-y-2">
    {(Object.entries(EVENT_TYPE_CONFIG) as [EventType, typeof EVENT_TYPE_CONFIG[EventType]][]).map(([key, val]) => (
      <div key={key} className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: val.color }} />
        <span className="text-xs font-semibold text-gray-500">{val.label}</span>
      </div>
    ))}
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export const CalendarManagement: React.FC = () => {
  const { calendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent, shiftCalendarEvents } = useCommunity();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [modalInitialDate, setModalInitialDate] = useState<string | undefined>(undefined);

  // Bulk shift
  const [shiftStartDate, setShiftStartDate] = useState('2026-07-01');
  const [shiftDays, setShiftDays] = useState(7);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };
  const goToToday = () => { setViewMonth(today.getMonth()); setViewYear(today.getFullYear()); };

  const openAddModal = (dateStr?: string) => {
    setEditingEvent(null);
    setModalInitialDate(dateStr);
    setModalOpen(true);
  };

  const openEditModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setModalInitialDate(undefined);
    setModalOpen(true);
  };

  const handleSave = (data: Omit<CalendarEvent, 'id'>) => {
    if (editingEvent) {
      updateCalendarEvent(editingEvent.id, data);
    } else {
      addCalendarEvent(data);
    }
  };

  const handleBulkShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shiftStartDate) return;
    if (window.confirm(`⚠️ Dời tất cả lịch từ ngày ${shiftStartDate} tiến thêm ${shiftDays} ngày?`)) {
      shiftCalendarEvents(shiftStartDate, shiftDays);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in select-none">
      <PageHeader
        title="Lịch Học"
        description="Quản lý lịch học, sự kiện lớp học. Hỗ trợ dời lịch hàng loạt."
        helpTitle="Lịch Học"
        helpSummary="Xem và quản lý lịch học theo tháng hoặc danh sách."
        helpPurpose="Giúp admin thêm, sửa, xóa sự kiện học và dời lịch hàng loạt khi có thay đổi."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Main Calendar Area ── */}
        <div className="lg:col-span-9 space-y-4">

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              {/* Prev/Today/Next */}
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors text-xs font-bold text-gray-600"
              >
                Hôm nay
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600"
              >
                <ChevronRight size={16} />
              </button>
              <h2 className="text-lg font-extrabold text-[#15333B] ml-1">
                {MONTHS_VN[viewMonth]} {viewYear}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-colors ${
                    viewMode === 'calendar' ? 'bg-[#214C54] text-white' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Calendar size={13} />
                  Lịch
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-colors border-l border-gray-200 ${
                    viewMode === 'list' ? 'bg-[#214C54] text-white' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <List size={13} />
                  Danh sách
                </button>
              </div>

              {/* Add button */}
              <button
                onClick={() => openAddModal()}
                className="flex items-center gap-2 px-4 py-2 bg-[#214C54] hover:bg-[#15333B] text-white text-xs font-extrabold rounded-xl shadow-sm transition-all hover:-translate-y-0.5"
              >
                <Plus size={15} />
                Thêm sự kiện
              </button>
            </div>
          </div>

          {/* Legend */}
          <EventLegend />

          {/* Calendar / List */}
          {viewMode === 'calendar' ? (
            <CalendarView
              year={viewYear}
              month={viewMonth}
              events={calendarEvents}
              onDayClick={openAddModal}
              onEventClick={openEditModal}
            />
          ) : (
            <ListView
              events={calendarEvents}
              onEventClick={openEditModal}
              currentYear={viewYear}
              currentMonth={viewMonth}
            />
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="lg:col-span-3 space-y-4">

          {/* Mini event summary */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
            <h3 className="text-xs font-extrabold text-[#15333B] uppercase tracking-wider flex items-center gap-1.5">
              <Bell size={13} className="text-[#214C54]" />
              Sự kiện tháng này
            </h3>
            {(Object.entries(EVENT_TYPE_CONFIG) as [EventType, typeof EVENT_TYPE_CONFIG[EventType]][]).map(([key, val]) => {
              const count = calendarEvents.filter(ev => {
                if (ev.eventType !== key) return false;
                const dates = getEventDates(ev, viewYear, viewMonth);
                return dates.length > 0;
              }).length;
              if (count === 0) return null;
              return (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: val.color }} />
                    <span className="text-xs font-semibold text-gray-600">{val.label}</span>
                  </div>
                  <span
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: val.color }}
                  >
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bulk Shift */}
          <div className="bg-amber-50/40 rounded-2xl border border-amber-200 shadow-sm p-4 space-y-4">
            <h3 className="font-extrabold text-sm text-[#15333B] flex items-center gap-2 border-b border-amber-100 pb-3">
              <ChevronsRight className="w-4 h-4 text-[#EAB308]" />
              Dời Lịch Hàng Loạt
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-semibold">
              Tự động tịnh tiến tất cả sự kiện từ ngày chọn trở về sau.
            </p>
            <form onSubmit={handleBulkShift} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#15333B] uppercase tracking-wider block">Ngày bắt đầu dời</label>
                <input
                  type="date"
                  value={shiftStartDate}
                  onChange={e => setShiftStartDate(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 text-[#15333B]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#15333B] uppercase tracking-wider block">Số ngày dời</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={shiftDays}
                    onChange={e => setShiftDays(Number(e.target.value))}
                    required
                    className="w-20 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 text-[#15333B]"
                  />
                  <span className="text-[10px] font-bold text-gray-500">ngày (7 = 1 tuần)</span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#EAB308] hover:bg-[#CA8A04] text-white text-xs font-extrabold py-2.5 rounded-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Clock size={13} />
                Kích hoạt Dời lịch
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={modalOpen}
        editingEvent={editingEvent}
        initialDate={modalInitialDate}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={deleteCalendarEvent}
      />
    </div>
  );
};
