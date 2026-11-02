<template>
  <div class="impact-container">
    <!-- 1. หัวข้อหลักของหน้า -->
    <h1 class="page-title">สรุปผลกระทบและการเก็บหลักฐาน (Impact)</h1>

    <!-- 2. กล่องสรุปสถิติ 2 ช่อง (สีฟ้า / สีเขียว) -->
    <div class="stats-wrapper">
      <div class="stats-grid">
        <div class="stat-box blue-box">
          <h3>จำนวนผู้ให้ฟีดแบ็กทั้งหมด</h3>
          <p class="stat-number">{{ totalCount }} <span class="unit">คน</span></p>
        </div>
        <div class="stat-box green-box">
          <h3>จำนวนคนที่ยินยอมให้เผยแพร่</h3>
          <p class="stat-number">{{ consentCount }} <span class="unit">คน</span></p>
        </div>
      </div>
    </div>

    <!-- 3. หัวข้อรอง พร้อมเส้นแบ่งแนวนอน -->
    <div class="section-header">
      <h2 class="section-title">ความคิดเห็นจากผู้ใช้งาน (User Quotes & Proofs)</h2>
    </div>

    <!-- 4. Grid แสดงการ์ดผลกระทบ -->
    <div class="cards-grid">
      <div 
        v-for="item in impactList" 
        :key="item.id" 
        class="card-item"
      >
        <!-- ส่วนรูปภาพหลักฐานด้านบนการ์ด -->
        <div class="image-container">
          <img 
            v-if="!imageErrorState[item.id]"
            :src="`/${item.user_code}.jpg`" 
            :alt="`รูปภาพหลักฐาน (${item.user_code})`"
            class="proof-image"
            @error="handleImageError(item.id)"
          />
          <div v-else class="image-placeholder">
            <span>รูปภาพหลักฐาน ({{ item.user_code }})</span>
          </div>
        </div>

        <!-- รายละเอียดใต้รูปภาพ -->
        <div class="card-body">
          <div class="info-header">
            <div class="user-code-box">
              <span class="label">รหัส:</span>
              <span class="code">{{ item.user_code }}</span>
            </div>
            
            <!-- 🟢 เพิ่ม Dynamic Class: ถ้ามีคำว่า 'ไม่ยินยอม' จะติดคลาสสีแดง is-danger อัตโนมัติ -->
            <div 
              v-if="item.consent" 
              class="consent-badge"
              :class="{ 'is-danger': item.consent.includes('ไม่ยินยอม') }"
            >
              {{ item.consent }}
            </div>
          </div>
          
          <div class="quote-box" v-if="item.quote">
            <p class="quote-text">"{{ item.quote }}"</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { supabase } from '../supabase.js'

const totalCount = ref(0)
const consentCount = ref(0)
const impactList = ref([])

// เก็บสถานะว่ารูปของ item.id ไหนโหลดไม่ผ่านบ้าง
const imageErrorState = reactive({})

// ดึงข้อมูลจาก Supabase
const fetchImpactData = async () => {
  try {
    const { data, error, count } = await supabase
      .from('impact_log')
      .select('*', { count: 'exact' })

    if (error) throw error

    totalCount.value = count || 0
    impactList.value = data || []
    
    // 🟢 นับเฉพาะรายการที่ยินยอม (ไม่นับคนที่ 'ไม่ยินยอม')
    consentCount.value = data 
      ? data.filter(item => item.consent && !item.consent.includes('ไม่ยินยอม')).length 
      : 0
  } catch (err) {
    console.error('Error fetching impact data:', err.message)
  }
}

// เมื่อรูปภาพขึ้น error ให้ปรับสถานะ id นั้นเป็น true
const handleImageError = (id) => {
  imageErrorState[id] = true
}

onMounted(() => {
  fetchImpactData()
})
</script>

<style scoped>
.impact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.25rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #334155;
}

/* หัวข้อใหญ่บนสุด สำหรับผู้สูงอายุ */
.page-title {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 2rem;
  line-height: 1.3;
}

/* การจัดวางสถิติ 2 ช่องตรงกลาง */
.stats-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 2.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  width: 100%;
  max-width: 620px;
}

.stat-box {
  border-radius: 16px;
  padding: 1.25rem 1rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.stat-box h3 {
  font-size: 1.05rem;
  margin: 0 0 0.4rem 0;
  font-weight: 700;
  line-height: 1.35;
}

.stat-number {
  font-size: 2.75rem;
  font-weight: 800;
  margin: 0;
  line-height: 1;
}

.stat-number .unit {
  font-size: 1.3rem;
  font-weight: 600;
}

/* สไตล์กล่องสถิติสีฟ้า (ด้านซ้าย) */
.blue-box {
  background-color: #f0f7ff;
  border: 1.5px solid #bfdbfe;
}
.blue-box h3 {
  color: #2563eb;
}
.blue-box .stat-number {
  color: #1d4ed8;
}

/* สไตล์กล่องสถิติสีเขียว (ด้านขวา) */
.green-box {
  background-color: #f0fdf4;
  border: 1.5px solid #bbf7d0;
}
.green-box h3 {
  color: #16a34a;
}
.green-box .stat-number {
  color: #15803d;
}

/* หัวข้อความคิดเห็นและเส้นคั่น */
.section-header {
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.85rem;
  margin-bottom: 2rem;
  text-align: center;
}

.section-title {
  font-size: 1.45rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

/* Grid แสดงการ์ด 3 คอลัมน์ */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 1.5rem;
}

.card-item {
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  padding: 12px;
}

/* ส่วนกรอบใส่รูปภาพ */
.image-container {
  width: 100%;
  height: 200px;
  background-color: #f8fafc;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.proof-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

/* กล่องข้อความแสดงเมื่อไม่มีรูปภาพ */
.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 1.05rem;
  font-weight: 600;
  background-color: #f1f5f9;
  padding: 0.75rem;
  text-align: center;
}

/* เนื้อหาใต้รูปภาพ */
.card-body {
  padding: 0.85rem 0.35rem 0.35rem 0.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  flex: 1;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.user-code-box {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
}

.user-code-box .label {
  font-size: 1.05rem;
  font-weight: 700;
  color: #475569;
}

.user-code-box .code {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
}

/* 🟢 ป้ายยินยอมปกติ (สีเขียว) */
.consent-badge {
  font-size: 0.825rem;
  font-weight: 700;
  color: #15803d;
  background-color: #f0fdf4;
  border: 1.5px solid #86efac;
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  text-align: center;
  white-space: nowrap;
  line-height: 1.2;
}

/* 🔴 สไตล์ป้ายเมื่อมีคำว่า 'ไม่ยินยอม' (สีแดงอัตโนมัติ) */
.consent-badge.is-danger {
  color: #b91c1c;
  background-color: #fef2f2;
  border-color: #fca5a5;
}

/* กล่องคำพูด Quote */
.quote-box {
  border-left: 4px solid #3b82f6;
  padding-left: 0.75rem;
  margin-top: 0.25rem;
}

.quote-text {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 500;
  color: #334155;
  line-height: 1.55;
  word-break: break-word;
}
</style>