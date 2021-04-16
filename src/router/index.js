import Vue from "vue";
// import store from "../store";
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
        path: "film/cinemas/:id",
        name: "filmCinemas",
        props: true,
        component: () => import("../pages/Film/FilmCinemas/indexAction")
      },
      {
        path: "cinemas",
        component: () => import("../pages/Cinemas/indexAction"),
        children: [
          {
            path: "",
            name: "cinemas",
            // meta: { keepAlive: true },
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
      },
      {
        path: "my_center/collect",
        name: "collect",
        component: () => import("../pages/MyCenter/Collect/indexAction")
      },
      {
        path: "user",
        name: "user",
        component: () => import("../pages/MyCenter/User/indexAction")
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

// router.afterEach(to => {
// console.log(to);
// console.log(from);
// console.log(111111111);
// switch (to.name) {
//   case "my_center":
//     store.commit("setTabs", true);
//     break;
// }
// next(() => {});
// });

export default router;
