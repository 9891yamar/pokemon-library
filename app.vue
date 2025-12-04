<template>
    <div
        class="flex min-h-screen flex-col items-center justify-center bg-slate-900 font-sans text-white"
    >
        <NuxtPage />
    </div>
</template>

<style>
html {
    scrollbar-gutter: stable;
}
/* 🟢 ページ遷移アニメーションの定義 */

/* 入る時 & 出る時 のアニメーション時間とイージング */
.page-enter-active,
.page-leave-active {
    transition: all 0.4s ease-out;
}
/* 入る前の状態 (透明 & 少し下から) */
.page-enter-from {
    opacity: 0;
    transform: translateY(20px); /* 👈 フワッと浮き上がる演出 */
    filter: blur(10px); /* 👈 ちょっとボカすとリッチ感アップ */
}
/* 出て行く時の状態 (透明 & 少し上へ) */
.page-leave-to {
    opacity: 0;
    transform: translateY(-20px);
    filter: blur(10px);
}
</style>
