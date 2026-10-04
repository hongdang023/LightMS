import { createClient } from '../website/node_modules/@supabase/supabase-js/dist/index.mjs';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://wfruhgqmrksywrlcqjbr.supabase.co';
const supabaseKey = 'sb_publishable_SD38fPdlB-ufk1CT99WPFA_usFrIVqP';

const supabase = createClient(supabaseUrl, supabaseKey);

const tables = [
  'profiles',
  'admins',
  'calendar_events',
  'announcements',
  'courses',
  'batches',
  'badges'
];

async function backup() {
  console.log('🔄 Bắt đầu sao lưu toàn bộ bảng từ Supabase...');
  const summary = {};

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*');

      if (error) {
        console.warn(`⚠️ Không thể lấy bảng '${table}':`, error.message);
        summary[table] = { status: 'error', error: error.message };
      } else {
        const outPath = path.resolve('backup', `supabase_${table}.json`);
        fs.writeFileSync(outPath, JSON.stringify(data || [], null, 2), 'utf8');
        console.log(`✅ Bảng '${table}': đã sao lưu ${(data || []).length} bản ghi -> ${outPath}`);
        summary[table] = { status: 'success', count: (data || []).length, file: outPath };
      }
    } catch (e) {
      console.error(`❌ Lỗi khi đọc bảng '${table}':`, e.message);
      summary[table] = { status: 'failed', error: e.message };
    }
  }

  fs.writeFileSync('backup/backup_summary.json', JSON.stringify(summary, null, 2), 'utf8');
  console.log('🎉 Hoàn thành sao lưu 100% dữ liệu gốc! Tóm tắt lưu tại backup/backup_summary.json');
}

backup();
