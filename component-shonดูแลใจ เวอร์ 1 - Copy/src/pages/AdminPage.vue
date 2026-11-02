<template>
  <div class="page-container">
    <Panel>
      <template #header>
        <div class="header-title">
          <span class="header-icon">⚙️</span>
          <span>จัดการและบันทึกข้อมูลการดื่มน้ำ</span>
        </div>
      </template>

      <!-- สรุปภาพรวมแบบการ์ดเด่นชัด -->
      <section class="stat-grid" aria-label="สรุปภาพรวมการดื่มน้ำ">
        <div class="stat-card">
          <span class="stat-label">รายการบันทึกทั้งหมด</span>
          <span class="stat-value">{{ waterLogs.length }} <small>รายการ</small></span>
        </div>
        <div class="stat-card highlight">
          <span class="stat-label">ยอดน้ำสะสมตอนนี้</span>
          <span class="stat-value highlight-text">{{ totalWater.toLocaleString() }} <small>ml</small></span>
        </div>
      </section>

      <!-- แบบฟอร์มเพิ่มบันทึกใหม่ -->
      <section class="form-section">
        <h2>➕ เพิ่มรายการดื่มน้ำใหม่</h2>
        <form @submit.prevent="submitWaterLog" class="form-container">
          <div class="form-group">
            <label for="new-title">
              <span class="label-icon">🥛</span> ชนิดหรือตัวเลือกน้ำ
            </label>
            <input 
              id="new-title" 
              v-model.trim="newTitle" 
              placeholder="ตัวอย่าง: น้ำ 1 แก้วเล็ก" 
              required 
            />
          </div>

          <div class="form-group">
            <label for="new-amount">
              <span class="label-icon">💧</span> ปริมาณ (มิลลิลิตร / ml)
            </label>
            <input 
              id="new-amount" 
              v-model.number="newAmount" 
              type="number" 
              min="1" 
              placeholder="ตัวอย่าง: 250"
              required 
            />
          </div>

          <div class="form-group">
            <label for="new-image">
              <span class="label-icon">🖼️</span> ลิงก์รูปภาพ (ไม่บังคับ)
            </label>
            <input 
              id="new-image" 
              v-model.trim="newImage" 
              type="url" 
              placeholder="https://example.com/image.jpg" 
            />
          </div>

          <button type="submit" :disabled="saving" class="btn-submit">
            <span v-if="saving" class="spinner">⏳</span>
            <span>{{ saving ? 'กำลังบันทึกข้อมูล...' : '➕ เพิ่มรายการดื่มน้ำ' }}</span>
          </button>
        </form>

        <!-- ข้อความแจ้งเตือนผลการดำเนินงาน -->
        <transition name="fade">
          <div v-if="formMsg" role="status" aria-live="polite" class="alert-status">
            {{ formMsg }}
          </div>
        </transition>
      </section>

      <!-- รายการจัดการ (แสดงผลเป็นตารางสำหรับจอใหญ่ และเป็นการ์ดสำหรับมือถือ/ไอแพด) -->
      <section class="table-section">
        <h2>📋 จัดการรายการดื่มน้ำทั้งหมด</h2>
        
        <!-- 1. มุมมองตารางสำหรับคอมพิวเตอร์ (Desktop View) -->
        <div class="table-wrapper desktop-view">
          <table class="custom-table">
            <caption>ตารางแสดงรายการดื่มน้ำรวม {{ waterLogs.length }} รายการ</caption>
            <thead>
              <tr>
                <th scope="col" class="col-title">ชนิดน้ำ</th>
                <th scope="col" class="col-amount">ปริมาณ</th>
                <th scope="col" class="col-action text-center">ปุ่มจัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in waterLogs" :key="item.id">
                <td class="font-bold text-dark">{{ item.drink_option }}</td>
                <td>
                  <span class="badge-amount">{{ item.amount }} ml</span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button 
                      class="btn-action btn-add"
                      @click="changeAmount(item, 50)" 
                      :aria-label="'เพิ่มปริมาณ ' + item.drink_option + ' 50 ml'"
                    >
                      ➕ 50 ml
                    </button>
                    <button 
                      class="btn-action btn-sub"
                      @click="changeAmount(item, -50)" 
                      :disabled="item.amount <= 50" 
                      :aria-label="'ลดปริมาณ ' + item.drink_option + ' 50 ml'"
                    >
                      ➖ 50 ml
                    </button>
                    <button 
                      class="btn-action btn-edit"
                      @click="setAmount(item)" 
                      :aria-label="'ตั้งปริมาณ ' + item.drink_option"
                    >
                      ✏️ ระบุตัวเลข
                    </button>
                    <button 
                      class="btn-action btn-delete"
                      @click="removeLog(item)" 
                      :aria-label="'ลบ ' + item.drink_option"
                    >
                      🗑️ ลบรายการ
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="waterLogs.length === 0">
                <td colspan="3" class="empty-state">
                  ยังไม่มีรายการบันทึกการดื่มน้ำ
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 2. มุมมองการ์ดสำหรับมือถือและไอแพด (Mobile & Tablet View) -->
        <div class="mobile-card-list mobile-view">
          <div v-for="item in waterLogs" :key="'m-' + item.id" class="water-item-card">
            <div class="card-header-row">
              <span class="font-bold text-dark card-title-text">{{ item.drink_option }}</span>
              <span class="badge-amount">{{ item.amount }} ml</span>
            </div>
            <div class="card-action-grid">
              <button 
                class="btn-action btn-add"
                @click="changeAmount(item, 50)" 
                :aria-label="'เพิ่มปริมาณ ' + item.drink_option + ' 50 ml'"
              >
                ➕ 50 ml
              </button>
              <button 
                class="btn-action btn-sub"
                @click="changeAmount(item, -50)" 
                :disabled="item.amount <= 50" 
                :aria-label="'ลดปริมาณ ' + item.drink_option + ' 50 ml'"
              >
                ➖ 50 ml
              </button>
              <button 
                class="btn-action btn-edit"
                @click="setAmount(item)" 
                :aria-label="'ตั้งปริมาณ ' + item.drink_option"
              >
                ✏️ ระบุตัวเลข
              </button>
              <button 
                class="btn-action btn-delete"
                @click="removeLog(item)" 
                :aria-label="'ลบ ' + item.drink_option"
              >
                🗑️ ลบรายการ
              </button>
            </div>
          </div>
          <div v-if="waterLogs.length === 0" class="empty-state card-empty">
            ยังไม่มีรายการบันทึกการดื่มน้ำ
          </div>
        </div>
      </section>
    </Panel>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Panel from '../components/Panel.vue';
