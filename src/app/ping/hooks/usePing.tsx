import { createStore } from '@/lib/zustand'
import { useEffect, useMemo } from 'react'
import socket from '../socket'

const _usePing = createStore({ hosts: [] as Host[], statusHost: {} as IStatusHost }, null, { nameStore: 'PING STORE' })
const { setState, getState } = _usePing
export const usePing = (_hosts: Host[]) => {
  useMemo(() => void setState(state => void (state.hosts.length == 0 && (state.hosts = _hosts)), false, { type: 'Init Host Data' }), [_hosts])
  const { hosts, statusHost } = _usePing()
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
  return { hosts, statusHost }
}
type Status = { status: string; updatedAt: Date }
type IStatusHost = {
  [key: string]: Status
}
export interface Host extends Partial<Status> {
  id: number
  hostName: string
  user: string
  divisi: string
}
