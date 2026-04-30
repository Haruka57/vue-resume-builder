<script setup>
import { ref } from 'vue'
import { useResumeStore } from '@/stores/resume.js'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

// 引入 Dialog 弹窗组件
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription, // 👉 新增这一个
} from '@/components/ui/dialog'
// 引入裁剪器组件和样式
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

const resumeStore = useResumeStore()

const handleExportPDF = () => {
  window.print()
}

// === 裁剪功能的核心状态 ===
const cropperRef = ref(null)      // 裁剪器的引用
const isCropDialogOpen = ref(false) // 控制弹窗显示隐藏
const currentUploadImage = ref('')  // 当前用户选择的原图

// 1. 用户选择图片后，触发这个函数
const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      // 把原图传给裁剪器
      currentUploadImage.value = e.target.result
      // 打开裁剪弹窗
      isCropDialogOpen.value = true
      // 清空 input 的值，允许用户重复上传同一张图片
      event.target.value = ''
    }
    reader.readAsDataURL(file)
  }
}

// 2. 用户在弹窗里点击“确认裁剪”
const confirmCrop = () => {
  if (cropperRef.value) {
    // 获取裁剪后的 Base64 数据
    cropperRef.value.getCropData((data) => {
      // 保存到 Pinia 商店
      resumeStore.personalInfo.avatar = data
      // 关闭弹窗
      isCropDialogOpen.value = false
    })
  }
}
</script>

