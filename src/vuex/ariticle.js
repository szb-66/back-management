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
                imgUrl:''
            }
        };
    },
    mutations: {
        updateRuleForm(state, payload) {
            // state.ruleForm = payload;
            state.ruleForm = Object.assign({}, state.ruleForm, payload);
        }
    }
});

export {store}