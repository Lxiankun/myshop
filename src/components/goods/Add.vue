<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警示框 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="actIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFomrRules" ref="addFormRef" label-width="100px" class="demo-ruleForm"
        label-position="top">
        <!-- tabs 栏 -->
        <el-tabs tab-position="left" v-model="actIndex" :before-leave="beforeTabsLeave" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cateProps" @change="handleChange"
                ref="cascaderRef" popper-class="cascader"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyData" :key="item.attr_id">
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="ite" v-for="(ite, ind) in item.attr_vals" :key="ind" border>
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片 -->
            <!-- action 图片上传的api地址 -->
            <el-upload class="upload-demo" :action="uploadUrl" :on-preview="handlePreview" :on-remove="handleRemove"
              list-type="picture" :headers="headersObj" :on-success="uploadSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品内容按钮 -->
            <el-button type="primary" class="qubtn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览区域 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  components: {},
  props: {},
  data() {
    return {
      // 商品步骤条激活状态
      actIndex: "0",
      // 添加商品表单数据
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品分类数组
        goods_cat: [],
        // 图片
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      // 表单验证规则
      addFomrRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请输入选择商品类型", trigger: "blur" },
        ],
      },
      // 商品分类数据
      cateList: [],
      // 商品级联选择器配置对象
      cateProps: {
        // 鼠标悬浮触发
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        // 选中任意一级
        checkStrictly: true,
      },
      // 动态参数
      manyData: [],
      // 静态属性
      onlyData: [],
      // 图片上传的地址
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 图片预览路径
      previewPath: "",
      // 图片对话框的显示与隐藏
      previewVisible: false,
    };
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length == 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
  watch: {},
  //方法集合
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status != 200) {
        return this.$message.error("获取商品分裂失败");
      }
      this.cateList = res.data;
      // console.log(this.cateList);
    },
    // 级联选择器
    handleChange() {
      // 自动收到下拉框
      this.$refs.cascaderRef.dropDownVisible = false;
      // 只允许三级分类
      if (this.addForm.goods_cat.length != 3) {
        this.addForm.goods_cat = [];
      }
    },
    // 阻止tab
    beforeTabsLeave(activeName, oldActiveName) {
      if (oldActiveName == "0" && this.addForm.goods_cat.length != 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    async tabClick() {
      // 证明获取的是动态参数面板
      if (this.actIndex == "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "many" } }
        );
        if (res.meta.status != 200) {
          return this.$message.error("获取参数失败");
        }
        // console.log(res.data);
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length == 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyData = res.data;
      } else if (this.actIndex == "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "only" } }
        );
        if (res.meta.status != 200) {
          return this.$message.error("获取属性失败");
        }
        console.log(res.data);
        this.onlyData = res.data;
      }
    },
    // 预览图片
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    // 移出图片操作
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex((x) => {
        x.pic == filePath;
      });
      this.addForm.pics.splice(i, 1);
      // console.log(this.addForm);
    },
    // 图片上传成功
    uploadSuccess(response) {
      // 拼接一个图片对象
      const picInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
      // console.log(1111);
      // console.log(this.addForm);
    },
    // 提交验证
    async add() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必要选项");
        }
        // 执行添加商品
        // 用深拷贝 复制 addForm
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
        // 处理动态参数
        this.manyData.forEach((item) => {
          const newManyData = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(newManyData);
        });
        // 处理静态属性
        this.onlyData.forEach((item) => {
          const newOnlyData = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addForm.attrs.push(newOnlyData);
        });
        form.attrs = this.addForm.attrs;
        // console.log(form);
        // 发起请求 添加商品 名称唯一
        const { data: res } = await this.$http.post("goods", form);
        if (res.meta.status != 201) {
          return this.$message.error("添加商品失败");
        }
        this.$message.success("添加商品成功");
        this.$router.push("/goods");
      });
    },
  },
  created() { },
  mounted() {
    // 获取商品分类
    this.getCateList();
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
.el-checkbox {
  margin-right: 5px;
}

.previewImg {
  width: 100%;
}

.qubtn {
  margin-top: 15px;
}
</style>