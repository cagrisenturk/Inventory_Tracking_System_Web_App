<template>
  <div class="grid" >
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3"
              >Toplam Envanter
            </span>
            <div class="text-900 font-medium text-xl">
              {{ this.datas.inventoryCount }}
            </div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-blue-100 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-comment text-purple-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium"> </span>
        <span class="text-500"> Envanterler</span>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Toplam Kullanıcı</span>
            <div class="text-900 font-medium text-xl">
              {{ this.datas.userCount }}
            </div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-orange-100 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-map-marker text-orange-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium"> </span>
        <span class="text-500">Kullancılar</span>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3"
              >Bugün Kullanılan Envanter Sayısı</span
            >
            <div class="text-900 font-medium text-xl">
              {{ this.datas.todayInventoryCount }}
            </div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-cyan-100 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-inbox text-cyan-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium"> </span>
        <span class="text-500">Envanter</span>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3"
              >Şu An Kullanılan Envanter Sayısı</span
            >
            <div class="text-900 font-medium text-xl">
              {{ this.datas.usingInventoryCount }}
            </div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-purple-100 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-comment text-purple-500 text-xl"></i>
          </div>
        </div><span class="text-green-500 font-medium"> </span>
        <span class="text-500">{{ today }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import InventoryUseTimeService from "../../service/InventoryUseTime/InventoryUseTimeService";
import moment from "moment";
import "moment/locale/tr";
export default {
  data() {
    return {
      datas:{},
    };
  },
  methods: {
    getInfo() {
      this.InventoryUseTimeService.getDashboardInfo().then((data) => {
        this.datas = data.data;
        console.log("data geldi");
        console.log(this.datas);
      });
    },
  },
  created() {
    this.InventoryUseTimeService = new InventoryUseTimeService();
    
    
  },
  mounted() {
    this.getInfo();
    this.today = moment().format("LL");

  },
};
</script>
