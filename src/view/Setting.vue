<template>
    <!-- 文章类型管理 -->
    <div class="types">
        <span>文章类型：</span>
        <!-- 标签 -->
        <el-tag v-for="tag in dynamicTags" :key="tag" class="mx-1" closable :disable-transitions="false"
            @close="handleClose(tag)">
            {{ tag }}
        </el-tag>
        <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="ml-1 w-20" size="small"
            @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
        <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
            + New Tag
        </el-button>
    </div>
    <!-- 类型权重管理 -->
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="type" label="类型" width="180" />
        <el-table-column prop="weight" label="权重" width="180" />
    </el-table>
</template>
  
<script setup>
import { nextTick, ref, onMounted } from 'vue'
import { ElInput } from 'element-plus'
import axios from 'axios';


const dynamicTags = ref(null) // 类型列表
const tableData = ref(null) // 类型权重列表

// 获取类型列表
onMounted(() => {
    fetchArticles(dynamicTags);
    getTypeByWeight(tableData);
});

// 沟通服务器获取数据,并将数据赋值给form
async function fetchArticles(dynamicTags) {
    try {
        const response = await axios.get('szb-api/types');
        dynamicTags.value = response.data.map(tag => tag.type);
    } catch (error) {
        console.error('获取文章列表失败：', error);
    }
}

async function getTypeByWeight(tableData) {
    try {
        const response = await axios.get('szb-api/types/byWeight');
        tableData.value = response.data
    } catch (error) {
        console.error('按权重获取文章列表失败：', error);
    }
}

const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref()
// 当点击标签的关闭图标时，从标签列表中删除指定的标签。
const handleClose = (tag) => {
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
    axios.delete('szb-api/types/' + tag)
        .then(response => {
            console.log(response.data.message);
        })
        .catch(error => {
            console.log(error);
        });
}
// 当点击"添加标签"按钮时，显示输入标签的输入框，并将输入框的焦点设置为输入状态。
const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value.input.focus()
    })
}
// 当输入标签的输入框中按下"Enter"键时，将输入框中的文本作为一个新标签添加到标签列表中，并隐藏输入框。
const handleInputConfirm = () => {
    if (inputValue.value) {
        dynamicTags.value.push(inputValue.value)
    }

    axios.post('szb-api/types/', { type: inputValue.value })
        .then(response => {
            console.log(response.data.message);
        })
        .catch(error => {
            console.log(error);
        });

    inputVisible.value = false
    inputValue.value = ''
}

</script>

<style lang="less" scoped></style>