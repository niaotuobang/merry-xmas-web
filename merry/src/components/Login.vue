<template>
  <div class="main">
    <div class="col-md-4">
      <h4>Sign in</h4>
      <a-divider />
      <a-form
        id="formLogin"
        class="user-layout-login"
        ref="formLogin"
        :form="form"
        @submit="handleSubmit"
      >
        <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" message="login Failed." />
        <a-form-item>
          <a-input
            size="large"
            type="text"
            placeholder="username"
            v-decorator="[
              'username',
              {rules: [{ required: true}], validateTrigger: 'change'}
            ]"
          >
            <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input-password
            size="large"
            placeholder="password"
            v-decorator="[
              'password',
              {rules: [{ required: true}], validateTrigger: 'blur'}
            ]"
          >
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input-password>
        </a-form-item>
        <a-form-item style="margin-top:24px">
          <a-button
            size="large"
            type="primary"
            htmlType="submit"
            class="login-button"
            :loading="state.loginBtn"
            :disabled="state.loginBtn"
          >Login</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  data () {
    return {
      loginBtn: false,
      isLoginError: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        smsSendBtn: false
      }
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
      } = this
      state.loginBtn = true
      const validateFieldsKey = ['username', 'password'];
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const csrftoken = Cookies.get('csrftoken');
          console.log('login form', values, csrftoken);

          let body = new FormData();
          body.append('username', values.username);
          body.append('password', values.password);
          body.append('next', '/');

          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-CSRFTOKEN': csrftoken,
            },
          };

          this.$http.post(`/api/auth/login/`, body, config)
            .then(response => {
              const html = response.data;
              if (html.indexOf('Please enter a correct username and password') > 0){
                this.requestFailed('username or password not correct');
              } else {
                this.loginSuccess(response);
              }
            })
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 10000)
        }
      })
    },
    loginSuccess (res) {
      console.log(res);

      this.$router.push({ path: '/' })
      setTimeout(() => {
        console.log(this.currentUser);
        this.$notification.success({
          message: 'Success',
          description: `Login Success`
        })
      }, 1000)
      this.isLoginError = false
    },
    requestFailed (err) {
      this.isLoginError = true
      this.$notification['error']({
        message: 'Error',
        description: ((err.response || {}).data || {}).message || String(err),
        duration: 4
      })
    }
  },
  mounted (){
    this.$http.get(`/api/auth/login/`)
      .then(response => {console.log(response)})
      .catch(e => {console.log(e)});
  }
}
</script>
