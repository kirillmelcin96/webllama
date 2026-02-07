<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useChatStore } from '../stores/chatStore'
import CloseIcon from '../icons/Close.vue'
import EditLine from '../icons/EditLine.vue'

const store = useChatStore()
const chatInstanceUrl = ref('')

onMounted(() => {
    chatInstanceUrl.value = store.url
    store.updateChatsList()
})

function changeChatInstanceUrl() {
    store.changeChatUrl(chatInstanceUrl.value)
}

function newChat() {
    store.newChat()
}

function selectChat(id: number) {
    if (id === store.chatId) return
    store.selectChat(id)
}

function deleteChat(id: number) {
    store.deleteChat(id)
}
</script>

<template>
    <div class="chats-bar">
        <div>
        <h3 class="title">webllama</h3>
        <div 
            class="chats-bar-button"
            @click="newChat"
        >
            <EditLine class="chats-bar-button__icon" />New chat
        </div>
        <p class="subtitle">Your chats</p>
        <div
            v-for="chat in store.chatsList"
            @click="selectChat(chat.id)"
            class="chats-bar-button"
            :class="{ 'chats-bar-button__active': store.chatId == chat.id }"
        >
            <span class="chats-bar-button__text">{{ chat.title }}</span>
            <div 
                @click="deleteChat(chat.id)"
                class="chats-bar-button__close"
            >
                <CloseIcon />
            </div>
        </div>
        </div>
        <input
            v-model="chatInstanceUrl"
            class="chat-instance-input" 
            type="text" 
            autocomplete="off" 
            @focusout="changeChatInstanceUrl"
        />
    </div>
</template>

<style lang="scss" scoped>
.chats-bar {
    padding: 16px 12px;
    position: relative;
}

@media screen and (max-width: 768px) {
    .chats-bar {
        display: none;
    }
}

.title {
    text-align: center;
}

.subtitle {
    opacity: .6;
    font-size: 13px;
    font-weight: 500;
    padding: 0;
    margin: 12px 0 4px 8px;
}

.chats-bar-button {
    width: 100%;
    display: flex;
    gap: 4px;
    padding: 6px 8px;
    margin-bottom: 4px;
    border-radius: 12px;
    font-size: 15px;
    // font-weight: 500;
    background-color: #1a1a1a;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    user-select: none;
    cursor: pointer;

    &__text {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        min-width: 0;
        width: 100%;
    }

    &__icon {
        width: 18px;
        height: 18px;
        margin-top: 2px;
    }

    &__close {
        opacity: 0;
        display: flex;
        flex-grow: 1;
        align-items: center;
        justify-content: center;
        width: 0px;
        height: 22px;
        border-radius: 6px;
        transition: .15s;
        cursor: pointer;

        &:hover {
            background-color: #ffffff10;
        }

        svg {
            width: 12px;
            height: 12px;
        }
    }

    &:hover {
        background-color: #2f2f2f;

        .chats-bar-button__close {
            width: 25px;
            opacity: 1;
        }
    }

    &__active {
        cursor: default;
        background-color: #2f2f2f;
    }
}

.chat-instance-input {
    width: 234px;
    position: fixed;
    bottom: 16px;
    border: 1px solid #454545;
    background-color: transparent;
    font-size: 15px;
    padding: 8px 8px;
    border-radius: 12px;
    margin-bottom: 4px;
    opacity: .6;
    transition: opacity 0.25s ease;

    &:hover,
    &:focus {
        outline: none;
        opacity: 1;
    }
}

.divide {
    color: #454545;
    opacity: .6;
    margin: 0 0 12px 0;
}
</style>