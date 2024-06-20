// initial state
import { StoreOptions } from "vuex";
import ACCESS_ENUM from "@/access/accessEnum";
import { UserControllerService } from "../../generated";

export default {
  namespaced: true,
  state: () => ({
    loginUser: {
      userName: "未登录",
      isLogged: false, // 添加是否登录的标志
      userRole: ACCESS_ENUM.NOT_LOGIN, // 初始用户角色设为未登录
    },
  }),
  actions: {
    async getLoginUser({ commit }, payload) {
      try {
        const res = await UserControllerService.getLoginUserUsingGet();
        if (res.code === 0) {
          commit("updateUser", { ...res.data, isLogged: true });
        } else {
          commit("updateUser", {
            userName: "未登录",
            isLogged: false,
            userRole: ACCESS_ENUM.NOT_LOGIN,
          });
        }
      } catch (error) {
        commit("updateUser", {
          userName: "未登录",
          isLogged: false,
          userRole: ACCESS_ENUM.NOT_LOGIN,
        });
        console.error("Failed to fetch user data:", error);
      }
    },
  },
  mutations: {
    updateUser(state, payload) {
      state.loginUser = { ...state.loginUser, ...payload };
    },
  },
} as StoreOptions<any>;
