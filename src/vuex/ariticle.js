// 文章表单刷新不重置
import { createStore } from 'vuex';
const store = createStore({
    state() {
        return {
            ruleForm: {
                title: '',
                type: '未分类',
                content: '',
                tags: [],
                created_at:''
            }
        };
    },
    mutations: {
        updateRuleForm(state, payload) {
            state.ruleForm = payload;
        }
    }
});

export {store}