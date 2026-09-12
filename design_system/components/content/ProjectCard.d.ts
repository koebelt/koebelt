import * as React from "react";
/**
 * A single piece of work in the portfolio grid: media, title, year, one-line summary, tags.
 */
export interface ProjectCardProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  title: string;
  /** Year or range, e.g. "2025" or "2023—24". */
  year?: string;
  /** One sentence. Never two. */
  summary?: string;
  tags?: string[];
  image?: string;
  ratio?: string;
  href?: string;
}
export declare function ProjectCard(props: ProjectCardProps): JSX.Element;
