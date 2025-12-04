<script setup lang="ts">
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

// 4. お気に入り機能の呼び出し (追加部分)
const { isFavorite } = usePokemonFavorites();

// 5. URLからIDを取り出す便利関数 (これが抜けているとエラーになります！)
const getPokemonId = (url: string) => {
    const parts = url.split('/');
    return Number(parts[parts.length - 2]);
};

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
            <NuxtLink
                v-for="pokemon in filteredPokemons"
                :key="pokemon.url"
                :to="`/pokemon/${getPokemonId(pokemon.url)}`"
                class="group relative overflow-hidden rounded-2xl bg-slate-800 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/20"
            >
                <ClientOnly>
                    <div
                        v-if="isFavorite(getPokemonId(pokemon.url))"
                        class="absolute right-3 top-3 z-20 text-2xl drop-shadow-md"
                    >
                        ❤️
                    </div>
                </ClientOnly>

                <span
                    class="absolute -right-4 -top-4 text-8xl font-black text-slate-700/30 transition-colors group-hover:text-slate-600/30"
                >
                    #{{ getPokemonId(pokemon.url) }}
                </span>

                <div class="relative z-10 flex justify-center">
                    <img
                        :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getPokemonId(
                            pokemon.url
                        )}.png`"
                        :alt="pokemon.name"
                        class="h-40 w-40 drop-shadow-xl transition-transform duration-300 group-hover:scale-110"
                    />
                </div>

                <div class="relative z-10 mt-4 text-center">
                    <h2 class="text-xl font-bold capitalize text-slate-100">
                        {{ pokemon.name }}
                    </h2>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>
