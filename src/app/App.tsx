import { useMemo, useState, useEffect } from 'react';
import { Star, User, Download } from 'lucide-react';
import { getPlatform, APP_DISTRIBUTION, isIosInAppBrowser } from './config';

// 应用图标：放在 public/vipclub.png，部署后通过 /vipclub.png 访问
const appIconSrc = '/vipclub.png';

const IOS_SIGN_STEPS = [
  '点击「安装」后，系统会提示安装描述文件，点击「允许」即可。',
  '安装完成后，应用图标会出现在桌面，首次打开需前往 设置 → 通用 → VPN与设备管理 → 信任对应描述文件。',
  '信任后即可正常打开应用，部分机型信任后需重启手机。',
];

/** 点击「去信任」时使用的系统提示文案 */
const IOS_TRUST_ALERT_MESSAGE =
  '由于系统限制，您需要到【设置-通用-VPN与设备管理】处设置信任。手机视情况可能需要重启，重启后根据提示安装该应用的描述文件后才能正常使用。';

export default function App() {
  const platform = useMemo(getPlatform, []);
  const [showSignModal, setShowSignModal] = useState(false);
  const [showIosInstallHint, setShowIosInstallHint] = useState(false);
  const [installLinkCopied, setInstallLinkCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState('');
  const isIos = platform === 'ios';
  const isAndroid = platform === 'android';
  const isOther = platform === 'other';

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const getIosInstallFullUrl = () =>
    `${window.location.origin}${APP_DISTRIBUTION.iosInstallUrl}`;

  const handleIosInstall = () => {
    // Telegram/微信等内置浏览器会变成下载文件，需引导用 Safari 打开链接
    if (isIosInAppBrowser()) {
      setShowIosInstallHint(true);
      setInstallLinkCopied(false);
      return;
    }
    window.location.href = APP_DISTRIBUTION.iosInstallUrl;
  };

  const handleCopyIosInstallLink = async () => {
    try {
      await navigator.clipboard.writeText(getIosInstallFullUrl());
      setInstallLinkCopied(true);
    } catch {
      window.alert('复制失败，请手动复制：' + getIosInstallFullUrl());
    }
  };

  const handleAndroidDownload = () => {
    // 打开 APK 链接，安卓会下载并提示安装到手机
    window.location.href = APP_DISTRIBUTION.androidApkUrl;
  };

  /** 苹果端点击「去信任」：使用系统弹窗提示前往设置信任 */
  const handleIosTrustAlert = () => {
    window.alert(IOS_TRUST_ALERT_MESSAGE);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto bg-white">
        {/* PC 端：仅显示二维码 + 提示，扫码后用手机打开会识别设备并显示对应安装 */}
        {isOther && (
          <div className="p-8 border-b flex flex-col items-center text-center">
            <img
              src={appIconSrc}
              alt={APP_DISTRIBUTION.appName}
              className="w-24 h-24 rounded-2xl shadow-md object-cover mb-4"
            />
            <h1 className="text-2xl font-medium text-gray-900 mb-8">{APP_DISTRIBUTION.appName}</h1>
            {pageUrl && (
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pageUrl)}`}
                alt="扫码下载"
                className="w-[200px] h-[200px] border border-gray-200 rounded-lg"
              />
            )}
            <p className="mt-6 text-gray-600 text-base">请使用手机相机扫描二维码下载</p>
          </div>
        )}

        {/* 设备识别提示（仅安卓显示；苹果端已隐藏） */}
        {isAndroid && (
          <div className="px-4 py-2 bg-gray-50 border-b text-center text-sm text-gray-500">
            当前设备：<span className="text-green-600 font-medium">安卓 (Android)</span>
          </div>
        )}

        {/* 苹果端：安装到主屏幕 + 去信任（仅 iOS 显示一个安装区，说明框已隐藏） */}
        {isIos && (
          <div className="p-6 border-b">
            <div className="flex items-start gap-4">
              <img
                src={appIconSrc}
                alt={APP_DISTRIBUTION.appName}
                className="w-20 h-20 rounded-2xl shadow-md object-cover"
              />
              <div className="flex-1">
                <h1 className="text-xl font-medium mb-2">{APP_DISTRIBUTION.appName}</h1>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-1 text-sm">4.7</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={handleIosInstall}
                className="flex-1 bg-blue-500 text-white py-3 rounded-[80px] font-medium"
              >
                安装
              </button>
              <button
                type="button"
                onClick={handleIosTrustAlert}
                className="px-6 border border-blue-500 text-blue-500 py-3 rounded-[80px] font-medium"
              >
                去信任
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              安装前请删除旧版应用；安装后点击「去信任」完成系统信任，信任后需重启手机。
            </p>
          </div>
        )}

        {/* 安卓端：APK 下载（仅 Android 显示一个安装区） */}
        {isAndroid && (
          <div className="p-6 border-b">
            <div className="flex items-start gap-4">
              <img
                src={appIconSrc}
                alt={APP_DISTRIBUTION.appName}
                className="w-20 h-20 rounded-2xl shadow-md object-cover"
              />
              <div className="flex-1">
                <h1 className="text-xl font-medium mb-2">{APP_DISTRIBUTION.appName}</h1>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-1 text-sm">4.7</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAndroidDownload}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-medium mt-4 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              安装
            </button>
            <p className="text-xs text-gray-500 mt-3">
              点击安装，下载完成后打开安装包即可安装到手机桌面。
            </p>
          </div>
        )}

        {/* Stats Section（仅手机端显示） */}
        {(isIos || isAndroid) && (
        <div className="px-6 py-5 border-b">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <div className="font-medium">4.7</div>
                <div className="text-xs text-gray-500">评分</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-blue-400 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium">9.8万</div>
                <div className="text-xs text-gray-500">包数次数</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-blue-400 rounded-full flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium">100万</div>
                <div className="text-xs text-gray-500">总下载次数</div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* App Title（仅手机端） */}
        {(isIos || isAndroid) && (
        <div className="px-6 py-4 border-b">
          <h2 className="text-sm">【{APP_DISTRIBUTION.appName}】苹果官方授权App</h2>
          <div className="flex gap-2 mt-3">
            <span className="px-3 py-1 bg-blue-50 text-blue-500 text-xs rounded-full">
              Apple授权App
            </span>
            <span className="px-3 py-1 bg-blue-50 text-blue-500 text-xs rounded-full">
              V6.0.99
            </span>
          </div>
        </div>
        )}

        {/* Rating Section（仅手机端） */}
        {(isIos || isAndroid) && (
        <div className="px-6 py-5 border-b">
          <h3 className="font-medium mb-3">应用评分</h3>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-medium">4.7</div>
              <div className="flex gap-0.5 my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-xs text-blue-500">9.8万次评分</div>
            </div>
            <div className="flex-1 space-y-1">
              {[
                { stars: 5, percent: 85 },
                { stars: 4, percent: 10 },
                { stars: 3, percent: 3 },
                { stars: 2, percent: 1 },
                { stars: 1, percent: 1 },
              ].map((item) => (
                <div key={item.stars} className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-2 h-2 ${
                          star <= item.stars 
                            ? 'fill-gray-400 text-gray-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* Reviews Section（仅手机端） */}
        {(isIos || isAndroid) && (
        <div className="px-6 py-5 border-b">
          <h3 className="font-medium mb-4">应用评价</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-0.5">非常棒的APP，推荐！！</h4>
                <div className="text-xs text-blue-500">Andrew</div>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              这个APP真的太好用了，应用流畅不卡顿，画面清晰，操作便捷，玩法丰富多样，朋友都在玩这个App，老铁们也可以试试看，真的很不错的一款，强烈推荐！！推荐！！！推荐！！！
            </p>
            <div className="flex items-center justify-between">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-xs text-blue-400">2026/02/15</div>
            </div>
          </div>
        </div>
        )}

        {/* Info Section（仅手机端） */}
        {(isIos || isAndroid) && (
        <div className="px-6 py-5">
          <h3 className="font-medium mb-3">信息</h3>
          <div className="rounded-xl bg-white border border-gray-100 overflow-hidden">
            {[
              { label: '销售商', value: 'VIP贵宾会' },
              { label: '大小', value: '75.78 MB' },
              { label: '兼容性', value: '可在此iPhone上使用' },
              { label: '语言', value: '简体中文' },
              { label: '价格', value: '免费' },
              { label: '年龄分级', value: '18+' },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`flex items-center justify-between py-3 px-4 ${i > 0 ? 'border-t border-gray-100' : ''}`}
              >
                <span className="text-sm text-blue-500">{item.label}</span>
                <span className="text-sm text-gray-900 font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>

      {/* 苹果端 - Telegram/内置浏览器提示：避免点击安装变成下载文件 */}
      {showIosInstallHint && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setShowIosInstallHint(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-install-hint-title"
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="ios-install-hint-title" className="font-semibold text-lg mb-3">请使用 Safari 安装</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              当前在 Telegram 等内置浏览器中，点击安装会变成下载文件，无法完成描述文件安装。请点击下方「复制安装链接」，然后打开 <strong>Safari</strong>，在地址栏粘贴并访问该链接即可完成安装。
            </p>
            <p className="text-xs text-gray-500 mb-4">
              或点击右上角「…」选择「在 Safari 中打开」本页，再用 Safari 点击安装。
            </p>
            <button
              type="button"
              onClick={handleCopyIosInstallLink}
              className="w-full py-3 rounded-[80px] font-medium bg-blue-500 text-white mb-2"
            >
              {installLinkCopied ? '已复制，请打开 Safari 粘贴访问' : '复制安装链接'}
            </button>
            <button
              type="button"
              onClick={() => setShowIosInstallHint(false)}
              className="w-full py-2.5 text-gray-500 text-sm"
            >
              知道了
            </button>
          </div>
        </div>
      )}

      {/* 苹果端 - 签名安装步骤弹层 */}
      {showSignModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setShowSignModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sign-modal-title"
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="sign-modal-title" className="font-semibold text-lg mb-3">苹果端签名安装步骤</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              {IOS_SIGN_STEPS.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            <button
              type="button"
              onClick={() => setShowSignModal(false)}
              className="mt-4 w-full py-2.5 bg-blue-500 text-white rounded-lg font-medium"
            >
              知道了
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
