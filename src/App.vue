<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {

  setup() {
    

    return {
      
    };
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

html {
  width: 100vw;
  height: 100vh;
  background-image: url("./assets/bg.webp");
  background-size: cover;
}
</style>