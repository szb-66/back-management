<template>
    <section>
        <div class="leaves">
            <div class="set">
                <div v-for="i in 8" :key="i"><img :src="`src/assets/images/login/leaf_0${i % 4 + 1}.png`"></div>
            </div>
        </div>
        <img src="src/assets/images/login/bg.jpg" class="bg">
        <img src="src/assets/images/login/girl.png" class="girl">
        <img src="src/assets/images/login/trees.png" class="trees">
        <div class="login">
            <h2>登陆</h2>
            <form class="innner">
                <div class="inputBox">
                    <input type="text" v-model="username" required placeholder="请输入用户名">
                </div>
                <div class="inputBox">
                    <input type="password" v-model="password" required placeholder="请输入密码">
                </div>
                <div class="inputBox">
                    <input type="submit" value="登陆" id="btn" @click="onSubmit()">
                </div>
                <div class="group">
                    <a href="#">忘记密码</a>
                    <a href="#">注册</a>
                </div>
            </form>
        </div>
    </section>
</template>

<script setup>
import { ref,defineEmits } from 'vue'
import axios from 'axios'

const username = ref('')
const password = ref('')

// 定义自定义事件
const emits = defineEmits(['login-success']);

// 向服务器提交数据
const onSubmit = () => {
    axios.post('szb-api/login', {
        username: username.value,
        password: password.value,
    }).then(res => {
        if (res.data.message === '登陆成功') {
            ElMessage({
                message: '登陆成功',
                type: 'success',
            });
            // 触发自定义事件，通知父组件更新 showLogin 的值
            emits('login-success');
        } else {
            ElMessage({
                message: '登陆失败',
                type: 'error',
            });
        }
    }).catch(err => {
        ElMessage({
            message: err.message,
            type: 'error',
        });
    });
};

</script>






<style lang="less" scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Poppins', sans-serif;
}

section {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    overflow-x: hidden;

    .bg,
    .trees {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        pointer-events: none;
    }

    .trees {
        z-index: 100;
    }

    .girl {
        position: absolute;
        scale: 0.65;
        animation: animateGirl 10s linear infinite;
        pointer-events: none;
    }
}

@keyframes animateGirl {
    0% {
        transform: translateX(calc(50% + 100vw));
    }

    50% {
        transform: translateX(calc(-100% - 100vw));
    }

    50.01% {
        transform: translateX(calc(-100% - 100vw)) rotateY(180deg);
    }

    100% {
        transform: translateX(calc(50% + 100vw)) rotateY(180deg);
    }
}

.login {
    position: relative;
    padding: 60px;
    background-color: rgba(255, 255, 255, .25);
    backdrop-filter: blur(15px);
    width: 500px;
    border-radius: 20px;
    border: 1px solid #fff;
    border-right-color: rgba(255, 255, 255, .5);
    border-bottom-color: rgba(255, 255, 255, .5);
    display: flex;
    flex-direction: column;
    gap: 30px;

    h2 {
        position: relative;
        width: 100%;
        text-align: center;
        font-size: 2.5em;
        font-weight: 600;
        color: #8f2c24;
        margin-bottom: 10px;
    }

    .inputBox input {
        position: relative;
        width: 100%;
        padding: 15px 20px;
        outline: none;
        font-size: 1.25em;
        color: #8f2c24;
        border-radius: 5px;
        background-color: #fff;
        border: none;
        margin-bottom: 30px;

        ::placeholder {
            color: #8f2c24;
        }
    }

    .inputBox #btn {
        position: relative;
        border: none;
        outline: none;
        background-color: #8f2c24;
        color: #fff;
        cursor: pointer;
        font-size: 1.25em;
        font-weight: 500;
        transition: 0.5s;

        &:hover {
            background-color: #d64c42;
        }
    }

    .group {
        display: flex;
        justify-content: space-between;

        a {
            font-size: 1.25em;
            color: #8f2c24;
            font-weight: 500;
            text-decoration: none;

            &:nth-child(2) {
                text-decoration: underline;
            }
        }
    }
}

.leaves {
    position: absolute;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    pointer-events: none;

    .set {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        pointer-events: none;

        div {
            position: absolute;
            display: block;

            img {
                width: 100%;
                height: 100%;
            }
        }

        div:nth-child(1) {
            left: 20%;
            animation: animate 20s linear infinite;
        }

        div:nth-child(2) {
            left: 50%;
            animation: animate 14s linear infinite;
        }

        div:nth-child(3) {
            left: 70%;
            animation: animate 12s linear infinite;
        }

        div:nth-child(4) {
            left: 5%;
            animation: animate 15s linear infinite;
        }

        div:nth-child(5) {
            left: 85%;
            animation: animate 18s linear infinite;
        }

        div:nth-child(6) {
            left: 90%;
            animation: animate 12s linear infinite;
        }

        div:nth-child(7) {
            left: 15%;
            animation: animate 14s linear infinite;
        }

        div:nth-child(8) {
            left: 60%;
            animation: animate 15s linear infinite;
        }
    }
}

@keyframes animate {
    0% {
        opacity: 0;
        top: -10%;
        transform: translateX(20px) rotate(0deg);
    }

    10% {
        opacity: 1;
    }

    20% {
        transform: translateX(-20px) rotate(45deg);
    }

    40% {
        transform: translateX(-20px) rotate(90deg);
    }

    60% {
        transform: translateX(20px) rotate(180deg);
    }

    80% {
        transform: translateX(-20px) rotate(45deg);
    }

    100% {
        top: 110%;
        transform: translateX(20px) rotate(225deg);
    }
}
</style>