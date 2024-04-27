import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

type ProfileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
};

const ProfileUploader = ({ fieldChange, mediaUrl }: ProfileUploaderProps) => {
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
    <div {...getRootProps()}>
      <input {...getInputProps()} className="cursor-pointer" />
      <div className="flex cursor-pointer items-center gap-4">
        <img
          src={`${fileUrl || "/assets/icons/profile-placeholder.svg"} `}
          alt="profile-img"
          className="w-24 rounded-full object-cover"
        />
        <p className="small-regular md:base-semibold text-primary-500">
          Change profile photo
        </p>
      </div>
    </div>
  );
};

export default ProfileUploader;
