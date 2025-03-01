import { nodeSizeProvider, SizingType } from '../sizing';
import {
  GraphEdge,
  GraphNode,
  InternalGraphEdge,
  InternalGraphNode
} from '../types';
import { calcLabelVisibility, LabelVisibilityType } from './visibility';

export function buildGraph(graph, nodes: GraphNode[], edges: GraphEdge[]) {
  graph.clear();
  graph.beginUpdate();

  for (const node of nodes) {
    graph.addNode(node.id, node);
  }

  for (const edge of edges) {
    graph.addLink(edge.source, edge.target, edge);
  }

  graph.endUpdate();
}

interface TransformGraphInput {
  graph: any;
  layout: any;
  sizingType?: SizingType;
  labelType?: LabelVisibilityType;
  sizingAttribute?: string;
}

export function transformGraph({
  graph,
  layout,
  sizingType,
  labelType,
  sizingAttribute
}: TransformGraphInput) {
  const nodes: InternalGraphNode[] = [];
  const edges: InternalGraphEdge[] = [];
  const map = new Map();

  const sizes = nodeSizeProvider(graph, sizingType, sizingAttribute);
  const nodeCount = graph.getNodesCount();
  const checkVisibility = calcLabelVisibility(nodeCount, labelType);

  graph.forEachNode((node: InternalGraphNode) => {
    if (node.data) {
      const position = layout.getNodePosition(node.id);
      const { data, fill, icon, label, size, ...rest } = node.data;
      const nodeSize = sizes.getSizeForNode(node.id, size);
      const labelVisible = checkVisibility('node', nodeSize);

      const n = {
        ...node,
        size: nodeSize,
        labelVisible,
        label,
        icon,
        fill,
        data: {
          ...rest,
          ...(data || {})
        },
        position: {
          ...position,
          z: position.z || 1
        }
      };

      map.set(node.id, n);
      nodes.push(n);
    }
  });

  graph.forEachLink((link: InternalGraphEdge) => {
    const from = map.get(link.fromId);
    const to = map.get(link.toId);

    if (from && to) {
      const { data, id, label, size, ...rest } = link.data;
      const labelVisible = checkVisibility('edge', link.size);

      edges.push({
        ...link,
        id,
        label,
        labelVisible,
        size,
        data: {
          ...rest,
          ...(data || {})
        }
        /*
        from,
        to,
        position: {
          from: from.position,
          to: to.position
        }
        */
      });
    }
  });

  return {
    nodes,
    edges
  };
}
