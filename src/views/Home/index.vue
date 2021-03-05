<template>
  <div class="homesPages">
    <el-row>
      <el-col :span="16">
        <Header @emit:name="searchByName = $event" />
        <breadcrumb @c-change="changeMainComponent" :main="is_main" />
        <div class="contentLeftCart">
          <template v-if="is_main === 'home'">
            <contentLeftCart :name="searchByName" :refresh="refresh" />
          </template>
          <template v-else>
            <keyboard @c-change="changeMainComponent" />
          </template>
        </div>
      </el-col>
      <!-- end el-col  -->
      <el-col :span="8">
        <div class="ovHidden">
          <haederRight
            @c-change="changeMainComponent"
            @refresh:products="refresh = $event"
            :ordersQuantity="ordersQuantity"
          />
        </div>
      </el-col>
      <!-- end el-col  -->
    </el-row>
    <!-- row el-col  -->
  </div>
</template>

<script>
import Header from "../../components/Header";
import haederRight from "../../components/haederRight";
import contentLeftCart from "../../components/contentLeftCart";
import keyboard from "../../components/keyboard ";
import Breadcrumb from "../../components/Breadcrumb";
import auth from "../../api/auth/auth";
import authUtil from "../../utils/auth";
import request from "../../utils/request";

export default {
  data() {
    return {
      is_main: "home",
      ordersQuantity: 0,
      refresh: false,
      searchByName: ""
    };
  },
  name: "homesPages",
  components: {
    Breadcrumb,
    Header,
    haederRight,
    contentLeftCart,
    keyboard
  },
  asyncComputed: {
    async getOrdersQuantity() {
      this.$store.dispatch("order/getCount");
    }
  },
  async created() {
    await auth
      .auth()
      .then(async res => {
        if (res.status === 200) {
          const permissions = res.data.result.data.role.permissions;
          this.$store.dispatch("auth/savePermissions", permissions);
        }
      })
      .catch(err => {
        authUtil.clearStorge();
        this.$router.push({ name: "login" });
      });
    await request
      .get("/currencies/inventory")
      .then(async res => {
        if (res.status === 200) {
          const { result } = res.data;
          this.$store.dispatch("cart/saveCurrency", result.data.currencies);
        }
      })
      .catch();
  },
  methods: {
    changeMainComponent(e) {
      this.is_main = e;
    }
  }
};
</script>
