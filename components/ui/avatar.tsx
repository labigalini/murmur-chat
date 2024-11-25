"use client";

import * as React from "react";
import AvatarEditorPrimitive from "react-avatar-editor";

import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

import { Slider } from "./slider";

import { RotateCcwIcon, RotateCwIcon, ZoomInIcon, ZoomOutIcon } from "../icons";

export function djb2(str: string) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }
  return hash;
}

function first2(str: string) {
  return ((str[0] ?? "?") + (str[1] ?? "")).toLowerCase();
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    size?: number;
  }
>(({ className, size = 9, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      `relative flex h-${size} w-${size} shrink-0 overflow-hidden rounded-full`,
      className,
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, src: initialSrc, ...props }, ref) => {
  let src = initialSrc;
  if (!src && props.alt) {
    src = `https://avatar.vercel.sh/${djb2(props.alt)}.svg?text=${first2(props.alt)}`;
  } // TODO replace vercel image with a background gradient
  return (
    <AvatarPrimitive.Image
      ref={ref}
      src={src}
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  );
});
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, children: initialChildren, ...props }, ref) => {
  let children = initialChildren ?? "?";
  if (typeof children === "string") {
    children = first2(children);
  }
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className,
      )}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  );
});
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

interface AvatarEditorRef {
  getImage: (quality?: number) => Promise<Blob | undefined>;
}
const AvatarEditor = React.forwardRef<
  AvatarEditorRef,
  React.ComponentPropsWithoutRef<typeof AvatarEditorPrimitive>
>(({ className, image, ...props }, ref) => {
  const editorRef =
    React.useRef<React.ElementRef<typeof AvatarEditorPrimitive>>(null);

  const [scale, setScale] = React.useState(1.6);
  const [rotate, setRotate] = React.useState(0);

  React.useImperativeHandle(ref, () => ({
    getImage: (quality = 0.95) => {
      const canvas = editorRef.current?.getImageScaledToCanvas();
      return new Promise(
        (resolve) =>
          canvas &&
          canvas.toBlob((blob) => resolve(blob!), "image/jpeg", quality),
      );
    },
  }));

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <RotateCwIcon size="5" />
        <Slider
          className="h-[160px]"
          orientation="vertical"
          defaultValue={[0]}
          max={360}
          step={1}
          onValueChange={([value]) => setRotate(value)}
        />
        <RotateCcwIcon size="5" />
      </div>

      <AvatarEditorPrimitive
        ref={editorRef}
        image={image}
        width={192}
        height={192}
        border={12}
        color={[255, 255, 255, 0.7]}
        scale={scale}
        rotate={rotate}
        borderRadius={120}
        className={cn("", className)}
        {...props}
      />

      <div className="flex flex-col items-center gap-2">
        <ZoomInIcon size="5" />
        <Slider
          className="h-[160px]"
          orientation="vertical"
          defaultValue={[1.6]}
          min={1}
          max={10}
          step={0.1}
          onValueChange={([value]) => setScale(value)}
        />
        <ZoomOutIcon size="5" />
      </div>
    </div>
  );
});
AvatarEditor.displayName = "Avatar Editor";

export { Avatar, AvatarEditor, AvatarFallback, AvatarImage };
