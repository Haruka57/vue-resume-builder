import { defineStore } from 'pinia'

export const useResumeStore = defineStore('resume', {
  state: () => ({
    // 1. 个人基本信息
    personalInfo: {
      name: '',
      jobTitle: '',
      email: '',
      phone: '',
      summary: ''
    },

    // 2. 工作经验 (数组)
    experiences: [
      {
        id: crypto.randomUUID(), // 自动生成一个唯一ID
        company: '某知名互联网公司',
        position: '前端开发工程师',
        startDate: '2022-06',
        endDate: '至今',
        description: '1. 负责核心业务的前端架构与开发。\n2. 使用 Vue3 + Vite 重构老旧系统。'
      }
    ]
  }),

  // actions 专门用来修改 state 里的数据
  actions: {
    // 新增一条空白的工作经历
    addExperience() {
      this.experiences.push({
        id: crypto.randomUUID(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
      })
    },

    // 根据 ID 删除一条工作经历
    removeExperience(id) {
      this.experiences = this.experiences.filter(exp => exp.id !== id)
    }
  }
})