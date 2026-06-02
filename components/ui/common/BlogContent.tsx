interface BlogContentProps {
  html: string;
  className?: string;
}

export default function BlogContent({ html, className = "" }: BlogContentProps) {
  return (
    <div
      className={`blog-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
