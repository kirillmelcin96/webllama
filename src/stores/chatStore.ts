import { toRaw } from 'vue'
import { defineStore } from 'pinia'
import type { chatMessage, roles, Chat } from '../types/messages'
import { deleteChatIDB, loadAllChatsIDB, loadOneChatIDB, saveChatIDB, updateChatIDB } from '../database'

// State types
interface State {
    chatsList: Chat[],
    chatId: null | number,
    model: string,
    availableModels: string[],
    url: string,
    messages: chatMessage[],
    streamingMessage: string,
    isLoading: boolean,
    isError: boolean,
}

export const useChatStore = defineStore('chat', {
  state: (): State => ({ 
    chatsList: [],
    chatId: null,
    model: '',
    availableModels: [],
    url: localStorage.getItem('chat/url') || 'http://localhost:11434',
    messages: [] as chatMessage[],
    streamingMessage: '',
    isLoading: false,
    isError: false,
  }),
  getters: {
    // Empty
  },
  actions: {
    changeChatUrl(newUrl: string) {
        localStorage.setItem('chat/url', newUrl)
        this.url = newUrl
    },
    async updateChatsList() {
        this.chatsList = await loadAllChatsIDB()
    },
    async sendMessage(content: string) {
        if (!this.model) return
        this.addUserMessage(content)
        this.isLoading = true

        const isNewChat = this.messages.length == 1

        if (isNewChat) {
            let title = 'Untitled'

            try {
                const res = await fetch(this.url + '/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: this.model,
                        prompt: `Write a one-sentence title for the next user message: "${content}". Response without quotation marks. Max sentence length is 30 symbols. Try to be as concise as possible.`,
                        stream: false,
                    }),
                })

                const generatedTitle = await res.json();

                title = generatedTitle.response
            } catch (e) {
                console.error(e)
            }

            this.chatId = await saveChatIDB(title, toRaw(this.messages), this.model)
            await this.updateChatsList()
        }

        try {
            // Try to get response from apy
            this.isError = false

            const res = await fetch(this.url + '/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.model,
                    messages: this.messages,
                    stream: true,
                }),
            })

            const reader = res.body!.getReader()
            const decoder = new TextDecoder()

            // Parsing stream data
            while (true) {
                const { value, done } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value)
                for (const line of chunk.split('\n')) {
                    if (!line) continue
                    const json = JSON.parse(line)

                    if (json.message?.content) {
                        this.streamingMessage += json.message.content
                    }

                    if (json.done) {
                        this.addAssistantMessage('assistant', this.streamingMessage)
                        this.streamingMessage = ''
                        this.isLoading = false

                        if (this.chatId) {
                            await updateChatIDB(toRaw(this.chatId), toRaw(this.messages))
                            await this.updateChatsList()
                        }
                    }
                }
            }
        } catch (e) {
            console.error(e)
            // Showing error
            this.isLoading = false
            this.isError = true
        }
    },
    addUserMessage(content: string) {
      this.messages.push({ role: "user", content })
    },
    addAssistantMessage(role: roles, content: string) {
      this.messages.push({ role, content })
    },
    async getLocalModels() {
        try {
            const res = await fetch(this.url + '/api/tags', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })

            const modelsList = await res.json();
            this.availableModels = modelsList.models.map((m: any) => m.name)
            // Set default model
            if (this.availableModels.length) {
                this.model = this.availableModels[0]!
            } else {
                this.model = ''
            }
        } catch (e) {
            // No models were found
            this.model = ''
            this.availableModels = []
        }
    },
    newChat() {
        this.chatId = null
        this.messages = []
        this.streamingMessage = ''
        this.isLoading =false
        this.isError = false
    },
    async selectChat(id: number) {
        const chat = await loadOneChatIDB(id)

        if (!chat) return

        this.chatId = chat.id
        this.messages = chat.messages
        this.model = chat.model
    },
    async deleteChat(id: number) {
        await deleteChatIDB(id)
        if (id == this.chatId) {
            this.newChat()
        }
        await this.updateChatsList()
    }
  },
})