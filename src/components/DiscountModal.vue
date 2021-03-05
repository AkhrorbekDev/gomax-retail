<template>
  <div class="discountModal modal-center x-right-top">
    <el-dialog
      :visible="open"
      width="50%"
      :center="true"
      :before-close="handleClose"
      :title="$t('discount')"
    >
      <el-input-number
        v-model="result.discount"
        :min="0"
        :max="100"
        @change="setDiscount"
        @keydown.enter.native="returnValues"
      ></el-input-number>
      <div class="d-flex buttonSModal">
        <el-button type="success" @click="returnValues">{{
          $t("save")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VueTypes from "vue-types";

export default {
  name: "DiscountModal",
  props: {
    open: VueTypes.bool.isRequired,
    discount: VueTypes.number.isRequired,
    productId: VueTypes.oneOfType([VueTypes.string, VueTypes.number]).isRequired
  },
  data() {
    return {
      result: {
        discount: 0,
        id: null,
        open: true
      }
    };
  },
  watch: {
    discount: {
      immediate: true,
      handler(newVal) {
        this.result.discount = newVal;
      }
    }
  },
  methods: {
    returnValues() {
      this.result.id = this.productId;
      this.result.open = false;
      this.$emit("change:discount", this.result);
      this.result.discount = 0;
    },
    setDiscount(newVal) {
      this.result.discount = newVal;
    },
    handleClose(done) {
      done();

      this.$emit("modal:close", false);
    }
  }
};
</script>

<style scoped></style>
