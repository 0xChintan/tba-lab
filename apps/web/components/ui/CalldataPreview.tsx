"use client";

export function CalldataPreview({
  prepared,
}: {
  prepared:
    | { to?: `0x${string}`; value?: bigint; data?: `0x${string}` }
    | null;
}) {
  if (!prepared) return null;
  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3 text-xs font-mono space-y-1">
      <div className="text-zinc-500">prepared transaction</div>
      {prepared.to ? (
        <div>
          <span className="text-zinc-500">to:    </span>
          {prepared.to}
        </div>
      ) : null}
      {prepared.value !== undefined ? (
        <div>
          <span className="text-zinc-500">value: </span>
          {String(prepared.value)}
        </div>
      ) : null}
      {prepared.data ? (
        <div className="break-all">
          <span className="text-zinc-500">data:  </span>
          {prepared.data}
        </div>
      ) : null}
    </div>
  );
}
