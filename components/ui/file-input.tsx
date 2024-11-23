import React from "react";

import { Button } from "./button";
import { Input, InputProps } from "./input";

export type FileInputProps = Omit<InputProps, "type"> & {
  maxSize?: number;
  onFileSelected?: (file: File) => void;
};

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    { className, children, maxSize, onFileSelected, onChange, ...props },
    ref,
  ) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    return (
      <Button
        variant="outline"
        type="button"
        className={className}
        onClick={() => fileInputRef.current?.click()}
      >
        {children ?? "Select File"}
        <Input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files![0];
            if (maxSize && file.size > maxSize) {
              alert("File is too large.");
              return;
            }
            onChange?.(event);
            onFileSelected?.(file);
          }}
          {...props}
        />
      </Button>
    );
  },
);

FileInput.displayName = "FileInput";

export { FileInput };
