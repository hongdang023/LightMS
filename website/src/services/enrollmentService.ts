import type { Batch, BatchEnrollment } from '../types/database';
import { INITIAL_BATCHES, INITIAL_ENROLLMENTS } from '../data/seedCourses';

const STORAGE_ENROLLMENTS_KEY = 'lightms_batch_enrollments';
const STORAGE_BATCHES_KEY = 'lightms_batches';

export const enrollmentService = {
  // Lấy danh sách tất cả các batch (từ local storage hoặc mock data)
  getAllBatches(): Batch[] {
    const saved = localStorage.getItem(STORAGE_BATCHES_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse batches from localStorage', e);
      }
    }
    localStorage.setItem(STORAGE_BATCHES_KEY, JSON.stringify(INITIAL_BATCHES));
    return INITIAL_BATCHES;
  },

  // Lấy các batch thuộc một course cụ thể
  getBatchesByCourse(courseId: string): Batch[] {
    const batches = this.getAllBatches();
    return batches.filter(b => b.course_id === courseId);
  },

  // Lấy toàn bộ danh sách enrollments của tất cả học viên
  getAllEnrollments(): BatchEnrollment[] {
    const saved = localStorage.getItem(STORAGE_ENROLLMENTS_KEY);
    let enrollments: BatchEnrollment[] = INITIAL_ENROLLMENTS;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Clean out any fake / mock students or obsolete test enrollments
          const cleaned = parsed.filter(e => 
            !e.user_id?.startsWith('obs-') && 
            !e.id?.startsWith('enroll-obs-') && 
            e.id !== 'enroll-test-obs101' &&
            !(e.batch_id === 'batch-obs101-k1' && (e.user_id === 'student-1' || e.id?.includes('test')))
          );

          // Remap obsolete batch codes if any
          const remapped = cleaned.map(e => {
            if (e.batch_id === 'batch-vibe201-k3' || e.batch_id === 'e574fea2-9260-4961-8b1d-79ef7e16f784') {
              return { ...e, batch_id: 'batch-vibe201-k2', access_code_used: 'VIBE201-K2-888' };
            }
            return e;
          });

          // Merge any missing initial enrollments
          const existingKeys = new Set(remapped.map((e: any) => `${e.user_id}_${e.batch_id}`));
          const missing = INITIAL_ENROLLMENTS.filter(
            ie => !existingKeys.has(`${ie.user_id}_${ie.batch_id}`)
          );
          enrollments = [...remapped, ...missing];
        }
      } catch (e) {
        console.error('Failed to parse enrollments from localStorage', e);
      }
    }
    localStorage.setItem(STORAGE_ENROLLMENTS_KEY, JSON.stringify(enrollments));
    return enrollments;
  },

  // Lấy danh sách học viên đã ghi danh theo Batch ID cụ thể
  getEnrollmentsForBatch(batchId: string): BatchEnrollment[] {
    const all = this.getAllEnrollments();
    return all.filter(e => (e.batch_id === batchId || (batchId === 'batch-vibe201-k2' && e.batch_id === 'e574fea2-9260-4961-8b1d-79ef7e16f784')) && e.status === 'active');
  },

  // Lấy danh sách enrollments của một học viên
  getUserEnrollments(userId: string): BatchEnrollment[] {
    const all = this.getAllEnrollments();
    return all.filter(e => e.user_id === userId && e.status === 'active');
  },

  // Kiểm tra học viên đã ghi danh vào batch nào của course chưa
  isEnrolledInBatch(userId: string, batchId: string): boolean {
    const batchEnrollments = this.getEnrollmentsForBatch(batchId);
    return batchEnrollments.some(e => e.user_id === userId);
  },

  // Xác thực access code và ghi danh học viên vào batch
  verifyAndEnroll(
    userId: string,
    accessCode: string,
    targetBatchId?: string
  ): { success: boolean; message: string; batch?: Batch; courseId?: string } {
    const trimmedCode = accessCode.trim().toUpperCase().replace(/[\s_]+/g, '-');
    const batches = this.getAllBatches();

    // Map common course codes to course IDs
    const COURSE_CODE_MAP: Record<string, string> = {
      'VIBE201': 'course-vibe-201',
      'VIBE-201': 'course-vibe-201',
      'VIBE101': 'course-vibe-101',
      'VIBE-101': 'course-vibe-101',
      'OBS101': 'course-obsidian-101',
      'OBS-101': 'course-obsidian-101',
      'OBSIDIAN101': 'course-obsidian-101',
      'MOBILE-AGENTS': 'course-mobile-agents',
      'MOBILEAGENTS': 'course-mobile-agents',
      'MOBILE101': 'course-mobile-agents',
      'MOBILEAI': 'course-mobile-agents',
      'THE1IGHT': 'course-vibe-201',
      'THE1IGHT-VIP': 'course-vibe-201',
    };

    const courseIdFromCode = COURSE_CODE_MAP[trimmedCode];
    let matchedBatches: Batch[] = [];

    if (courseIdFromCode) {
      // Course-level code: activates all batches in the course
      matchedBatches = batches.filter(b => b.course_id === courseIdFromCode);
    } else {
      // Specific batch code:
      const singleBatch = batches.find(
        b => b.access_code.toUpperCase() === trimmedCode && (!targetBatchId || b.id === targetBatchId)
      );
      if (singleBatch) {
        matchedBatches = [singleBatch];
      }
    }

    if (matchedBatches.length === 0) {
      return {
        success: false,
        message: 'Mã kích hoạt không chính xác hoặc đã hết hạn. Vui lòng kiểm tra lại!',
      };
    }

    const primaryBatch = matchedBatches.find(b => b.id === targetBatchId) || matchedBatches[0];
    const allEnrollments = this.getAllEnrollments();
    const newEnrollments: BatchEnrollment[] = [...allEnrollments];
    let addedCount = 0;

    matchedBatches.forEach(b => {
      const exists = newEnrollments.some(e => e.batch_id === b.id);
      if (!exists) {
        newEnrollments.push({
          id: `enroll-${Date.now()}-${b.id}`,
          user_id: userId,
          batch_id: b.id,
          course_id: b.course_id,
          access_code_used: trimmedCode,
          enrolled_at: new Date().toISOString(),
          status: 'active',
        });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      localStorage.setItem(STORAGE_ENROLLMENTS_KEY, JSON.stringify(newEnrollments));
    }

    return {
      success: true,
      message: addedCount > 0
        ? `Kích hoạt thành công! Đã mở khóa quyền truy cập ${primaryBatch.name}.`
        : `Bạn đã có quyền truy cập ${primaryBatch.name}!`,
      batch: primaryBatch,
      courseId: primaryBatch.course_id,
    };
  },

  // Tạo thêm batch mới (dành cho Admin)
  createBatch(batchData: Omit<Batch, 'id'>): Batch {
    const batches = this.getAllBatches();
    const newBatch: Batch = {
      ...batchData,
      id: `batch-${Date.now()}`,
    };
    const updated = [...batches, newBatch];
    localStorage.setItem(STORAGE_BATCHES_KEY, JSON.stringify(updated));
    return newBatch;
  },

  // Cập nhật batch
  updateBatch(batchId: string, updates: Partial<Batch>): Batch[] {
    const batches = this.getAllBatches();
    const updated = batches.map(b => b.id === batchId ? { ...b, ...updates } : b);
    localStorage.setItem(STORAGE_BATCHES_KEY, JSON.stringify(updated));
    return updated;
  },

  // Xóa batch
  deleteBatch(batchId: string): Batch[] {
    const batches = this.getAllBatches();
    const updated = batches.filter(b => b.id !== batchId);
    localStorage.setItem(STORAGE_BATCHES_KEY, JSON.stringify(updated));
    return updated;
  },
};

