import { ref, computed, watch } from 'vue';
import { supabase } from './supabase.js';

// ---------- State ----------
export const dailyGoal = ref(2000);
export const totalWater = ref(0);

// 1. ตั้งค่าเริ่มต้นเป็นค่าว่าง เพื่อไม่ให้แสดงกล่องระฆังจนกว่าจะกดบันทึก
export const alertMessage = ref('');
let alertTimer = null; // ตัวแปรสำหรับนับเวลาซ่อนข้อความ

export const notice = ref('');

export const waterLogs = ref([]);
export const loading = ref(true);
export const errorMsg = ref('');

// แก้ไข id ให้ไม่ซ้ำกัน
export const waterOptions = ref([
  { id: 1, title: 'น้ำ 1 แก้วเล็ก', amount: 250, icon: '🥛', desc: 'เหมาะสำหรับการดื่มทั่วไป' },  
  { id: 2, title: 'น้ำ 1 แก้วปานกลาง', amount: 480, icon: '🥛', desc: 'ปริมาณพอดีต่อช่วงเวลา' },
  { id: 3, title: 'น้ำ 1 ขวดเล็ก', amount: 500, icon: '🥛', desc: 'ปริมาณพอดีสำหรับดื่มหนึ่งครั้ง' },
  { id: 4, title: 'น้ำ 1 แก้วใหญ่', amount: 750, icon: '🥛', desc: 'สำหรับเน้นดื่มเยอะ' }
]);

// ---------- ระบบล็อกอินจริง (Supabase Auth) ----------
export const user = ref(null); // ผู้ใช้ที่ล็อกอินอยู่ (null = ยังไม่ล็อกอิน)

// ตอนเปิดแอป: ถาม Supabase ว่าเคยล็อกอินค้างไว้ไหม
export const authReady = supabase.auth.getSession().then(({ data }) => {
  user.value = data.session?.user ?? null;
});

// ฟังทุกครั้งที่สถานะเปลี่ยน (ล็อกอิน / ออกจากระบบ / session หมดอายุ)
supabase.auth.onAuthStateChange((_event, session) => {
  user.value = session?.user ?? null;
});

// คืนค่า '' ถ้าสำเร็จ หรือข้อความบอกปัญหาถ้าผิดพลาด
export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' : '';
}

export async function signOut() {
  await supabase.auth.signOut();
}

// ---------- แก้ไข / ลบ (Update / Delete) ----------
export async function updateWaterLog(id, newAmount) {
  const { data, error } = await supabase
    .from('water_logs')
    .update({ amount: newAmount })
    .eq('id', id)
    .select();

  if (error) return error.message;
  if (data.length === 0) return 'ไม่มีสิทธิ์แก้ไข (ยังไม่ได้ล็อกอิน?) หรือไม่พบข้อมูล';
  await loadWaterLogs();
  return '';
}

export async function deleteWaterLog(id) {
  const { data, error } = await supabase
    .from('water_logs')
    .delete()
    .eq('id', id)
    .select();

  if (error) return error.message;
  if (data.length === 0) return 'ไม่มีสิทธิ์ลบ (ยังไม่ได้ล็อกอิน?) หรือไม่พบข้อมูล';
  await loadWaterLogs();
  return '';
}

// ---------- Computed ----------
export const progressPercentage = computed(() => {
  const percentage = Math.round((totalWater.value / dailyGoal.value) * 100);
  return percentage > 100 ? 100 : percentage;
});

// ---------- Watch ----------
watch(totalWater, (newVal, oldVal) => {
  if (newVal >= dailyGoal.value && oldVal < dailyGoal.value) {
    notice.value = '🎉 ยินดีด้วยครับ! คุณดื่มน้ำครบเป้าหมาย 2,000 ml ของวันนี้แล้ว';
  } else if (newVal < dailyGoal.value) {
    notice.value = '';
  }
});

// ---------- Supabase Actions ----------
export async function loadWaterLogs() {
  if (waterLogs.value.length === 0) loading.value = true;
  errorMsg.value = '';

  const { data, error } = await supabase
    .from('water_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    errorMsg.value = 'โหลดประวัติการดื่มน้ำไม่สำเร็จ กรุณาลองใหม่';
    console.error(error);
  } else {
    waterLogs.value = data;
    totalWater.value = data.reduce((sum, item) => sum + item.amount, 0);
  }
  loading.value = false;
}

// ---------- เพิ่มประวัติการดื่มน้ำลง Supabase ----------
export async function addWaterLog(newItem) {
  const payload = Array.isArray(newItem) ? newItem : [newItem];

  const { error } = await supabase.from('water_logs').insert(payload);

  if (error) {
    console.error('Supabase Error:', error);
    
    const addedAmount = payload.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
    const drinkTitle = payload[0]?.drink_option || 'ดื่มน้ำ';

    waterLogs.value.unshift({
      id: Date.now(),
      drink_option: drinkTitle,
      amount: addedAmount,
      created_at: new Date().toISOString()
    });
    
    totalWater.value += addedAmount;
    return error.message;
  }

  await loadWaterLogs();
  return '';
}

// ---------- Realtime ----------
export const liveMsg = ref('');
let channel = null;

export function startRealtime() {
  if (channel) return;
  channel = supabase
    .channel('water-logs-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'water_logs' },
      () => {
        liveMsg.value = '🔔 มีการอัปเดตข้อมูลการดื่มน้ำ — แสดงข้อมูลล่าสุดแล้ว';
        setTimeout(() => { liveMsg.value = ''; }, 5000);
        loadWaterLogs();
      }
    )
    .subscribe();
}

export function stopRealtime() {
  if (channel) {
    supabase.removeChannel(channel);
    channel = null;
  }
}

// ---------- ฟังก์ชัน addWater สำหรับปุ่มเลือกแก้วน้ำ ----------
export async function addWater(item) {
  // รับค่าวัตถุหรือตัวเลขปริมาณน้ำ
  const amount = typeof item === 'object' ? item.amount : item;
  const title = typeof item === 'object' ? item.title : 'ดื่มน้ำ';

  await addWaterLog({ 
    drink_option: title, 
    amount: amount 
  });

  // แสดงข้อความโดยไม่มีคำว่า *ติด RLS ใน Supabase
  alertMessage.value = `บันทึกเรียบร้อย (+${amount} ml)`;

  // เคลียร์เวลาเดิมหากมีการกดซ้ำ
  if (alertTimer) clearTimeout(alertTimer);

  // ตั้งเวลาซ่อนกล่องแจ้งเตือนอัตโนมัติเมื่อครบ 15 วินาที (15000ms)
  alertTimer = setTimeout(() => {
    alertMessage.value = '';
  }, 15000);
}

export function resetWater() {
  if (confirm('คุณต้องการรีเซ็ตปริมาณน้ำของวันนี้ใช่หรือไม่?')) {
    totalWater.value = 0;
    waterLogs.value = [];
    alertMessage.value = 'เริ่มบันทึกใหม่สำหรับวันนี้';

    if (alertTimer) clearTimeout(alertTimer);
    alertTimer = setTimeout(() => {
      alertMessage.value = '';
    }, 15000);
  }
}