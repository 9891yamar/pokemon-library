<script setup lang="ts">
type PokemonDetail = {
    id: number;
    name: string;
    height: number;
    weight: number;
    sprites: {
        front_default: string;
        other: {
            'official-artwork': {
                front_default: string;
            };
        };
    };
    types: {
        type: {
            name: string;
        };
    }[];
    stats: {
        base_stat: number;
        stat: {
            name: string;
        };
    }[];
};

// 1. ルート情報の取得
const route = useRoute();
// route.params.id は string なので、数値に変換したい
const plemonId = computed(() => {
    return Number(route.params.id);
});
// 2. データ取得 (詳細)
// URLに pokemonId を埋め込む
const { data: pokemon, status } = await useFetch<PokemonDetail>(
    `https://pokeapi.co/api/v2/pokemon/${plemonId.value}`,
    {
        lazy: true,
    }
);
// 3. ページタイトルの設定 (SEO)
useHead({
    title: computed(() =>
        pokemon.value
            ? `${pokemon.value.name.toUpperCase()} - ポケモン図鑑`
            : '読み込み中...'
    ),
});

// 💖 「いいね箱」を呼び出す
// 自動インポートされるので import 不要！
const { toggleFavorite, isFavorite } = usePokemonFavorites();
// 現在のポケモンがいいね済みか？ (リアクティブに計算)
// computed にしないと、ボタンを押しても反応しないので注意！
const isLiked = computed(() => {
    if (!pokemon.value) return false;
    return isFavorite(pokemon.value.id);
});
</script>

<template>
    <div
        class="flex min-h-screen items-center justify-center bg-slate-900 p-10 text-white"
    >
        <div v-if="status === 'pending'" class="animate-pulse text-2xl">
            Loading Data...
        </div>
        <div v-else-if="status === 'error'" class="text-center text-red-500">
            <h1 class="mb-4 text-4xl font-bold">404</h1>
            <p>ポケモンが見つかりませんでした。</p>
            <NuxtLink to="/" class="mt-4 block underline">TOPへ戻る</NuxtLink>
        </div>
        <div
            v-else
            class="flex w-full max-w-4xl flex-col gap-10 rounded-3xl border border-slate-700 bg-slate-800 p-10 shadow-2xl md:flex-row"
        >
            <div
                class="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl bg-slate-700/50 p-8"
            >
                <span
                    class="absolute z-0 select-none text-9xl font-black text-white/5"
                >
                    #{{ pokemon?.id }}
                </span>

                <img
                    :src="
                        pokemon?.sprites.other['official-artwork'].front_default
                    "
                    :alt="pokemon?.name"
                    class="z-10 h-64 w-64 object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-110"
                />
            </div>
            <div class="flex-1 space-y-6">
                <div>
                    <div class="mb-2 flex items-center gap-4">
                        <h1 class="text-5xl font-black capitalize">
                            {{ pokemon?.name }}
                        </h1>

                        <button
                            @click="pokemon && toggleFavorite(pokemon.id)"
                            class="rounded-full p-2 transition-all duration-300 hover:scale-110 active:scale-90"
                            :class="
                                isLiked
                                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/50'
                                    : 'bg-slate-700 text-slate-400'
                            "
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                class="h-8 w-8"
                            >
                                <path
                                    d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
                                />
                            </svg>
                        </button>
                    </div>
                    <div class="flex gap-2">
                        <span
                            v-for="t in pokemon?.types"
                            :key="t.type.name"
                            class="rounded-full bg-blue-600 px-4 py-1 text-sm font-bold uppercase tracking-wider"
                        >
                            {{ t.type.name }}
                        </span>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4 text-slate-300">
                    <div class="rounded-xl bg-slate-900/50 p-4">
                        <span class="mb-1 block text-xs text-slate-500"
                            >HEIGHT</span
                        >
                        <span class="text-xl font-bold"
                            >{{ (pokemon?.height ?? 0) / 10 }} m</span
                        >
                    </div>
                    <div class="rounded-xl bg-slate-900/50 p-4">
                        <span class="mb-1 block text-xs text-slate-500"
                            >WEIGHT</span
                        >
                        <span class="text-xl font-bold"
                            >{{ (pokemon?.weight ?? 0) / 10 }} kg</span
                        >
                    </div>
                </div>
                <div class="space-y-3">
                    <div
                        v-for="s in pokemon?.stats"
                        :key="s.stat.name"
                        class="flex items-center gap-4"
                    >
                        <span
                            class="w-20 text-xs font-bold uppercase text-slate-400"
                            >{{ s.stat.name }}</span
                        >
                        <div
                            class="h-2 flex-1 overflow-hidden rounded-full bg-slate-700"
                        >
                            <div
                                class="h-full rounded-full bg-yellow-400"
                                :style="{
                                    width: `${Math.min(s.base_stat, 100)}%`,
                                }"
                            ></div>
                        </div>
                        <span class="w-8 text-right text-sm font-bold">{{
                            s.base_stat
                        }}</span>
                    </div>
                </div>
                <div class="pt-6">
                    <NuxtLink
                        to="/"
                        class="inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
                    >
                        ← BACK TO LIST
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>
