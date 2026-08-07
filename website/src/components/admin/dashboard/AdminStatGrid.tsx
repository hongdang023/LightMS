import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface DonutChartProps {
  completed: number;
  total: number;
  label: string;
  sublabel: string;
  colorHex?: string;
  emptyColorHex?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  completed,
  total,
  label,
  sublabel,
  colorHex = '#214C54',
  emptyColorHex = '#F3F4F6',
}) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const radius = 32;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3 transition-all hover:shadow-md">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="transparent"
            stroke={emptyColorHex}
            strokeWidth={strokeWidth}
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="transparent"
            stroke={colorHex}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-black text-[#15333B]">{percentage}%</span>
          <span className="text-[9px] text-gray-400 font-bold uppercase">
            {completed}/{total} HV
          </span>
        </div>
      </div>
      <div className="text-center space-y-0.5">
        <span className="text-[11px] font-black text-[#15333B] block uppercase tracking-wider">
          {label}
        </span>
        <span className="text-[9px] text-[#3E5E63] font-bold block">{sublabel}</span>
      </div>
    </div>
  );
};

interface BarChartProps {
  data: {
    label: string;
    completed: number;
    total: number;
    title: string;
  }[];
  colorClass: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, colorClass }) => {
  const [hoveredItem, setHoveredItem] = useState<{
    title: string;
    completed: number;
    total: number;
    x: number;
    y: number;
  } | null>(null);

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
      <div
        className="flex items-end justify-between h-44 pt-14 pb-2 px-1 border-b border-gray-150 relative"
        style={{ minWidth: data.length > 8 ? `${data.length * 36}px` : '100%' }}
      >
        {data.map((item, index) => {
          const percentage = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
          return (
            <div
              key={index}
              className="group relative flex flex-col items-center flex-1 mx-1 h-full justify-end cursor-pointer"
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setHoveredItem({
                  title: item.title,
                  completed: item.completed,
                  total: item.total,
                  x: rect.left + rect.width / 2,
                  y: rect.top,
                });
              }}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Percentage indicator */}
              <span className="text-[9px] font-black text-gray-500 mb-1">{percentage}%</span>

              {/* The bar */}
              <div
                style={{ height: `${Math.max(percentage, 4)}%` }}
                className={`w-full max-w-[18px] rounded-t-md transition-all duration-300 group-hover:opacity-85 ${colorClass}`}
              ></div>

              {/* Label below the bar */}
              <span className="text-[9px] font-extrabold text-[#3E5E63] mt-2 block whitespace-nowrap">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Tooltip portal */}
      {hoveredItem && createPortal(
        <div
          style={{
            position: 'fixed',
            left: `${hoveredItem.x}px`,
            top: `${hoveredItem.y - 8}px`,
            transform: 'translate(-50%, -100%)',
          }}
          className="flex flex-col items-center bg-[#15333B] text-white text-[10px] p-2 rounded-lg shadow-lg z-[9999] w-36 text-center pointer-events-none"
        >
          <span className="font-extrabold mb-1">{hoveredItem.title}</span>
          <span className="font-bold text-emerald-400">
            {hoveredItem.completed} HV hoàn thành
          </span>
          <span className="font-bold text-rose-400">
            {hoveredItem.total - hoveredItem.completed} HV chưa hoàn thành
          </span>
          <div className="w-1.5 h-1.5 bg-[#15333B] rotate-45 mt-1 -mb-2"></div>
        </div>,
        document.body
      )}
    </div>
  );
};
