<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
        <router-link class="navbar-brand" to="/">主页</router-link>
        <router-link class="navbar-brand" to="/wish">愿望</router-link>
        <router-link class="navbar-brand" to="/ticket">抽奖</router-link>
        <div class="navbar-collapse collapse w-100 order-3 dual-collapse2">
            <ul class="navbar-nav ml-auto">
                <li v-if="currentUser">
                    <p class="nav-link">{{ currentUser.username }}</p>
                </li>
                <li v-if="currentUser" class="nav-item">
                    <a class="nav-link" @click="logOut">退出登录</a>
                </li>
                <li v-else class="nav-item">
                  <router-link to="/login" class="nav-link">登录</router-link>
                </li>
            </ul>
        </div>
    </nav>
    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  methods: {
    loadCurrentUser() {
        this.$http.get(`/api/whoami`)
        .then(response => {
            this.currentUser = response.data;
        })
        .catch(e => {
            this.currentUser = null;
            console.log(e);
        })
        .finally(() => {
            this.$localStorage.set('currentUser', this.currentUser);
        });
    },
    isHome() {
        return this.$route.path === '/';
    },
    logOut(){
        console.log("logOut");
        this.$http.get(`/api/auth/logout/`)
        .then(response => {
            console.log(response);
        })
        .catch(e => {
            console.log(e);
        })
        .finally(() => {
            this.loadCurrentUser();
        })
    }
  },
  mounted() {
    this.loadCurrentUser();
  },
}
</script>
