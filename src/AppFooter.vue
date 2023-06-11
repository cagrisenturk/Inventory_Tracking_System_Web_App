<template>
  <div class="layout-footer">
    
    <!-- 1820 744 -->
    <!-- 114 46 -->
  </div>
</template>

<script>
export default {
  name: "AppFooter",
  methods: {
    footerImage() {
      return this.$appState.darkTheme
        ? "images/logo-white.svg"
        : "images/logo-dark.svg";
    },
  },
  computed: {
    darkTheme() {
      return this.$appState.darkTheme;
    },
  },
};
</script>
<style scoped>
#by{
  font-size: large;
}
</style>
