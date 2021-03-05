<template>
  <div class="itme-praductos">
    <el-row>
      <el-col :span="3">
        <el-button
          type="warning"
          icon="el-icon-edit"
          circle
          @click="
            $emit('emitComment', { id: item.product.id, note: item.note })
          "
        >
        </el-button>
      </el-col>
      <el-col :span="3">
        <el-badge v-if="item.discount > 0" :value="item.discount">
          <el-button
            type="success"
            icon="el-icon-discount"
            circle
            :disabled="!item.product.totalRemainder"
            @click="
              $emit('emitDiscount', {
                id: item.product.id,
                discount: item.discount
              })
            "
          >
          </el-button>
        </el-badge>
        <el-button
          v-else
          type="success"
          icon="el-icon-discount"
          circle
          :disabled="!item.product.totalRemainder"
          @click="
            $emit('emitDiscount', {
              id: item.product.id,
              discount: item.discount
            })
          "
        >
        </el-button>
      </el-col>
      <el-col :span="3">
        <el-button
          type="primary"
          icon="el-icon-box"
          circle
          @click="$emit('emitWarehouses', item)"
        >
        </el-button>
      </el-col>
      <el-col :span="12">
        <el-input-number
          v-model="item.quantity"
          :disabled="!item.product.totalRemainder"
          :min="0"
          @change="
            $emit('emitQuantity', {
              item_id: item.id,
              id: item.product.id,
              value: $event
            })
          "
        ></el-input-number>
      </el-col>
      <el-col :span="3">
        <el-button
          v-can="permissions.delete"
          type="danger"
          icon="el-icon-delete"
          circle
          @click="$emit('removeProduct', { id: item.id })"
        />
      </el-col>
      <el-col v-if="item.warehouses.length > 0" :span="24" class="discount_tip">
        {{
          item.warehouses.length > 1
            ? item.warehouses[0].name + ` +${item.warehouses.length - 1}`
            : item.warehouses[0].name
        }}
        {{ item.product.totalRemainder }}
        <b>{{
          item.product.measurement ? item.product.measurement.name : ""
        }}</b>
      </el-col>
      <el-col v-else :span="24" class="discount_tip">
        {{ $t("noProducts") }}
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VueTypes from "vue-types";
export default {
  name: "CartItem",
  props: {
    item: VueTypes.object,
    permissions: VueTypes.object
  }
};
</script>

<style></style>