import { 
  waterLogs, 
  totalWater, 
  addWaterLog, 
  updateWaterLog, 
  deleteWaterLog 
} from '../store.js';

const newTitle = ref('');
const newAmount = ref(0);
const newImage = ref('');
const saving = ref(false);
const formMsg = ref('');

async function submitWaterLog() {
  saving.value = true;
  const problem = await addWaterLog({ 
    drink_option: newTitle.value, 
    amount: newAmount.value,
    image_url: newImage.value
  });
  saving.value = false;

  if (problem && problem.includes('row-level security')) {
    formMsg.value = `⚠️ บันทึกในแอปแล้ว (${newAmount.value} ml) *กรุณารัน SQL ปิด RLS ใน Supabase`;
  } else if (problem) {
    formMsg.value = '❌ บันทึกไม่สำเร็จ: ' + problem;
    return;
  } else {
    formMsg.value = `✅ เพิ่ม "${newTitle.value}" (${newAmount.value} ml) สำเร็จแล้ว`;
  }

  newTitle.value = '';
  newAmount.value = 0;
  newImage.value = '';
}

async function changeAmount(item, step) {
  const newAmount = item.amount + step;
  const problem = await updateWaterLog(item.id, newAmount);
  formMsg.value = problem 
    ? '❌ แก้ไม่สำเร็จ: ' + problem 
    : `✅ ${item.drink_option} ปริมาณใหม่ ${newAmount} ml`;
}

async function setAmount(item) {
  const text = prompt(`ปริมาณใหม่ของ ${item.drink_option} (ml)`, item.amount);
  if (text === null) return; 
  
  const newAmount = Number(text);
  if (!Number.isInteger(newAmount) || newAmount <= 0) {
    formMsg.value = '❌ ปริมาณน้ำต้องเป็นจำนวนเต็มตั้งแต่ 1 ขึ้นไป';
    return;
  }
  
  const problem = await updateWaterLog(item.id, newAmount);
  formMsg.value = problem 
    ? '❌ แก้ไม่สำเร็จ: ' + problem 
    : `✅ ${item.drink_option} ปริมาณใหม่ ${newAmount} ml`;
}

async function removeLog(item) {
  if (!confirm(`ลบ "${item.drink_option}" ออกจากรายการใช่ไหม?`)) return;
  const problem = await deleteWaterLog(item.id);
  formMsg.value = problem 
    ? '❌ ลบไม่สำเร็จ: ' + problem 
    : `🗑️ ลบ ${item.drink_option} แล้ว`;
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700;800&family=Sarabun:wght@400;600;700&display=swap');

/* คอนเทนเนอร์หลักความกว้างพอดี Navbar */
.page-container {
  width: 100%;
  max-width: 900px;
  margin: 20px auto;
  padding: 0 16px;
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
  font-weight: 800;
  color: #ffffff;
}

.header-icon {
  font-size: 24px;
}

/* Stat Cards */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}

.stat-card {
  background: #f8fafc;
  border: 2px solid #cbd5e1;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.stat-card.highlight {
  background: #f0f9ff;
  border-color: #7dd3fc;
}

