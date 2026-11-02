<template>
  <div class="summary-container">
    <Panel>
      <template #header>
        <div class="header-title">
          <span class="header-icon">📊</span>
          <span>สรุปผลการดื่มน้ำประจำวัน</span>
        </div>
      </template>

      <div class="summary-body">
        <!-- ตัวเลขแสดงผลขนาดใหญ่ -->
        <section class="stat-hero-card" aria-label="สรุปยอดน้ำดื่ม">
          <span class="stat-caption">ปริมาณน้ำที่ดื่มได้วันนี้</span>
          <div class="water-stat">
            <span class="current-amount">{{ totalWater.toLocaleString() }}</span>
            <span class="divider">/</span>
            <span class="goal-amount">{{ dailyGoal.toLocaleString() }} <small>ml</small></span>
          </div>
        </section>

        <!-- แถบความคืบหน้า (Progress Bar) -->
        <section class="progress-section" aria-label="ความก้าวหน้าสู่เป้าหมาย">
          <div class="progress-label">
            <span>🎯 ความคืบหน้าสู่เป้าหมาย</span>
            <span class="percent-badge">{{ progressPercentage }}%</span>
          </div>
          <div class="progress-bar-bg">
            <div 
              class="progress-bar-fill" 
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
        </section>

        <!-- ข้อความแจ้งเตือน / คำแนะนำ -->
        <div class="status-message">
          <p v-if="notice" class="notice-alert" role="status" aria-live="polite">🎉 {{ notice }}</p>
          <p v-else class="remaining-info">
            💧 ขาดอีก <strong>{{ dailyGoal - totalWater > 0 ? (dailyGoal - totalWater).toLocaleString() : 0 }}</strong> ml จะถึงเป้าหมายประจำวัน!
          </p>
        </div>

        <hr class="divider-line" />

        <!-- ส่วนแสดงประวัติการดื่มน้ำ -->
        <section class="history-section">
          <h2>📜 ประวัติการดื่มน้ำทั้งหมด</h2>

          <!-- 1) กำลังโหลด -->
          <div v-if="loading" class="state-box">
            <p class="state-msg">⏳ กำลังโหลดข้อมูลประวัติ...</p>
          </div>

          <!-- 2) แสดงข้อความผิดพลาด -->
          <div v-else-if="errorMsg" class="state-box alert-error">
            <p class="error-msg">⚠️ {{ errorMsg }}</p>
          </div>

          <!-- 3) ไม่มีประวัติ -->
          <div v-else-if="waterLogs.length === 0" class="state-box">
            <p class="state-msg">ยังไม่มีประวัติการดื่มน้ำในวันนี้</p>
          </div>

          <!-- 4) รายการประวัติ -->
          <ul v-else class="history-list">
            <li v-for="log in waterLogs" :key="log.id" class="history-item">
              <div class="drink-info">
                <span class="drink-icon">🥛</span>
                <span class="drink-title">{{ log.drink_option }}</span>
              </div>
              <div class="drink-meta">
                <span class="drink-amount">+{{ log.amount }} ml</span>
                <span class="drink-time">
                  {{ new Date(log.created_at).toLocaleString('th-TH', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }) }}
                </span>
              </div>
            </li>
          </ul>
        </section>
      </div>

      <template #footer>
        <div class="button-group">
          <button class="btn-continue" @click="router.push('/water')">
            ← บันทึกการดื่มน้ำต่อ
          </button>
          <button class="btn-reset" @click="resetWater">
            🔄 เริ่มต้นบันทึกใหม่
          </button>
        </div>
      </template>
    </Panel>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Panel from '../components/Panel.vue';
import {
  totalWater,
  dailyGoal,
  progressPercentage,
  notice,
  waterLogs,
  loading,
  errorMsg,
  resetWater
} from '../store.js';

const router = useRouter();
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700;800&family=Sarabun:wght@400;600;700&display=swap');

/* คอนเทนเนอร์หลัก ปรับความกว้าง 900px พอดีกับ Navbar */
.summary-container {
  width: 100%;
  max-width: 900px;
  margin: 20px auto;
  padding: 0 20px;
  box-sizing: border-box;
  font-family: 'Prompt', 'Sarabun', system-ui, sans-serif;
  color: #0f172a;
}

