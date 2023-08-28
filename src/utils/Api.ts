
const JSON_TYPE_HEADERS = {
  "Content-Type": "application/json",
};

export async function deleteRequest<TResponse>(path: string, body: any): Promise<TResponse> {
  const response = await fetch(path, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: JSON_TYPE_HEADERS
  });

  return await response.json();
}

export async function getRequest<TResponse>(path: string, queryObject?: any): Promise<TResponse> {
  const response = await fetch(path + (queryObject ? new URLSearchParams(queryObject).toString(): ""));

  return await response.json();
}

export async function patchRequest<TResponse>(path: string, body: any): Promise<TResponse> {
  const response = await fetch(path, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: JSON_TYPE_HEADERS
  });

  return await response.json();
}

export async function postRequest<TResponse>(path: string, body: any): Promise<TResponse> {
  const response = await fetch(path, {
    method: "POST",
    body: JSON.stringify(body),
    headers: JSON_TYPE_HEADERS
  });

  return await response.json();
}

export async function putRequest<TResponse>(path: string, body: any): Promise<TResponse> {
  const response = await fetch(path, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: JSON_TYPE_HEADERS
  });

  return await response.json();
}