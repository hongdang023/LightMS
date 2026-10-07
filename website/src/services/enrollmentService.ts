import type { Batch, BatchEnrollment } from '../types/database';

const STORAGE_ENROLLMENTS_KEY = 'lightms_batch_enrollments';
const STORAGE_BATCHES_KEY = 'lightms_batches';

export const DEFAULT_BATCHES: Batch[] = [
  {
    id: 'batch-vibe201-k2',
    course_id: 'course-vibe-201',
    batch_code: 'K2',
    name: 'Vibe Coding 201 - Khóa 2',
    access_code: 'VIBE201-K2-888',
    start_date: '2026-07-01',
    end_date: '2026-08-31',
    max_students: 50,
    is_active: true,
  },
  {
    id: 'e574fea2-9260-4961-8b1d-79ef7e16f784',
    course_id: 'course-vibe-201',
    batch_code: 'K3',
    name: 'Vibe Coding 201 - Khóa 3',
    access_code: 'VIBE201-K3-PROD',
    start_date: '2026-07-01',
    end_date: '2026-08-31',
    max_students: 50,
    is_active: true,
  },
  {
    id: 'batch-obs101-k1',
    course_id: 'course-obsidian-101',
    batch_code: 'K1',
    name: 'Obsidian 101 - Khóa 1',
    access_code: 'OBS101-K1-999',
    start_date: '2026-10-06',
    end_date: '2026-11-01',
    max_students: 80,
    is_active: true,
  },
];

export const enrollmentService = {
  // Lấy danh sách tất cả các batch (từ local storage, D1 hoặc mặc định)
  getAllBatches(): Batch[] {
    const saved = localStorage.getItem(STORAGE_BATCHES_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge với DEFAULT_BATCHES để đảm bảo các lớp học mặc định luôn hiện diện
          const map = new Map<string, Batch>();
          DEFAULT_BATCHES.forEach(b => map.set(b.id, b));
          parsed.forEach((b: Batch) => map.set(b.id, b));
          return Array.from(map.values());
        }
      } catch (e) {
        console.error('Failed to parse batches from localStorage', e);
      }
    }
    return DEFAULT_BATCHES;
  },

  // Lấy các batch thuộc một course cụ thể
  getBatchesByCourse(courseId: string): Batch[] {
    const batches = this.getAllBatches();
    return batches.filter(b => b.course_id === courseId);
  },

  // Lấy toàn bộ danh sách enrollments của tất cả học viên
  getAllEnrollments(): BatchEnrollment[] {
    const saved = localStorage.getItem(STORAGE_ENROLLMENTS_KEY);
    let enrollments: BatchEnrollment[] = [];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Remap obsolete batch codes if any
          const remapped = parsed.map(e => {
            if (e.batch_id === 'batch-vibe201-k3' || e.batch_id === 'e574fea2-9260-4961-8b1d-79ef7e16f784') {
              return { ...e, batch_id: 'batch-vibe201-k2', access_code_used: 'VIBE201-K2-888' };
            }
            return e;
          });
          enrollments = remapped;
        }
      } catch (e) {
        console.error('Failed to parse enrollments from localStorage', e);
      }
    }
    return enrollments;
  },

  // Đồng bộ thêm danh sách enrollments từ Cloudflare D1
  syncRemoteEnrollments(remoteEnrollments: BatchEnrollment[]): BatchEnrollment[] {
    if (!Array.isArray(remoteEnrollments) || remoteEnrollments.length === 0) {
      return this.getAllEnrollments();
    }
    const current = this.getAllEnrollments();
    const map = new Map<string, BatchEnrollment>();
    current.forEach(e => map.set(`${e.user_id}_${e.batch_id}`, e));
    remoteEnrollments.forEach(re => map.set(`${re.user_id}_${re.batch_id}`, re));
    const merged = Array.from(map.values());
    localStorage.setItem(STORAGE_ENROLLMENTS_KEY, JSON.stringify(merged));
    return merged;
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
      const exists = newEnrollments.some(e => e.batch_id === b.id && e.user_id === userId);
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

