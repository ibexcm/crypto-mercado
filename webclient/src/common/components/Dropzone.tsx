import { Theme, Typography, withStyles, WithStyles } from "@material-ui/core";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import DropzoneJS, { DropzoneFile } from "dropzone";
import "dropzone/dist/basic.css";
import "dropzone/dist/dropzone.css";
import ipfsClient from "ipfs-http-client";
import React from "react";

export interface IDropzoneProps extends WithStyles, React.HTMLAttributes<HTMLDivElement> {
  onAddFile: (file: DropzoneFile) => void;
}

export const Dropzone = withStyles((theme: Theme) => ({
  root: {
    borderColor: theme.palette.secondary.light,
    fontFamily: theme.typography.fontFamily,
    borderRadius: 3,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: 120,
    "& .dz-message": {
      color: theme.palette.secondary.main,
      margin: 0,
    },
  },
}))(({ classes, onAddFile, ...props }: IDropzoneProps) => {
  const [message, setMessage] = React.useState(<Typography>Upload files</Typography>);

  React.useEffect(() => {
    DropzoneJS.autoDiscover = false;

    const dropzone = new DropzoneJS("#dropzone", {
      url: "/",
      // autoProcessQueue: false,
      parallelUploads: 10,
      createImageThumbnails: false,
      uploadMultiple: true,
      previewsContainer: "#dropzone-preview",
    });

    dropzone.on("addedfile", (file: DropzoneFile) => {
      onAddFile(file);
      const dzUpload = file.previewElement.querySelector(".dz-upload") as HTMLElement;
      dzUpload.style.width = `0%`;
      setMessage(
        <Typography>
          Upload files <CheckCircleOutlineIcon fontSize="small" />
        </Typography>,
      );
      setTimeout(() => {
        setMessage(<Typography>Upload more files</Typography>);
      }, 3000);
    });

    dropzone.uploadFiles = uploadFiles(dropzone);
  }, [onAddFile]);

  const uploadFiles = (dropzone: Dropzone) => {
    return async (files: DropzoneFile[]) => {
      console.log(files);
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
              console.log(loaded);
              dzUpload.style.width = `${Math.floor((loaded / file.size) * 100)}%`;
            },
          });
          console.log(res);
        } catch (error) {
          console.error(error);
        }
      }
    };
  };

  return (
    <section id="dropzone" className={`dropzone ${classes.root}`} {...props}>
      <div className="dz-message" data-dz-message>
        {message}
      </div>
    </section>
  );
});

export const DropzonePreview = withStyles((theme: Theme) => ({
  root: {
    flexWrap: "wrap",
    display: "flex",
    height: "100%",
    backgroundColor: "whitesmoke",
    "& .dz-upload": {
      height: 3,
      display: "block",
      background: theme.palette.text.primary,
    },
    "& .dz-image-preview": {
      position: "relative",
      flexBasis: "100%",
    },
    "& .dz-file-preview": {
      position: "relative",
      flexBasis: "25%",
      padding: 3,
    },
    "& .dz-image": {
      display: "none",
    },
    "& .dz-image img": {
      borderRadius: 3,
      width: "100%",
    },
    "& .dz-details": {
      fontSize: theme.typography.caption.fontSize,
      backgroundColor: theme.palette.grey[100],
      fontFamily: theme.typography.fontFamily,
      padding: theme.spacing(1),
    },
    "& .dz-success-mark": {
      display: "none",
    },
    "& .dz-error-mark": {
      display: "none",
    },
  },
}))(({ classes, ...props }: { classes: any }) => {
  return <section id="dropzone-preview" className={classes.root} {...props}></section>;
});
