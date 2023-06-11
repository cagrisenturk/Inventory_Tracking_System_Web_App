<template>
  <div>
    {{ MeasurementDeviceId }}

    <OSelect
      v-model="MeasurementDeviceId"
      :settings="{
        url: '/v1/OMeasurementDevices',
        key: 'Id',
        value: 'SerialNumber',
      }"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      MeasurementDeviceId: 32,
    };
  },
  methods: {},
};
</script>
