<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/oj-logo.svg" />
            <div class="title">鱼 OJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <div v-if="store.state.user.loginUser?.userName === '未登录'">
        <a-button type="primary" @click="goToLogin">登录</a-button>
      </div>
      <div v-else class="user-id-display">
        用户ID:
        {{ store.state.user?.loginUser?.id }}
        <!-- 注销按钮 -->
        <a-button type="primary" @click="logout">注销</a-button>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "../router/routes";
import { useRoute, useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import ACCESS_ENUM from "@/access/accessEnum";
import { UserControllerService } from "../../generated";

const router = useRouter();
const store = useStore();

// 展示在菜单的路由数组
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});

// 默认主页
const selectedKeys = ref(["/"]);

// 路由跳转后，更新选中的菜单项
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

console.log();

setTimeout(() => {
  store.dispatch("user/getLoginUser", {
    userName: "鱼皮管理员",
    userRole: ACCESS_ENUM.ADMIN,
  });
}, 3000);

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

const goToLogin = () => {
  router.push("/user/login");
};

// 添加注销事件处理函数
const logout = async () => {
  try {
    const res = await UserControllerService.userLogoutUsingPost();
    if (res.code === 0 && res.data) {
      // 检查是否成功注销，并显示对应的消息
      alert("注销成功");
      store.commit("updateUser", {
        userName: "未登录",
        isLogged: false,
        userRole: ACCESS_ENUM.NOT_LOGIN,
      });
      router.push("/user/login"); // 注销后重定向到登录页面
    } else {
      alert(res.message);
    }
  } catch (error) {
    console.error("注销失败:", error);
    alert("注销过程中发生错误");
  }
};
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #444;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
.a-button {
  border: none;
  background-color: #1890ff;
  color: white;
  padding: 4px 12px;
  cursor: pointer;
}

.a-button:hover {
  background-color: #40a9ff;
}
.user-id-display {
  border: 1px solid #d9d9d9;
  background-color: #f0f2f5;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 16px;
  color: #595959;
  display: inline-block;
  margin-left: 16px;
  white-space: nowrap;
}
</style>
