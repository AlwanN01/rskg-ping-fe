import { createStore, type SetState } from '@/lib/zustand'
import { useEffect, useMemo } from 'react'
import socket from '../socket'
import type { DataHost } from '../page'

type Status = { status: string; updatedAt: Date }
type OrderBy<T> = { [P in keyof T]?: boolean | undefined }
export interface Host extends DataHost, Partial<Status> {}

const initState = { hosts: [] as Host[], activePage: 1, limit: 10, orderBy: {} as OrderBy<Host> }
type State = typeof initState

const handlers = (set: SetState<State>, get: () => State) => ({
  setActivePage: (page: number) => set({ activePage: page }, false, { type: `setActivePage to ${page}` }),
  setLimit: (limit: number) => set({ limit, activePage: 1 }, false, { type: `setLimit to ${limit}` }),
  getPageData: () => {
    const start = (get().activePage - 1) * get().limit
    const end = start + get().limit
    return get().hosts.slice(start, end)
  }
})

const _usePing = createStore(initState, handlers, { nameStore: 'PING STORE' })

const { setState, getState } = _usePing
export const usePing = (_hosts: Host[]) => {
  useMemo(() => void setState(state => void (state.hosts.length == 0 && (state.hosts = _hosts)), false, { type: 'Init Host Data' }), [_hosts])
  const { hosts } = _usePing()
  const { activePage, limit, getPageData, setActivePage, setLimit } = getState()
  const totalPage = useMemo(() => Math.ceil(hosts.length / limit), [hosts.length, limit])

  useEffect(() => {
    socket.connect()
    for (const { hostName } of _hosts) {
      socket.on(hostName, (statusHost: Status) => {
        const type = `Update status ${hostName} to ${statusHost.status.toUpperCase()} at ${new Date(statusHost.updatedAt).toLocaleString()}`
        setState(
          state => {
            for (const host of state.hosts) {
              if (host.hostName === hostName) {
                host.status = statusHost.status
                host.updatedAt = statusHost.updatedAt
                break
              }
            }
          },
          false,
          { type }
        )
      })
    }
    return () => void socket.disconnect()
  }, [_hosts])
  return { hosts: getPageData(), activePage, setActivePage, setLimit, totalPage }
}
