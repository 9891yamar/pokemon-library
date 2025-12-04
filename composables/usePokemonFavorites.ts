// composables/usePokemonFavorites.ts

// 1. ステート (データ置き場)
// useState<型>('キー名', 初期値の関数)
// これで、アプリ全体で共有される 'favorites' という名前の箱ができます
export const usePokemonFavorites = () => {
    const favorites = useState<number[]>('favorites', () => []);

    onMounted(() => {
        // 📂 1. 読み込み (Load)
        const saveData = localStorage.getItem('pokemon-favorites');
        if (saveData) {
            favorites.value = JSON.parse(saveData);
        }
        // 💾 2. 監視＆書き込み (Watch & Save)
        // favorites の中身が変わるたびに、自動で LocalStorage に保存する
        watch(
            favorites,
            (newVal) => {
                localStorage.setItem(
                    'pokemon-favorites',
                    JSON.stringify(newVal)
                );
            },
            { deep: true }
        );
    });

    const toggleFavorite = (pokemonId: number) => {
        const targetId = Number(pokemonId);
        if (favorites.value.includes(targetId)) {
            favorites.value = favorites.value.filter((id) => id !== targetId);
        } else {
            favorites.value = [...favorites.value, targetId];
        }
    };
    // 指定したIDがいいね済みかどうかチェック
    const isFavorite = (pokemonId: number) => {
        const targetId = Number(pokemonId);
        return favorites.value.includes(targetId);
    };
    // コンポーネントで使いたいものを return する
    return {
        favorites,
        toggleFavorite,
        isFavorite,
    };
};
