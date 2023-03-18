<template>
  <div>
    <el-button :type="'primary'" @click="handleAdd">添加项目</el-button>
    <el-table :data="projectList" style="width: 100%">
      <el-table-column prop="name" label="项目名称"></el-table-column>
      <el-table-column prop="time" label="项目时间"></el-table-column>
      <el-table-column prop="content" label="负责内容"></el-table-column>
      <el-table-column label="操作">
        <template #default="{row}">
          <el-button :type="'primary'" @click="handleEdit(row)">编辑</el-button>
          <el-button :type="'danger'" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const projectList = reactive([
  { name: '项目1', time: '2021-01-01 ~ 2021-02-01', content: '负责内容1' },
  { name: '项目2', time: '2021-03-01 ~ 2021-04-01', content: '负责内容2' },
  { name: '项目3', time: '2021-05-01 ~ 2021-06-01', content: '负责内容3' }
])

const handleAdd = () => {
  projectList.push({ name: '', time: '', content: '' })
}

const handleEdit = (row) => {
  console.log('编辑', row)
}

const handleDelete = (row) => {
  const index = projectList.indexOf(row)
  projectList.splice(index, 1)
}
</script>
