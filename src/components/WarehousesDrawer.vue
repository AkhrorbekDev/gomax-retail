<template>
  <el-drawer
    :visible="open"
    :with-header="false"
    size="33%"
    :before-close="handleClose"
    @open="getWarehouses"
    @opened="selectDefaults"
  >
    <div class="clents-blocks">
      <div class="title-modal">
        <div class="ml-20 flex1">
          {{ $t('warehouse') }}
        </div>
        <el-button
          class="bg-success"
          style="margin-right: 1vw"
          @click="sendWarehouse"
        >
        {{ $t('save') }}
        </el-button>
        <el-button
          style="margin-right: 1vw"
          @click="$emit('drawer:close', false)"
        >
          {{ $t('close') }}
        </el-button>
      </div>
      <div v-loading="is_loading">
        <div v-if="!warehouses">
          <p class="notify_title">
            Склады по продукту {{ product.name }} не найден
          </p>
        </div>
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>
                <label class="form-checkbox">
                  <input v-model="selectAll" type="checkbox" @click="select" />
                  <i class="form-icon"></i>
                </label>
              </th>
              <th>{{ $t('warehouse') }}</th>
              <th>{{ $t('remainder') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="warehouse in warehouses" :key="warehouse.id">
              <td>
                <label class="form-checkbox">
                  <input
                    v-model="selected"
                    type="checkbox"
                    :value="warehouse.id"
                    :disabled="warehouse.total_remainder === 0"
                  />
                  <i class="form-icon"></i>
                </label>
              </td>
              <td>{{ warehouse.name }}</td>
              <td>{{ warehouse.total_remainder }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import VueTypes from "vue-types";
import { filter, sortBy, flatMap, includes } from "lodash";
import Warehouse from "../api/Warehouse";
import auth from "../utils/auth";

export default {
  props: {
    open: VueTypes.bool.isRequired,
    item: VueTypes.object.isRequired
  },
  data() {
    return {
      selectedWarehouses: [],
      is_loading: false,
      selected: [],
      selectAll: false,
      warehouses: []
    };
  },
  watch: {
    item: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.is_loading = true;
        }
      }
    },
    selected: {
      deep: true,
      handler(newVal, oldVal) {
        if (
          this.warehouses.length > 0 &&
          this.warehouses.length === newVal.length
        ) {
          this.selectAll = true;
        } else {
          this.selectAll = false;
        }
      }
    }
  },
  methods: {
    select() {
      this.selected = [];
      if (!this.selectAll) {
        for (let i in this.warehouses) {
          if (this.warehouses[i].total_remainder > 0) {
            this.selected.push(this.warehouses[i].id);
          }
        }
      }
    },
    selectable(row, index) {
      if (row.total_remainder !== 0 || row.is_true === true) {
        return true;
      } else {
        return false;
      }
    },
    getWarehouses() {
      const clientShop = auth.getShop();
      Warehouse.getWarehouses({
        product_id: this.item.product.id,
        shop_id: clientShop
      })
        .then(res => {
          const { result } = res.data;
          this.warehouses = result.data.warehouses;
          this.is_loading = false;
          return result.data.warehouses;
        })
        .catch(err => {
          this.is_loading = false;
        });
    },
    selectDefaults() {
      this.selected = [];
      const warehouseIds = flatMap(this.item.warehouses, "id");
      this.selected = warehouseIds;
    },
    sendWarehouse() {
      if (this.selected.length) {
        const warehouses = filter(this.warehouses, warehouse =>
            includes(this.selected, warehouse.id)
          ),
          id = this.item.product.id;
        const data = {
          warehouses,
          open: false,
          id
        };
        return this.$emit("change:warehouse", data);
      } else {
        return this.$emit("drawer:close", false);
      }
    },
    handleClose(done) {
      done();
      this.selected = [];
      return this.$emit("drawer:close", false);
    },
    selectWarehouses(val) {
      this.selectedWarehouses = val;
    }
  }
};
</script>

<style scoped>
.notify_title {
  color: black;
  text-align: center;
}

.table {
  border-collapse: collapse;
  border-spacing: 0;
  text-align: left;
  width: 100%;
  color: black;
}
.table th {
  border-bottom-width: 0.1rem;
}

.table td,
.table th {
  border-bottom: 0.05rem solid #dadee4;
  padding: 0.6rem 0.4rem;
}
.table.table-hover tbody tr:hover {
  background: #eef0f3;
}
.form-checkbox,
.form-radio,
.form-switch {
  display: block;
  line-height: 1.2rem;
  margin: 0.2rem 0;
  min-height: 1.4rem;
  padding: 0.1rem 0.4rem 0.1rem 1.2rem;
  position: relative;
}
</style>
