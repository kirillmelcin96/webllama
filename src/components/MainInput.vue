<script lang="ts" setup>
import { ref, nextTick, onMounted, useTemplateRef } from 'vue'
import IconArrowUp from '../icons/ArrowUp.vue'
import { useChatStore } from '../stores/chatStore'

const store = useChatStore()
const request = ref('')
const ta = useTemplateRef<HTMLTextAreaElement>('ta')

const resize = async () => {
  await nextTick()

  if (ta.value !== null) {
    ta.value.style.height = 'auto'
    ta.value.style.height = ta.value.scrollHeight + 'px'
  }
}

function clearInputAndSend() {
    if (store.isLoading) return
    store.sendMessage(request.value)
    request.value = ''
    resize()
}

onMounted(resize)
</script>

<template>
    <div class="main-input-group">
        <textarea
            ref="ta"
            v-model="request"
            class="textarea"
            rows="1"
            @input="resize"
            @keyup.enter="clearInputAndSend"
            placeholder="Type something..."
        ></textarea>
        <div 
            class="main-input-group__button"
            @click="clearInputAndSend"
        >
            <IconArrowUp />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.main-input-group {
    position: fixed;
    bottom: 24px;
    width: 100%;
    max-width: 776px;
    z-index: 1000;
    border-radius: 22px;
    border: 1px solid #454545;
    padding: 8px 16px;
    background-color: #373737;
    box-shadow: 0 -1px 24px -8px rgba(0,0,0,0.7);

    textarea {
        resize: none;
        width: calc(100% - 28px);
        max-height: 350px;
        outline: none;
        border: none;
        background-color: transparent;
        font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;

        &::placeholder {
            color: #8d8d8d;
        }
    }

    &__button {
        position: absolute;
        bottom: 7px;
        right: 6px;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        padding: 6px 8px;
        color: white;
        background-color: #4578de;
        cursor: pointer;
        transition: 0.25s;

        &:hover {
            opacity: .8;
        }

        svg {
            width: 16px;
            height: 16px;
        }
    }
}

@media screen and (min-width: 769px) and (max-width: 1060px) {
    .main-input-group {
        left: 272px;
        width: calc(100% - 284px);
    }
}

@media screen and (max-width: 768px) {
    .main-input-group {
        left: 12px;
        width: calc(100% - 24px);
    }
}
</style>