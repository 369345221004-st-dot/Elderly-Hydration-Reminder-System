// src/supabase.js - ตัวเชื่อมต่อฐานข้อมูลระบบติดตามและแจ้งเตือนการดื่มน้ำ
import { createClient } from '@supabase/supabase-js';

// อ่านค่า URL และ Key จากไฟล์ .env.local (สำหรับ Vite)
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_KEY;

// สร้าง Supabase Client กลางสำหรับดึง/บันทึกข้อมูล water_logs และจัดการ Realtime
export const supabase = createClient(url, key);