/* Header Inside Panel */
.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
}

.summary-body {
  padding: 10px 0;
}

/* การ์ดเน้นตัวเลขยอดน้ำสรุป */
.stat-hero-card {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px solid #bae6fd;
  border-radius: 20px;
  padding: 24px;
  text-align: center;
  margin-bottom: 24px;
}

.stat-caption {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #0369a1;
  margin-bottom: 8px;
}

.water-stat {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 12px;
}

.current-amount {
  font-size: 3.5rem;
  font-weight: 800;
  color: #0284c7;
  line-height: 1;
}

.divider {
  font-size: 2.2rem;
  color: #94a3b8;
  font-weight: 400;
}

.goal-amount {
  font-size: 1.8rem;
  font-weight: 700;
  color: #475569;
}

.goal-amount small {
  font-size: 1.2rem;
  color: #64748b;
}

/* Progress Bar Custom Styles */
.progress-section {
  background-color: #f8fafc;
  padding: 20px;
  border-radius: 18px;
  border: 2px solid #e2e8f0;
  margin-bottom: 20px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-weight: 700;
  color: #1e293b;
  font-size: 1.15rem;
}

.percent-badge {
  background-color: #0284c7;
  color: #ffffff;
  padding: 4px 14px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 1.1rem;
}

.progress-bar-bg {
  width: 100%;
  height: 22px;
  background-color: #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #0284c7);
  border-radius: 12px;
  transition: width 0.5s ease-out;
}

/* ข้อความสถานะ */
.status-message {
  text-align: center;
  margin: 18px 0;
}

.remaining-info {
  font-size: 1.2rem;
  color: #334155;
  margin: 0;
  font-weight: 500;
}

.remaining-info strong {
  color: #0284c7;
  font-size: 1.4rem;
  font-weight: 800;
}

.notice-alert {
  color: #16a34a;
  font-weight: 800;
  font-size: 1.3rem;
  background: #f0fdf4;
  border: 2px solid #bbf7d0;
  padding: 12px 20px;
  border-radius: 14px;
  margin: 0;
  display: inline-block;
}

.divider-line {
  margin: 28px 0;
  border: 0;
  border-top: 2px dashed #e2e8f0;
}

/* ส่วนประวัติการดื่มน้ำ */
.history-section {
  text-align: left;
}

.history-section h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 16px 0;
}

.state-box {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  padding: 24px;
  text-align: center;
}

.state-box.alert-error {
  background: #fff1f2;
  border-color: #fecdd3;
}

.state-msg {
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.error-msg {
  color: #be123c;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
}

/* ลิสต์ประวัติ */
.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: #ffffff;
  border-radius: 14px;
  border: 2px solid #e2e8f0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
}

.drink-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.drink-icon {
  font-size: 24px;
}

.drink-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
}

.drink-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.drink-amount {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0284c7;
}

.drink-time {
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 500;
}

/* ปุ่มกดด้านล่าง */
.button-group {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 6px 0;
}

.btn-continue {
  background-color: #0284c7;
  color: #ffffff;
  border: none;
  padding: 14px 28px;
  border-radius: 14px;
  font-size: 1.15rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
}

.btn-continue:hover {
  background-color: #0369a1;
  transform: translateY(-1px);
}

.btn-reset {
  background-color: #f1f5f9;
  color: #475569;
  border: 2px solid #cbd5e1;
  padding: 14px 24px;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-reset:hover {
  background-color: #e2e8f0;
  color: #0f172a;
}

/* Responsive สำหรับมือถือ */
@media (max-width: 600px) {
  .summary-container {
    padding: 0 10px;
  }

  .current-amount {
    font-size: 2.8rem;
  }

  .goal-amount {
    font-size: 1.4rem;
  }

  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .drink-meta {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f1f5f9;
    padding-top: 8px;
  }

  .button-group {
    flex-direction: column;
  }

  .btn-continue, .btn-reset {
    width: 100%;
  }
}
</style>