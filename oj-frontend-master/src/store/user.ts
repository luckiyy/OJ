// initial state
import { StoreOptions } from "vuex";
import ACCESS_ENUM from "@/access/accessEnum";
import { UserControllerService } from "../../generated";

export default {
  namespaced: true,
  state: () => ({
    loginUser: {
      id: null, // 用户 ID
      userName: "未登录",
      isLogged: false, // 是否登录的标志
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
    async logoutUser({ commit }) {
      try {
        const res = await UserControllerService.userLogoutUsingPost();
        if (res.code === 0 && res.data) {
          // 注销成功后更新用户状态为未登录
          commit("updateUser", {
            id: null,
            userName: "未登录",
            isLogged: false,
            userRole: ACCESS_ENUM.NOT_LOGIN,
          });
        } else {
          console.error("Logout failed:", res.message);
        }
      } catch (error) {
        console.error("Error during logout:", error);
      }
    },
  },
  mutations: {
    updateUser(state, payload) {
      state.loginUser = { ...state.loginUser, ...payload };
    },
  },
} as StoreOptions<any>;
