interface MaybeIdDocument {
  _id?: unknown;
  id?: unknown;
}

/**
 * Mongoose lean() 返回的文档标识符是 `_id`，而前端统一使用 `id`。
 * 在响应边界把 `_id` 归一化为字符串 `id`，避免前端拼出 `/artwork/undefined`。
 */
export function serialize<T extends MaybeIdDocument>(doc: T | null | undefined): (Omit<T, '_id'> & { id: string }) | null {
  if (!doc) {
    return null;
  }
  const { _id, ...rest } = doc;
  const existingId = (rest as { id?: unknown }).id;
  return { ...rest, id: existingId !== undefined ? String(existingId) : String(_id) } as Omit<T, '_id'> & { id: string };
}

export function serializeList<T extends MaybeIdDocument>(docs: T[]): (Omit<T, '_id'> & { id: string })[] {
  return docs.map((doc) => serialize(doc) as Omit<T, '_id'> & { id: string });
}
