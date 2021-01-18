import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  {
    path: "/menu",
    name: "menu",
    redirect: { name: "film" },
    component: () => import("../pages/Menu/indexAction"),
    children: [
      {
        path: "film",
        name: "film",
        redirect: { name: "nowPlaying" },
        component: () => import("../pages/Film/indexAction"),
        children: [
          {
            path: "nowPlaying",
            name: "nowPlaying",
            component: () => import("../pages/Film/NowPlaying/indexAction")
          },
          {
            path: "comingSoon",
            name: "comingSoon",
            component: () => import("../pages/Film/ComingSoon/indexAction")
          },
          {
            path: "detail/:id",
            name: "detail",
            props: true,
            component: () => import("../pages/Film/Detail/indexAction")
          }
        ]
      },
      {
        path: "cinemas",
        name: "cinemas",
        component: () => import("../pages/Cinemas/indexAction")
      },
      {
        path: "my_center",
        name: "my_center",
        component: () => import("../pages/MyCenter/indexAction")
      }
    ]
  },
  {
    path: "*",
    redirect: "/menu"
  }
];

const router = new VueRouter({
  routes,
  mode: "history"
});

export default router;
