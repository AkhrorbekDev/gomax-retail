<template>
  <el-drawer
    title="I am the title"
    :visible="open"
    :with-header="false"
    :before-close="handleClose"
    direction="rtl"
    size="33%"
    @open="debouncedLoadModel"
    class="drawer"
  >
    <div class="clents-blocks">
      <div class="title-modal">
        <p class="flex1">{{ $t("client") }}</p>
        <el-button
          v-can="create"
          style="margin-right: 1vw"
          @click="clientModal = true"
        >
          {{ $t("add") }}
        </el-button>
        <el-button
          style="margin-right: 1vw"
          @click="$emit('drawer:close', false)"
        >
          {{ $t("close") }}
        </el-button>
      </div>
      <el-form ref="form" :model="form">
        <div class="d-flex style-scorch-form">
          <el-form-item class="input-poli">
            <el-input
              suffix-icon="el-icon-search"
              v-model="search"
              @keydown.enter.native="onEnter"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        @current-change="returnValue"
      >
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="phone" :label="$t('number')"></el-table-column>
        <el-table-column prop="name" :label="$t('client')"></el-table-column>
      </el-table>

      <el-drawer
        :visible="clientModal"
        :with-header="false"
        direction="ttb"
        :append-to-body="true"
        :before-close="closeDrawerIn"
        size="33%"
      >
        <div class="title-modal">
          <div class="ml-20 flex1">{{ $t("addClient") }}</div>
          <el-button
            style="margin-right: 1vw"
            type="success"
            @click="addNewClient"
          >
            {{ $t("add") }}
          </el-button>
          <el-button style="margin-right: 1vw" @click="clientModal = false">
            {{ $t("close") }}
          </el-button>
        </div>
        <el-form
          ref="form"
          :model="form"
          class="add-clent-form"
          @keydown.enter.native="onEnter"
        >
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item class="add-clent">
                <el-input
                  v-model="form.name"
                  :placeholder="$t('namePerson')"
                ></el-input>
              </el-form-item>
              <el-form-item class="add-clent">
                <el-date-picker
                  v-model="form.date_of_birth"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :placeholder="$t('birthday')"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item class="add-clent">
                <el-input
                  v-model="form.phone"
                  :placeholder="$t('phone')"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-drawer>
    </div>
  </el-drawer>
</template>

<script>
import VueTypes from "vue-types";
import Client from "../api/Client";
import auth from "../utils/auth";
import { debounce, includes, map } from "lodash";
import { mapGetters } from "vuex";

export default {
  name: "ClientsDrawer",
  props: {
    open: VueTypes.bool.isRequired
  },
  data() {
    return {
      form: {
        name: "",
        phone: "",
        date_of_birth: null
      },
      create: false,
      search: "",
      clientModal: false,
      tableData: []
    };
  },
  watch: {
    search: {
      handler(newVal, oldVal) {
        this.debouncedLoadModel();
      }
    },
    permissions: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.create = includes(
            map(this.permissions, "slug"),
            "retailClients.create"
          );
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      hasPermission: "auth/hasRole",
      permissions: "auth/getPermissions"
    })
  },
  created() {
    this.debouncedLoadModel = debounce(this.loadModel, 1000);
  },
  methods: {
    async loadModel() {
      const { data: response } = (
        await Client.getClient({ search: this.search })
      ).data.result;
      this.tableData = response.retailClients;
    },
    onEnter(event) {
      event.preventDefault();
    },
    returnValue(e) {
      this.$emit("drawer:close", false);
      return this.$emit("change:client", e);
    },
    closeDrawerIn(done) {
      done();
      this.clientModal = false;
      this.form = {};
    },
    handleClose(done) {
      this.search = "";
      done();
      return this.$emit("drawer:close", false);
    },
    onEnter(event) {
      event.preventDefault();
    },
    async addNewClient() {
      if (this.form.name) {
        const loading = this.$loading({
          customClass: "login-loading",
          lock: true,
          text: "Загрузка",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        let is_loading = true;

        const data = {
          ...this.form,
          shop_id: auth.getShop()
        };
        await Client.createClient(data)
          .then(response => {
            if (response.status === 200) {
              const { result } = response.data;
              if (result.success) {
                this.$notify({
                  type: "success",
                  message: result.message
                });
                this.tableData.push(result.data.retailClient);
                loading.close();
                (this.form = {
                  name: "",
                  phone: "",
                  date_of_birth: null
                }),
                  (is_loading = false);
                this.clientModal = false;
                this.returnValue(result.data.retailClient);
                return;
              }
            }
          })
          .catch(err => {
            loading.close();
            is_loading = false;
            if (err.response && err.response.status === 422) {
              let ms = "";
              for (const key in err.response.data.validation_errors) {
                if (err.response.data.validation_errors.hasOwnProperty(key)) {
                  const element = err.response.data.validation_errors[key];
                  ms += element.join("<br>") + "<br>";
                }
              }
              this.$message({
                dangerouslyUseHTMLString: true,
                type: "warning",
                title: this.$t("warning"),
                message: ms,
                duration: 15000,
                showClose: true
              });
            } else {
              this.$message({
                dangerouslyUseHTMLString: true,
                type: "warning",
                title: this.$t("warning"),
                message: err.message,
                showClose: true
              });
            }
          });
      } else {
        this.clientModal = false;
      }
    }
  }
};
</script>

<style scoped>
.drawer {
  overflow-y: scroll;
}
</style>
