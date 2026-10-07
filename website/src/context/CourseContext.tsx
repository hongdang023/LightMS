import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Course, Batch, Lesson, BatchEnrollment } from '../types/database';
import { INITIAL_COURSES, OBSIDIAN_LESSONS, VIBE_201_LESSONS } from '../data/seedCourses';
import { enrollmentService } from '../services/enrollmentService';
import { d1ApiService } from '../services/d1ApiService';
import { useAuth } from './AuthContext';

export interface CourseContextType {
  courses: Course[];
  batches: Batch[];
  lessons: Lesson[];
  activeCourse: Course | null;
  activeBatch: Batch | null;
  userEnrollments: BatchEnrollment[];
  isLessonsLoading: boolean;
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  setBatches: React.Dispatch<React.SetStateAction<Batch[]>>;
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
  setActiveCourse: (course: Course | null) => void;
  setActiveBatch: (batch: Batch | null) => void;
  setIsLessonsLoading: (loading: boolean) => void;
  completeLesson: (lessonId: string) => void;
  updateLesson: (id: string, updates: Partial<Lesson>) => Promise<{ error: any }>;
  addLesson: (lesson: Omit<Lesson, 'id'> & { id?: string }) => Promise<{ data?: Lesson; error: any }>;
  updateBatch: (id: string, updates: Partial<Batch>) => void;
  enrollWithAccessCode: (accessCode: string, targetBatchId?: string) => { success: boolean; message: string; batch?: Batch };
  selectCourseAndBatch: (course: Course, batch: Batch) => void;
  isUserEnrolledInBatch: (batchId: string) => boolean;
  getBatchesForCourse: (courseId: string) => Batch[];
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeUser } = useAuth();
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>(VIBE_201_LESSONS);
  const [isLessonsLoading, setIsLessonsLoading] = useState(false);

  // Active Selected Course & Batch
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeBatch, setActiveBatch] = useState<Batch | null>(null);
  const [userEnrollments, setUserEnrollments] = useState<BatchEnrollment[]>([]);

  // Helper load lessons according to course (D1 first with localStorage fallback)
  const getLessonsForCourse = (course: Course | null | undefined): Lesson[] => {
    if (!course) return VIBE_201_LESSONS;
    const courseKey = course.slug || course.id;
    try {
      const saved = localStorage.getItem(`lightms_lessons_${courseKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Lỗi đọc bài học từ localStorage:', e);
    }

    if (course.slug === 'vibe-coding-201' || course.id === 'course-vibe-201') {
      return VIBE_201_LESSONS;
    }
    if (course.slug === 'obsidian-101' || course.id === 'course-obsidian-101') {
      return OBSIDIAN_LESSONS;
    }
    return [];
  };

  const fetchLessonsFromD1 = async (course: Course | null | undefined) => {
    if (!course) return;
    try {
      const d1Lessons = await d1ApiService.getLessons(course.id);
      if (d1Lessons && d1Lessons.length > 0) {
        setLessons(d1Lessons);
        const courseKey = course.slug || course.id;
        localStorage.setItem(`lightms_lessons_${courseKey}`, JSON.stringify(d1Lessons));
      }
    } catch (e) {
      console.warn('Lỗi lấy bài học từ D1:', e);
    }
  };

  // ── Load Batches and Courses (D1 First) ───────────────────────────────────
  useEffect(() => {
    let isCancelled = false;

    // Load courses from D1 if available
    d1ApiService.getCourses().then(d1Courses => {
      if (!isCancelled && d1Courses && d1Courses.length > 0) {
        setCourses(d1Courses);
      }
    });

    // Load batches from D1 or enrollment service
    d1ApiService.getBatches().then(d1Batches => {
      if (!isCancelled && d1Batches && d1Batches.length > 0) {
        setBatches(d1Batches);
      } else if (!isCancelled) {
        const loadedBatches = enrollmentService.getAllBatches();
        setBatches(loadedBatches);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  // ── Load Batches and Enrollments when user changes ────────────────────────
  useEffect(() => {
    let isCancelled = false;
    const loadedBatches = enrollmentService.getAllBatches();
    if (batches.length === 0) {
      setBatches(loadedBatches);
    }

    // Tải enrollments từ D1 để đồng bộ trên tất cả thiết bị
    d1ApiService.getEnrollments().then(remoteEnrollments => {
      if (!isCancelled && remoteEnrollments && remoteEnrollments.length > 0) {
        enrollmentService.syncRemoteEnrollments(remoteEnrollments);
        if (activeUser) {
          const updatedUserEnrollments = enrollmentService.getUserEnrollments(activeUser.id);
          setUserEnrollments(updatedUserEnrollments);
        }
      }
    }).catch(err => {
      console.warn('[CourseContext] D1 getEnrollments error:', err);
    });

    if (activeUser) {
      const enrollments = enrollmentService.getUserEnrollments(activeUser.id);
      setUserEnrollments(enrollments);

      // Restore active course/batch from localStorage or default to first enrolled
      const savedCourseId = localStorage.getItem('lightms_active_course_id');
      const savedBatchId = localStorage.getItem('lightms_active_batch_id');

      let targetCourse = courses.find(c => c.id === savedCourseId);
      let targetBatch = (batches.length > 0 ? batches : loadedBatches).find(b => b.id === savedBatchId);

      if (!targetBatch && enrollments.length > 0) {
        targetBatch = (batches.length > 0 ? batches : loadedBatches).find(b => b.id === enrollments[0].batch_id);
        if (targetBatch) {
          targetCourse = courses.find(c => c.id === targetBatch?.course_id);
        }
      }

      // Default to Vibe Coding 201 K2 if nothing found
      if (!targetCourse) {
        targetCourse = courses.find(c => c.slug === 'vibe-coding-201') || courses[0];
      }
      if (!targetBatch && targetCourse) {
        targetBatch = (batches.length > 0 ? batches : loadedBatches).find(b => b.course_id === targetCourse?.id && b.is_active) || (batches.length > 0 ? batches : loadedBatches)[0];
      }

      setActiveCourse(targetCourse || null);
      setActiveBatch(targetBatch || null);
      setLessons(getLessonsForCourse(targetCourse));
      fetchLessonsFromD1(targetCourse);
    }

    return () => {
      isCancelled = true;
    };
  }, [activeUser, courses, batches]);

  // Helper check enrollment
  const isUserEnrolledInBatch = (batchId: string): boolean => {
    if (!activeUser) return false;
    if (activeUser.role === 'admin') return true; // Admin has universal access
    return userEnrollments.some(e => e.batch_id === batchId && e.status === 'active');
  };

  const getBatchesForCourse = (courseId: string): Batch[] => {
    return batches.filter(b => b.course_id === courseId);
  };

  const selectCourseAndBatch = (course: Course, batch: Batch) => {
    setActiveCourse(course);
    setActiveBatch(batch);
    localStorage.setItem('lightms_active_course_id', course.id);
    localStorage.setItem('lightms_active_batch_id', batch.id);
    setLessons(getLessonsForCourse(course));
    fetchLessonsFromD1(course);
  };


  const enrollWithAccessCode = (accessCode: string, targetBatchId?: string) => {
    if (!activeUser) {
      return { success: false, message: 'Vui lòng đăng nhập trước khi kích hoạt khóa học!' };
    }

    const result = enrollmentService.verifyAndEnroll(activeUser.id, accessCode, targetBatchId);
    if (result.success && result.batch) {
      // Sync enrollment to Cloudflare D1
      d1ApiService.createEnrollment({
        userId: activeUser.id,
        batchId: result.batch.id,
        courseId: result.courseId || result.batch.course_id,
        accessCode: accessCode.trim().toUpperCase()
      }).catch(err => {
        console.warn('[CourseContext] D1 createEnrollment error:', err);
      });

      // Refresh enrollments
      const updatedEnrollments = enrollmentService.getUserEnrollments(activeUser.id);
      setUserEnrollments(updatedEnrollments);

      const matchedCourse = courses.find(c => c.id === result.courseId) || activeCourse;
      if (matchedCourse) {
        selectCourseAndBatch(matchedCourse, result.batch);
      }
    }
    return result;
  };

  const completeLesson = (lessonId: string) => {
    console.log('Complete lesson triggered for batch:', activeBatch?.id, 'lesson:', lessonId);
  };

  const updateLesson = async (id: string, updates: Partial<Lesson>) => {
    // 1. Optimistic Update frontend state & localStorage
    setLessons(prev => {
      const nextLessons = prev.map(l => (l.id === id ? { ...l, ...updates } : l));
      const courseKey = activeCourse?.slug || activeCourse?.id || 'default';
      try {
        localStorage.setItem(`lightms_lessons_${courseKey}`, JSON.stringify(nextLessons));
      } catch (e) {
        console.warn('Lỗi lưu bài học vào localStorage:', e);
      }
      return nextLessons;
    });

    // 2. Persist update to Backend (Cloudflare D1)
    try {
      await d1ApiService.updateLesson(id, updates);
    } catch (e) {
      console.warn('[CourseContext] Không thể lưu lesson lên D1:', e);
    }

    return { error: null };
  };

  const addLesson = async (newLessonData: Omit<Lesson, 'id'> & { id?: string }) => {
    const courseId = activeCourse?.id || 'course-obsidian-101';
    const newLesson: Lesson = {
      ...newLessonData,
      id: newLessonData.id || `lesson-${Date.now()}`,
      course_id: newLessonData.course_id || courseId,
      order_index: newLessonData.order_index || (lessons.length + 1),
    };

    // 1. Update frontend state & localStorage
    setLessons(prev => {
      const nextLessons = [...prev, newLesson];
      const courseKey = activeCourse?.slug || activeCourse?.id || 'default';
      try {
        localStorage.setItem(`lightms_lessons_${courseKey}`, JSON.stringify(nextLessons));
      } catch (e) {
        console.warn('Lỗi lưu bài học mới vào localStorage:', e);
      }
      return nextLessons;
    });

    // 2. Persist create to Backend (Cloudflare D1)
    try {
      await d1ApiService.createLesson(newLesson);
    } catch (e) {
      console.warn('[CourseContext] Không thể tạo lesson lên D1:', e);
    }

    return { data: newLesson, error: null };
  };

  const updateBatch = (id: string, updates: Partial<Batch>) => {
    setBatches(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        batches,
        lessons,
        activeCourse,
        activeBatch,
        userEnrollments,
        isLessonsLoading,
        setCourses,
        setBatches,
        setLessons,
        setActiveCourse,
        setActiveBatch,
        setIsLessonsLoading,
        completeLesson,
        updateLesson,
        addLesson,
        updateBatch,
        enrollWithAccessCode,
        selectCourseAndBatch,
        isUserEnrolledInBatch,
        getBatchesForCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) throw new Error('useCourse must be used within a CourseProvider');
  return context;
};
