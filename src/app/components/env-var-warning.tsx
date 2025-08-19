import { Button } from "../../components/ui/button";

export function EnvVarWarning() {
  return (
    <div className="flex gap-4 items-center">
      <div className="flex gap-2">
        <Button size="sm" variant={"outline"} disabled>
          Sign in
        </Button>
        <Button size="sm" variant={"default"} disabled>
          Sign up
        </Button>
      </div>
    </div>
  );
}
