<template>
  <Toast />
  <div class="grid">
    <div class="" :class="{ 'col-4': detailActive, 'col-12': !detailActive }">
      <Card>
        <template #title> Envanter Bilgi Tablosu </template>
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
            :globalFilterFields="['Name', 'Inventory.Name', 'User.FullName']"
          >
          <template #header>
        <div style="text-align: right">
            <Button icon="pi pi-external-link" label="Excele Aktar" @click="exportCSV($event)" />
        </div>
    </template>
            <Column
              field="Inventory.Name"
              header="Envanter Adı"
              :showFilterMenu="false"
              ref="Inventory.Name"
              :sortable="true"
              :style="{ width: '100px' }"
            >
              <!-- <template #filter="{ filterModel, filterCallback }">
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
                </template> -->
            </Column>
            <Column
              field="User.Id"
              header="Kullanıcı Adı"
              :showFilterMenu="false"
              ref="User.FullName"
              :sortable="true"
              :style="{ width: '100px' }"
            >
              <template #filter="{ filterModel, filterCallback }">
                <OSelect
                  @change="filterCallback()"
                  v-model="filterModel.value"
                  :settings="{
                    url: '/v1/OUsers',
                    key: 'Id',
                    value: 'FullName',
                  }"
                  placeholder="Filtrele"
                />
              </template>
              <template #body="{ data }">
                {{ data.User.FullName }}
              </template>
            </Column>
            <Column
              field="StartDate"
              header="Envanter Alma Tarihi"
              :showFilterMenu="false"
              dataType="date"
              ref="StartDate"
              :sortable="true"
              :style="{ width: '100px' }"
            >
              <template #body="{ data }">
                {{ formatDate(data.StartDate) }}
              </template> </Column
            ><Column
              field="EndDate"
              header="Envanter Bırakma Tarihi"
              :showFilterMenu="false"
              dataType="date"
              ref="EndDate"
              :sortable="true"
              :style="{ width: '100px' }"
            >
              <template #body="{ data }">
                {{ formatDate(data.EndDate) }}
              </template>
            </Column>
            <Column
              field="TotalTime"
              header="Harcanan Toplam Zaman"
              :showFilterMenu="false"
              dataType="date"
              ref="TotalTime"
              :sortable="true"
              :style="{ width: '100px' }"
            >
            <template #body="{ data }">
                {{ formatSecond(data.TotalTime) }}
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import InventoryUseTimeService from "../../../service/InventoryUseTime/InventoryUseTimeService";
import { FilterMatchMode } from "primevue/api";
import moment from "moment";
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
        InventoryId: {
          value: "",
          matchMode: FilterMatchMode.EQUALS,
        },
        Id: {
          value: "",
          matchMode: FilterMatchMode.EQUALS,
        },
        "User.Id": {
          value: "",
          matchMode: FilterMatchMode.EQUALS,
        },
      },

      lazyParams: {},
    };
  },
  methods: {
    exportCSV() {
            this.$refs.dt.exportCSV();
        },
    formatSecond(value){
        if (value == null) {
        return;
      }
      try {
        const secondsTotal = moment.duration(value).asSeconds();
const seconds = Math.floor(secondsTotal % 60).toString().padStart(2, '0');
const minutes = Math.floor((secondsTotal / 60) % 60).toString().padStart(2, '0');
const hours = Math.floor(secondsTotal / 3600).toString().padStart(2, '0');
const result = `${hours}:${minutes}:${seconds}`;
return result
      } catch {
        return value;
      }

    },
    formatDate(value) {
      if (value == null) {
        return;
      }
      try {
        const date = new Date(value);
        const formattedDate = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        return formattedDate;
      } catch {
        return value;
      }
    },
    loadLazyData() {
      this.blockedTable = true;
      this.lazyParams.filters.InventoryId.value = Number(
        this.$route.params.inventoryId
      );
      this.lazyParams.expand =
        "User($select=Id,FullName),Inventory($select=Id,Name),";
      this.InventoryUseTimeService.get(this.lazyParams).then((data) => {
        this.tableDatas = data.value;
        this.totalCount = data["@odata.count"];
        this.blockedTable = false;
        console.log(this.tableDatas);
        console.log(this.totalCount);
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
  components: {},
  created() {
    this.InventoryUseTimeService = new InventoryUseTimeService();
  },
  mounted() {
    this.blockedTable = true;
    this.lazyParams = {
      first: 0,
      rows: this.$refs.dt.rows,
      sortField: "StartDate",
      sortOrder: -1,
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
