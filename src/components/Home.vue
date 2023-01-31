<template>
  <div class="home">
    <el-container class="home_container">
      <el-header>
        <div>
          <img src="@/assets/homeLogo.png" alt="" />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="loginOut">退出登录</el-button>
      </el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  //方法集合
  methods: {
    loginOut() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang='less' scoped>
.home {
  height: 100%;
  .home_container {
    height: 100%;
  }
}
.el-header {
  background-color: #363d40;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  color: #fff;
  font-weight: bold;
  > div {
    display: flex;
    align-items: center;
    > img {
      width: 45px;
      margin-right: 20px;
    }
  }
}
.el-aside {
  background-color: #313743;

  .el-menu {
    // 解决1px elementui出现展开后子菜单宽度多出1px问题
    border: none;
    border-right-width: 0;
    .iconfont {
      margin-right: 10px;
    }
  }
  .toggle_btn {
    background-color: #475163;
    text-align: center;
    line-height: 24px;
    font-size: 10px;
    color: #fff;
    letter-spacing: 2px;
    cursor: pointer;
  }
}
.el-main {
  background-color: #e9edf1;
}
</style>