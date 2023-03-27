'use client'
import { create, type StoreApi, type UseBoundStore } from 'zustand'
import { combine, devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { Immutable, produce } from 'immer'
import type { Draft } from 'immer'
export type SetState<State> = (
  nextStateOrUpdater: State | Partial<State> | ((state: Draft<State>) => void),
  shouldReplace?: boolean | undefined,
  action?: string | { type: unknown } | undefined
) => void
export type HandlerStore<State, Method> = (set: SetState<State>, get: () => State) => Method
export type ReducerStore<State, Action> = (state: State, action: Action, set: SetState<State>, get: () => State) => Promise<void> | void
type Options = {
  nameStore?: string
  isLogging?: boolean
}
export function createStore<
  State extends object,
  Method extends TypeSetState<State> | object,
  Action extends { type: String | keyof TypeSetState<State>; [key: string]: any }
>(
  initState: State,
  handler?: HandlerStore<State, Method> | null,
  reducerOrOptions: ReducerStore<State, Action> | Options = {},
  options: Options = {}
) {
  handler = handler || (() => ({} as Method))
  const { nameStore = 'My Store', isLogging = false } = (isOptions(reducerOrOptions) && reducerOrOptions) || options
  const immerReducer = (reducerOrOptions && !isOptions(reducerOrOptions) && produce(reducerOrOptions)) || (async () => ({}))
  return createSelectors(
    create(
      devtools(
        immer(
          combine(initState, (set, get) => ({
            dispatch: async (action: Action) => {
              isLogging && console.log('old State', get())
              set(reducerOrOptions ? await immerReducer!(get() as unknown as Immutable<State>, action, set, get) : state => state, false, action)
              isLogging && console.log('new State', get())
            },
            set,
            ...setStateStore(initState, set),
            ...handler!(set, get)
          }))
        ),
        { name: nameStore, enabled: process.env.NODE_ENV == 'production' ? false : undefined }
      )
    )
  )
}
function isOptions(variable: any): variable is Options {
  return Object.prototype.toString.call(variable) === '[object Object]'
}
type WithSelectors<S> = S extends { getState: () => infer T } ? S & { [K in keyof T]: () => T[K] } : never
export function createSelectors<S extends UseBoundStore<StoreApi<object>>>(_store: S) {
  let store = _store as WithSelectors<typeof _store>
  for (let k of Object.keys(store.getState())) {
    ;(store as any)[k] = () => store(s => s[k as keyof typeof s])
  }

  return store
}

export type TypeSetState<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void
}

const setStateStore = <T extends object>(initstate: T, set: SetState<T>) => {
  let defaultSetState = {} as Record<string, (value: any) => void>
  for (const key in initstate) {
    if (Object.prototype.hasOwnProperty.call(initstate, key)) {
      const keyName = key.charAt(0).toUpperCase() + key.slice(1)
      // @ts-ignore
      defaultSetState[`set${keyName}`] = (value: any) => set({ [key]: value }, false, { type: `set${keyName} to ${value}` })
    }
  }
  return defaultSetState as TypeSetState<T>
}
