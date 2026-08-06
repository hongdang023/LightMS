import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Course, Batch, Lesson } from '../types/database';

export interface CourseContextType {
  courses: Course[];
  batches: Batch[];
  lessons: Lesson[];
  isLessonsLoading: boolean;
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  setBatches: React.Dispatch<React.SetStateAction<Batch[]>>;
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
  setIsLessonsLoading: (loading: boolean) => void;
  completeLesson: (lessonId: string) => void;
  updateLesson: (id: string, updates: Partial<Lesson>) => void;
  updateBatch: (id: string, updates: Partial<Batch>) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLessonsLoading, setIsLessonsLoading] = useState(true);

  // ── Initial data fetch from Supabase ──────────────────────────────────────
  useEffect(() => {
    const loadCourseData = async () => {
      const [
        { data: coursesData },
        { data: batchesData },
        { data: lessonsData },
      ] = await Promise.all([
        supabase.from('courses').select('*'),
        supabase.from('batches').select('*'),
        supabase.from('lessons').select('*').order('order_index', { ascending: true }),
      ]);

      if (coursesData) setCourses(coursesData);
      if (batchesData) setBatches(batchesData);
      if (lessonsData) setLessons(lessonsData);
      setIsLessonsLoading(false);
    };

    loadCourseData();
  }, []);

  const completeLesson = (lessonId: string) => {
    console.log('Complete lesson triggered:', lessonId);
  };

  const updateLesson = (id: string, updates: Partial<Lesson>) => {
    const existingLesson = lessons.find(l => l.id === id);
    setLessons(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));

    if (updates.has_materials && existingLesson && !existingLesson.has_materials) {
      import('../lib/autoAnnouncement').then(({ createContentUpdateAnnouncement }) => {
        const autoAnn = createContentUpdateAnnouncement({ ...existingLesson, ...updates });
        const { isNew, ...dbAnn } = autoAnn;
        supabase.from('announcements').insert([dbAnn]).then(({ error }) => {
          if (error) console.log('Auto content announcement insert note:', error.message);
        });
      });
    }

    const { target, ...dbUpdates } = updates as any;
    supabase.from('lessons').update(dbUpdates).eq('id', id).then(({ error }) => {
      if (error) console.error('Lỗi khi cập nhật bài học trên Supabase:', error);
    });
  };

  const updateBatch = (id: string, updates: Partial<Batch>) => {
    setBatches(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    supabase.from('batches').update(updates).eq('id', id).then(({ error }) => {
      if (error) console.error('Lỗi khi cập nhật batch trên Supabase:', error);
    });
  };

  return (
    <CourseContext.Provider value={{
      courses,
      batches,
      lessons,
      isLessonsLoading,
      setCourses,
      setBatches,
      setLessons,
      setIsLessonsLoading,
      completeLesson,
      updateLesson,
      updateBatch
    }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) throw new Error('useCourse must be used within a CourseProvider');
  return context;
};
