'use client';
import Link, { type LinkProps } from 'next/link';
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { useMagnetic } from '@/hooks/use-magnetic';

type MagneticLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children?: ReactNode;
    className?: string;
    strength?: number;
    range?: number;
  };

/**
 * A drop-in replacement for next/link that adds a subtle magnetic hover
 * effect. Useful for primary CTAs.
 */
const MagneticLink = forwardRef<HTMLAnchorElement, MagneticLinkProps>(
  function MagneticLink(
    { children, className, strength = 0.3, range = 80, ...rest },
    _forwardedRef,
  ) {
    const ref = useMagnetic<HTMLAnchorElement>({ strength, range });
    return (
      <Link ref={ref} className={className} {...rest}>
        {children}
      </Link>
    );
  },
);

export default MagneticLink;
