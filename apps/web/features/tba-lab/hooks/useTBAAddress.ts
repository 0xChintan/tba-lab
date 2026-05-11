"use client";

import { useMemo } from "react";
import { isAddress } from "viem";
import { useTBAClient } from "../providers/TBAClientContext";
import { useTBAConfig } from "../state/TBAConfig";

/**
 * Returns the deterministic TBA address for the current config, or null when
 * inputs aren't ready. Used by every write panel so they don't re-derive.
 */
export function useTBAAddress(): {
  tba: `0x${string}` | null;
  ready: boolean;
} {
  const { client } = useTBAClient();
  const { config } = useTBAConfig();

  return useMemo(() => {
    if (
      !client ||
      !isAddress(config.tokenContract) ||
      !/^[0-9]+$/.test(config.tokenId)
    ) {
      return { tba: null, ready: false };
    }
    try {
      const tba = client.getAccount({
        tokenContract: config.tokenContract as `0x${string}`,
        tokenId: config.tokenId,
        salt: config.salt,
      });
      return { tba, ready: true };
    } catch {
      return { tba: null, ready: false };
    }
  }, [client, config.tokenContract, config.tokenId, config.salt]);
}
