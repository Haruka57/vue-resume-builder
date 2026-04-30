<script setup>
import ResumeEditor from '@/components/ResumeEditor.vue'
import ResumePreview from '@/components/ResumePreview.vue'
</script>

<template>
  <!-- 1. 最外层加上 print:overflow-visible 抵消 overflow-hidden 的魔咒 -->
  <div class="flex flex-row flex-nowrap h-screen w-full bg-slate-50 overflow-hidden text-slate-900 print:block print:h-auto print:bg-white print:overflow-visible">
    
    <div class="print:hidden">
      <ResumeEditor />
    </div>

    <main class="flex-1 min-w-0 h-full overflow-auto bg-slate-200 p-8 print:p-0 print:bg-white print:overflow-visible print:block">
      <!-- 2. 内部包裹层加上 print:min-w-0 彻底解除 min-w-max 的限制 -->
      <div class="w-full h-full flex justify-center items-start min-w-max print:block print:w-auto print:h-auto print:min-w-0">
        <ResumePreview />
      </div>
    </main>

  </div>
</template>

<style>
/* 打印专用底层魔法 */
@media print {
  @page {
    size: A4 portrait;
    margin: 0mm; 
  }
  
  /* 魔法 1：把页面上所有的东西都隐藏掉 */
  body * {
    visibility: hidden;
  }
  
  /* 魔法 2：只让我们的简历预览区（以及它里面的东西）显示出来 */
  #resume-preview, #resume-preview * {
    visibility: visible;
  }
  
  /* 魔法 3：最核心的必杀技！把简历强行按死在 A4 纸的左上角 (0,0) 位置，忽略所有的居中和外边距！ */
  #resume-preview {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    margin: 0 !important;
    transform: none !important;
  }
  
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
