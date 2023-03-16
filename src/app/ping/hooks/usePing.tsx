import { createStore } from '@/lib/zustand'
import { useEffect, useMemo } from 'react'
import socket from '../socket'
import type { DataHost } from '../page'

type Status = { status: string; updatedAt: Date }
export interface Host extends DataHost, Partial<Status> {}

const initState = { hosts: [] as Host[], activePage: 1, limit: 10 }
const _usePing = createStore(initState, null, { nameStore: 'PING STORE' })
const { setState, getState } = _usePing

export const usePing = (_hosts: Host[]) => {
  useMemo(() => void setState(state => void (state.hosts.length == 0 && (state.hosts = _hosts)), false, { type: 'Init Host Data' }), [_hosts])
  const { hosts } = _usePing()
  const { activePage, limit } = getState()
  const getPageData = () => {
    const start = (activePage - 1) * limit
    const end = start + limit
    return hosts.slice(start, end)
  }
  const totalPage = useMemo(() => Math.ceil(hosts.length / limit), [hosts.length, limit])
  const setActivePage = (page: number) => setState({ activePage: page })
  const setLimit = (val: number) => setState({ limit: val > 0 ? val : 1, activePage: 1 })
  useEffect(() => {
    socket.connect()
    for (const { hostName } of _hosts) {
      socket.on(hostName, (statusHost: Status) => {
        const type = `Update status ${hostName} to ${statusHost.status} at ${statusHost.updatedAt}`
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
  return { hosts: getPageData(), activePage, setActivePage, limit, setLimit, totalPage }
}
