<template>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" :size="formSize"
        status-icon label-position="top">

        <!-- 标题 -->
        <el-form-item label="文章标题" prop="title">
            <el-input v-model="ruleForm.title" />
        </el-form-item>
        <!-- 封面 -->
        <el-form-item label="封面" prop="imgUrl">
            <el-upload ref="uploadRef" class="upload-demo" action="http://localhost:3000/api/images" :limit="1"
                list-type="picture-card" :on-exceed="handleExceed" :before-upload="beforeUpload" :on-success="handleSuccess"
                :file-list="uploadedFiles" :on-remove="removeImg">
                <!-- <el-button type="primary">select file</el-button> -->
                <template #tip>
                    <div class="el-upload__tip">jpg/png files with a size less than 500KB.</div>
                </template>
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
        </el-form-item>

        <!-- 类型 -->
        <el-form-item label="类型" prop="type">
            <el-select v-model="ruleForm.type" placeholder="请选择">
                <el-option v-for="item in options" :key="item" :label="item" :value="item" />
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
import { computed, nextTick, reactive, ref, watchEffect, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios';
// 详细地址 https://juejin.cn/post/7012073370023886856
import Vue3Tinymce from '@jsdawn/vue3-tinymce';


const formSize = ref('default')
// 表单的ref实例
const ruleFormRef = ref()
// 上传封面的ref实例
const uploadRef = ref(null);


// 类型选项
const options = ref(null)
onMounted(() => {
    fetchArticles(options);
});
// 沟通服务器获取数据,并将数据赋值给form
async function fetchArticles(form) {
    try {
        const response = await axios.get('http://localhost:3000/api/types');
        form.value = response.data.map(tag => tag.type);
    } catch (error) {
        console.error('获取文章列表失败：', error);
    }
}

// 表单各项的值
let ruleForm = reactive({
    title: '',
    type: '未分类',
    tags: [],
    content: '',
    imgUrl: '',
})


// 设置富文本编辑器
const state = reactive({
    // editor 配置项
    setting: {
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
    imgUrl: [
        { required: true, message: '请上传封面', trigger: 'blur' },
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
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            try {
                console.log('提交成功', ruleForm);
                await axios.post('http://localhost:3000/api/articles', ruleForm);
                ElMessage({
                    message: `提交成功`,
                    type: 'success',
                })
                // 清除表单字段
                formEl.resetFields()
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
            // 清除上传的文件
            if (uploadRef.value) {
                removeImg()
                uploadRef.value.clearFiles();
            }
            // 清除表单字段
            formEl.resetFields()
            ElMessage({
                type: 'success',
                message: '清除成功',
            })
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
    ruleForm.tags.splice(ruleForm.tags.indexOf(tag), 1) // Remove .value from ruleForm.tags

}
const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value.input.focus()
    })
}
const handleInputConfirm = () => {
    if (inputValue.value) {
        ruleForm.tags.push(inputValue.value)
    }
    inputVisible.value = false
    inputValue.value = ''
}

// 上传封面相关函数
// 封面路径存放的变量
const uploadedFiles = ref([]);
// 上传成功函数
const handleSuccess = (response, file) => {
    ruleForm.imgUrl = response.url;
    console.log('封面已上传服务器');
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
function removeImg(file = null, fileList = null) {
    if (!ruleForm.imgUrl) return; // 如果 imgUrl 为空，则不执行删除操作

    axios.delete(ruleForm.imgUrl)
        .then(res => {
            console.log(res.data.message);
            ruleForm.imgUrl = ''; // 删除成功后清除 imgUrl
            if (fileList) {
                uploadRef.value.clearFiles(); // 清除上传的文件
            }
        })
        .catch(err => {
            console.log(err.message);
        })
}

</script>
  
  
  
  
<style lang = "less" scoped>
.custom-form-item222 :deep(.el-form-item__content) {
    // 强制添加属性
    display: block !important;
}
</style>
  
  
<style></style>
  