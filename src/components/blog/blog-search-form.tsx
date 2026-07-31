import { Search } from "lucide-react";

export function BlogSearchForm({
  action,
  defaultValue,
  placeholder,
}: {
  action: string;
  defaultValue?: string;
  placeholder: string;
}) {
  return (
    <form action={action} method="get" className="relative">
      <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-label={placeholder}
        className="focus-ring h-11 w-full rounded-lg border border-white/15 bg-white/[0.03] ps-11 pe-4 text-sm placeholder:text-muted-foreground"
      />
    </form>
  );
}
