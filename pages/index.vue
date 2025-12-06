<script setup lang="ts">
import { gsap } from 'gsap';

// 型定義
type Pokemon = {
    name: string;
    url: string;
};

type PokemonResponse = {
    results: Pokemon[];
};

// 1. データ取得
const { data, status } = await useFetch<PokemonResponse>(
    'https://pokeapi.co/api/v2/pokemon?limit=151'
);

// 2. 検索機能
const searchText = ref('');

// 3. フィルタリング (computed)
const filteredPokemons = computed(() => {
    if (!data.value) return [];
    if (!searchText.value) return data.value.results;

    return data.value.results.filter((pokemon) =>
        pokemon.name.includes(searchText.value.toLowerCase())
    );
});

// 4. URLからIDを取り出す便利関数
const getPokemonId = (url: string) => {
    const parts = url.split('/');
    return Number(parts[parts.length - 2]);
};

// 5. GSAP: リストの出現アニメーション (シュッシュッと出るやつ)
// ※ホバーアニメーションは PokemonCard.vue 側に任せました
watch(
    filteredPokemons,
    async () => {
        // サーバー側(SSR)での実行を防ぐ
        if (!import.meta.client) return;

        // DOM更新待ち
        await nextTick();

        // .pokemon-card クラスを持つ要素を一斉に操作
        gsap.fromTo(
            '.pokemon-card',
            {
                opacity: 0,
                y: 20,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.05, // 0.05秒ずつずらす
            }
        );
    },
    { immediate: true }
);

useHead({
    title: 'ポケモン図鑑',
});
</script>

<template>
    <div class="min-h-screen bg-slate-900 p-10 text-white">
        <div class="mb-10 flex items-center justify-between">
            <div>
                <h1
                    class="text-4xl font-black tracking-tighter text-yellow-400"
                >
                    Pokemon Library
                </h1>
                <p class="mt-2 text-slate-400">
                    お気に入りのポケモンを探そう！
                </p>
            </div>
            <NuxtLink
                to="/favorites"
                class="flex items-center gap-2 rounded-full bg-pink-600 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-pink-500 hover:shadow-pink-500/20"
            >
                <span>❤️</span>
                <span class="hidden sm:inline">My Collection</span>
            </NuxtLink>
        </div>

        <div class="relative mb-10">
            <input
                v-model="searchText"
                type="text"
                placeholder="ポケモンを探す..."
                class="w-full rounded-full border-2 border-slate-700 bg-slate-800 px-6 py-4 text-lg text-white placeholder-slate-500 shadow-xl transition focus:border-blue-500 focus:outline-none"
            />
            <span
                class="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500"
            >
                🔍
            </span>
        </div>

        <div
            v-if="status === 'pending'"
            class="text-center text-xl text-slate-500"
        >
            Loading...
        </div>

        <div
            v-else
            class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
            <PokemonCard
                v-for="pokemon in filteredPokemons"
                :key="pokemon.url"
                :id="getPokemonId(pokemon.url)"
                :name="pokemon.name"
                :imageUrl="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getPokemonId(
                    pokemon.url
                )}.png`"
            />
        </div>
    </div>
</template>
