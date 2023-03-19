<template>
  <div>
    <!-- 表格 -->
    <el-table :data="tableDatas" style="width: 100%">
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
          <el-button @click="editRow(row)" size="small">编辑</el-button>
          <el-button @click="deleteRow(row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框弹窗 -->
    <el-dialog v-model="dialogVisible" title="编辑文章" :append-to-body="true" :show-close="false">
      <el-form :model="data">
        <!-- 文章标题 -->
        <el-form-item label="标题">
          <el-input v-model="data.title"></el-input>
        </el-form-item>
        <!-- 类型 -->
        <el-form-item label="类型">
          <!-- 选择器 -->
          <el-select v-model="data.type" class="m-2" placeholder="Select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
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
import { reactive, ref, nextTick,onMounted,toRef  } from 'vue'
import axios from 'axios';
import Vue3Tinymce from '@jsdawn/vue3-tinymce';

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

// 表格数据
const tableDatas = ref([])

async function fetchArticles() {
  try {
    const response = await axios.get('http://localhost:3000/articles');
    tableDatas.value = response.data;
  } catch (error) {
    console.error('获取文章列表失败：', error);
  }
}

onMounted(() => {
  fetchArticles();
});

// 类型选项
const options = [
  {
    value: '未分类',
    label: '未分类',
  },
  {
    value: '设计',
    label: '设计',
  },
  {
    value: '开发',
    label: '开发',
  },
]

// 删除按钮
const deleteRow = async (row) => {
  try {
    await axios.delete(`http://localhost:3000/articles/${row.id}`);
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
  updated_at: ''
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
  };
  // 检查新旧数据是否相同
  const isDataUnchanged =
    tableDatas.value[dialogId].title === updatedArticle.title &&
    tableDatas.value[dialogId].type === updatedArticle.type &&
    JSON.stringify(tableDatas.value[dialogId].tags) === JSON.stringify(updatedArticle.tags) &&
    tableDatas.value[dialogId].content === updatedArticle.content;
  // 如果数据未发生更改，则直接关闭弹窗并返回
  if (isDataUnchanged) {
    dialogVisible.value = false;
    dialogId = '';
    return;
  }
  // 发送更新请求
  try {
    const response = await axios.put(`http://localhost:3000/articles/${updatedArticle.id}`, updatedArticle);
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
