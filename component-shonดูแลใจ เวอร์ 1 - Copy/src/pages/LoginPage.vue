<template>
  <div class="login-container">
    <main class="card">
      <header class="card-header">
        <div class="icon-badge" aria-hidden="true">
          <span>🔐</span>
        </div>
        <h1>เข้าสู่ระบบผู้ดูแล</h1>
        <p class="subtitle">ระบบบันทึกการดื่มน้ำ สำหรับผู้สูงอายุ</p>
      </header>

      <form @submit.prevent="login" class="login-form">
        <!-- ช่องกรอกอีเมล -->
        <div class="form-group">
          <label for="email">
            <span class="label-icon">✉️</span>
            <span>อีเมลผู้ใช้งาน</span>
          </label>
          <input 
            id="email" 
            v-model.trim="email" 
            type="email" 
            autocomplete="username" 
            placeholder="เช่น name@example.com"
            required
          >
        </div>

        <!-- ช่องกรอกรหัสผ่าน -->
        <div class="form-group">
          <label for="password">
            <span class="label-icon">🔒</span>
            <span>รหัสผ่าน</span>
          </label>
          <div class="password-wrapper">
            <input 
              id="password" 
              v-model="password" 
              :type="showPw ? 'text' : 'password'" 
              autocomplete="current-password" 
              placeholder="กรอกรหัสผ่านของคุณ"
              required
            >
            <button 
              type="button" 
              class="btn-toggle-pw"
              @click="showPw = !showPw" 
              :aria-pressed="showPw"
              :title="showPw ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'"
            >
              <span class="eye-icon">{{ showPw ? '🙈' : '👁️' }}</span>
              <span class="toggle-text">{{ showPw ? 'ซ่อน' : 'แสดง' }}</span>
            </button>
          </div>
        </div>

        <!-- ปุ่มเข้าสู่ระบบ -->
        <button type="submit" class="btn-submit" :disabled="busy">
          <span v-if="busy" class="spinner" aria-hidden="true">⏳</span>
          <span>{{ busy ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ' }}</span>
        </button>
      </form>

      <!-- ข้อความแจ้งเตือนเมื่อเกิดข้อผิดพลาด -->
      <transition name="fade">
        <div v-if="message" class="alert-box" role="alert">
          <span class="alert-icon">⚠️</span>
          <p>{{ message }}</p>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signIn } from '../store.js';

const email = ref('');
const password = ref('');
const busy = ref(false); 
const message = ref('');
const showPw = ref(false); 
const router = useRouter();

async function login() {
  busy.value = true;
  message.value = ''; 
  
  const err = await signIn(email.value, password.value);
  busy.value = false;
  
  if (err) {
    message.value = err;
  } else {
    router.push('/admin');
  }
}
</script>

<style scoped>
/* นำเข้าฟอนต์ภาษาไทยอ่านง่าย (Prompt / Sarabun) */
@import url('https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700&family=Sarabun:wght@400;600;700&display=swap');

/* เลย์เอาต์หลัก */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  padding: 20px;
  background: linear-gradient(135deg, #e0f2fe 0%, #f1f5f9 100%);
  font-family: 'Prompt', 'Sarabun', system-ui, sans-serif;
  color: #0f172a;
}

/* การ์ดแบบฟอร์ม */
.card {
  background: #ffffff;
  width: 100%;
  max-width: 480px;
  padding: 44px 36px;
  border-radius: 24px;
  box-shadow: 0 20px 40px -15px rgba(14, 116, 144, 0.12),
              0 0 15px rgba(0, 0, 0, 0.03);
  border: 2px solid #e2e8f0;
}

/* ส่วนหัว */
.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.icon-badge {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 76px;
  height: 76px;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  border-radius: 22px;
  margin-bottom: 16px;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.8);
}

.icon-badge span {
  font-size: 40px;
}

h1 {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
  letter-spacing: -0.3px;
  line-height: 1.3;
}

.subtitle {
  font-size: 17px;
  color: #475569;
  margin: 0;
  font-weight: 400;
  line-height: 1.5;
}

/* แบบฟอร์ม */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.label-icon {
  font-size: 20px;
}

/* ช่องกรอกข้อมูล */
input {
  width: 100%;
  height: 58px;
  padding: 0 18px;
  font-family: inherit;
  font-size: 18px;
  font-weight: 500;
  color: #0f172a;
  background-color: #f8fafc;
  border: 2px solid #cbd5e1;
  border-radius: 14px;
  box-sizing: border-box;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

input::placeholder {
  color: #94a3b8;
  font-size: 17px;
  font-weight: 400;
}

input:focus {
  outline: none;
  border-color: #0284c7;
  background-color: #ffffff;
  box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.18);
}

/* ช่องใส่รหัสผ่าน */
.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  padding-right: 125px;
}

.btn-toggle-pw {
  position: absolute;
  right: 8px;
  height: 42px;
  padding: 0 14px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  color: #334155;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.btn-toggle-pw:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.btn-toggle-pw:focus {
  outline: none;
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.2);
}

/* ปุ่มเข้าสู่ระบบ */
.btn-submit {
  margin-top: 6px;
  height: 60px;
  font-family: inherit;
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  border: none;
  border-radius: 14px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 20px -4px rgba(2, 132, 199, 0.35);
  transition: all 0.2s ease;
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -4px rgba(2, 132, 199, 0.45);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
}

.btn-submit:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.4);
}

.btn-submit:disabled {
  background: #cbd5e1;
  box-shadow: none;
  cursor: not-allowed;
  color: #64748b;
}

.spinner {
  animation: spin 1.5s linear infinite;
  display: inline-block;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

/* กล่องแจ้งเตือนความผิดพลาด */
.alert-box {
  margin-top: 22px;
  padding: 16px 18px;
  background-color: #fff1f2;
  border: 2px solid #fecdd3;
  border-left: 6px solid #e11d48;
  border-radius: 12px;
  color: #9f1239;
  display: flex;
  align-items: center;
  gap: 12px;
}

.alert-box p {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.4;
}

.alert-icon {
  font-size: 24px;
  flex-shrink: 0;
}

/* Transition สำหรับ Alert */
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
@media (max-width: 480px) {
  .card {
    padding: 32px 22px;
    border-radius: 20px;
  }
  
  h1 {
    font-size: 24px;
  }
  
  .subtitle {
    font-size: 15px;
  }

  input {
    height: 54px;
    font-size: 17px;
  }

  .btn-submit {
    height: 56px;
    font-size: 18px;
  }
}
</style>