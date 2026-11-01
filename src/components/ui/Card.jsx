export default function Card({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag
      className={`rounded-xl border border-navy-50 bg-white p-4 ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}