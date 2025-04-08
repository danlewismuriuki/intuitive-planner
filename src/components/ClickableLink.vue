<template>
  <q-item clickable v-ripple :to="link" active-class="active-link" class="nav-link q-my-sm">
    <q-item-section avatar>
      <q-icon :name="icon" size="md" color="grey-4" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-grey-4">{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  icon: string;
  link: string;
}>();
</script>

<style lang="scss" scoped>
.nav-link {
  border-radius: 8px;
  margin: 0 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);

    .q-item__section--avatar .q-icon,
    .q-item__label {
      color: #FF9800 !important;
    }
  }
}

.active-link {
  background: rgba(255, 255, 255, 0.1);

  .q-item__section--avatar .q-icon,
  .q-item__label {
    color: #FF9800 !important;
  }
}
</style>
