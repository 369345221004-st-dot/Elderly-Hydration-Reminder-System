<template>
  <div class="page-container">
    <Panel>
      <template #header>
        <div class="header-title">
          <span class="header-icon">💧</span>
          <span>ตัวเลือกบันทึกปริมาณน้ำ</span>
        </div>
      </template>

      <!-- ส่วนแจ้งเตือนด้านบน (แสดงทั้งกล่องแจ้งเตือนบันทึก และกล่องฉลองเมื่อดื่มครบ) -->
      <div class="status-alerts-container">
        <!-- กล่องแจ้งเตือนระฆัง (แสดงเมื่อกดบันทึกน้ำ) -->
        <transition name="fade">
          <div class="alert-card" aria-live="polite" v-if="alertMessage">
            <span class="status-icon">🔔</span>
            <p class="alert-text">{{ alertMessage }}</p>
          </div>
        </transition>

        <!-- กล่องแจ้งเตือนยินดีฉลองเมื่อดื่มครบเป้าหมาย (ย้ายมาไว้ด้านบน) -->
        <transition name="fade">
          <div class="notice-card" role="status" aria-live="polite" v-if="notice">
            <span class="status-icon">🎉</span>
            <p class="notice-text">{{ notice }}</p>
          </div>
        </transition>
      </div>

      <!-- ตารางการ์ดตัวเลือกน้ำ -->
      <div class="water-grid">
        <WaterOptionCard
          v-for="item in waterOptions"
          :key="item.id"
          :id="item.id"
          :title="item.title"
          :amount="item.amount"
          :icon="item.icon"
          :desc="item.desc"
          @record="addWater"
        />
      </div>

      <!-- ส่วนปุ่มนำทางด้านล่าง -->
      <template #footer>
        <div class="footer-status">
          <!-- ปุ่มดูสรุปผลประจำวัน -->
          <router-link to="/summary" class="summary-btn">
            <span>ดูสรุปผลประจำวัน</span>
            <span class="arrow">→</span>
          </router-link>
        </div>
      </template>
    </Panel>
  </div>
</template>

<script setup>
import Panel from '../components/Panel.vue';
import WaterOptionCard from '../components/WaterOptionCard.vue';
import { waterOptions, alertMessage, notice, addWater } from '../store.js';
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700;800&family=Sarabun:wght@400;600;700;800&display=swap');

/* คอนเทนเนอร์หลัก */
.page-container {
  width: 100%;
  max-width: 1000px;
  margin: 24px auto;
  padding: 0 20px;
  box-sizing: border-box;
  font-family: 'Prompt', 'Sarabun', system-ui, sans-serif;
  color: #020617;
}

/* Header Inside Panel */
.header-title {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 32px;
  font-weight: 800;
  color: #ffffff;
}

.header-icon {
  font-size: 38px;
}

/* คอนเทนเนอร์รวมกล่องแจ้งเตือนด้านบน */
.status-alerts-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
  margin-bottom: 20px;
}

/* กล่องแจ้งเตือนความจำ */
.alert-card {
  width: 100%;
  background-color: #f0f9ff;
  border: 3px solid #38bdf8;
  border-radius: 20px;
  padding: 22px 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  box-sizing: border-box;
}

.alert-text {
  font-size: 26px;
  color: #0369a1;
  font-weight: 800;
  margin: 0;
  line-height: 1.5;
}

/* กล่องแจ้งเตือนพิเศษ (เมื่อดื่มครบ) */
.notice-card {
  width: 100%;
  background-color: #f0fdf4;
  border: 3px solid #22c55e;
  border-radius: 20px;
  padding: 22px 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  box-sizing: border-box;
}

.notice-text {
  font-size: 26px;
  color: #14532d;
  font-weight: 800;
  margin: 0;
  line-height: 1.5;
}

.status-icon {
  font-size: 40px;
  flex-shrink: 0;
}

/* ตารางแสดงตัวเลือกการดื่มน้ำ */
.water-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  padding: 8px 0 20px 0;
}

/* ส่วนล่าง Footer Status */
.footer-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 16px 0;
}

/* ปุ่มดูสรุปผลประจำวัน */
.summary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  width: 100%;
  max-width: 460px;
  height: 72px;
  margin-top: 12px;
  padding: 0 32px;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: #ffffff;
  font-size: 26px;
  font-weight: 800;
  border-radius: 20px;
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(2, 132, 199, 0.4);
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.summary-btn:hover {
  background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
  transform: translateY(-2px);
}

.arrow {
  font-size: 32px;
}

/* Transition เอฟเฟกต์ */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Responsive สำหรับมือถือ */
@media (max-width: 600px) {
  .page-container {
    padding: 0 12px;
  }

  .header-title {
    font-size: 26px;
  }

  .alert-text,
  .notice-text {
    font-size: 22px;
  }

  .summary-btn {
    max-width: 100%;
    height: 64px;
    font-size: 24px;
  }
}
</style>