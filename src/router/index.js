import { createRouter, createWebHashHistory } from "vue-router";
import Main from "@/views/Main.vue";
import Cats from "@/views/Cats.vue";
import Feedback from "@/views/Feedback.vue";
import Detail from "@/views/Detail.vue";
import Messages from "@/views/Messages.vue";
import Pictures from "@/views/Pictures.vue";
import TipModule from "@/views/TipModule.vue";
import Tips from "@/views/Tips.vue";

const routes = [
  {
    path: "/main",
    name: "main",
    component: Main
  },
  {
    path: "/cats",
    name: "cats",
    component: Cats,
  },
  {
    path: "/feedback",
    name: "feedback",
    component: Feedback,
  },
  {
    path: "/detail",
    name: "detail",
    component: Detail,
    children: [
      {
        path: "pictures/:catId",
        name: "pictures",
        component: Pictures,
      },
      {
        path: "messages/:catId",
        name: "messages",
        component: Messages,
      },
    ],
  },
  {
    path: "/tipModule",
    name: "tipModule",
    component: TipModule,
  },
  {
    path: "/tips/:moduleId",
    name: "tips",
    component: Tips,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
