<script setup lang="ts">
type PlayerProps = {
    name: string;
    level: number;
    job: string;
    isOnline: boolean;
};
const props = defineProps<PlayerProps>();
</script>

<template>
    <div
        class="w-96 -skew-x-6 transform rounded-xl border border-blue-500 bg-slate-800 p-8 shadow-2xl"
    >
        <h1
            class="mb-6 text-3xl font-bold italic tracking-widest text-blue-400"
        >
            STATUS
        </h1>
        <div class="space-y-4">
            <div class="flex justify-between border-b border-slate-600 pb-2">
                <span class="text-slate-400">NAME</span>
                <span class="text-xl font-bold">{{ props.name }}</span>
            </div>
            <div class="flex justify-between border-b border-slate-600 pb-2">
                <span class="text-slate-400">JOB</span>
                <span class="text-lg text-yellow-400">{{ props.job }}</span>
            </div>
            <div
                class="flex items-center justify-between border-b border-slate-600 pb-2"
            >
                <span class="text-slate-400">LEVEL</span>
                <span class="text-4xl font-black text-blue-300">{{
                    props.level
                }}</span>
            </div>
        </div>
    </div>
</template>
