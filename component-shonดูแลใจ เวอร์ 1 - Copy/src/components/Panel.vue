<template>
  <section class="panel-card">
    <header v-if="$slots.header" class="panel-header">
      <slot name="header">💧 ระบบแจ้งเตือนดื่มน้ำ</slot>
    </header>

    <div class="panel-body">
      <slot></slot>
    </div>

    <footer v-if="$slots.footer" class="panel-footer">
      <slot name="footer"></slot>
    </footer>
  </section>
</template>

<style scoped>
.panel-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.08);
  border: 2px solid #bae6fd;
  overflow: hidden;
  margin-bottom: 20px;
}

.panel-header {
  padding: 16px 20px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  background-color: #0284c7;
  border-bottom: 1px solid #0369a1;
}

.panel-body {
  padding: 20px;
  font-size: 1.05rem;
  line-height: 1.6;
  color: #334155;
}

.panel-footer {
  padding: 14px 20px;
  background-color: #f0f9ff;
  border-top: 2px solid #e0f2fe;
  font-size: 1rem;
}
</style>