type WithMaybeId = { id?: unknown; _id?: unknown };

/**
 * 兼容真实接口可能返回 `_id` 的情况，统一成前端使用的字符串 `id`。
 * 已有 `id` 时原样保留（含 mock 数据与字符串 id）。
 */
export function normalizeId<T extends WithMaybeId>(item: T): T & { id: string } {
  if (item.id !== undefined && item.id !== null) {
    return { ...item, id: String(item.id) };
  }
  const { _id, ...rest } = item;
  return { ...rest, id: String(_id) } as T & { id: string };
}

export function normalizeIdList<T extends WithMaybeId>(list: T[]): (T & { id: string })[] {
  return Array.isArray(list) ? list.map(normalizeId) : [];
}
