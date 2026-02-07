export default function SimpleTest() {
  return (
    <html lang="ko" className="dark">
      <body>
        <div className="min-h-screen bg-white dark:bg-black p-8">
          <h1 className="text-black dark:text-white text-4xl font-bold mb-4">
            Simple Dark Mode Test
          </h1>

          <div className="space-y-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-800">
              <p className="text-gray-900 dark:text-gray-100">
                이 박스는 라이트 모드에서 회색, 다크 모드에서 진한 회색이어야 합니다.
              </p>
            </div>

            <div className="p-4 bg-blue-100 dark:bg-blue-900">
              <p className="text-blue-900 dark:text-blue-100">
                이 박스는 라이트 모드에서 연한 파랑, 다크 모드에서 진한 파랑이어야 합니다.
              </p>
            </div>

            <div className="p-4 bg-red-500 dark:bg-green-500">
              <p className="text-white">
                이 박스는 라이트 모드에서 빨강, 다크 모드에서 초록이어야 합니다.
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 border-4 border-black dark:border-white">
            <p className="text-black dark:text-white">
              HTML에 className="dark"가 하드코딩되어 있습니다.
              이 페이지가 다크 모드로 보이지 않으면 Tailwind 설정이 잘못된 것입니다.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
