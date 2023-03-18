<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="title" label="标题" width="180">
      </el-table-column>
      <el-table-column prop="type" label="类型" width="180">
      </el-table-column>
      <el-table-column prop="tag" label="标签">
        <template #default="{ row }">
          <el-tag v-for="(item, index) in row.tag" :key="index">{{ item }}</el-tag>
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
          <el-input v-model="data.type"></el-input>
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="data.tag"></el-input>
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
import { reactive, ref } from 'vue'

// 表格数据
const tableData = ref([
  {
    id: '',
    title: '文章标题1',
    type: '类型1',
    tag: ['标签1', '标签2'],
    content: '文章内容1',
    publishTime: '2022-01-01',
    updateTime: '2022-01-01'
  },
  {
    id: '',
    title: '文章标题2',
    type: '类型2',
    tag: ['标签2'],
    content: '文章内容2',
    publishTime: '2022-01-02',
    updateTime: '2022-01-02'
  },
  {
    id: '',
    title: '文章标题3',
    type: '类型3',
    tag: ['标签3'],
    content: '文章内容3',
    publishTime: '2022-01-03',
    updateTime: '2022-01-03'
  },
  {
    id: '',
    title: '文章标题4',
    type: '类型4',
    tag: ['标签4'],
    content: '文章内容4',
    publishTime: '2022-01-04',
    updateTime: '2022-01-04'
  }
])

const dialogVisible = ref(false)

const data = reactive({
  id: '',
  title: '',
  type: '',
  tag: [],
  content: '',
  publishTime: '',
  updateTime: ''
})
const dialogId = ref('')

// 编辑
const editRow = (row) => {
  data.id = row.id
  data.title = row.title
  data.type = row.type
  data.tag = row.tag
  data.content = row.content
  data.publishTime = row.publishTime
  data.updateTime = row.updateTime

  dialogId.value = tableData.value.indexOf(row)
  // console.log(dialogId.value);
  dialogVisible.value = true
}

// 删除
const deleteRow = (row) => {
  tableData.value.splice(tableData.value.indexOf(row), 1)
}

// 弹窗确定
const confirmEdit = (dialogId) => {
  tableData.value[dialogId].title = data.title  
  tableData.value[dialogId].type = data.type
  tableData.value[dialogId].tag = data.tag
  tableData.value[dialogId].content = data.content

  dialogVisible.value = false
  dialogId = ''
}

</script>

<style lang="less" scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
