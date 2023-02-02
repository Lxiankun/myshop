<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表区域 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="序号" width="50px"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status == '1'">已付款</el-tag>
            <el-tag type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFarmot }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog title="提示" :visible.sync="addressDialogVisible" width="40%" @close="addressVisibleClosed">
      <el-form :model="addressForm" :rules="addressRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address01">
          <el-cascader v-model="addressForm.address01" :options="cityData"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address02">
          <el-input v-model="addressForm.address02"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="40%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="progressVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import cityData from "@/components/order/citydata.js";
export default {
  components: {},
  props: {},
  data() {
    return {
      // 订单列表参数
      queryInfo: {
        query: "",
        //当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10,
      },
      total: 0,
      orderList: [],
      // 控制修改地址对话框显示与隐藏
      addressDialogVisible: false,
      // 对话框表单数据
      addressForm: {
        address01: [],
        address02: "",
      },
      // 表单验证规则
      addressRules: {
        address01: [
          { required: true, message: "请输入省市区/县", trigger: "blur" },
        ],
        address02: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },
      // 城市数据
      cityData,
      // 控制物流对话框的显示与隐藏
      progressVisible: false,
      progressInfo: [],
    };
  },
  computed: {},
  watch: {},
  //方法集合
  methods: {
    // 获取订单列表数据
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取数据失败");
      }
      this.total = res.data.total;
      this.orderList = res.data.goods;

      //   console.log(res.data);
      // console.log(this.orderList);
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    // 展示修改地址对话框
    showBox() {
      this.addressDialogVisible = true;
    },
    // 关闭时清空表单
    addressVisibleClosed() {
      this.$refs.addressFormRef.resetFields();
    },
    // 显示物流对话框
    async showProgressBox() {
      const { data: res } = await this.$http.get("/kuaidi/804909574412544580");
      if (res.meta.status != 200) {
        return this.$message.error("获取信息失败");
      }
      this.progressInfo = res.data;
      this.progressVisible = true;
    },
  },
  created() { },
  mounted() {
    // 获取订单列表数据
    this.getOrderList();
  },
  beforeCreate() { }, //生命周期 - 创建之前
  beforeMount() { }, //生命周期 - 挂载之前
  beforeUpdate() { }, //生命周期 - 更新之前
  updated() { }, //生命周期 - 更新之后
  beforeDestroy() { }, //生命周期 - 销毁之前
  destroyed() { }, //生命周期 - 销毁完成
  activated() { }, //如果页面有 keep-alive 缓存功能，这个函数会触发
};
</script>
<style lang='less' scoped>
.el-cascader {
  width: 100%;
}
</style>