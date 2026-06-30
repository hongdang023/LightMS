import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type"); // "reminder" or "reward"

    if (type !== "reminder" && type !== "reward") {
      return new Response(JSON.stringify({ error: "Missing or invalid type parameter. Use 'type=reminder' or 'type=reward'." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!;
    const verifiedEmail = "dangtuyethong2324@gmail.com";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Fetch metadata needed for progress calculation
    const [lessonsRes, assignmentsRes, profilesRes, submissionsRes, batchesRes] = await Promise.all([
      supabase.from('lessons').select('id, module_id'),
      supabase.from('assignments').select('id, lesson_id'),
      supabase.from('profiles').select('*').eq('role', 'student'),
      supabase.from('submissions').select('*'),
      supabase.from('batches').select('start_date')
    ]);

    if (lessonsRes.error || assignmentsRes.error || profilesRes.error || submissionsRes.error || batchesRes.error) {
      throw new Error(`Database query failed.`);
    }

    const lessons = lessonsRes.data || [];
    const assignments = assignmentsRes.data || [];
    const students = profilesRes.data || [];
    const submissions = submissionsRes.data || [];
    const batches = batchesRes.data || [];

    // Safety Check: Do not send reminder/reward emails if the course hasn't started yet
    const now = new Date();
    const courseStarted = batches.some(b => b.start_date && new Date(b.start_date) <= now);

    if (!courseStarted) {
      return new Response(JSON.stringify({ message: "Course has not started yet. Skipping email notifications." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Filter live class assignments (excluding module '00000000-0000-0000-0000-000000000000')
    const liveClassAssignments = assignments.filter(a => {
      const lesson = lessons.find(l => l.id === a.lesson_id);
      return lesson && lesson.module_id !== '00000000-0000-0000-0000-000000000000';
    });
    const totalLiveClassCount = liveClassAssignments.length || 3;

    const sentEmails = [];

    // 2. Scan students and process logic
    for (const student of students) {
      const studentId = student.id;
      const fullName = student.full_name || "Thủy thủ";
      const studentGmail = student.gmail;

      if (!studentGmail) continue;

      // Calculate completed live class assignments
      const completedLiveClassCount = submissions.filter(
        s => s.student_id === studentId && 
        liveClassAssignments.some(la => la.id === s.assignment_id) && 
        (s.status === 'graded' || s.status === 'submitted')
      ).length;

      const rate = totalLiveClassCount > 0 ? (completedLiveClassCount / totalLiveClassCount) : 0;
      const onboardingDone = Math.min(7, Math.floor((student.nautical_miles || 0) / 50));

      let emailSubject = "";
      let emailBody = "";
      let shouldSend = false;

      if (type === "reminder") {
        // Condition: Live class completion rate < 50%
        if (rate < 0.5) {
          shouldSend = true;
          emailSubject = `[The1ight] Nhắc nhở: Tiếp thêm buồm gió cho hải trình của bạn! ⛵`;
          emailBody = `Kẹt kẹt... Alo alo! 🦜\n\nChào bạn ${fullName},\n\nHành trình vượt biển LightMS đã đi được một chặng đường đầy thử thách. Tuy nhiên, Vẹt Lắm Mồm nhận thấy cánh buồm bài tập Live Class của bạn đang chững lại ở mức **${Math.round(rate * 100)}%** (hoàn thành ${completedLiveClassCount}/${totalLiveClassCount} bài tập).\n\nĐừng để bị sóng gió cuốn trôi phía sau nhé! Hãy dành chút thời gian hoàn thành các nhiệm vụ chưa nộp để bắt kịp hạm đội. Nếu gặp bất kỳ trở ngại nào, hãy nhắn ngay cho đội ngũ Mentor của The1ight để nhận hỗ trợ.\n\nChúc bạn sớm vượt sóng thành công! ⛵⚓`;
        }
      } else if (type === "reward") {
        // Condition: Onboarding complete (7 days / 350 miles) AND Live class 100% complete
        if (onboardingDone === 7 && rate === 1.0) {
          shouldSend = true;
          emailSubject = `[The1ight] Vinh danh: Bạn là Thủy thủ xuất sắc của tuần! 🏆`;
          emailBody = `Kẹt kẹt... Alo alo! 🦜\n\nChào bạn ${fullName},\n\nVẹt Lắm Mồm vô cùng tự hào khi được gửi thư vinh danh đặc biệt này đến bạn! Bạn đã xuất sắc hoàn thành **100% Onboarding Week** và đạt tỷ lệ **100% bài tập Live Class** trong tuần qua.\n\nSự kiên trì, tập trung và kỷ luật tự giác của bạn là tấm gương sáng cho cả hạm đội cướp biển LightMS. Hãy tiếp tục giữ vững phong độ đỉnh cao này trên hải trình sắp tới nhé! 🚀\n\nĐội ngũ The1ight xin dành tặng bạn lời khen ngợi nồng nhiệt nhất!`;
        }
      }

      if (shouldSend) {
        // Format email html layout
        const formattedBody = emailBody
          .split('\n\n')
          .map(p => `<p style="margin: 0 0 12px; line-height: 1.6; color: #3E5E63;">${p.replace(/\n/g, '<br />')}</p>`)
          .join('');

        const htmlContent = `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FDF5DA; padding: 25px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1.5px solid #ffd94c;">
  <div style="background-color: #15333B; padding: 15px; border-radius: 12px 12px 0 0; text-align: center; border-bottom: 4px solid #ffd94c;">
    <h1 style="color: #ffd94c; margin: 0; font-size: 18px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">
      🦜 VẸT LẮM MỒM - THE1IGHT 🦜
    </h1>
  </div>
  <div style="background-color: #ffffff; padding: 25px; border-radius: 0 0 12px 12px; border-top: none; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
    <h2 style="color: #214C54; margin-top: 0; font-size: 15px; font-weight: 800; border-bottom: 2px solid #F0F0F0; padding-bottom: 8px;">
      ${emailSubject}
    </h2>
    ${formattedBody}
    <div style="margin-top: 25px; padding-top: 15px; border-top: 2px solid #F0F0F0; text-align: center;">
      <a href="https://lightms.pages.dev" style="display: inline-block; background-color: #214C54; color: #ffffff; padding: 8px 18px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 11px; box-shadow: 0 2px 4px rgba(33,76,84,0.2);">
        VÀO HỆ THỐNG LIGHTMS 🚀
      </a>
    </div>
  </div>
  <div style="text-align: center; margin-top: 12px; font-size: 9px; color: #3E5E63; font-weight: 600;">
    Bản tin tự động được gửi từ hạm đội vận hành LightMS.
  </div>
</div>
        `.trim();

        // Reroute logic to owner's email for testing/unverified Resend account limitations
        const targetEmail = studentGmail.toLowerCase() === verifiedEmail.toLowerCase() 
          ? studentGmail 
          : verifiedEmail;
        
        const subjectHeader = studentGmail.toLowerCase() === verifiedEmail.toLowerCase()
          ? emailSubject
          : `[TEST gửi tới: ${studentGmail}] ${emailSubject}`;

        // Send via Resend
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: "Vẹt Lắm Mồm <onboarding@resend.dev>",
            to: targetEmail,
            subject: subjectHeader,
            html: htmlContent
          })
        });

        const resText = await res.text();
        if (res.ok) {
          sentEmails.push({ student: fullName, email: studentGmail, status: "sent" });
        } else {
          console.error(`Failed to send email to ${studentGmail}:`, resText);
          sentEmails.push({ student: fullName, email: studentGmail, status: "failed", error: resText });
        }
      }
    }

    return new Response(JSON.stringify({ message: `Automated processing for ${type} complete.`, processedCount: sentEmails.length, logs: sentEmails }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
})
