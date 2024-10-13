export function CircleInfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
      <path d="M12 17V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <circle cx="1" cy="1" r="1" transform="matrix(1 0 0 -1 11 9)" fill="currentColor" />
    </svg>
  );
}
