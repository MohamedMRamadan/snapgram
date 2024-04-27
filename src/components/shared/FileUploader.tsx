import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl); // this is just to display the image in the box

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      console.log(acceptedFiles);
      // Do something with the files
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [fieldChange], // file
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".png", ".jpeg", ".svg", ".webp"], // define what we can use
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex-center flex cursor-pointer flex-col rounded-xl bg-dark-3"
    >
      <input {...getInputProps()} className="cursor-pointer bg-slate-50" />
      {fileUrl ? (
        <>
          <div className="flex w-full flex-1 justify-center p-5 lg:p-10">
            <img src={fileUrl} alt="Post img" className="file_uploader-img" />
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/assets/icons/file-upload.svg"
            alt="file upload"
            width={96}
          />
          <h3 className="base-medium mb-2 mt-6 text-light-2">
            Drag Photo here
          </h3>
          <p className="small-regular mb-6 text-light-4">SVG, PNG, JPG</p>
          <Button className="shad-button_dark_4">Select from computer</Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
