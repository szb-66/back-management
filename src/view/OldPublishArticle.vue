<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" :size="formSize"
    status-icon label-position="top">

    <!-- 标题 -->
    <el-form-item label="文章标题" prop="title">
      <el-input v-model="ruleForm.title" />
    </el-form-item>

    <!-- 封面 -->
    <el-upload ref="uploadRef" class="upload-demo" action="http://localhost:3000/upload" :limit="1" :auto-upload="false"
      :on-exceed="handleExceed" :before-upload="beforeUpload" :on-success="handleSuccess" :file-list="uploadedFiles">
      <template #trigger>
        <el-button type="primary">select file</el-button>
      </template>
      <template #tip>
        <div class="el-upload__tip">jpg/png files with a size less than 500KB.</div>
      </template>
    </el-upload>

    <!-- 类型 -->
    <el-form-item label="类型" prop="type">
      <el-select v-model="ruleForm.type" placeholder="请选择">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>

    <!-- 标签，隐藏输入框来传值 -->
    <el-form-item label="标签" prop="tags">
      <!-- 输入框 -->
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
    <el-form-item label="内容" prop="content" label-width="auto" class="custom-form-item222">
      <vue3-tinymce v-model="ruleForm.content" :setting="state.setting" />
    </el-form-item>

    <!-- 按钮 -->
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
      <el-button @click="resetForm(ruleFormRef)">清除</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { computed, nextTick, reactive, ref, watchEffect } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from 'vuex';
import axios from 'axios';
// 详细地址 https://juejin.cn/post/7012073370023886856
import Vue3Tinymce from '@jsdawn/vue3-tinymce';


const formSize = ref('default')
// 表单的ref实例
const ruleFormRef = ref()
// 上传封面的ref实例
const uploadRef = ref(null);

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

// 表单各项的值
let ruleForm = reactive({
  title: '',
  type: '未分类',
  tags: [],
  content: '',
  imgUrl: '',
})

// 上传封面相关函数
const uploadedFiles = ref([]);
// 处理上传图片后服务器返回的图片url地址
const handleSuccess = (response, file) => {
  ruleForm.imgUrl = response.url;
}
const handleExceed = (files, uploadFiles) => {
  ElMessage.warning(
    `限制数量为1`
  )
}
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


// 检测规则
const rules = reactive({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在1~20之间', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '请选择文章类型', trigger: 'change', },
  ],
  content: [
    { required: true, message: '内容不能为空', trigger: 'blur' },
  ],
})

// 上传新文章
const submitForm = async (formEl) => {
  console.log();
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        // 手动上传图片
        uploadRef.value.submit()
        await axios.post('http://localhost:3000/articles', ruleForm.value);
        ElMessage({
          message: `提交成功`,
          type: 'success',
        })
        // 清除表单字段
        formEl.resetFields()
        // 清除 Vuex 中保存的内容
        store.commit('updateRuleForm', {
          title: '',
          type: '未分类',
          content: '',
          tags: [],
          imgUrl: '',
        });
        // 清除上传的文件
        if (uploadRef.value) {
          uploadRef.value.clearFiles();
        }
      } catch (error) {
        console.error('提交失败', error);
        ElMessage({
          message: `提交失败`,
          type: 'error',
        });
      }
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
        type: '未分类',
        content: '',
        tags: [],
        imgUrl: '',
      });
      // 清除上传的文件
      if (uploadRef.value) {
        uploadRef.value.clearFiles();
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '暂不清除',
      })
    })
}

// 标签功能
const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref()

const handleClose = (tag) => {
  ruleForm.value.tags.splice(ruleForm.value.tags.indexOf(tag), 1)
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




<style lang = "less" scoped>
.custom-form-item222 :deep(.el-form-item__content) {
  // 强制添加属性
  display: block !important;
}
</style>


<style></style>
