import { create } from 'zustand'
import api from '@/utils/api'

export type Topic = {
  id: string
  name: string
  description: string
  timeSpent: number
}

export type Subject = {
  id: string
  name: string
  description: string
  timeSpent: number
  color: string
  Topics: Topic[]
}

interface AppState {
  value: number
  selectedSubject: Subject | null
  subjects: Subject[]
  isFetched: boolean
  setValue: (value: number) => void
  setSelectedSubject: (subject: Subject) => void
  setSubjects: (subjects: Subject[]) => void
  fetchSubjects: (token: string) => Promise<void>
}

const useAppStore = create<AppState>((set, get) => ({
  value: 0,
  selectedSubject: null,
  subjects: [],
  isFetched: false,

  setValue: (value) => set({ value }),

  setSelectedSubject: (subject) => set({ selectedSubject: subject }),

  setSubjects: (subjects) =>
    set({
      subjects: subjects.map((subject) => ({
        ...subject,
        timeSpent: subject.timeSpent ?? 0,
      })),
    }),

  fetchSubjects: async (token: string) => {
    if (get().isFetched) return

    try {
      const response = await api.get('subjects', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const subjects = response.data as Subject[]

      const fetchTopics = async (id: string) => {
        try {
          const topicResponse = await api.get(`subjects/${id}/topics`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          return topicResponse.data as Topic[]
        } catch (error) {
          console.error(error)
          return []
        }
      }

      await Promise.all(
        subjects.map(async (subject) => {
          subject.Topics = await fetchTopics(subject.id)
        }),
      )

      set({ subjects, isFetched: true })
    } catch (error) {
      console.error('Erro ao buscar matérias:', error)
    }
  },
}))

export default useAppStore
