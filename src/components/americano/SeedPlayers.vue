<template>
    <div>
        <h4>Seeding</h4>
        <div
            v-for="(player, index) in players"
            :key="player.id"
            class="seed-item"
            draggable="true"
            @dragstart="onDragStart(index)"
            @dragover.prevent
            @drop="onDrop(index)"
        >
            {{ player.name || 'Player ' + (index + 1) }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store/index';
import { PadelPlayer } from '@/models/padelPlayer.interface';

export default defineComponent({
    data() {
        return {
            dragIndex: null as number | null,
        };
    },
    computed: {
        players(): readonly PadelPlayer[] {
            return store.getters.americanoStore.getPlayers;
        },
    },
    methods: {
        onDragStart(index: number) {
            this.dragIndex = index;
        },
        onDrop(index: number) {
            if (this.dragIndex === null) {
                return;
            }
            const updated = [...this.players];
            const moved = updated.splice(this.dragIndex, 1)[0];
            updated.splice(index, 0, moved);
            updated.forEach((p, i) => (p.seed = i + 1));
            store.commit.americanoStore.UPDATE_PLAYERS(updated);
            this.dragIndex = null;
        },
    },
});
</script>

<style scoped>
.seed-item {
    border: 1px solid #ccc;
    padding: 4px;
    margin-bottom: 4px;
    cursor: grab;
    background-color: #fff;
}
</style>
