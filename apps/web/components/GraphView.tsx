'use client'

import { useState, useCallback, useMemo } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeMouseHandler,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { cn } from '@/lib/utils'

interface Tag {
  id: string
  name: string
  color?: string
}

interface Link {
  id: string
  title: string
  url: string
  domain: string
  tags: Tag[]
}

interface GraphViewProps {
  links: Link[]
  tags: Tag[]
  onNodeClick?: (node: any) => void
  className?: string
}

// Custom Node Components
const TagNode = ({ data }: any) => {
  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg shadow-sm border cursor-pointer',
        data.color ? `border-${data.color}-500 bg-${data.color}-50 text-${data.color}-800` : 'border-blue-500 bg-blue-50 text-blue-800'
      )}
    >
      <div className="font-semibold">{data.label}</div>
      <div className="text-xs opacity-80">Tag</div>
    </div>
  )
}

const LinkNode = ({ data }: any) => {
  return (
    <div className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow">
      <div className="font-medium line-clamp-1">{data.label}</div>
      <div className="text-xs text-gray-500">{data.domain}</div>
    </div>
  )
}

// Node Types
const nodeTypes = {
  tag: TagNode,
  link: LinkNode,
}

// GraphView Component
const GraphViewComponent = ({ links, tags, onNodeClick, className = '' }: GraphViewProps) => {
  // Generate nodes and edges from links and tags
  const { nodes, edges } = useMemo(() => {
    const graphNodes: Node[] = []
    const graphEdges: Edge[] = []
    
    // Add tag nodes
    tags.forEach((tag, index) => {
      graphNodes.push({
        id: `tag-${tag.id}`,
        type: 'tag',
        data: {
          label: tag.name,
          color: tag.color,
          tag,
        },
        position: {
          x: 100 + index * 200,
          y: 100,
        },
      })
    })
    
    // Add link nodes and edges
    links.forEach((link, index) => {
      graphNodes.push({
        id: `link-${link.id}`,
        type: 'link',
        data: {
          label: link.title || link.url,
          domain: link.domain,
          link,
        },
        position: {
          x: 50 + index * 150,
          y: 300,
        },
      })
      
      // Add edges between link and tags
      link.tags.forEach(tag => {
        graphEdges.push({
          id: `edge-${link.id}-${tag.id}`,
          source: `tag-${tag.id}`,
          target: `link-${link.id}`,
          animated: true,
          style: {
            stroke: tag.color || '#60a5fa',
          },
        })
      })
    })
    
    return { nodes: graphNodes, edges: graphEdges }
  }, [links, tags])
  
  const [graphNodes, setGraphNodes, onNodesChange] = useNodesState(nodes)
  const [graphEdges, setGraphEdges, onEdgesChange] = useEdgesState(edges)
  
  const onConnect = useCallback(
    (params: Connection) => setGraphEdges(eds => addEdge(params, eds)),
    [setGraphEdges]
  )
  
  const handleNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      onNodeClick?.(node.data)
    },
    [onNodeClick]
  )
  
  return (
    <div className={cn('w-full h-[80vh]', className)}>
      <ReactFlow
        nodes={graphNodes}
        edges={graphEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background variant="dots" gap={12} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}

// Wrapped Component with Provider
export default function GraphView(props: GraphViewProps) {
  return (
    <ReactFlowProvider>
      <GraphViewComponent {...props} />
    </ReactFlowProvider>
  )
}
