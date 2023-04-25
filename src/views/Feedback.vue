<template>
  <div class="feedback">
    <div class="header">
      <el-date-picker
        v-model="params.time"
        type="date"
        placeholder="请选择日期"
        :disabled-date="disabledDate"
        value-format="YYYY-MM-DD"
      >
      </el-date-picker>
      <el-select v-model="params.state" clearable placeholder="请选择处理状态">
        <el-option label="已处理" :value="1"> </el-option>
        <el-option label="未处理" :value="0"> </el-option>
      </el-select>
      <el-input placeholder="请输入用户名" v-model="params.userName" clearable>
      </el-input>
      <el-button type="primary" @click="handleSelect">查询</el-button>
    </div>
    <el-table :data="feedbackList" style="width: 100%" border :max-height="420">
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
        min-width="5%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="用户联系方式"
        prop="contactInfo"
        width="auto"
        min-width="8%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="处理状态"
        prop="state"
        width="auto"
        min-width="3%"
        align="center"
      >
        <template #default="scope">
          {{ scope.row.state ? "已处理" : "未处理" }}
        </template>
      </el-table-column>
      <el-table-column
        label="回复"
        prop="reply"
        width="auto"
        min-width="10%"
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
          <el-button
            v-if="!scope.row.state"
            size="mini"
            type="primary"
            @click="handleUpdate(scope.$index, scope.row)"
            >设为已处理</el-button
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
import {
  getFeedbackList,
  deleteFeedback,
  updateFeedback,
} from "../api/feedback";
import { ElMessageBox, ElMessage } from "element-plus";

export default {
  setup() {
    let state = reactive({
      feedbackList: [],

      params: {
        pageNum: 1,
        pageSize: 10,
        userName: "",
        time: "",
        state: "",
      },

      disabledDate(time) {
        return time.getTime() > Date.now();
      },

      total: 0,
    });

    watch(
      () => state.params.pageNum,
      () => {
        reqFeedbackList(state.params);
      }
    );

    async function reqFeedbackList() {
      let { feedbackList } = await getFeedbackList(state.params);
      state.feedbackList = feedbackList.list;
      state.total = feedbackList.total;
    }

    async function handleDelete(index, feedback) {
      ElMessageBox.confirm("确认删除吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await deleteFeedback(feedback.id);
          ElMessage({
            type: "success",
            message: "删除成功!",
          });
          await reqFeedbackList();
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消",
          });
        });
    }

    async function handleUpdate(index, feedback) {
      ElMessageBox.prompt("请输入备注", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        center: true,
      })
        .then(async ({ value }) => {
          feedback.state = 1;
          feedback.reply = value;
          await updateFeedback(feedback);
          ElMessage({
            type: "success",
            message: `修改成功！`,
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消",
          });
        });
    }

    async function handleSelect() {
      let res = await reqFeedbackList();
      console.log(res);
      console.log(state.params);
    }

    onMounted(() => {
      reqFeedbackList();
    });

    return {
      ...toRefs(state),
      handleDelete,
      handleUpdate,
      handleSelect,
    };
  },
};
</script>

<style lang="scss">
.feedback {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;

  .header {
    display: flex;
    margin-bottom: 20px;

    .el-date-picker,
    .el-select,
    .el-input {
      width: 200px;
      margin-right: 10px;
    }
  }
}
</style>