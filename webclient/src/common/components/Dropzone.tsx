import { Theme, Typography, withStyles, WithStyles } from "@material-ui/core";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import DropzoneJS, { DropzoneFile } from "dropzone";
import "dropzone/dist/basic.css";
import "dropzone/dist/dropzone.css";
import React from "react";
import { IPFSAddFileResponse, uploadFiles } from "../../libraries/ipfs";

export interface IDropzoneProps extends WithStyles, React.HTMLAttributes<HTMLDivElement> {
  onAddFile: (file: DropzoneFile) => void;
  onUploadEnd: (response: IPFSAddFileResponse[]) => void;
  message?: any;
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
}))(({ classes, onAddFile, onUploadEnd, message, ...props }: IDropzoneProps) => {
  const [_, setMessage] = React.useState(message);

  React.useEffect(() => {
    DropzoneJS.autoDiscover = false;

    const dropzone = new DropzoneJS("#dropzone", {
      url: "/",
      createImageThumbnails: false,
      uploadMultiple: false,
      previewsContainer: "#dropzone-preview",
      acceptedFiles: "image/jpeg,image/png",
    });

    dropzone.on("addedfile", (file: DropzoneFile) => {
      onAddFile(file);
      const dzUpload = file.previewElement.querySelector(".dz-upload") as HTMLElement;
      dzUpload.style.width = `0%`;
      setMessage(
        <Typography>
          Subiendo <CheckCircleOutlineIcon fontSize="small" />
        </Typography>,
      );
    });

    const dropzoneOnUploadEnd = (response: IPFSAddFileResponse[]) => {
      setMessage(message);
      onUploadEnd(response);
    };

    dropzone.uploadFiles = uploadFiles(dropzone, dropzoneOnUploadEnd);
  }, []);

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
      flexBasis: "100%",
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
