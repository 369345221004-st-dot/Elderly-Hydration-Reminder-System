<template>
  <div id="app-container">
    <header class="navbar-wrapper">
      <!-- ส่วนหัวข้อหลักสำหรับผู้สูงอายุ -->
      <div class="app-header-title">
        <h1>💧 ระบบแจ้งเตือนการดื่มน้ำ สำหรับผู้สูงอายุ</h1>
      </div>

      <nav aria-label="เมนูหลัก">
        <div class="nav-links">
          <router-link to="/">🏠 หน้าแรก</router-link>
          <router-link to="/water">🥛 ดื่มน้ำ</router-link>
          <router-link to="/summary">📊 สรุปผล ({{ totalWater }} ml)</router-link>
          <router-link v-if="user" to="/admin">⚙️ หลังบ้าน</router-link>
        </div>

        <div class="user-auth-zone">
          <router-link v-if="!user" to="/login" class="login-btn">
            🔑 เข้าสู่ระบบ
          </router-link>
          <div v-else class="user-badge">
            <span class="user-email" :title="user.email">👤 {{ user.email }}</span>
            <button @click="logout" class="btn-logout">ออกจากระบบ</button>
          </div>
        </div>
      </nav>
    </header>

    <!-- แจ้งเมื่อข้อมูลเปลี่ยนจากเครื่องอื่น -->
    <transition name="fade">
      <p v-if="liveMsg" class="live" role="status" aria-live="polite">
        🔔 {{ liveMsg }}
      </p>
    </transition>

    <!-- หน้าปัจจุบันจะมาแสดงตรง router-view -->
    <main id="main" tabindex="-1">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  totalWater, 
  loadWaterLogs, 
  liveMsg, 
  startRealtime, 
  stopRealtime,
  user,
  signOut
} from './store.js';

const router = useRouter();

async function logout() {
  await signOut();
  router.push('/');
}

onMounted(() => {
  loadWaterLogs();
  startRealtime();
});

onUnmounted(stopRealtime);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700;800&family=Sarabun:wght@400;600;700&display=swap');

#app-container {
  font-family: 'Prompt', 'Sarabun', system-ui, sans-serif;
  color: #0f172a;
  min-height: 100vh;
  background-color: #f8fafc;
}

/* แถบสีขาวครอบเต็มหน้าจอ */
.navbar-wrapper {
  width: 100%;
  background-color: #ffffff;
  border-bottom: 3px solid #cbd5e1;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
}

/* ส่วนหัวข้อหลัก */
.app-header-title {
  background: linear-gradient(135deg, #0284c7, #0369a1);
  color: #ffffff;
  text-align: center;
  padding: 14px 16px;
}

.app-header-title h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 600; /* ลดความหนาลงเพื่อให้ดูนุ่มนวลและเป็นมิตรขึ้น */
  color: #ffffff; /* บังคับให้เป็นสีขาวชัดเจน */
  letter-spacing: 0.3px;
  -webkit-font-smoothing: antialiased;
}

/* คอนเทนเนอร์ Nav */
nav {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between; 
  align-items: center;
  flex-wrap: nowrap;
  gap: 12px;
  box-sizing: border-box;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
}

/* ขยายขนาดปุ่มเมนูให้กดง่าย ไม่พลาด */
nav a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 46px;
  padding: 0 16px;
  border-radius: 12px;
  text-decoration: none;
  color: #1e293b;
  font-size: 17px;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

nav a:hover {
  background-color: #e0f2fe;
  color: #0284c7;
  border-color: #bae6fd;
}

nav a.router-link-exact-active {
  background: #0284c7;
  color: #ffffff;
  border-color: #0284c7;
  box-shadow: 0 4px 10px rgba(2, 132, 199, 0.35);
}

.user-auth-zone {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.login-btn {
  background-color: #f1f5f9;
  border: 1px solid #cbd5e1;
  height: 46px;
  padding: 0 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #334155;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  padding: 6px 10px 6px 14px;
  border-radius: 12px;
  white-space: nowrap;
}

.user-email {
  font-size: 15px;
  font-weight: 600;
  color: #0369a1;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ขยายปุ่มออกจากระบบให้กดง่าย */
.btn-logout {
  height: 38px;
  padding: 0 14px;
  background-color: #e11d48;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-logout:hover {
  background-color: #be123c;
}

.live {
  text-align: center;
  background-color: #fef3c7;
  border-bottom: 2px solid #fde047;
  color: #78350f;
  padding: 12px 16px;
  margin: 0;
  font-weight: 600;
  font-size: 17px;
}

/* พื้นที่แสดงผลเนื้อหาหลัก */
main {
  min-height: calc(100vh - 140px);
  background-color: #f8fafc;
  padding-bottom: 40px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ปรับแสดงผลเมื่อเปิดในมือถือและแท็บเล็ต (หน้าจอ <= 768px) */
@media (max-width: 768px) {
  .app-header-title h1 {
    font-size: 18px;
  }

  nav {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    padding: 10px 12px;
  }

  .nav-links {
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px;
  }

  nav a {
    height: 42px;
    padding: 0 12px;
    font-size: 15px;
  }

  .user-auth-zone {
    width: 100%;
    justify-content: center;
  }

  .user-badge {
    width: 100%;
    justify-content: space-between;
  }

  .user-email {
    max-width: 180px;
    font-size: 14px;
  }
}
</style>