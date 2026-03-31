export const metadata = {
  title: "Circle Intelligence | Fairway Philanthropy Admin",
  description: "Elite administrative command center for the Fairway Philanthropy global network.",
};

export default function AdminLayout({ children }) {
  return (
    <div style={{ background: '#050a08', minHeight: '100vh', color: '#f0fdf4' }}>
      {children}
    </div>
  );
}
