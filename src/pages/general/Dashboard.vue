<template>
  <div v-if="userType==2">
    <appdashboardBanner />
    <div class="grid">
      <div class="col-12 xl:col-6">
      <appdashboardAlarm />
      

      </div>
      <div class="col-12 xl:col-6">
        <appdashboardMinimum />
        <appdashboardMaximum />
      </div>
      
    </div>
  </div>
</template>

<script>
import dashboardBanner from "../../components/Dashboard/dashboardBanner.vue";
import dashboardAlarm from "../../components/Dashboard/dashboardAlarm.vue";
import dashboardMinimum from "../../components/Dashboard/minimumUse.vue";
import dashboardMaximum from "../../components/Dashboard/maximumUse.vue";

export default {
  components: {
    appdashboardBanner: dashboardBanner,
    appdashboardAlarm: dashboardAlarm,
    appdashboardMinimum:dashboardMinimum,
    appdashboardMaximum:dashboardMaximum
  },
  data() {
    return {
      userType:localStorage.userType,
    };
  },

  beforeUnmount() {},

  methods: {},
};
</script>
