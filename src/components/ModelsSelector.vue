<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useChatStore } from '../stores/chatStore';
import ChevronDown from '../icons/ChevronDown.vue';

const store = useChatStore()
const isSelectorOpened = ref(false)

onMounted(() => {
    store.getLocalModels()
})

watch(
    () => store.url, 
    () => {
        store.getLocalModels()
    }
)

function changeModel(model: string) {
    isSelectorOpened.value = false
    store.model = model
}

function switchSelector() {
    if (!store.model) return
    isSelectorOpened.value = !isSelectorOpened.value
}
</script>

<template>
    <div class="dropdown">
        <div class="dropdown-button" @click="switchSelector">
            <span v-if="!store.model" class="muted">No models detected</span>
            <span v-else>{{ store.model }}<ChevronDown /></span>
        </div>
        <div class="dropdown-list" v-if="isSelectorOpened">
            <div 
                v-for="model in store.availableModels" 
                class="dropdown-list__item"
                @click="changeModel(model)"
            >
                {{ model }}
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.dropdown {
    position: relative;
}

.dropdown-button {
    padding: 8px 12px;
    color: #3d7eff;
    background-color: #262f40;
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
    font-weight: 500;

    svg {
        margin-bottom: -3px;
        margin-left: 4px;
    }
}

.dropdown-list {
    position: absolute;
    margin-top: 10px;
    padding: 4px 4px;
    border-radius: 8px;
    background-color: #1a1a1a;

    &__item {
        cursor: pointer;
        padding: 8px 10px;
        border-radius: 6px;

        &:hover {
            background-color: #212121;
        }
    }
}
</style>