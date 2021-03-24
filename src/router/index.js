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
          }
        ]
      },
      {
        path: "detail/:id",
        name: "detail",
        props: true,
        component: () => import("../pages/Film/Detail/indexAction")
      },
      {
        path: "cinemas",
        component: () => import("../pages/Cinemas/indexAction"),
        children: [
          {
            path: "",
            name: "cinemas",
            component: () => import("../pages/Cinemas/Cinemas/indexAction")
          }
        ]
      },
      {
        path: "cinemas/:cinemaId",
        name: "cinemas_detail",
        props: true,
        component: () =>
          import("../pages/Cinemas/Cinemas/CinemasDetail/indexAction")
      },
      {
        path: "cinemas/navigation",
        name: "cinema_navigation",
        props: true,
        component: () => import("../pages/Cinemas/CinemaNavigation/indexAction")
      },
      {
        path: "cinemas/:cinemaId/:schedule",
        name: "schedule",
        props: true,
        component: () => import("../pages/Cinemas/ChooseSeat/indexAction")
      },
      {
        path: "search",
        name: "search",
        component: () => import("../pages/Cinemas/CinemasSearch/indexAction")
      },
      {
        path: "my_center",
        name: "my_center",
        component: () => import("../pages/MyCenter/indexAction")
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/Login/indexAction")
  },
  {
    path: "/city",
    name: "city",
    component: () => import("../pages/City/indexAction")
  },
  {
    path: "*",
    redirect: "/menu"
  }
];

const router = new VueRouter({
  routes,
  mode: "hash"
});

export default router;
