<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <img
        alt="Logo"
        :src="'images/MyIcon.png'"
        style="width: 117px; height: 60px"
      />
    </router-link>
    <button
      class="p-link layout-menu-button layout-topbar-button"
      @click="onMenuToggle"
    >
      <i class="pi pi-bars"></i>
    </button>

    <button
      class="p-link layout-topbar-menu-button layout-topbar-button"
      v-styleclass="{
        selector: '@next',
        enterClass: 'hidden',
        enterActiveClass: 'scalein',
        leaveToClass: 'hidden',
        leaveActiveClass: 'fadeout',
        hideOnOutsideClick: true,
      }"
    >
      <i class="pi pi-ellipsis-v"></i>
    </button>
    <ul class="layout-topbar-menu hidden lg:flex origin-top">
      <li>
        <router-link to="/profile">
          <button class="p-link layout-topbar-button">
            <i class="pi pi-user"></i>
            <span>Profile</span>
          </button>
        </router-link>
      </li>
      <li>
        <i class="pi pi-sign-out p-link layout-topbar-button" @click="logout"></i>
      </li>
    </ul>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
export default {
  methods: {
    onMenuToggle(event) {
      this.$emit("menu-toggle", event);
    },
    onTopbarMenuToggle(event) {
      this.$emit("topbar-menu-toggle", event);
    },
    topbarImage() {
      return this.$appState.darkTheme
        ? "images/logo-white.svg"
        : "images/logo-dark.svg";
    },
    logout() {
      VueCookies.remove("usercode");
      this.$router.go("/login");
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

</style>
