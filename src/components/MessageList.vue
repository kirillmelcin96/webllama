<script lang="ts" setup>
import { onMounted, nextTick, onUpdated } from 'vue';
import { useChatStore } from '../stores/chatStore';
import MessageBubble from './MessageBubble.vue';
import RandomGreeting from './RandomGreeting.vue';
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css' // любой стиль

const highlight = async () => {
  await nextTick()
  document.querySelectorAll('pre code').forEach(block => {
    hljs.highlightElement(block)
  })
}

onMounted(highlight)
onUpdated(highlight)

const store = useChatStore()
</script>

<template>
    <template v-if="store.messages.length === 0">
        <RandomGreeting />
    </template>
    <template v-else>
        <MessageBubble 
            v-for="msg in store.messages"
            :content="msg.content"
            :role="msg.role"
        />
        <div v-if="store.isLoading && store.streamingMessage == ''" class="muted">
            Loading...
        </div>
        <div v-if="store.isError" class="error-text">
            Error while making the request. Please, try again
        </div>
        <MessageBubble 
            v-if="store.streamingMessage"
            :role="'assistant'"
            :content="store.streamingMessage"
        />
        <div class="scroll-spacer"></div>
    </template>
</template>

<style lang="scss" scoped>
.error-text {
    color: #f57474;
}

.scroll-spacer {
  height: 48px;
  flex-shrink: 0;
}
</style>