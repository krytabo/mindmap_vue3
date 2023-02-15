<template>
  <router-view />
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: absolute;
  top: 0;
}

body {
  position: absolute;
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
}

.mx-context-menu {
  box-shadow: 0 0 15px 5px rgba(0, 0, 0, 10%) !important;
  border-radius: 5px !important;
  padding: 5px 0 !important;
}
</style>
