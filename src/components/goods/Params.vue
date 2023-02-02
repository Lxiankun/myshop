<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许为第三级参数设置相关参数"
        type="warning"
        closable
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择区域 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
            ref="cascaderRef"
            popper-class="cascader"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数区域 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加动态参数 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isAddBtnParams"
            @click="showAddDialogVisible"
            >添加参数</el-button
          >
          <!-- 动态参数列表 -->
          <el-table :data="manyTableDate" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="closeHandle(scope.row, index)"
                  >{{ item }}</el-tag
                >
                <!-- 文本框与button按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引 -->
            <el-table-column
              type="index"
              label="序号"
              width="50px"
            ></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditVialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加静态属性 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isAddBtnParams"
            @click="showAddDialogVisible"
            >添加属性</el-button
          >
          <!-- 静态属性列表 -->
          <el-table :data="onlyTableDate" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="closeHandle(scope.row, index)"
                  >{{ item }}</el-tag
                >
                <!-- 文本框与button按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引 -->
            <el-table-column
              type="index"
              label="序号"
              width="50px"
            ></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditVialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="`添加${titleText}`"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogVisibleClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="`添加${titleText}`"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogVisibleClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
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
      // 商品分裂数据
      cateList: [],
      //   级联选择框双向数据绑定
      selectedCateKeys: [],
      //级联选择器配置对象
      cateProps: {
        // 鼠标悬浮触发
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        // 选中任意一级
        checkStrictly: true,
      },
      //   tab 标签激活
      activeName: "many",
      // 动态参数数据
      manyTableDate: [],
      // 静态参数数据
      onlyTableDate: [],
      // 控制添加参数对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数表单数据
      addForm: {
        attr_name: "",
      },
      // 表单验证规则
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      // 修改对话框表单数据
      editForm: {
        attr_name: "",
      },
      // 修改表单验证规则
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    // 当selectedCateKeys的长度等于3是 则让添加按钮可以使用 false 否这禁用 true
    isAddBtnParams() {
      if (this.selectedCateKeys.length != 3) {
        return true;
      }
      return false;
    },
    // 三级id值
    cateId() {
      if (this.selectedCateKeys.length == 3) {
        return this.selectedCateKeys[2];
      }
    },
    // 提示标题 计算动态添加
    titleText() {
      if (this.activeName == "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
  watch: {},
  //方法集合
  methods: {
    // 获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status != 200) {
        return this.$message.error("获取数据失败");
      }
      this.cateList = res.data;
      //   console.log(this.cateList);
    },
    // 级联选择框发生变化时
    handleChange() {
      // console.log(this.selectedCateKeys);
      this.getParamsDate();
    },
    // tab 标签点击时触发
    handleTabClick() {
      // console.log(this.activeName);
      this.getParamsDate();
    },
    // 获取参数列表数据
    async getParamsDate() {
      // 自动收到下拉框
      this.$refs.cascaderRef.dropDownVisible = false;
      //   如果选中的不是三级分类
      if (this.selectedCateKeys.length != 3) {
        this.selectedCateKeys = [];
        this.manyTableDate = [];
        this.onlyTableDate = [];
        return;
      }
      // 选中的是三级标签
      //   console.log(this.selectedCateKeys);
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      );
      if (res.meta.status != 200) {
        return this.$message.error("获取数据失败");
      }
      // console.log(res.data);
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        // 控制文本框与按钮的显示与隐藏
        item.inputVisible = false;
        // 文本框数据
        item.inputValue = "";
      });
      // 判断是many数据 还是only 数据
      if (this.activeName == "many") {
        this.manyTableDate = res.data;
      } else {
        this.onlyTableDate = res.data;
      }
    },
    // 点击按钮显示对话框
    showAddDialogVisible() {
      this.addDialogVisible = true;
    },
    // 监听 对话框关闭时 重置表单
    addDialogVisibleClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮添加参数
    async addParams() {
      const { data: res } = await this.$http.post(
        `categories/${this.cateId}/attributes`,
        {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName,
        }
      );
      if (res.meta.status != 201) {
        return this.$message.error("参数添加失败");
      }

      this.getParamsDate();
      this.$message.success("参数添加成功");
      this.addDialogVisible = false;
    },
    // 点击编辑按钮显示修改对话框
    async showEditVialog(attr_id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName },
        }
      );
      if (res.meta.status != 200) {
        return this.$message.error("获取参数失败");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 监听修改对话框 关闭时重置表单
    editDialogVisibleClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 点击确定按钮修改参数
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status != 200) {
          return this.$message.error("修改参数失败");
        }
        this.getParamsDate();
        this.$message.success("修改参数成功");
      });

      this.editDialogVisible = false;
    },
    // 点击删除按钮 根据id删除数据
    async removeParams(attr_id) {
      // console.log(attr_id);
      //  删除提示
      const result = await this.$confirm(
        "此操作将永久删除该数据, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 用户取消删除操作
      if (result != "confirm") {
        return this.$message.info("用户已取消删除操作");
      }
      // console.log(result);
      // 删除业务逻辑
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );

      console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getParamsDate();
    },
    // 失去焦点与按下enter 执行
    handleInputConfirm(row) {
      // 当输入内容不合法时 清空
      if (row.inputValue.trim().length == 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      // 当输入内容合法时在做处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      // 发送请求保存数据
      this.saveOpt(row);
    },
    //发起请求，保存这次操作
    async saveOpt(row) {
      // 发起请求 保存数据
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status != 200) {
        return this.$message.error("修改失败");
      }
      // this.getParamsDate();
      this.$message.success("修改成功");
    },
    // 点击按钮切换到文本框
    showInput(row) {
      row.inputVisible = true;
      //让文本框自动获取焦点
      //nextTick 当页面上的元素重新渲染的时候重新获取焦点
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除对应的标签
    closeHandle(row, index) {
      row.attr_vals.splice(index, 1);
      this.saveOpt(row);
    },
  },
  created() {},
  mounted() {
    this.getCateList();
  },
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
.el-alert {
  margin-bottom: 15px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 100px;
}
</style>