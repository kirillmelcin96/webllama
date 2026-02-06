export type roles = 'user' | 'system' | 'assistant'

export type chatMessage = {
    role: roles,
    content: string,
}

export interface Chat {
  id: number;
  title: string,
  messages: chatMessage[],
  model: string,
  createdAt: number,
}