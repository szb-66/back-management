<template>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="demo-ruleForm" :size="formSize"
        status-icon>
        <el-form-item label="文章标题" prop="name">
            <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="文章类型" prop="region">
            <el-select v-model="form.region" placeholder="请选择">
                <el-option label="设计" value="设计" />
                <el-option label="开发" value="开发" />
            </el-select>
        </el-form-item>
        <el-form-item label="Instant delivery" prop="delivery">
            <el-switch v-model="form.delivery" />
        </el-form-item>
        <el-form-item label="文章内容" prop="desc">
            <el-input v-model="form.desc" type="textarea" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm(formRef.value)">Create</el-button>
            <el-button @click="resetForm(formRef.value)">Cancel</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'

const formSize = ref('default')
const formRef = ref()
const form = reactive({
  name: '',
  region: '',
  delivery: false,
  desc: '',
})

const rules = reactive({
  name: [
    { required: true, message: '不能为空', trigger: 'blur' },
    { min: 3, max: 20, message: '长度为3～20', trigger: 'blur' },
  ],
  region: [
    {
      required: true,
      message: '请选择一个类型',
      trigger: 'change',
    },
  ],
  desc: [
    { required: true, message: '输入不能为空', trigger: 'blur' },
  ],
})

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}
const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}

const options = Array.from({ length: 10000 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}))

</script>

<style lang="less" scoped></style>
