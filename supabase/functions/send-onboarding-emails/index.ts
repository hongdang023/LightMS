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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Fetch schedules that are active (scheduled_at <= NOW) and haven't sent email yet
    const now = new Date().toISOString();
    const { data: activeSchedules, error: scheduleError } = await supabase
      .from('onboarding_unlock_schedules')
      .select('*')
      .lte('scheduled_at', now)
      .eq('unlock_email_sent', false);

    if (scheduleError) {
      throw new Error(`Error fetching schedules: ${scheduleError.message}`);
    }

    if (!activeSchedules || activeSchedules.length === 0) {
      return new Response(JSON.stringify({ message: "No active schedules to process at this time." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // 2. Fetch student emails
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('gmail')
      .eq('role', 'student');

    if (profileError) {
      throw new Error(`Error fetching student profiles: ${profileError.message}`);
    }

    const studentEmails = profiles ? profiles.map((p) => p.gmail).filter(Boolean) : [];
    if (studentEmails.length === 0) {
      return new Response(JSON.stringify({ message: "No student emails found." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const results = [];

    // 3. For each active schedule, construct the email and send it via Resend
    for (const schedule of activeSchedules) {
      const dayNum = schedule.day;

      // Fetch the onboarding day content
      const { data: dayData, error: dayError } = await supabase
        .from('onboarding_days')
        .select('*')
        .eq('day', dayNum)
        .single();

      if (dayError || !dayData) {
        console.error(`Could not fetch data for day ${dayNum}:`, dayError?.message);
        continue;
      }

      // Construct email title and body (using saved values or default fallbacks)
      const subject = dayData.email_subject || `[The1ight] [Onboarding Week] Thử thách Ngày ${dayNum}: ${dayData.title}`;
      
      const defaultBody = `Kẹt kẹt... Alo alo! 🦜\n\nChào mừng bạn tới ngày học tiếp theo của Onboarding Week!\n\nHôm nay chúng ta sẽ bắt đầu Thử thách Ngày ${dayNum}: ${dayData.title}\n\n🎯 MỤC TIÊU:\n${dayData.objective}\n\n📝 NHIỆM VỤ:\n${dayData.checklist}\n\n✨ ĐIỀU RÚT RA (TAKEAWAY):\n${dayData.takeaway}\n\nHãy truy cập vào hệ thống LightMS để theo dõi chi tiết và cập nhật bài tập nhé!\n\nChúc các thủy thủ thuận buồm xuôi gió! ⛵⚓`;
      const bodyText = dayData.email_body || defaultBody;

      // Construct formatted HTML email
      const formattedBody = bodyText
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
      ${subject}
    </h2>
    ${formattedBody}
    <div style="margin-top: 25px; padding-top: 15px; border-top: 2px solid #F0F0F0; text-align: center;">
      <a href="https://lightms.pages.dev" style="display: inline-block; background-color: #214C54; color: #ffffff; padding: 8px 18px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 11px; box-shadow: 0 2px 4px rgba(33,76,84,0.2);">
        VÀO HỆ THỐNG LIGHTMS 🚀
      </a>
    </div>
  </div>
  <div style="text-align: center; margin-top: 12px; font-size: 9px; color: #3E5E63; font-weight: 600;">
    Bản tin được gửi từ hạm đội vận hành LightMS. Chúc các thủy thủ thuận buồm xuôi gió!
  </div>
</div>
      `.trim();

      // Send via Resend API
      // Since it's a test/free domain, we set the primary "to" as the owner's email, and all student emails in BCC
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: "Vẹt Lắm Mồm <onboarding@resend.dev>",
          to: "dangtuyethong2324@gmail.com",
          bcc: studentEmails,
          subject: subject,
          html: htmlContent
        })
      });

      const resText = await res.text();
      if (res.ok) {
        // Update database schedule status
        const { error: updateError } = await supabase
          .from('onboarding_unlock_schedules')
          .update({ unlock_email_sent: true })
          .eq('day', dayNum);
        
        if (updateError) {
          console.error(`Error updating schedule for day ${dayNum}:`, updateError.message);
        }

        results.push({ day: dayNum, status: "success", info: resText });
      } else {
        console.error(`Failed to send email for day ${dayNum} via Resend:`, resText);
        results.push({ day: dayNum, status: "failed", error: resText });
      }
    }

    return new Response(JSON.stringify({ results }), {
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
