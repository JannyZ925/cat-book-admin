<template>
  <div class="app">
    <div class="login">
      <el-form class="form" :model="admin" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="admin.name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="admin.password" type="password"></el-input>
        </el-form-item>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { login } from "@/api/admin";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

export default {
  setup() {
    let router = useRouter();

    let state = reactive({
      admin: {
        name: "",
        password: "",
      },
    });

    async function handleLogin() {
      let admin = await login(state.admin);
      if (admin) {
        ElMessage({
          type: "success",
          message: "登录成功!",
        });
        router.push({
          name: "main"
        });
      } else {
        ElMessage({
          type: "error",
          message: "用户名或密码错误!",
        });
      }
    }

    return {
      ...toRefs(state),
      handleLogin,
    };
  },
};
</script>

<style lang="scss">
html {
  width: 100vw;
  height: 100vh;
  background-image: url("./assets/bg.webp");
  background-size: cover;

  .login {
    min-width: 300px;
    width: 30vw;
    height: 50vh;
    background-color: rgba(255, 255, 255, 0.3);
    margin: 100px auto;
    border-radius: 10px;

    .form {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;

      .el-form-item {
        width: 80%;
      }
      .el-button {
        width: 40%;
      }
    }
  }
}
</style>