<template>
  <aside class="w-[350px] shrink-0 h-full border-r bg-white overflow-y-auto p-6 shadow-sm z-10">
    <div class="max-w-full mx-auto">
      <header class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">简历编辑器</h1>
          <p class="text-slate-500 text-sm mt-1">在这里输入经历，实时预览。</p>
        </div>
        <Button @click="handleExportPDF" class="bg-slate-900 hover:bg-slate-800 text-white">
          导出 PDF
        </Button>
      </header>

      <div class="space-y-6">
        <!-- 个人信息 -->
        <section class="p-4 border rounded-lg bg-slate-50/50">
          <h2 class="font-semibold mb-4 text-slate-700">个人信息</h2>
          <div class="grid gap-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label class="text-xs font-bold uppercase text-slate-500">姓名</Label>
                <Input v-model="resumeStore.personalInfo.name" />
              </div>
              <div class="space-y-2">
                <Label class="text-xs font-bold uppercase text-slate-500">职位</Label>
                <Input v-model="resumeStore.personalInfo.jobTitle" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label class="text-xs font-bold uppercase text-slate-500">邮箱</Label>
                <Input v-model="resumeStore.personalInfo.email" />
              </div>
              <div class="space-y-2">
                <Label class="text-xs font-bold uppercase text-slate-500">电话</Label>
                <Input v-model="resumeStore.personalInfo.phone" />
              </div>
            </div>
            <!-- 👇 新增：头像上传 -->
            <div class="space-y-2">
              <Label class="text-xs font-bold uppercase text-slate-500">上传头像 (可选)</Label>
              <Input 
                type="file" 
                accept="image/*" 
                @change="handleAvatarChange" 
                class="cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
              />
            </div>
            <div class="space-y-2">
              <Label class="text-xs font-bold uppercase text-slate-500">个人总结</Label>
              <Textarea v-model="resumeStore.personalInfo.summary" class="h-20 resize-none" />
            </div>
          </div>
        </section>

        <!-- 教育背景 -->
        <section class="p-4 border rounded-lg bg-slate-50/50">
          <div class="flex justify-between items-center mb-4">
            <h2 class="font-semibold text-slate-700">教育背景</h2>
            <Button variant="outline" size="sm" @click="resumeStore.addEducation()">+ 添加</Button>
          </div>
          <div class="space-y-6">
            <div v-for="edu in resumeStore.educations" :key="edu.id" class="p-4 border bg-white rounded-md relative group transition-all">
              <Button variant="destructive" size="icon" class="absolute -top-3 -right-3 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10" @click="resumeStore.removeEducation(edu.id)">×</Button>
              <div class="grid gap-4">
                <div class="space-y-2">
                  <Label class="text-xs font-bold uppercase text-slate-500">学校</Label>
                  <Input v-model="edu.school" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label class="text-xs font-bold uppercase text-slate-500">专业</Label>
                    <Input v-model="edu.major" />
                  </div>
                  <div class="space-y-2">
                    <Label class="text-xs font-bold uppercase text-slate-500">学历</Label>
                    <Input v-model="edu.degree" />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label class="text-xs font-bold uppercase text-slate-500">开始时间</Label>
                    <Input v-model="edu.startDate" />
                  </div>
                  <div class="space-y-2">
                    <Label class="text-xs font-bold uppercase text-slate-500">结束时间</Label>
                    <Input v-model="edu.endDate" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 项目经验 -->
        <section class="p-4 border rounded-lg bg-slate-50/50">
          <div class="flex justify-between items-center mb-4">
            <h2 class="font-semibold text-slate-700">项目经验</h2>
            <Button variant="outline" size="sm" @click="resumeStore.addProject()">+ 添加</Button>
          </div>
          <div class="space-y-6">
            <div v-for="proj in resumeStore.projects" :key="proj.id" class="p-4 border bg-white rounded-md relative group transition-all">
              <Button variant="destructive" size="icon" class="absolute -top-3 -right-3 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10" @click="resumeStore.removeProject(proj.id)">×</Button>
              <div class="grid gap-4">
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label class="text-xs font-bold uppercase text-slate-500">项目名称</Label>
                    <Input v-model="proj.name" />
                  </div>
                  <div class="space-y-2">
                    <Label class="text-xs font-bold uppercase text-slate-500">担任角色</Label>
                    <Input v-model="proj.role" />
                  </div>
                </div>
                <div class="space-y-2">
                  <Label class="text-xs font-bold uppercase text-slate-500">项目描述与业绩</Label>
                  <Textarea v-model="proj.description" class="h-24 resize-none" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 工作经历 (保留原有结构) -->
        <section class="p-4 border rounded-lg bg-slate-50/50">
          <div class="flex justify-between items-center mb-4">
            <h2 class="font-semibold text-slate-700">工作经历</h2>
            <Button variant="outline" size="sm" @click="resumeStore.addExperience()">+ 添加</Button>
          </div>
          <div class="space-y-6">
            <div v-for="exp in resumeStore.experiences" :key="exp.id" class="p-4 border bg-white rounded-md relative group transition-all">
              <Button variant="destructive" size="icon" class="absolute -top-3 -right-3 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10" @click="resumeStore.removeExperience(exp.id)">×</Button>
              <div class="grid gap-4">
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label class="text-xs font-bold uppercase text-slate-500">公司</Label>
                    <Input v-model="exp.company" />
                  </div>
                  <div class="space-y-2">
                    <Label class="text-xs font-bold uppercase text-slate-500">职位</Label>
                    <Input v-model="exp.position" />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label class="text-xs font-bold uppercase text-slate-500">开始时间</Label>
                    <Input v-model="exp.startDate" />
                  </div>
                  <div class="space-y-2">
                    <Label class="text-xs font-bold uppercase text-slate-500">结束时间</Label>
                    <Input v-model="exp.endDate" />
                  </div>
                </div>
                <div class="space-y-2">
                  <Label class="text-xs font-bold uppercase text-slate-500">工作描述</Label>
                  <Textarea v-model="exp.description" class="h-24 resize-none" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 专业技能 -->
        <section class="p-4 border rounded-lg bg-slate-50/50">
          <h2 class="font-semibold mb-4 text-slate-700">专业技能</h2>
          <div class="space-y-2">
            <Label class="text-xs font-bold uppercase text-slate-500">技能列表 (用逗号分隔)</Label>
            <Textarea v-model="resumeStore.skills" placeholder="例如：Vue 3, JavaScript, Git..." class="h-20 resize-none" />
          </div>
        </section>

      </div>
    </div>
  </aside>

  <!-- 裁剪弹窗 -->
  <Dialog :open="isCropDialogOpen" @update:open="isCropDialogOpen = $event">
    <!-- 1. 修复弹窗过宽：使用 w-[90vw] 和 max-w-[600px] 严格锁死宽度，绝对不允许被图片撑开 -->
    <DialogContent class="w-[90vw] max-w-[600px] p-6 bg-white">
      <DialogHeader>
        <DialogTitle class="text-lg font-bold text-slate-800">调整头像位置</DialogTitle>
        <!-- 👉 新增下面这行，专门用来消除警告 -->
        <DialogDescription class="hidden">在这里裁剪并调整你的头像比例</DialogDescription>
      </DialogHeader>
      
      <!-- 裁剪器展示区 -->
      <div class="relative w-full h-[400px] bg-slate-100 rounded-md overflow-hidden shadow-inner mt-2">
        <VueCropper
          ref="cropperRef"
          :img="currentUploadImage"
          :autoCrop="true"
          :autoCropWidth="250"
          :autoCropHeight="350"
          :fixedBox="false"
          :fixed="true"
          :fixedNumber="[5, 7]"
          :centerBox="true"
          :infoTrue="true"
          outputType="png"
          class="w-full h-full"
        />
      </div>

      <!-- 提示语 -->
      <div class="mt-2 text-center text-sm text-slate-500">
        提示：鼠标滚轮缩放，左键按住拖动
      </div>

      <!-- 2. 修复按钮错位：弃用 DialogFooter，直接用原生的 div + flex 强制它们在一行并靠右对齐 -->
      <div class="flex flex-row justify-end items-center gap-3 w-full mt-4">
        <Button variant="outline" @click="isCropDialogOpen = false" class="w-auto">取消</Button>
        <Button @click="confirmCrop" class="w-auto bg-blue-500 text-white hover:bg-blue-600">完成裁剪</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

