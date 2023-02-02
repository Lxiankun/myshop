<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="roleDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table border stripe :data="roleList">
        <!-- 展开内容 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              :class="['bdbot', index1 == 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限和三级权限 -->
              <el-col :span="19">
                <!-- 渲染二级权限 -->
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 == 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column
          type="index"
          label="序号"
          width="50px"
        ></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column width="300px" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditRole(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="roleDialogVisible"
      width="40%"
      @close="roleDialogClosed"
    >
      <el-form
        :model="addRoleForm"
        :rules="roleFromRules"
        ref="roleFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editRoleForm"
        :rules="editFromRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightClosed"
    >
      <!-- 分配权限树形结构 -->
      <el-tree
        :data="setRightData"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="leafKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import rulesForm from "@/assets/rules/rulesForm.js";
export default {
  components: {},
  props: {},
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      // 控制添加角色对话框 显示月隐藏
      roleDialogVisible: false,
      //添加角色表单数据
      addRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      //添加角色表单验证规则
      roleFromRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
          {
            validator: rulesForm.FormValidate.Form().validateContacts,
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: false, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      // 修改角色表单数据
      editRoleForm: {},
      //编辑角色表单验证规则
      editFromRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
          {
            validator: rulesForm.FormValidate.Form().validateContacts,
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: false, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      // 控制编辑对话框 显示与隐藏
      editDialogVisible: false,
      // 控制分配权限对话框 显示与隐藏
      setRightDialogVisible: false,
      // 分配权限数据
      setRightData: [],
      // 树形控件绑定的对象
      treeProps: {
        children: "children",
        label: "authName",
      },
      // 树形控件 默认选中节点 id 数组
      leafKeys: [],
      // 当角色的id
      roleId: "",
    };
  },
  computed: {},
  watch: {},
  //方法集合
  methods: {
    // 获取角色列表数据
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200) {
        return this.$message.error("获取角色列表数据失败！");
      }

      this.roleList = res.data;
      // console.log(this.roleList);
    },
    // 重置添加角色对话框
    roleDialogClosed() {
      this.$refs.roleFormRef.resetFields();
    },
    // 点击确认添加角色信息
    addRole() {
      this.$refs.roleFormRef.validate(async (valid) => {
        if (!valid) return;

        const { data: res } = await this.$http.post("roles", this.addRoleForm);
        // console.log(res);
        if (res.meta.status != 201) {
          return this.$message.error("添加角色信息失败！");
        }

        this.$message.success("添加角色信息成功！");
        this.getRoleList();
      });
      this.roleDialogVisible = false;
    },
    // 重置编辑角色对话框
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //通过id 获取角色类别信息
    async showEditRole(id) {
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status != 200) {
        return this.$message.error("查询角色信息失败!");
      }
      this.editRoleForm = res.data;
      this.editDialogVisible = true;
      // console.log(this.editRoleForm);
    },
    // 修改角色信息
    editRole() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `roles/${this.editRoleForm.roleId}`,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc,
          }
        );
        if (res.meta.status != 200) {
          return this.$message.error("更新数据角色信息失败");
        }
        this.editDialogVisible = false;
        this.getRoleList();
        this.$message.success("更新角色信息成功");
      });
    },
    // 删除角色信息
    async removRole(id) {
      // console.log(id);
      const result = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // console.log(result);
      if (result != "confirm") {
        return this.$message.info("已取消删除操作");
      }

      const { data: res } = await this.$http.delete(`roles/${id}`);
      if (res.meta.status != 200) {
        return this.$message.error("角色删除失败");
      }
      this.getRoleList();
      this.$message.success("角色删除成功");
    },
    // 通过id 删除权限
    async removeRightById(role, rightId) {
      const result = await this.$confirm(
        "此操作将永久删除该内容, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (result != "confirm") {
        return this.$message.info("已取消操作");
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );

      role.children = res.data;
    },
    // 显示分配权限对话框
    async setRightDialog(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status != 200) {
        return this.$message.error("获取权限数据失败");
      }
      this.setRightData = res.data;
      // console.log(this.setRightData);
      // 递归获取三级权限
      this.getLeafKeys(role, this.leafKeys);
      this.setRightDialogVisible = true;
    },
    // 利用递归 获取到三级权限的 id 并保存到 treeDefaultRight中
    getLeafKeys(node, arr) {
      // 如果当前node 节点不包含children 说明是三级权限
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    // 监听 分配权限对话框
    setRightClosed() {
      this.leafKeys = [];
    },
    // 点击分配权限
    async allRights() {
      const allId = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      // console.log(allId);
      const rIds = allId.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: rIds }
      );

      if (res.meta.status != 200) {
        return this.$message.err("角色权限分配失败");
      }
      this.getRoleList();
      this.setRightDialogVisible = false;
    },
  },
  created() {},
  mounted() {
    this.getRoleList();
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
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbot {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>