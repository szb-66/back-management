<template>
    <div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="Name" width="180">
          <template #default="{ row }">
            <el-input v-if="row.editing" v-model="row.name" placeholder="Name" />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="Age" width="80">
          <template #default="{ row }">
            <el-input v-if="row.editing" v-model="row.age" placeholder="Age" />
            <span v-else>{{ row.age }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button v-if="!row.editing" type="primary" size="small" @click="editRow(row)">编辑</el-button>
            <el-button v-else type="primary" size="small" @click="saveRow(row)">保存</el-button>
            <el-button type="danger" size="small" @click="deleteRow(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="success" @click="addRow">添加行</el-button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const tableData = ref([
    { id: 1, name: '张三', age: 24, editing: false },
    { id: 2, name: '李四', age: 28, editing: false },
    { id: 3, name: '王五', age: 26, editing: false },
  ])
  
  const editRow = (row) => {
    row.editing = true
  }
  
  const saveRow = (row) => {
    row.editing = false
  }
  
  const deleteRow = (row) => {
    tableData.value.splice(tableData.value.indexOf(row), 1)
  }
  
  const addRow = () => {
    const newRow = {
      id: Date.now(),
      name: '',
      age: null,
      editing: true,
    }
    tableData.value.push(newRow)
  }
  </script>
  