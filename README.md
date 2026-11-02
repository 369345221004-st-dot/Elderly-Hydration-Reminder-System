# ชื่อโปรเจกต์ ระบบการแจ้งเตือนการดื่มน้ำ สำหรับผู้สูงอายุ

ทีม: ชื่อทีม · สมาชิก: ขวัญชนก มาคงกุล (รหัสนักศึกษา 369345221004) ธนัชชา เผือกวงษ์ (รหัสนักศึกษา 369345221016)

ลิงก์ระบบ: https://splendorous-pika-77940e.netlify.app/

## ปัญหาและกลุ่มเป้าหมาย "ผู้สูงอายุและผู้ป่วยโรคเรื้อรังมักลืมดื่มน้ำตามเวลา หรือดื่มน้ำไม่เพียงพอต่อความต้องการของร่างกายในแต่ละวัน ระบบนี้จึงถูกพัฒนาขึ้นเพื่อช่วยแจ้งเตือน ติดตามประวัติการดื่มน้ำ และแสดงผลรายงานสรุปปริมาณการดื่มน้ำประจำวัน"

## ฟีเจอร์หลักและขั้นตอนทดสอบ 
ตั้งเป้าหมายและติดตามการดื่มน้ำประจำวัน (Daily Hydration Goal Tracking)
- กำหนดเป้าหมายการดื่มน้ำรวมต่อวัน (เช่น 2,000 มล.)   
- แสดงแถบความคืบหน้า (Progress Bar) คิดเป็นเปอร์เซ็นต์   
- คำนวณปริมาณน้ำที่ดื่มไปแล้ว และปริมาณน้ำที่ยังต้องดื่มเพิ่มให้ครบเป้าหมาย   
บันทึกปริมาณน้ำตามขนาดภาชนะ (Quick Water Intake Logging)
- มีตัวเลือกขนาดน้ำให้กดบันทึกได้สะดวก:   
  - น้ำ 1 แก้วเล็ก: +250 มล.   
  - น้ำ 1 แก้วปานกลาง: +480 มล.   
  - น้ำ 1 ขวดเล็ก: +500 มล.   
  - น้ำ 1 แก้วใหญ่: +750 มล.   
- หน้าดูรายละเอียดเพิ่มเติมของแต่ละตัวเลือกก่อนกดบันทึก   
สรุปผลและประวัติการดื่มน้ำ (Summary & History Logs)
- สรุปผลการดื่มน้ำประจำวัน   
- แสดงรายการประวัติการดื่มน้ำย้อนหลัง พร้อมระบุขนาดแก้ว ปริมาณน้ำ และเวลาที่กดบันทึก (Time-stamp)   
- มีฟังก์ชัน "เริ่มบันทึกใหม่" เพื่อรีเซ็ตข้อมูลวันใหม่   
ระบบบัญชีผู้ใช้และการเข้าสู่ระบบ (User Authentication)
- มีปุ่มสำหรับ "เข้าสู่ระบบ" เพื่อใช้งานส่วนบุคคล   
- รองรับฟังก์ชันทดสอบเพิ่มข้อมูลแบบไม่ผ่านหลังบ้าน (RLS) สำหรับนักพัฒนาหรือทดสอบระบบ   
ออกแบบเพื่อผู้สูงอายุ (Elderly-Friendly UI/UX)
- ตัวหนังสือขนาดใหญ่ อ่านง่าย มองเห็นชัดเจน   
- ปุ่มกดขนาดใหญ่ มีสีสันแยกแยะชัดเจน สะดวกต่อการใช้งาน

## เทคโนโลยีที่ใช้ 
- Vue.js 3 (Composition API / Vue Router)
- Supabase (Database & Real-time Subscriptions & RLS)
- Vite (Frontend Build Tool)

## วิธีติดตั้งและรัน
1. ติดตั้ง Node.js รุ่น LTS
2. คัดลอก .env.example เป็น .env.local แล้วใส่ค่า VITE_SUPABASE_URL และ VITE_SUPABASE_KEY
3. npm install
4. นำเข้าฐานข้อมูลจาก database/
5. npm run dev แล้วเปิด http://localhost:5173

## บัญชีทดสอบ (บัญชีเฉพาะส่งงาน )
username: test@gmail.com
password: 123456

## โครงสร้างโฟลเดอร์

water-reminder/
```text
├── .vscode/               # ไฟล์ตั้งค่า VS Code Editor
│   └── extensions.json    # ปลั๊กอินแนะนำของโปรเจกต์
├── public/                # ไฟล์สื่อ Static (ภาพ U1-U5, ไอคอน SVG, _redirects)
│   └── images/            # รูปภาพประกอบขนาดแก้ว/ขวดน้ำ (250ml, 500ml, 750ml, 1000ml,)
├── src/
│   ├── assets/            # ภาพโลโก้และสื่อ (hero.png, vite.svg, vue.svg)
│   ├── components/        # UI Components (HelloWorld.vue, Panel.vue, WaterOptionCard.vue)
│   ├── pages/             # หน้าเว็บหลัก (AdminPage, HomePage, ImpactPage, LoginPage, SummaryPage, WaterDetailPage, WaterTrackerPage)
│   ├── router/            # การจัดการเส้นทาง Vue Router
│   │   └── index.js       # ไฟล์กำหนดเส้นทางหลัก
│   ├── App.vue            # Component หลักของแอป
│   ├── main.js            # จุดเริ่มต้นการทำงานหลัก (Entry Point)
│   ├── store.js           # ไฟล์จัดการ State Management
│   ├── style.css          # ไฟล์สไตล์หลัก (Global CSS)
│   └── supabase.js        # ไฟล์เชื่อมต่อบริการ Supabase Database
├── .env.example           # ตัวอย่างการตั้งค่า Environment Variables
├── .env.local             # ไฟล์เก็บค่า Environment Variables (API Keys)
├── .gitignore             # กำหนดไฟล์ที่ไม่ต้องการอัปโหลดขึ้น Git
├── index.html             # ไฟล์ HTML หลัก
├── package-lock.json      # ล็อกเวอร์ชันของ Dependencies
├── package.json           # รายการ Dependencies และคำสั่งรันโปรเจกต์
├── README.md              # เอกสารอธิบายโปรเจกต์
└── vite.config.js         # ไฟล์ตั้งค่าสำหรับ Build ด้วย Vite
