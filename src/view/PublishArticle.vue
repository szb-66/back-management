<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" :size="formSize"
    status-icon label-position="top">

    <!-- 标题 -->
    <el-form-item label="文章标题" prop="title">
      <el-input v-model="ruleForm.title" />
    </el-form-item>

    <!-- 类型 -->
    <el-form-item label="类型" prop="type">
      <el-select v-model="ruleForm.type" placeholder="请选择">
        <el-option label="设计" value="设计" />
        <el-option label="开发" value="开发" />
      </el-select>
    </el-form-item>

    <!-- 标签，隐藏输入框来传值 -->
    <el-form-item label="标签" prop="tags">
      <!-- 按钮 -->
      <el-input v-model="ruleForm.tags" type="hidden" />
      <!-- 标签 -->
      <el-tag v-for="tag in ruleForm.tags" :key="tag" class="mx-1" closable :disable-transitions="false"
        @close="handleClose(tag)">
        {{ tag }}
      </el-tag>
      <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="ml-1 w-20" size="small"
        @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
      <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
        + 添加标签
      </el-button>
    </el-form-item>

    <!-- 内容 -->
    <el-form-item label="内容" prop="content">
      <el-input v-model="ruleForm.content" type="textarea" />
    </el-form-item>

    <!-- 按钮 -->
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        提交
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">清除</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { computed, nextTick, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex';

const formSize = ref('default')
const ruleFormRef = ref()

// 表单各项的值
let ruleForm = reactive({
  title: '',
  type: '',
  content: '',
  tags: [],
})

// 检测规则
const rules = reactive({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在3~20之间', trigger: 'blur' },
  ],
  type: [
    {
      required: true,
      message: '请选择文章类型',
      trigger: 'change',
    },
  ],
  content: [
    { required: true, message: '内容不能为空', trigger: 'blur' },
  ],
})

// 上传新文章
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      ElMessage({
        message: `提交成功`,
        type: 'success',
      })
      console.log(ruleForm);
      formEl.resetFields()
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 清除文章内容
const resetForm = (formEl) => {
  if (!formEl) return
  ElMessageBox.confirm(
    '你确定要清除吗?',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: '清除成功',
      })
      // 清除表单字段
      formEl.resetFields()
      // 清除 Vuex 中保存的内容
      store.commit('updateRuleForm', {
        title: '',
        type: '',
        content: '',
        tags: [],
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '暂不清除',
      })
    })
}

const options = Array.from({ length: 10000 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}))

// 标签功能
const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref()

const handleClose = (tag) => {
  ruleForm.tags.splice(ruleForm.tags.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    if (InputRef.value && InputRef.value.input) {
      InputRef.value.input.focus();
    }
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    // 创建一个新数组副本
    const newTags = [...ruleForm.value.tags];
    // 将新标签添加到新数组中
    newTags.push(inputValue.value);
    // 将新数组存储回 Vuex
    ruleForm.value = {
      ...ruleForm.value,
      tags: newTags,
    };
  }
  inputVisible.value = false;
  inputValue.value = '';
}

// 刷新表单不重置
const store = useStore();

ruleForm = computed({
  get: () => store.state.ruleForm,
  set: (value) => store.commit('updateRuleForm', value)  //ps:这里会把vuex中的对象赋值给ruleForm，两个对象指向同一个内存地址，所以修改ruleForm会直接修改vuex中的对象，所以push不可用
});

</script>

<style lang = "less" scoped></style>