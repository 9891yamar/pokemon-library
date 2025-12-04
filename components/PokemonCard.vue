<script setup lang="ts">
import { gsap } from 'gsap';

type PokemonProps = {
    name: string;
    imageUrl?: string;
    id?: number;
};
defineProps<PokemonProps>();

const onHover = (event: MouseEvent) => {
    const card = event.currentTarget as HTMLElement;
    gsap.to(card, {
        scale: 1.05,
        duration: 0.4,
        ease: 'back.out(2)',
        boxShadow: '0 20px 30px rgba(0,0,0,0.5)',
        zIndex: 10,
        overwrite: true,
    });
};

const onLeave = (event: MouseEvent) => {
    const card = event.currentTarget as HTMLElement;
    gsap.to(card, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
        boxShadow: 'none',
        zIndex: 1,
        overwrite: true,
    });
};
</script>

<template>
    <NuxtLink
        :to="`/pokemon/${id}`"
        class="pokemon-card flex cursor-pointer flex-col items-center rounded-lg border border-slate-700 bg-slate-800 p-6 text-center transition-colors"
        @mouseenter="onHover"
        @mouseleave="onLeave"
    >
        <img
            :src="imageUrl"
            :alt="name"
            class="mb-4 h-32 w-32 object-contain"
        />
        <p class="text-xl font-bold capitalize text-white">{{ name }}</p>
        <span class="text-sm text-slate-400">No. {{ id }}</span>
    </NuxtLink>
</template>
