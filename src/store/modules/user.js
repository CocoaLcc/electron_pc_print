import { login, logout, getInfo } from "@/api/user";
import { resetRouter } from "@/router";
import { remove } from "nprogress";

const getDefaultState = () => {
  return {
    token: null,
    name: "企业购2.0供应商",
    avatar: "",
    roles: [1],
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then((response) => {
          // console.log('====>>' + JSON.stringify(response))
          const { data } = response;
          // const { role: roles } = data
          commit("SET_TOKEN", data.token);
          // setToken(data.token)
          // setRoles(JSON.stringify([1]))
          // setPassword(userInfo.password)
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo(state.token).then(response => {
  //       const { data } = response

  //       if (!data) {
  //         return reject('Verification failed, please Login again.')
  //       }

  //       const { name, avatar } = data

  //       commit('SET_NAME', name)
  //       commit('SET_AVATAR', avatar)
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // user logout
  logout({ commit, state }) {
    removeToken(); // must remove  token  first
    removePassword();
    removeRoles();
    resetRouter();
    commit("RESET_STATE");
    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     removeToken() // must remove  token  first
    //     resetRouter()
    //     commit('RESET_STATE')
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      removePassword();
      commit("RESET_STATE");
      resolve();
    });
  },
  setRoles({ commit }, roles) {
    // console.log('SET_ROLES' + JSON.stringify(roles))
    commit("SET_ROLES", roles);
  },
  setName({ commit }) {
    commit("SET_NAME", "企业购2.0供应商");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
