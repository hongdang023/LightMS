import React, { useState, useEffect } from 'react';
import { X, Trash2, Tag, CalendarDays, Repeat, AlignLeft } from 'lucide-react';
import { EVENT_TYPE_CONFIG } from '../../../types/database';
import type { CalendarEvent, EventType } from '../../../types/database';

const DEFAULT_FORM = {
  title: '',
  eventType: 'live-class' as EventType,
  startDate: '',
  startTime: '20:00',
  endTime: '22:00',
  allDay: false,
  recurrence: 'none' as 'none' | 'weekly',
  details: '',
};

interface EventModalProps {
  isOpen: boolean;
  editingEvent: CalendarEvent | null;
  initialDate?: string; // YYYY-MM-DD
  onClose: () => void;
  onSave: (data: Omit<CalendarEvent, 'id'>) => void;
  onDelete?: (id: string) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  editingEvent,
  initialDate,
  onClose,
  onSave,
  onDelete,
}) => {
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState<typeof DEFAULT_FORM>(() => {
    if (editingEvent) {
      let startDate = '';
      if (
        editingEvent.date !== undefined &&
        editingEvent.month !== undefined &&
        editingEvent.year !== undefined
      ) {
        const m = String(editingEvent.month + 1).padStart(2, '0');
        const d = String(editingEvent.date).padStart(2, '0');
        startDate = `${editingEvent.year}-${m}-${d}`;
      }
      return {
        title: editingEvent.title,
        eventType: editingEvent.eventType || 'live-class',
        startDate,
        startTime: editingEvent.time || '20:00',
        endTime: editingEvent.endTime || '22:00',
        allDay: editingEvent.allDay || false,
        recurrence: editingEvent.dayOfWeek !== undefined ? 'weekly' : 'none',
        details: editingEvent.details || '',
      };
    }
    return { ...DEFAULT_FORM, startDate: initialDate || today };
  });

  useEffect(() => {
    if (isOpen) {
      if (editingEvent) {
        let startDate = '';
        if (
          editingEvent.date !== undefined &&
          editingEvent.month !== undefined &&
          editingEvent.year !== undefined
        ) {
          const m = String(editingEvent.month + 1).padStart(2, '0');
          const d = String(editingEvent.date).padStart(2, '0');
          startDate = `${editingEvent.year}-${m}-${d}`;
        }
        setForm({
          title: editingEvent.title,
          eventType: editingEvent.eventType || 'live-class',
          startDate,
          startTime: editingEvent.time || '20:00',
          endTime: editingEvent.endTime || '22:00',
          allDay: editingEvent.allDay || false,
          recurrence: editingEvent.dayOfWeek !== undefined ? 'weekly' : 'none',
          details: editingEvent.details || '',
        });
      } else {
        setForm({ ...DEFAULT_FORM, startDate: initialDate || today });
      }
    }
  }, [isOpen, editingEvent, initialDate, today]);

  if (!isOpen) return null;

  const cfg = EVENT_TYPE_CONFIG[form.eventType];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const currentCfg = EVENT_TYPE_CONFIG[form.eventType];
    const colorClass = `${currentCfg.bg} ${currentCfg.textColor}`;

    let eventData: Omit<CalendarEvent, 'id'>;

    if (form.recurrence === 'weekly' && form.startDate) {
      const d = new Date(form.startDate);
      const jsDay = d.getDay();
      const dayOfWeek = jsDay === 0 ? 7 : jsDay;
      eventData = {
        title: form.title.trim(),
        time: form.allDay ? '00:00' : form.startTime,
        endTime: form.allDay ? undefined : form.endTime,
        allDay: form.allDay || undefined,
        dayOfWeek,
        startRecur: d.getTime(),
        colorClass,
        type:
          form.eventType === 'live-class' ||
          form.eventType === 'kick-off' ||
          form.eventType === 'capstone'
            ? 'class'
            : 'community',
        eventType: form.eventType,
        details: form.details.trim() || undefined,
      };
    } else {
      const d = form.startDate ? new Date(form.startDate) : new Date();
      eventData = {
        title: form.title.trim(),
        time: form.allDay ? '00:00' : form.startTime,
        endTime: form.allDay ? undefined : form.endTime,
        allDay: form.allDay || undefined,
        date: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear(),
        colorClass,
        type:
          form.eventType === 'live-class' ||
          form.eventType === 'kick-off' ||
          form.eventType === 'capstone'
            ? 'class'
            : 'community',
        eventType: form.eventType,
        details: form.details.trim() || undefined,
      };
    }

    onSave(eventData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div className="h-1.5 w-full" style={{ background: cfg.color }} />

        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-gray-100">
          <input
            autoFocus
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Thêm tiêu đề"
            className="flex-1 text-xl font-bold text-gray-800 placeholder-gray-300 border-0 border-b-2 border-b-blue-500 focus:outline-none focus:border-b-blue-600 pb-1 bg-transparent"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
            {/* Event Type */}
            <div className="flex items-start gap-4">
              <Tag size={18} className="mt-2.5 text-gray-400 shrink-0" />
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Loại sự kiện
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    Object.entries(EVENT_TYPE_CONFIG) as [
                      EventType,
                      (typeof EVENT_TYPE_CONFIG)[EventType],
                    ][]
                  ).map(([key, val]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, eventType: key }))}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all ${
                        form.eventType === key
                          ? 'border-transparent text-white shadow-sm'
                          : 'border-gray-200 text-gray-600 bg-gray-50 hover:border-gray-300'
                      }`}
                      style={
                        form.eventType === key
                          ? { backgroundColor: val.color, borderColor: val.color }
                          : {}
                      }
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            form.eventType === key ? 'rgba(255,255,255,0.7)' : val.color,
                        }}
                      />
                      {val.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-start gap-4">
              <CalendarDays size={18} className="mt-2.5 text-gray-400 shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                    className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                  />
                  {!form.allDay && (
                    <>
                      <input
                        type="time"
                        value={form.startTime}
                        onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                        className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                      />
                      <span className="text-gray-400 text-sm font-semibold">đến</span>
                      <input
                        type="time"
                        value={form.endTime}
                        onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                        className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                      />
                    </>
                  )}
                </div>
                {/* All Day toggle */}
                <label className="flex items-center gap-2.5 cursor-pointer w-fit">
                  <div
                    onClick={() => setForm((f) => ({ ...f, allDay: !f.allDay }))}
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      form.allDay ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        form.allDay ? 'translate-x-4' : ''
                      }`}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-600">Cả ngày</span>
                </label>
              </div>
            </div>

            {/* Recurrence */}
            <div className="flex items-center gap-4">
              <Repeat size={18} className="text-gray-400 shrink-0" />
              <select
                value={form.recurrence}
                onChange={(e) =>
                  setForm((f) => ({ ...f, recurrence: e.target.value as 'none' | 'weekly' }))
                }
                className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
              >
                <option value="none">Không lặp lại</option>
                <option value="weekly">Hàng tuần (theo ngày đã chọn)</option>
              </select>
            </div>

            {/* Description */}
            <div className="flex items-start gap-4">
              <AlignLeft size={18} className="mt-2 text-gray-400 shrink-0" />
              <textarea
                value={form.details}
                onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))}
                placeholder="Thêm mô tả (địa điểm Zoom, nội dung...)"
                rows={3}
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none transition-all placeholder-gray-400"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              {editingEvent && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    onDelete(editingEvent.id);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={13} />
                  Xóa sự kiện
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                {editingEvent ? 'Lưu thay đổi' : 'Tạo sự kiện'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
