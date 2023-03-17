// 文章表单刷新不重置
import { createStore } from 'vuex';
const store = createStore({
    state() {
        return {
            ruleForm: {
                title: '',
                type: '',
                content: '',
                tags: [],
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