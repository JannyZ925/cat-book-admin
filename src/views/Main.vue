<template>
  <div class="main">
    <el-container>
      <el-header>
        <div>长大猫谱后台管理系统</div>
        <el-button>退出登录</el-button>
      </el-header>
      <el-container>
        <el-aside width="150px">
          <el-menu default-active="1-1">
            <router-link to="/cats">
              <el-menu-item index="1-1"> 猫咪信息管理 </el-menu-item>
            </router-link>
            <router-link to="/feedback">
              <el-menu-item index="1-2"> 反馈信息管理 </el-menu-item>
            </router-link>
            <router-link to="/tipModule">
              <el-menu-item index="1-3"> 科普知识管理 </el-menu-item>
            </router-link>
            <router-link to="/place">
              <el-menu-item index="1-4"> 猫咪常驻地管理 </el-menu-item>
            </router-link>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
  
  <script>
import { onMounted } from "vue";
export default {
  setup() {
    onMounted(() => {
      document.body.style.setProperty("--el-color-primary", "#2a6aff");
      document.body.style.setProperty("--el-text-color-primary", "#2a6aff");
    });
  },
};
</script>
  
<style lang="scss">
body {
  margin: 0;
  font-family: "微软雅黑";
}
.main {
  min-width: 1200px;
  width: 100vw;
  height: 100vh;
  background-color: #ecf5ff;
}
.el-container {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #2a6aff;
  color: white;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .el-button {
    color: black;
  }
}
.el-aside {
  background-color: white;
  color: var(--el-text-color-primary);
  text-align: center;
}

.el-main {
  color: var(--el-text-color-primary);
  text-align: center;
}

.el-menu {
  background-color: white;
  border: none;
}

a {
  text-decoration: none;
  color: black;
}

.el-menu-item.is-active {
  background-color: #ecf5ff;
}

.el-pagination {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}
</style>