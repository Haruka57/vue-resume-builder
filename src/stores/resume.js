import { defineStore } from 'pinia'

export const useResumeStore = defineStore('resume', {
  state: () => ({
    personalInfo: {
      name: '你的名字',
      jobTitle: '前端开发实习生',
      email: 'hello@example.com',
      phone: '138-xxxx-xxxx',
      summary: '热爱前端开发，具备扎实的 JavaScript 基础与 Vue 3 生态开发经验。对新技术保持好奇心，具备良好的代码规范，目前正在寻找前端开发实习机会。',
      avatar: ''
    },
    experiences: [],
    educations: [
      {
        id: crypto.randomUUID(),
        school: '某某大学',
        major: '计算机科学与技术',
        degree: '本科 (大三)',
        startDate: '2023-09',
        endDate: '2027-06'
      }
    ],
    projects: [
      {
        id: crypto.randomUUID(),
        name: 'AI 智能厨师',
        role: '前端开发',
        description: '1. 负责项目的前端核心业务开发。\n2. 实现 Markdown 解析渲染模块，优化状态管理流程。\n3. 与后端接口对接，完成核心交互逻辑。'
      }
    ],
    skills: 'Vue 3, JavaScript, Tailwind CSS, Pinia, Markdown 解析'
  }),

  actions: {
    addExperience() {
      this.experiences.push({
        id: crypto.randomUUID(),
        company: '', position: '', startDate: '', endDate: '', description: ''
      })
    },
    removeExperience(id) {
      this.experiences = this.experiences.filter(exp => exp.id !== id)
    },

    addEducation() {
      this.educations.push({
        id: crypto.randomUUID(),
        school: '', major: '', degree: '', startDate: '', endDate: ''
      })
    },
    removeEducation(id) {
      this.educations = this.educations.filter(edu => edu.id !== id)
    },

    addProject() {
      this.projects.push({
        id: crypto.randomUUID(),
        name: '', role: '', description: ''
      })
    },
    removeProject(id) {
      this.projects = this.projects.filter(proj => proj.id !== id)
    }
  }
})
