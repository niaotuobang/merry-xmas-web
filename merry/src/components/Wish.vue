<template>
  <div class="wish-list">
    <div class="list" v-if="!isEdit">
      <h4>愿望清单</h4>
      <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="wishes">
        <a-list-item slot="renderItem" key="item.id" slot-scope="item">
          <a-divider />
          <p>第 {{item.id}} 个愿望</p>
          <p>填写时间： {{item.created_at.slice(0,19)}}</p>
          <p>我是: {{ item.author.username }}</p>
          <p>我的愿望的礼物是: {{ item.wish_gift }}</p>
          <p>我的愿望谁送给我: {{ item.wish_from }}</p>
          <p>而我准备送: {{ item.prepare_gift }}</p>
        </a-list-item>
      </a-list>
      <a-button @click="clickEdit" type="primary">我也要填写</a-button>
    </div>
    <div class="col-md-12" v-if="isEdit">
      <h4>填写愿望</h4>
      <a-divider />
      <p>期望收到的礼物(期望惊喜可不填):</p>
      <a-textarea :rows="1" v-model="editWish.wish_gift"/>
      <p>期望收到谁的礼物(填写英文, 期望随机可不填):</p>
      <a-select v-model="editWish.wish_from" >
        <a-select-option v-for="user in users" :key="user">
        {{ user.username }}
        </a-select-option>
      </a-select>
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
      users: [],
      wishes: [],
      page: 1,
      pagination: {
        onChange: page => {
          this.loadWishes(page);
          this.page = page;
        },
        pageSize: 1000,
      },
      isEdit: false,
      editWish: {
        wish_gift: null,
        wish_from: null,
        prepare_gift: null,
      },
    };
  },
  methods: {
    loadAllUsers() {
      this.$http.get(`/api/users`)
        .then(response => {
          this.users = response.data.results;
        })
        .catch(e => {
          console.log(e);
        })
    },
    loadWishes(page) {
      this.$http.get(`/api/wishes?page=${page}`)
        .then(response => {
          this.wishes = response.data.results;
          this.page = page;
        })
        .catch(e => {
          console.log(e);
        })
    },
    clickEdit() {
      this.isEdit = true;
    },
    handleEdit() {
      console.log("wish", this.editWish);
      const body = {
        wish_gift: this.editWish.wish_gift || '',
        wish_from: this.editWish.wish_from?this.editWish.wish_from.id:null,
        prepare_gift: this.editWish.prepare_gift || '',
      }
      this.$http.post(`/api/wishes/`, body)
        .then(response => {
          console.log(response)
          this.isEdit = false;
        })
        .catch(e => {
          console.log(e)
        });
    },
  },
  mounted() {
    this.loadAllUsers();
    this.loadWishes(1);
  },
}
</script>
