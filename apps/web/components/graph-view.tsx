'use client'

import React from 'react'
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, Edge, Node } from 'reactflow'
import 'reactflow/dist/style.css'
import { LinkWithRelations } from './types'

export function GraphView({ links }: { links: LinkWithRelations[] }) {
  const nodes: Node[] = []
  const edges: Edge[] = []

  links.forEach((link, idx) => {
    const nodeId = `link-${link.id}`
    nodes.push({ id: nodeId, data: { label: link.title || link.url }, position: { x: (idx % 4) * 200, y: Math.floor(idx / 4) * 150 } })
    link.tags.forEach((tag) => {
      const tagId = `tag-${tag.tagId}`
      if (!nodes.find((n) => n.id === tagId)) {
        nodes.push({ id: tagId, data: { label: `#${tag.tag.name}` }, position: { x: Math.random() * 600, y: Math.random() * 300 } })
      }
      edges.push({ id: `${nodeId}-${tagId}`, source: nodeId, target: tagId })
    })
    link.collections.forEach((c) => {
      const colId = `collection-${c.collectionId}`
      if (!nodes.find((n) => n.id === colId)) {
        nodes.push({ id: colId, data: { label: c.collection.name }, position: { x: Math.random() * 600, y: Math.random() * 300 } })
      }
      edges.push({ id: `${nodeId}-${colId}`, source: nodeId, target: colId, animated: true })
    })
  })

  const [nodeState, , onNodesChange] = useNodesState(nodes)
  const [edgeState, , onEdgesChange] = useEdgesState(edges)

  return (
    <div className="h-96 rounded-2xl border border-slate-200">
      <ReactFlow nodes={nodeState} edges={edgeState} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} fitView>
        <Background gap={16} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}
