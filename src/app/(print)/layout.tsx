export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
          <style dangerouslySetInnerHTML={{ __html: `
            @page {
              size: A4;
              margin: 0;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .no-print {
                display: none;
              }
            }
          `}} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
