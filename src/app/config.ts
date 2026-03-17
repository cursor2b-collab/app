/**
 * APP 分发页配置：安装包放在 public/ 下，部署后通过根路径访问
 */
export const APP_DISTRIBUTION = {
  /** 苹果端：描述文件 .mobileconfig，点击后系统会提示安装并添加到桌面 */
  iosInstallUrl: '/x426251-WebClip260317-224906-ec9.mobileconfig',
  /** 安卓端：APK 安装包，点击后下载并安装到手机 */
  androidApkUrl: '/Vip.apk',
  /** 应用名称（用于展示） */
  appName: 'VIP贵宾会',
} as const;

export type Platform = 'ios' | 'android' | 'other';

export function getPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent || '';
  const nav = navigator as Navigator & { maxTouchPoints?: number };
  if (/iPhone|iPad|iPod/i.test(ua) || ((nav.maxTouchPoints ?? 0) > 1 && /Mac/i.test(ua))) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'other';
}

/** 是否为 iOS 且处于内置浏览器（如 Telegram/微信），此类环境点击 .mobileconfig 会变成下载而非系统安装 */
export function isIosInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  if (!/iPhone|iPad|iPod/i.test(ua)) return false;
  // Telegram、微信等内置 WebView 无法触发描述文件安装，只会下载
  return /Telegram|WebKit.*MicroMessenger|FBAN|FBAV/i.test(ua);
}
