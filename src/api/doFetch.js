export const doFetch = requestBody => {
  return fetch(`${process.env.REACT_APP_URL}graphql`, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => {
    if (res.status !== 200 && res.status !== 201) {
      throw new Error('Failed fetching signed in attended')
    }
    return res.json()
  })
}
