// 初始状态
import { StoreOptions } from "vuex";
import ACCESS_ENUM from "@/access/accessEnum";
import { UserControllerService } from "../../generated";

export default {
  namespaced: true,
  state: () => ({
    loginUser: {
      id: null, // 添加用户 ID
      userName: "未登录",
      isLogged: false,
      userRole: ACCESS_ENUM.NOT_LOGIN,
    },
  }),
  actions: {
    async getLoginUser({ commit }, payload) {
      try {
        const res = await UserControllerService.getLoginUserUsingGet();
        if (res.code === 0) {
          // 除了更新已有的信息，还要添加 id 字段
          commit("updateUser", { ...res.data, isLogged: true });
        } else {
          commit("updateUser", {
            id: null, // 确保注销或失败时清空 ID
            userName: "未登录",
            isLogged: false,
            userRole: ACCESS_ENUM.NOT_LOGIN,
          });
        }
      } catch (error) {
        commit("updateUser", {
          id: null,
          userName: "未登录",
          isLogged: false,
          userRole: ACCESS_ENUM.NOT_LOGIN,
        });
        console.error("获取用户数据失败:", error);
      }
    },
  },
  mutations: {
    updateUser(state, payload) {
      // 更新 state 中 loginUser 的数据
      state.loginUser = { ...state.loginUser, ...payload };
    },
  },
} as StoreOptions<any>;
