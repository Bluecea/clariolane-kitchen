export interface TagService {
  fetchTags(): Promise<string[]>
}

export const mockTagService: TagService = {
  fetchTags: async (): Promise<string[]> => {
    // Simulating network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(['fiction', 'news', 'science', 'history', 'biography'])
      }, 500)
    })
  },
}
