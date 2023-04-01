<template>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" :size="formSize"
        status-icon label-position="top">

        <!-- 标题 -->
        <el-form-item label="文章标题" prop="title">
            <el-input v-model="ruleForm.title" />
        </el-form-item>
        <!-- 封面 -->
        <el-form-item label="封面" prop="cover_img_url">
            <el-upload ref="uploadRef" class="upload-demo" action="szb-api/images" :limit="1"
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

        <!-- 知识库 -->
        <el-form-item label="知识库" prop="knowledge_base">
            <el-select v-model="ruleForm.knowledge_base" placeholder="请选择">
                <el-option v-for="item in base" :key="item" :label="item" :value="item" />
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
            <Editor id="content" :init="tinymceInit" v-model="ruleForm.content"
                api-key="8dhhq3d47uy2o92tjh5anq5m1c7vm7dixz6t6r9fhht67bpd" ></Editor>
        </el-form-item>
        <!-- <vue3-tinymce :setting="tinymceInit"/> -->

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
import Editor from '@tinymce/tinymce-vue';
// 导出tinymce的插件
// import 'tinymce/plugins/image';


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
        const response = await axios.get('szb-api/types');
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
    cover_img_url: '',
    knowledge_base: '未分类',
})

const base = ['设计知识库','开发知识库']


// 设置富文本编辑器
const example_image_upload_handler = (blobInfo, progress) => new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());

    axios.post('szb-api/images', formData, {
        withCredentials: false,
        onUploadProgress: (e) => {
            progress(e.loaded / e.total * 100);
        }
    })
        .then(response => {
            const json = response.data.url;

            if (!json || typeof json != 'string') {
                reject('Invalid JSON: ' + JSON.stringify(json));
                return;
            }
            resolve(json);
        })
        .catch(error => {
            if (error.response && error.response.status === 403) {
                reject({ message: 'HTTP Error: ' + error.response.status, remove: true });
            } else {
                reject('HTTP Error: ' + error.message);
            }
        });
});
const tinymceInit = {
    language: 'zh-Hans',
    language_url: 'https://unpkg.com/@jsdawn/vue3-tinymce@2.0.2/dist/tinymce/langs/zh-Hans.js',
    images_upload_handler: example_image_upload_handler,
};





// 检测规则
const rules = reactive({
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' },
        { min: 1, max: 20, message: '长度在1~20之间', trigger: 'blur' },
    ],
    cover_img_url: [
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
                await axios.post('szb-api/articles', ruleForm);
                // 清除表单字段
                formEl.resetFields()
                // 清除上传的文件
                if (uploadRef.value) {
                    uploadRef.value.clearFiles();
                }
                ElMessage({
                    message: `提交成功`,
                    type: 'success',
                })
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
            // 清除富文本编辑器内容
            ruleForm.content = '';
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
    ruleForm.cover_img_url = response.url;
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
    if (!ruleForm.cover_img_url) return; // 如果 cover_img_url 为空，则不执行删除操作

    axios.delete(ruleForm.cover_img_url)
        .then(res => {
            console.log(res.data.message);
            ruleForm.cover_img_url = ''; // 删除成功后清除 cover_img_url
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
  