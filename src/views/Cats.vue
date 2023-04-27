<template>
  <div class="catInfo">
    <div class="header">
      <el-button type="primary" @click="showAddDialog">添加</el-button>
      <el-input placeholder="请输入猫咪名字" v-model="params.name" clearable />
    </div>

    <!-- 猫咪信息表格 -->
    <el-table :data="catList" style="width: 100%" border :max-height="420">
      <el-table-column
        label="名字"
        prop="name"
        width="auto"
        min-width="3%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="性别"
        prop="sex"
        width="auto"
        min-width="3%"
        align="center"
      >
      </el-table-column>

      <el-table-column
        label="生日"
        prop="birthday"
        width="auto"
        min-width="5%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="常驻地"
        prop="place"
        width="auto"
        min-width="5%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="花色"
        prop="stylor"
        width="auto"
        min-width="3%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="领养状态"
        width="auto"
        min-width="5%"
        align="center"
      >
        <template #default="scope">
          {{ scope.row.isAdopted ? "已被领养" : "未被领养" }}
        </template>
      </el-table-column>
      <el-table-column
        label="绝育状态"
        width="auto"
        min-width="5%"
        align="center"
      >
        <template #default="scope">
          {{ scope.row.isSterilized ? "已绝育" : "未绝育" }}
        </template>
      </el-table-column>
      <el-table-column
        label="性格特点"
        prop="personality"
        width="auto"
        min-width="5%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="撸猫指南"
        prop="guide"
        width="auto"
        min-width="10%"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="封面图"
        width="auto"
        min-width="5%"
        align="center"
      >
        <template #default="scope">
          <img :src="scope.row.coverImg" style="width: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="auto" min-width="10%">
        <template #default="scope">
          <el-button
            size="mini"
            @click="showEditDialog(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="primary"
            style="margin-top: 10px"
            @click="handleManageDetail(scope.$index, scope.row)"
            >详细信息管理</el-button
          >
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

    <!-- 添加或编辑猫咪信息的弹窗 -->
    <el-dialog :title="dialogData.title" v-model="dialogData.visible">
      <el-form :model="formData">
        <el-form-item label="名字">
          <el-input v-model="formData.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="常驻地点">
          <el-select v-model="formData.place" placeholder="请选择猫咪常驻地">
            <el-option v-for="(place, index) in placeList" :key="index" :label="place.name" :value="place.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="花色">
          <el-input v-model="formData.stylor" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="绝育状态">
          <el-select
            v-model="formData.isSterilized"
            placeholder="请选择绝育状态"
          >
            <el-option label="未绝育" :value="0"></el-option>
            <el-option label="已绝育" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="formData.sex" placeholder="请选择猫咪性别">
            <el-option label="弟弟" value="弟弟"></el-option>
            <el-option label="妹妹" value="妹妹"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领养状态">
          <el-select v-model="formData.isAdopted" placeholder="请选择领养状态">
            <el-option label="未被领养" :value="0"></el-option>
            <el-option label="已被领养" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker
            v-model="formData.birthday"
            type="date"
            placeholder="请选择猫咪生日"
            value-format="YYYY-MM-DD"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="性格特点">
          <el-input
            v-model="formData.personality"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="指南">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="formData.guide"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogData.visible = false">取 消</el-button>
          <el-button
            v-show="dialogData.title === '添加猫咪信息'"
            type="primary"
            @click="handleAdd"
            >确 定</el-button
          >
          <el-button
            v-show="dialogData.title === '编辑猫咪信息'"
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
import { ref, reactive, onMounted, watch } from "vue";
import { getCatList, addCat, deleteCatById, updateCat } from "@/api/cats.js";
import { getPlaceList } from "@/api/place.js"
import { ElMessageBox, ElMessage } from "element-plus";
import { useRouter } from "vue-router";

export default {
  setup() {
    // 路由器对象
    let router = useRouter();

    // 猫咪数据
    let catList = reactive([]);

    // 数据总数
    let total = ref(0);

    // 分页请求猫咪数据的参数
    let params = reactive({
      pageNum: 1,
      pageSize: 5,
      name: "",
    });

    // 添加或编辑猫咪信息弹窗的相关数据
    let dialogData = reactive({
      title: "",
      visible: false,
    });

    // 添加或编辑猫咪信息弹窗的表单
    let formData = reactive({
      name: "",
      birthday: "",
      sex: "",
      isSterilized: "",
      isAdopted: "",
      stylor: "",
      place: "",
      personality: "",
      guide: "",
    });

    // 猫咪常驻地列表
    let placeList = reactive([]);

    function showAddDialog() {
      dialogData.title = "添加猫咪信息";
      dialogData.visible = true;
    }

    function showEditDialog(index, row) {
      dialogData.title = "编辑猫咪信息";
      dialogData.visible = true;
      Object.assign(formData, row);
    }

    async function handleAdd() {
      let res = await addCat(formData);
      if (res) {
        ElMessage({
          type: "success",
          message: "添加成功！",
        });
        dialogData.visible = false;
        await reqCatList();
      }
    }

    async function handleEdit() {
      let res = await updateCat(formData);
      if (res) {
        ElMessage({
          type: "success",
          message: "修改成功！",
        });
        dialogData.visible = false;
        await reqCatList();
      }
    }

    function handleDelete(index, row) {
      ElMessageBox.confirm("确认删除吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await deleteCatById(row.id);
          ElMessage({
            type: "success",
            message: "删除成功!",
          });
          await reqCatList();
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消",
          });
        });
    }

    function handleManageDetail(index, catDetail) {
      router.push({
        name: "pictures",
        params: {
          catId: catDetail.id,
        },
      });
    }

    async function reqCatList() {
      // 先清空原数组，再重新发请求获取数据
      catList.length = 0;
      let res = await getCatList(params);
      total.value = res.total;
      catList.push(...res.list);
    }

    async function reqPlaceList() {
      let { placeList : list } = await getPlaceList();
      placeList.push(...list);
    }

    watch([() => params.pageNum, () => params.name], () => {
      reqCatList();
    });

    watch(
      () => dialogData.visible,
      (newValue) => {
        if (newValue === false)
          // 清空表单中的信息
          Object.keys(formData).forEach((key) => (formData[key] = ""));
      }
    );

    onMounted(() => {
      reqCatList();
      reqPlaceList();
    });

    return {
      catList,
      params,
      total,
      dialogData,
      formData,
      placeList,
      showAddDialog,
      showEditDialog,
      handleAdd,
      handleEdit,
      handleDelete,
      handleManageDetail,
    };
  },
};
</script>

<style lang="scss">
.catInfo {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;

  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .el-input {
    width: 200px;
    height: 40px;
  }

  .el-table__row .el-table__cell .cell {
    /* 文本显示省略号 */
    text-overflow: ellipsis;
    /* 溢出的内容将它隐藏 */
    overflow: hidden;
    /* 主要控制父元素容器里面子元素的排列方式 */
    display: -webkit-box;
    /* 实现限制文字显示多少行,也就是说要多少行是出现省略号,我这里设置两行就让文本出现省略号 */
    -webkit-line-clamp: 2;
    /* 属性规定框的子元素应该被水平或垂直排列 */
    -webkit-box-orient: vertical;
  }

  .el-dialog {
    min-width: 735px;
  }
  .el-dialog__header {
    line-height: 40px;
    text-align: left;
  }
  .el-form {
    display: flex;
    flex-wrap: wrap;

    .el-form-item {
      width: 50%;
    }
  }
  .el-dialog__footer {
    line-height: 40px;
  }
}
</style>