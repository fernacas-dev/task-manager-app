import { useEffect, useState } from "react";
import { testloApi } from "../../../api/testlo.api";

export function RequestInfo() {
  const [info, setInfo] = useState<unknown>();

  useEffect(() => {
    testloApi
      .get("/auth/private")
      .then((res) => setInfo(res.data))
      .catch((err) => setInfo(err.response.data));
  }, []);

  return (
    <>
      <h2>Informacion</h2>
      <pre>{JSON.stringify(info, null, 2)}</pre>
    </>
  );
}

export default RequestInfo;
