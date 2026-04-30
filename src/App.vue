<script setup>
import { useResumeStore } from './stores/resume.js'
// 1. 引入需要的 shadcn 组件 (新增了 Button 组件)
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const resumeStore = useResumeStore()
</script>

<template>
  <div class="fixed inset-0 flex flex-row overflow-hidden bg-slate-50 text-slate-900">
    
    <!-- 左侧编辑器：固定宽度，自带滚动条 -->
    <aside class="w-[400px] shrink-0 h-full border-r bg-white overflow-y-auto p-6 shadow-sm">
      <div class="max-w-full mx-auto">
        <header class="mb-8">
          <h1 class="text-2xl font-bold tracking-tight">简历编辑器</h1>
          <p class="text-slate-500 text-sm mt-1">在这里输入经历，右侧将实时更新。</p>
        </header>

        <div class="space-y-6">
          
          <section class="p-4 border rounded-lg bg-slate-50/50">
            <h2 class="font-semibold mb-4 text-slate-700">个人信息</h2>
            <div class="grid gap-4">
              <div class="space-y-2">
                <Label for="name" class="text-xs font-bold uppercase text-slate-500">姓名</Label>
                <Input id="name" v-model="resumeStore.personalInfo.name" placeholder="请输入你的姓名" />
              </div>
              <div class="space-y-2">
                <Label for="jobTitle" class="text-xs font-bold uppercase text-slate-500">职位标题</Label>
                <Input id="jobTitle" v-model="resumeStore.personalInfo.jobTitle" placeholder="例如：前端开发工程师" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="email" class="text-xs font-bold uppercase text-slate-500">邮箱</Label>
                  <Input id="email" v-model="resumeStore.personalInfo.email" type="email" placeholder="你的邮箱" />
                </div>
                <div class="space-y-2">
                  <Label for="phone" class="text-xs font-bold uppercase text-slate-500">电话</Label>
                  <Input id="phone" v-model="resumeStore.personalInfo.phone" type="tel" placeholder="你的电话" />
                </div>
              </div>
              <div class="space-y-2">
                <Label for="summary" class="text-xs font-bold uppercase text-slate-500">个人总结</Label>
                <Textarea 
                  id="summary" 
                  v-model="resumeStore.personalInfo.summary" 
                  placeholder="简单介绍一下你的核心优势和职业目标..."
                  class="h-28 resize-none" 
                />
              </div>
            </div>
          </section>

          <section class="p-4 border rounded-lg bg-slate-50/50">
            <div class="flex justify-between items-center mb-4">
              <h2 class="font-semibold text-slate-700">工作经历</h2>
              <Button variant="outline" size="sm" @click="resumeStore.addExperience()">
                + 添加经历
              </Button>
            </div>

            <div class="space-y-6">
              <div 
                v-for="(exp, index) in resumeStore.experiences" 
                :key="exp.id"
                class="p-4 border bg-white rounded-md relative group transition-all"
              >
                <Button 
                  variant="destructive" 
                  size="icon" 
                  class="absolute -top-3 -right-3 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  @click="resumeStore.removeExperience(exp.id)"
                  title="删除此经历"
                >
                  ×
                </Button>

                <div class="grid gap-4">
                  <div class="space-y-2">
                    <Label class="text-xs font-bold uppercase text-slate-500">公司名称</Label>
                    <Input v-model="exp.company" placeholder="例如：某知名互联网公司" />
                  </div>
                  <div class="space-y-2">
                    <Label class="text-xs font-bold uppercase text-slate-500">职位</Label>
                    <Input v-model="exp.position" placeholder="例如：前端开发工程师" />
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <Label class="text-xs font-bold uppercase text-slate-500">开始时间</Label>
                      <Input v-model="exp.startDate" placeholder="2022-06" />
                    </div>
                    <div class="space-y-2">
                      <Label class="text-xs font-bold uppercase text-slate-500">结束时间</Label>
                      <Input v-model="exp.endDate" placeholder="至今" />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <Label class="text-xs font-bold uppercase text-slate-500">工作描述</Label>
                    <Textarea 
                      v-model="exp.description" 
                      placeholder="描述你的主要职责和工作业绩..."
                      class="h-24 resize-none" 
                    />
                  </div>
                </div>
              </div>
              
              <div v-if="resumeStore.experiences.length === 0" class="text-center text-sm text-slate-400 py-4">
                暂无工作经历，点击右上角添加。
              </div>
            </div>
          </section>

        </div>
      </div>
    </aside>

    <main class="flex-1 min-w-0 h-full overflow-auto bg-slate-200 p-8">
      <div class="w-full h-full flex justify-center items-start min-w-max">
        
        <div class="w-[210mm] min-h-[297mm] shrink-0 bg-white shadow-2xl p-[15mm] transition-all duration-300 ease-in-out" id="resume-preview">
          
          <header class="text-center border-b-2 border-slate-800 pb-4 mb-6">
            <h1 class="text-4xl font-serif font-bold uppercase tracking-widest text-slate-800">
              {{ resumeStore.personalInfo.name || '姓名' }}
            </h1>
            <p class="text-lg text-blue-600 font-medium mt-2">
              {{ resumeStore.personalInfo.jobTitle || '求职意向' }}
            </p>
            <div class="flex justify-center items-center gap-4 mt-3 text-sm text-slate-600 font-medium">
              <span v-if="resumeStore.personalInfo.email" class="flex items-center gap-1">
                ✉️ {{ resumeStore.personalInfo.email }}
              </span>
              <span v-if="resumeStore.personalInfo.email && resumeStore.personalInfo.phone" class="text-slate-300">|</span>
              <span v-if="resumeStore.personalInfo.phone" class="flex items-center gap-1">
                📱 {{ resumeStore.personalInfo.phone }}
              </span>
            </div>
          </header>

          <div class="space-y-6">
            
            <section v-if="resumeStore.personalInfo.summary">
              <h2 class="text-lg font-bold text-slate-800 border-b border-slate-200 pb-1 mb-3 uppercase tracking-wider">
                个人总结 / Summary
              </h2>
              <p class="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">
                {{ resumeStore.personalInfo.summary }}
              </p>
            </section>
            
            <section v-if="resumeStore.experiences.length > 0">
              <h2 class="text-lg font-bold text-slate-800 border-b border-slate-200 pb-1 mb-3 uppercase tracking-wider">
                工作经历 / Experience
              </h2>
              
              <div class="space-y-4">
                <div v-for="exp in resumeStore.experiences" :key="exp.id">
                  <div class="flex justify-between items-baseline mb-1">
                    <h3 class="font-bold text-slate-800">{{ exp.company || '公司名称' }}</h3>
                    <span class="text-sm font-medium text-slate-500">
                      {{ exp.startDate }} - {{ exp.endDate }}
                    </span>
                  </div>
                  <div class="text-sm font-semibold text-blue-600 mb-2">
                    {{ exp.position || '职位名称' }}
                  </div>
                  <p class="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">
                    {{ exp.description }}
                  </p>
                </div>
              </div>
            </section>

          </div>
        </div>

      </div>
    </main>
  </div>
</template>