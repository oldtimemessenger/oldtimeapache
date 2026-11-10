import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, BackHandler, Linking, Platform, Pressable, StyleSheet, Text, View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import {
  endConnection, fetchProducts, finishTransaction, getAvailablePurchases, initConnection,
  purchaseErrorListener, purchaseUpdatedListener, requestPurchase, restorePurchases,
  type Purchase,
} from 'expo-iap';
import { useColors } from '@/hooks/useColors';
import { navigationAction } from '@/lib/navigation-policy.mjs';

const BLUE_BADGE_PRODUCT_ID = 'com.oldtime.messenger.bluebbadge';
const APP_ACCOUNT_TOKEN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
let storeConnected = false;

export default function OldtimeSurface({ appUrl }: { appUrl: string }) {
  const colors = useColors();
  const webview = useRef<WebView<{}>>(null);
  const canGoBack = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const purchaseBusy = useRef(false);
  const pendingPurchases = useRef(new Map<string, Purchase>());

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canGoBack.current || error) return false;
      webview.current?.goBack();
      return true;
    });
    return () => sub.remove();
  }, [error]);

  const openExternal = async (url: string) => {
    if (navigationAction(url, appUrl) !== 'external') return;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Link unavailable', 'This link could not be opened on your device.');
    }
  };

  const reportBadgePurchase = (
    status: string,
    transactionId?: string,
    signedTransactionInfo?: string,
  ) => {
    const detail = JSON.stringify({
      status,
      ...(transactionId ? { transactionId } : {}),
      ...(signedTransactionInfo ? { signedTransactionInfo } : {}),
    });
    const safeDetail = JSON.stringify(detail).replace(/</g, '\\u003c');
    webview.current?.injectJavaScript(
      `window.dispatchEvent(new CustomEvent('oldtime:blue-badge',{detail:JSON.parse(${safeDetail})}));true;`,
    );
  };

  const acceptStorePurchase = (purchase: Purchase) => {
    if (purchase.productId !== BLUE_BADGE_PRODUCT_ID || !purchase.id) return;
    if (!purchase.purchaseToken) {
      reportBadgePurchase('purchase-failed');
      return;
    }
    pendingPurchases.current.set(purchase.id, purchase);
    reportBadgePurchase('purchase-received', purchase.id, purchase.purchaseToken);
  };

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    const purchaseUpdates = purchaseUpdatedListener(acceptStorePurchase);
    const purchaseErrors = purchaseErrorListener(error => {
      const code = String(error.code ?? '').toLowerCase();
      reportBadgePurchase(code.includes('cancel') ? 'cancelled' : 'purchase-failed');
    });
    return () => {
      purchaseUpdates.remove();
      purchaseErrors.remove();
      if (storeConnected) {
        storeConnected = false;
        void endConnection().catch(() => {});
      }
    };
  }, []);

  const handleBadgeFinishMessage = async (message: { type?: string; transactionId?: string }) => {
    if (message.type !== 'blue-badge-finish' || !message.transactionId) return;
    const purchase = pendingPurchases.current.get(message.transactionId);
    if (!purchase) return;
    try {
      await finishTransaction({ purchase, isConsumable: false });
      pendingPurchases.current.delete(message.transactionId);
    } catch {
      // An unfinished verified transaction is replayed by StoreKit and can be
      // verified again on the next app launch.
    }
  };

  const handleBadgePurchaseMessage = async (raw: string) => {
    let message: {
      type?: string;
      appAccountToken?: string;
      productId?: string;
      transactionId?: string;
    };
    try {
      message = JSON.parse(raw);
    } catch {
      return;
    }
    if (message.type === 'blue-badge-finish') {
      await handleBadgeFinishMessage(message);
      return;
    }
    if (!['blue-badge-purchase', 'blue-badge-restore'].includes(message.type ?? '')) return;
    if (purchaseBusy.current) return;
    if (Platform.OS !== 'ios' ||
        message.productId !== BLUE_BADGE_PRODUCT_ID ||
        !APP_ACCOUNT_TOKEN.test(message.appAccountToken ?? '')) {
      reportBadgePurchase('unavailable');
      return;
    }

    purchaseBusy.current = true;
    try {
      if (!storeConnected) {
        await initConnection();
        storeConnected = true;
      }

      if (message.type === 'blue-badge-restore') {
        await restorePurchases();
        const purchases = await getAvailablePurchases({ onlyIncludeActiveItemsIOS: true });
        const matching = purchases
          .filter(purchase => purchase.productId === BLUE_BADGE_PRODUCT_ID && !!purchase.id)
          .sort((left, right) => right.transactionDate - left.transactionDate);
        if (!matching[0]) reportBadgePurchase('restore-empty');
        else acceptStorePurchase(matching[0]);
        return;
      }

      const products = await fetchProducts({ skus: [BLUE_BADGE_PRODUCT_ID], type: 'subs' });
      const monthly = products?.find(product =>
        product.id === BLUE_BADGE_PRODUCT_ID && product.type === 'subs',
      );
      if (!monthly || !Number.isFinite(monthly.price) || (monthly.price ?? 0) <= 0) {
        reportBadgePurchase('store-unavailable');
        return;
      }

      const accepted = await new Promise<boolean>(resolve => {
        Alert.alert(
          'Blue Badge monthly',
          `${monthly.displayPrice} per month. Your Apple Account will be charged after you confirm with Apple. The subscription renews automatically unless you cancel in your Apple Account settings.`,
          [
            { text: 'Not now', style: 'cancel', onPress: () => resolve(false) },
            { text: `Continue · ${monthly.displayPrice}`, onPress: () => resolve(true) },
          ],
          { cancelable: true, onDismiss: () => resolve(false) },
        );
      });
      if (!accepted) {
        reportBadgePurchase('cancelled');
        return;
      }

      await requestPurchase({
        request: {
          apple: {
            sku: BLUE_BADGE_PRODUCT_ID,
            appAccountToken: message.appAccountToken,
          },
        },
        type: 'subs',
      });
    } catch (purchaseError) {
      const error = purchaseError as { userCancelled?: boolean; code?: string };
      reportBadgePurchase(
        error.userCancelled || String(error.code ?? '').toLowerCase().includes('cancel')
          ? 'cancelled'
          : 'purchase-failed',
      );
    } finally {
      purchaseBusy.current = false;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <WebView<{}>
        ref={webview}
        testID="oldtime-webview"
        source={{ uri: appUrl }}
        style={styles.container}
        originWhitelist={['https://*', 'mailto:*', 'tel:*']}
        onShouldStartLoadWithRequest={request => {
          if (request.isTopFrame === false) return true;
          const action = navigationAction(request.url, appUrl);
          if (action === 'external') void openExternal(request.url);
          return action === 'internal';
        }}
        onOpenWindow={({ nativeEvent }) => {
          if (navigationAction(nativeEvent.targetUrl, appUrl) === 'internal') {
            // Open same-origin links in the existing authenticated WebView.
            const target = JSON.stringify(nativeEvent.targetUrl).replace(/</g, '\\u003c');
            webview.current?.injectJavaScript(`window.location.assign(${target}); true;`);
          } else {
            void openExternal(nativeEvent.targetUrl);
          }
        }}
        onNavigationStateChange={state => { canGoBack.current = state.canGoBack; }}
        onMessage={({ nativeEvent }) => { void handleBadgePurchaseMessage(nativeEvent.data); }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => { setLoading(false); setError('Check your connection and try again. Your account and posts remain on Oldtime.'); }}
        onHttpError={({ nativeEvent }) => {
          if (nativeEvent.statusCode >= 500 && navigationAction(nativeEvent.url, appUrl) === 'internal') {
            setLoading(false);
            setError('Oldtime is temporarily unavailable. Please try again.');
          }
        }}
        onContentProcessDidTerminate={() => {
          setLoading(false);
          setError('Oldtime needs to reload. Unsent edits may need to be reopened.');
        }}
        onFileDownload={({ nativeEvent }) => {
          if (navigationAction(nativeEvent.downloadUrl, appUrl) === 'blocked') return;
          Alert.alert('Open download', 'Open this download in your browser? You may need to sign in there.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open browser', onPress: () => {
              void Linking.openURL(nativeEvent.downloadUrl).catch(() =>
                Alert.alert('Download unavailable', 'Try downloading this media in your browser.'));
            } },
          ]);
        }}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled={false}
        allowsInlineMediaPlayback
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction
        mediaCapturePermissionGrantType="prompt"
        geolocationEnabled
        mixedContentMode="never"
        allowFileAccess={false}
        allowFileAccessFromFileURLs={false}
        allowUniversalAccessFromFileURLs={false}
        javaScriptCanOpenWindowsAutomatically={false}
        allowsBackForwardNavigationGestures
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        webviewDebuggingEnabled={__DEV__}
      />
      {loading && !error && (
        <View pointerEvents="none" style={[styles.loading, { backgroundColor: colors.background }]}>
          <ActivityIndicator accessibilityLabel="Loading Oldtime" color={colors.primary} />
        </View>
      )}
      {error && (
        <View style={[styles.error, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Couldn’t open Oldtime</Text>
          <Text style={[styles.message, { color: colors.mutedForeground }]}>{error}</Text>
          <Pressable
            testID="oldtime-retry"
            accessibilityRole="button"
            onPress={() => { setError(null); setLoading(true); webview.current?.reload(); }}
            style={({ pressed }) => [styles.retry, { backgroundColor: colors.primary, opacity: pressed ? 0.75 : 1 }]}
          >
            <Text style={{ color: colors.primaryForeground, fontWeight: '600' }}>Try again</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
  error: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 14 },
  title: { fontSize: 21, fontWeight: '600', textAlign: 'center' },
  message: { fontSize: 15, lineHeight: 22, textAlign: 'center', maxWidth: 340 },
  retry: { borderRadius: 24, paddingHorizontal: 28, paddingVertical: 14, marginTop: 6 },
});
