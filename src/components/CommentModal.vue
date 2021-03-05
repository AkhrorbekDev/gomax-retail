<template>
  <div class="commentModal modal-center x-right-top">
    <el-dialog
      :visible="open"
      width="50%"
      :center="true"
      :before-close="handleClose"
      :title="$t('note')"
    >
      <el-input
        v-model="result.note"
        type="textarea"
        :rows="2"
        placeholder=""
        @change="result.note = $event"
      >
      </el-input>
      <div class="d-flex buttonSModal">
        <el-button type="success" @click="returnValue">{{
          $t("save")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VueTypes from "vue-types";

export default {
  name: "CommentModal",
  props: {
    open: VueTypes.bool.isRequired,
    note: VueTypes.string.isRequired,
    productId: VueTypes.number.isRequired
  },
  data() {
    return {
      result: {
        note: "",
        open: false,
        id: 0
      }
    };
  },
  watch: {
    note: {
      immediate: true,
      handler(newVal) {
        this.result.note = newVal;
      }
    }
  },
  methods: {
    returnValue() {
      this.result.open = false;
      this.result.id = this.productId;
      this.$emit("change:note", this.result);
    },
    handleClose(done) {
      this.result.note = this.note;
      done();
      this.$emit("modal:close", false);
    }
  }
};
</script>

<style scoped></style>
