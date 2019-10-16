// import { login, logout, getInfo } from '@/user'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/token'
import {
  resetRouter
} from '@/router/router'
import V from '../../main'

const state = {
  name: '',
  avatar: '',
  roles: []
}

const mutations = {
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // 用户信息
  userInfo({
    commit
  },) {
    try {
      return new Promise((resolve, reject) => {
        const userInfo = JSON.parse(getToken('ht-userInfo'))
        let rolesList = []
        if(userInfo){
          commit('SET_NAME', userInfo.user.name); 
          if (userInfo.func) {
            for(let item of userInfo.func){
              rolesList.push(item.myselfId)
            }
            commit('SET_ROLES', rolesList);
          }
          resolve(rolesList);
        }else{
          logout()
        }
        
      });
    } catch (error) {
      reject(error);
    }
  },

  //更新refreshtoken
  resetToken({
    commit
  }) {
    return new Promise((resolve, reject) => {
      const resToken = getToken('ht-refreshtoken')
      V.$api.post('/refreshToken', {refresh_token: resToken}, (res) => {
        resolve(res)
      }, (res) => {
        reject(res)
      })
    })
  },

  // 登出
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      removeToken('ht-token')
      removeToken('ht-refreshtoken')
      removeToken('ht-userInfo')
      commit('SET_ROLES', []);
      commit('SET_NAME', '');
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}