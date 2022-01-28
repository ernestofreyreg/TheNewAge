export async function fetcher(path) {
  const response = await fetch(process.env.BACKEND_URL + path);
  if (response.status === 200) {
    const body = await response.json();
    return body;
  }
  return null;
}
