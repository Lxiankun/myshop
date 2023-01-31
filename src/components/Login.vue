<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <!-- <div class="profile_box">
        <img src="@/assets/logo.png" alt="" />
      </div> -->
      <!-- 表单登录区域 -->
      <el-form
        label-width="0"
        :model="formLabelAlign"
        class="login_form"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="formLabelAlign.username"
            prefix-icon="iconfont icon-user"
            placeholder="用户名"
            clearable
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="formLabelAlign.password"
            prefix-icon="iconfont icon-tianchongxing-"
            placeholder="密码"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 登录重置按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      // 表单数据
      formLabelAlign: {
        username: "admin",
        password: "123456",
      },
      // 表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 2, max: 12, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  //方法集合
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "login",
          this.formLabelAlign
        );
        if (res.meta.status != 200) {
          this.$message.error("数据获取失败");
        }
        window.sessionStorage.setItem("token", res.data.token);
        this.$message.success("登录成功");
        this.$router.push("/home");
      });
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang='less' scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_box {
    width: 450px;
    height: 300px;
    border-radius: 3px;
    background-color: #fff;
    position: relative;
    .profile_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      > img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_form {
      position: absolute;
      bottom: 35px;
      padding: 0 20px;
      width: 100%;
      box-sizing: border-box;
      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>