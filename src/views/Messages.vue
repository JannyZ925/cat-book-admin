<template>
  <div class="message">
    <!-- 留言信息表格 -->
    <el-table :data="messageList" style="width: 100%" border :max-height="420">
      <el-table-column
        label="日期"
        prop="time"
        width="auto"
        min-width="5%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="内容"
        prop="content"
        width="auto"
        min-width="10%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="用户名"
        prop="userName"
        width="auto"
        min-width="3%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="猫咪"
        prop="catName"
        width="auto"
        min-width="3%"
        align="center"
      >
      </el-table-column>
      <el-table-column label="操作" align="center" width="auto" min-width="10%">
        <template #default="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="params.pageSize"
        v-model:current-page="params.pageNum"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, watch } from "vue";
import { useRoute } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import { getMessageList, deleteMessageById } from "../api/message";
export default {
  setup() {
    let route = useRoute();

    let state = reactive({
      messageList: [],
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 10,
        catId: "",
        catName: "",
      },
    });

    watch(
      () => state.params.pageNum,
      () => {
        reqMessageList(state.params);
      }
    );

    async function reqMessageList() {
      // 先清空原数组，再重新发请求获取数据
      state.messageList.length = 0;
      let { messageList } = await getMessageList(state.params);
      state.total = messageList.total;
      state.messageList.push(...messageList.list);
    }

    async function handleDelete(index, message) {
      ElMessageBox.confirm("确认删除吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await deleteMessageById(message.id);
          ElMessage({
            type: "success",
            message: "删除成功!",
          });
          await reqMessageList();
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消",
          });
        });
    }

    onMounted(() => {
      reqMessageList();
    });

    return {
      ...toRefs(state),
      handleDelete,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>