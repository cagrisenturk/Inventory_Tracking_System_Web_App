<template>
  <Toast />

  <div class="grid">
    <div :class="{ 'col-6': detailActive, 'col-12': !detailActive }">
      <Card>
        <template #title>
          Kullanıcı Tablosu
          <Button
            label="Ekle"
            icon="pi pi-plus"
            iconPos="left"
            style="float: right"
            v-on:click="addData()"
          />
        </template>
        <template #content>
          <DataTable
            :value="tableDatas"
            :lazy="true"
            :paginator="true"
            :rows="pageSize"
            v-model:filters="filters"
            ref="dt"
            dataKey="Id"
            :totalRecords="totalCount"
            :loading="blockedTable"
            @page="onPage($event)"
            @sort="onSort($event)"
            @filter="onFilter($event)"
            filterDisplay="row"
            responsiveLayout="scroll"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 20]"
            currentPageReportTemplate="{totalRecords} kayıttan {first} ile {last} arasındaki veriler "
            class="p-datatable-sm"
            :globalFilterFields="[
              'FullName',
              'Email',
              'LastLoginDate',
              'UserType',
              'PhoneNumber',
            ]"
            scrollDirection="horizontal"
            :scrollable="true"
          >
            <Column
              field="FullName"
              header="Adı-Soyadı"
              filterMatchMode="startsWith"
              ref="FullName"
              style="min-width: 200px"
            >
              <template #filter="{ filterModel, filterCallback }">
                <InputText
                  v-model="filterModel.value"
                  @keydown.enter="filterCallback()"
                  class="p-column-filter"
                  :placeholder="`Filtrele`"
                  v-tooltip.top.focus="'Filtrelemek için Enter tuşuna basınız'"
                />
              </template>
            </Column>

            <Column
              field="Email"
              header="Eposta Adresi"
              filterMatchMode="contains"
              ref="Email"
              style="min-width: 200px"
            >
              <template #filter="{ filterModel, filterCallback }">
                <InputText
                  type="text"
                  v-model="filterModel.value"
                  @keydown.enter="filterCallback()"
                  class="p-column-filter"
                  :placeholder="`Filtrele`"
                  v-tooltip.top.focus="'Filtrelemek için Enter tuşuna basınız'"
                />
              </template>
            </Column>

            <Column field="actions" header="İşlemler" style="min-width: 100px">
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
                  v-on:click="changeDetail(currentItem.data.Id)"
                ></Button>
                <Button
                  icon="pi pi-trash"
                  type="button"
                  class="p-button-text red"
                  v-on:click="deleteUser(currentItem.data.Id)"
                ></Button>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
    <div v-if="detailActive" class="col-12 md:col-6">
      <UserDetail :UserId="currentUserId" @refresh="refresh" @close="close">
      </UserDetail>
    </div>
  </div>
</template>
<script>
import UserService from "../../../service/setup/UserService";
import UserDetail from "./edit.vue";
import { FilterMatchMode } from "primevue/api";
export default {
  data() {
    return {
      blockedTable: false,
      currentUserId: 0,
      tableDatas: [],
      detailActive: false,
      pageSize: 10,
      totalCount: 0,
      lazyParams: {},
      filters: {
        FullName: { value: "", matchMode: FilterMatchMode.STARTS_WITH },
        Email: { value: "", matchMode: FilterMatchMode.CONTAINS },
      },
      UserTypes: ["Admin","Manager","OfficeUser"]
    };
  },
  methods: {
    openInfoPage(id) {
      this.$router.push("/User/infoUser/" + id + "");
    },
    loadLazyData() {
      this.blockedTable = true;
      console.log(JSON.stringify(this.lazyParams));
      this.UserService.get(this.lazyParams).then((data) => {
        this.tableDatas = data.value;
        this.totalCount = data["@odata.count"];
        this.blockedTable = false;
        console.log(data);
        console.log(this.totalCount);
      });
    },
    formatDate(value) {
      return value.toLocaleDateString("tr-TR", {
        minute: "2-digit",
        hour: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    addData() {
      this.close();
      this.openDetail(0);
    },
    openDetail(Id) {
      this.currentUserId = Id;
      this.detailActive = true;
    },
    changeDetail(currentID) {
      if (this.detailActive) {
        this.close();
        this.currentID = this.currentUserId;
        this.openDetail(currentID);
      }
      this.currentID = this.currentUserId;
      this.openDetail(currentID);
    },
    deleteUser(UserId) {
      var isOk = confirm("Silmek istediğinize emin misiniz?");
      if (!isOk) {
        return;
      }
      this.UserService.deleteUser(UserId).then((response) => {
        if (response) {
          this.$toast.add({
            severity: "success",
            summary: "Başarılı",
            detail: response.Message,
            life: 3000,
          });
          this.refresh();
        } else {
          this.$toast.add({
            severity: "error",
            summary: "Hata!",
            detail: response.Message,
            life: 3000,
          });
          return;
        }
      });
    },
    onPage(event) {
      this.lazyParams = event;
      console.log("sayfa değişti");
      this.loadLazyData();
    },
    onSort(event) {
      this.lazyParams = event;
      console.log("sıralama değişti");
      this.loadLazyData();
    },
    onFilter() {
      this.lazyParams.filters = this.filters;
      this.lazyParams.first = 0;
      console.log(this.lazyParams);
      this.loadLazyData();
    },
    refresh() {
      this.loadLazyData();
    },
    close() {
      console.log("kapandı");
      return (this.detailActive = false);
    },
  },
  components: {
    UserDetail: UserDetail,
  },
  created() {
    this.UserService = new UserService();
  },
  mounted() {
    this.blockedTable = true;
    this.lazyParams = {
      first: 0,
      rows: this.$refs.dt.rows,
      sortField: "Id",
      sortOrder: 1,
      filters: this.filters,
    };

    this.loadLazyData();
  },
};
</script>
<style>
.red {
  color: red !important;
}
</style>
