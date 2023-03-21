<template>
    <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo" default-active="1"
        text-color="#fff">
        <el-menu-item index="1" @click="toHome">
            <el-icon>
                <location />
            </el-icon>
            <span>首页</span>
        </el-menu-item>

        <el-menu-item index="2" @click="toPublishArticle">
            <el-icon><icon-menu /></el-icon>
            <span>发布文章</span>
        </el-menu-item>

        <el-menu-item index="3" @click="toArticleManagement">
            <el-icon>
                <document />
            </el-icon>
            <span>文章管理</span>
        </el-menu-item>


        <el-sub-menu index="4">
            <template #title>
                <el-icon>
                    <location />
                </el-icon>
                <span>个人信息</span>
            </template>
            <el-menu-item index="4-1" @click="toProjectExperience">项目经验</el-menu-item>
            <el-menu-item index="4-2" @click="toWorkExperience">工作经验</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="5" @click="toSetting">
            <el-icon>
                <Setting />
            </el-icon>
            <span>设置</span>
        </el-menu-item>

        <el-menu-item index="6" disabled>
            <el-icon>
                <setting />
            </el-icon>
            <span>账号管理</span>
        </el-menu-item>
    </el-menu>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
} from '@element-plus/icons-vue'
const router = useRouter()

// 跳转函数
const toHome = () => {
    router.push({ name: 'Home' });
}
const toPublishArticle = () => {
    router.push({ name: 'PublishArticle' });
}
const toArticleManagement = () => {
    router.push({ name: 'ArticleManagement' });
}
const toProjectExperience = () => {
    router.push({ name: 'ProjectExperience' });
}
const toWorkExperience = () => {
    router.push({ name: 'WorkExperience' });
}
const toSetting = () => {
    router.push({ name: 'Setting' });
}

// 刷新时，根据当前路由跳转到对应的页面
onMounted(() => {
    const currentRoute = router.currentRoute.value.name
    switch (currentRoute) {
        case 'Home':
            toHome()
            break
        case 'PublishArticle':
            toPublishArticle()
            break
        case 'ArticleManagement':
            toArticleManagement()
            break
        case 'ProjectExperience':
            toProjectExperience()
            break
        case 'WorkExperience':
            toWorkExperience()
            break
        default:
            toHome()
    }
})
</script>

<style lang="less" scoped>
.el-menu-vertical-demo {
    height: 100%;
}
</style>
