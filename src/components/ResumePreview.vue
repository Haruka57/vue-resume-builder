<script setup>
import { useResumeStore } from '@/stores/resume.js'
import { computed } from 'vue'
// 👇 直接从 lucide-vue-next 解构引入你需要的图标名字
import { 
  Mail, 
  Smartphone, 
  UserRound, 
  GraduationCap, 
  Code, 
  Briefcase, 
  Sparkles 
} from 'lucide-vue-next'

const resumeStore = useResumeStore()

// 计算属性：将输入的字符串按照逗号切割成数组，方便渲染标签
const skillsList = computed(() => {
  if (!resumeStore.skills) return []
  // 支持中文逗号和英文逗号切割，并过滤掉空字符串
  return resumeStore.skills.split(/[,，]/).map(s => s.trim()).filter(s => s)
})
</script>

<template>
  <!-- 加上 print:w-full 和 print:min-h-0，打印时放弃死板的 210mm，把尺寸控制权彻底交给浏览器原生的 A4 纸模型 -->
  <div class="w-[210mm] min-h-[297mm] shrink-0 bg-white shadow-2xl p-[15mm] transition-all duration-300 ease-in-out print:shadow-none print:m-0 print:w-full print:min-h-0" id="resume-preview">
    
    <!-- 1. 简历头部：极限瘦身，缩小底边距 pb-3 mb-3 -->
    <header class="flex justify-between items-center border-b-[1.5px] border-slate-300 pb-3 mb-3">
      
      <!-- 左侧：文字信息。使用 gap-0.5 极限压缩行间距 -->
      <div class="flex flex-col gap-0.5 flex-1 pr-4">
        <!-- 姓名：缩小到 text-2xl -->
        <h1 class="text-2xl font-black tracking-widest text-slate-900 leading-none">
          {{ resumeStore.personalInfo.name || '姓名' }}
        </h1>
        
        <!-- 职位：缩小到 text-xs -->
        <p class="text-xs text-slate-600 font-medium mt-1">
          {{ resumeStore.personalInfo.jobTitle || '求职意向' }}
        </p>
        
        <!-- 联系方式：更加紧凑 -->
        <div class="flex items-center gap-3 text-xs text-slate-500 mt-1">
          <span v-if="resumeStore.personalInfo.email" class="flex items-center gap-1">
            <Mail class="w-3.5 h-3.5 text-slate-400" /> {{ resumeStore.personalInfo.email }}
          </span>
          <span v-if="resumeStore.personalInfo.email && resumeStore.personalInfo.phone" class="text-slate-300">|</span>
          <span v-if="resumeStore.personalInfo.phone" class="flex items-center gap-1">
            <Smartphone class="w-3.5 h-3.5 text-slate-400" /> {{ resumeStore.personalInfo.phone }}
          </span>
        </div>
      </div>

      <!-- 右侧：头像区域缩小版 (20mm x 28mm，保持 5:7 比例) -->
      <div 
        class="w-[20mm] h-[28mm] shrink-0 rounded overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center shadow-sm"
        style="-webkit-print-color-adjust: exact; print-color-adjust: exact;"
      >
        <img 
          v-if="resumeStore.personalInfo.avatar" 
          :src="resumeStore.personalInfo.avatar" 
          class="w-full h-full object-cover block" 
        />
        <UserRound v-else class="w-5 h-5 text-slate-300" />
      </div>

    </header>

    <!-- 简历主体：全局缩小模块间的垂直间距 -->
    <div class="space-y-4">
      
      <!-- 个人总结 -->
      <section v-if="resumeStore.personalInfo.summary">
        <!-- 👇 gap-4 增加了间距 -->
        <div class="flex items-center gap-4 border-b border-slate-200 pb-2 mb-3">
          <UserRound class="w-5 h-5 text-slate-600" />
          <!-- 👇 text-base 缩小了标题 -->
          <h2 class="text-base font-bold text-slate-800 uppercase tracking-wider">
            个人总结 / Summary
          </h2>
        </div>
        <p class="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">{{ resumeStore.personalInfo.summary }}</p>
      </section>

      <!-- 教育背景 -->
      <section v-if="resumeStore.educations.length > 0">
        <div class="flex items-center gap-4 border-b border-slate-200 pb-2 mb-3">
          <GraduationCap class="w-5 h-5 text-slate-600" />
          <h2 class="text-base font-bold text-slate-800 uppercase tracking-wider">
            教育背景 / Education
          </h2>
        </div>
        <div class="space-y-3">
          <div v-for="edu in resumeStore.educations" :key="edu.id">
            <div class="flex justify-between items-baseline mb-1">
              <h3 class="font-bold text-slate-800 text-base">{{ edu.school || '学校名称' }}</h3>
              <span class="text-sm font-medium text-slate-500">{{ edu.startDate }} - {{ edu.endDate }}</span>
            </div>
            <div class="text-sm font-semibold text-slate-700">
              {{ edu.major || '专业' }} <span v-if="edu.degree" class="font-normal text-slate-500 ml-2">| {{ edu.degree }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 项目经验 -->
      <section v-if="resumeStore.projects.length > 0">
        <div class="flex items-center gap-4 border-b border-slate-200 pb-2 mb-3">
          <Code class="w-5 h-5 text-slate-600" />
          <h2 class="text-base font-bold text-slate-800 uppercase tracking-wider">
            项目经验 / Projects
          </h2>
        </div>
        <div class="space-y-4">
          <div v-for="proj in resumeStore.projects" :key="proj.id">
            <div class="flex items-baseline gap-3 mb-1">
              <h3 class="font-bold text-slate-800 text-base">{{ proj.name || '项目名称' }}</h3>
              <span class="text-sm font-semibold text-blue-600">{{ proj.role }}</span>
            </div>
            <p class="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">{{ proj.description }}</p>
          </div>
        </div>
      </section>
      
      <!-- 工作经历 -->
      <section v-if="resumeStore.experiences.length > 0">
        <div class="flex items-center gap-4 border-b border-slate-200 pb-2 mb-3">
          <Briefcase class="w-5 h-5 text-slate-600" />
          <h2 class="text-base font-bold text-slate-800 uppercase tracking-wider">
            工作经历 / Experience
          </h2>
        </div>
        <div class="space-y-4">
          <div v-for="exp in resumeStore.experiences" :key="exp.id">
            <div class="flex justify-between items-baseline mb-1">
              <h3 class="font-bold text-slate-800 text-base">{{ exp.company || '公司名称' }}</h3>
              <span class="text-sm font-medium text-slate-500">{{ exp.startDate }} - {{ exp.endDate }}</span>
            </div>
            <div class="text-sm font-semibold text-blue-600 mb-1">{{ exp.position || '职位名称' }}</div>
            <p class="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">{{ exp.description }}</p>
          </div>
        </div>
      </section>

      <!-- 专业技能 -->
      <section v-if="skillsList.length > 0">
        <div class="flex items-center gap-4 border-b border-slate-200 pb-2 mb-3">
          <Sparkles class="w-5 h-5 text-slate-600" />
          <h2 class="text-base font-bold text-slate-800 uppercase tracking-wider">
            专业技能 / Skills
          </h2>
        </div>
        <div class="flex flex-wrap gap-2 mt-2">
          <span 
            v-for="(skill, index) in skillsList" 
            :key="index"
            class="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-md font-medium border border-slate-200"
          >
            {{ skill }}
          </span>
        </div>
      </section>

    </div>
  </div>
</template>


