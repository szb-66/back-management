<template>
  <div>
    <!-- 添加一个选择器用于筛选类型 -->
    <el-form-item label="筛选类型" class="m-2">
      <el-select v-model="selectedType" placeholder="选择类型">
        <el-option label="全部" value=""></el-option>
        <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </el-form-item>
    <!-- 表格 -->
    <el-table :data="paginatedTableDatas" style="width: 100%">
      <el-table-column prop="url" label="封面" width="180">
        <template #default="{ row }">
          <img style="width: 178px; height: 100px" :src="row.imgUrl"><img>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="180">
      </el-table-column>
      <el-table-column prop="type" label="类型" width="180">
      </el-table-column>
      <el-table-column prop="tags" label="标签">
        <template #default="{ row }">
          <el-tag v-for="(item, index) in row.tags" :key="index">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="发布时间" width="180" sortable>
      </el-table-column>
      <el-table-column prop="updated_at" label="更新时间" width="180" sortable>
      </el-table-column>
      <el-table-column label="编辑">
        <!-- 按钮 -->
        <template #default="{ row }">
          <el-button @click="editRow(row)" size="small" type="primary">编辑</el-button>
          <el-button @click="deleteRow(row)" size="small" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="example-pagination-block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page.sync="currentPage" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[6]" :total="tableDatas.length" background>
      </el-pagination>
    </div>

    <!-- 对话框弹窗 -->
    <el-dialog v-model="dialogVisible" title="编辑文章" :append-to-body="true" :show-close="false">
      <el-form :model="data">
        <!-- 文章标题 -->
        <el-form-item label="标题">
          <el-input v-model="data.title"></el-input>
        </el-form-item>
        <!-- 封面 -->
        <el-form-item label="封面">
          <el-upload ref="uploadRef" class="upload-demo" action="http://localhost:3000/api/images" :limit="1"
            list-type="picture-card" :on-exceed="handleExceed" :before-upload="beforeUpload" :on-success="handleSuccess"
            :file-list="uploadedFiles" :on-remove="removeImg">
            <template #tip>
              <div class="el-upload__tip">jpg/png files with a size less than 500KB.</div>
            </template>
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <!-- 类型 -->
        <el-form-item label="类型">
          <!-- 选择器 -->
          <el-select v-model="data.type" class="m-2" placeholder="Select">
            <el-option v-for="item in options" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <!-- 标签 -->
        <el-form-item label="标签">
          <el-input v-model="data.tags" type="hidden"></el-input>
          <!-- 标签 -->
          <el-tag v-for="tag in data.tags" :key="tag" class="mx-1" closable :disable-transitions="false"
            @close="handleClose(tag)">
            {{ tag }}
          </el-tag>
          <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="ml-1 w-20" size="small"
            @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
          <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
            + New Tag
          </el-button>
        </el-form-item>
        <!-- 内容 -->
        <el-form-item label="内容" class="custom-form-item222">
          <!-- <el-input v-model="data.content"></el-input> -->
          <vue3-tinymce v-model="data.content" :setting="state.setting" />
        </el-form-item>
      </el-form>
      <!-- 对话框底部 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmEdit(dialogId)">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, nextTick, onMounted, toRef,watch } from 'vue'
import axios from 'axios';
import Vue3Tinymce from '@jsdawn/vue3-tinymce';


// 分页后的数据
const paginatedTableDatas = ref([])
const currentPage = ref(1)
const pageSize = ref(6)
// 处理分页数据
function paginateTableDatas() {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  paginatedTableDatas.value = tableDatas.value.slice(start, end);
}
function handleSizeChange(val) {
  console.log(`每页 ${val} 条`)
}
function handleCurrentChange(val) {
  console.log(`当前页数：${val}`)
  currentPage.value = val;
  paginateTableDatas();
}

// 进入页面获取数据
onMounted(() => {
  fetchArticles();
  fetchArticles2(options);
});
// 类型选项
const options = ref(null)
// 沟通服务器获取数据,并将数据赋值给form
async function fetchArticles2(form) {
  try {
    const response = await axios.get('http://localhost:3000/api/types');
    form.value = response.data.map(tag => tag.type);
  } catch (error) {
    console.error('获取文章类型失败：', error);
  }
}

// 获取表格数据
const tableDatas = ref([])

// 当前选中的类型
const selectedType = ref('')
// 监听 selectedType 的改变
watch(selectedType, () => {
  fetchArticles();
});
// 创建一个方法filterByType
function filterByType() {
  if (selectedType.value === "All") {
    fetchArticles();
  } else {
    const filteredData = tableDatas.value.filter(
      (item) => item.type === selectedType.value
    );
    paginatedTableDatas.value = filteredData.slice(0, pageSize.value);
    currentPage.value = 1;
  }
}
// 修改fetchArticles方法，在获取数据后调用filterByType方法
async function fetchArticles() {
  try {
    const response = await axios.get('http://localhost:3000/api/articles');
    if (selectedType.value) {
      tableDatas.value = response.data.filter(article => article.type === selectedType.value);
    } else {
      tableDatas.value = response.data;
    }
    // 分页
    paginateTableDatas();
  } catch (error) {
    console.error('获取文章列表失败：', error);
  }
}

