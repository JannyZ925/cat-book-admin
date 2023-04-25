<template>
  <div class="tip-module">
    <div class="header">
      <el-button type="primary" @click="handleAdd">添加</el-button>
      <el-input placeholder="请输入模块名字" v-model="params.name" clearable />
    </div>

    <!-- 模块信息表格 -->
    <el-table
      :data="tipModuleList"
      style="width: 100%"
      border
      :max-height="450"
    >
      <el-table-column
        label="名字"
        prop="name"
        width="auto"
        min-width="3%"
        align="center"
      >
      </el-table-column>
      <el-table-column label="操作" align="center" width="auto" min-width="10%">
        <template #default="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
            >修改模块名称</el-button
          >
          <el-button size="mini" type="primary" @click="handleManageDetail(scope.$index, scope.row)">详细信息管理</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="params.pageSize"
      v-model:current-page="params.pageNum"
    />
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, watch } from "vue";
import {
  getTipModuleList,
  addTipModule,
  deleteModuleById,
  updateTipModule,
} from "@/api/tipModule";
import { ElMessageBox, ElMessage } from "element-plus";
import { useRouter } from 'vue-router';
export default {
  setup() {
    let state = reactive({
      router: useRouter(),
      params: {
        pageNum: 1,
        pageSize: 5,
        name: "",
      },
      tipModuleList: [],
      total: 0,
    });

    watch(
      [() => state.params.pageNum, () => state.params.name],
      () => {
        reqTipModuleList();
      }
    );

    async function reqTipModuleList() {
      let { tipModuleList } = await getTipModuleList(state.params);
      state.tipModuleList = tipModuleList.list;
      state.total = tipModuleList.total;
    }

    // 添加模块
    function handleAdd() {
      ElMessageBox.prompt("请输入模块名称", "添加模块", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(async ({ value }) => {
          await addTipModule(value);
          ElMessage({
            type: "success",
            message: `添加成功！`,
          });
          reqTipModuleList();
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消",
          });
        });
    }

    // 修改模块名称
    function handleEdit(index, module) {
      ElMessageBox.prompt("请输入模块名称", "修改模块名称", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(async ({ value }) => {
          module.name = value;
          await updateTipModule(module);
          ElMessage({
            type: "success",
            message: `修改成功！`,
          });
          reqTipModuleList();
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消",
          });
        });
    }

    async function handleDelete(inde, module) {
      ElMessageBox.confirm("确认删除吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await deleteModuleById(module.id);
          ElMessage({
            type: "success",
            message: "删除成功!",
          });
          reqTipModuleList();
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消",
          });
        });
      
    }

    function handleManageDetail(index, module) {
      state.router.push({
        name: "tips",
        params: {
          moduleId: module.id
        }
      })
    }

    onMounted(() => {
      reqTipModuleList();
    });

    return {
      ...toRefs(state),
      handleAdd,
      handleEdit,
      handleDelete,
      handleManageDetail
    };
  },
};
</script>

<style lang="scss" scoped>
.tip-module {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;

  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .el-input {
      width: 200px;
      height: 40px;
    }
  }
}
</style>