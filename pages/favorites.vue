<script setup lang="ts">
// 型定義（詳細ページと同じものを利用）
type PokemonDetail = {
    id: number;
    name: string;
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
};

// 1. お気に入り（IDのリスト）を取り出す
const { favorites: favoriteIds } = usePokemonFavorites();

// 2. IDリストを元に、並列でポケモンデータを取得する (並列召喚魔法 Promise.all)
// useAsyncData を使って、サーバーサイドでもクライアントでも実行できるようにする
const { data: favoritePokemons, status } = await useAsyncData(
    'favorite-pokemons', // キャッシュキー
    async () => {
        // IDがなければ空配列を返す
        if (favoriteIds.value.length === 0) return [];
        // 2-1. IDひとつひとつを「fetchする約束(Promise)」に変換する
        const fetchPromises = favoriteIds.value.map((id) =>
            $fetch<PokemonDetail>(`https://pokeapi.co/api/v2/pokemon/${id}`)
        );
        // 2-2. Promise.all で一斉に通信開始！全て終わるのを待つ
        const results = await Promise.all(fetchPromises);
        return results;
    },

    {
        // サーバー側では実行しない（ローカルストレージはサーバーに存在しないため）
        server: false,
        // favoriteIds が変化したら再取得するように監視（watch）
        watch: [favoriteIds],
    }
);
useHead({
    title: 'お気に入り - ポケモン図鑑',
});
</script>

<template>
    <div class="min-h-screen bg-slate-900 p-10 text-white">
        <div class="mb-8 flex items-center justify-between">
            <h1 class="text-4xl font-black">My Collection</h1>
            <NuxtLink to="/" class="text-slate-400 hover:text-white">
                ← TOPへ戻る
            </NuxtLink>
        </div>
        <ClientOnly>
            <div
                v-if="status === 'pending'"
                class="text-center text-xl text-slate-500"
            >
                Summoning...
            </div>

            <div
                v-else-if="!favoritePokemons || favoritePokemons.length === 0"
                class="flex flex-col items-center justify-center py-20 text-slate-500"
            >
                <p class="text-2xl font-bold">No Favorites Yet.</p>
                <p class="mt-2">図鑑に戻って ❤️ を押してみよう！</p>
                <NuxtLink
                    to="/"
                    class="mt-6 rounded-full bg-blue-600 px-6 py-2 font-bold text-white transition hover:bg-blue-500"
                >
                    図鑑を見に行く
                </NuxtLink>
            </div>

            <div
                v-else
                class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
                <NuxtLink
                    v-for="pokemon in favoritePokemons"
                    :key="pokemon.id"
                    :to="`/pokemon/${pokemon.id}`"
                    class="group relative overflow-hidden rounded-2xl bg-slate-800 p-6 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/20"
                >
                    <span
                        class="absolute -right-4 -top-4 text-8xl font-black text-slate-700/30 transition-colors group-hover:text-slate-600/30"
                    >
                        #{{ pokemon.id }}
                    </span>

                    <div class="relative z-10 flex justify-center">
                        <img
                            :src="
                                pokemon.sprites.other['official-artwork']
                                    .front_default
                            "
                            :alt="pokemon.name"
                            class="h-40 w-40 drop-shadow-xl transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>

                    <div class="relative z-10 mt-4 text-center">
                        <h2 class="text-xl font-bold capitalize text-slate-100">
                            {{ pokemon.name }}
                        </h2>
                        <div class="mt-2 flex justify-center gap-2">
                            <span
                                v-for="t in pokemon.types"
                                :key="t.type.name"
                                class="rounded-full bg-slate-700 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-300"
                            >
                                {{ t.type.name }}
                            </span>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </ClientOnly>
    </div>
</template>
