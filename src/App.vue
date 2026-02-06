<script lang="ts" setup>
import ChatsBar from './components/ChatsBar.vue';
import MainInput from './components/MainInput.vue';
import MessageList from './components/MessageList.vue';

</script>

<template>
  <div class="main-layout">
    <ChatsBar />
    <div class="chat-layout">
      <div class="chat-list-container">
        <MessageList />
        <MainInput />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.chat-layout {
  width: 100%;
  height: calc(100dvh - 8px);
  margin-top: 4px;
  margin-right: 4px;
  display: flex;
  justify-content: center;
  max-height: 100dvh;
  overflow-y: auto;
  background-color: #242424;
  border-radius: 24px 0 0 24px;
}

@media screen and (max-width: 768px) {
  .chat-layout {
    width: 100%;
    height: 100dvh;
    margin: 0;
    border-radius: 0;
  }
}

.chat-list-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 24px 12px 24px 12px;
}
</style>