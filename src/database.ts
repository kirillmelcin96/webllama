import { Dexie, type EntityTable } from 'dexie';
import type { Chat, chatMessage } from './types/messages';

const db = new Dexie('ChatStorage') as Dexie & {
  chats: EntityTable<
    Chat,
    'id' // primary key "id"
  >
}

db.version(1).stores({
  chats: '++id, title, messages, model, createdAt' // primary key "id"
})

async function loadAllChatsIDB() {
    return db.chats.reverse().toArray()
}

async function loadOneChatIDB(id: number) {
    return db.chats.get(id)
}

async function saveChatIDB(title: string, messages: chatMessage[], model: string) {
    const createdAt = Math.floor(Date.now() / 1000)

    const id = await db.chats.add({
        title,
        messages,
        model,
        createdAt,
    })

    return id
}

async function updateChatIDB(id: number, messages: chatMessage[]) {
    // Save new chat history
    await db.chats.update(id, { messages })
}

async function deleteChatIDB(id: number) {
    await db.chats.delete(id)
}

export { 
    loadAllChatsIDB,
    loadOneChatIDB,
    saveChatIDB,
    updateChatIDB,
    deleteChatIDB,
};