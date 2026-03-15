export function fetchContentTypes(client) {
  return client.get("/content-types");
}

export function fetchContentsByType(client, typeSlug) {
  return client.get(`/content-types/${typeSlug}/contents`);
}

export function fetchContentBySlug(client, slug) {
  return client.get(`/contents/${slug}`);
}

export function createContent(client, data) {
  return client.post("/contents", data);
}

export function updateContent(client, id, data) {
  return client.put(`/contents/${id}`, data);
}

export function deleteContent(client, id) {
  return client.delete(`/contents/${id}`);
}

export function togglePublish(client, id, isPublished) {
  return client.patch(`/contents/${id}/publish`, { isPublished });
}