import { supabase } from '@/integrations/supabase/client'

export interface DiaryEntry {
  id: string
  date: Date
  content: string
  mood?: number | null
  bookId?: string
  user_id?: string
  created_at?: string
  updated_at?: string
}

export class DiaryService {
  // Local storage methods
  static saveLocalEntry(entry: DiaryEntry) {
    const entries = this.getLocalEntries()
    const existingIndex = entries.findIndex(e => e.id === entry.id)
    
    if (existingIndex >= 0) {
      entries[existingIndex] = { ...entry, updated_at: new Date().toISOString() }
    } else {
      entries.unshift({ ...entry, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    }
    
    localStorage.setItem('diaryEntries', JSON.stringify(entries))
    return entries[existingIndex >= 0 ? existingIndex : 0]
  }

  static getLocalEntries(): DiaryEntry[] {
    const savedEntries = localStorage.getItem('diaryEntries')
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries)
        return parsedEntries.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        }))
      } catch (e) {
        console.error('Failed to parse saved entries', e)
        return []
      }
    }
    return []
  }

  static deleteLocalEntry(id: string) {
    const entries = this.getLocalEntries()
    const filteredEntries = entries.filter(entry => entry.id !== id)
    localStorage.setItem('diaryEntries', JSON.stringify(filteredEntries))
    return filteredEntries
  }

  // Cloud storage methods (only available if Supabase is configured)
  static async saveCloudEntry(entry: DiaryEntry) {
    if (!supabase) {
      throw new Error('Supabase is not configured')
    }
    
    const { data, error } = await supabase
      .from('diary_entries')
      .upsert({
        id: entry.id,
        date: entry.date,
        content: entry.content,
        mood: entry.mood,
        book_id: entry.bookId,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getCloudEntries() {
    if (!supabase) {
      throw new Error('Supabase is not configured')
    }
    
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .order('date', { ascending: false })

    if (error) throw error
    return data.map((entry: any) => ({
      ...entry,
      date: new Date(entry.date)
    }))
  }

  static async deleteCloudEntry(id: string) {
    if (!supabase) {
      throw new Error('Supabase is not configured')
    }
    
    const { error } = await supabase
      .from('diary_entries')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }

  // Sync methods
  static async syncLocalToCloud() {
    if (!supabase) {
      throw new Error('Supabase is not configured')
    }
    
    const localEntries = this.getLocalEntries()
    if (localEntries.length === 0) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      // Add user_id to all entries and save to cloud
      const entriesWithUser = localEntries.map(entry => ({
        ...entry,
        user_id: user.id
      }))

      const { error } = await supabase
        .from('diary_entries')
        .upsert(entriesWithUser)

      if (error) throw error

      // Clear local storage after successful sync
      localStorage.removeItem('diaryEntries')
      return true
    } catch (error) {
      console.error('Sync failed:', error)
      return false
    }
  }
}