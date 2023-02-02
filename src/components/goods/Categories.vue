<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加分类 -->
      <el-row>
        <el-col>
          <el-button class="addcate" type="primary" @click="showaddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        show-index
        border
        :selection-type="false"
        :show-row-hover="false"
        :expand-type="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted == false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="socpe">
          <el-tag size="mini" v-if="socpe.row.cat_level == 0">一级</el-tag>
          <el-tag size="mini" type="danger" v-else-if="socpe.row.cat_level == 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateFormClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!--options 用来指定数据源 -->
          <!--props 用来指定配置对象 -->
          <el-cascader
            expand-trigger="hover"
            v-model="selectCateKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="selectCateChange"
            clearable
            popper-class="cascader"
            ref="cascaderRef"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCates">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      // 请求参数
      queryInfo: {
        type: 3,
        // 当前页码值
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 5,
      },
      // 商品分类数据列表
      cateList: [],
      // 总数据
      total: 0,
      //table 指定列定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          // 自定义模板
          label: "是否有效",
          type: "template",
          // 模板名称
          template: "isok",
        },
        {
          // 自定义模板
          label: "排序",
          type: "template",
          // 模板名称
          template: "order",
        },
        {
          // 自定义模板
          label: "排序",
          type: "template",
          // 模板名称
          template: "opt",
        },
      ],
      // 控制分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类表单数据
      addCateForm: {
        //分类父 ID 为零时时一级
        cat_pid: 0,
        // 分类名称
        cat_name: "",
        //分类层级 默认为一级
        cat_level: 0,
      },
      // 添加分类表单验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 父级分类数据
      parentCateList: [],
      // 联级选择器配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        // 选中任意一级
        checkStrictly: true,
      },
      // 选中父级的id值
      selectCateKeys: [],
    };
  },
  computed: {},
  watch: {},
  //方法集合
  methods: {
    // 获取商品列表数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取数据失败");
      }
      // console.log(res.data);
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    // 监听pagesize变化
    handleSizeChange(newSzie) {
      this.queryInfo.pagesize = newSzie;
      this.getCateList();
    },
    // 监听pagenum变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    // 点击按钮 显示添加分类对话框
    showaddCateDialog() {
      // 获取父级分类数据
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    // 获取父级分类数据
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取数据失败");
      }
      this.parentCateList = res.data;
      // console.log(this.parentCateList);
    },
    //父级选择框发生变化时触发
    selectCateChange() {
      // 自动收到下拉框
      this.$refs.cascaderRef.dropDownVisible = false;
      // 当selectCateKeys 的长度大于0 时 则选中了父级 反之则没有
      if (this.selectCateKeys.length > 0) {
        // 父级分类id
        this.addCateForm.cat_pid =
          this.selectCateKeys[this.selectCateKeys.length - 1];
        // 当前层级
        this.addCateForm.cat_level = this.selectCateKeys.length;
      } else {
        // 否则为一级
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
      // console.log(this.selectCateKeys);
    },
    // 点击添加新的分类
    addCates() {
      console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status != 201) {
          return this.$message.error("添加商品分类失败");
        }
        this.getCateList();
        this.$message.success("添加商品分类成功");
      });

      this.addCateDialogVisible = false;
    },
    // 监听添加分类表单 重置
    addCateFormClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
      this.selectCateKeys = [];
    },
  },
  created() {
    this.getCateList();
  },
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有 keep-alive 缓存功能，这个函数会触发
};
</script>
<style lang='less' scoped>
.addcate {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>