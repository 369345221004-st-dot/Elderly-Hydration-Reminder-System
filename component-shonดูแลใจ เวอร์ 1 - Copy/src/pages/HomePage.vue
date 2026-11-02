<template>
  <div class="home-container">
    <main class="hero-card">
      <!-- ไอคอนและหัวข้อหลัก -->
      <header class="header-section">
        <div class="icon-bounce" aria-hidden="true">
          <span>💧</span>
        </div>
        <h1>ระบบแจ้งเตือนการดื่มน้ำ</h1>
        <p class="subtitle">เพื่อสุขภาพที่ดี ดื่มน้ำให้เพียงพอในทุกๆ วันนะครับ</p>
      </header>

      <!-- การ์ดแสดงเป้าหมายและความก้าวหน้า -->
      <section class="goal-card">
        <div class="goal-header">
          <span class="goal-title">🎯 เป้าหมายการดื่มน้ำวันนี้</span>
          <span class="goal-percentage">{{ progressPercent }}%</span>
        </div>

        <!-- แถบแสดงความก้าวหน้า (Progress Bar) -->
        <div class="progress-bar-container" title="ความก้าวหน้าการดื่มน้ำ">
          <div 
            class="progress-bar-fill" 
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>

        <!-- ตัวเลขแสดงผล -->
        <div class="goal-box">
          <div class="goal-item">
            <span class="label">ดื่มไปแล้ว</span>
            <span class="value highlight">{{ totalWater.toLocaleString() }} <small>ml</small></span>
          </div>
          <div class="goal-divider"></div>
          <div class="goal-item">
            <span class="label">เป้าหมายทั้งหมด</span>
            <span class="value">{{ dailyGoal.toLocaleString() }} <small>ml</small></span>
          </div>
        </div>
      </section>

      <!-- ปุ่มกดนำทางขนาดใหญ่ -->
      <nav class="button-group" aria-label="เมนูหลัก">
        <router-link to="/water" class="cta-button primary">
          <span class="btn-icon">🥛</span>
          <span class="btn-text">บันทึกการดื่มน้ำ</span>
        </router-link>
        <router-link to="/summary" class="cta-button secondary">
          <span class="btn-icon">📊</span>
          <span class="btn-text">ดูสรุปผลประจำวัน</span>
        </router-link>
      </nav>

      <!-- 🧪 ชั่วคราว: ทดสอบ RLS -->
      <footer class="test-rls-box">
        <button @click="tryInsert" class="btn-test">
          🧪 ทดสอบเพิ่มข้อมูลโดยไม่ผ่านหลังบ้าน (RLS)
        </button>
        <p v-if="testMsg" role="status" class="test-msg">{{ testMsg }}</p>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { totalWater, dailyGoal, addWaterLog } from '../store.js';

const testMsg = ref('');

// คำนวณเปอร์เซ็นต์การดื่มน้ำ (ไม่เกิน 100%)
const progressPercent = computed(() => {
  if (!dailyGoal.value || dailyGoal.value <= 0) return 0;
  const percent = Math.round((totalWater.value / dailyGoal.value) * 100);
  return Math.min(percent, 100);
});

async function tryInsert() {
  const problem = await addWaterLog({ drink_option: 'ทดสอบ RLS', amount: 1 });
  testMsg.value = problem
    ? '🛡️ ฐานข้อมูลปฏิเสธ: ' + problem
    : '⚠️ เพิ่มได้ — ถ้ายืนยันยังไม่ได้ล็อกอิน แปลว่ากฎ RLS ยังไม่ทำงาน';
}
</script>

<style scoped>
/* นำเข้าฟอนต์ภาษาไทยสำหรับผู้สูงอายุ อ่านง่าย ชัดเจน */
@import url('https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700;800&family=Sarabun:wght@400;600;700&display=swap');

.home-container {
  max-width: 600px;
  margin: 24px auto;
  padding: 0 16px;
  font-family: 'Prompt', 'Sarabun', system-ui, sans-serif;
  color: #0f172a;
}

/* การ์ดหลัก */
.hero-card {
  background: #ffffff;
  border-radius: 28px;
  padding: 40px 28px;
  text-align: center;
  box-shadow: 0 20px 40px -15px rgba(2, 132, 199, 0.12),
              0 0 15px rgba(0, 0, 0, 0.02);
  border: 2px solid #e0f2fe;
}

/* ส่วนหัว */
.header-section {
  margin-bottom: 28px;
}

.icon-bounce {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  border-radius: 30px;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.8);
}

.icon-bounce span {
  font-size: 52px;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

h1 {
  font-size: 30px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 10px 0;
  line-height: 1.3;
}

.subtitle {
  font-size: 18px;
  color: #475569;
  line-height: 1.5;
  margin: 0;
  font-weight: 500;
}

/* การ์ดแสดงเป้าหมาย */
.goal-card {
  background-color: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 32px;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.goal-percentage {
  color: #0284c7;
  font-size: 20px;
}

/* แถบความก้าวหน้า */
.progress-bar-container {
  width: 100%;
  height: 18px;
  background-color: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8 0%, #0284c7 100%);
  border-radius: 10px;
  transition: width 0.5s ease-out;
}

/* ตัวเลขสรุป */
.goal-box {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 8px;
}

.goal-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.goal-item .label {
  font-size: 16px;
  color: #64748b;
  font-weight: 600;
}

.goal-item .value {
  font-size: 28px;
  font-weight: 800;
  color: #334155;
}

.goal-item .value small {
  font-size: 16px;
  font-weight: 600;
  color: #64748b;
}

.goal-item .value.highlight {
  color: #0284c7;
}

.goal-divider {
  width: 2px;
  height: 48px;
  background-color: #cbd5e1;
}

/* ปุ่มนำทาง */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cta-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 64px;
  border-radius: 18px;
  text-decoration: none;
  font-size: 20px;
  font-weight: 700;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
}

.btn-icon {
  font-size: 26px;
}

.cta-button.primary {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: #ffffff;
  box-shadow: 0 8px 20px -4px rgba(2, 132, 199, 0.4);
}

.cta-button.primary:hover {
  background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -4px rgba(2, 132, 199, 0.5);
}

.cta-button.secondary {
  background-color: #e0f2fe;
  color: #0369a1;
  border: 2px solid #bae6fd;
}

.cta-button.secondary:hover {
  background-color: #bae6fd;
  transform: translateY(-2px);
}

.cta-button:active {
  transform: translateY(0);
}

/* ส่วนทดสอบ RLS */
.test-rls-box {
  margin-top: 36px;
  padding: 16px;
  background-color: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 14px;
}

.btn-test {
  padding: 10px 18px;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  color: #475569;
  transition: all 0.2s ease;
}

.btn-test:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.test-msg {
  margin: 12px 0 0 0;
  font-size: 15px;
  font-weight: 600;
  color: #0284c7;
  line-height: 1.4;
}

/* รองรับมือถือ */
@media (max-width: 480px) {
  .hero-card {
    padding: 32px 20px;
    border-radius: 24px;
  }

  h1 {
    font-size: 24px;
  }

  .subtitle {
    font-size: 16px;
  }

  .goal-item .value {
    font-size: 22px;
  }

  .cta-button {
    height: 58px;
    font-size: 18px;
  }
}
</style>