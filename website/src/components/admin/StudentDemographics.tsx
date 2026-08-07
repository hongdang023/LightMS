import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export const getDemographics = (student: any) => {
  return {
    current_role: student.current_role || student.current_job || 'Chưa cập nhật',
    work_field: student.work_field || student.industry || 'Chưa cập nhật',
    gender: student.gender || 'Chưa cập nhật',
    age_group: student.age_group || 'Chưa cập nhật',
    living_region: student.living_region || 'Chưa cập nhật',
    referral_source: student.referral_source || 'Chưa cập nhật'
  };
};

export const DemographicsChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
      <h4 className="font-extrabold text-xs text-[#15333B] uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">{title}</h4>
      <div className="flex-1 flex items-center justify-center min-h-[160px] w-full">
        {children}
      </div>
    </div>
  );
};

export const HorizontalProgressBarList: React.FC<{
  data: { label: string; count: number; percentage: number }[];
  colorClass?: string;
}> = ({ data, colorClass = 'bg-amber-500' }) => {
  return (
    <div className="w-full space-y-3">
      {data.map((item, idx) => (
        <div key={idx} className="space-y-1">
          <div className="flex justify-between items-center text-[10px] font-bold">
            <span className="text-gray-700 truncate max-w-[180px]" title={item.label}>{item.label}</span>
            <span className="text-[#15333B] font-extrabold">{item.count} HV ({item.percentage}%)</span>
          </div>
          <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
            <div
              style={{ width: `${item.percentage}%` }}
              className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const DemographicsDonutChart: React.FC<{
  data: { label: string; count: number; percentage: number; colorHex: string }[];
}> = ({ data }) => {
  const radius = 32;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  
  let accumulatedPercentage = 0;

  return (
    <div className="flex items-center justify-center gap-6 w-full">
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="transparent"
            stroke="#F3F4F6"
            strokeWidth={strokeWidth}
          />
          {data.map((item, idx) => {
            const strokeDashoffset = circumference - (item.percentage / 100) * circumference;
            const strokeDasharray = `${circumference}`;
            const rotationOffset = (accumulatedPercentage / 100) * circumference;
            accumulatedPercentage += item.percentage;
            
            return (
              <circle
                key={idx}
                cx="40"
                cy="40"
                r={radius}
                fill="transparent"
                stroke={item.colorHex}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transformOrigin: '40px 40px',
                  transform: `rotate(${(rotationOffset / circumference) * 360}deg)`,
                }}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Tổng</span>
          <span className="text-sm font-black text-[#15333B]">{data.reduce((sum, item) => sum + item.count, 0)} HV</span>
        </div>
      </div>
      
      <div className="flex-1 space-y-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.colorHex }}></span>
            <div className="flex justify-between w-full text-[10px] font-bold text-gray-700">
              <span>{item.label}</span>
              <span className="text-[#15333B] font-extrabold">{item.count} ({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const VerticalProgressBarList: React.FC<{
  data: { label: string; count: number; percentage: number }[];
  colorClass?: string;
}> = ({ data, colorClass = 'bg-amber-500' }) => {
  const [hoveredBar, setHoveredBar] = useState<{
    label: string;
    count: number;
    percentage: number;
    x: number;
    y: number;
  } | null>(null);

  return (
    <div className="flex items-end justify-around h-36 w-full pt-4 border-b border-gray-150 pb-1 relative">
      {data.map((item, idx) => (
        <div
          key={idx}
          className="group relative flex flex-col items-center flex-1 min-w-0 mx-1 h-full justify-end cursor-pointer"
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setHoveredBar({
              label: item.label,
              count: item.count,
              percentage: item.percentage,
              x: rect.left + rect.width / 2,
              y: rect.top,
            });
          }}
          onMouseLeave={() => setHoveredBar(null)}
        >
          <span className="text-[9px] font-black text-gray-500 mb-1">{item.percentage}%</span>
          
          <div
            style={{ height: `${Math.max(item.percentage, 5)}%` }}
            className={`w-full max-w-[16px] rounded-t-md transition-all duration-300 group-hover:opacity-85 ${colorClass}`}
          ></div>
          
          <span className="text-[8px] font-extrabold text-[#3E5E63] mt-2 block truncate w-full text-center" title={item.label}>
            {item.label}
          </span>
        </div>
      ))}

      {/* Tooltip portal */}
      {hoveredBar && createPortal(
        <div
          style={{
            position: 'fixed',
            left: `${hoveredBar.x}px`,
            top: `${hoveredBar.y - 8}px`,
            transform: 'translate(-50%, -100%)',
          }}
          className="flex flex-col items-center bg-[#15333B] text-white text-[9px] px-2 py-1 rounded-lg shadow-lg z-[9999] w-24 text-center pointer-events-none"
        >
          <span className="font-extrabold truncate w-full">{hoveredBar.label}</span>
          <span className="font-bold text-emerald-400">{hoveredBar.count} HV ({hoveredBar.percentage}%)</span>
          <div className="w-1.5 h-1.5 bg-[#15333B] rotate-45 mt-1 -mb-2"></div>
        </div>,
        document.body
      )}
    </div>
  );
};
