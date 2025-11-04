"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={"light"}
      position="top-center"
      duration={5000}
      closeButton={true}
      style={{ width: "525px" }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "font-body-xs w-full bg-foreground-secondary-2 p-4 shadow-xl border-l-4 border-primary-im-dark-blue flex row-reverse items-center gap-4 line-clamp-3",
          icon: "h-5 w-5 order-first text-primary-im-dark-blue",
          closeButton:
            "order-last justify-self-end ml-auto mr-0 [&>svg]:h-4 [&>svg]:w-4 text-foreground-primary",
          warning: "border-warning [&>[data-icon]]:text-warning",
          error: "border-error [&>[data-icon]]:text-error",
          success: "border-success [&>[data-icon]]:text-success",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
