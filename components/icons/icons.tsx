"use client";

import React from "react";

import {
  BellIcon as BellIconPrimitive,
  CaretSortIcon as CaretSortIconPrimitive,
  CheckIcon as CheckIconPrimitive,
  ChevronDownIcon as ChevronDownIconPrimitive,
  ChevronLeftIcon as ChevronLeftIconPrimitive,
  ChevronRightIcon as ChevronRightIconPrimitive,
  Cross2Icon as Cross2IconPrimitive,
  DashIcon as DashIconPrimitive,
  DesktopIcon as DesktopIconPrimitive,
  DotFilledIcon as DotFilledIconPrimitive,
  DotsHorizontalIcon as DotsHorizontalIconPrimitive,
  DragHandleDots2Icon as DragHandleDots2IconPrimitive,
  FaceIcon as FaceIconPrimitive,
  HamburgerMenuIcon as HamburgerMenuIconPrimitive,
  InfoCircledIcon as InfoCircledIconPrimitive,
  MagnifyingGlassIcon as MagnifyingGlassIconPrimitive,
  MoonIcon as MoonIconPrimitive,
  PaperPlaneIcon as PaperPlaneIconPrimitive,
  Pencil2Icon as Pencil2IconPrimitive,
  SunIcon as SunIconPrimitive,
} from "@radix-ui/react-icons";
import { IconProps as RadixIconProps } from "@radix-ui/react-icons/dist/types";
import {
  AlertTriangleIcon as AlertTriangleIconPrimitive,
  LucideProps as LucideIconProps,
  SearchIcon as SearchIconPrimitive,
  Trash2Icon as TrashIconPrimitive,
  UserRoundCogIcon as UserRoundCogIconPrimitive,
  UserRoundPlusIcon as UserRoundPlusIconPrimitive,
  UserRoundXIcon as UserRoundXIconPrimitive,
} from "lucide-react";

import { cn, fr } from "@/lib/utils";

const createIcon = (
  IconPrimitive:
    | React.ForwardRefExoticComponent<
        RadixIconProps & React.RefAttributes<SVGSVGElement>
      >
    | React.ForwardRefExoticComponent<
        LucideIconProps & React.RefAttributes<SVGSVGElement>
      >,
) => {
  return fr<SVGSVGElement, { className?: string; size?: string | number }>(
    ({ className, size, ...props }, ref) => {
      return (
        <IconPrimitive
          ref={ref}
          className={cn(size && `h-${size} w-${size}`, className)}
          {...props}
        />
      );
    },
  );
};

// Create sized versions of each icon
export const BellIcon = createIcon(BellIconPrimitive);
export const CaretSortIcon = createIcon(CaretSortIconPrimitive);
export const CheckIcon = createIcon(CheckIconPrimitive);
export const ChevronDownIcon = createIcon(ChevronDownIconPrimitive);
export const ChevronLeftIcon = createIcon(ChevronLeftIconPrimitive);
export const ChevronRightIcon = createIcon(ChevronRightIconPrimitive);
export const Cross2Icon = createIcon(Cross2IconPrimitive);
export const DashIcon = createIcon(DashIconPrimitive);
export const DesktopIcon = createIcon(DesktopIconPrimitive);
export const DotFilledIcon = createIcon(DotFilledIconPrimitive);
export const DotsHorizontalIcon = createIcon(DotsHorizontalIconPrimitive);
export const DragHandleDots2Icon = createIcon(DragHandleDots2IconPrimitive);
export const FaceIcon = createIcon(FaceIconPrimitive);
export const HamburgerMenuIcon = createIcon(HamburgerMenuIconPrimitive);
export const InfoCircledIcon = createIcon(InfoCircledIconPrimitive);
export const MagnifyingGlassIcon = createIcon(MagnifyingGlassIconPrimitive);
export const MoonIcon = createIcon(MoonIconPrimitive);
export const PaperPlaneIcon = createIcon(PaperPlaneIconPrimitive);
export const Pencil2Icon = createIcon(Pencil2IconPrimitive);
export const SunIcon = createIcon(SunIconPrimitive);
export const AlertIcon = createIcon(AlertTriangleIconPrimitive);
export const SearchIcon = createIcon(SearchIconPrimitive);
export const TrashIcon = createIcon(TrashIconPrimitive);
export const UserRoundCogIcon = createIcon(UserRoundCogIconPrimitive);
export const UserPlusIcon = createIcon(UserRoundPlusIconPrimitive);
export const UserRoundXIcon = createIcon(UserRoundXIconPrimitive);
