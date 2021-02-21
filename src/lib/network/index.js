/* eslint-disable import/no-anonymous-default-export */
const getURL = (_url) => `https://dev.muminoapp.com/apis/${_url}`;
const post = (url, data = {}) =>
  new Promise((resolve) => {
    fetch(getURL(url), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  });

const get = (url) =>
  new Promise((resolve) => {
    fetch(getURL(url), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  });
const get2 = (url) =>
  new Promise((resolve) => {
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  });
const post2 = (url, data = {}) =>
  new Promise((resolve) => {
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  });

export default { post, get, post2, get2 };
