import { LayoutFactoryProps, LayoutStrategy } from './types';
import { forceDirected } from './forceDirected';
import { circular2d } from './circular2d';
import { hierarchical } from './hierarchical';

export function layoutProvider({
  type,
  ...rest
}: LayoutFactoryProps): LayoutStrategy {
  if (type === 'forceDirected2d') {
    return forceDirected(rest);
  } else if (type === 'treeTd2d') {
    return forceDirected({ ...rest, mode: 'td', dimensions: 2 });
  } else if (type === 'treeLr2d') {
    return forceDirected({ ...rest, mode: 'lr', dimensions: 2 });
  } else if (type === 'radialOut2d') {
    return forceDirected({ ...rest, mode: 'radialout', dimensions: 2 });
  } else if (type === 'treeTd3d') {
    return forceDirected({ ...rest, mode: 'td', dimensions: 3 });
  } else if (type === 'treeLr3d') {
    return forceDirected({ ...rest, mode: 'lr', dimensions: 3 });
  } else if (type === 'radialOut3d') {
    return forceDirected({ ...rest, mode: 'radialout', dimensions: 3 });
  } else if (type === 'forceDirected3d') {
    return forceDirected({ ...rest, dimensions: 3 });
  } else if (type === 'circular2d') {
    return circular2d(rest);
  } else if (type === 'hierarchicalTd') {
    return hierarchical({ ...rest, mode: 'td' });
  } else if (type === 'hierarchicalLr') {
    return hierarchical({ ...rest, mode: 'lr' });
  }

  throw new Error(`Layout ${type} not found.`);
}
