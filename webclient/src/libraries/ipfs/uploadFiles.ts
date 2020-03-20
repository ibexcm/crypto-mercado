import Dropzone, { DropzoneFile } from "dropzone";
import ipfsClient from "ipfs-http-client";
import { IPFSAddFileResponse } from "./models/IPFSAddFileResponse";

export const uploadFiles = (
  dropzone: Dropzone,
  onUploadEnd: (response: IPFSAddFileResponse[]) => void,
) => {
  return async (files: DropzoneFile[]) => {
    for (const file of files) {
      dropzone.emit("sending", file);
    }

    const ipfs = ipfsClient({ host: "ipfs.infura.io", port: "5001", protocol: "https" });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const dzUpload = file.previewElement.querySelector(".dz-upload") as HTMLElement;
      try {
        const res = await ipfs.add([file], {
          progress: (loaded: number) => {
            dzUpload.style.width = `${Math.floor((loaded / file.size) * 100)}%`;
          },
        });
        onUploadEnd(res);
      } catch (error) {
        console.error(error);
      }
    }
  };
};
