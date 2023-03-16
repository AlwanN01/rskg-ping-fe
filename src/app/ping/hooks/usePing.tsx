import { createStore } from '@/lib/zustand'
import { useEffect, useMemo } from 'react'
import socket from '../socket'
import type { DataHost } from '../page'

type Status = { status: string; updatedAt: Date }
export interface Host extends DataHost, Partial<Status> {}

const initState = { hosts: [] as Host[] }
const _usePing = createStore(initState, null, { nameStore: 'PING STORE' })
const { setState, getState } = _usePing

export const usePing = (_hosts: Host[]) => {
  useMemo(() => void setState(state => void (state.hosts.length == 0 && (state.hosts = _hosts)), false, { type: 'Init Host Data' }), [_hosts])
  const { hosts } = _usePing()
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
  return { hosts }
}
