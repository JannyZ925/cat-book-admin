<template>
  <div class="detail">
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
    >
      <el-menu-item index="1" @click="goToPictures">照片管理</el-menu-item>
      <el-menu-item index="2" @click="goToMessages">留言管理</el-menu-item>
    </el-menu>
    
    <router-view></router-view>
  </div>
</template>

<script>
import { onMounted, ref, reactive } from "vue";
import Pictures from "@/views/Pictures.vue"
import { useRouter, useRoute } from 'vue-router';
export default {
  components: { Pictures },
  setup() {
    // 当前选中的菜单项索引
    const activeIndex = ref("1");
    // 路由器
    const router = useRouter()
    // 当前路由
    const route = useRoute()
    // 猫咪id
    let catId = reactive("")

    function goToPictures() {
      router.push({
        name: "pictures",
        params: {
          catId
        }
      })
    }

    function goToMessages() {
      router.push({
        name: "messages",
        params: {
          catId
        }
      })
    }

    onMounted(() => {
      catId = route.params.catId;
    })

    return {
      activeIndex,
      goToPictures,
      goToMessages
    };
  },
};
</script>

<style lang="scss" scoped>
.detail {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
}
</style>