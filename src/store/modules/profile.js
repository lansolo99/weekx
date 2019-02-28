import Vue from 'vue'
import firebase from 'firebase'
import sourceData from '@/profile'
import {
  EventBus
} from '@/bus'

export default {
  namespaced: true,
  state: sourceData,
  getters: {
    getProfileData (state) {
      // return state
      const retrievedUserData = {
        ...state
      }
      return retrievedUserData
    }
  },
  actions: {
    fetchProfileDatas ({
      commit
    }, authUserID) {
      return new Promise((resolve, reject) => {
        firebase.database()
          .ref('users')
          .child(authUserID)
          .child('profile')
          .once('value', snapshot => {
            commit('updateProfile', snapshot.val())
            resolve()
          })
      })
    },
    disableFirstTimeUser ({
      commit
    }) {
      commit('disableFirstTimeUser')
    },
    updateProfile ({
      commit
    }, payload) {
      commit('updateProfile', payload)
    },
    recordWeekScore ({
      commit,
      dispatch
    }, {
      progressWeek,
      currentUserWeek
    }) {
      commit('recordWeekScore', {
        progressWeek,
        currentUserWeek
      })
    }
  },
  mutations: {
    updateProfile (state, payload) {
      Object.assign(state, payload)
    },
    disableFirstTimeUser (state) {
      state.firstTime = false
    },
    recordWeekScore (state, {
      progressWeek,
      currentUserWeek
    }) {
      Vue.set(state.stats, 'progressWeek', progressWeek)
      Vue.set(state.stats.weeksRecords, currentUserWeek, progressWeek)
      EventBus.$emit('updateFirebase')
    }
  }
}
