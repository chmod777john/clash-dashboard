import * as API from '@lib/request'
import { useState, useMemo, useRef } from 'react'

type Connections = API.Connections & { completed?: boolean, speed: { upload: number, download: number } }

class Store {
    protected connections = new Map<string, Connections>()
    protected saveDisconnection = false

    appendToSet (connections: API.Connections[]) {
        const mapping = connections.reduce(
            (map, c) => map.set(c.id, c), new Map<string, API.Connections>()
        )

        for (const id of this.connections.keys()) {
            if (!mapping.has(id)) {
                if (!this.saveDisconnection) {
                    this.connections.delete(id)
                } else {
                    const connection = this.connections.get(id)
                    if (connection) {
                        connection.completed = true
                        connection.speed = { upload: 0, download: 0 }
                    }
                }
            }
        }

        for (const id of mapping.keys()) {
            if (!this.connections.has(id)) {
                this.connections.set(id, { ...mapping.get(id)!, speed: { upload: 0, download: 0 } })
                continue
            }

            const c = this.connections.get(id)!
            const n = mapping.get(id)!
            this.connections?.set(id, { ...n, speed: { upload: n.upload - c.upload, download: n.download - c.download } })
        }
    }

    toggleSave () {
        if (this.saveDisconnection) {
            this.saveDisconnection = false
            for (const id of this.connections.keys()) {
                if (this.connections?.get(id)?.completed) {
                    this.connections.delete(id)
                }
            }
        } else {
            this.saveDisconnection = true
        }

        return this.saveDisconnection
    }

    getConnections () {
        return [...this.connections.values()]
    }
}

export function useConnections () {
    const store = useMemo(() => new Store(), [])
    const shouldFlush = useRef(true)
    const [connections, setConnections] = useState<Connections[]>([])
    const [save, setSave] = useState<boolean>(false)

    function feed (connections: API.Connections[]) {
        store.appendToSet(connections)
        if (shouldFlush.current) {
            setConnections(store.getConnections())
        }

        shouldFlush.current = !shouldFlush.current
    }

    function toggleSave () {
        const state = store.toggleSave()
        setSave(state)

        if (!state) {
            setConnections(store.getConnections())
        }

        shouldFlush.current = true
    }

    return { connections, feed, toggleSave, save }
}
