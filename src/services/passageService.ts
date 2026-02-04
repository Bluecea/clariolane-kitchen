import { supabase } from '../lib/supabase'
import type { Passage } from '../domain/schemas'

export const passageService = {
  fetchPassages: async (page: number, limit: number) => {
    const { data, error } = await supabase.functions.invoke(
      `passages?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    console.log(error)

    if (error) throw error
    return data as {
      data: Passage[]
      meta: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }
  },

  getPassage: async (id: string) => {
    const { data, error } = await supabase.functions.invoke(
      `passages?id=${id}`,
      {
        method: 'GET',
      },
    )
    if (error) throw error
    return data as Passage
  },

  createPassage: async (passage: Passage) => {
    const { data, error } = await supabase.functions.invoke('passages', {
      method: 'POST',
      body: passage,
    })
    if (error) throw error
    return data
  },

  updatePassage: async (id: string, passage: Passage) => {
    const { data, error } = await supabase.functions.invoke('passages', {
      method: 'PUT',
      body: { ...passage, id },
    })
    if (error) throw error
    return data
  },

  deletePassage: async (id: string) => {
    const { data, error } = await supabase.functions.invoke('passages', {
      method: 'DELETE',
      body: { id },
    })
    if (error) throw error
    return data
  },
}
