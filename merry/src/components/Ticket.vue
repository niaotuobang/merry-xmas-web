<template>
  <div class="course-list">
    <div class="col-md-12">
      <h4>填写愿望</h4>
      <a-divider />
      <p>期望收到的礼物(期望惊喜可不填):</p>
      <a-textarea :rows="1" v-model="editWish.wish_gift"/>
      <p>期望收到谁的礼物(填写英文, 期望随机可不填):</p>
      <a-textarea :rows="1" v-model="editWish.wish_from"/>
      <p>地址涉及隐私可不填,请私聊</p>
      <p>我准备送(看人下菜可不填---"看人下菜" by腿毛):</p>
      <a-textarea :rows="1" v-model="editWish.prepare_gift"/>
      <a-button @click="handleEdit" type="primary">我TM提交</a-button>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      editWish: {
        wish_gift: null,
        wish_from: null,
        prepare_gift: null,
      },
    };
  },
  methods: {
    handleEdit() {
      console.log("wish", this.editWish);
      const body = {
        wish_gift: this.editWish.wish_gift || '',
        wish_from: this.editWish.wish_from || '',
        prepare_gift: this.editWish.prepare_gift || '',
      }
      this.$http.post(`/api/wishes/`, body)
        .then(response => {
          console.log(response)
        })
        .catch(e => {
          console.log(e)
        });
    },
  },
  mounted() {
  },
}
</script>
