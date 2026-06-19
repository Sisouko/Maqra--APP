import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INITIAL_BOOKS = [
  {
    id: '1',
    title: 'البؤساء',
    author: 'Victor Hugo',
    pages: 712,
    currentPage: 476,
    language: 'AR',
    rating: 4.5,
    status: 'en cours',
    startedAt: '2024-03-01T10:00:00Z',
    completedAt: null,
  },
  {
    id: '2',
    title: 'Le Pain Nu',
    author: 'Mohamed Choukri',
    pages: 160,
    currentPage: 160,
    language: 'FR',
    rating: 5,
    status: 'terminé',
    startedAt: '2024-03-05T09:00:00Z',
    completedAt: '2024-03-10T18:00:00Z',
  },
  {
    id: '3',
    title: 'La Boîte à Merveilles',
    author: 'Ahmed Sefrioui',
    pages: 250,
    currentPage: 250,
    language: 'FR',
    rating: 4,
    status: 'terminé',
    startedAt: '2024-03-01T14:00:00Z',
    completedAt: '2024-03-05T16:00:00Z',
  },
  {
    id: '4',
    title: 'ثلاثية غرناطة',
    author: 'Radwa Ashour',
    pages: 508,
    currentPage: 0,
    language: 'AR',
    rating: 5,
    status: 'à lire',
    startedAt: null,
    completedAt: null,
  },
  {
    id: '5',
    title: 'موسم الهجرة إلى الشمال',
    author: 'Tayeb Salih',
    pages: 170,
    currentPage: 170,
    language: 'AR',
    rating: 4.8,
    status: 'terminé',
    startedAt: '2024-02-10T08:00:00Z',
    completedAt: '2024-02-15T19:30:00Z',
  },
  {
    id: '6',
    title: 'Le Passé Simple',
    author: 'Driss Chraïbi',
    pages: 160,
    currentPage: 0,
    language: 'FR',
    rating: 4,
    status: 'à lire',
    startedAt: null,
    completedAt: null,
  }
];

export const useBookStore = create(
  persist(
    (set) => ({
      books: INITIAL_BOOKS,
      annualGoal: 24,
      streak: 12,
      totalReadingTime: 2850, // in minutes (47h 30m)
      memberSince: 'Mars 2024',
      selectedBookId: '1',
      profilePicture: null,
      readingSessions: [],

      setSelectedBookId: (id) => set({ selectedBookId: id }),
      setProfilePicture: (uri) => set({ profilePicture: uri }),
      updateBookCover: (id, uri) => set((state) => ({
        books: state.books.map(b => b.id === id ? { ...b, coverPhoto: uri } : b),
      })),
      addReadingSession: (session) => set((state) => {
        const newSession = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toISOString(),
          ...session,
        };
        const minutes = Math.ceil(session.durationSeconds / 60);
        return {
          readingSessions: [...state.readingSessions, newSession],
          totalReadingTime: state.totalReadingTime + minutes,
        };
      }),

      addBook: (book) => set((state) => {
        const newBook = {
          id: Math.random().toString(36).substring(2, 9),
          currentPage: 0,
          startedAt: book.status === 'en cours' ? new Date().toISOString() : null,
          completedAt: book.status === 'terminé' ? new Date().toISOString() : null,
          ...book,
        };
        return { books: [...state.books, newBook] };
      }),

      updateBookProgress: (id, currentPage, status) => set((state) => {
        const updatedBooks = state.books.map((book) => {
          if (book.id === id) {
            const pagesNum = Number(book.pages) || 0;
            const currentPagesNum = Math.min(Math.max(0, Number(currentPage)), pagesNum);
            
            let newStatus = status || book.status;
            let completedAt = book.completedAt;
            let startedAt = book.startedAt;

            // Auto-update status based on page number
            if (currentPagesNum === pagesNum && pagesNum > 0) {
              newStatus = 'terminé';
            } else if (currentPagesNum > 0 && newStatus === 'à lire') {
              newStatus = 'en cours';
            }

            if (newStatus === 'en cours' && !startedAt) {
              startedAt = new Date().toISOString();
            }
            if (newStatus === 'terminé') {
              if (!completedAt) completedAt = new Date().toISOString();
            } else {
              completedAt = null;
            }

            return {
              ...book,
              currentPage: currentPagesNum,
              status: newStatus,
              startedAt,
              completedAt,
            };
          }
          return book;
        });
        return { books: updatedBooks };
      }),

      deleteBook: (id) => set((state) => ({
        books: state.books.filter((book) => book.id !== id),
      })),

      updateAnnualGoal: (goal) => set({ annualGoal: Number(goal) }),
      updateStreak: (streak) => set({ streak: Number(streak) }),
      addReadingTime: (minutes) => set((state) => ({ totalReadingTime: state.totalReadingTime + Number(minutes) })),
      clearHistory: () => set({ books: [] }),
      resetToMocks: () => set({ books: INITIAL_BOOKS, annualGoal: 24, streak: 12, totalReadingTime: 2850 })
    }),
    {
      name: 'maqra-book-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
