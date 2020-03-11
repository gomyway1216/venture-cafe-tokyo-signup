export const doFetch = requestBody => {
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
  if (!loginInfo || !loginInfo.token) {
    throw new Error("missing loginInfo token");
  }

  const { token } = loginInfo;

  return fetch(`${process.env.REACT_APP_URL}graphql`, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    }
  }).then(res => {
    if (res.status !== 200 && res.status !== 201) {
      throw new Error("Failed fetching signed in attended");
    }
    return res.json();
  });
};