// 设置富文本编辑器
const state = reactive({
  // editor 配置项
  setting: {
    // height: 400, 
    // width: 800, 
    language: 'zh-Hans',
    language_url: 'https://unpkg.com/@jsdawn/vue3-tinymce@2.0.2/dist/tinymce/langs/zh-Hans.js',
  },
});

// 封面
const uploadedFiles = ref([])
// 上传封面的ref实例
const uploadRef = ref(null);
// 上传成功函数
const handleSuccess = (response, file) => {
  data.imgUrl = response.url;

}
// 上传失败函数
const handleExceed = (files, uploadFiles) => {
  ElMessage.warning(
    `限制数量为1`
  )
}
// 上传前的校验
function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  const isPNG = file.type === 'image/png';
  const isLt500KB = file.size / 1024 < 500;
  if (!isJPG && !isPNG) {
    this.$message.error('上传图片只能是 JPG/PNG 格式!');
    return false;
  }
  if (!isLt500KB) {
    this.$message.error('上传图片大小不能超过 500KB!');
    return false;
  }
  return true;
}
// 移除图片，服务器同步
function removeImg(file, fileList) {
  axios.delete(data.imgUrl);
}


// 删除按钮
const deleteRow = async (row) => {
  try {
    await axios.delete(`http://localhost:3000/api/articles/${row.id}`);
    tableDatas.value.splice(tableDatas.value.indexOf(row), 1);
    ElMessage.success('文章已成功删除');
  } catch (error) {
    console.error('删除文章失败：', error);
    ElMessage.error('删除文章失败');
  }
};

// 对话框显示状态
const dialogVisible = ref(false)

// 对话框中的临时数据
const data = reactive({
  id: '',
  title: '',
  type: '',
  tags: [],
  content: '',
  created_at: '',
  updated_at: '',
  imgUrl: ''
})

// 点击的对话框id
const dialogId = ref('')

// 编辑按钮
const editRow = (row) => {
  data.id = row.id
  data.title = row.title
  data.type = row.type
  data.tags = row.tags.slice()
  data.content = row.content
  data.created_at = row.created_at
  data.updated_at = row.updated_at
  data.imgUrl = row.imgUrl

  dialogId.value = tableDatas.value.indexOf(row)
  dialogVisible.value = true
}

// 弹窗中的确定
const confirmEdit = async (dialogId) => {
  // 获取需要更新的文章数据
  const updatedArticle = {
    id: tableDatas.value[dialogId].id,
    title: data.title,
    type: data.type,
    tags: data.tags,
    content: data.content,
    created_at: tableDatas.value[dialogId].created_at,
    imgUrl: data.imgUrl
  };
  // 检查新旧数据是否相同
  const isDataUnchanged =
    tableDatas.value[dialogId].title === updatedArticle.title &&
    tableDatas.value[dialogId].type === updatedArticle.type &&
    JSON.stringify(tableDatas.value[dialogId].tags) === JSON.stringify(updatedArticle.tags) &&
    tableDatas.value[dialogId].content === updatedArticle.content &&
    tableDatas.value[dialogId].imgUrl === updatedArticle.imgUrl;
  // 如果数据未发生更改，则直接关闭弹窗并返回
  if (isDataUnchanged) {
    dialogVisible.value = false;
    dialogId = '';
    return;
  }

  // 发送更新请求
  try {
    const response = await axios.put(`http://localhost:3000/api/articles/${updatedArticle.id}`, updatedArticle);
    // 本地更新客户端表格数据
    tableDatas.value[dialogId] = { ...updatedArticle, updated_at: response.data.updated_at };
    ElMessage.success('文章已成功更新');
  } catch (error) {
    console.error('更新文章失败：', error);
    ElMessage.error('更新文章失败');
  }
  dialogVisible.value = false;
  dialogId = '';
};

// 对话框中的标签编辑功能
const inputValue = ref('') // 输入框的值
const inputVisible = ref(false) // 输入框的显示状态
const InputRef = ref() // 输入框的ref
// 点击标签的关闭按钮时
const handleClose = (tag) => {
  data.tags.splice(data.tags.indexOf(tag), 1)
}
// 点击添加标签按钮时
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    if (InputRef.value && InputRef.value.input) {
      InputRef.value.input.focus(); // 聚焦
    }
  })
}
// 输入框回车或失去焦点时
const handleInputConfirm = () => {
  if (inputValue.value) {
    data.tags.push(inputValue.value) // 添加标签
  }
  inputVisible.value = false  // 隐藏输入框
  inputValue.value = ''
}

</script>



<style lang="less" scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}

.custom-form-item222 :deep(.el-form-item__content) {
  // 强制添加属性
  display: block !important;
}
</style>
