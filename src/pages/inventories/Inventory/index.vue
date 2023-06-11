<template>
  <Toast />
  <div class="grid">
    <div class="" :class="{ 'col-4': detailActive, 'col-12': !detailActive }">
      <Card>
        <template #title>
          Envanterler Tablosu
          <Button
            label="  Ekle"
            icon="pi pi-plus"
            iconPos="left"
            style="float: right"
            v-on:click="openDetail(0)"
          />
          <SplitButton
            v-if="selectedDatas.length > 0"
            label="İşlemler"
            class="p-button-secondary"
            icon="pi-ellipsis-v"
            style="float: right; margin-right: 10px"
            :model="electricItems"
          ></SplitButton>
        </template>
        <template #content>
          <DataTable
            :value="tableDatas"
            :loading="blockedTable"
            :lazy="true"
            :paginator="true"
            :scrollable="true"
            :rows="pageSize"
            ref="dt"
            filterDisplay="row"
            v-model:selection="selectedDatas"
            :selectAll="selectAll"
            @select-all-change="onSelectAllChange"
            @row-select="onRowSelect"
            @row-unselect="onRowUnselect"
            @page="onPage($event)"
            @sort="onSort($event)"
            @filter="onFilter($event)"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 20]"
            responsiveLayout="scroll"
            :totalRecords="totalCount"
            currentPageReportTemplate="{totalRecords} kayıttan {first} ile {last} arasındaki veriler"
            class="p-datatable-sm"
            dataKey="Id"
            v-model:filters="filters"
            :globalFilterFields="[
              'Name',
            ]"
          >
            
            <Column
              field="Id"
              header="Envanter Adı"
              :showFilterMenu="false"
              ref="Name"
              :sortable="true"
              :style="{ width: '300px' }"
            >
              <template #filter="{ filterModel, filterCallback }">
                <OSelect
                  @change="filterCallback()"
                  v-model="filterModel.value"
                  :settings="{
                    url: '/v1/OInventories',
                    key: 'Id',
                    value: 'Name',
                  }"
                  placeholder="Filtrele"
                />
              </template>
              <template #body="{ data }">
                {{ data.Name }}
              </template>
            </Column>
            <Column
              field="Id"
              header="Kullanma Durumu"
              :showFilterMenu="false"
              ref="UseCase"
              :sortable="true"
              :style="{ width: '300px' }"
            >
              <template #body="{ data }">
                <template v-if="data.UseCase=='Available'">
                  {{ "Müsait" }}
                </template>
                <template v-else>
                  {{ "Kullanılmakta" }}
                </template>
              </template>
            </Column>
            <Column field="actions" header="İşlemler">
              <template #body="currentItem">
                <Button
                  icon="pi pi-info"
                  type="button"
                  class="p-button-text"
                  v-on:click="openInfoPage(currentItem.data.Id)"
                ></Button>
                <Button
                  icon="pi pi-pencil"
                  type="button"
                  class="p-button-text"
                  v-on:click="openDetail(currentItem.data.Id)"
                ></Button>
                <Button
                  icon="pi pi-trash"
                  type="button"
                  class="p-button-text red"
                  v-on:click="deleteInventory(currentItem.data.Id)"
                ></Button>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
    <div v-if="detailActive" class="col-12 md:col-8">
      <InventoryDetail
        :inventoryId="currentInventoryId"
        @refresh="refresh"  
        @close="close"
      ></InventoryDetail>
    </div>
  </div>
</template>

<script>
import InventoryService from "../../../service/Inventory/InventoryService";
import InventoryDetail from "./edit.vue";
import { FilterMatchMode } from "primevue/api";
export default {
  data() {
    return {
      blockedTable: true,
      currentInventoryId: 0,
      detailActive: false,

      display: false,
      selectedDatas: [],
      mdId: [],
      selectAll: false,
      tableDatas: [],
      pageSize: 10,
      totalCount: 0,
      filters: {
        Id: {
          value: "",
          matchMode: FilterMatchMode.EQUALS,
        },
      },
      
      
      lazyParams: {},
    };
  },
  methods: {
    openInfoPage(id) {
      this.$router.push("/Inventory/infoInventory/" + id + "");
    },
    
    loadLazyData() {
      this.blockedTable = true;

      this.InventoryService.get(this.lazyParams).then((data) => {
        this.tableDatas = data.value;
        this.totalCount = data["@odata.count"];
        this.blockedTable = false;
        console.log(data.value);
        console.log(this.totalCount);
      });
    },
    openDetail(inventoryId) {
      this.currentInventoryId = inventoryId;
      this.detailActive = true;
    },
    deleteInventory(inventoryId) {
      var isOk = confirm("Silmek istediğinize emin misiniz?");
      if (!isOk) {
        return;
      }
      new InventoryService()
        .deleteInventory(inventoryId)
        .then((response) => {
          console.log(response);
          if (response.data.status) {
            this.$toast.add({
              severity: "success",
              summary: "Başarılı",
              detail: "Silindi..",
              life: 3000,
            });
          } else {
            this.$toast.add({
              severity: "error",
              summary: "Kontrol ediniz!",
              detail: response.Message,
              life: 3000,
            });
          }
          this.refresh();
          this.close();
        });
    },
    onPage(event) {
      this.lazyParams = event;
      this.loadLazyData();
    },
    onSort(event) {
      this.lazyParams = event;
      this.loadLazyData();
    },
    onFilter() {
      this.lazyParams.filters = this.filters;
      this.lazyParams.first = 0;
      this.loadLazyData();
    },
    refresh() {
      this.loadLazyData();
    },
    close() {
      this.detailActive = false;
    },
    onSelectAllChange(event) {
      console.log(event.checked);
      if (event.checked) {
        this.selectedDatas = [...this.selectedDatas, ...this.tableDatas];
      } else {
        var dataa = this.tableDatas;
        this.selectedDatas = this.selectedDatas.filter(function (el) {
          return dataa.find((s) => s.Id == el.Id) == null;
        });
      }
      this.selectAll = this.selectedDatas.length === this.totalCount;

      console.log("AllChange");

      console.log(this.selectedDatas);
    },
    onRowSelect() {
      console.log("select");
      console.log(this.selectedDatas);
      this.selectAll = this.selectedDatas.length === this.totalCount;
    },
    onRowUnselect() {
      console.log("rowselect");

      this.selectAll = false;
    },
  },
  components: {
    InventoryDetail: InventoryDetail,
  },
  created() {
    this.InventoryService = new InventoryService();
  },
  mounted() {
    this.blockedTable = true;
    this.lazyParams = {
      first: 0,
      rows: this.$refs.dt.rows,
      sortField: "Id",
      sortOrder: 1,
      filters: this.filters,
      select: null,
      expand: null,
    };

    this.loadLazyData();
  },
};
</script>
<style>
.red {
  color: red !important;
}
.green {
  color: green !important;
}
</style>
