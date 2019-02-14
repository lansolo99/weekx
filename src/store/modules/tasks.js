import Vue from 'vue'
import sourceData from '@/data'

export default {
  namespaced: true,
  state: sourceData.tasks,
  getters: {},
  actions: {
    addNewTask ({
      commit
    }, payload) {
      commit('addNewTask', payload)
    },
    updateTask ({
      commit
    }, {
      taskId,
      task
    }) {
      commit('updateTask', {
        taskId,
        task
      })
    },
    setCheckedStatus ({
      commit
    }, {
      taskId,
      checkstatus,
      taskType,
      subtaskId,
      checkTime,
      completionIndex,
      completionValue
    }) {
      commit('setCheckedStatus', {
        taskId,
        checkstatus,
        taskType,
        subtaskId,
        checkTime,
        completionIndex,
        completionValue
      })
    },
    deleteTask ({
      commit
    }, payload) {
      commit('deleteTask', payload)
    },
    rebootWeeklyTasksCompletions ({
      commit
    }, payload) {
      commit('rebootWeeklyTasksCompletions', payload)
    },
    updateTasksCompletionsHistory ({
      commit
    }, {
      isoWeek,
      isoDay,
      weekChange
    }) {
      commit('updateTasksCompletionsHistory', {
        isoWeek,
        isoDay,
        weekChange
      })
    }
  },
  mutations: {
    addNewTask (state, payload) {
      Vue.set(state, payload.id, payload)
      console.log(state)
    },
    updateTask (state, {
      taskId,
      task
    }) {
      state[taskId] = task
    },
    setCheckedStatus (
      state, {
        taskId,
        checkstatus,
        taskType,
        subtaskId,
        checkTime,
        completionIndex,
        completionValue
      }
    ) {
      const task = state[taskId]

      if (taskType === 'task') {
        // TASK
        task.completion[completionIndex] = completionValue
        task.checked = checkstatus
        task.checkTime = checkTime
      } else {
        // SUBTASK
        const subtask = state[taskId].subtasks.find(sub => {
          return sub.id === subtaskId
        })
        subtask.checked = checkstatus
        subtask.checkTime = checkTime
        // set checked status for parent task
        const allSubtasksChecked = Object.values(state[taskId].subtasks).every(
          v => {
            return v.checked
          }
        )

        if (allSubtasksChecked) {
          console.log('all subtask checked')
          task.checked = true
          task.completion[completionIndex] = completionValue
          task.checkTime = checkTime
        } else {
          console.log('not all subtasks checked')
          if (task.checked === true) {
            task.checked = false
            task.completion[completionIndex] = 0
          }
        }
      }
    },
    deleteTask (state, payload) {
      Vue.delete(state, payload)
    },
    rebootWeeklyTasksCompletions (state, payload) {
      // Filter weekly tasks only (after)
      for (let value of Object.values(state)) {
        const newCompletionArray = []
        value.completion.forEach((v, i) => {
          newCompletionArray.push(0)
        })
        value.completion = newCompletionArray
      }
    },
    updateTasksCompletionsHistory (state, {
      isoWeek,
      isoDay,
      weekChange
    }) {
      console.log('updateTasksCompletionsHistory')

      Object.values(state).forEach(task => {
        console.log('weekChange = ' + weekChange)
        // Reset completion slot (if ever sliced at init)
        if (weekChange) {
          // Slot Generator
          const slotsGenerator = n => {
            task.completion = []
            for (let i = 0; i < n; i++) {
              task.completion.push(0)
            }
          }

          // Case Weekly
          if (task.schedule.periodicity === 'Weekly') {
            switch (task.schedule.weekly) {
              case 'Everyday':
                slotsGenerator(7)
                break
              case 'x1 time':
                slotsGenerator(1)
                break
              case 'x2 times':
                slotsGenerator(2)
                break
              case 'x3 times':
                slotsGenerator(3)
                break
              case 'x4 times':
                slotsGenerator(4)
                break
              case 'x5 times':
                slotsGenerator(5)
                break
              case 'x6 times':
                slotsGenerator(6)
                break
            }
          }
          if (task.schedule.periodicity === 'On specific days') {
            slotsGenerator(task.schedule.specificDays.length)
          }
        }
        let currentTaskCompletion = JSON.parse(JSON.stringify(task.completion))
        // Fill empty week slots with "2" (heatmap purpose)
        const fillBlankCompletions = completion => {
          for (let i = completion.length; i < 7; i++) {
            completion.push(2)
          }
          return completion
        }
        const completionFilled = fillBlankCompletions(currentTaskCompletion)
        console.log('completionFilled = ' + completionFilled)

        let formattedIsoWeek = 'W' + isoWeek
        Vue.set(task.completionsHistory, formattedIsoWeek, completionFilled)
      })
    }
  }
}
