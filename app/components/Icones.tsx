// Ícones em SVG (traço, 24x24) usados nos cartões de destaque e no acervo.
// Mantidos como componente de servidor: sem estado, sem JavaScript.

interface PropsIcone {
  className?: string;
}

function Base({
  children,
  className,
  viewBox = "0 0 24 24",
}: {
  children: React.ReactNode;
  className?: string;
  viewBox?: string;
}) {
  return (
    <svg viewBox={viewBox} aria-hidden="true" focusable="false" className={className}>
      {children}
    </svg>
  );
}

export function IconeDocumento({ className }: PropsIcone) {
  return (
    <Base className={className}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
    </Base>
  );
}

export function IconePlano({ className }: PropsIcone) {
  return (
    <Base className={className}>
      <path d="M5 4h14v16H5z" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </Base>
  );
}

export function IconeGrafico({ className }: PropsIcone) {
  return (
    <Base className={className}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M7 15l4-4 3 2 5-6" />
      <path d="M16 7h3v3" />
    </Base>
  );
}

export function IconeRede({ className }: PropsIcone) {
  return (
    <Base className={className}>
      <circle cx="12" cy="7" r="3" />
      <path d="M6 20c0-3 2.5-5 6-5s6 2 6 5" />
      <path d="M5 10a3 3 0 0 0-2 3" />
      <path d="M19 10a3 3 0 0 1 2 3" />
    </Base>
  );
}

export function IconePasta({ className }: PropsIcone) {
  return (
    <Base className={className}>
      <path d="M5 3h10l4 4v14H5z" />
      <path d="M15 3v5h4" />
      <path d="M8 12h8" />
      <path d="M8 16h8" />
    </Base>
  );
}

export function IconeBusca({ className }: PropsIcone) {
  return (
    <Base className={className}>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.2-4.2" />
    </Base>
  );
}

export function IconeEscudo({ className }: PropsIcone) {
  return (
    <Base className={className}>
      <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6z" />
      <path d="M9.5 12.2l1.9 1.9 3.4-3.6" />
    </Base>
  );
}
