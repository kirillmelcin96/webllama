<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { greetings } from '../greetings'
import ModelsSelector from './ModelsSelector.vue';

const randomGreeting = ref('')

onMounted(() => {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    randomGreeting.value = greetings[randomIndex]!
})
</script>

<template>
    <div class="greeting-block">
        <h1>{{ randomGreeting }}</h1>
        <ModelsSelector />
    </div>
</template>

<style lang="scss" scoped>
.greeting-block {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
        text-align: center;
    }
}
</style>