import { RouteRecordRaw } from "vue-router";

// Check if the user is authenticated
const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("pages/LoginPage.vue"),
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "customers",
        component: () => import("src/components/CustomerPage/CustomerList.vue"),
      },
      {
        path: "/customers/:customerId/projects",
        name: "ProjectList",
        component: () =>
          import("src/components/CustomerOverviewComponents/ProjectList.vue"),
        props: true,
      },
      {
        path: "/projects/:projectId/sites",
        name: "SiteList",
        component: () =>
          import("src/components/CustomerOverviewComponents/SiteList.vue"),
        props: true,
      },
      {
        path: "/sites/:siteId/buildings",
        name: "BuildingList",
        component: () =>
          import("src/components/CustomerOverviewComponents/BuildingList.vue"),
        props: true,
      },
      {
        path: "/buildings/:buildingId/floors",
        name: "FloorList",
        component: () =>
          import("src/components/CustomerOverviewComponents/FloorList.vue"),
        props: true,
      },
      {
        path: "/customer-overview/:customerId",
        name: "CustomerOverview",
        component: () =>
          import(
            "src/components/CustomerOverviewComponents/ComponentsContainer/CustomerOverview.vue"
          ),
        props: true,
      },
      {
        path: "/zone/:dataHallId/manage",
        name: "ZoneManagement",
        component: () =>
          import(
            "src/components/ZoneComponents/ComponentsContainer/ZoneManager.vue"
          ),
        props: true,
      },
      {
        path: "/mapping",
        name: "Mapping",
        component: () => import("src/components/Mapping/MapperPage.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

// Navigation guards
routes.forEach((route) => {
  if (route.path !== "/login")
    route.beforeEnter = (to, from, next) => {
      if (to.meta.requiresAuth && isAuthenticated()) next();
      else next("/login");
    };
});

export default routes;
