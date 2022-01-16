<template>
    <div>
        <div class="row justify-content-center">
            <div class="col-11 col-sm-10 col-md-8 col-lg-8 p-4">
                <AddPlayers v-if="getStep === 1"></AddPlayers>
                <ShowGames v-if="getStep === 2"></ShowGames>
                <ShowScore v-if="getStep === 3"></ShowScore>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import AddPlayers from "@/components/americano/AddPlayers.vue";
import ShowGames from "@/components/americano/ShowGames.vue";
import ShowScore from "@/components/americano/ShowScore.vue";
import { defineComponent } from "vue";
import store from "@/store/index";

export default defineComponent({
    components: {
        AddPlayers,
        ShowGames,
        ShowScore,
    },
    computed: {
        getStep(): number {
            return store.getters.americanoStore.getStep;
        },
    },
});
</script>

<style></style>
