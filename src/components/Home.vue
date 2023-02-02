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
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <!-- 折叠 -->
          <div class="toggle_btn" @click="toggleCollapse">|||</div>
          <el-menu
            class="el-menu-vertical-demo"
            background-color="#313743"
            text-color="#fff"
            active-text-color="#409EFF"
            unique-opened
            :collapse-transition="false"
            router
            :default-active="pathState"
            :collapse="isCollapse"
          >
            <el-submenu
              :index="`${item01.id}`"
              v-for="item01 in menuList"
              :key="item01.id"
            >
              <template slot="title">
                <i :class="iconsObj[item01.id]"></i>
                <span>{{ item01.authName }}</span>
              </template>
              <el-menu-item
                :index="`/${item02.path}`"
                v-for="item02 in item01.children"
                :key="item02.id"
                @click="saveNavPath(`/${item02.path}`)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ item02.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      menuList: [],
      iconsObj: {
        125: "iconfont icon-users",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      pathState: "",
      // 是否折叠
      isCollapse: false,
    };
  },
  computed: {},
  watch: {},
  //方法集合
  methods: {
    loginOut() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    async getMenuData() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status != 200) {
        return this.$message.error("获取菜单数据失败");
      }
      this.menuList = res.data;
      // console.log(this.menuList);
    },
    saveNavPath(navState) {
      window.sessionStorage.setItem("pState", navState);
      this.pathState = navState;
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
  created() {},
  mounted() {
    this.getMenuData();
    this.pathState = window.sessionStorage.getItem("pState");
  },
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