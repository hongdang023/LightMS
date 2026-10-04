import { drizzle } from 'drizzle-orm/d1';
import { eq, and, desc, sql } from 'drizzle-orm';
import * as schema from '../db/schema';

export interface Env {
  DB: D1Database;
  STORAGE?: R2Bucket;
  ASSETS?: { fetch: typeof fetch };
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Only process /api/* routes in this router
    if (!url.pathname.startsWith('/api/')) {
      if (env.ASSETS) {
        return env.ASSETS.fetch(request);
      }
      return new Response('Not found', { status: 404 });
    }

    const db = drizzle(env.DB, { schema });

    try {
      // =========================================================================
      // 1. COURSES: GET /api/courses, POST /api/courses, PUT /api/courses
      // =========================================================================
      if (url.pathname === '/api/courses') {
        if (request.method === 'GET') {
          const courseList = await db.query.courses.findMany({
            orderBy: [desc(schema.courses.isActive)],
          });
          return jsonResponse({ success: true, courses: courseList });
        }

        if (request.method === 'POST') {
          const body = (await request.json()) as any;
          const courseId = body.id || `course-${crypto.randomUUID()}`;
          const nowIso = new Date().toISOString();

          await db.insert(schema.courses).values({
            id: courseId,
            slug: body.slug || `course-${Date.now()}`,
            title: body.title || 'Untitled Course',
            description: body.description || '',
            coverImage: body.cover_image || body.coverImage || '',
            tagline: body.tagline || '',
            level: body.level || 'Beginner',
            category: body.category || 'AI & Productivity',
            isActive: body.is_active !== undefined ? body.is_active : true,
            createdAt: nowIso,
          });

          return jsonResponse({ success: true, courseId });
        }

        if (request.method === 'PUT') {
          const body = (await request.json()) as any;
          if (!body.id) {
            return jsonResponse({ success: false, message: 'Missing course id' }, 400);
          }

          await db
            .update(schema.courses)
            .set({
              title: body.title,
              description: body.description,
              coverImage: body.cover_image || body.coverImage,
              tagline: body.tagline,
              level: body.level,
              category: body.category,
              isActive: body.is_active !== undefined ? body.is_active : body.isActive,
            })
            .where(eq(schema.courses.id, body.id));

          return jsonResponse({ success: true, message: 'Course updated' });
        }
      }

      // =========================================================================
      // 2. BATCHES: GET /api/batches, POST /api/batches, PUT /api/batches
      // =========================================================================
      if (url.pathname === '/api/batches') {
        if (request.method === 'GET') {
          const courseId = url.searchParams.get('courseId');
          if (courseId) {
            const batchList = await db.query.batches.findMany({
              where: eq(schema.batches.courseId, courseId),
            });
            return jsonResponse({ success: true, batches: batchList });
          }
          const allBatches = await db.query.batches.findMany();
          return jsonResponse({ success: true, batches: allBatches });
        }

        if (request.method === 'POST') {
          const body = (await request.json()) as any;
          const batchId = body.id || `batch-${crypto.randomUUID()}`;
          const nowIso = new Date().toISOString();

          await db.insert(schema.batches).values({
            id: batchId,
            courseId: body.course_id || body.courseId,
            batchCode: body.batch_code || body.batchCode || 'K1',
            title: body.title || body.name || 'Khóa mới',
            accessCode: body.access_code || body.accessCode || `CODE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            startDate: body.start_date || body.startDate || '',
            endDate: body.end_date || body.endDate || '',
            mentorId: body.mentor_id || body.mentorId || null,
            maxStudents: body.max_students || body.maxStudents || 50,
            isActive: body.is_active !== undefined ? body.is_active : true,
            createdAt: nowIso,
          });

          return jsonResponse({ success: true, batchId });
        }

        if (request.method === 'PUT') {
          const body = (await request.json()) as any;
          if (!body.id) {
            return jsonResponse({ success: false, message: 'Missing batch id' }, 400);
          }

          await db
            .update(schema.batches)
            .set({
              title: body.title || body.name,
              batchCode: body.batch_code || body.batchCode,
              accessCode: body.access_code || body.accessCode,
              startDate: body.start_date || body.startDate,
              endDate: body.end_date || body.endDate,
              mentorId: body.mentor_id || body.mentorId,
              maxStudents: body.max_students || body.maxStudents,
              isActive: body.is_active !== undefined ? body.is_active : body.isActive,
            })
            .where(eq(schema.batches.id, body.id));

          return jsonResponse({ success: true, message: 'Batch updated' });
        }
      }

      // =========================================================================
      // 3. CALENDAR: GET /api/calendar, POST /api/calendar, PUT /api/calendar, DELETE /api/calendar
      // =========================================================================
      if (url.pathname === '/api/calendar') {
        if (request.method === 'GET') {
          const batchId = url.searchParams.get('batchId');
          if (!batchId) {
            return jsonResponse({ success: false, message: 'Missing batchId' }, 400);
          }
          const events = await db.query.calendarEvents.findMany({
            where: eq(schema.calendarEvents.batchId, batchId),
          });
          return jsonResponse({ success: true, events });
        }

        if (request.method === 'POST') {
          const body = (await request.json()) as any;
          const eventId = body.id || crypto.randomUUID();
          const nowIso = new Date().toISOString();

          await db.insert(schema.calendarEvents).values({
            id: eventId,
            batchId: body.batch_id || body.batchId,
            title: body.title,
            eventType: body.event_type || body.eventType || 'Live Class',
            startTime: body.start_time || body.startTime || nowIso,
            endTime: body.end_time || body.endTime || nowIso,
            meetingUrl: body.meeting_url || body.meetingUrl || '',
            description: body.description || '',
            createdAt: nowIso,
          });

          return jsonResponse({ success: true, eventId });
        }

        if (request.method === 'PUT') {
          const body = (await request.json()) as any;
          if (!body.id) {
            return jsonResponse({ success: false, message: 'Missing event id' }, 400);
          }

          await db
            .update(schema.calendarEvents)
            .set({
              title: body.title,
              eventType: body.event_type || body.eventType,
              startTime: body.start_time || body.startTime,
              endTime: body.end_time || body.endTime,
              meetingUrl: body.meeting_url || body.meetingUrl,
              description: body.description,
            })
            .where(eq(schema.calendarEvents.id, body.id));

          return jsonResponse({ success: true, message: 'Calendar event updated' });
        }

        if (request.method === 'DELETE') {
          const id = url.searchParams.get('id');
          if (!id) {
            return jsonResponse({ success: false, message: 'Missing event id' }, 400);
          }
          await db.delete(schema.calendarEvents).where(eq(schema.calendarEvents.id, id));
          return jsonResponse({ success: true, message: 'Calendar event deleted' });
        }
      }

      // =========================================================================
      // 4. ONBOARDING: GET /api/onboarding, PUT /api/onboarding
      // =========================================================================
      if (url.pathname === '/api/onboarding') {
        if (request.method === 'GET') {
          const courseId = url.searchParams.get('courseId');
          if (!courseId) {
            return jsonResponse({ success: false, message: 'Missing courseId' }, 400);
          }
          const days = await db.query.onboardingDays.findMany({
            where: eq(schema.onboardingDays.courseId, courseId),
            orderBy: [schema.onboardingDays.day],
          });
          return jsonResponse({ success: true, onboardingDays: days });
        }

        if (request.method === 'PUT' || request.method === 'POST') {
          const body = (await request.json()) as any;
          const courseId = body.course_id || body.courseId;
          const dayNumber = Number(body.day);

          if (!courseId || isNaN(dayNumber)) {
            return jsonResponse({ success: false, message: 'Missing courseId or day number' }, 400);
          }

          const existing = await db.query.onboardingDays.findFirst({
            where: and(
              eq(schema.onboardingDays.courseId, courseId),
              eq(schema.onboardingDays.day, dayNumber)
            ),
          });

          const nowIso = new Date().toISOString();

          if (existing) {
            await db
              .update(schema.onboardingDays)
              .set({
                title: body.title !== undefined ? body.title : existing.title,
                intro: body.intro !== undefined ? body.intro : existing.intro,
                objective: body.objective !== undefined ? body.objective : existing.objective,
                checklist: body.checklist !== undefined ? body.checklist : existing.checklist,
                takeaway: body.takeaway !== undefined ? body.takeaway : existing.takeaway,
                emailSubject: body.email_subject !== undefined ? body.email_subject : body.emailSubject !== undefined ? body.emailSubject : existing.emailSubject,
                emailBody: body.email_body !== undefined ? body.email_body : body.emailBody !== undefined ? body.emailBody : existing.emailBody,
                companionHint: body.companion_hint !== undefined ? body.companion_hint : body.companionHint !== undefined ? body.companionHint : existing.companionHint,
                bonusResources: body.bonus_resources !== undefined ? body.bonus_resources : body.bonusResources !== undefined ? body.bonusResources : existing.bonusResources,
              })
              .where(eq(schema.onboardingDays.id, existing.id));
          } else {
            const newId = body.id || `ob-${courseId}-day-${dayNumber}`;
            await db.insert(schema.onboardingDays).values({
              id: newId,
              courseId: courseId,
              batchId: body.batch_id || body.batchId || null,
              day: dayNumber,
              title: body.title || `Ngày ${dayNumber}`,
              intro: body.intro || '',
              objective: body.objective || '',
              checklist: body.checklist || '',
              takeaway: body.takeaway || '',
              emailSubject: body.email_subject || body.emailSubject || '',
              emailBody: body.email_body || body.emailBody || '',
              companionHint: body.companion_hint || body.companionHint || '',
              bonusResources: body.bonus_resources || body.bonusResources || '',
              createdAt: nowIso,
            });
          }

          return jsonResponse({ success: true, message: `Onboarding Day ${dayNumber} updated in D1` });
        }
      }

      // =========================================================================
      // 5. USERS & PROFILES: GET /api/users, PUT /api/users/profile, POST /api/users/tasks
      // =========================================================================
      if (url.pathname === '/api/users' && request.method === 'GET') {
        const userList = await db.query.users.findMany({
          orderBy: [desc(schema.users.createdAt)],
        });
        return jsonResponse({ success: true, users: userList });
      }

      if (url.pathname === '/api/users/profile' && request.method === 'PUT') {
        const body = (await request.json()) as any;
        if (!body.id) {
          return jsonResponse({ success: false, message: 'Missing user id' }, 400);
        }

        const updateData: any = {};
        if (body.full_name !== undefined) updateData.fullName = body.full_name;
        if (body.avatar_url !== undefined) updateData.avatarUrl = body.avatar_url;
        if (body.phone_number !== undefined) updateData.phoneNumber = body.phone_number;
        if (body.facebook_url !== undefined) updateData.facebookUrl = body.facebook_url;
        if (body.industry !== undefined) updateData.industry = body.industry;
        if (body.current_job !== undefined) updateData.currentJob = body.current_job;
        if (body.product_idea !== undefined) updateData.productIdea = body.product_idea;
        if (body.is_profile_completed !== undefined) updateData.isProfileCompleted = body.is_profile_completed;
        if (body.onboarding_tasks !== undefined) updateData.onboardingTasksJson = JSON.stringify(body.onboarding_tasks);
        if (body.nautical_miles !== undefined) updateData.nauticalMiles = body.nautical_miles;
        if (body.visits !== undefined) updateData.visits = body.visits;

        await db.update(schema.users).set(updateData).where(eq(schema.users.id, body.id));
        return jsonResponse({ success: true, message: 'User profile updated in D1' });
      }

      // =========================================================================
      // 6. LEADERBOARD: GET /api/leaderboard?batchId=...&period=alltime|daily|7day
      // =========================================================================
      if (url.pathname === '/api/leaderboard' && request.method === 'GET') {
        const batchId = url.searchParams.get('batchId');
        const period = url.searchParams.get('period') || 'alltime';

        if (!batchId) {
          return jsonResponse({ success: false, message: 'Missing batchId parameter' }, 400);
        }

        let querySql = `
          SELECT 
            u.id, 
            u.full_name, 
            u.avatar_url, 
            u.email,
            COALESCE(SUM(tx.amount), 0) AS total_points,
            MAX(tx.created_at) AS latest_tx_time
          FROM users u
          INNER JOIN batch_enrollments be ON be.user_id = u.id AND be.batch_id = ?
          LEFT JOIN nautical_miles_transactions tx ON tx.student_id = u.id AND tx.batch_id = ?
        `;

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const startOf7DaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

        if (period === 'daily') {
          querySql += ` AND tx.created_at >= '${startOfToday}'`;
        } else if (period === '7day') {
          querySql += ` AND tx.created_at >= '${startOf7DaysAgo}'`;
        }

        querySql += `
          WHERE u.role = 'student'
          GROUP BY u.id
          ORDER BY total_points DESC, latest_tx_time ASC;
        `;

        const result = await env.DB.prepare(querySql).bind(batchId, batchId).all();

        return jsonResponse({
          success: true,
          batchId,
          period,
          leaderboard: result.results || [],
        });
      }

      // =========================================================================
      // 7. GAMIFICATION TRANSACTIONS: POST /api/gamification/transact
      // =========================================================================
      if (url.pathname === '/api/gamification/transact' && request.method === 'POST') {
        const body = (await request.json()) as {
          studentId: string;
          batchId: string;
          amount: number;
          actionType: string;
          description: string;
          referenceId?: string;
        };

        if (!body.studentId || !body.batchId || typeof body.amount !== 'number') {
          return jsonResponse({ success: false, message: 'Invalid payload' }, 400);
        }

        const txId = crypto.randomUUID();
        const nowIso = new Date().toISOString();

        // Insert transaction with batch_id
        await db.insert(schema.nauticalMilesTransactions).values({
          id: txId,
          studentId: body.studentId,
          batchId: body.batchId,
          amount: body.amount,
          actionType: body.actionType,
          description: body.description,
          referenceId: body.referenceId || null,
          createdAt: nowIso,
        });

        // Increment user's total nautical miles
        await db
          .update(schema.users)
          .set({
            nauticalMiles: sql`${schema.users.nauticalMiles} + ${body.amount}`,
          })
          .where(eq(schema.users.id, body.studentId));

        return jsonResponse({
          success: true,
          transactionId: txId,
          amountAdded: body.amount,
        });
      }

      return jsonResponse({ success: false, message: 'Route not found' }, 404);
    } catch (err: any) {
      console.error('Worker API error:', err);
      return jsonResponse({ success: false, error: err.message }, 500);
    }
  },
};
