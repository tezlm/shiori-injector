import { getConfiguration } from "./configuration";

export async function getTags() {
  const configuration = getConfiguration();

  return fetch(`${configuration.baseUrl}/api/tags`, {
    headers: {
      "X-Session-Id": configuration.token,
    },
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    }
    return Promise.reject(`Error loading tags: ${response.statusText}`);
  });
}

export async function search(text) {
  const configuration = getConfiguration();
  const q = encodeURIComponent(text);

  return fetch(
    `${configuration.baseUrl}/api/bookmarks/?keyword=${q}&page=1`,
    {
      headers: {
        "X-Session-Id": configuration.token,
      },
    }
  ).then((response) => {
    if (response.status === 200) {
      return response.json().then((body) => body.bookmarks);
    }
    return Promise.reject(`Error searching bookmarks: ${response.statusText}`);
  });
}

export async function testConnection(configuration) {
  return fetch(`${configuration.baseUrl}/api/bookmarks/?page=1`, {
    headers: {
      Authorization: configuration.token,
    },
  })
    .then((response) =>
      response.status === 200 ? response.json() : Promise.reject(response)
    )
    .then((body) => !!body.bookmarks)
    .catch(() => false);
}
