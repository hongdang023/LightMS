import React from 'react';
import { Mail } from 'lucide-react';
import type { Profile, Lesson } from '../../../types/database';

interface RecentSubmissionsWidgetProps {
  students: Profile[];
  lessons: Lesson[];
  isStudentLessonCompleted: (studentId: string, lessonId: string) => boolean;
  getStudentUnsubmittedLessons: (studentId: string) => Lesson[];
  onSelectStudent: (studentId: string) => void;
  getMailtoLink: (student: Profile, missingCount: number) => string;
}

export const RecentSubmissionsWidget: React.FC<RecentSubmissionsWidgetProps> = ({
  students,
  getStudentUnsubmittedLessons,
  onSelectStudent,
  getMailtoLink,
}) => {
  const studentsWithBottlenecks = students
    .map((s) => {
      const unsubmitted = getStudentUnsubmittedLessons(s.id);
      return {
        student: s,
        unsubmitted,
        missingCount: unsubmitted.length,
      };
    })
    .filter((item) => item.missingCount > 0)
    .sort((a, b) => b.missingCount - a.missingCount);

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="font-extrabold text-sm text-[#15333B] uppercase tracking-wider flex items-center gap-2">
            🚨 Danh Sách Học Viên Cần Hỗ Trợ Tiến Độ ({studentsWithBottlenecks.length})
          </h3>
          <p className="text-[11px] text-[#3E5E63] font-medium mt-0.5">
            Danh sách học viên chưa nộp bài tập về nhà hoặc đang bị nghẽn tiến độ học
          </p>
        </div>
      </div>

      {studentsWithBottlenecks.length === 0 ? (
        <div className="p-8 text-center bg-teal-50/50 rounded-2xl border border-teal-100/50 space-y-1">
          <span className="text-2xl block">🎉</span>
          <span className="text-xs font-bold text-[#214C54] block">
            Tuyệt vời! Tất cả học viên đều đang nộp bài đầy đủ đúng tiến độ.
          </span>
        </div>
      ) : (
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {studentsWithBottlenecks.map(({ student, unsubmitted, missingCount }) => (
            <div
              key={student.id}
              className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => onSelectStudent(student.id)}
              >
                <img
                  src={student.avatar_url || 'https://via.placeholder.com/40'}
                  alt={student.full_name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <span className="text-xs font-bold text-[#15333B] group-hover:text-[#214C54] transition-colors block">
                    {student.full_name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium block">
                    {student.gmail}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-200">
                    Chậm {missingCount} bài tập
                  </span>
                  <span className="text-[9px] text-gray-400 block mt-0.5 truncate max-w-[180px]">
                    Nghẽn tại: {unsubmitted[0]?.title}
                  </span>
                </div>

                <a
                  href={getMailtoLink(student, missingCount)}
                  className="p-2.5 bg-[#214C54] hover:bg-[#15333B] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center shrink-0"
                  title="Gửi Email Nhắc Nhở Hỗ Trợ"
                >
                  <Mail size={15} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
