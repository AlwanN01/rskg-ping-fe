import { createStore, type SetState } from '@/lib/zustand'
import { useEffect, useMemo } from 'react'
import socket from '../socket'
import orderBy from 'lodash/orderBy'
import type { DataHost } from '../page'

type Status = { status: string; updatedAt: Date }
// type OrderBy<T> = { [P in keyof T]?: boolean | undefined }
export interface Host extends DataHost, Partial<Status> {}
type OrderBy = keyof Host
const initState = { hosts: [] as Host[], activePage: 1, limit: 10, orderBy: 'status' as OrderBy }
type State = typeof initState
const handlers = (set: SetState<State>, get: () => State) => ({
  setActivePage: (page: number) => set({ activePage: page }, false, { type: `setActivePage to ${page}` }),
  setLimit: (limit: number) => set({ limit, activePage: 1 }, false, { type: `setLimit to ${limit}` }),
  setOrderBy: (orderBy: OrderBy) => set({ orderBy }),
  getPageData: () => {
    const sorteredHosts = orderBy(get().hosts, [get().orderBy, 'updatedAt'] as OrderBy[], ['asc', 'desc'])
    const start = (get().activePage - 1) * get().limit
    const end = start + get().limit
    return sorteredHosts.slice(start, end)
  }
})

const usePing_ = createStore(initState, handlers, { nameStore: 'PING STORE' })

const { setState, getState } = usePing_
export const usePing = (_hosts: Host[]) => {
  setState(state => void (!(getState().hosts.length === _hosts.length) && (state.hosts = _hosts)), false, { type: 'Init Host Data' })

  // const {hosts, activePage, limit, getPageData, setActivePage, setLimit } = getState() tidak rerender ketika update
  const { hosts, activePage, limit, getPageData, setActivePage, setLimit } = usePing_()
  const totalPage = Math.ceil(hosts.length / limit)

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
  return { hosts: getPageData(), activePage, setActivePage, setLimit, totalPage, orderBy }
}
