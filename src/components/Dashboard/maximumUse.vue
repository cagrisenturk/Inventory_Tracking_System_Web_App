<template>
  <div class="card">
    <h5>En Çok Kullanılan 5 Envanter</h5>
    <div>
      <DataTable :value="tableDatas" responsiveLayout="scroll">
        <Column
          field="inventoryName"
          header="Envanter Adı"
        ></Column>
        <Column
          header="Kullanılan Zaman Toplamı"
          field="totalTimeMinute"
          style="min-width: 10rem"
        ></Column
        >
        <Column field="totalUserTime" header="Kullanan Kullanıcı Sayısı"></Column>
      </DataTable>
    </div>
  </div>
</template>
<script>
import InventoryUseTimeService from "../../service/InventoryUseTime/InventoryUseTimeService";


export default {
  data() {
    return {
      tableDatas: [],
    };
  },

  created() {
    this.InventoryUseTimeService = new InventoryUseTimeService();
  },
  mounted() {
    this.dataEndex();
  },
  methods: {
    dataEndex() {
      this.InventoryUseTimeService.getMaxTime().then((data) => {
        this.tableDatas = data.data;
        console.log("endex geldi");
        console.log(this.tableDatas);
        
      });
    },
    formatDate(value) {
      console.log(value);
      if (value == null) {
        return;
      }

      try {
        return value.toLocaleDateString("tr-TR", {
          minute: "2-digit",
          hour: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      } catch {
        return value;
      }
    },
  },
};
</script>
