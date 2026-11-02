<template>
  <div class="detail-container">
    <!-- 1) ยังโหลดไม่เสร็จ -> อย่าเพิ่งบอกว่า "ไม่พบรายการน้ำ" -->
    <p v-if="loading" role="status">⏳ กำลังโหลดข้อมูล...</p>

    <!-- 2) โหลดเสร็จแล้ว และพบข้อมูล -->
    <Panel v-else-if="option">
      <template #header>🔍 รายละเอียดแก้วน้ำ</template>

      <div class="detail-card">
        <!-- ไอคอนหรือรูปแก้วน้ำ -->
        <div class="icon-section">
          <span class="water-icon">{{ option.icon || '🥛' }}</span>
        </div>

        <!-- รายละเอียด -->
        <h1 class="item-title">{{ option.title }}</h1>
        <div class="amount-badge">+{{ option.amount }} มิลลิลิตร (ml)</div>
        <p class="description">{{ option.desc }}</p>


        <!-- ข้อความแจ้งเตือนสถานะเมื่อกดบันทึก -->
        <p v-if="notice" class="notice-text" role="status" aria-live="polite">
          🎉 {{ notice }}
        </p>


        <!-- ปุ่มกดบันทึก -->
        <button class="record-btn" @click="addWater(option)">
          💧 บันทึกการดื่มแก้วนี้
        </button>
      </div>

      <template #footer>
        <div class="footer-action">
          <router-link to="/water" class="back-link">
            ← กลับหน้ารายการดื่มน้ำ
          </router-link>
        </div>
      </template>
    </Panel>



    <!-- 3) โหลดเสร็จแล้ว แต่ไม่พบข้อมูลจริงๆ -->
    <div v-else class="not-found">
      <p>❌ ไม่พบข้อมูลรายการน้ำที่เลือก</p>
      <router-link to="/water" class="back-link">← กลับหน้ารายการดื่มน้ำ</router-link>

    </div>
  </div>
</template>



<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Panel from '../components/Panel.vue';
import { waterOptions, addWater, notice, loading } from '../store.js';



const route = useRoute();
const optionId = Number(route.params.id);



// ค้นหาข้อมูลแก้วน้ำตาม id จาก URL
const option = computed(() =>
  waterOptions.value ? waterOptions.value.find(item => item.id === optionId) : null
);

</script>


<style scoped>

.detail-container {
  max-width: 600px;
  margin: 30px auto;
  padding: 0 16px;
}

.detail-card {
  padding: 24px 16px;
  text-align: center;
}

.icon-section {
  margin-bottom: 12px;
}

.water-icon {
  font-size: 5rem;
  display: inline-block;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.item-title {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
}

.amount-badge {
  display: inline-block;
  background-color: #e0f2fe;
  color: #0284c7;
  font-size: 1.25rem;
  font-weight: 700;
  padding: 6px 18px;
  border-radius: 20px;
  margin-bottom: 16px;
}

.description {
  font-size: 1.1rem;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 24px;
}

.notice-text {
  color: #16a34a;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 16px;
  background-color: #f0fdf4;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #bbf7d0;
}

/* ปุ่มบันทึกการดื่ม */
.record-btn {
  width: 100%;
  max-width: 320px;
  background: linear-gradient(135deg, #0284c7, #0369a1);
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 14px 24px;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
  transition: all 0.2s;
}

.record-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(2, 132, 199, 0.4);
}

.record-btn:active {
  transform: scale(0.98);
}

/* ลิงก์ย้อนกลับ */
.footer-action {
  text-align: center;
  padding: 8px 0;
}

.back-link {
  color: #0284c7;
  font-weight: 600;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: #0369a1;
  text-decoration: underline;
}

.not-found {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 16px;
}
</style>

 