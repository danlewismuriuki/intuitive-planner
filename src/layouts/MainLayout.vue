<template>
  <div class="main-layout">
    <q-layout view="hHh Lpr lff">
      <q-header class="header-container">
        <q-toolbar class="q-px-lg" style="height: 70px">
          <q-btn
            flat
            @click="toggleLeftDrawer"
            round
            dense
            icon="menu"
            color="white"
            size="lg"
          />
          <q-toolbar-title class="text-center text-weight-light">
            Data Centre Dashboard
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="leftDrawerOpen"
        :width="240"
        :breakpoint="500"
        overlay
        bordered
        class="drawer-container"
      >
        <q-scroll-area class="fit">
          <div class="q-pa-md text-white text-weight-bold text-h6">
            Navigation
          </div>
          <q-list padding>
            <template v-for="(menuItem, index) in menuList" :key="index">
              <clickable-link
                :title="menuItem.label"
                :icon="menuItem.icon"
                :link="menuItem.route"
              >
              </clickable-link>
              <q-separator
                :key="'sep' + index"
                v-if="menuItem.separator"
                dark
                class="q-my-md"
                style="background: rgba(255, 255, 255, 0.1)"
              />
            </template>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup lang="ts">
import ClickableLink from "src/components/ClickableLink.vue";
import { ref } from "vue";

defineOptions({
  name: "MainLayout",
});

const menuList = [
  {
    icon: "home",
    label: "Home",
    route: "/",
    separator: true,
  },
  {
    icon: "groups",
    label: "Customers",
    route: "customers",
    separator: true,
  },
  {
    icon: "map",
    label: "Mapping",
    route: "mapping",
    separator: true,
  },
  {
    icon: "settings",
    label: "Settings",
    route: "customers",
    separator: false,
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style lang="scss" scoped>
.main-layout {
  background: #2d2d3a;
  min-height: 100vh;

  .header-container {
    background: #2d2d3a;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .q-toolbar {
      &__title {
        color: white;
        font-size: 1.5rem;
      }
    }
  }
}

// Using deep selector to target Quasar's internal class
:deep(.q-drawer) {
  background: #2d2d3a !important;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.q-list) {
  padding-top: 0;
}
</style>
