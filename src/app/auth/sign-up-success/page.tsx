import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent>
              <p className="text-sm mt-4 text-black-500">
                ログインが完了しました。
              </p>
              <Link className="text-sm text-blue-500" href="/">
                Homeへ戻る
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
