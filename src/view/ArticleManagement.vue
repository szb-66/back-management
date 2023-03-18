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
      <el-table-column prop="publishTime" label="发布时间" width="180" sortable>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="180" sortable>
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
        <el-form-item label="标题">
          <el-input v-model="data.title"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <!-- 选择器 -->
          <el-select v-model="data.type" class="m-2" placeholder="Select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
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
        <el-form-item label="内容">
          <el-input v-model="data.content"></el-input>
        </el-form-item>
      </el-form>
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
import { reactive, ref, nextTick } from 'vue'

// 表格数据
const tableDatas = ref([
  {
    id: '',
    title: '文章标题1',
    type: '设计',
    tags: ['标签1', '标签2'],
    content: '文章内容1',
    publishTime: '2022-01-01',
    updateTime: '2022-01-01'
  },
  {
    id: '',
    title: '文章标题2',
    type: '设计',
    tags: ['标签2'],
    content: '文章内容2',
    publishTime: '2022-01-02',
    updateTime: '2022-01-02'
  },
  {
    id: '',
    title: '文章标题3',
    type: '开发',
    tags: ['标签3'],
    content: '文章内容3',
    publishTime: '2022-01-03',
    updateTime: '2022-01-03'
  },
  {
    id: '',
    title: '文章标题4',
    type: '开发',
    tags: ['标签4'],
    content: '文章内容4',
    publishTime: '2022-01-04',
    updateTime: '2022-01-04'
  }
])

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

// 对话框显示状态
const dialogVisible = ref(false)

// 对话框中的临时数据
const data = reactive({
  id: '',
  title: '',
  type: '',
  tags: [],
  content: '',
  publishTime: '',
  updateTime: ''
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
  data.publishTime = row.publishTime
  data.updateTime = row.updateTime

  dialogId.value = tableDatas.value.indexOf(row)
  dialogVisible.value = true
}

// 删除按钮
const deleteRow = (row) => {
  tableDatas.value.splice(tableDatas.value.indexOf(row), 1)
}

// 弹窗点击确定
const confirmEdit = (dialogId) => {
  tableDatas.value[dialogId].title = data.title
  tableDatas.value[dialogId].type = data.type
  tableDatas.value[dialogId].tags = data.tags
  tableDatas.value[dialogId].content = data.content

  dialogVisible.value = false
  dialogId = ''
}

// 标签功能
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
</style>
