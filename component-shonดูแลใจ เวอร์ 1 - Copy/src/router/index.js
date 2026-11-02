import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import WaterTrackerPage from '../pages/WaterTrackerPage.vue';
import SummaryPage from '../pages/SummaryPage.vue';
import AdminPage from '../pages/AdminPage.vue';
import WaterDetailPage from '../pages/WaterDetailPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import ImpactPage from '../pages/ImpactPage.vue';
import { user, authReady } from '../store.js';

const routes = [
  { path: '/', component: HomePage },
  { path: '/water', component: WaterTrackerPage },
  { path: '/summary', component: SummaryPage },
  { path: '/login', component: LoginPage },
  { path: '/admin', component: AdminPage, meta: { requiresLogin: true } },
  { path: '/impact', name: 'Impact', component: ImpactPage },
  { path: '/water/:id', name: 'water-detail', component: WaterDetailPage },
  { path: '/detail/:id', component: WaterDetailPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to) => {
  if (to.meta.requiresLogin) {
    await authReady;
    if (!user.value) return '/login';
  }
});

export default router;