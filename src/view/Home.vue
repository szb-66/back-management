<template>
  <div>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="标题">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="上传文件">
        <el-upload
          :action="uploadUrl"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :headers="headers"
          @success="onUploadSuccess"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  username: '',
  file: null,
})

const uploadUrl = "https://your-upload-api-url.com"
const headers = {
  // 如果需要，可以在此处添加额外的请求头
}

function beforeUpload(file) {
  form.value.file = file
  return false
}

function onUploadSuccess(response) {
  // 处理上传成功后的逻辑
}

async function submitForm() {
  const formData = new FormData()
  formData.append("username", form.value.username)
  formData.append("file", form.value.file)

  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: headers,
      body: formData,
    })

    if (response.ok) {
      const data = await response.json()
      console.log("提交成功：", data)
    } else {
      console.error("提交失败")
    }
  } catch (error) {
    console.error("提交出错：", error)
  }
}
</script>
