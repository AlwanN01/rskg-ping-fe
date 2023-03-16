'use client'
import { wait } from '@/helpers/wait'
import { createStore, ReducerStore, SetState, TypeSetState } from '@/lib/zustand'
import { type ChangeEvent, createElement } from 'react'

const initState = {
  count: 0,
  profile: {
    firstName: 'alwan',
    lastName: 'Nabawi',
    identitas: {
      provinsi: 'Jawa Barat',
      kota: 'Bandung',
      alamat: 'Margahayu'
    }
  },
  element: createElement('button', { onClick: e => console.log(e.currentTarget.innerHTML) }, 'Button Element') as unknown as React.ReactNode,
  data: null as unknown,
  isLoading: false
}
type CountType = typeof initState
type TType = keyof TypeSetState<CountType>
const handler = (set: SetState<CountType>) => ({
  getButtonInnerHtml: (e: React.MouseEvent) => set({ element: e.currentTarget.innerHTML }),
  setKota: (ref: React.RefObject<HTMLInputElement>) => () => set(({ profile }) => ref.current && void (profile.identitas.kota = ref.current.value))
})

type Action = {
  type: TType | 'increase' | 'decrease' | 'setKota' | 'changeElement' | 'getData' | 'getOther'
  by?: number
  kota?: string
  element?: React.ReactNode
  data?: any
}
const reducer: ReducerStore<CountType, Action> = async (state, action, set) => {
  const { type, by = 1 } = action
  const {
    profile: { identitas }
  } = state
  switch (type) {
    case 'getData':
    case 'getOther':
      set({ isLoading: true }) //reRender
  }
  // prettier-ignore
  switch (type) {
    case 'increase': state.count = state.count + by; break 
    case 'decrease': state.count = state.count - by; break
    case 'changeElement': state.element = action.element!; break
    case 'setKota':
      const kota = await wait(action.kota)
      identitas.kota = kota || identitas.kota
      break
    case 'getData':
      await wait(1000)
      state.data = action.data
      break
  }
  state.isLoading = false
}
export const useCount = createStore(initState, handler, reducer)

export const setKota = () => useCount.setState(state => void (state.profile.identitas.kota = 'Garut'))

// export function useMethodCount() {
//   const set = useCount(state => state.set)
//   return {
//     getButtonInnerHtml: (e: React.MouseEvent) => set({ element: e.currentTarget.innerHTML }),
//     setKota: (ref: React.RefObject<HTMLInputElement>) => () =>
//       set(state => {
//         state.profile.identitas.kota = ref.current!.value
//       })
//   }
// }
const initUser = { userName: 'The', password: '' }
export const useUser = createStore(initUser)
const { setState, getState } = useUser
export const setUserName = (key: keyof typeof initUser) => (e: ChangeEvent<HTMLInputElement>) =>
  setState({ [key]: e.target.value, password: '12345' })
