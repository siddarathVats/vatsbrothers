"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  initialIn?: boolean;
  style?: CSSProperties;
  [key: string]: unknown;
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  initialIn = false,
  style,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (initialIn) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "-10% 0px -10% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [initialIn]);

  const mergedStyle: CSSProperties = {
    ...(delay ? { ["--d" as never]: `${delay}ms` } : {}),
    ...style,
  };

  // Cast to a concrete permissive component type: with @react-three/fiber
  // installed, JSX over a bare ElementType union folds its props to `never`.
  const TagAny = Tag as unknown as React.ComponentType<{
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    ref?: React.Ref<HTMLElement>;
    [key: string]: unknown;
  }>;
  return (
    <TagAny
      ref={ref}
      className={`reveal${initialIn ? " in" : ""} ${className}`.trim()}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </TagAny>
  );
}
