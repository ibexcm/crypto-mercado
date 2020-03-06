import axios from "axios";
import FormData from "form-data";

export default (data: FormData, params: any) =>
  axios(`https://ipfs.infura.io:5001/api/v0/add`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      ...data.getHeaders(),
    },
    data,
    params,
  });
