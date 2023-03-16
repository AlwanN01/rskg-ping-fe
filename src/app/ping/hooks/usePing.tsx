import { createStore } from '@/lib/zustand'
import { useEffect, useMemo } from 'react'
import socket from '../socket'

const _usePing = createStore({ hosts: [] as Host[], statusHost: {} as IStatusHost }, null, { nameStore: 'PING STORE' })
const { setState, getState } = _usePing
export const usePing = (_hosts: Host[]) => {
  useMemo(() => void setState({ hosts: _hosts }, false, { type: 'Init Host Data' }), [_hosts])
  const { hosts, statusHost } = _usePing()
  useEffect(() => {
    socket.connect()
    for (const ip of _hosts) {
      socket.on(ip.hostName, (statusHost: Status) => {
        let type = `Push ${ip.hostName} to statusHosts`
        if (getState().statusHost[ip.hostName]) type = `Update status ${ip.hostName} to ${statusHost.status} at ${statusHost.updatedAt}`
        setState(
          state => {
            for (const host of state.hosts) {
              if (host.hostName === ip.hostName) {
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
interface Host extends Partial<Status> {
  id: number
  hostName: string
  user: string
  divisi: string
}
