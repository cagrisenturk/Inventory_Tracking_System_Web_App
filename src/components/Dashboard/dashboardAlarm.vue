<template>
  <div class="card">
    <h5>Son Kullanılan Envanterler</h5>
    <div>
      <DataTable :value="inventory" responsiveLayout="scroll">
        <Column
          field="Inventory.Name"
          header="Envanter Adı"
        ></Column>
        <Column
          header="Alındığı Tarih"
          field="StartDate"
          dataType="date"
          style="min-width: 10rem"
        >
          <template #body="{ data }">
            {{ formatDate(data.StartDate) }}
          </template></Column
        >
        <Column field="User.FullName" header="Kim Aldı"></Column>
      </DataTable>
    </div>
  </div>
</template>
<script>
import InventoryUseTimeService from "../../service/InventoryUseTime/InventoryUseTimeService";

export default {
  data() {
    return {
      inventory: [],
      lazyParams: {},
    };
  },

  created() {
    this.InventoryUseTimeService = new InventoryUseTimeService();
  },
  mounted() {
    this.lazyParams = {
      first: 0,
      sortField: "StartDate",
      sortOrder: -1,
      filters: this.filters,
      select: null,
      expand: null,
    };
    this.dataInventory();
  },
  methods: {
    dataInventory() {
      this.lazyParams.expand =
        "User($select=Id,FullName),Inventory($select=Id,Name),";
      this.InventoryUseTimeService.get(this.lazyParams).then((data) => {
        this.inventory = data.value;
        console.log("endex geldi");
        console.log(this.inventory);
      });
    },
    formatDate(value) {
      console.log(value);
      if (value == null) {
        return;
      }
      try {
        const date = new Date(value);
        const formattedDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        return (formattedDate);
      } catch {
        return value;
      }
    },
  },
};
</script>
