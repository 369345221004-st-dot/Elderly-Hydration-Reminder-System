<template>
  <article class="water-card">
    <div class="icon-wrapper">
      <img v-if="image" :src="image" :alt="title" class="water-img" />
      <span v-else class="water-icon">{{ icon }}</span>
    </div>

    <div class="info">
      <h3 class="title">{{ title }}</h3>
      <div class="badge">+{{ amount }} ml</div>
      <p class="desc">{{ desc }}</p>
      <router-link :to="'/water/' + id" class="detail-link">🔍 ดูรายละเอียดเพิ่มเติม</router-link>
    </div>

    <button class="record-btn" @click="emit('record', { id, title, amount })">
      💧 บันทึกการดื่ม
    </button>
  </article>
</template>

<script setup>
defineProps({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  amount: { type: Number, default: 250 },
  icon: { type: String, default: '🥛' },
  image: { type: String, default: '' },
  desc: { type: String, default: '' },
});

const emit = defineEmits(['record']);
</script>

<style scoped>
.water-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.water-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(2, 132, 199, 0.12);
  border-color: #38bdf8;
}

.water-icon {
  font-size: 3.5rem;
  display: block;
  margin-bottom: 8px;
}

.title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #1e293b;
  margin: 4px 0;
}

.badge {
  display: inline-block;
  background-color: #e0f2fe;
  color: #0284c7;
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 1rem;
  margin: 6px 0;
}

.desc {
  font-size: 0.9rem;
  color: #64748b;
  margin: 6px 0 10px;
  min-height: 38px;
}

.detail-link {
  font-size: 0.85rem;
  color: #0284c7;
  text-decoration: none;
  font-weight: 500;
  display: block;
  margin-bottom: 14px;
}

.detail-link:hover {
  text-decoration: underline;
}

.record-btn {
  width: 100%;
  background: linear-gradient(135deg, #0284c7, #0369a1);
  color: #ffffff;
  font-size: 1rem;
  font-weight: bold;
  padding: 10px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(2, 132, 199, 0.3);
  transition: opacity 0.2s, transform 0.1s;
}

.record-btn:hover {
  opacity: 0.95;
}

.record-btn:active {
  transform: scale(0.97);
}

</style>