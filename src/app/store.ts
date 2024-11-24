import { create } from 'zustand'

interface AppState {
  value: number
  selectedSubject: {
    id: string | undefined
    name: string
    description: string
    timeSpent: number
    color: string
  } | null
  subjects: {
    id: string
    name: string
    description: string
    timeSpent: number
    color: string
  }[]
  setValue: (value: number) => void
  setSelectedSubject: (subject: {
    id: string
    name: string
    description: string
    timeSpent: number
    color: string
  }) => void
  setSubjects: (
    subjects: {
      id: string
      name: string
      description: string
      timeSpent: number
      color: string
    }[],
  ) => void
}

const useAppStore = create<AppState>((set) => ({
  value: 0,
  selectedSubject: null,
  subjects: [],
  setValue: (value) => set({ value }),
  setSelectedSubject: (subject) => set({ selectedSubject: subject }),
  setSubjects: (subjects) =>
    set({
      subjects: subjects.map((subject) => ({
        ...subject,
        timeSpent: subject.timeSpent ?? 0,
      })),
    }),
}))

export default useAppStore
