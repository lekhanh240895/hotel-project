export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <main className="flex h-screen flex-col">{children}</main>;
}
