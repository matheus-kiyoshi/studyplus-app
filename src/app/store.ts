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

export type Activities = {
  createdAt: string
  id: string
  questionsCorrect: number | null
  questionsDone: number | null
  scheduledReviewDate: Date | null
  startDate: Date
  studyTime: number | null
  subjectId: string
  Subject?: Subject | null
  topicId: string
  Topic?: Topic | null
  userId: string
}

export type Review = {
  id: string
  userId: string
  activityId: string
  createdAt: Date
  lastReviewedAt: Date
  nextReviewAt: Date
  status: string
  timesReviewed: number
}

export type StudyPlans = {
  createdAt: Date
  endDate: Date
  goal: string
  hoursGoal: number
  hoursSpent: number
  id: string
  name: string
  startDate: Date
  status: string
  userId: string
}

export type User = {
  Activities: Activities[]
  Reviews: Review[]
  StudyPlans: StudyPlans[]
  Subjects: Subject[]
  dailyTime: number | null
  goal: null
  googleAccountLinked: boolean
  googleEmail: string | null
  id: string
  name: string
  totalHours: number
}

interface AppState {
  value: number
  selectedSubject: Subject | null
  subjects: Subject[]
  user: User | null
  isFetched: boolean
  isUserFetched: boolean
  setValue: (value: number) => void
  setSelectedSubject: (subject: Subject) => void
  setSubjects: (subjects: Subject[]) => void
  setUser: (user: User) => void
  fetchSubjects: (token: string) => Promise<void>
  fetchUser: (token: string) => Promise<void>
}

const useAppStore = create<AppState>((set, get) => ({
  value: 0,
  selectedSubject: null,
  subjects: [],
  user: null,
  isFetched: false,
  isUserFetched: false,

  setValue: (value) => set({ value }),

  setSelectedSubject: (subject) => set({ selectedSubject: subject }),

  setSubjects: (subjects) =>
    set({
      subjects: subjects.map((subject) => ({
        ...subject,
        timeSpent: subject.timeSpent ?? 0,
      })),
    }),

  setUser: (user) => set({ user }),

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

  fetchUser: async (token: string) => {
    if (get().isFetched) return

    try {
      const response = await api.get('user/profile/data', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const user = response.data as User
      const subjects = user.Subjects
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
      subjects.forEach(async (subject: Subject) => {
        subject.Topics = await fetchTopics(subject.id)
      })
      user.Activities.forEach(async (activity: Activities) => {
        activity.Subject = subjects.find(
          (subject) => subject.id === activity.subjectId,
        )
        activity.Topic = activity.Subject?.Topics.find(
          (topic) => topic.id === activity.topicId,
        )
      })
      user.Subjects = subjects
      console.log(user)
      set({ user, isUserFetched: true })
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
    }
  },
}))

export default useAppStore
