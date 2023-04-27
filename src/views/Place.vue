<template>
    <div class="place">
      <div class="header">
        <el-button type="primary" @click="showAddDialog">添加</el-button>
        <el-input placeholder="请输入地点名称" v-model="params.name" clearable />
      </div>
  
      <el-table :data="placeList" style="width: 100%" border :max-height="450">
        <el-table-column
          label="地点名称"
          prop="name"
          width="auto"
          min-width="5%"
          align="center"
        >
        </el-table-column>
        
        <el-table-column label="操作" align="center" width="auto" min-width="10%">
          <template #default="scope">
            <el-button
              size="mini"
              type="primary"
              @click="showEditDialog(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
  
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="params.pageSize"
        v-model:current-page="params.pageNum"
      />
  
      <!-- 添加或编辑地点的弹窗 -->
      <el-dialog :title="dialogData.title" v-model="dialogData.visible">
        <el-form :model="formData">
          <el-form-item label="地点名称">
            <el-input v-model="formData.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogData.visible = false">取 消</el-button>
            <el-button
              v-show="dialogData.title === '添加地点'"
              type="primary"
              @click="handleAdd"
              >确 定</el-button
            >
            <el-button
              v-show="dialogData.title === '编辑地点'"
              type="primary"
              @click="handleEdit"
              >修 改</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { onMounted, reactive, toRefs, watch } from "vue";
  import { useRoute } from "vue-router";
  import { ElMessageBox, ElMessage } from "element-plus";
  import { getPlaceListByPage, addPlace, deletePlaceById, updatePlace } from "@/api/place.js"
  
  export default {
    setup() {
      let state = reactive({
        params: {
          pageNum: 1,
          pageSize: 2,
          name: ""
        },
        placeList: [],
        total: 0,
        route: useRoute(),
  
        // 添加或编辑信息弹窗的相关数据
        dialogData: {
          title: "",
          visible: false,
        },
  
        // 添加或编辑地点弹窗的表单
        formData: {
          name: ""
        },
      });
  
      watch([() => state.params.name, () => state.params.pageNum], () => {
        reqPlaceList();
      });
  
      watch(
        () => state.dialogData.visible,
        (newValue) => {
          if (newValue === false)
            // 清空表单中的信息
            Object.keys(state.formData).forEach((key) => (state.formData[key] = ""));
        }
      );
  
      function showAddDialog() {
        state.dialogData.title = "添加地点";
        state.dialogData.visible = true;
      }
  
      function showEditDialog(index, row) {
        state.dialogData.title = "编辑地点";
        state.dialogData.visible = true;
        Object.assign(state.formData, row);
      }
  
      async function handleAdd() {
        let res = await addPlace(state.formData);
        if (res) {
          ElMessage({
            type: "success",
            message: "添加成功！",
          });
          state.dialogData.visible = false;
          await reqPlaceList();
        }
      }
  
      async function handleEdit() {
        let res = await updatePlace(state.formData);
        if (res) {
          ElMessage({
            type: "success",
            message: "修改成功！",
          });
          state.dialogData.visible = false;
          await reqPlaceList();
        }
      }
  
      function handleDelete(index, row) {
        ElMessageBox.confirm("确认删除吗?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            await deletePlaceById(row.id);
            ElMessage({
              type: "success",
              message: "删除成功!",
            });
            await reqPlaceList();
          })
          .catch(() => {
            ElMessage({
              type: "info",
              message: "已取消",
            });
          });
      }
  
      async function reqPlaceList() {
        let { placeList } = await getPlaceListByPage(state.params);
        state.placeList = placeList.list;
        state.total = placeList.total;
      }
  
      onMounted(() => {
        reqPlaceList();
      });
  
      return {
        ...toRefs(state),
        handleAdd,
        handleEdit,
        handleDelete,
        showAddDialog,
        showEditDialog
      };
    },
  };
  </script>
  
  <style lang="scss">
  .place {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
  
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
  
      .el-input {
        width: 200px;
        height: 40px;
      }
    }
  
    .el-table__row .el-table__cell .cell {
      /* 文本显示省略号 */
      text-overflow: ellipsis;
      /* 溢出的内容将它隐藏 */
      overflow: hidden;
      /* 主要控制父元素容器里面子元素的排列方式 */
      display: -webkit-box;
      /* 实现限制文字显示多少行,也就是说要多少行是出现省略号,我这里设置两行就让文本出现省略号 */
      -webkit-line-clamp: 3;
      /* 属性规定框的子元素应该被水平或垂直排列 */
      -webkit-box-orient: vertical;
    }
  }
  </style>