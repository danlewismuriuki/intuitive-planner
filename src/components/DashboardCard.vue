<template>
  <q-card class="dashboard-card" style="background: rgba(255,255,255,0.05); border-radius: 12px;">
    <q-card-section class="q-pa-lg">
      <div class="row q-justify-center">
        <div class="col-12 flex flex-center">
          <q-circular-progress show-value font-size="16px" :value="progressCount" size="150px" :thickness="0.22"
            color="orange" track-color="grey-4" class="q-ma-md">
            <div class="text-center">
              <div class="text-h4 text-orange q-mb-sm">{{ progressCount }}</div>
              <div class="text-grey-4">{{ title }}</div>
            </div>
          </q-circular-progress>
        </div>
      </div>
    </q-card-section>

    <q-separator dark />

    <q-card-actions vertical align="center" class="q-pa-md">
      <q-btn flat :to="navigationRoute" color="orange" class="full-width" style="border-radius: 8px;">
        View Details
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
defineOptions({
  name: "DashboardCard",
});

export interface DashboardCardProps {
  progressCount?: number;
  title?: string;
  navigationRoute?: string;
}

withDefaults(defineProps<DashboardCardProps>(), {
  progressCount: 13,
  title: "Title Here",
  navigationRoute: "customers",
});
</script>

<style lang="scss" scoped>
.dashboard-card {
  width: 100%;
  max-width: 300px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }

  :deep(.q-circular-progress__text) {
    color: white;
  }
}
</style>
