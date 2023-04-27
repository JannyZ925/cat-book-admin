<template>
  <div class="header">
    <el-button type="primary" @click="showAddDialog">添加照片</el-button>
  </div>

  <!-- 猫咪照片表格 -->
  <el-table :data="picList" style="width: 100%" border :max-height="350">
    <el-table-column label="照片" width="auto" min-width="5%" align="center">
      <template #default="scope">
        <img :src="scope.row.picUrl" style="width: 100px" />
      </template>
    </el-table-column>
    <el-table-column
      label="上传时间"
      prop="updateTime"
      width="auto"
      min-width="5%"
      align="center"
    >
    </el-table-column>
    <el-table-column
      label="点赞量"
      prop="likeNum"
      width="auto"
      min-width="3%"
      align="center"
    >
    </el-table-column>
    <el-table-column
      label="是否为封面"
      width="auto"
      min-width="5%"
      align="center"
    >
      <template #default="scope">
        {{ scope.row.isCover ? "是" : "否" }}
      </template>
    </el-table-column>
    <el-table-column
      label="是否为轮播图"
      width="auto"
      min-width="5%"
      align="center"
    >
      <template #default="scope">
        {{ scope.row.isSwiper ? "是" : "否" }}
      </template>
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
          v-if="!scope.row.isCover"
          size="mini"
          type="primary"
          @click="handelUpdateCover(scope.$index, scope.row)"
          >设置为封面</el-button
        >
        <el-button
          v-if="!scope.row.isSwiper"
          size="mini"
          type="primary"
          @click="handelSetSwiper(scope.$index, scope.row)"
          >设置为轮播图</el-button
        >
        <el-button
          v-if="scope.row.isSwiper"
          size="mini"
          type="warning"
          @click="handelCancelSwiper(scope.$index, scope.row)"
          >取消轮播</el-button
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

  <el-dialog title="添加照片" v-model="dialogVisible">
    <el-upload
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :multiple="true"
      :http-request="handleUpload"
      :limit="5"
      accept=".jpg,.png"
      list-type="picture"
    >
    <div>{{ fileList }}</div>
      <el-button size="small" type="primary">选择照片</el-button>
      <template #tip>
        <div class="el-upload__tip">只能上传 jpg/png 文件，一次最多上传5张</div>
      </template>
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          v-show="fileList.length !== 0"
          type="primary"
          @click="handleSubmit"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { useRoute } from "vue-router";
import { onMounted, reactive, ref, watch } from "vue";
import {
  getPictures,
  deletePictureById,
  updateCover,
  setSwiper,
  cancelSwiper,
  insertPics,
} from "@/api/pics.js";
import { ElMessageBox, ElMessage } from "element-plus";
import putObject from "@/utils/oss.js"

export default {
  setup() {
    let route = useRoute();

    // 分页获取照片的参数
    let params = reactive({
      pageNum: 1,
      pageSize: 5,
      catId: "",
      minTime: "",
      maxTime: "",
    });

    // 照片总数
    let total = ref(0);

    // 照片数组
    let picList = reactive([]);

    async function reqPicList() {
      // 先清空原数组，再重新发请求获取数据
      picList.length = 0;
      let res = await getPictures(params);
      total.value = res.total;
      picList.push(...res.list);
    }

    async function handleDelete(index, pic) {
      ElMessageBox.confirm("确认删除吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await deletePictureById(pic.id);
          ElMessage({
            type: "success",
            message: "删除成功!",
          });
          await reqPicList();
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消",
          });
        });
    }

    async function handelUpdateCover(index, pic) {
      // 更新封面
      await updateCover(pic.catId, pic.id);
      // 重新获取数据
      await reqPicList();
      ElMessage({
        type: "success",
        message: "设置成功!",
      });
    }

    async function handelSetSwiper(index, pic) {
      await setSwiper(pic.id);
      await reqPicList();
      ElMessage({
        type: "success",
        message: "设置成功!",
      });
    }

    async function handelCancelSwiper(index, pic) {
      await cancelSwiper(pic.id);
      await reqPicList();
      ElMessage({
        type: "success",
        message: "取消成功!",
      });
    }

    // 控制添加照片的对话框显隐
    let dialogVisible = ref(false);

    // 添加的照片url数组
    let fileList = reactive([]);

    // 添加的图片的数据
    let imgData = reactive({});

    async function handleUpload(e) {
      imgData = e.file;
      let imgUrl = await putObject(imgData);
      fileList.push(imgUrl)
    }

    watch(dialogVisible, (newValue, oldValue) => {
      if(newValue === false) fileList.length = 0;
    })

    // 调用后端接口，将图片存入数据库中
    async function handleSubmit() {
      let addPicParams = reactive({
        catId: params.catId,
        userId: 0,
        urls: fileList,
      });
      let res = await insertPics(addPicParams);
      if (res) {
        ElMessage({
          type: "success",
          message: "添加成功！",
        });
        dialogVisible.value = false;
        await reqPicList();
      }
    }

    function handleExceed() {
      ElMessage({
          type: "error",
          message: "文件个数超出限制！",
        });
    }

    function handleRemove(file, fileList) {
      console.log(file, fileList);
    }
    function handlePreview(file) {
      console.log(file);
    }

    function showAddDialog() {
      dialogVisible.value = true;
    }

    watch(
      () => params.pageNum,
      () => {
        reqPicList(params);
      }
    );

    onMounted(() => {
      params.catId = route.params.catId;
      reqPicList();
    });

    return {
      params,
      total,
      picList,
      fileList,
      handleDelete,
      handelUpdateCover,
      handelSetSwiper,
      handelCancelSwiper,
      showAddDialog,
      handleRemove,
      handlePreview,
      handleUpload,
      handleSubmit,
      handleExceed,
      dialogVisible,
    };
  },
};
</script>

<style lang="scss" scoped>
.header {
  padding: 20px 0;;
  text-align: left;
}
</style>