.stat-label {
  font-size: 16px;
  color: #475569;
  font-weight: 700;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
}

.stat-value small {
  font-size: 16px;
  font-weight: 600;
  color: #64748b;
}

.highlight-text {
  color: #0284c7;
}

/* Section Styling */
.form-section, .table-section {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 2px dashed #cbd5e1;
}

h2 {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 16px 0;
}

/* Form Styling */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f8fafc;
  padding: 20px;
  border-radius: 16px;
  border: 2px solid #cbd5e1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 6px;
}

.label-icon {
  font-size: 20px;
}

input {
  width: 100%;
  height: 50px;
  padding: 0 14px;
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  background-color: #ffffff;
  border: 2px solid #94a3b8;
  border-radius: 10px;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

input::placeholder {
  color: #64748b;
  font-size: 16px;
  font-weight: 400;
}

input:focus {
  outline: none;
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.2);
}

.btn-submit {
  height: 54px;
  margin-top: 4px;
  background: #0284c7;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 19px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
  transition: all 0.2s ease;
}

.btn-submit:hover:not(:disabled) {
  background: #0369a1;
}

.btn-submit:disabled {
  background: #cbd5e1;
  box-shadow: none;
  cursor: not-allowed;
}

.alert-status {
  margin-top: 14px;
  padding: 14px;
  background: #f0f9ff;
  border: 2px solid #7dd3fc;
  border-radius: 10px;
  font-size: 17px;
  font-weight: 700;
  color: #0369a1;
  text-align: center;
}

/* Table Styling (Desktop) */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.custom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #ffffff;
  border: 2px solid #cbd5e1;
  border-radius: 14px;
  overflow: hidden;
}

caption {
  caption-side: top;
  text-align: left;
  font-size: 15px;
  color: #475569;
  font-weight: 600;
  margin-bottom: 6px;
}

th {
  background: #f1f5f9;
  color: #0f172a;
  font-size: 17px;
  font-weight: 800;
  padding: 12px;
  border-bottom: 2px solid #cbd5e1;
  text-align: left;
}

.col-title { width: 25%; }
.col-amount { width: 18%; }
.col-action { width: 57%; }

td {
  padding: 12px 10px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 17px;
  vertical-align: middle;
}

tr:last-child td {
  border-bottom: none;
}

.font-bold {
  font-weight: 800;
}

.text-dark {
  color: #0f172a;
}

.badge-amount {
  display: inline-block;
  padding: 4px 10px;
  background: #e0f2fe;
  color: #0284c7;
  font-weight: 800;
  border-radius: 16px;
  font-size: 15px;
  white-space: nowrap;
}

/* Action Buttons Grid (Desktop) */
.action-buttons {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
}

.btn-action {
  height: 38px;
  padding: 0 8px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  white-space: nowrap;
}

.btn-add {
  background: #f0fdf4;
  color: #15803d;
  border-color: #86efac;
}

.btn-add:hover {
  background: #dcfce7;
}

.btn-sub {
  background: #fefce8;
  color: #a16207;
  border-color: #fde047;
}

.btn-sub:hover:not(:disabled) {
  background: #fef9c3;
}

.btn-edit {
  background: #f1f5f9;
  color: #1e293b;
  border-color: #cbd5e1;
}

.btn-edit:hover {
  background: #e2e8f0;
}

.btn-delete {
  background: #fff1f2;
  color: #be123c;
  border-color: #fca5a5;
}

.btn-delete:hover {
  background: #ffe4e6;
}

.btn-action:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 24px !important;
  color: #64748b;
  font-size: 17px;
  font-weight: 600;
}

/* ควบคุมการแสดงผลสลับระหว่าง Desktop และ Mobile/Tablet */
.mobile-view {
  display: none;
}

/* Responsive design สำหรับมือถือและไอแพด (หน้าจอ <= 768px) */
@media (max-width: 768px) {
  .page-container {
    padding: 0 8px;
  }
  
  .stat-grid {
    grid-template-columns: 1fr;
  }

  /* ซ่อนตารางเดิม แล้วเปิดใช้งานการ์ดมือถือแทน */
  .desktop-view {
    display: none;
  }

  .mobile-view {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .water-item-card {
    background: #ffffff;
    border: 2px solid #cbd5e1;
    border-radius: 14px;
    padding: 14px;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .card-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-title-text {
    font-size: 18px;
  }

  /* จัดเรียงปุ่มเป็นตาราง 2x2 บนมือถือและไอแพด กดง่าย ไม่ล้นจอ */
  .card-action-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .card-action-grid .btn-action {
    height: 44px;
    font-size: 15px;
    width: 100%;
    justify-content: center;
  }

  .card-empty {
    background: #ffffff;
    border: 2px solid #cbd5e1;
    border-radius: 14px;
  }
}
</style>