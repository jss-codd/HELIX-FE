import { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

const useFetch = (options) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [headers, setHeaders] = useState(new Headers());
  const ref = useRef(false);
  const history = useHistory();

  useEffect(() => {
    ref.current = true;
    return () => {
      ref.current = false;
    };
  }, []);

  const fetchData = useCallback(
    (...args) => {
      setLoading(true);
      setError(undefined);

      const { url, body, method, onSuccess, onError } =
        typeof options === "function" ? options(...args) : options;

      const accessToken = localStorage.getItem("accessToken");
      // console.log("--------fetch data api calll--- body----",body);
      fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": accessToken,
          Authorization: `Bearer ${accessToken}`,
        },
        method,
        body,
      })
        .then((response) => {
         
          //-------multer file code----------


          if (ref.current) {
            setHeaders(response.headers);
          }

          if (!response.ok) {
            throw response;
          }
          // console.log("----response,...okkkkk---",response.text());
          



          return response.text();
        })
        .then((text) => {
          let result;

          try {
            result = JSON.parse(text);
          } catch {
            result = text;
          }

          if (ref.current) {
            setData(result);
          }
          if (typeof onSuccess === "function") {
            onSuccess(result);
          }
        })
        .catch((err) => {
          // Already protected by Keycloak
          // if (err.status === 401) {
          //   history.push("/login");
          // }

          console.log(err);

          err.text().then((text) => {
            let result;

            try {
              result = JSON.parse(text);
            } catch {
              result = text;
            }

            if (ref.current) {
              setError(result);
            }
            if (typeof onError === "function") {
              onError(result);
            }
          });
        })
        .finally(() => ref.current && setLoading(false));
    },
    [setData, setError, setLoading, options, history]
  );

  return {
    data,
    loading,
    error,
    fetchData,
    headers,
    setData,
  };
};

export default useFetch;
