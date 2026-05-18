const PORTRAIT_ASSET_BASE = "/diary-assets/portrait";

export const portraitAssets = {
  starMap: `${PORTRAIT_ASSET_BASE}/portrait-star-map.png`,
  newDiscoveryBadge: `${PORTRAIT_ASSET_BASE}/portrait-new-discovery-badge.png`,
  centerAvatar: `${PORTRAIT_ASSET_BASE}/portrait-center-avatar.png`,
  centerPlaceholder: `${PORTRAIT_ASSET_BASE}/portrait-center-placeholder.png`,
  resonanceSweetMage: `${PORTRAIT_ASSET_BASE}/resonance-role-sweet-mage.png`,
  resonanceBraveFighter: `${PORTRAIT_ASSET_BASE}/resonance-role-brave-fighter.png`,
  resonanceTinyInventor: `${PORTRAIT_ASSET_BASE}/resonance-role-tiny-inventor.png`,
  resonanceSilhouette: `${PORTRAIT_ASSET_BASE}/resonance-role-silhouette.png`
};

export function getResonanceAsset(assetKey: string | null | undefined): string {
  if (assetKey && assetKey in portraitAssets) {
    return portraitAssets[assetKey as keyof typeof portraitAssets];
  }
  return portraitAssets.resonanceSilhouette;
}
